import {interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT, DANGER, LINE} from '../theme';

const SHIELD = 'M100 22 L160 46 V108 C160 146 132 170 100 182 C68 170 40 146 40 108 V46 Z';
const CX = 100;
const CY = 104;

const layerTransform = (s: number) => `translate(${CX * (1 - s)} ${CY * (1 - s)}) scale(${s})`;

// Attack travels from off-screen to the outer shield, then stops at the middle one
const START = {x: -14, y: 26};
const IMPACT_OUTER = {x: 48, y: 68};
const IMPACT_MID = {x: 64, y: 79};
const ARROW_ANGLE = (Math.atan2(IMPACT_MID.y - START.y, IMPACT_MID.x - START.x) * 180) / Math.PI;

/**
 * Defense in depth: concentric shields; the outer layer cracks and dims at
 * beatFrame while the middle layer holds (pulses) — layers cover each other's gaps.
 */
export const ShieldLayersIcon: React.FC<{beatFrame: number}> = ({beatFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const crack = spring({frame, fps, delay: beatFrame, config: {damping: 200}, durationInFrames: 20});
  const hold = spring({frame, fps, delay: beatFrame + 14, config: {damping: 12}, durationInFrames: 24});
  const spark = spring({frame, fps, delay: beatFrame + 12, config: {damping: 200}, durationInFrames: 18});

  const approach = interpolate(frame, [beatFrame - 14, beatFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const push = interpolate(frame, [beatFrame + 4, beatFrame + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const arrowX =
    push > 0
      ? IMPACT_OUTER.x + (IMPACT_MID.x - IMPACT_OUTER.x) * push
      : START.x + (IMPACT_OUTER.x - START.x) * approach;
  const arrowY =
    push > 0
      ? IMPACT_OUTER.y + (IMPACT_MID.y - IMPACT_OUTER.y) * push
      : START.y + (IMPACT_OUTER.y - START.y) * approach;
  const arrowOpacity = interpolate(frame, [beatFrame - 14, beatFrame - 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const midScale = 0.72 + hold * 0.03;
  const midColor = interpolateColors(Math.min(1, hold), [0, 1], [LINE, ACCENT]);

  return (
    <svg viewBox="0 0 200 200" style={{width: 300, height: 300, display: 'block', margin: '0 auto'}}>
      {/* outer shield: cracks and dims */}
      <path
        d={SHIELD}
        fill="none"
        stroke={LINE}
        strokeWidth={6}
        opacity={0.95 - crack * 0.65}
        transform={layerTransform(1)}
      />
      <polyline
        points="48,60 62,78 52,96 68,114"
        fill="none"
        stroke={LINE}
        strokeWidth={4}
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={`${crack} 1`}
        opacity={crack > 0.01 ? 0.9 : 0}
      />
      {/* middle shield: holds and brightens */}
      <path d={SHIELD} fill="none" stroke={midColor} strokeWidth={8} transform={layerTransform(midScale)} />
      {/* inner shield */}
      <path d={SHIELD} fill="none" stroke={LINE} strokeWidth={6} opacity={0.8} transform={layerTransform(0.47)} />
      {/* attack arrow, stopped at the middle layer */}
      <g opacity={arrowOpacity} transform={`translate(${arrowX} ${arrowY}) rotate(${ARROW_ANGLE})`}>
        <line x1={-30} y1={0} x2={-9} y2={0} stroke={DANGER} strokeWidth={6} strokeLinecap="round" />
        <polygon points="0,0 -11,-7 -11,7" fill={DANGER} />
      </g>
      {/* impact spark where the attack is absorbed */}
      <circle
        cx={IMPACT_MID.x}
        cy={IMPACT_MID.y}
        r={4 + spark * 12}
        fill="none"
        stroke={ACCENT}
        strokeWidth={3}
        opacity={spark > 0.01 ? (1 - spark) * 0.9 : 0}
      />
    </svg>
  );
};
