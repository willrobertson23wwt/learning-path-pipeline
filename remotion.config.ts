import {Config} from '@remotion/cli/config';
import {enableTailwind} from '@remotion/tailwind-v4';

Config.setEntryPoint('src/index.ts');
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(enableTailwind);

// Course backgrounds band after encoding at the default JPEG quality (80);
// 95 keeps the smooth falloff clean (li-v6-ch1 pilot, 2026-09-24).
Config.setJpegQuality(95);
