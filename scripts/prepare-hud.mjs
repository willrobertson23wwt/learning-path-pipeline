// Prepare Envato HUD callout Lottie files for use as panel icons:
// keep only the animated icon + rotating rings, drop the label/connector/bg
// layers, and remap the palette to the project theme.
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

// The raw Envato pack (~240MB) lives only in the template checkout; learning
// paths resolve it from there. Override with HUD_PACK_DIR if the template is
// checked out elsewhere.
const PACK_REL =
  'assets-src/hud-callouts/Security Hud Call Out Lottie Titles/Security Hud Call Out Lottie Titles/JSON';
const SRC_DIR = process.env.HUD_PACK_DIR
  ? path.resolve(process.env.HUD_PACK_DIR)
  : [path.resolve(PACK_REL), path.resolve('..', 'remotion-training-graphics', PACK_REL)].find((p) =>
      existsSync(p)
    );
if (!SRC_DIR || !existsSync(SRC_DIR)) {
  console.error(
    'Envato HUD pack not found locally or in ../remotion-training-graphics — set HUD_PACK_DIR to its JSON folder.'
  );
  process.exit(1);
}
const OUT_DIR = path.resolve('src/assets/hud');

const PICKS = [
  {file: 'Key Hud Call Out Title 02.json', out: 'key.json'},
  {file: 'Firewall Hud Call Out Title 02.json', out: 'firewall.json'},
  {file: 'Denied Hud Call Out Title 02.json', out: 'denied.json'},
  {file: 'Lock Hud Call Out Title 02.json', out: 'lock.json'},
];

// 'Mask' must stay: it's the track matte (td:1) for the icon layer.
const DROP_LAYERS = new Set(['Headline', 'Text', 'Point', 'Square', 'Line']);

// [from r,g,b] -> [to r,g,b], 0-255
const COLOR_MAP = [
  [[17, 17, 17], [255, 255, 255]], // rings & line work -> white
  [[27, 102, 255], [0, 194, 255]], // primary blue -> theme accent
  [[0, 34, 146], [8, 84, 122]], // dark navy shading -> dark cyan
  [[102, 185, 251], [128, 220, 255]], // light blue -> light cyan
];

const mapColor = (k) => {
  if (!Array.isArray(k) || k.length !== 4 || k.some((v) => typeof v !== 'number')) return k;
  for (const [from, to] of COLOR_MAP) {
    if (from.every((c, i) => Math.abs(k[i] * 255 - c) < 3)) {
      return [to[0] / 255, to[1] / 255, to[2] / 255, k[3]];
    }
  }
  return k;
};

// Recolor every color property ("c": {"a":0,"k":[r,g,b,a]} or keyframed)
const walk = (node) => {
  if (Array.isArray(node)) {
    node.forEach(walk);
    return;
  }
  if (node && typeof node === 'object') {
    if (node.c && typeof node.c === 'object' && 'k' in node.c) {
      if (node.c.a === 0) {
        node.c.k = mapColor(node.c.k);
      } else if (Array.isArray(node.c.k)) {
        for (const kf of node.c.k) {
          if (kf.s) kf.s = mapColor(kf.s);
          if (kf.e) kf.e = mapColor(kf.e);
        }
      }
    }
    Object.values(node).forEach(walk);
  }
};

mkdirSync(OUT_DIR, {recursive: true});
for (const {file, out} of PICKS) {
  const data = JSON.parse(readFileSync(path.join(SRC_DIR, file), 'utf8'));
  data.layers = data.layers.filter((l) => !DROP_LAYERS.has(l.nm));
  walk(data);
  writeFileSync(path.join(OUT_DIR, out), JSON.stringify(data));
  console.log(`${out}: ${data.layers.map((l) => l.nm).join(', ')}`);
}
