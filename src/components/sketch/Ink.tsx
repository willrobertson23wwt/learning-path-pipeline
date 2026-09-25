import React from 'react';
import {getStroke} from 'perfect-freehand';
import {partial, resample, Stroke, strokeLength} from './geom';
import {rng} from './rand';

// One pen-down of marker ink. `color`/`width` override the Ink defaults.
export type InkStroke = {pts: Stroke; color?: string; width?: number};

// Outline points from perfect-freehand -> a smooth closed SVG path.
const outlineToD = (pts: number[][]) => {
  if (pts.length < 4) return '';
  const avg = (a: number, b: number) => (a + b) / 2;
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)} Q${pts[1][0].toFixed(2)},${pts[1][1].toFixed(2)} ${avg(pts[1][0], pts[2][0]).toFixed(2)},${avg(pts[1][1], pts[2][1]).toFixed(2)} T`;
  for (let i = 2; i < pts.length - 1; i++) {
    d += `${avg(pts[i][0], pts[i + 1][0]).toFixed(2)},${avg(pts[i][1], pts[i + 1][1]).toFixed(2)} `;
  }
  return d + 'Z';
};

// Marker pressure: a slow, seeded swell along the stroke (about +-12%), so
// the weight varies the way a felt tip's does without ever thinning out.
const pressure = (seed: string, n: number) => {
  const r = rng(seed);
  const f1 = 0.02 + r() * 0.03;
  const f2 = 0.07 + r() * 0.05;
  const ph1 = r() * 6.28;
  const ph2 = r() * 6.28;
  return (i: number) => 0.55 + 0.08 * Math.sin(i * f1 * 6.28 + ph1) + 0.04 * Math.sin(i * f2 * 6.28 + ph2) + (n < 3 ? 0.1 : 0);
};

type Props = {
  strokes: (InkStroke | Stroke)[];
  // 0 = nothing drawn, 1 = finished. Strokes draw on in order, one pen.
  progress?: number;
  color?: string;
  width?: number;
  // Pen travel between strokes, in px of drawing time.
  penLift?: number;
  seed?: string;
  opacity?: number;
};

export const Ink: React.FC<Props> = ({strokes: input, progress = 1, color = '#F6F7F8', width = 5, penLift = 20, seed = 'ink', opacity = 1}) => {
  const strokes: InkStroke[] = input.map((s) => (Array.isArray(s) ? {pts: s} : s));
  const lens = strokes.map((s) => strokeLength(s.pts));
  const total = lens.reduce((a, b) => a + b, 0) + penLift * Math.max(0, strokes.length - 1);
  let budget = Math.max(0, Math.min(1, progress)) * total;
  const paths: React.ReactNode[] = [];
  strokes.forEach((s, i) => {
    if (budget <= 0) return;
    const len = lens[i];
    const drawn = progress >= 1 ? s.pts : partial(s.pts, Math.min(len, budget));
    budget -= len + penLift;
    const w = s.width ?? width;
    const pts = resample(drawn, Math.max(1.5, w * 0.35));
    if (pts.length === 0) return;
    const p = pressure(`${seed}:${i}`, pts.length);
    const outline = getStroke(
      pts.map(([x, y], k) => [x, y, p(k)]),
      {size: w * 1.25, thinning: 0.35, smoothing: 0.6, streamline: 0.35, simulatePressure: false, last: true, start: {cap: true}, end: {cap: true}},
    );
    paths.push(<path key={i} d={outlineToD(outline)} fill={s.color ?? color} />);
  });
  return <g opacity={opacity}>{paths}</g>;
};

// Faint edge roughness, like marker ink bleeding into paper fibers. Frozen
// (fixed seed), so it never crawls. Put <InkDefs /> once in each <svg> and
// wrap drawing in <g filter="url(#marker)">.
export const InkDefs: React.FC = () => (
  <defs>
    <filter id="marker" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={7} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={1.6} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
);
