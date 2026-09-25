// The course palette: the WWT design system (user decision, 2026-09-25), on
// a navy ground. This file overrides the runtime's theme.ts and keeps every
// name it exports, so the terminal kit, cards, and older components compile
// unchanged with WWT values. Roles and contrast: sketch/palette.ts and
// .claude/references/sketch-style.md.
import {WWT} from './sketch/palette';

export {INK, WWT} from './sketch/palette';

export const ACCENT = WWT.blue50; // 7.2:1 on navy
export const DANGER = WWT.red50; // 6.1:1; always with a drawn cross or the word
export const SUCCESS = WWT.positive; // 4.6:1; bold strokes and check marks only
export const WARNING = WWT.gold; // 10.0:1
export const LINE = 'rgba(255,255,255,0.92)';
export const FONT_STACK =
  '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
export const MONO_STACK = '"SF Mono", "Menlo", "Monaco", "Consolas", "Liberation Mono", monospace';
export const PANEL_BG = 'rgba(17, 18, 46, 0.92)'; // navy-ink
// Terminal / editor surface: near-black ink, so it reads as a real shell
// window on the navy ground (give it a 2 px border at white 30-40%).
export const TERM_BG = 'rgba(18, 18, 18, 0.97)';
export const TERM_BAR = 'rgba(29, 30, 72, 0.98)';
// GIFs and reference cards: a flat ground, no falloff or grain.
export const GROUND = WWT.navy;
