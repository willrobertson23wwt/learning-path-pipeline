# <Learning Path Name>

<!--
  This is the shared, vendor-agnostic CLAUDE.md for lab-first learning paths.
  It lives in the templates (learning-path-pipeline, and the lab-first
  template folder with TEMPLATE.md), and every new path starts from a copy.
  To start one (Linux, Windows Server, PowerShell, Cisco, Azure, anything
  with a CLI or console to teach):

  1. Run `/new-path <topic>` from a template. It copies the Remotion
     toolkit, skills, agents, scripts and worked examples into a sibling
     folder and inits git.
  2. Replace the title above with the learning path's name.
  3. Fill in the "Platform profile" section below. Everything else in this
     file is platform-neutral and should not need edits.
  4. Append to "Course Status" as media and labs ship. That section is the
     running memory of what was built and what was learned, and it is the
     part of this file that is specific to your path.

-->

A **lab-first learning path**: the labs are the course. Learners spend most
of their time at the terminal or console, and each lab step embeds the help
it needs: a looping GIF before a step, a 30-90 s narrated micro-video after a
predict step, a static reference card for lookup, and a briefing video before
the first lab. Guidance fades lab by lab, a pre-check lets experienced
learners skip ahead, and a capstone with auto-checks closes the path. The
rules and the research behind them are in `.claude/house-style.md`
"Lab-first design"; `linux-filesystem-path.md` is the worked example of a
whole path.

The media is built with Remotion from ElevenLabs narration: audio-synced
motion graphics, rendered as MP4s (dark background, audio baked in) and, for
GIFs, as muted looping MP4s with a PNG poster. The Remotion toolkit and its
worked example chapter (`src/ExampleCh1.tsx`, `src/components/example-ch1/`,
`public/chapters/example-ch1/`, composition `ExampleCh1`) come from the
`learning-path-pipeline` repo; the example is the pattern reference for the
conventions below until the path has media of its own. Every chapter still
registers a `-Overlay` composition (transparent ProRes 4444, alpha channel),
but overlay renders are **not produced by default**, only if the user asks.

## Platform profile (fill in per learning path)

The skills read this section when a rule depends on the platform being taught.
Keep it short; one line each.

- **Platform / vendor:** <e.g. Ubuntu 24.04 · Windows Server 2025 + PowerShell 7 ·
  Cisco IOS-XE 17>
- **Course prefix:** <two or three letters from the outline frontmatter, e.g.
  `lf`, `ps`, `cs`>; media IDs are `<prefix>-briefing`, `<prefix>-lN-vK`,
  `<prefix>-lN-gK`, `<prefix>-card-<name>`, and composition IDs the same in
  PascalCase (`LfL3V1`).
- **Shell / console shown on screen:** <bash · PowerShell · IOS privileged
  EXEC>; fenced-block language tag in articles and labs: <`bash` · `powershell`
  · `text`>.
- **Prompt as rendered in terminal panels and lab screenshots:**
  <`labuser@host:~$ ` · `PS C:\Users\labuser> ` · `Router#`>.
- **Elevation model (for the lab's "first elevated command" note):** <`sudo`
  with a password prompt · "Run as administrator" / UAC · `enable` mode>.
- **Lab environment default:** <e.g. one Ubuntu 24.04 VM, browser terminal via
  the WWT ATC Lab Portal, `labuser` / `Labpass01!`>.
- **TTS model:** eleven_v3, stability <x>, seed <n> (matches `.env`).
- **Measured narration rate:** <N> wpm on <model>/<voice> (from the first
  approved take).
- **TTS phonetic list:** command and tool names ElevenLabs mangles when read
  bare, with the spelling to use in narration (e.g. `ss` → "ess ess",
  `sudo` → "soo-doh", `Get-ChildItem` → "Get Child Item", `sh` → "S H"), plus
  the path's spoken forms for flags, symbols, and numbers ("dash capital R",
  "pipe", "port four forty-three"), one reading for each platform word with
  two ("route", `etc`), and the acronym list (acronyms a take has proven the
  voice reads right in capitals; others are spaced, "D N S"). Add to it every
  time a retake is needed; `/scripts` reads it.
- **Output-trimming rule for shown command output:** what to drop from real
  output so learners see only what the lesson needs (Linux/Windows networking
  labs drop IPv6 and MAC rows; Cisco labs drop unrelated interfaces; keep
  commands as taught, trim only the output).
- **Placeholder conventions:** reserved/fictional IPs, hostnames, CVEs,
  tenant IDs, serial numbers only.

## Environment / gotchas

- **macOS with nvm: Node is NOT on PATH in non-interactive shells.** Prefix
  every command: `export PATH="$HOME/.nvm/versions/node/<version>/bin:$PATH"`
  (check `ls ~/.nvm/versions/node/` for the installed version; `nvm install
  node` upgrades change it). Windows installs (winget/nvm-windows) put `node`
  on PATH; no prefix needed there. Delete whichever line doesn't apply to
  your machine.
- Always run `npx`/`npm` from this project directory (a stray `npx tsc` outside it
  installs a bogus `tsc` package).
- `src/index.ts` imports `tailwind.css`; keep it even if no chapter uses
  Tailwind classes.

## Commands

```bash
export PATH="$HOME/.nvm/versions/node/<version>/bin:$PATH"   # macOS + nvm only
npm run studio                       # live preview editor in the browser
npx tsc --noEmit                     # typecheck (do this before rendering)
npx remotion still <Id> out/x.png --frame=N    # fast single-frame verification

# The deliverable (background + audio):
npx remotion render <Id> out/<name>-preview.mp4

# A GIF: muted looping MP4 plus a poster of the finished state (hold start x FPS):
npx remotion render <Id> out/<media-id>.mp4 --muted
npx remotion still <Id> out/<media-id>.png --frame=<finished-state frame>

# A reference card:
npx remotion still <Id> out/<media-id>.png --frame=0

# Captions: text from the spec's narration (map turns phonetic spellings back
# into real syntax), timings from the transcript; read the warnings it prints:
node scripts/captions.mjs public/chapters/<id>/narration.transcript.json \
  --map courses/<slug>/caption-map.json \
  --script courses/<slug>/scripts/NN-<lab-slug>/<id>.md

# Transparent overlay (alpha), ONLY if explicitly requested:
npx remotion render <Id>-Overlay out/<name>-overlay.mov \
  --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le \
  --image-format=png --muted
```

Composition IDs are registered in `src/Root.tsx`. If an overlay is rendered,
verify alpha with `npx remotion ffprobe out/x.mov | grep Stream` → expect
`yuva444p12le`.

## Licensed asset library (outside the repo)

Keep licensed stock assets (Envato or similar) in a folder outside the repo and
name its path here: `<path to your asset library>`. Useful categories: icon
packs as SVG/PNG (computer parts, data center, operating systems, cloud, network
devices, business people), 3D folder illustrations, dark animated backgrounds
(abstract loop, line particles, digital glitch grid: candidates to experiment
with alongside `PaperBackdrop`/`TransitionBackdrop`). Premiere `.mogrt`
templates (lower thirds, titles, arrows) are for the editor's Premiere timeline,
not usable in Remotion; prefer the SVG/PNG/video sources. To use an asset in a
composition, copy it into `public/` first (Remotion's `staticFile()` can't
reach outside the project).

## Content pipeline

Content hierarchy (lab-first): a **path** is Module 0 (a skip-ahead
pre-check, a standalone briefing video, and reference cards), a sequence of
**labs** with fading guidance, and a **capstone**. Each lab is its own WWT
lab repo, and its steps embed **media**: silent looping GIFs, 30-90 s
narrated micro-videos, reference cards, and predict prompts (media types and
rules in `.claude/house-style.md` "Lab-first design"). How many labs and
media items a path has is not fixed: `/outline`'s researcher suggests shapes
from how comparable paths are sized, and the user picks.

Every media item has an ID from the outline (`<prefix>-briefing`,
`<prefix>-lN-vK` micro-video, `<prefix>-lN-gK` GIF, `<prefix>-card-<name>`)
that names its script, its audio folder, its composition, and its
deliverable. A narrated item is one ElevenLabs request → one
`narration.mp3` → one composition → one MP4 plus a caption file.

New paths flow through these skills in `.claude/skills/`, each stopping for
user review; never run the next stage unprompted:

1. `/outline <topic>` → `courses/<slug>/outline.md` (frontmatter: `slug`,
   `prefix`, `status: draft|approved`), a lab-first path plan with a media
   inventory. Interactive: scope questions, research findings and suggested
   shapes, a skeleton to approve, then the full draft.
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
   `/lab-topology`, and `/lab-build`.

**Agents** (`.claude/agents/`): `researcher` does cited web research before
writing: `/outline` surveys lab platforms, other learning paths, and cert
objectives for gaps and suggested shapes; `/scripts` and `/lab` share one
brief per lab that fact-checks its steps, predict outcomes, and checks.
Briefs land in `courses/<slug>/research/` and are reused (rules in
`.claude/house-style.md` "Research briefs"). `script-linter` checks media
specs before any audio is generated (`/scripts`, `/audio`, `/produce` call
it). `/video` runs `article-writer` in the background for standalone
videos, one `media-builder` per item in parallel, and `stills-reviewer` on
each item's stills before it renders. `prose-checker` rereads every saved
piece of learner prose after the author's own unslop pass. `/lab-review`
runs `lab-walker` (the review itself, in a fresh context) and then
`lab-learner` (follows the learner pages literally, never sees SETUP.md or
this lab's predict answers) alongside `prose-checker`. The repo isn't under
git, so parallel agents share the working tree: each writes only its own
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
poster. `/video` also copies each file into
the lab repo's media folder when the outline names the repo
(`**Lab repo:** <lab-slug>`). Overlay .mov files are not delivered.

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
`/lab` drafts the guide with the path's media embedded at their steps,
the outline's guidance level, and portal checks in SETUP.md;
`/lab-review` cleans it up before the VM exists and `/lab-topology` draws
the environment diagram. Labs live in `labs/<lab-slug>/` while drafting and
publish to their own GitHub repo each; the course repo ignores `labs/`.
Once a lab is reviewed, `/lab-build <lab-slug>` plans the vCloud Director vApp for it
in Lab Builder (a separate repo: golden images, networks, gateway VM, edge firewall from
SETUP.md's table) and stops at `terraform plan`; the user builds from there.

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

## Architecture

Every media item is a composition. Videos and the briefing use the patterns
below; a GIF is a fixed-length silent composition (1280x720, `durationInFrames`
= its spec's length x `FPS`, flat dark background) whose beat table comes
from its loop spec; a card is a one-frame 1920x1080 composition rendered with
`remotion still`. The toolkit's code calls a video composition a "chapter"
(`Chapter.tsx`, `ExampleCh1`); read "chapter" below as one video. Two
patterns coexist for videos:

- **Generic, data-driven** (`src/Chapter.tsx` + a `timeline.json` per chapter;
  `src/chapters/example-generic/timeline.json` is the shape): a `timeline.json` lists cues
  (`title`, `lowerThird`, `bullets`, `principle`) with `start`/`duration` in
  seconds. Good for simple title/bullet chapters.
- **Bespoke per-chapter** (the usual choice; worked example: `src/ExampleCh1.tsx`
  + `src/components/example-ch1/`): all panels render inside one
  `<Sequence from={offset}>` so `useCurrentFrame()` equals the audio frame, and
  each panel self-gates on a beat-timing table `T` (seconds) in the chapter's
  `kit*.ts`. The reusable terminal toolkit lives at
  `src/components/terminal/kit.tsx`: `TermWindow`, `typedText` (type-on),
  `Cursor`, `Pill`, `Padlock`, `Check`, `appear`/`fadeInOut` easing helpers.
  `TermWindow` is a generic dark console panel: it renders a bash prompt, a
  PowerShell prompt, an IOS prompt, or a config-file editor equally well. The
  prompt string and syntax colors are yours to set per chapter.

Shared: `src/components/theme.ts` (palette + font stacks), `TitleCard`,
`ThankYouCard`, `HudIcon` (Lottie badges), `scripts/prepare-hud.mjs`
(strips/recolors HUD callout JSON into `src/assets/hud/*.json`; rerun to add
icons).

`BUFFER_SECONDS` (in `src/constants.ts`) is **0**: clips start on frame 0 (audio +
graphics aligned) with no padding, since transitions are handled in Premiere directly.
`Root.tsx` still adds `2 * BUFFER_SECONDS` to each composition's duration, so bumping
the constant restores trim handles everywhere. **Don't use this constant for the end
buffer below.** It pads both start and end symmetrically with nothing to show; the
end buffer needs its own frames plus a fade-out beat, not silence.

**End buffer, by type.** An **embedded micro-video** plays inside a lab page
and stops on its last frame, so its final assembled beat holds, fully
readable, for the ~2 s of `END_BUFFER_SECONDS` with no fade-out. A
**standalone video** (the briefing) keeps the Premiere-style tail below. GIFs
return to frame 0's state instead (the loop point), and cards have no time
at all.

**End buffer for Premiere transitions (standalone videos):** the video holds
for ~2 s past its last narration beat before the composition ends. In that window, fade out the
foreground elements (panels, text, icons: everything the chapter added) but
keep the backdrop (`PaperBackdrop`/`TransitionBackdrop`) visible, so Premiere
has clean background-only frames at the tail to build a transition into.
Mechanically: `END_BUFFER_SECONDS = 2` in `src/constants.ts`; `Root.tsx`'s
`audioMetadata(audio, tailSeconds)` adds it ONCE for opted-in chapters (pass
`END_BUFFER_SECONDS` as the second arg, separate from `BUFFER_SECONDS`, which is
doubled); the chapter's `T*` table gets a `fadeOut` beat just past `end` that closes
the scene window (`SCENES.A: [aIn, T.fadeOut]`), and a video-closing chapter passes
`outSec` to `ThankYouCard` instead.

## Editable placements & element toggles (Studio props panel)

So the user can reposition elements and show/hide them live in Remotion Studio
(`npm run studio`) without editing code, every bespoke chapter exposes a Zod `schema`.
The reusable plumbing is `src/components/layout.tsx`:

- `<LayoutProvider values={props}>` wraps the chapter's main stage.
- Panels read positions with `useNum('key', DEFAULT)` and visibility with
  `useFlag('key', true)`. Both fall back to a default, so a panel still works with no
  override. Keep the `DEFAULT_*` constants in the chapter's `kit*.ts` as the single
  source of truth (also spread into `Root.tsx` `defaultProps`).

Pattern (see `exampleCh1Schema` in `src/ExampleCh1.tsx`): define `ch3Schema = z.object({...})`
with `z.number().min().max().step().describe()` for each position (renders a draggable
number field) and `z.boolean().describe()` for each show/hide toggle; export
`ch3Defaults`; pass `schema={ch3Schema}` + `defaultProps={{transparent, ...ch3Defaults}}`
on the `<Composition>`. Requires zod 4 (matches `@remotion/zod-types` peer;
**4.3.6 exactly**; a zod 3 install prints a version-mismatch warning on every
render).

To bake chosen values back in after tweaking in Studio: update the `DEFAULT_*` constants
(and re-render). Time-of-appearance for each element still lives in the `T*` beat table.

## Style & motion conventions (the user cares about these)

- **Overlay-safe design:** even though overlay renders aren't delivered by default,
  keep every chapter overlay-clean. The `-Overlay` variant must stay transparent
  (only the dark panels show; never bake a full-frame opaque background into the
  chapter stage, since backdrops belong on the non-transparent variant only).
- **Backgrounds** (`src/components/Backdrop.tsx`, assets in `public/backgrounds/`):
  every video's non-transparent render shows `<PaperBackdrop />` (dark
  crumpled-paper texture) behind the content (GIFs and cards use a flat dark
  background instead), and a standalone video's title `<Sequence>`
  additionally gets `<TransitionBackdrop durationInFrames={...} fadeInFrames={0} />`
  (dark fluid loop) behind the `TitleCard`. Both sit behind
  `{transparent ? null : ...}` guards, never in the overlay. Follow the
  `ExampleCh1` wiring pattern in every new chapter.
- **Never open on bare backdrop.** A standalone video's beat table sets
  `titleIn: 0` and the title's `TransitionBackdrop` gets `fadeInFrames={0}`,
  so frame 0 already shows the fluid backdrop with the title springing in,
  with no flash of empty paper background before the graphics arrive. Keep the
  fade-out (`fadeFrames`) so the title still hands back to the paper cleanly.
  An **embedded micro-video** has no title card (the lab page shows the
  title): frame 0 already shows content, usually the output the learner just
  saw, redrawn.
- **GIFs:** still called GIFs and designed as silent 5-15 s loops, 1280x720,
  flat dark background (texture pulls the eye off the keystrokes).
  Delivered as a muted, looping H.264 MP4 that the lab page autoplays with
  controls, since WCAG 2.2.2 needs a pause control on anything that moves
  for more than 5 s, plus a PNG poster of the finished state. The loop
  spec's `Alt text` (every key pressed and the visible result) becomes the
  player's label. Mechanics only (keystrokes, clicks, reading one dense
  line), with a small labeled badge for keys that print nothing (Tab,
  Enter). Hold the finished state 1.5 s plus 0.3 s per word of new text (at
  least 3 s for a dense-line read), then return to frame 0's state so the
  loop has no jump.
- **No flashing:** nothing flashes more than three times in any one second
  (WCAG 2.3.1), in any media type. A cursor blinking about once a second is
  fine.
- **No background music** in path media (coherence principle); music is only
  for `/labdrop`.
- **Caption safe area:** in videos, keep essential text out of the bottom 15%
  of the frame. Captions render there.
- **Reference cards:** one static 1920x1080 frame, flat dark background,
  large type that reads at half size, lookup content only (tables, maps,
  syntax), nothing mid-animation.
- **Palette** (`theme.ts`): dark translucent panels, cyan `ACCENT` (#00C2FF),
  `SUCCESS` green, `WARNING`/`DANGER` for problem states. Keep it consistent across all
  chapters.
- **Easing:** all motion uses springs (`config: {damping: 200}`) or eased
  interpolation: smooth, no linear ramps.
- **Hold, don't pulse:** Lottie icons play their draw-in once and hold the last frame
  (`loop={false}` in `HudIcon`). No looping/repeating pulses. Elements enter once and
  stay until their scene cuts (no mid-scene exit fades).
- **Pause at scene changes only:** at a scene change that brings new text to
  read, hold the fully assembled beat static for ~1 s (30 frames @ `FPS`)
  before the next scene animates in. Make the hold by splitting the
  narration `<Audio>` into two Sequences at that paragraph boundary, so the
  narration never runs on over a static hold. No pauses elsewhere: inserted
  pauses don't improve learning (Fiorella and Mayer 2018), and learners can
  pause the player themselves. `/scripts` budgets about 1 s per scene
  change.
- **Centered when possible:** single elements centered; paired elements (e.g. icon +
  bullets, editor + key panel) centered together as a balanced pair.
- **No accidental overlap:** elements (panels, pills, captions, annotations) must not
  overlap or touch unless the overlap is the intended animation (e.g. a shackle seating
  into a padlock, a token highlight sitting on the text it marks). Two pills/captions
  crowding the same space, a callout covering a line of code, or labels colliding are
  bugs. Give each its own room (prefer in-flow spacing or move/offset the element).
  **Always verify with per-beat stills at moments where multiple elements are on screen
  together.**
- **Text size and containers:** lean toward larger text whenever it fits; use
  fewer `Pill` containers and more plain animated text. A pill is for a
  label or verdict, not for every caption.
- Keep terminal text large and legible at final render scale; commands are
  copy-accurate; IPs/CVEs/IDs are reserved/fictional placeholders.
- **The background is always dark: never rely on the default (black) text color.**
  Every text/code container must set an explicit light color (e.g.
  `color: 'rgba(255,255,255,0.92)'`). This bites most with *bare literal text nodes*
  between colored `<span>`s in a code line (e.g. the `1 2 3;` in
  `for i in 1 2 3; do …`, or the `-Name` in `Get-Service -Name spooler`): the
  surrounding tokens are colored but the literal inherits default black and
  disappears on the dark panel. Set a light default color on the line wrapper
  so any uncolored text stays visible.
- **Video-close convention (standalone videos only):** narration ends with
  "Hope you found this helpful and I'd like to thank you for watching." and the
  scene fades back into the shared `src/components/ThankYouCard.tsx` ("Thank You
  for Watching!", gated on a `thankIn` beat). No next-video teasers. Embedded
  micro-videos have no close: they hand back to the lab ("head back and try
  it") and end on their final beat (`/scripts` enforces both).
- **Cross-references describe the concept, never a video or lab number.**
  Learners skip around, each lab is its own repo, and the platform doesn't
  number things the way the outline does. On-screen and in narration, say
  "the inodes model from the links lab", not "Lab 3" or "video 5".
- **No emojis** anywhere on screen (house style). Check and cross marks drawn
  as graphics are fine.

## Lessons learned (layout, timing, audio)

Every one of these was found in per-beat stills or on a listen-through. Check
new chapters against the list; they are platform-neutral.

Audio and timing:

- Regenerated narration reuses folder paths. `transcribe.mjs` rebuilds the
  16 kHz wav when the mp3 is newer, but a beat table built from a stale
  transcript drifts badly. Re-transcribe after every regeneration and retime.
- Bare short command names can come out as noise from the TTS (a bare "ss"
  rendered as a hiss). Keep the phonetic list in the platform profile current
  and write every mention that way in the script.
- Short, comma-fragmented sentences read choppy on eleven_v3 (word, word,
  pause). Write flowing sentences of normal length for the narration body.
- If a final tagline needs breathing room, split the narration `<Audio>` into
  two Sequences at a word boundary from the transcript instead of
  regenerating; the TTS often leaves zero gap between sentences.

Panels and text:

- `TermWindow` has `overflow: hidden`, so badges and annotations must sit inside
  the panel bounds or they clip. A side annotation pinned beside a long code
  line clips at the panel edge; put it on its own caption line inside the
  panel instead of `marginLeft` beside the code.
- Give line-number gutters `flexShrink: 0` or a long code line crushes the
  gutter gap.
- Long real-world lines (paths, unit files, cmdlets with parameters) need
  wider panels and a smaller mono size; check them in stills, don't guess.
- A chip or slot whose label grows at a later beat (`upgrade` →
  `upgrade · broken ✗`, `1` → `1 · keyfile`) wraps inside a wrapper sized
  for the short label. Size for the LONGEST label and set
  `whiteSpace: 'nowrap'`.
- Sequential tick-chips whose label appends a `✓` reflow the whole row on
  every tick. Always render the check and drive its opacity instead.
- Big absolutely-positioned centered wordmarks only get half the canvas to
  shrink-wrap into and will wrap; set `whiteSpace: 'nowrap'`.
- A caption inside a narrow flex segment needs an explicit `width` +
  `textAlign: center` or it wraps out over the segment border.
- A bar fill's right border can cut through its own label; size the fill so
  the caption fits inside.
- SVG axis edge labels clip at the panel edge; anchor the first label `start`
  and the last `end`, not `middle`.
- An enlarged glyph inside a bordered badge scales out of the border from
  `transformOrigin: center`; use `center 30%` with a smaller scale.
- An absolutely-positioned span inside a fixed-height wrapper doesn't share
  the flex row's text baseline. For a reveal that must keep the baseline, use
  an inline-flex wrapper with animated width and an in-flow inner span.
- Keep card-grid example strings short; a long input + output row overflows
  the card into its neighbor.

Pairs, connectors, and travel animations:

- When a side-by-side pair's second panel enters late, keep BOTH panels
  mounted (hide via opacity) and translate the flex container by
  `(secondWidth + gap)/2 * (1 - enterP)` so the first panel starts truly
  centered and slides over. Conditionally mounting the second panel makes the
  pair snap. Getting the sign wrong (`* enterP`) drifts the pair off-center.
- Connector arrows between sequentially-entering cards need their opacity
  tied to the FOLLOWING card's enter progress or they float in empty space.
- Never let auto-layout stand in for a computed connector. A tie line inside
  a flexbox sibling whose height auto-centers against its neighbor is not
  actually positioned against the card it claims to point at. Put both ends
  in one `position: relative` container with explicit pixel coordinates and
  anchor the connector to the nearest target's known center.
- A phase-crossfade card inside a fixed-`minHeight` slot (`position:
  absolute; inset: 0` wrapper + `display: flex`) stretches to the slot's full
  height unless the wrapper also sets `alignItems`.
- Row-reorder animations: rows above the hero's ORIGINAL slot slide down one;
  the row already below it must NOT move.
- A travel-and-bounce chip needs a rest position clear of the wall AND of
  neighboring chips and their badges; give it its own lane.
- Don't put captions in the gap a traveling element crosses; captions for
  travel animations belong above or below the flight path.
- Reserve top space in a strip where chips drop in so they never collide with
  the header.

## Course Status

<!--
  Append one entry per lab as its media ships, matching this shape. This
  section is the project memory the skills read when they need continuity
  (terminal styling, motifs already used, gotchas already hit). Keep it in
  this repo; it does not belong in the template.

  - **Lab N "<Title>"** (repo `labs/<lab-slug>`): media done. Deliverables in
    `deliverables/<media-id>.*`.
    - `<prefix>-lN-v1` "<Title>" (video, 75 s, `src/<Prefix>LNV1.tsx` +
      `src/components/<prefix>-lN-v1/`): one or two sentences naming the
      motif and the payoff beat. Explains the surprise from step <n>.
    - `<prefix>-lN-g1` "<Title>" (GIF, 8 s): what it shows; loop point.
    - `<prefix>-card-<name>` (card): what it holds.
    - Gotchas: anything found in stills, captions, or on listen-through that
      the "Lessons learned" section above does not already cover. Promote
      recurring ones up into that section.
-->

(no media produced yet)
