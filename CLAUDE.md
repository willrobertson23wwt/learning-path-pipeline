# <Learning Path Name>

<!--
  This is the shared, vendor-agnostic CLAUDE.md for the learning-path video
  pipeline. To start a new learning path (Linux, Windows Server, PowerShell,
  Cisco, Azure, anything with a CLI or console to teach):

  1. In the learning-path-pipeline template repo run `/new-path <topic>`. It
     copies the toolkit, skills, scripts and the worked example into a sibling
     folder and inits git.
  2. Replace the title above with the learning path's name.
  3. Fill in the "Platform profile" section below. Everything else in this
     file is platform-neutral and should not need edits.
  4. Append to "Course Status" as videos ship. That section is the running
     memory of what was built and what was learned, and it is the part of this
     file that is specific to your course.
-->

This is a standalone learning-path repo scaffolded from the
`learning-path-pipeline` template. The worked example chapter that came with
the scaffold (`src/ExampleCh1.tsx`, `src/components/example-ch1/`,
`public/chapters/example-ch1/`, composition `ExampleCh1`) is the pattern
reference for every convention below; delete it once the course has chapters
of its own.

Audio-synced motion graphics for IT-training videos (CBTNuggets/INE style). Each
"chapter" is built from ElevenLabs narration and rendered as an MP4 (dark
background + audio baked in) — **that MP4 is the deliverable** the editor cuts
between screencast footage in Adobe Premiere. Every chapter still registers a
`-Overlay` composition (transparent ProRes 4444, alpha channel), but overlay
renders are **not produced by default** — only if the user asks for one.

## Platform profile (fill in per learning path)

The skills read this section when a rule depends on the platform being taught.
Keep it short; one line each.

- **Platform / vendor:** <e.g. Ubuntu 24.04 · Windows Server 2025 + PowerShell 7 ·
  Cisco IOS-XE 17>
- **Course prefix:** <two or three letters from the outline frontmatter, e.g.
  `li`, `ps`, `cs`>; audio folders are `<prefix>-vN-chM`, composition IDs
  `<Prefix>V<N>Ch<M>`.
- **Shell / console shown on screen:** <bash · PowerShell · IOS privileged
  EXEC>; fenced-block language tag in articles and labs: <`bash` · `powershell`
  · `text`>.
- **Prompt as rendered in terminal panels and lab screenshots:**
  <`labuser@host:~$ ` · `PS C:\Users\labuser> ` · `Router#`>.
- **Elevation model (for the lab's "first elevated command" note):** <`sudo`
  with a password prompt · "Run as administrator" / UAC · `enable` mode>.
- **Lab environment default:** <e.g. one Ubuntu 24.04 VM, browser terminal via
  the WWT ATC Lab Portal, `labuser` / `Labpass01!`>.
- **TTS phonetic list:** command and tool names ElevenLabs mangles when read
  bare, with the spelling to use in narration (e.g. `ss` → "ess ess",
  `sudo` → "soo-doh", `Get-ChildItem` → "Get Child Item", `sh` → "S H"). Add to
  it every time a retake is needed; `/scripts` reads it.
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

# Transparent overlay (alpha) — ONLY if explicitly requested:
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
(abstract loop, line particles, digital glitch grid — candidates to experiment
with alongside `PaperBackdrop`/`TransitionBackdrop`). Premiere `.mogrt`
templates (lower thirds, titles, arrows) are for the editor's Premiere timeline,
not usable in Remotion; prefer the SVG/PNG/video sources. To use an asset in a
composition, copy it into `public/` first (Remotion's `staticFile()` can't
reach outside the project).

## Content pipeline

Content hierarchy: a **course** is 6-8 **videos** (4-6 min each, plus intro +
review); a video is 2-4 **chapters** (~60-120s narration segments). Each chapter
is one ElevenLabs request → one `narration.mp3` → one overlay composition; the
editor composites them between screencast footage in Premiere.

**4-6 min is a default, not a hard cap:** for a genuinely complex topic, let the
video run longer rather than compressing the explanation — depth beats runtime.
Don't pad simple topics out to fit a longer runtime either; the length should
follow from how much the topic needs.

New courses flow through four skills in `.claude/skills/` — run them in order,
each stopping for user review; never run the next stage unprompted:

1. `/outline <topic>` → `courses/<slug>/outline.md` (frontmatter: `slug`,
   `prefix`, `status: draft|approved`).
2. `/scripts <slug>` → `courses/<slug>/scripts/NN-<video>/MM-<chapter>.md` —
   narration prose above a `## Visual brief` heading; frontmatter `folder:`
   names the target `public/chapters/<folder>/` dir (`<prefix>-vN-chM`).
3. `/audio <slug> [video]` → `scripts/generate-audio.mjs` (ElevenLabs, key +
   voice ID in `.env`) writes each chapter's `narration.mp3`, then
   `scripts/transcribe.mjs` for timings.
4. `/video <slug> N` → the per-chapter workflow below for each of that video's
   chapters, fed by the scripts' visual briefs + transcripts.

**Prose quality pass:** `.claude/skills/unslop/SKILL.md` (adapted from
cursor/plugins' `unslop`) strips AI tells from learner-facing prose. `/scripts`,
`/article`, `/lab` and `/outline` run it as their last step before saving;
`/unslop <path>` runs it on any file by hand. Its "Course content" section lists
the exceptions (the mandated video-close line, TTS phonetic spellings in
narration, Title Case titles and WWT lab headings).

Optional fast path: `/produce <slug> N` runs stages 3 + 4 for ONE video in one
shot (user opt-in; skips the listen-first stop, scripts must already be
reviewed and the outline approved).

Every video also gets a **companion article**: `/article <slug> N` →
`courses/<slug>/articles/NN-<video>.md`, a self-contained written alternative
so a student can read the lesson instead of watching it (git-tracked, sourced
from the chapter scripts; real syntax, never the narration's phonetic
spellings). `/video` and `/produce` write it as part of delivering a video.

**Deliverables go to** `deliverables/` in this repo (copy each chapter's .mp4
there; the folder is gitignored). Overlay .mov files are not delivered.

**Closing out:** when a course (or a range of its videos) is finished and
handed to the editor, `/closeout <slug> [N-M]` runs `scripts/closeout.mjs` to
bundle the deliverable MP4s, source narration and transcripts, scripts and
articles into one dated zip under `archives/` (gitignored) with a manifest,
verifies it, and only then, on explicit confirmation, deletes the multi-GB
`out/` renders for those videos. See `.claude/skills/closeout/SKILL.md`.

**Marketing one-offs:** `/labdrop <learning path>` builds an ATC Lab Drop
promo video (music-synced brand sting, VO slides, WWT end card) — a separate
workflow from course chapters with its own conventions and asset set
(`public/labdrop/`); see `.claude/skills/labdrop/SKILL.md`. Worked example:
`LabDrop` in the Linux Intermediate course repo's `src/LabDrop.tsx`.

**Labs:** each module closes with a hands-on lab authored with `/lab` (guide
draft), `/lab-review` (documentation-only cleanup before the VM exists) and
`/lab-topology` (the environment diagram). Labs live in `labs/<slug>/` while
drafting and publish to their own GitHub repo each; the course repo ignores
`labs/`.
Once a lab is reviewed, `/lab-build <lab-slug>` plans the vCloud Director vApp for it
in Lab Builder (a separate repo: golden images, networks, gateway VM, edge firewall from
SETUP.md's table) and stops at `terraform plan`; the user builds from there.

## Per-chapter workflow

1. `/audio` has already written `public/chapters/<prefix>-vN-chM/narration.mp3`
   and its `narration.transcript.json` (word-level timings via whisper.cpp; if
   the transcript is missing, run
   `node scripts/transcribe.mjs public/chapters/<folder>/narration.mp3`).
2. Map narration cues → beats, build the chapter per its visual brief
   (`courses/<slug>/scripts/NN-*/MM-*.md`), register it in `src/Root.tsx`.
3. Typecheck → render stills at each beat to verify → render the .mp4 → copy out.

## Architecture

Two chapter patterns coexist:

- **Generic, data-driven** (`src/Chapter.tsx` + a `timeline.json` per chapter;
  `src/chapters/example-generic/timeline.json` is the shape): a `timeline.json` lists cues
  (`title`, `lowerThird`, `bullets`, `principle`) with `start`/`duration` in
  seconds. Good for simple title/bullet chapters.
- **Bespoke per-chapter** (the usual choice — worked example: `src/ExampleCh1.tsx`
  + `src/components/example-ch1/`): all panels render inside one
  `<Sequence from={offset}>` so `useCurrentFrame()` equals the audio frame, and
  each panel self-gates on a beat-timing table `T` (seconds) in the chapter's
  `kit*.ts`. The reusable terminal toolkit lives at
  `src/components/terminal/kit.tsx`: `TermWindow`, `typedText` (type-on),
  `Cursor`, `Pill`, `Padlock`, `Check`, `appear`/`fadeInOut` easing helpers.
  `TermWindow` is a generic dark console panel: it renders a bash prompt, a
  PowerShell prompt, an IOS prompt, or a config-file editor equally well — the
  prompt string and syntax colors are yours to set per chapter.

Shared: `src/components/theme.ts` (palette + font stacks), `TitleCard`,
`ThankYouCard`, `HudIcon` (Lottie badges), `scripts/prepare-hud.mjs`
(strips/recolors HUD callout JSON into `src/assets/hud/*.json` — rerun to add
icons).

`BUFFER_SECONDS` (in `src/constants.ts`) is **0**: clips start on frame 0 (audio +
graphics aligned) with no padding, since transitions are handled in Premiere directly.
`Root.tsx` still adds `2 * BUFFER_SECONDS` to each composition's duration, so bumping
the constant restores trim handles everywhere. **Don't use this constant for the end
buffer below** — it pads both start and end symmetrically with nothing to show; the
end buffer needs its own frames plus a fade-out beat, not silence.

**End buffer for Premiere transitions:** every chapter holds for ~2s past its
last narration beat before the composition ends. In that window, fade out the
foreground elements (panels, text, icons — everything the chapter added) but
keep the backdrop (`PaperBackdrop`/`TransitionBackdrop`) visible, so Premiere
has clean background-only frames at the tail to build a transition into.
Mechanically: `END_BUFFER_SECONDS = 2` in `src/constants.ts`; `Root.tsx`'s
`audioMetadata(audio, tailSeconds)` adds it ONCE for opted-in chapters (pass
`END_BUFFER_SECONDS` as the second arg — separate from `BUFFER_SECONDS`, which is
doubled); the chapter's `T*` table gets a `fadeOut` beat just past `end` that closes
the scene window (`SCENES.A: [aIn, T.fadeOut]`), and a video-closing chapter passes
`outSec` to `ThankYouCard` instead.

## Editable placements & element toggles (Studio props panel)

So the user can reposition elements and show/hide them live in Remotion Studio
(`npm run studio`) without editing code, every bespoke chapter exposes a Zod `schema`.
The reusable plumbing is `src/components/layout.tsx`:

- `<LayoutProvider values={props}>` wraps the chapter's main stage.
- Panels read positions with `useNum('key', DEFAULT)` and visibility with
  `useFlag('key', true)` — both fall back to a default, so a panel still works with no
  override. Keep the `DEFAULT_*` constants in the chapter's `kit*.ts` as the single
  source of truth (also spread into `Root.tsx` `defaultProps`).

Pattern (see `exampleCh1Schema` in `src/ExampleCh1.tsx`): define `ch3Schema = z.object({...})`
with `z.number().min().max().step().describe()` for each position (renders a draggable
number field) and `z.boolean().describe()` for each show/hide toggle; export
`ch3Defaults`; pass `schema={ch3Schema}` + `defaultProps={{transparent, ...ch3Defaults}}`
on the `<Composition>`. Requires zod 4 (matches `@remotion/zod-types` peer;
**4.3.6 exactly** — a zod 3 install prints a version-mismatch warning on every
render).

To bake chosen values back in after tweaking in Studio: update the `DEFAULT_*` constants
(and re-render). Time-of-appearance for each element still lives in the `T*` beat table.

## Style & motion conventions (the user cares about these)

- **Overlay-safe design** — even though overlay renders aren't delivered by default,
  keep every chapter overlay-clean: the `-Overlay` variant must stay transparent
  (only the dark panels show; never bake a full-frame opaque background into the
  chapter stage — backdrops belong on the non-transparent variant only).
- **Backgrounds** (`src/components/Backdrop.tsx`, assets in `public/backgrounds/`):
  every chapter's non-transparent render shows `<PaperBackdrop />` (dark
  crumpled-paper texture) behind the content, and the chapter-title `<Sequence>`
  additionally gets `<TransitionBackdrop durationInFrames={...} fadeInFrames={0} />`
  (dark fluid loop) behind the `TitleCard`. Both sit behind
  `{transparent ? null : ...}` guards — never in the overlay. Follow the
  `ExampleCh1` wiring pattern in every new chapter.
- **Never open on bare backdrop:** every beat table sets `titleIn: 0` and the
  title's `TransitionBackdrop` gets `fadeInFrames={0}`, so frame 0 already shows
  the fluid backdrop with the title springing in — no flash of empty paper
  background before the graphics arrive. Keep the fade-out (`fadeFrames`) so
  the title still hands back to the paper cleanly.
- **Palette** (`theme.ts`): dark translucent panels, cyan `ACCENT` (#00C2FF),
  `SUCCESS` green, `WARNING`/`DANGER` for problem states. Keep it consistent across all
  chapters.
- **Easing:** all motion uses springs (`config: {damping: 200}`) or eased
  interpolation — smooth, no linear ramps.
- **Hold, don't pulse:** Lottie icons play their draw-in once and hold the last frame
  (`loop={false}` in `HudIcon`). No looping/repeating pulses. Elements enter once and
  stay until their scene cuts (no mid-scene exit fades).
- **Pause between ideas:** these videos move fast for complex topics — before
  advancing to a new idea/scene within a chapter, hold the fully-assembled beat
  static for ~1-2s (30-60 frames @ `FPS`) so a viewer has time to actually read
  what's on screen, rather than immediately animating on to the next beat.
  Build this into the beat table's timing between beats (a deliberate gap
  before the next beat's `In` time), not as a separate visual element.
- **Centered when possible:** single elements centered; paired elements (e.g. icon +
  bullets, editor + key panel) centered together as a balanced pair.
- **No accidental overlap:** elements (panels, pills, captions, annotations) must not
  overlap or touch unless the overlap is the intended animation (e.g. a shackle seating
  into a padlock, a token highlight sitting on the text it marks). Two pills/captions
  crowding the same space, a callout covering a line of code, or labels colliding are
  bugs — give each its own room (prefer in-flow spacing or move/offset the element).
  **Always verify with per-beat stills at moments where multiple elements are on screen
  together.**
- **Text size and containers:** lean toward larger text whenever it fits; use
  fewer `Pill` containers and more plain animated text. A pill is for a
  label or verdict, not for every caption.
- Keep terminal text large and legible at final render scale; commands are
  copy-accurate; IPs/CVEs/IDs are reserved/fictional placeholders.
- **The background is always dark — never rely on the default (black) text color.**
  Every text/code container must set an explicit light color (e.g.
  `color: 'rgba(255,255,255,0.92)'`). This bites most with *bare literal text nodes*
  between colored `<span>`s in a code line (e.g. the `1 2 3;` in
  `for i in 1 2 3; do …`, or the `-Name` in `Get-Service -Name spooler`): the
  surrounding tokens are colored but the literal inherits default black and
  disappears on the dark panel. Set a light default color on the line wrapper
  so any uncolored text stays visible.
- **Video-close convention (every video's LAST chapter):** narration ends with
  "Hope you found this helpful and I'd like to thank you for watching." and the
  scene fades back into the shared `src/components/ThankYouCard.tsx` ("Thank You
  for Watching!", gated on a `thankIn` beat). No next-video teasers — videos end
  self-contained (`/scripts` enforces both).
- **Cross-video references describe the concept, never the video number.**
  Learners skip around and the platform doesn't number videos the way the
  outline does. On-screen and in narration, say "the PATH lesson from the
  scheduling video", not "video 5".

## Lessons learned (layout, timing, audio)

Every one of these was found in per-beat stills or on a listen-through. Check
new chapters against the list; they are platform-neutral.

Audio and timing:

- Regenerated narration reuses folder paths — `transcribe.mjs` rebuilds the
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

- `TermWindow` has `overflow: hidden` — badges and annotations must sit inside
  the panel bounds or they clip. A side annotation pinned beside a long code
  line clips at the panel edge; put it on its own caption line inside the
  panel instead of `marginLeft` beside the code.
- Give line-number gutters `flexShrink: 0` or a long code line crushes the
  gutter gap.
- Long real-world lines (paths, unit files, cmdlets with parameters) need
  wider panels and a smaller mono size; check them in stills, don't guess.
- A chip or slot whose label grows at a later beat (`upgrade` →
  `upgrade · broken ✗`, `1` → `1 · keyfile 🤖`) wraps inside a wrapper sized
  for the short label. Size for the LONGEST label and set
  `whiteSpace: 'nowrap'`; an emoji counts as about two characters.
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
  Append one entry per video as it ships, matching this shape. This section is
  the project memory the skills read when they need continuity (running
  example, motifs already used, gotchas already hit). Keep it in this repo;
  it does not belong in the shared pipeline repo.

  - **Video N "<Title>"** — done (chapters 1-M + intro audio). Running example:
    <the artifact the chapters build on>. Deliverables `<prefix>-vN-chM-preview.mp4`.
    - Ch1 "<Title>" (`src/<Prefix>VNCh1.tsx` + `src/components/vN-ch1/`): one or
      two sentences per scene naming the motif and the payoff beat. Beat table
      `T1` in `vN-ch1/kit1.ts`. IDs `<Prefix>VNCh1`/`-Overlay`.
    - Ch2 ...
    - Gotchas: anything found in stills or on listen-through that the
      "Lessons learned" section above does not already cover. Promote
      recurring ones up into that section.
-->

(no videos produced yet)
