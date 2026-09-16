import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT, LINE} from '../theme';

type Seg = [number, number, number, number];

// Room walls drawn as segments, leaving gaps for the openings
const WALLS: Seg[] = [
  [34, 34, 70, 34],
  [94, 34, 120, 34],
  [140, 34, 166, 34],
  [166, 34, 166, 70],
  [166, 92, 166, 120],
  [166, 140, 166, 166],
  [34, 34, 34, 80],
  [34, 104, 34, 166],
  [34, 166, 86, 166],
  [114, 166, 166, 166],
];

// Extra doors/windows that seal shut one by one after the beat
const OPENINGS: Seg[] = [
  [70, 34, 94, 34],
  [120, 34, 140, 34],
  [166, 70, 166, 92],
  [166, 120, 166, 140],
  [34, 80, 34, 104],
];

const DOOR: Seg = [86, 166, 114, 166]; // the one that stays

const SEAL_STAGGER = 10;
const SEAL_DURATION = 14;

/**
 * Minimize attack surface: a room with many openings; after beatFrame the
 * openings seal shut one at a time, leaving a single highlighted door.
 */
export const RoomIcon: React.FC<{beatFrame: number}> = ({beatFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const glowDelay = beatFrame + OPENINGS.length * SEAL_STAGGER + 8;
  const glow = spring({frame, fps, delay: glowDelay, config: {damping: 200}, durationInFrames: 20});

  return (
    <svg viewBox="0 0 200 200" style={{width: 300, height: 300, display: 'block', margin: '0 auto'}}>
      {WALLS.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE} strokeWidth={7} strokeLinecap="square" />
      ))}
      {OPENINGS.map(([x1, y1, x2, y2], i) => {
        const seal = spring({
          frame,
          fps,
          delay: beatFrame + i * SEAL_STAGGER,
          config: {damping: 200},
          durationInFrames: SEAL_DURATION,
        });
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        return (
          <g key={i}>
            {/* open: faint accent marker */}
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={ACCENT}
              strokeWidth={5}
              strokeDasharray="4 6"
              opacity={0.55 * (1 - seal)}
            />
            {/* sealing wall grows out from the middle of the gap */}
            {seal > 0.01 ? (
              <line
                x1={mx - (mx - x1) * seal}
                y1={my - (my - y1) * seal}
                x2={mx + (x2 - mx) * seal}
                y2={my + (y2 - my) * seal}
                stroke={LINE}
                strokeWidth={7}
                strokeLinecap="square"
              />
            ) : null}
          </g>
        );
      })}
      {/* the one remaining door */}
      <line
        x1={DOOR[0]}
        y1={DOOR[1]}
        x2={DOOR[2]}
        y2={DOOR[3]}
        stroke={ACCENT}
        strokeWidth={7 + glow * 3}
        strokeLinecap="square"
      />
      {/* door swing arc, revealed with the glow */}
      <path
        d="M 86 166 A 28 28 0 0 1 114 138"
        fill="none"
        stroke={ACCENT}
        strokeWidth={3}
        strokeDasharray="5 6"
        opacity={glow * 0.7}
      />
    </svg>
  );
};
