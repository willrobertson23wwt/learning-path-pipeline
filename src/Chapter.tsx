import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {BulletList} from './components/BulletList';
import {LowerThird} from './components/LowerThird';
import {PrinciplePanel} from './components/PrinciplePanel';
import {TitleCard} from './components/TitleCard';
import {Waveform} from './components/Waveform';
import {FONT_STACK} from './components/theme';
import {ChapterTimeline, Cue} from './types';

// Transparent lead-in and tail (seconds) added to each chapter so the clip has
// handles to trim and cross-fade in Premiere. Also extends the duration in Root.
// Set to 0: clips now start on frame 0 (audio + graphics aligned) with no padding,
// since transitions are handled in Premiere directly.
export const BUFFER_SECONDS = 0;

export interface ChapterProps extends Record<string, unknown> {
  timeline: ChapterTimeline;
  /** true = no background, no audio track — for ProRes 4444 overlay renders */
  transparent: boolean;
  /** Render only these cue types (e.g. ["lowerThird"]) — null renders everything */
  layers: string[] | null;
}

const renderCue = (cue: Cue, audioSrc: string) => {
  switch (cue.type) {
    case 'title':
      return <TitleCard text={cue.text ?? ''} subtitle={cue.subtitle} />;
    case 'lowerThird':
      return <LowerThird text={cue.text ?? ''} subtitle={cue.subtitle} />;
    case 'bullets':
      return <BulletList heading={cue.heading} items={cue.items ?? []} />;
    case 'waveform':
      return <Waveform src={audioSrc} startOffsetSeconds={cue.start} />;
    case 'principle':
      return (
        <PrinciplePanel
          text={cue.text ?? ''}
          subtitle={cue.subtitle}
          icon={cue.icon ?? 'leastPrivilege'}
          slideAt={cue.slideAt}
        />
      );
    default:
      return null;
  }
};

export const Chapter: React.FC<ChapterProps> = ({timeline, transparent, layers}) => {
  const {fps} = useVideoConfig();
  const audioSrc = staticFile(timeline.audio);
  const cues = timeline.cues.filter((c) => !layers || layers.includes(c.type));
  // Shift audio and every cue by the lead-in so the clip opens (and ends) on
  // empty frames the editor can trim into.
  const offset = Math.round(BUFFER_SECONDS * fps);

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT_STACK,
        background: transparent
          ? undefined
          : 'linear-gradient(160deg, #0B1220 0%, #101C30 60%, #0D2238 100%)',
      }}
    >
      {transparent ? null : (
        <Sequence from={offset}>
          <Audio src={audioSrc} />
        </Sequence>
      )}
      {cues.map((cue, i) => (
        <Sequence
          key={i}
          from={offset + Math.round(cue.start * fps)}
          durationInFrames={Math.round(cue.duration * fps)}
          name={`${cue.type}: ${cue.text ?? cue.heading ?? timeline.audio}`}
        >
          {renderCue(cue, audioSrc)}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
