// Polylines: the one representation every sketch element is drawn from.
// Font glyphs, rough.js shapes, and hand-built paths all become lists of
// strokes (one pen-down each), so one renderer draws them all on.
export type Pt = [number, number];
export type Stroke = Pt[];

// Parse an absolute M/L/C/Z path into strokes, flattening curves.
export const parsePath = (d: string, curveSteps = 10): Stroke[] => {
  const tok = d.match(/[MLCZmlcz]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) ?? [];
  const out: Stroke[] = [];
  let cur: Stroke = [];
  let cmd = 'M';
  let i = 0;
  const num = () => Number(tok[i++]);
  while (i < tok.length) {
    if (/[A-Za-z]/.test(tok[i])) cmd = tok[i++].toUpperCase();
    if (cmd === 'Z') {
      if (cur.length) cur.push([...cur[0]] as Pt);
      continue;
    }
    if (cmd === 'M') {
      if (cur.length > 1) out.push(cur);
      cur = [[num(), num()]];
      cmd = 'L';
    } else if (cmd === 'L') {
      cur.push([num(), num()]);
    } else if (cmd === 'C') {
      const p0 = cur[cur.length - 1];
      const p1: Pt = [num(), num()];
      const p2: Pt = [num(), num()];
      const p3: Pt = [num(), num()];
      for (let s = 1; s <= curveSteps; s++) {
        const t = s / curveSteps;
        const u = 1 - t;
        cur.push([
          u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
          u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
        ]);
      }
    } else {
      i++;
    }
  }
  if (cur.length > 1) out.push(cur);
  return out;
};

export const strokeLength = (s: Stroke) => {
  let l = 0;
  for (let i = 1; i < s.length; i++) l += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
  return l;
};

// Evenly spaced points, so pen weight and wobble don't depend on how the
// source path happened to be segmented.
export const resample = (s: Stroke, step: number): Stroke => {
  if (s.length < 2) return s;
  const out: Stroke = [s[0]];
  let carry = 0;
  for (let i = 1; i < s.length; i++) {
    const [ax, ay] = s[i - 1];
    const [bx, by] = s[i];
    const seg = Math.hypot(bx - ax, by - ay);
    let t = step - carry;
    while (t <= seg) {
      out.push([ax + ((bx - ax) * t) / seg, ay + ((by - ay) * t) / seg]);
      t += step;
    }
    carry = seg - (t - step);
  }
  const last = s[s.length - 1];
  const tail = out[out.length - 1];
  if (Math.hypot(last[0] - tail[0], last[1] - tail[1]) > step * 0.25) out.push(last);
  return out;
};

// The first `len` of a stroke (for drawing on).
export const partial = (s: Stroke, len: number): Stroke => {
  if (len <= 0) return [];
  const out: Stroke = [s[0]];
  let acc = 0;
  for (let i = 1; i < s.length; i++) {
    const seg = Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
    if (acc + seg >= len) {
      const t = seg === 0 ? 0 : (len - acc) / seg;
      out.push([s[i - 1][0] + (s[i][0] - s[i - 1][0]) * t, s[i - 1][1] + (s[i][1] - s[i - 1][1]) * t]);
      return out;
    }
    acc += seg;
    out.push(s[i]);
  }
  return out;
};

export const mapStrokes = (strokes: Stroke[], f: (p: Pt) => Pt): Stroke[] => strokes.map((s) => s.map(f));

export const bounds = (strokes: Stroke[]) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const s of strokes) for (const [x, y] of s) {
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  return {x0, y0, x1, y1};
};
