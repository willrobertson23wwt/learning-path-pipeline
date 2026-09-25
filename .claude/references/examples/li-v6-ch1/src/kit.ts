// li-v6-ch1 (Manim-first build): the Remotion wrapper's constants.
// Manim draws every visible element (manim/li-v6-ch1/, one BeatScene over the
// whole composition); this folder only holds the timeline, the audio split,
// the backdrops, and the Manim layer's placement.
import beatsFile from '../../../public/chapters/li-v6-ch1/beats.json';
import {FPS} from '../../constants';

export const B = beatsFile.beats;
export const HOLDS = beatsFile.holds;

// Mastered narration (-16 LUFS, sound-engineer); same timing as narration.mp3.
export const AUDIO = 'audio/li-v6/li-v6-ch1.voice.wav';

// While the item is in review the layer plays the frames folder (frame-exact
// in Studio). The caller switches this to 'manim/li-v6-ch1/chapter.webm' for
// the final render.
export const MANIM_SRC = 'manim/li-v6-ch1/chapter.webm';

// Composition length: round(beats.end x FPS) = 2723.
export const COMP_FRAMES = Math.round(B.end * FPS);

// Studio defaults (also the literal in Root.tsx defaultProps).
export const DEFAULT_SHOW_MANIM = true;
export const DEFAULT_MANIM_X = 0;
export const DEFAULT_MANIM_Y = 0;
export const DEFAULT_MANIM_SCALE = 1;
export const DEFAULT_MANIM_START_OFFSET_FRAMES = 0;

// Title light (CourseTitleBackdrop) behind the title: full strength from frame 0
// (never open on the bare ground), then an eased fade to the lesson ground from
// `loopOut` ("every IPv4") over
// the shot list's 0.6 s, done well before the address writes on at `aAddr`.
export const LOOP_FADE_SEC = 0.6;

// Audio cut points, NARRATION time (s), one per non-lead-in hold, in order.
// Each sits in measured silence (narration.mp3 at 44.1 kHz, 10 ms RMS,
// < -45 dBFS; every cut reads below -85 dBFS within +-40 ms), not at
// whisper's word ends, which clip "network", "left" and "story":
//   hold1Bits    8.433  silence 8.246-9.199   ("zeros" / "And")
//   hold2Parts  15.167  silence 14.956-15.794 ("network" / "The")
//   hold3Reading 35.767 silence 35.280-36.258 ("host" / "Here's")
//   hold4Reveal 45.000  silence 44.843-45.661 ("left" / "Now")
//   hold5Story  58.600  silence 58.302-59.350 ("story" / "One")
// All five are whole frames at 30 fps (253, 455, 1073, 1350, 1758).
export const CUTS_NARR_SEC = [8.433, 15.167, 35.767, 45.0, 58.6];

// Volume ramp each side of a cut (frames).
export const RAMP_FRAMES = 2;

export type AudioSegment = {
  name: string; // the hold that ends this segment ('tail' for the last)
  from: number; // composition frame the segment starts on
  trimBefore: number; // narration frame the segment starts at
  durationInFrames: number;
  rampIn: boolean;
  rampOut: boolean;
};

// Build the narration Sequences from beats.json holds + the measured cuts.
// A lead-in (hold at composition time 0) delays the whole narration; every
// later hold is one cut. Throws if beats.json and the cut table disagree, so
// a re-resolved beats.json can't silently desync the audio from Manim.
export const buildSegments = (): AudioSegment[] => {
  let shiftSec = 0;
  const cuts: {name: string; narr: number; shiftAfter: number}[] = [];
  for (const h of HOLDS) {
    if (h.at <= 0.001) {
      shiftSec += h.seconds; // lead-in
      continue;
    }
    const i = cuts.length;
    const narr = CUTS_NARR_SEC[i];
    if (narr === undefined) {
      throw new Error(`li-v6-ch1: beats.json hold ${h.name} has no measured cut in CUTS_NARR_SEC`);
    }
    // Where the resolver put the hold, in narration time.
    const holdNarr = h.at - shiftSec;
    if (Math.abs(holdNarr - narr) > 0.6) {
      throw new Error(
        `li-v6-ch1: hold ${h.name} resolves at narration ${holdNarr.toFixed(3)} s but its cut is ${narr} s; re-measure the silence`
      );
    }
    shiftSec += h.seconds;
    cuts.push({name: h.name, narr, shiftAfter: shiftSec});
  }
  if (cuts.length !== CUTS_NARR_SEC.length) {
    throw new Error(`li-v6-ch1: ${CUTS_NARR_SEC.length} cuts but ${cuts.length} holds in beats.json`);
  }

  const leadIn = HOLDS.find((h) => h.at <= 0.001)?.seconds ?? 0;
  const starts = [{narr: 0, shift: leadIn}, ...cuts.map((c) => ({narr: c.narr, shift: c.shiftAfter}))];
  return starts.map((s, k) => {
    const trimBefore = Math.round(s.narr * FPS);
    const from = trimBefore + Math.round(s.shift * FPS);
    const next = cuts[k];
    const durationInFrames = next ? Math.round(next.narr * FPS) - trimBefore : COMP_FRAMES - from;
    return {
      name: next ? next.name : 'tail',
      from,
      trimBefore,
      durationInFrames,
      rampIn: k > 0,
      rampOut: Boolean(next),
    };
  });
};
