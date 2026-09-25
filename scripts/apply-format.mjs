// Apply a learning-path format to a freshly copied path folder:
//
//   node scripts/apply-format.mjs <traditional|lab-first> <dest-folder>
//
// Run from the template (learning-path-pipeline). /new-path copies the shared
// files first, then runs this:
//   1. every file under formats/<format>/ (except fragments/) is copied over
//      the destination at the same relative path (a format's skills, agent
//      variants, worked example);
//   2. every <!-- FORMAT:<name> --> ... <!-- /FORMAT:<name> --> slot in the
//      destination's CLAUDE.md and .claude/house-style.md is replaced by
//      formats/<format>/fragments/<target>-<name>.md, where <target> is
//      "claude" or "house-style".
// It fails, changing nothing, if the format is unknown, a slot has no
// fragment, or a fragment has no slot.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [format, destArg] = process.argv.slice(2);
if (!format || !destArg) {
  console.error('Usage: node scripts/apply-format.mjs <traditional|lab-first> <dest-folder>');
  process.exit(1);
}
const formatDir = path.join(root, 'formats', format);
if (!fs.existsSync(formatDir)) {
  const known = fs.readdirSync(path.join(root, 'formats')).filter((d) => !d.startsWith('.'));
  console.error(`Unknown format "${format}". Known: ${known.join(', ')}`);
  process.exit(1);
}
const dest = path.resolve(destArg);
if (dest === root) {
  console.error('Refusing to apply a format to the template itself.');
  process.exit(1);
}

const TARGETS = {claude: 'CLAUDE.md', 'house-style': '.claude/house-style.md'};
const fragDir = path.join(formatDir, 'fragments');
const fragments = fs.existsSync(fragDir) ? fs.readdirSync(fragDir).filter((f) => f.endsWith('.md')) : [];
const used = new Set();

// Plan the slot fills first, so nothing is written if anything is missing.
const fills = [];
for (const [target, rel] of Object.entries(TARGETS)) {
  const file = path.join(dest, rel);
  if (!fs.existsSync(file)) {
    console.error(`Missing ${rel} in ${dest}: copy the shared files first.`);
    process.exit(1);
  }
  let text = fs.readFileSync(file, 'utf8');
  const slot = /<!-- FORMAT:([a-z-]+) -->[\s\S]*?<!-- \/FORMAT:\1 -->/g;
  const missing = [];
  text = text.replace(slot, (_, name) => {
    const frag = `${target}-${name}.md`;
    if (!fragments.includes(frag)) {
      missing.push(frag);
      return _;
    }
    used.add(frag);
    return fs.readFileSync(path.join(fragDir, frag), 'utf8').trimEnd();
  });
  if (missing.length) {
    console.error(`${rel}: no fragment for ${missing.join(', ')} in formats/${format}/fragments/`);
    process.exit(1);
  }
  fills.push([file, text]);
}
const unused = fragments.filter((f) => !used.has(f));
if (unused.length) {
  console.error(`Fragments with no slot: ${unused.join(', ')}`);
  process.exit(1);
}

// Copy the format's files.
const copied = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const src = path.join(dir, entry.name);
    const rel = path.relative(formatDir, src);
    if (rel === 'fragments' || entry.name === '.DS_Store') continue;
    if (entry.isDirectory()) walk(src);
    else {
      const out = path.join(dest, rel);
      fs.mkdirSync(path.dirname(out), {recursive: true});
      fs.copyFileSync(src, out);
      copied.push(rel);
    }
  }
};
walk(formatDir);
for (const [file, text] of fills) fs.writeFileSync(file, text.endsWith('\n') ? text : `${text}\n`);

console.log(`Applied format "${format}" to ${dest}`);
console.log(`  copied ${copied.length} files: ${copied.join(', ')}`);
console.log(`  filled ${[...used].join(', ')}`);
