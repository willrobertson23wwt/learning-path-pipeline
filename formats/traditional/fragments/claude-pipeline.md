## Content pipeline

Content hierarchy (traditional): a **path** is organized into **modules**
(typically 4-6), each with 4-6 **videos** and a closing hands-on **lab**. A
video is about 4-6 minutes of narration (550-850 words; a default, not a
cap: a genuinely complex topic may run longer, a simple one shorter), split
into 2-4 **chapters** of about 60-120 s of narration each; the screencast
footage the user records and cuts in between chapters adds to the finished
video. Videos are numbered globally across
modules. An optional marketing-style **intro** video (about 1 min, video 0)
and a **review** video close out the path. Rules and research:
`.claude/house-style.md` "Traditional course design". How many modules,
videos, and labs a path has is not fixed: `/outline`'s researcher suggests
shapes from comparable video courses and certification objectives, and the
user picks.

Every chapter has an ID from the outline: `<prefix>-vN-chM` (video N,
chapter M), with `<prefix>-vN-intro` for a video's chapter 0. The ID names
its script, its audio folder (`public/chapters/<id>/`), its composition
(`<Prefix>V<N>Ch<M>`, PascalCase), and its deliverable. The path's intro
video (video 0) and review video (the next number after the last core
video) are one chapter each: folders `<prefix>-intro` and `<prefix>-review`,
scripts `00-path-intro/01-full.md` and `NN-review/01-full.md`, compositions
`<Prefix>Intro` and `<Prefix>Review`. A chapter is one ElevenLabs request → one
`narration.mp3` → one composition → one MP4 plus a caption file. A video's
**chapter 0** (`00-intro.md`) is narration only: it plays over the user's
custom intro footage and gets audio but no composition.

New paths flow through these skills in `.claude/skills/`, each stopping for
user review; never run the next stage unprompted:

1. `/outline <topic>` → `courses/<slug>/outline.md` (frontmatter: `slug`,
   `prefix`, `status: draft|approved`): modules, videos with their chapters
   (key points and visual moments), and each module's lab. Interactive:
   scope questions, research findings and suggested shapes, a skeleton to
   approve, then the full draft.
2. `/scripts <slug> [video]` →
   `courses/<slug>/scripts/NN-<video-slug>/MM-<chapter-slug>.md` (plus
   `00-intro.md` per video): narration above a `## Visual brief` heading.
   Frontmatter `folder:` (the chapter ID) names the `public/chapters/<folder>/`
   dir.
3. `/audio <slug> [video]` → `scripts/generate-audio.mjs` (ElevenLabs, key +
   voice ID in `.env`) writes each chapter's `narration.mp3`, then
   `scripts/transcribe.mjs` for timings and `scripts/captions.mjs --script`
   for its `narration.vtt` (cue text from the script, phonetic spellings
   mapped back to real syntax by `courses/<slug>/caption-map.json`).
4. `/video <slug> <video | first-last>` → the per-chapter workflow below for
   every chapter of that video (chapter 0 excepted): one MP4 + VTT per
   chapter, and the video's companion article.
5. `/lab <slug> <module>` → the module's closing lab as a WWT lab repo draft
   in `labs/<lab-slug>/`, then `/lab-review`, `/lab-topology`, `/lab-build`,
   and `/lab-setup`.

**Agents** (`.claude/agents/`): `researcher` does cited web research before
writing: `/outline` surveys comparable video courses, certification
objectives, and vendor docs for coverage, gaps, and suggested shapes;
`/scripts` and `/lab` share one brief per module
(`courses/<slug>/research/module-N-<module-slug>.md`) that fact-checks its
commands, outputs, and claims. Briefs land in `courses/<slug>/research/` and
are reused (rules in `.claude/house-style.md` "Research briefs").
`script-linter` checks chapter scripts before any audio is generated
(`/scripts`, `/audio`, `/produce` call it). For each video, `/video` runs
`video-designer` (one shot list per chapter, the video's continuity across
chapters, no tools), `sketch-builder` (draws each chapter and builds its
composition), `sound-engineer` (one music track per chapter, effects,
levels), and on demand `manim-builder` or `blender-builder` for exact
pieces, then `stills-reviewer` on each chapter's stills before it renders,
and `article-writer` in the background for the video's article.
`prose-checker` rereads every saved piece of learner prose after the
author's own unslop pass. `/lab-review` runs `lab-walker` (the review itself,
in a fresh context) and then `lab-learner` (follows the learner pages
literally, never sees SETUP.md) alongside `prose-checker`. Parallel agents share one working tree (no worktrees), so each writes only its own
files, and the main thread owns `Root.tsx`, shared components, the outline,
CLAUDE.md, `caption-map.json`, and all final renders.

**Prose quality pass:** `.claude/skills/unslop/SKILL.md` (adapted from
cursor/plugins' `unslop`) strips AI tells from learner-facing prose.
`/scripts`, `/article`, `/lab` and `/outline` run it as their last step
before saving; `/unslop <path>` runs it on any file by hand. Its "Course
content" section lists the exceptions (the video close line, TTS phonetic
spellings in narration, Title Case titles and WWT lab headings).

Optional fast path: `/produce <slug> <video>` runs stages 3 + 4 for one
video in one shot (user opt-in; skips the listen-first stop, scripts must
already be reviewed and the outline approved).

**Every video gets a companion article:** `/article <slug> <video>` →
`courses/<slug>/articles/NN-<video-slug>.md`, a self-contained written
alternative so a learner can read the lesson instead of watching it
(git-tracked, sourced from the chapter scripts; real syntax, never the
narration's phonetic spellings). `/video` and `/produce` write it as part of
delivering a video. The intro video (a trailer) gets none unless the user
asks; the review video gets one.

**Deliverables go to** `deliverables/` in this repo as `<chapter-id>.mp4`
and `<chapter-id>.vtt` (gitignored), one pair per chapter, plus chapter 0
as `<prefix>-vN-intro.mp3` and `.vtt`; the user assembles each video in
Premiere (chapter 0's audio over the custom intro, then the chapters
between screencast segments, crossfading the chapters' music). Each video's
catalog description lives on its `- **Description:**` line in the outline. Overlay .mov files are not
delivered.

**Closing out:** when a path (or a range of its videos) is finished and
handed off, `/closeout <slug> [N-M]` runs `scripts/closeout.mjs` to bundle
the deliverables, source narration, transcripts and captions, scripts,
articles, and research briefs into one dated zip under `archives/`
(gitignored) with a manifest, verifies it, and only then, on explicit
confirmation, deletes the multi-GB `out/` renders for those videos. See
`.claude/skills/closeout/SKILL.md`.

**Marketing one-offs:** `/labdrop <learning path>` builds an ATC Lab Drop
promo video (music-synced brand sting, VO slides, WWT end card), a separate
workflow from path media with its own conventions and asset set
(`public/labdrop/`); see `.claude/skills/labdrop/SKILL.md`. Worked example:
`LabDrop` in the Linux Intermediate course repo's `src/LabDrop.tsx`.

**Labs:** one WWT lab repo per module, exercising the skills that module's
videos taught (plus reasonable prerequisites from earlier modules). Every
lab has the same page set; only the number of module pages varies (2-4,
each a 10-20 minute exercise), and the outline sets it on the lab's
`- **Modules:**` line under its `**Lab:**` entry. The final module page closes the lab
(Workflow Summary plus Congratulations), with no conclusion page. A lab with
more than one device adds a `_quickref_passwords.md` page (Device,
Management IP, Method(s), Username, Password). Lab pages follow the
linux-intermediate lab conventions (see `.claude/style-guide.md` "Lab
pages"). `/lab` drafts the guide and the build checklist in SETUP.md;
`/lab-review` cleans it up before the VM exists and `/lab-topology` draws
the environment diagram. Labs live in `labs/<lab-slug>/` while drafting and
publish to their own GitHub repo each; the course repo ignores `labs/`.
Once a lab is reviewed, `/lab-build <lab-slug>` plans the vCloud Director
vApp for it in Lab Builder (a separate repo: golden images, networks,
gateway VM, edge firewall from SETUP.md's table) and stops at `terraform
plan`; the user builds from there. Once the vApp exists, `/lab-setup
<lab-slug> <vapp-address>` builds the lab guests over SSH from SETUP.md and
dry-runs the lab on them.

## Per-chapter workflow

1. `/audio` has already written `public/chapters/<chapter-id>/narration.mp3`,
   its `narration.transcript.json` (word-level timings via whisper.cpp), and
   its `narration.vtt`. If the transcript is missing, run
   `node scripts/transcribe.mjs public/chapters/<folder>/narration.mp3`, then
   `node scripts/captions.mjs` on the transcript with `--map` and `--script`.
2. The video designer's shot list for the chapter (`out/<chapter-id>/design.md`,
   approved by the user) and its resolved `public/chapters/<chapter-id>/beats.json`
   drive the build; register the chapter in `src/Root.tsx` as
   `<Prefix>V<N>Ch<M>` (and `-Overlay`).
3. Typecheck → render stills at each beat to verify → render the MP4 →
   rebuild the captions on the chapter's timeline (`captions.mjs` with
   `--beats public/chapters/<chapter-id>/beats.json`, since the holds move
   every cue after them) and read its warnings → the sound engineer's
   loudness check → copy out.

Every chapter is a standalone composition the editor places between
screencast segments, so every chapter has the Premiere end buffer below
(about 2 s of ground only after its last beat). Chapter 1 of a video opens
on its title card over the title light ("<Chapter title>" with "Chapter 1 ·
<Video title>"); every later chapter opens on its own chapter title card the
same way. The video's last chapter closes with the video-close line and the
thank-you card, which holds to the end in place of the ground-only tail.
