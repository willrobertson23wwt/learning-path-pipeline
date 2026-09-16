import {spring} from 'remotion';
import {ACCENT, FONT_STACK, MONO_STACK, SUCCESS, TERM_BAR, TERM_BG} from '../theme';

// Beat timings in SECONDS, relative to the narration audio start. Components in
// the chapter stage call useCurrentFrame() (which equals the audio frame because
// the stage Sequence starts at the lead-in offset) and gate themselves on these.
export const T = {
  titleIn: 0.3,
  titleDur: 8.2,
  motifIn: 8.7,
  motifOut: 15.5,
  editorIn: 15.0,
  editorOut: 97.6,
  rootType: 25.9,
  rootLock: 27.7,
  pwFocus: 47.0,
  keyPanelIn: 47.0,
  pwValue: 52.2,
  keygen: 67.4,
  copyid: 72.0,
  verify: 73.6,
  keyCheck: 75.1,
  pwLock: 75.8,
  portFocus: 77.3,
  portTick: 82.9,
  reloadIn: 97.8,
  reloadType: 98.6,
  sessionConnect: 103.6,
  verifyCaption: 106.0,
  end: 115.24,
};

/** Eased 0→1 ramp (smooth ease-out) starting at `atSec`. */
export const appear = (frame: number, fps: number, atSec: number, durFrames = 14) =>
  spring({frame, fps, delay: Math.round(atSec * fps), config: {damping: 200}, durationInFrames: durFrames});

/** 0→1→0 envelope: eases in at `inSec`, holds, eases out at `outSec`. */
export const fadeInOut = (frame: number, fps: number, inSec: number, outSec: number) =>
  appear(frame, fps, inSec) * (1 - appear(frame, fps, outSec, 12));

/** Characters typed so far for a type-on effect (~26 chars/sec). */
export const typedText = (full: string, frame: number, fps: number, atSec: number, cps = 26) => {
  if (frame < atSec * fps) return '';
  const n = Math.floor(((frame - atSec * fps) / fps) * cps);
  return full.slice(0, Math.max(0, n));
};

export const Cursor: React.FC<{frame: number; color?: string}> = ({frame, color = ACCENT}) => {
  const on = Math.floor(frame / 14) % 2 === 0;
  return (
    <span
      style={{
        display: 'inline-block',
        width: '0.55em',
        height: '1.05em',
        background: on ? color : 'transparent',
        verticalAlign: '-0.17em',
        marginLeft: 1,
        borderRadius: 1,
      }}
    />
  );
};

/** A dark terminal/editor window with traffic-light chrome and a title. */
export const TermWindow: React.FC<{
  title: string;
  width: number;
  titleColor?: string;
  children: React.ReactNode;
}> = ({title, width, titleColor = 'rgba(255,255,255,0.55)', children}) => {
  return (
    <div
      style={{
        width,
        borderRadius: 16,
        background: TERM_BG,
        boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          height: 52,
          background: TERM_BAR,
          display: 'flex',
          alignItems: 'center',
          padding: '0 22px',
          gap: 9,
        }}
      >
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
        ))}
        <div
          style={{
            fontFamily: MONO_STACK,
            fontSize: 22,
            color: titleColor,
            marginLeft: 16,
            letterSpacing: 0.3,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{padding: '30px 36px'}}>{children}</div>
    </div>
  );
};

/** Rounded caption pill. */
export const Pill: React.FC<{
  label: string;
  color?: string;
  bg?: string;
  progress?: number; // 0..1 enter
  icon?: React.ReactNode;
}> = ({label, color = ACCENT, bg, progress = 1, icon}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 22px',
        borderRadius: 999,
        background: bg ?? 'rgba(0,0,0,0.35)',
        border: `2px solid ${color}`,
        color,
        fontFamily: FONT_STACK,
        fontSize: 26,
        fontWeight: 700,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 14}px)`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
      }}
    >
      {icon}
      {label}
    </div>
  );
};

/** Small padlock that snaps shut (shackle drops) at `lockSec`. */
export const Padlock: React.FC<{frame: number; fps: number; lockSec: number; color?: string}> = ({
  frame,
  fps,
  lockSec,
  color = SUCCESS,
}) => {
  const p = spring({frame, fps, delay: Math.round(lockSec * fps), config: {damping: 13}, durationInFrames: 18});
  // Shackle sits raised/open (p=0) then drops and seats into the body (p=1).
  const shackleY = (1 - p) * -7;
  const shackleSkew = (1 - p) * 16;
  return (
    <svg width="30" height="34" viewBox="0 0 30 34" style={{display: 'block'}}>
      <g
        transform={`translate(0 ${shackleY}) skewX(${shackleSkew})`}
        style={{transformOrigin: '21px 12px'}}
      >
        <path d="M9 14 V10 a6 6 0 0 1 12 0 V14" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
      </g>
      <rect x="5" y="14" width="20" height="16" rx="3.5" fill={color} />
      <circle cx="15" cy="20" r="2.3" fill="#0b1626" />
      <rect x="14" y="21.5" width="2" height="5" rx="1" fill="#0b1626" />
    </svg>
  );
};

export const Check: React.FC<{size?: number; color?: string}> = ({size = 26, color = SUCCESS}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'inline-block', verticalAlign: '-0.2em'}}>
    <circle cx="12" cy="12" r="11" fill="none" stroke={color} strokeWidth="2" />
    <path d="M7 12.5 L10.5 16 L17 8.5" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
