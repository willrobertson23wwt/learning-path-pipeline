// Manim-first rebuild of li-v6-ch1 from the fresh shot list
// (out/li-v6-ch1-fresh/design.md, "Engine plan"): Manim draws every visible
// element, including the title and the tail fade, in one BeatScene over the
// whole composition. This composition is the wrapper: the narration split at
// the beats.json holds, the course backdrops (the still lesson ground and the
// title light, src/components/CourseBackdrop.tsx), and the Manim layer's
// placement. Tunables inside the layer live in
// manim/li-v6-ch1/layout.json, not here.
import {AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {CourseLessonBackdrop, CourseTitleBackdrop} from './components/CourseBackdrop';
import {Mix, MixTrack} from './components/MixTrack';
import mixJson from '../public/chapters/li-v6-ch1/mix.json';
import mixBedJson from '../public/chapters/li-v6-ch1/mix.bed.json';
import {LayoutProvider, useFlag, useNum} from './components/layout';
import {GuardedManimLayer} from './components/li-v6-ch1/GuardedManimLayer';
import {NarrationTrack} from './components/li-v6-ch1/NarrationTrack';
import {
  AUDIO,
  B,
  COMP_FRAMES,
  DEFAULT_MANIM_SCALE,
  DEFAULT_MANIM_START_OFFSET_FRAMES,
  DEFAULT_MANIM_X,
  DEFAULT_MANIM_Y,
  DEFAULT_SHOW_MANIM,
  LOOP_FADE_SEC,
  MANIM_SRC,
} from './components/li-v6-ch1/kit';

export const LI_V6_CH1_AUDIO_MANIM = AUDIO;

// Music and effects from the sound engineer (courses/linux-intermediate/sound/li-v6.md).
const MIX = mixJson as unknown as Mix;
const MIX_BED = mixBedJson as unknown as Mix; // lifts off, for the bed-only stem
export const liV6Ch1ManimFrames = COMP_FRAMES;

export const liV6Ch1ManimSchema = z.object({
  transparent: z.boolean().describe('Transparent overlay (for Premiere)'),
  showManim: z.boolean().describe('Show the Manim layer'),
  manimX: z.number().min(-200).max(200).step(1).describe('Manim layer: x offset (px)'),
  manimY: z.number().min(-200).max(200).step(1).describe('Manim layer: y offset (px)'),
  manimScale: z.number().min(0.8).max(1.2).step(0.01).describe('Manim layer: scale'),
  manimStartOffsetFrames: z
    .number()
    .min(-30)
    .max(30)
    .step(1)
    .describe('Manim layer: start offset (frames); timing inside it lives in manim/li-v6-ch1/layout.json'),
  playNarration: z.boolean().describe('Audio: narration'),
  playMusic: z.boolean().describe('Audio: music bed'),
  playSfx: z.boolean().describe('Audio: sound effects'),
  musicLifts: z.boolean().describe('Audio: music lifts in holds (off only for the bed stem)'),
});

export type LiV6Ch1ManimProps = z.infer<typeof liV6Ch1ManimSchema>;

export const liV6Ch1ManimDefaults = {
  showManim: DEFAULT_SHOW_MANIM,
  manimX: DEFAULT_MANIM_X,
  manimY: DEFAULT_MANIM_Y,
  manimScale: DEFAULT_MANIM_SCALE,
  manimStartOffsetFrames: DEFAULT_MANIM_START_OFFSET_FRAMES,
  playNarration: true,
  playMusic: true,
  playSfx: true,
  musicLifts: true,
};

export const LiV6Ch1Manim: React.FC<LiV6Ch1ManimProps> = (props) => (
  <AbsoluteFill>
    {props.transparent ? null : <CourseLessonBackdrop />}
    {/* The title light leaves on the title's own fade (loopOut = titleOut, same curve). */}
    {props.transparent ? null : <CourseTitleBackdrop fadeStartSec={B.loopOut} fadeSec={LOOP_FADE_SEC} />}
    <LayoutProvider values={props}>
      <Stage />
    </LayoutProvider>
    {props.playNarration ? <NarrationTrack /> : null}
    <MixTrack
      mix={{
        music: props.playMusic ? (props.musicLifts ? MIX.music : MIX_BED.music) : [],
        sfx: props.playSfx ? MIX.sfx : [],
      }}
    />
  </AbsoluteFill>
);

const Stage: React.FC = () => {
  const show = useFlag('showManim', DEFAULT_SHOW_MANIM);
  const x = useNum('manimX', DEFAULT_MANIM_X);
  const y = useNum('manimY', DEFAULT_MANIM_Y);
  const scale = useNum('manimScale', DEFAULT_MANIM_SCALE);
  const offsetFrames = useNum('manimStartOffsetFrames', DEFAULT_MANIM_START_OFFSET_FRAMES);
  if (!show) return null;
  return (
    <GuardedManimLayer
      src={MANIM_SRC}
      start={0}
      end={B.end}
      offsetFrames={Math.round(offsetFrames)}
      x={x}
      y={y}
      scale={scale}
    />
  );
};
