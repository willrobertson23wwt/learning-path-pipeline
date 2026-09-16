import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {CalculateMetadataFunction, Composition, staticFile} from 'remotion';
import {BUFFER_SECONDS, FPS} from './constants';
import {EXAMPLE_CH1_AUDIO, ExampleCh1, exampleCh1Defaults, exampleCh1Schema, ExampleCh1Props} from './ExampleCh1';

// Duration always matches the chapter's audio file — no manual math needed.
// `tailSeconds` adds the END_BUFFER hold past the narration (foreground fades,
// backdrop stays) for chapters that implement the end-buffer convention:
// pass END_BUFFER_SECONDS from ./constants as the second argument.
export const audioMetadata =
  <T extends Record<string, unknown>>(audio: string, tailSeconds = 0): CalculateMetadataFunction<T> =>
  async () => {
    const seconds = await getAudioDurationInSeconds(staticFile(audio));
    return {
      durationInFrames:
        Math.ceil(seconds * FPS) + 2 * Math.round(BUFFER_SECONDS * FPS) + Math.round(tailSeconds * FPS),
    };
  };

const calculateExampleCh1 = audioMetadata<ExampleCh1Props>(EXAMPLE_CH1_AUDIO);

// Worked example only. Course chapters register here as `/video` builds them,
// as `<Prefix>V<N>Ch<M>` + `<Prefix>V<N>Ch<M>-Overlay` pairs following this shape.
// Delete the ExampleCh1 pair once the course has chapters of its own.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ExampleCh1"
        component={ExampleCh1}
        schema={exampleCh1Schema}
        calculateMetadata={calculateExampleCh1}
        durationInFrames={1}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{transparent: false, ...exampleCh1Defaults}}
      />
      <Composition
        id="ExampleCh1-Overlay"
        component={ExampleCh1}
        schema={exampleCh1Schema}
        calculateMetadata={calculateExampleCh1}
        durationInFrames={1}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{transparent: true, ...exampleCh1Defaults}}
      />
    </>
  );
};
