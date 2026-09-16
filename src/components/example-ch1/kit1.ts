import {appear} from '../terminal/kit';

// Beat timings (SECONDS, relative to narration start) for the worked example chapter
// (originally Linux Intermediate video 1 chapter 1), "From Repeated Blocks to Functions". Derived from
// word-level whisper timings of example-ch1/narration.mp3.
export const T1 = {
  titleIn: 0, // frame 0 — the clip must never open on bare backdrop
  titleDur: 3.7,

  // Scene A — the duplicated file, the collapse into a function, call sites
  aIn: 3.7,
  fileIn: 4.0, // script rows stagger in
  hl1: 9.2, // "the same five lines" — block 1 counted
  hl2: 12.7, // "appear three times" — block 2
  hl3: 13.5, // block 3
  editBadge: 15.7, // "every bug fix means finding every copy" — one block edited
  staleBadges: 18.3, // "missing one means your script lies" — others stale
  collapse: 21.4, // "Functions fix that" — blocks collapse
  fnType: 23.0, // "name, parentheses, curly braces" — function types on
  pillName: 24.0,
  pillParens: 24.9,
  pillBody: 26.1,
  callsIn: 29.1, // "you call it by name" — call sites appear
  callLight: 32.3, // "define it once, call it everywhere" — sequential light
  oncePill: 33.5,
  aOut: 34.4,

  // Scene B — define before call
  bIn: 35.0,
  readArrow: 37.0, // "bash reads a script from top to bottom"
  errLine: 39.9, // "defined before the line that calls it" — command not found
  swap: 42.1, // "keep your functions at the top" — definition slides above
  okLine: 43.6,
  orderPill: 44.3, // "define first, call after"
  bOut: 45.5,

  // Scene C — module roadmap
  cIn: 46.0,
  growHeader: 47.2, // "grow one script, cleanup.sh"
  toolLabel: 49.9, // "a real log rotation tool"
  chipsIn: 51.3, // roadmap chips stagger in
  firstChipLit: 53.5, // "start by pulling that repeated logging code into a function"

  end: 55.7,
};

// Scene fade windows [in, out]; `out: null` means "hold to the end of the chapter".
export type Window = [number, number | null];
export const SCENES: Record<'A' | 'B' | 'C', Window> = {
  A: [T1.aIn, T1.aOut],
  B: [T1.bIn, T1.bOut],
  C: [T1.cIn, null],
};

/** 0→1 enter, hold, 0 on exit. Holds to the end when `out` is null. */
export const sceneFade = (frame: number, fps: number, [inSec, outSec]: Window) => {
  const enter = appear(frame, fps, inSec, 16);
  const leave = outSec == null ? 0 : appear(frame, fps, outSec, 12);
  return enter * (1 - leave);
};

// Default layout positions (px, 1920×1080) — single source of truth, also spread
// into Root.tsx defaultProps. Sequential scenes share a centered stage.
export const DEFAULT_STAGE_CENTER_Y = 540;
