import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {z} from 'zod';
import {BUFFER_SECONDS} from './constants';
import {DupScene} from './components/example-ch1/DupScene';
import {DefineFirstScene} from './components/example-ch1/DefineFirstScene';
import {RoadmapScene} from './components/example-ch1/RoadmapScene';
import {DEFAULT_STAGE_CENTER_Y, T1} from './components/example-ch1/kit1';
import {LayoutProvider} from './components/layout';
import {PaperBackdrop, TransitionBackdrop} from './components/Backdrop';
import {TitleCard} from './components/TitleCard';
import {FONT_STACK} from './components/theme';

export const EXAMPLE_CH1_AUDIO = 'chapters/example-ch1/narration.mp3';

// Schema → editable controls in the Remotion Studio props panel.
export const exampleCh1Schema = z.object({
  transparent: z.boolean().describe('Transparent overlay (for Premiere)'),
  stageCenterY: z.number().min(360).max(720).step(2).describe('Scene stage — vertical center'),
  showAnatomy: z.boolean().describe('Function anatomy legend (name · parentheses · body)'),
  showOncePill: z.boolean().describe('“define once · call everywhere” pill'),
  showOrderPill: z.boolean().describe('“define first, call after” pill'),
  showRoadmap: z.boolean().describe('Closing module roadmap'),
});

export type ExampleCh1Props = z.infer<typeof exampleCh1Schema>;

export const exampleCh1Defaults = {
  stageCenterY: DEFAULT_STAGE_CENTER_Y,
  showAnatomy: true,
  showOncePill: true,
  showOrderPill: true,
  showRoadmap: true,
};

export const ExampleCh1: React.FC<ExampleCh1Props> = ({
  transparent,
  stageCenterY,
  showAnatomy,
  showOncePill,
  showOrderPill,
  showRoadmap,
}) => {
  const {fps} = useVideoConfig();
  const offset = Math.round(BUFFER_SECONDS * fps);

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT_STACK,
        background: transparent ? undefined : '#0B1220',
      }}
    >
      {transparent ? null : <PaperBackdrop />}
      {transparent ? null : (
        <Sequence from={offset}>
          <Audio src={staticFile(EXAMPLE_CH1_AUDIO)} />
        </Sequence>
      )}

      {/* Title intro */}
      <Sequence from={offset + Math.round(T1.titleIn * fps)} durationInFrames={Math.round(T1.titleDur * fps)}>
        {transparent ? null : <TransitionBackdrop durationInFrames={Math.round(T1.titleDur * fps)} fadeInFrames={0} />}
        <TitleCard text="From Repeated Blocks to Functions" subtitle="Chapter 1 · Functions and Return Values" />
      </Sequence>

      {/* Main stage — local frame == audio frame, so scenes gate on T1 (seconds). */}
      <Sequence from={offset}>
        <LayoutProvider
          values={{
            stageCenterY,
            showAnatomy,
            showOncePill,
            showOrderPill,
            showRoadmap,
          }}
        >
          <DupScene />
          <DefineFirstScene />
          <RoadmapScene />
        </LayoutProvider>
      </Sequence>
    </AbsoluteFill>
  );
};
