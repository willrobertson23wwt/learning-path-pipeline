import {noise2D} from '@remotion/noise';
import rough from 'roughjs';
import {parsePath, Pt, resample, Stroke} from './geom';

// Hand-drawn primitives, all returned as strokes (px) for <Ink>. Everything
// is seeded: the same seed draws the same wobble in every frame.

const gen = rough.generator();

// A slow wander applied to finished geometry: amp in px, one wave per `wave` px.
export const wobble = (s: Stroke, seed: string, amp = 1.6, wave = 120): Stroke =>
  resample(s, 4).map(([x, y]): Pt => [x + noise2D(`${seed}x`, x / wave, y / wave) * amp, y + noise2D(`${seed}y`, x / wave, y / wave) * amp]);

// A single confident marker line: slight bow, no double pass.
export const line = (x1: number, y1: number, x2: number, y2: number, seed = 'line', roughness = 0.9): Stroke[] => {
  const d = gen.line(x1, y1, x2, y2, {roughness, bowing: 1.1, disableMultiStroke: true, seed: (hash(seed) % 2 ** 31) + 1});
  return gen.toPaths(d).flatMap((p) => parsePath(p.d));
};

// A curly brace under (dir 1) or over (dir -1) the span x1..x2, top at y,
// `depth` px deep, drawn as one stroke from left to right.
export const braceH = (x1: number, x2: number, y: number, depth = 28, seed = 'brace', dir = 1): Stroke[] => {
  const mid = (x1 + x2) / 2;
  const h = depth * dir;
  const r = Math.min(depth * 0.9, (x2 - x1) / 6);
  const pts: Pt[] = [];
  const q = (a: Pt, c: Pt, b: Pt, n = 10) => {
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const u = 1 - t;
      pts.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]);
    }
  };
  const yb = y + h * 0.5;
  q([x1, y], [x1, yb], [x1 + r, yb]);
  q([mid - r, yb], [mid, yb], [mid, y + h]);
  q([mid, y + h], [mid, yb], [mid + r, yb]);
  q([x2 - r, yb], [x2, yb], [x2, y]);
  return [wobble(pts, seed, 1.4, 90)];
};

// The same brace standing up: opening to the left, tip pointing right.
export const braceV = (x: number, y1: number, y2: number, depth = 30, seed = 'braceV'): Stroke[] =>
  braceH(y1, y2, 0, depth, seed).map((s) => s.map(([a, b]): Pt => [x + b, a]));

// A scalloped line-art cloud in the box, one stroke.
export const cloud = (x0: number, y0: number, x1: number, y1: number, seed = 'cloud', bumps = 7, flatBottom = true): Stroke[] => {
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const rx = (x1 - x0) / 2 / 1.12;
  const ry = (y1 - y0) / 2 / 1.12;
  const pts: Pt[] = [];
  const n = 220;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2 + Math.PI * 0.55;
    const k = 1 + 0.14 * Math.abs(Math.sin((t * bumps) / 2));
    // flatter bottom, like a drawn cloud sitting on a line
    const sy = flatBottom && Math.sin(t) > 0 ? 0.78 : 1;
    pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k * sy]);
  }
  return [wobble(pts, seed, 1.5, 70)];
};

// A drawn cross: two strokes, each with a little overshoot.
export const cross = (cx: number, cy: number, size: number, seed = 'cross'): Stroke[] => {
  const h = size / 2;
  return [...line(cx - h, cy - h, cx + h, cy + h * 1.04, `${seed}a`, 1.2), ...line(cx + h * 1.02, cy - h, cx - h, cy + h, `${seed}b`, 1.2)];
};

const hash = (s: string) => {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;
  return h;
};

const seedNum = (seed: string) => (hash(seed) % 2 ** 31) + 1;

// A drawn box, one loop, starting top left.
export const rect = (x: number, y: number, w: number, h: number, seed = 'rect', roughness = 0.9): Stroke[] =>
  gen.toPaths(gen.rectangle(x, y, w, h, {roughness, bowing: 0.8, disableMultiStroke: true, seed: seedNum(seed)})).flatMap((p) => parsePath(p.d));

// A drawn ellipse (circle when w == h), centered, one loop that overlaps a
// little where it closes, the way a quick circle does.
export const ellipse = (cx: number, cy: number, w: number, h: number, seed = 'ellipse', roughness = 0.8): Stroke[] =>
  gen.toPaths(gen.ellipse(cx, cy, w, h, {roughness, disableMultiStroke: true, curveStepCount: 14, seed: seedNum(seed)})).flatMap((p) => parsePath(p.d));

// A hand line through points (smoothed by the pen, not straight segments).
export const poly = (pts: Pt[], seed = 'poly', amp = 1.4): Stroke[] => [wobble(pts, seed, amp, 90)];

// An arrow from a to b: the shaft, then the two sides of the head drawn as
// one stroke (how people actually draw heads). `bend` bows the shaft
// sideways by that many px.
export const arrow = (a: Pt, b: Pt, seed = 'arrow', head = 22, bend = 0): Stroke[] => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const shaft: Pt[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const bow = Math.sin(Math.PI * t) * bend;
    shaft.push([a[0] + dx * t + nx * bow, a[1] + dy * t + ny * bow]);
  }
  // head direction follows the shaft's last segment
  const [px, py] = shaft[shaft.length - 2];
  const ang = Math.atan2(b[1] - py, b[0] - px);
  const wing = (s: number): Pt => [b[0] - head * Math.cos(ang + s * 0.5), b[1] - head * Math.sin(ang + s * 0.5)];
  return [wobble(shaft, seed, 1.2, 90), wobble([wing(1), b, wing(-1)], `${seed}h`, 0.8, 40)];
};

// An authored doodle: SVG path data drawn in a local box (any units), placed
// with its top left at (x, y) and scaled by `s`. Stroke order is the path's
// subpath order, so author doodles in drawing order.
export const doodle = (d: string, x: number, y: number, s = 1, seed = 'doodle', amp = 1.2): Stroke[] =>
  parsePath(d).map((st, i) => wobble(st.map(([u, v]): Pt => [x + u * s, y + v * s]), `${seed}${i}`, amp, 70));

// A scribble-out over a box: a quick zigzag, for "this no longer holds".
export const scribble = (x: number, y: number, w: number, h: number, seed = 'scribble', passes = 7): Stroke[] => {
  const r = seedNum(seed);
  const pts: Pt[] = [];
  for (let i = 0; i <= passes; i++) {
    const t = i / passes;
    const j = ((r * (i + 3)) % 17) / 17 - 0.5;
    pts.push([x + w * t + j * 8, i % 2 === 0 ? y + h * 0.1 : y + h * 0.9]);
  }
  return [wobble(pts, seed, 1.5, 50)];
};

// A large lumpy enclosure (a fenced-off area), one clockwise stroke from its
// top left, closing with a small overlap like a quick hand-drawn loop.
export const blob = (x0: number, y0: number, x1: number, y1: number, seed = 'blob'): Stroke[] => {
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const a = (x1 - x0) / 2;
  const b = (y1 - y0) / 2;
  const pts: Pt[] = [];
  const n = 260;
  const start = -Math.PI * 0.75; // top left; angle grows clockwise on screen
  for (let i = 0; i <= n; i++) {
    const t = start + (i / n) * Math.PI * 2.06;
    const c = Math.cos(t);
    const s = Math.sin(t);
    // superellipse: a rounded rectangle, softer than a box
    const e = 0.42;
    const px = Math.sign(c) * Math.pow(Math.abs(c), e);
    const py = Math.sign(s) * Math.pow(Math.abs(s), e);
    const k = 1 + 0.025 * noise2D(`${seed}r`, Math.cos(t) * 1.3, Math.sin(t) * 1.3);
    pts.push([cx + px * a * k, cy + py * b * k]);
  }
  return [wobble(pts, seed, 2, 140)];
};

// Doodle: a small computer (monitor, stand, foot), box x0,y0 w x h.
export const computer = (x: number, y: number, w: number, h: number, seed = 'pc'): Stroke[] => {
  const mh = h * 0.77;
  const mid = x + w / 2;
  return [
    ...rect(x, y, w, mh, `${seed}m`, 0.7),
    ...line(mid, y + mh, mid, y + h - 6, `${seed}s`, 0.4),
    ...line(mid - w * 0.24, y + h, mid + w * 0.24, y + h, `${seed}f`, 0.5),
  ];
};

// Doodle: a server rack with slot lines and a light beside each.
export const rack = (x: number, y: number, w: number, h: number, seed = 'rack', slots = 4): Stroke[] => {
  const out: Stroke[] = [...rect(x, y, w, h, `${seed}b`, 0.7)];
  for (let i = 0; i < slots; i++) {
    const sy = y + (h * (i + 0.6)) / (slots + 0.2);
    out.push(...line(x + w * 0.14, sy, x + w * 0.66, sy, `${seed}l${i}`, 0.5));
    out.push([[x + w * 0.8 - 1.5, sy], [x + w * 0.8 + 1.5, sy - 0.5]]);
  }
  return out;
};

// Doodle: an office building, outline then a grid of windows.
export const office = (x: number, y: number, w: number, h: number, seed = 'office', cols = 2, rows = 4): Stroke[] => {
  const out: Stroke[] = [...rect(x, y, w, h, `${seed}b`, 0.7)];
  const ww = w * 0.22;
  const wh = h * 0.1;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const wx = x + w * (0.2 + c * 0.4);
      const wy = y + h * (0.1 + r * 0.21);
      out.push(...rect(wx, wy, ww, wh, `${seed}w${r}${c}`, 0.5));
    }
  return out;
};

// Doodle: a house: square body, pitched roof, a door.
export const house = (x: number, y: number, w: number, h: number, seed = 'house'): Stroke[] => {
  const roofH = h * 0.36;
  const bx = x + w * 0.1;
  const bw = w * 0.8;
  return [
    ...rect(bx, y + roofH, bw, h - roofH, `${seed}b`, 0.7),
    ...poly([[x, y + roofH + 6], [x + w / 2, y], [x + w, y + roofH + 6]], `${seed}r`, 1.2),
    ...poly([[x + w * 0.42, y + h], [x + w * 0.42, y + h * 0.66], [x + w * 0.6, y + h * 0.66], [x + w * 0.6, y + h]], `${seed}d`, 0.8),
  ];
};
