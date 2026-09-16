import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT, FONT_STACK, PANEL_BG} from './theme';

export const TitleCard: React.FC<{text: string; subtitle?: string}> = ({text, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 25});
  const exit = interpolate(frame, [durationInFrames - 14, durationInFrames - 2], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const barWidth = interpolate(spring({frame, fps, delay: 8, config: {damping: 200}}), [0, 1], [0, 380]);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: exit}}>
      <div
        style={{
          fontFamily: FONT_STACK,
          textAlign: 'center',
          transform: `translateY(${(1 - enter) * 60}px)`,
          opacity: enter,
          background: PANEL_BG,
          borderRadius: 24,
          padding: '64px 110px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
        }}
      >
        <div style={{fontSize: 96, fontWeight: 800, color: 'white', letterSpacing: -2}}>{text}</div>
        <div style={{height: 6, width: barWidth, background: ACCENT, borderRadius: 3, margin: '28px auto'}} />
        {subtitle ? (
          <div style={{fontSize: 38, fontWeight: 500, color: 'rgba(255,255,255,0.75)'}}>{subtitle}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
