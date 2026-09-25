import {Audio, Sequence, interpolate, staticFile} from 'remotion';
import {AUDIO, RAMP_FRAMES, buildSegments} from './kit';

const SEGMENTS = buildSegments();

// Narration split at every beats.json hold: one <Audio> per segment, each cut
// inside measured silence, with a 2-frame volume ramp either side of a cut.
// Voice only: music and effects come from MixTrack (mix.json).
export const NarrationTrack: React.FC = () => (
  <>
    {SEGMENTS.map((s) => (
      <Sequence key={s.name} from={s.from} durationInFrames={s.durationInFrames} name={`narration to ${s.name}`}>
        <Audio
          src={staticFile(AUDIO)}
          trimBefore={s.trimBefore}
          volume={(f) => {
            const rIn = s.rampIn
              ? interpolate(f, [0, RAMP_FRAMES], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
              : 1;
            const rOut = s.rampOut
              ? interpolate(f, [s.durationInFrames - RAMP_FRAMES, s.durationInFrames], [1, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })
              : 1;
            return Math.min(rIn, rOut);
          }}
        />
      </Sequence>
    ))}
  </>
);
