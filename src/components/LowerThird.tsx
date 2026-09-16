import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT, FONT_STACK, PANEL_BG} from './theme';

export const LowerThird: React.FC<{text: string; subtitle?: string}> = ({text, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 22});
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames - 2], [0, 90], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [durationInFrames - 12, durationInFrames - 2], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        bottom: 110,
        fontFamily: FONT_STACK,
        transform: `translateX(${(1 - enter) * -120}px) translateY(${exit}px)`,
        opacity: enter * exitOpacity,
        display: 'flex',
        alignItems: 'stretch',
        background: PANEL_BG,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 16px 50px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{width: 10, background: ACCENT}} />
      <div style={{padding: '26px 44px 26px 34px'}}>
        <div style={{fontSize: 46, fontWeight: 700, color: 'white'}}>{text}</div>
        {subtitle ? (
          <div style={{fontSize: 28, fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginTop: 6}}>
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
};
