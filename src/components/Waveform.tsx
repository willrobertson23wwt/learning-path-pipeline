import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT} from './theme';

const BARS = 48;

/**
 * Voice-reactive bar visualizer. `startOffsetSeconds` converts the
 * sequence-relative frame back to the absolute audio position so the
 * bars stay in sync no matter where the cue is placed.
 */
export const Waveform: React.FC<{src: string; startOffsetSeconds: number}> = ({
  src,
  startOffsetSeconds,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const audioData = useAudioData(src);

  if (!audioData) {
    return null;
  }

  const frequencies = visualizeAudio({
    fps,
    frame: frame + Math.round(startOffsetSeconds * fps),
    audioData,
    numberOfSamples: 128,
  });

  // Speech energy lives in the lower bands — keep those and skip the near-DC bin.
  const bars = frequencies.slice(1, BARS + 1);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      {bars.map((v, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 6 + Math.min(1, Math.sqrt(v) * 2.2) * 78,
            borderRadius: 5,
            background: ACCENT,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
};
