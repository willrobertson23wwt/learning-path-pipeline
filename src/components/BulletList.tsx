import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BulletItem} from '../types';
import {ACCENT, FONT_STACK, PANEL_BG} from './theme';

// Right-hand member of the centered pair (panel is on the left). Vertically
// centered via the outer wrapper's translateY(-50%).
const BULLET_LEFT = 950;
const BULLET_WIDTH = 760;

export const BulletList: React.FC<{heading?: string; items: BulletItem[]}> = ({heading, items}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Rise/fade in, then hold — no exit fade; the panel stays until the scene cuts.
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 20});

  return (
    <div
      style={{
        position: 'absolute',
        left: BULLET_LEFT,
        top: '50%',
        width: BULLET_WIDTH,
        transform: 'translateY(-50%)',
      }}
    >
      <div
        style={{
          fontFamily: FONT_STACK,
          background: PANEL_BG,
          borderRadius: 18,
          padding: '44px 52px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
          transform: `translateY(${(1 - enter) * 30}px)`,
          opacity: enter,
        }}
      >
        {heading ? (
        <div
          style={{
            fontSize: 42,
            fontWeight: 800,
            color: 'white',
            borderBottom: `4px solid ${ACCENT}`,
            paddingBottom: 18,
            marginBottom: 28,
          }}
        >
          {heading}
        </div>
      ) : null}
      {items.map((item, i) => {
        const itemSpring = spring({
          frame,
          fps,
          delay: Math.round(item.at * fps),
          config: {damping: 200},
          durationInFrames: 18,
        });
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 22,
              marginBottom: 22,
              opacity: itemSpring,
              transform: `translateX(${(1 - itemSpring) * 40}px)`,
            }}
          >
            <div style={{color: ACCENT, fontSize: 34, fontWeight: 800}}>{i + 1}</div>
            <div style={{fontSize: 34, fontWeight: 500, color: 'rgba(255,255,255,0.92)', lineHeight: 1.35}}>
              {item.text}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};
