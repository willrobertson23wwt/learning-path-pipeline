// The hand-drawn toolkit (the course's video style; see
// .claude/references/sketch-style.md and the worked example in
// .claude/references/examples/li-v6-ch1-hd/).
export {WWT, INK} from './palette';
export {rng, signed, hashSeed} from './rand';
export {parsePath, strokeLength, resample, partial, mapStrokes, bounds} from './geom';
export type {Pt, Stroke} from './geom';
export {Ink, InkDefs} from './Ink';
export type {InkStroke} from './Ink';
export {HandText, layoutText, HAND_FONTS} from './HandText';
export type {HandFont, TextSpan, TextLayout} from './HandText';
export {
  wobble, line, braceH, braceV, cloud, cross, rect, ellipse, poly, arrow, doodle, scribble, blob, computer, rack, office, house,
} from './shapes';
export {SweepMask} from './Sweep';
export {NavyGround} from './Ground';
export {TitleLight} from './TitleLight';
export {SketchThankYou} from './SketchThankYou';
