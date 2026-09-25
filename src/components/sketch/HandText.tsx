import React from 'react';
// The house hand is EMS Readability (casual marker print); EMS Tech is the
// alternate. Both are SIL Open Font License single-line plotter fonts,
// converted by scripts/hand-font.mjs.
import readability from '../../assets/hand/EMSReadability.json';
import tech from '../../assets/hand/EMSTech.json';
import {Ink, InkStroke} from './Ink';
import {parsePath, Pt} from './geom';
import {noise2D} from '@remotion/noise';
import {rng, signed} from './rand';

type FontJson = {
  info: {unitsPerEm: number; capHeight: number; xHeight: number; defaultAdv: number};
  glyphs: Record<string, {adv: number; strokes: string[]}>;
};

export const HAND_FONTS: Record<string, FontJson> = {readability, tech} as unknown as Record<string, FontJson>;
export type HandFont = keyof typeof HAND_FONTS;

// Parsed glyph strokes, cached per font.
const cache = new Map<string, Pt[][]>();
const glyphStrokes = (font: string, ch: string): Pt[][] => {
  const k = `${font}:${ch}`;
  if (!cache.has(k)) {
    const g = HAND_FONTS[font].glyphs[ch];
    cache.set(k, g ? g.strokes.flatMap((d) => parsePath(d)) : []);
  }
  return cache.get(k)!;
};

// The fonts' declared cap-height isn't what they draw, so measure it: the
// top of "H" above the baseline, in font units.
const capCache = new Map<string, number>();
const measuredCap = (font: string) => {
  if (!capCache.has(font)) {
    const pts = glyphStrokes(font, 'H').flat();
    capCache.set(font, pts.length ? Math.max(...pts.map((p) => p[1])) : HAND_FONTS[font].info.capHeight);
  }
  return capCache.get(font)!;
};

export type TextSpan = {text: string; color?: string};

export type TextLayout = {strokes: InkStroke[]; width: number; charX: number[]};

// Lay out text as marker strokes in px. Baseline at y = 0, starting at
// x = 0. Each letter gets its own small, seeded wobble (baseline, tilt,
// size, spacing) so no two letters are alike, which is most of what makes
// it read as written rather than typeset.
export const layoutText = (
  spans: TextSpan[] | string,
  {font = 'readability', cap = 60, tracking = 0.04, jitter = 1.4, wobble = 1.4, condense = 0.86, seed = 'text'}: {font?: HandFont; cap?: number; tracking?: number; jitter?: number; wobble?: number; condense?: number; seed?: string} = {},
): TextLayout => {
  const f = HAND_FONTS[font];
  const s = cap / measuredCap(font);
  const wAmp = cap * 0.022 * wobble;
  const wFreq = 1.6 / cap;
  const r = rng(seed);
  const list = typeof spans === 'string' ? [{text: spans}] : spans;
  const strokes: InkStroke[] = [];
  const charX: number[] = [];
  let x = 0;
  for (const span of list) {
    for (const ch of span.text) {
      charX.push(x);
      const g = f.glyphs[ch];
      // Condensed a little: the EMS face is wide for marker print.
      const adv = (g?.adv ?? f.info.defaultAdv) * s * condense;
      const dy = signed(r) * cap * 0.04 * jitter;
      const rot = signed(r) * 0.06 * jitter;
      const sc = 1 + signed(r) * 0.05 * jitter;
      const cx = x + adv / 2;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      for (const st of glyphStrokes(font, ch)) {
        strokes.push({
          color: span.color,
          pts: st.map(([gx, gy]): Pt => {
            const px = gx * s * sc * condense + x - cx;
            const py = -gy * s * sc;
            const qx = cx + px * cos - py * sin;
            const qy = dy + px * sin + py * cos;
            // A slow wander along the line, like a hand that isn't a plotter.
            return [qx + noise2D(`${seed}x`, qx * wFreq, qy * wFreq) * wAmp, qy + noise2D(`${seed}y`, qx * wFreq, qy * wFreq) * wAmp];
          }),
        });
      }
      x += adv * (1 + signed(r) * 0.02 * jitter) + tracking * cap;
    }
  }
  charX.push(x - tracking * cap);
  return {strokes, width: x - tracking * cap, charX};
};

type Props = {
  text: TextSpan[] | string;
  x: number;
  y: number; // baseline
  align?: 'start' | 'middle' | 'end';
  font?: HandFont;
  cap?: number;
  color?: string;
  width?: number;
  progress?: number;
  seed?: string;
  jitter?: number;
  wobble?: number;
  tracking?: number;
  opacity?: number;
};

export const HandText: React.FC<Props> = ({text, x, y, align = 'start', font = 'readability', cap = 60, color, width, progress = 1, seed, jitter = 1.4, wobble = 1.4, tracking, opacity}) => {
  const key = seed ?? (typeof text === 'string' ? text : text.map((t) => t.text).join(''));
  const lay = layoutText(text, {font, cap, jitter, wobble, seed: key, tracking});
  const ox = align === 'start' ? x : align === 'middle' ? x - lay.width / 2 : x - lay.width;
  return (
    <g transform={`translate(${ox.toFixed(2)} ${y.toFixed(2)})`}>
      <Ink strokes={lay.strokes} progress={progress} color={color} width={width ?? Math.max(2.5, cap * 0.085)} penLift={cap * 0.3} seed={key} opacity={opacity} />
    </g>
  );
};
