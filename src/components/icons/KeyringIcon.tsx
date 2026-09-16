import {interpolateColors, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT, LINE} from '../theme';

const ANGLES = [-44, -22, 0, 22, 44];
const KEPT = 2; // the center key survives the reduction

/**
 * Least privilege: a full keyring dims down to a single key —
 * "minimum access" as a deliberate reduction. The dim fires at beatFrame.
 */
export const KeyringIcon: React.FC<{beatFrame: number}> = ({beatFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const reduce = spring({frame, fps, delay: beatFrame, config: {damping: 200}, durationInFrames: 26});

  return (
    <svg viewBox="0 0 200 160" style={{width: 320, height: 256, display: 'block', margin: '0 auto'}}>
      <circle cx={100} cy={46} r={24} fill="none" stroke={LINE} strokeWidth={7} />
      {ANGLES.map((angle, i) => {
        const kept = i === KEPT;
        const opacity = kept ? 1 : 1 - reduce * 0.85;
        const scale = kept ? 1 + reduce * 0.16 : 1 - reduce * 0.08;
        const color = kept ? interpolateColors(reduce, [0, 1], [LINE, ACCENT]) : LINE;
        return (
          <g key={i} opacity={opacity} transform={`rotate(${angle} 100 46)`}>
            <g transform={`translate(100 70) scale(${scale})`} stroke={color} strokeWidth={6} strokeLinecap="round">
              <circle cx={0} cy={8} r={9} fill="none" />
              <line x1={0} y1={17} x2={0} y2={58} />
              <line x1={0} y1={44} x2={11} y2={44} />
              <line x1={0} y1={56} x2={9} y2={56} />
            </g>
          </g>
        );
      })}
    </svg>
  );
};
