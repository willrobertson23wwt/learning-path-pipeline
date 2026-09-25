import {Audio, Sequence, staticFile, useVideoConfig} from 'remotion';

// The music bed and sound effects for one video, from the sound engineer's
// mix file (public/chapters/<id>/mix.json, imported by the composition). Narration stays
// in the composition's own <Audio> Sequences; this adds everything else.
//
// All times are composition seconds; gains are dB relative to the file as
// delivered. A music cue's `envelope` is a list of [seconds, dB] points on the
// composition timeline, interpolated in dB (so a duck or a lift is an even
// fade to the ear) and held flat before the first and after the last point.
// Fades are part of the envelope: start and end at -60 dB.

export type MixCue = {
  src: string; // under public/, e.g. 'audio/li-v6/music-bed.mp3'
  at: number; // composition seconds where the cue starts
  trimBefore?: number; // seconds into the file to start from
  duration?: number; // seconds to play (default: to the file's end)
  gainDb?: number; // flat gain when there's no envelope
  envelope?: [number, number][];
  label?: string; // shown on the Studio timeline, e.g. 'music bed', 'sfx: reveal whoosh'
};

export type Mix = {
  music: MixCue[];
  sfx: MixCue[];
};

const dbToGain = (db: number) => (db <= -60 ? 0 : Math.pow(10, db / 20));

const envelopeDb = (points: [number, number][], t: number): number => {
  if (t <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    const [t1, d1] = points[i];
    if (t <= t1) {
      const [t0, d0] = points[i - 1];
      return d0 + ((d1 - d0) * (t - t0)) / Math.max(t1 - t0, 1e-6);
    }
  }
  return points[points.length - 1][1];
};

const Cue: React.FC<{cue: MixCue; kind: string}> = ({cue, kind}) => {
  const {fps} = useVideoConfig();
  const from = Math.round(cue.at * fps);
  const volume = (f: number) => {
    const t = cue.at + f / fps; // composition seconds
    const db = cue.envelope?.length ? envelopeDb(cue.envelope, t) : (cue.gainDb ?? 0);
    return dbToGain(db);
  };
  return (
    <Sequence
      from={from}
      durationInFrames={cue.duration ? Math.round(cue.duration * fps) : undefined}
      name={cue.label ?? `${kind}: ${cue.src}`}
      layout="none"
    >
      <Audio
        src={staticFile(cue.src)}
        trimBefore={cue.trimBefore ? Math.round(cue.trimBefore * fps) : undefined}
        volume={volume}
      />
    </Sequence>
  );
};

export const MixTrack: React.FC<{mix: Mix}> = ({mix}) => (
  <>
    {mix.music.map((cue, i) => (
      <Cue key={`m${i}`} cue={cue} kind="music" />
    ))}
    {mix.sfx.map((cue, i) => (
      <Cue key={`s${i}`} cue={cue} kind="sfx" />
    ))}
  </>
);
