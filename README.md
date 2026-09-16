# Learning-path pipeline: CLAUDE.md + skills

The Claude Code instruction set and slash-command skills used to produce
IT-training learning paths: a course outline, per-chapter narration scripts,
ElevenLabs audio with word timings, Remotion motion-graphics chapters rendered
to MP4, a companion article per video, and the hands-on lab guide for each
module. Built on a Linux course; written here so the same pipeline produces a
Windows Server, PowerShell, Cisco, or cloud learning path without changing the
skills.

## What is in this repo

| Path | What it is |
|---|---|
| `CLAUDE.md` | Project instructions Claude Code loads in the learning-path repo. Platform-neutral except the "Platform profile" section you fill in. |
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
| `scripts/` | The helpers the skills call: `generate-audio.mjs` (ElevenLabs), `transcribe.mjs` (whisper.cpp timings), `lab-terminal-shot.py` (portal-look terminal screenshots), `prepare-hud.mjs` (Lottie icon prep). |
| `.env.example` | The two ElevenLabs variables `generate-audio.mjs` needs. |

## Prerequisites

The skills assume they live inside a Remotion project scaffolded from the
`remotion-training-graphics` template (ask Will Robertson for access). That
template supplies `package.json`, `src/Root.tsx`, `src/components/` (theme,
`TermWindow` toolkit, backdrops, `TitleCard`, `ThankYouCard`, layout schema
plumbing), `public/backgrounds/`, and the worked-example chapters the skills
point at. This repo does not duplicate those; it carries only the
instructions and the helper scripts.

You also need:

- Node via nvm (the skills spell out the PATH export), Remotion, zod 4.3.6.
- An ElevenLabs API key and a voice ID in `.env`.
- whisper.cpp is installed on first run by `transcribe.mjs`.
- Google Chrome for `lab-terminal-shot.py` and the topology render check.
- Adobe Premiere on the editing side; the pipeline delivers MP4s for it.

## Set up a new learning path

1. In the template repo run `/new-path <topic>`. It creates a sibling folder
   with the toolkit and inits git.
2. Copy this repo's `.claude/skills/` and `scripts/` over the copies in the
   new folder (this repo is the newer version of both), and replace the new
   folder's `CLAUDE.md` with this one.
3. In `CLAUDE.md`, set the title and fill in the **Platform profile** section:
   platform, prefix, shell and prompt, elevation model, lab environment
   default, TTS phonetic list, output-trimming rule, placeholder conventions.
   That section is the only place platform choices live; every skill reads
   it from there.
4. Open a Claude Code session in the new folder and run `/outline <topic>`.
   Each stage stops for your review before the next.

## How vendor-neutrality works

The skills never hard-code a shell, a prompt, or an OS. Where a rule depends
on the platform, the skill says "per the platform profile in CLAUDE.md" and
gives one example per family (bash, PowerShell, device CLI). Specifically:

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
  scheduling video"), never a video number, on every platform.

What stays WWT-specific on purpose: the ATC Lab Portal access model (one
browser tab per device), the WWT logo and mkdocs format in labs, the
`SETUP.md`/`SUPPORT.md` internal files, and the Lab Drop branding.

## Where the Linux course's history went

The original `CLAUDE.md` carried a per-video "Course Status" log for 27
Linux videos. That log is course memory and stays in the course repo. The
recurring layout, timing and audio gotchas from it were distilled into the
platform-neutral **Lessons learned** section of this `CLAUDE.md`, and the
"Course Status" section here is an empty template with the entry shape to
follow.
