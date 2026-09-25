// Render many stills of one composition from a single bundle (remotion still
// re-bundles the whole project on every call).
//   node scripts/stills.mjs <CompositionId> <outDir> <frame,frame,...> [--props '<json>']
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

const [id, outDir, frameList] = process.argv.slice(2);
if (!id || !outDir || !frameList) {
  console.error("Usage: node scripts/stills.mjs <CompositionId> <outDir> <f1,f2,...> [--props '<json>']");
  process.exit(1);
}
const propsIdx = process.argv.indexOf('--props');
const inputProps = propsIdx === -1 ? {} : JSON.parse(process.argv[propsIdx + 1]);
const frames = frameList.split(',').map(Number);

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id, inputProps});
mkdirSync(outDir, {recursive: true});
for (const frame of frames) {
  const output = path.join(outDir, `f${frame}.png`);
  await renderStill({serveUrl, composition, frame, output, inputProps});
  console.log(output);
}
