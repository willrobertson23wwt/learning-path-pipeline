## Content pipeline

Content hierarchy (lab-first): a **path** is Module 0 (a standalone
briefing video), a sequence of **labs** with
fading guidance, and a **capstone**. Each lab is its own WWT lab repo split
into module pages, and its steps embed **media**: silent looping GIFs,
30-90 s narrated micro-videos, reference cards (inline at the step that
first needs them), and predict prompts (media types and rules in
`.claude/house-style.md` "Lab-first design"). How many labs, module pages
per lab, and media items a path has is not fixed: `/outline`'s researcher
suggests shapes from how comparable paths and labs are sized, and the user
picks.

Every media item has an ID from the outline (`<prefix>-briefing`,
`<prefix>-lN-vK` micro-video, `<prefix>-lN-gK` GIF, `<prefix>-card-<name>`)
that names its script, its audio folder, its composition, and its
deliverable. A narrated item is one ElevenLabs request → one
`narration.mp3` → one composition → one MP4 plus a caption file.

New paths flow through these skills in `.claude/skills/`, each stopping for
user review; never run the next stage unprompted:

1. `/outline <topic>` → `courses/<slug>/outline.md` (frontmatter: `slug`,
   `prefix`, `status: draft|approved`), a lab-first path plan with a module
   list per lab and a media inventory. Interactive: scope questions,
   research findings and suggested shapes, a skeleton to approve, then the
   full draft.
2. `/scripts <slug> [lab]` → `courses/<slug>/scripts/NN-<lab-slug>/<media-id>.md`:
   narration above a `## Visual brief` heading for videos and the briefing, a
   `## Loop spec` for GIFs, a `## Card layout` for cards. Frontmatter
   `folder:` (the media ID) names the `public/chapters/<folder>/` dir.
3. `/audio <slug> [lab]` → `scripts/generate-audio.mjs` (ElevenLabs, key +
   voice ID in `.env`) writes each narrated item's `narration.mp3`, then
   `scripts/transcribe.mjs` for timings and `scripts/captions.mjs --script`
   for its `narration.vtt` (cue text from the spec, phonetic spellings mapped
   back to real syntax by `courses/<slug>/caption-map.json`).
4. `/video <slug> <lab>` → the per-media workflow below for every item in
   that lab: MP4 + VTT for videos, MP4 + PNG poster for GIFs, PNG for cards.
5. `/lab <slug> <lab | capstone | 0>` → the lab's WWT repo draft in
   `labs/<lab-slug>/` (or the path page for `0`), then `/lab-review`,
   `/lab-topology`, `/lab-build`, and `/lab-setup`.

**Agents** (`.claude/agents/`): `researcher` does cited web research before
writing: `/outline` surveys lab platforms, other learning paths, and cert
objectives for gaps and suggested shapes; `/scripts` and `/lab` share one
brief per lab that fact-checks its steps and predict outcomes.
Briefs land in `courses/<slug>/research/` and are reused (rules in
`.claude/house-style.md` "Research briefs"). `script-linter` checks media
specs before any audio is generated (`/scripts`, `/audio`, `/produce` call
it). `/video` runs `article-writer` in the background for standalone
videos; for each narrated video, `video-designer` (the shot list, no
tools), `sketch-builder` (draws it and builds the composition),
`sound-engineer` (music, effects, levels), and on demand `manim-builder`
or `blender-builder` for exact pieces; one `media-builder` per GIF or card
in parallel; and `stills-reviewer` on each item's stills before it
renders. `prose-checker` rereads every saved
piece of learner prose after the author's own unslop pass. `/lab-review`
runs `lab-walker` (the review itself, in a fresh context) and then
`lab-learner` (follows the learner pages literally, never sees SETUP.md or
this lab's predict answers) alongside `prose-checker`. Parallel agents share one working tree (no worktrees): each writes only its own
files, and the main thread owns `Root.tsx`, shared components, the outline,
CLAUDE.md, `caption-map.json`, and all final renders.

**Prose quality pass:** `.claude/skills/unslop/SKILL.md` (adapted from
cursor/plugins' `unslop`) strips AI tells from learner-facing prose. `/scripts`,
`/article`, `/lab` and `/outline` run it as their last step before saving;
`/unslop <path>` runs it on any file by hand. Its "Course content" section lists
the exceptions (the standalone video close, TTS phonetic spellings in
narration, Title Case titles and WWT lab headings, terse card labels).

Optional fast path: `/produce <slug> <lab>` runs stages 3 + 4 for named labs
in one shot (user opt-in; skips the listen-first stop, specs must already be
reviewed and the outline approved).

**Articles are for standalone videos only.** The briefing, and any video the
outline marks `standalone`, gets a companion article: `/article <slug>
<media-id>` → `courses/<slug>/articles/<media-id>.md` (git-tracked, sourced
from the spec; real syntax, never the narration's phonetic spellings).
Embedded micro-videos and GIFs get none; the lab page around them is the
written lesson, and their captions carry the narration.

**Deliverables go to** `deliverables/` in this repo as `<media-id>.mp4`,
`.vtt`, or `.png` (gitignored); a GIF delivers an `.mp4` and its `.png`
poster. `/video` also copies each file into the lab repo's `media/module-N/`
folder for the module that embeds it (a card goes to the module that first
uses it) when the outline names the repo (`**Lab repo:** <lab-slug>`).
Overlay .mov files are not delivered.

**Closing out:** when a path (or a range of its labs) is finished and handed
off, `/closeout <slug> [N-M]` runs `scripts/closeout.mjs` to bundle the
deliverables, source narration, transcripts and captions, specs, articles,
and research briefs into one dated zip under `archives/` (gitignored) with a
manifest, verifies it, and only then, on explicit confirmation, deletes the
multi-GB `out/` renders for those labs. See `.claude/skills/closeout/SKILL.md`.

**Marketing one-offs:** `/labdrop <learning path>` builds an ATC Lab Drop
promo video (music-synced brand sting, VO slides, WWT end card), a separate
workflow from path media with its own conventions and asset set
(`public/labdrop/`); see `.claude/skills/labdrop/SKILL.md`. Worked example:
`LabDrop` in the Linux Intermediate course repo's `src/LabDrop.tsx`.

**Labs:** one WWT lab repo per outline lab, plus one for the capstone.
Every lab has the same page set; only the number of module pages varies,
and it comes from the outline's module list for that lab. The final module
closes the lab (Workflow Summary plus Congratulations), with no conclusion
page. A lab with more than one device adds a `_quickref_passwords.md` page
(Device, Management IP, Method(s), Username, Password). Reference cards sit
inline in the module step that first needs them, image plus text version.
The capstone repo reads like any other lab, but as a challenge: goals
instead of walk-through steps, with each problem's full solution collapsed
inline under it and all the solutions again on a `solutions.md` page after
the last module; no other lab has one.
Lab pages follow the linux-intermediate lab conventions (see
`.claude/style-guide.md` "Lab pages").
`/lab` drafts the guide with the path's media embedded at their steps,
the outline's guidance level, and the build checklist in SETUP.md;
`/lab-review` cleans it up before the VM exists and `/lab-topology` draws
the environment diagram. Labs live in `labs/<lab-slug>/` while drafting and
publish to their own GitHub repo each; the course repo ignores `labs/`.
Once a lab is reviewed, `/lab-build <lab-slug>` plans the vCloud Director vApp for it
in Lab Builder (a separate repo: golden images, networks, gateway VM, edge firewall from
SETUP.md's table) and stops at `terraform plan`; the user builds from there.
Once the vApp exists, `/lab-setup <lab-slug> <vapp-address>` builds the lab guests over SSH
from SETUP.md and dry-runs the lab on them.

## Per-media workflow

1. For a narrated item (video or briefing), `/audio` has already written
   `public/chapters/<media-id>/narration.mp3`, its
   `narration.transcript.json` (word-level timings via whisper.cpp), and its
   `narration.vtt`. If the transcript is missing, run
   `node scripts/transcribe.mjs public/chapters/<folder>/narration.mp3`, then
   `node scripts/captions.mjs` on the transcript with `--map` and
   `--script`. GIFs and cards need only their spec.
2. Map narration cues (or the loop spec's beat times) → beats, build the item
   per its spec (`courses/<slug>/scripts/NN-*/<media-id>.md`), register it in
   `src/Root.tsx` under the outline's composition ID.
3. Typecheck → render stills at each beat to verify → render the MP4 (plus a
   GIF's poster PNG) or the card PNG → check the captions and the warnings
   `captions.mjs` printed → copy out.
