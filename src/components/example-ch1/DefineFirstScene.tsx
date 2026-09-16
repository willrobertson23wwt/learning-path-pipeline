import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT, DANGER, LINE, MONO_STACK, SUCCESS} from '../theme';
import {appear, Check, Pill, TermWindow} from '../terminal/kit';
import {useFlag, useNum} from '../layout';
import {DEFAULT_STAGE_CENTER_Y, SCENES, sceneFade, T1} from './kit1';

const ROW_H = 56;

const CallRow: React.FC = () => (
  <span style={{fontFamily: MONO_STACK, fontSize: 30, whiteSpace: 'pre', color: LINE}}>
    <span style={{color: ACCENT, fontWeight: 700}}>log_msg</span> "starting cleanup"
  </span>
);

const DefRow: React.FC = () => (
  <span style={{fontFamily: MONO_STACK, fontSize: 30, whiteSpace: 'pre', color: LINE}}>
    <span style={{color: ACCENT, fontWeight: 700}}>log_msg</span>
    {'() { echo "$(date) $1" >> "$LOG"; }'}
  </span>
);

export const DefineFirstScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fade = sceneFade(frame, fps, SCENES.B);
  const centerY = useNum('stageCenterY', DEFAULT_STAGE_CENTER_Y);
  const showOrderPill = useFlag('showOrderPill', true);
  if (fade <= 0) return null;

  const arrowP = appear(frame, fps, T1.readArrow, 16);
  const errP = appear(frame, fps, T1.errLine, 12);
  const swapP = appear(frame, fps, T1.swap, 20);
  const okP = appear(frame, fps, T1.okLine, 12);
  const pillP = appear(frame, fps, T1.orderPill, 14);

  // Rows swap vertical slots: the call starts on line 1, the definition on line 2.
  const callY = interpolate(swapP, [0, 1], [0, ROW_H]);
  const defY = interpolate(swapP, [0, 1], [ROW_H, 0]);
  const arrowH = 150;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: centerY,
        transform: 'translate(-50%, -50%)',
        opacity: fade,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
        {/* "bash reads top to bottom" arrow */}
        <div style={{opacity: arrowP, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: 150}}>
          <div style={{fontSize: 22, fontWeight: 600, color: 'rgba(255,255,255,0.75)', textAlign: 'center'}}>
            bash reads
            <br />
            top to bottom
          </div>
          <svg width="24" height={arrowH} viewBox={`0 0 24 ${arrowH}`}>
            <line x1="12" y1="4" x2="12" y2={arrowH * arrowP - 14} stroke={ACCENT} strokeWidth="3.4" strokeLinecap="round" />
            <path
              d={`M4 ${arrowH * arrowP - 14} L12 ${arrowH * arrowP - 2} L20 ${arrowH * arrowP - 14}`}
              fill="none"
              stroke={ACCENT}
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <TermWindow title="cleanup.sh — order matters" width={960}>
            <div style={{display: 'flex', gap: 24}}>
              {/* Fixed line-number gutter — the lines swap, the order stays */}
              <div style={{display: 'flex', flexDirection: 'column'}}>
                {['1', '2'].map((n) => (
                  <div
                    key={n}
                    style={{
                      height: ROW_H,
                      lineHeight: `${ROW_H}px`,
                      fontFamily: MONO_STACK,
                      fontSize: 26,
                      color: 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
              <div style={{position: 'relative', height: ROW_H * 2, flex: 1}}>
                <div style={{position: 'absolute', top: callY, height: ROW_H, display: 'flex', alignItems: 'center'}}>
                  <CallRow />
                </div>
                <div style={{position: 'absolute', top: defY, height: ROW_H, display: 'flex', alignItems: 'center'}}>
                  <DefRow />
                </div>
              </div>
            </div>

            {/* Outcome line: command-not-found before the swap, a clean run after */}
            <div style={{height: 54, marginTop: 16, display: 'flex', alignItems: 'center', gap: 16}}>
              {swapP < 0.5 ? (
                <span
                  style={{
                    fontFamily: MONO_STACK,
                    fontSize: 27,
                    color: DANGER,
                    opacity: errP * (1 - swapP * 2),
                    transform: `translateY(${(1 - errP) * 8}px)`,
                  }}
                >
                  bash: log_msg: command not found
                </span>
              ) : (
                <span style={{display: 'flex', alignItems: 'center', gap: 14, opacity: okP}}>
                  <Check size={30} color={SUCCESS} />
                  <span style={{fontFamily: MONO_STACK, fontSize: 27, color: SUCCESS}}>
                    defined first — the call just works
                  </span>
                </span>
              )}
            </div>
          </TermWindow>

          {showOrderPill ? (
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 28, opacity: pillP}}>
              <Pill label="define first, call after" color={ACCENT} progress={pillP} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
