// Close out a finished course (or a range of its labs): gather the
// deliverables (MP4s, GIFs, card PNGs, captions), the source narration,
// transcripts and captions, the media scripts, the articles for standalone
// videos, the research briefs and the caption map into one dated zip with a
// manifest, verify the zip, and optionally delete the multi-GB renders in out/
// afterwards.
//
// Usage:
//   node scripts/closeout.mjs <course-slug> [first-last] [--renders] [--purge-renders] [--dry-run]
//
//   first-last       inclusive lab range (e.g. 1-5, or a single 3). Default: the whole path.
//                    Media IDs carry the lab number (<prefix>-l3-v1, <prefix>-l3-g1).
//                    Path-level media (<prefix>-briefing, <prefix>-card-*) and legacy
//                    video-first names (<prefix>-v3-ch1, selected by video) also work.
//   --renders        also archive the raw renders in out/ for those labs (large).
//   --purge-renders  after the zip verifies, delete those out/ files. Prompts unless --yes.
//   --yes            skip the purge confirmation (for the /closeout skill after the user agreed).
//   --dry-run        list what would be archived, with sizes, and stop.
//
// Output: archives/<slug>[-vA-B]-<YYYYMMDD>.zip (+ MANIFEST.txt inside).
// Zipping uses the `tar` that ships with macOS and Windows 10+ (bsdtar), which
// writes zip64 archives, so multi-GB bundles are fine. archives/ is gitignored.

import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';

const flags = process.argv.slice(2);
const opt = (f) => flags.includes(f);
const args = flags.filter((a) => !a.startsWith('--'));
const slug = args[0];
if (!slug) {
  console.error('Usage: node scripts/closeout.mjs <course-slug> [first-last] [--renders] [--purge-renders] [--yes] [--dry-run]');
  process.exit(1);
}
let range = null;
if (args[1]) {
  const m = args[1].match(/^(\d+)(?:-(\d+))?$/);
  if (!m) {
    console.error(`Bad lab argument "${args[1]}" — use a number (3) or a range (1-5).`);
    process.exit(1);
  }
  range = [Number(m[1]), Number(m[2] ?? m[1])].sort((a, b) => a - b);
}

const root = process.cwd();
const outlinePath = path.join(root, 'courses', slug, 'outline.md');
if (!existsSync(outlinePath)) {
  console.error(`No outline at ${outlinePath} — is "${slug}" the course slug?`);
  process.exit(1);
}
const prefix = readFileSync(outlinePath, 'utf8').match(/^prefix:\s*(\S+)/m)?.[1];
if (!prefix) {
  console.error('outline.md has no `prefix:` frontmatter line.');
  process.exit(1);
}

const inRange = (n) => !range || (n >= range[0] && n <= range[1]);
// Lab number from a media ID (<prefix>-l3-v1) or a legacy chapter name (<prefix>-v3-ch1).
const videoOf = (name) => {
  const m = name.match(new RegExp(`^${prefix}-[lv](\\d+)-`));
  return m ? Number(m[1]) : null;
};
// Path-level media: not tied to one lab, so archived only on a whole-path closeout.
const isPathLevel = (name) => new RegExp(`^${prefix}-(intro|review|briefing|card-)`).test(name);
const nnOf = (name) => {
  const m = name.match(/^(\d+)-/);
  return m ? Number(m[1]) : null;
};
const listDir = (dir) => (existsSync(dir) ? readdirSync(dir) : []);

// --- collect ---------------------------------------------------------------
const files = []; // repo-relative paths
const add = (rel) => {
  const abs = path.join(root, rel);
  if (existsSync(abs) && statSync(abs).isFile()) files.push(rel);
};

for (const f of listDir('deliverables')) {
  const v = videoOf(f);
  if (((v !== null && inRange(v)) || (isPathLevel(f) && !range)) && /\.(mp4|mov|gif|png|vtt)$/i.test(f)) add(path.join('deliverables', f));
}
for (const d of listDir(path.join('public', 'chapters'))) {
  const v = videoOf(d);
  if ((v !== null && inRange(v)) || (isPathLevel(d) && !range)) {
    for (const f of listDir(path.join('public', 'chapters', d))) {
      if (/\.(mp3|transcript\.json|vtt)$/i.test(f)) add(path.join('public', 'chapters', d, f));
    }
  }
}
for (const d of listDir(path.join('courses', slug, 'scripts'))) {
  const n = nnOf(d);
  if (n !== null && inRange(n)) {
    for (const f of listDir(path.join('courses', slug, 'scripts', d))) add(path.join('courses', slug, 'scripts', d, f));
  }
}
// Articles exist only for standalone videos, named by media ID (legacy: NN-<video>.md).
for (const f of listDir(path.join('courses', slug, 'articles'))) {
  const n = nnOf(f) ?? videoOf(f);
  if ((n !== null && inRange(n)) || (n === null && !range)) add(path.join('courses', slug, 'articles', f));
}
if (!range) add(path.join('courses', slug, 'caption-map.json'));
// Research briefs: per-video ones (NN-*.md) follow the range; the outline and
// lab briefs (outline.md, lab-*.md) are course-level, like outline.md itself.
for (const f of listDir(path.join('courses', slug, 'research'))) {
  const n = nnOf(f);
  if ((n !== null && inRange(n)) || (n === null && !range)) add(path.join('courses', slug, 'research', f));
}
if (!range) add(path.join('courses', slug, 'outline.md'));

const renderFiles = listDir('out')
  .filter((f) => {
    const v = videoOf(f);
    return ((v !== null && inRange(v)) || (isPathLevel(f) && !range)) && /\.(mp4|mov|png|gif)$/i.test(f);
  })
  .map((f) => path.join('out', f));
if (opt('--renders')) files.push(...renderFiles);

if (files.length === 0) {
  console.error('Nothing to archive: no deliverables, audio, scripts or articles matched.');
  process.exit(1);
}

const fmt = (b) => (b >= 1e9 ? `${(b / 1e9).toFixed(2)} GB` : b >= 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.ceil(b / 1e3)} KB`);
const total = files.reduce((s, f) => s + statSync(path.join(root, f)).size, 0);
const deliverableCount = files.filter((f) => f.startsWith('deliverables')).length;

console.log(`Course ${slug} (prefix ${prefix})${range ? `, labs ${range[0]}-${range[1]}` : ''}`);
console.log(`${files.length} files, ${fmt(total)} (${deliverableCount} deliverables)`);
for (const f of files) console.log(`  ${fmt(statSync(path.join(root, f)).size).padStart(10)}  ${f}`);
if (!opt('--renders') && renderFiles.length) {
  const rsz = renderFiles.reduce((s, f) => s + statSync(path.join(root, f)).size, 0);
  console.log(`\nNot archived (pass --renders to include): ${renderFiles.length} files in out/, ${fmt(rsz)}`);
}
if (opt('--dry-run')) process.exit(0);

// --- manifest + zip --------------------------------------------------------
const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const name = `${slug}${range ? `-v${range[0]}-${range[1]}` : ''}-${stamp}`;
mkdirSync(path.join(root, 'archives'), {recursive: true});
const zipPath = path.join(root, 'archives', `${name}.zip`);
if (existsSync(zipPath)) unlinkSync(zipPath);

const manifestRel = path.join('archives', `${name}.MANIFEST.txt`);
const lines = [
  `Course: ${slug} (prefix ${prefix})`,
  `Labs: ${range ? `${range[0]}-${range[1]}` : 'all'}`,
  `Created: ${new Date().toISOString()}`,
  `Files: ${files.length}, ${fmt(total)}`,
  '',
  'sha256  size  path',
];
for (const f of files) {
  const buf = readFileSync(path.join(root, f));
  lines.push(`${createHash('sha256').update(buf).digest('hex')}  ${buf.length}  ${f}`);
}
writeFileSync(path.join(root, manifestRel), lines.join('\n') + '\n');

// bsdtar: -a picks the format from the extension (.zip), -C keeps paths repo-relative.
const listFile = path.join(root, 'archives', `${name}.files.txt`);
writeFileSync(listFile, [...files, manifestRel].join('\n') + '\n');
console.log(`\nWriting ${path.relative(root, zipPath)} …`);
execFileSync('tar', ['-a', '-cf', zipPath, '-C', root, '-T', listFile], {stdio: 'inherit'});
unlinkSync(listFile);

// verify: every listed path is in the archive
const listed = execFileSync('tar', ['-tf', zipPath], {encoding: 'utf8'})
  .split(/\r?\n/)
  .filter(Boolean)
  .map((p) => p.replace(/\\/g, '/'));
const missing = [...files, manifestRel].map((f) => f.replace(/\\/g, '/')).filter((f) => !listed.includes(f));
if (missing.length) {
  console.error(`\nVERIFY FAILED — ${missing.length} file(s) not in the zip:\n  ${missing.join('\n  ')}`);
  process.exit(2);
}
console.log(`Verified: ${listed.length} entries, ${fmt(statSync(zipPath).size)} on disk.`);
console.log(`Manifest: ${manifestRel}`);

// --- optional purge --------------------------------------------------------
if (opt('--purge-renders')) {
  if (renderFiles.length === 0) {
    console.log('\nNo renders in out/ for these labs — nothing to purge.');
    process.exit(0);
  }
  const rsz = renderFiles.reduce((s, f) => s + statSync(path.join(root, f)).size, 0);
  console.log(`\nAbout to delete ${renderFiles.length} render files in out/ (${fmt(rsz)}). deliverables/ is untouched.`);
  if (!opt('--yes')) {
    const rl = readline.createInterface({input: process.stdin, output: process.stdout});
    const ans = (await rl.question('Type "delete" to confirm: ')).trim();
    rl.close();
    if (ans !== 'delete') {
      console.log('Purge skipped.');
      process.exit(0);
    }
  }
  for (const f of renderFiles) unlinkSync(path.join(root, f));
  console.log(`Deleted ${renderFiles.length} files, reclaimed ${fmt(rsz)}.`);
}
