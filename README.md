# Learning-path pipeline

A complete starter template for producing IT-training learning paths with
Claude Code: the Remotion motion-graphics toolkit, the ElevenLabs and
whisper.cpp helper scripts, the `CLAUDE.md` instruction set, and the
slash-command skills that take a topic from outline to rendered chapters,
companion articles, and hands-on lab guides. Built on a Linux course; written
here so the same pipeline produces a Windows Server, PowerShell, Cisco, or
cloud learning path without changing the skills.

## Quick start

```bash
git clone <this repo> learning-path-pipeline
cd learning-path-pipeline
export PATH="$HOME/.nvm/versions/node/$(ls ~/.nvm/versions/node | tail -1)/bin:$PATH"
npm ci
cp .env.example .env            # add your ElevenLabs key + voice ID
npx tsc --noEmit
npx remotion still ExampleCh1 out/smoke.png --frame=300
```

If the still renders, the toolkit works on your machine. Then open a Claude
Code session here and run `/new-path <topic>`. It copies everything into a
sibling folder for the new course, sets the package name, and inits git. All
course work happens in that folder, never in this one.

## What is in this repo

| Path | What it is |
|---|---|
| `CLAUDE.md` | Project instructions Claude Code loads. Platform-neutral except the **Platform profile** section, which each course fills in. |
| `.claude/skills/new-path` | `/new-path <topic>` scaffolds a new course folder from this repo. The only skill that runs here. |
| `.claude/skills/outline` | `/outline <topic>` writes `courses/<slug>/outline.md`. |
| `.claude/skills/scripts` | `/scripts <slug> [N]` writes narration + visual brief per chapter. |
| `.claude/skills/audio` | `/audio <slug> [N]` generates ElevenLabs MP3s and whisper word timings. |
| `.claude/skills/video` | `/video <slug> N` builds and renders the Remotion chapters, writes the article. |
| `.claude/skills/produce` | `/produce <slug> N` runs audio + video for one video in one shot. |
| `.claude/skills/article` | `/article <slug> N` writes the written alternative to a video. |
| `.claude/skills/unslop` | `/unslop <path>` strips AI tells from learner-facing prose. Other skills call it. |
| `.claude/skills/lab` | `/lab <slug> M` drafts a module's lab guide in WWT mkdocs format, plus internal SETUP.md and SUPPORT.md. |
| `.claude/skills/lab-review` | `/lab-review <lab-slug>` documentation-only cleanup of a drafted lab before the VM exists. |
| `.claude/skills/lab-topology` | `/lab-topology <lab-slug>` draws the lab's environment SVG. Includes a single-VM template. |
| `.claude/skills/labdrop` | `/labdrop <learning path>` builds the ATC Lab Drop promo video. |
| `src/components/` | The shared toolkit: `theme.ts`, `layout.tsx` (Studio props schema plumbing), `TitleCard`, `ThankYouCard`, `Backdrop` (paper + fluid loop), `HudIcon` (Lottie badges), `terminal/kit.tsx` (`TermWindow`, type-on, pills, easing helpers), `BulletList`, `LowerThird`, `PrinciplePanel`, `Waveform`, `icons/`. |
| `src/ExampleCh1.tsx`, `src/components/example-ch1/`, `public/chapters/example-ch1/` | One complete worked chapter (bespoke, schema-driven, with its narration and transcript). Renders as `ExampleCh1`. Every convention in `CLAUDE.md` points at it. |
| `src/Chapter.tsx`, `src/types.ts`, `src/chapters/example-generic/` | The generic data-driven chapter pattern (`timeline.json` of cues) for simple title/bullet chapters. |
| `src/Root.tsx`, `src/constants.ts`, `src/index.ts` | Composition registry with the `audioMetadata` helper, `FPS` and buffer constants, entry point. |
| `public/backgrounds/` | The paper texture and dark fluid loop `Backdrop` uses. |
| `scripts/` | `generate-audio.mjs` (ElevenLabs), `transcribe.mjs` (whisper.cpp timings), `lab-terminal-shot.py` (portal-look terminal screenshots), `prepare-hud.mjs` (Lottie icon prep). |
| `package.json`, `package-lock.json`, `tsconfig.json`, `remotion.config.ts`, `.env.example` | Pinned toolchain. zod must stay at 4.3.6 for `@remotion/zod-types`. |

## Prerequisites

- Node via nvm (the skills spell out the PATH export).
- An ElevenLabs API key and voice ID in `.env`.
- whisper.cpp installs itself on the first `transcribe.mjs` run.
- Google Chrome for `lab-terminal-shot.py` and the topology render check.
- Adobe Premiere on the editing side; the pipeline delivers MP4s for it.
- A licensed stock-asset library (Envato or similar) for icons, backdrops,
  and Lab Drop music; its path goes in `CLAUDE.md`. Not included here.

## How a course starts

1. Here: `/new-path <topic>`. The skill copies the repo (minus `.git`,
   `node_modules`, `out`, and itself) to `../<slug>/`, sets the package name,
   fills in the `CLAUDE.md` title and Platform profile from what you tell it,
   installs, typechecks, renders the smoke still, and inits git.
2. In the new folder: `/outline <topic>`, review, set `status: approved`.
3. `/scripts <slug>`, review the narration and visual briefs.
4. `/audio <slug> N`, listen. `/video <slug> N`, review the MP4s. Or
   `/produce <slug> N` for both in one shot once you trust the scripts.
5. `/lab <slug> M` for each module's lab, then `/lab-review` and
   `/lab-topology`.

Nothing advances automatically. Each stage stops for review.

## How vendor-neutrality works

The skills never hard-code a shell, a prompt, or an OS. Where a rule depends
on the platform, the skill says "per the platform profile in CLAUDE.md" and
gives one example per family (bash, PowerShell, device CLI):

- **Narration** spells commands the way the voice should say them and puts
  real syntax in the visual brief. The phonetic list of names the TTS mangles
  lives in the platform profile, so a PowerShell course grows its own list.
- **Terminal panels** (`TermWindow`) are a generic dark console. The prompt
  string and syntax colors are set per chapter.
- **Articles and labs** tag code blocks with the platform's language
  (`bash`, `powershell`, `text` for device CLIs).
- **Lab guides** take the environment default, the credentials row, the
  prompt for rendered screenshots, the "first elevated command" note, and
  the output-trimming rule from the profile. GUI-driven steps get a
  screenshot placeholder per dialog.
- **Lab review** keeps its Linux-derived checklist as the example set and
  adds a "Platform equivalents" section (PowerShell, Cisco IOS, web
  consoles) as the starting point for translating each check.
- **Cross-video callbacks** describe the concept ("the PATH lesson from the
  scheduling video"), never a video number.

What stays WWT-specific on purpose: the ATC Lab Portal access model (one
browser tab per device), the WWT logo and mkdocs format in labs, the
`SETUP.md`/`SUPPORT.md` internal files, and the Lab Drop branding.

## Where this came from

The toolkit and skills were built across two Linux courses in the
`remotion-training-graphics` and `linux-intermediate` repos. This repo
replaces the first as the template: the shared components and helper scripts
are the newer `linux-intermediate` versions, the worked example is that
course's first chapter renamed, and the per-video course log that lived in
its `CLAUDE.md` was distilled into the platform-neutral **Lessons learned**
section. Course-specific chapters, audio, and the raw Envato icon pack were
left behind on purpose.
