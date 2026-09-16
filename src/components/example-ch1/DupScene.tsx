import {useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT, DANGER, LINE, MONO_STACK, SUCCESS, WARNING} from '../theme';
import {appear, Cursor, Pill, TermWindow, typedText} from '../terminal/kit';
import {useFlag, useNum} from '../layout';
import {DEFAULT_STAGE_CENTER_Y, SCENES, sceneFade, T1} from './kit1';

const FILE_FONT = 22;
const ROW_H = 30;

// The repeated 5-line motif: dir check + timestamped log message.
const blockRows = (msg: string) => [
  'if [ ! -d "$LOG_DIR" ]; then',
  '  echo "log dir missing" >&2',
  '  exit 1',
  'fi',
  `echo "$(date '+%F %T') ${msg}" >> "$LOG"`,
];

const PRE_ROWS = ['#!/bin/bash', 'LOG="/var/log/cleanup.log"'];
const MID_1 = ['find "$TMP_DIR" -name \'*.tmp\' -delete'];
const MID_2 = ['gzip -q "$LOG_DIR"/archive-*.log'];
const BLOCKS = [blockRows('starting cleanup'), blockRows('tmp files removed'), blockRows('cleanup complete')];

const FileRow: React.FC<{text: string; dim?: boolean; enter: number}> = ({text, dim, enter}) => (
  <div
    style={{
      fontFamily: MONO_STACK,
      fontSize: FILE_FONT,
      height: ROW_H,
      lineHeight: `${ROW_H}px`,
      whiteSpace: 'pre',
      color: LINE,
      opacity: (dim ? 0.45 : 0.92) * enter,
      transform: `translateY(${(1 - enter) * 8}px)`,
    }}
  >
    {text}
  </div>
);

/** One duplicated block: rows + animated amber highlight + a right-side badge. */
const DupBlock: React.FC<{
  rows: string[];
  index: 1 | 2 | 3;
  enter: number;
}> = ({rows, index, enter}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;
  const hlAt = index === 1 ? T1.hl1 : index === 2 ? T1.hl2 : T1.hl3;
  const hl = appear(frame, fps, hlAt, 12);
  const edited = index === 1 && sec >= T1.editBadge;
  const stale = index !== 1 && sec >= T1.staleBadges;
  const staleP = appear(frame, fps, T1.staleBadges + (index === 3 ? 0.5 : 0), 12);
  const editP = appear(frame, fps, T1.editBadge, 12);

  const badge = edited
    ? {label: '✎ edited', color: ACCENT, p: editP}
    : stale
      ? {label: '✕ stale copy', color: DANGER, p: staleP}
      : hl > 0
        ? {label: `×${index}`, color: WARNING, p: hl}
        : null;

  return (
    <div style={{position: 'relative', opacity: stale ? 1 - staleP * 0.5 : 1}}>
      <div
        style={{
          position: 'absolute',
          inset: '-3px -14px',
          borderRadius: 10,
          background: `rgba(232,161,58,${0.13 * hl})`,
          border: `2px solid rgba(232,161,58,${0.65 * hl})`,
        }}
      />
      {rows.map((r) => (
        <FileRow key={r} text={r} enter={enter} />
      ))}
      {badge ? (
        <div
          style={{
            position: 'absolute',
            right: 4,
            top: '50%',
            transform: `translate(0, -50%) translateY(${(1 - badge.p) * 10}px)`,
            opacity: badge.p,
            fontFamily: MONO_STACK,
            fontSize: 24,
            fontWeight: 800,
            color: badge.color,
            background: 'rgba(0,0,0,0.45)',
            border: `2px solid ${badge.color}`,
            borderRadius: 999,
            padding: '8px 18px',
            whiteSpace: 'nowrap',
          }}
        >
          {badge.label}
        </div>
      ) : null}
    </div>
  );
};

/** The typed-on function with anatomy token colors. */
const FunctionView: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;
  const showAnatomy = useFlag('showAnatomy', true);

  const nameOn = appear(frame, fps, T1.pillName, 12);
  const parensOn = appear(frame, fps, T1.pillParens, 12);
  const bodyOn = appear(frame, fps, T1.pillBody, 12);

  const l1 = typedText('log_msg() {', frame, fps, T1.fnType, 20);
  const l2 = typedText(`  echo "$(date '+%F %T') $1" >> "$LOG_FILE"`, frame, fps, T1.fnType + 0.75, 30);
  const l3 = typedText('}', frame, fps, T1.fnType + 2.4, 20);
  const typing = sec >= T1.fnType && l3.length < 1;

  // Line 1 sliced into name / parens / brace so anatomy colors can light per beat.
  const n = l1.length;
  const tName = l1.slice(0, Math.min(n, 7));
  const tParens = n > 7 ? l1.slice(7, Math.min(n, 9)) : '';
  const tBrace = n > 9 ? l1.slice(9) : '';

  const code = (s: number) => ({fontFamily: MONO_STACK, fontSize: s, lineHeight: 1.5, whiteSpace: 'pre' as const, color: LINE});

  const legend: {label: string; color: string; p: number}[] = [
    {label: 'name', color: ACCENT, p: nameOn},
    {label: 'parentheses ()', color: WARNING, p: parensOn},
    {label: 'body { … }', color: SUCCESS, p: bodyOn},
  ];

  // Call sites — appear staggered, then each lights in sequence.
  const calls = ['log_msg "starting cleanup"', 'log_msg "tmp files removed"', 'log_msg "cleanup complete"'];

  return (
    <div>
      <div style={code(32)}>
        <span style={{color: nameOn > 0 ? ACCENT : LINE, fontWeight: 700}}>{tName}</span>
        <span style={{color: parensOn > 0 ? WARNING : LINE, fontWeight: 700}}>{tParens}</span>
        <span style={{color: bodyOn > 0 ? SUCCESS : LINE}}>{tBrace}</span>
        {typing && l2.length === 0 ? <Cursor frame={frame} /> : null}
      </div>
      <div style={code(32)}>
        <span style={{color: LINE}}>{l2}</span>
        {typing && l2.length > 0 && l3.length === 0 ? <Cursor frame={frame} /> : null}
      </div>
      <div style={code(32)}>
        <span style={{color: bodyOn > 0 ? SUCCESS : LINE}}>{l3}</span>
      </div>

      {showAnatomy ? (
        <div style={{display: 'flex', gap: 22, height: 52, alignItems: 'center', marginTop: 10}}>
          {legend.map((l) => (
            <span key={l.label} style={{opacity: l.p, transform: `translateY(${(1 - l.p) * 8}px)`}}>
              <Pill label={l.label} color={l.color} bg="rgba(0,0,0,0.4)" />
            </span>
          ))}
        </div>
      ) : null}

      <div
        style={{
          marginTop: 20,
          borderTop: `1px solid rgba(255,255,255,${0.12 * appear(frame, fps, T1.callsIn, 12)})`,
          paddingTop: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {calls.map((c, i) => {
          const p = appear(frame, fps, T1.callsIn + i * 0.9, 12);
          const lit = appear(frame, fps, T1.callLight + i * 0.7, 10);
          return (
            <div
              key={c}
              style={{
                ...code(28),
                display: 'flex',
                alignItems: 'center',
                opacity: p * (0.75 + 0.25 * lit),
                transform: `translateY(${(1 - p) * 10}px)`,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 26,
                  borderRadius: 3,
                  background: ACCENT,
                  opacity: lit,
                  marginRight: 14,
                }}
              />
              <span style={{color: ACCENT, fontWeight: 700}}>log_msg</span>
              <span style={{color: LINE}}>{c.slice(7)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fade = sceneFade(frame, fps, SCENES.A);
  const centerY = useNum('stageCenterY', DEFAULT_STAGE_CENTER_Y);
  const showOncePill = useFlag('showOncePill', true);
  if (fade <= 0) return null;

  const fileEnter = appear(frame, fps, T1.fileIn, 18);
  const collapseP = appear(frame, fps, T1.collapse, 20);
  const fnP = appear(frame, fps, T1.fnType - 0.4, 16);
  const oncePillP = appear(frame, fps, T1.oncePill, 14);

  return (
    <div style={{position: 'absolute', inset: 0, opacity: fade}}>
      {/* The wall of duplicated code — collapses when "functions fix that" lands */}
      {collapseP < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: centerY,
            transform: `translate(-50%, -50%) scaleY(${1 - collapseP * 0.92})`,
            opacity: (1 - collapseP) * fileEnter,
          }}
        >
          <TermWindow title="cleanup.sh" width={1060}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 0}}>
              {PRE_ROWS.map((r, i) => (
                <FileRow key={r} text={r} dim enter={appear(frame, fps, T1.fileIn + i * 0.08, 12)} />
              ))}
              <div style={{height: 10}} />
              <DupBlock rows={BLOCKS[0]} index={1} enter={appear(frame, fps, T1.fileIn + 0.2, 12)} />
              <div style={{height: 10}} />
              {MID_1.map((r) => (
                <FileRow key={r} text={r} dim enter={appear(frame, fps, T1.fileIn + 0.7, 12)} />
              ))}
              <div style={{height: 10}} />
              <DupBlock rows={BLOCKS[1]} index={2} enter={appear(frame, fps, T1.fileIn + 0.9, 12)} />
              <div style={{height: 10}} />
              {MID_2.map((r) => (
                <FileRow key={r} text={r} dim enter={appear(frame, fps, T1.fileIn + 1.3, 12)} />
              ))}
              <div style={{height: 10}} />
              <DupBlock rows={BLOCKS[2]} index={3} enter={appear(frame, fps, T1.fileIn + 1.5, 12)} />
            </div>
          </TermWindow>
        </div>
      ) : null}

      {/* The single function it collapses into */}
      {fnP > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: centerY,
            transform: `translate(-50%, -50%) translateY(${(1 - fnP) * 24}px)`,
            opacity: fnP,
          }}
        >
          <TermWindow title="cleanup.sh — one function" width={1060}>
            <FunctionView />
          </TermWindow>
          {showOncePill ? (
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 26, opacity: oncePillP}}>
              <Pill label="define once · call everywhere" color={ACCENT} progress={oncePillP} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
