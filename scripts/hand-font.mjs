// Convert the EMS single-line (plotter) SVG fonts from the hersheytext
// package into small JSON files the sketch toolkit imports:
//
//   npm i --no-save hersheytext@2.0.0 && node scripts/hand-font.mjs EMSReadability EMSTech
//
// (default: every EMS font). The template ships EMSReadability (the house
// hand) and EMSTech; HandText.tsx imports those two. To try another, convert
// it and add it to HAND_FONTS.
//
// Each glyph keeps its pen strokes (one "M ... L ..." subpath each) in font
// units, y up, so HandText can draw them on stroke by stroke. The fonts are
// SIL Open Font License (see each SVG's metadata).
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'node_modules/hersheytext/svg_fonts';
const OUT = 'src/assets/hand';
const names = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(SRC).filter((f) => f.startsWith('EMS')).map((f) => f.replace('.svg', ''));

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

fs.mkdirSync(OUT, {recursive: true});
for (const name of names) {
  const svg = fs.readFileSync(path.join(SRC, `${name}.svg`), 'utf8');
  const face = svg.match(/<font-face[^>]*>/)[0];
  const font = svg.match(/<font [^>]*>/)[0];
  const info = {
    name,
    unitsPerEm: Number(attr(face, 'units-per-em')),
    ascent: Number(attr(face, 'ascent')),
    descent: Number(attr(face, 'descent')),
    capHeight: Number(attr(face, 'cap-height')),
    xHeight: Number(attr(face, 'x-height')),
    defaultAdv: Number(attr(font, 'horiz-adv-x')),
  };
  const glyphs = {};
  for (const tag of svg.match(/<glyph[^>]*>/g)) {
    const u = attr(tag, 'unicode');
    if (u === undefined) continue;
    const ch = decode(u);
    const d = attr(tag, 'd') ?? '';
    const strokes = d.split(/(?=M)/).map((s) => s.trim()).filter(Boolean);
    glyphs[ch] = {adv: Number(attr(tag, 'horiz-adv-x') ?? info.defaultAdv), strokes};
  }
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify({info, glyphs}));
  console.log(`${name}: ${Object.keys(glyphs).length} glyphs`);
}
