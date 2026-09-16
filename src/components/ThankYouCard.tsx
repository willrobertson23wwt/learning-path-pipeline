import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT, FONT_STACK, PANEL_BG} from './theme';
import {appear} from './terminal/kit';

/**
 * The standard video close: a big centered "Thank You for Watching!" that
 * enters at `inSec` (narration-relative seconds) and holds to the end of the
 * chapter. Every video's LAST chapter renders this over its faded-back scene.
 */
export const ThankYouCard: React.FC<{inSec: number; outSec?: number}> = ({inSec, outSec}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const leave = outSec == null ? 0 : appear(frame, fps, outSec, 12);
  const p = appear(frame, fps, inSec, 22) * (1 - leave);
  const barP = appear(frame, fps, inSec + 0.45, 18);
  if (p <= 0) return null;

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          fontFamily: FONT_STACK,
          textAlign: 'center',
          transform: `translateY(${(1 - p) * 50}px)`,
          opacity: p,
          background: PANEL_BG,
          borderRadius: 24,
          padding: '58px 100px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
        }}
      >
        <div style={{fontSize: 84, fontWeight: 800, color: 'white', letterSpacing: -1.5}}>
          Thank You for Watching!
        </div>
        <div
          style={{
            height: 6,
            width: barP * 340,
            background: ACCENT,
            borderRadius: 3,
            margin: '26px auto 0',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
