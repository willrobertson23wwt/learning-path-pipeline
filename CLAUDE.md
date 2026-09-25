# <Learning Path Name>

<!--
  This is the shared, vendor-agnostic CLAUDE.md for learning paths. It lives
  in the template (learning-path-pipeline), and every new path starts from a
  copy. A path has one of two formats, chosen when it's created:
  traditional (narrated videos of a few chapters each, an article per
  video, a closing lab per module) or lab-first (the labs are the course,
  with short media embedded in their steps). To start one (Linux, Windows
  Server, PowerShell, Cisco, Azure, anything with a CLI or console to teach):

  1. Run `/new-path <topic>` from the template. It asks the format, copies
     the Remotion toolkit, shared skills, agents and scripts plus that
     format's skills into a sibling folder, fills in the FORMAT sections of
     this file and the house style, and inits git.
  2. Replace the title above with the learning path's name.
  3. Fill in the "Platform profile" section below. Everything else in this
     file is platform-neutral and should not need edits.
  4. Append to "Course Status" as media and labs ship. That section is the
     running memory of what was built and what was learned, and it is the
     part of this file that is specific to your path.

-->

<!-- FORMAT:intro -->
(The learning path's format, filled in by `/new-path` from
`formats/<format>/fragments/claude-intro.md`.)
<!-- /FORMAT:intro -->

The media is built with Remotion from ElevenLabs narration: audio-synced
motion graphics, rendered as MP4s (navy ground, audio baked in) and, for a
lab-first path's GIFs, as muted looping MP4s with a PNG poster. The Remotion toolkit and its
worked example chapter (`src/ExampleCh1.tsx`, `src/components/example-ch1/`,
`public/chapters/example-ch1/`, composition `ExampleCh1`) come from the
`learning-path-pipeline` repo; the example is the pattern reference for the
conventions below until the path has media of its own. Narrated videos are
**hand-drawn** (user decision, 2026-09-25, after an A/B against Manim and
the older Remotion look): marker line art, hand lettering and doodles drawn
on stroke by stroke as the narrator speaks, on the WWT navy ground, the
look of the minutephysics explainers. They're built in Remotion with this
template's toolkit, `src/components/sketch/` (rules in
`.claude/references/sketch-style.md`; worked example, li-v6-ch1-hd, in
`.claude/references/examples/li-v6-ch1-hd/`). Manim stays for exact plots
and diagrams only, shown as a card in the drawing (`manim/_kit/`,
`ManimLayer.tsx`; its old whole-chapter example is
`.claude/references/examples/li-v6-ch1/`). Every chapter still
registers a `-Overlay` composition (transparent ProRes 4444, alpha channel),
but overlay renders are **not produced by default**, only if the user asks.

## Ask when unsure

If anything is unclear, ask the user before acting on a guess. This covers
how labs are presented on the WWT ATC lab portal, what a word in a
request means, and which of two reasonable readings they want. Say what you
would otherwise assume, so they can confirm or correct it. A wrong assumption
about the lab platform spreads through every skill that builds on it.

Explain pipeline terms the first time you use one with the user, such as
"guidance level", "predict prompt" or "chapter 0", in a plain sentence. Don't assume they
share vocabulary the skills made up.

## Platform profile (fill in per learning path)

The skills read this section when a rule depends on the platform being taught.
Keep it short; one line each.

- **Platform / vendor:** <e.g. Ubuntu 24.04 · Windows Server 2025 + PowerShell 7 ·
  Cisco IOS-XE 17>
- **Course prefix:** <two or three letters from the outline frontmatter, e.g.
  `lf`, `ps`, `cs`>; item IDs follow the format's pattern in "Content
  pipeline" below (`<prefix>-l3-v1` in a lab-first path, `<prefix>-v3-ch2`
  in a traditional one), and composition IDs the same in PascalCase
  (`LfL3V1`, `PsV3Ch2`).
- **Shell / console shown on screen:** <bash · PowerShell · IOS privileged
  EXEC>; fenced-block language tag in articles and labs: <`bash` · `powershell`
  · `text`>.
- **Prompt as rendered in terminal panels and lab screenshots:**
  <`labuser@host:~$ ` · `PS C:\Users\labuser> ` · `Router#`>.
- **Elevation model (for the lab's "first elevated command" note):** <`sudo`
  with a password prompt · "Run as administrator" / UAC · `enable` mode>.
- **Lab environment default:** <e.g. one Ubuntu 24.04 VM, browser terminal via
  the WWT ATC Lab Portal, `labuser` / `Labpass01!`>.
- **TTS model:** eleven_v3, stability 0.5 (Natural), no seed,
  output MP3 44.1 kHz 128 kbps (matches `.env` and the ElevenLabs website
  settings).
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
- **The hand-drawn toolkit's libraries** (added by `/new-path`, pinned):
  `roughjs`, `perfect-freehand`, and `@remotion/noise` at the installed
  Remotion version. The lettering is converted from the EMS single-line
  fonts into `src/assets/hand/` (`scripts/hand-font.mjs`).
- **Manim toolchain, only when a video needs an exact plot or diagram**,
  per project, no Homebrew or sudo (Homebrew and sudo are blocked on WWT
  machines): `scripts/setup-manim.sh` installs pixi into `.pixi/bin/`,
  Python 3.12 and Manim from conda-forge into `.pixi/envs/`, and TinyTeX
  (portable TeX Live, for LaTeX text) into `.tinytex/`, all
  checksum-verified and gitignored. It takes about 2 GB of disk, so ask the
  user before running it. `pip`/`uv` installs fail (pycairo has no macOS
  wheel), and conda-forge's `texlive-core` has no LaTeX formats.

## Commands

```bash
export PATH="$HOME/.nvm/versions/node/<version>/bin:$PATH"   # macOS + nvm only
npm run studio                       # live preview editor in the browser
npx tsc --noEmit                     # typecheck (do this before rendering)
npx remotion still <Id> out/x.png --frame=N    # fast single-frame verification

# The deliverable (background + audio):
npx remotion render <Id> out/<name>-preview.mp4

# A GIF (lab-first): muted looping MP4 plus a poster of the finished state (hold start x FPS):
npx remotion render <Id> out/<media-id>.mp4 --muted
npx remotion still <Id> out/<media-id>.png --frame=<finished-state frame>

# A reference card (lab-first):
npx remotion still <Id> out/<media-id>.png --frame=0

# Captions: text from the script's narration (map turns phonetic spellings back
# into real syntax), timings from the transcript; read the warnings it prints.
# Once beats.json exists (/video), add --beats so cues follow the holds:
node scripts/captions.mjs public/chapters/<id>/narration.transcript.json \
  --map courses/<slug>/caption-map.json \
  --script courses/<slug>/scripts/<folder>/<script>.md \
  [--beats public/chapters/<id>/beats.json]

# Narrated videos (the /video "Designing a narrated item" flow):
node scripts/beats.mjs public/chapters/<id>/narration.transcript.json --words   # timed words for the designer
node scripts/beats.mjs public/chapters/<id>/narration.transcript.json \
  --spec out/<id>/beats.spec.json --out public/chapters/<id>/beats.json
node scripts/stills.mjs <Id> out/stills/<Id> <f1,f2,...>   # stills at many frames, one bundle

# A Manim layer (exact plots and diagrams only):
scripts/manim-render.sh manim/<id>/scene.py <Class> public/manim/<id>/<name>.webm --frames  # frames for Studio
scripts/manim-watch.sh manim/<id>/scene.py <Class> public/manim/<id>/<name>.webm           # re-render on save
scripts/manim-render.sh manim/<id>/scene.py <Class> public/manim/<id>/<name>.webm           # final WebM (alpha)

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
(abstract loop, line particles, digital glitch grid). The videos draw
everything by hand now, so stock is for the rare exact piece, shown as a
card. Premiere `.mogrt`
templates (lower thirds, titles, arrows) are for the editor's Premiere timeline,
not usable in Remotion; prefer the SVG/PNG/video sources. To use an asset in a
composition, copy it into `public/` first (Remotion's `staticFile()` can't
reach outside the project).

<!-- FORMAT:pipeline -->
## Content pipeline

(Filled in by `/new-path` from
`formats/<format>/fragments/claude-pipeline.md`: the content hierarchy, the
skills in order, the agents, deliverables, labs, and the per-item
workflow.)
<!-- /FORMAT:pipeline -->

## Architecture

Every media item is a composition. Videos, the briefing, and traditional chapters use the patterns
below; a GIF is a fixed-length silent composition (1280x720, `durationInFrames`
= its spec's length x `FPS`, flat dark background) whose beat table comes
from its loop spec; a card is a one-frame 1920x1080 composition rendered with
`remotion still`. The toolkit's code calls a video composition a "chapter"
(`Chapter.tsx`, `ExampleCh1`): in a traditional path that's literal (a video
is 2-4 chapter compositions); in a lab-first path read "chapter" as one
video. GIFs and cards are lab-first only. Patterns for videos:

- **Generic, data-driven** (`src/Chapter.tsx` + a `timeline.json` per chapter;
  `src/chapters/example-generic/timeline.json` is the shape): a `timeline.json` lists cues
  (`title`, `lowerThird`, `bullets`, `principle`) with `start`/`duration` in
  seconds. Good for simple title/bullet chapters.
- **Hand-drawn** (the course's video style; worked example:
  `.claude/references/examples/li-v6-ch1-hd/src/LiV6Ch1HD.tsx`): one file
  per chapter draws every element with the sketch toolkit (`Ink`,
  `HandText`, `shapes.ts`, `SweepMask`, `NavyGround`, `TitleLight`), each
  on its own window from `beats.json`, with the narration split at holds
  (`kit.ts`) and `MixTrack`. See `.claude/references/sketch-style.md`.
- **Bespoke per-chapter** (the older look, and GIFs; worked example: `src/ExampleCh1.tsx`
  + `src/components/example-ch1/`): all panels render inside one
  `<Sequence from={offset}>` so `useCurrentFrame()` equals the audio frame, and
  each panel self-gates on a beat-timing table `T` (seconds) in the chapter's
  `kit*.ts`. The reusable terminal toolkit lives at
  `src/components/terminal/kit.tsx`: `TermWindow`, `typedText` (type-on),
  `Cursor`, `Pill`, `Padlock`, `Check`, `appear`/`fadeInOut` easing helpers.
  `TermWindow` is a generic dark console panel: it renders a bash prompt, a
  PowerShell prompt, an IOS prompt, or a config-file editor equally well. The
  prompt string and syntax colors are yours to set per chapter.

Shared: `src/components/theme.ts` (the WWT palette under the runtime's
names, plus `GROUND`; `sketch/palette.ts` has the tokens and roles), `TitleCard`,
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
**standalone video** (the lab-first briefing) and every **chapter** of a
traditional video (each is cut into Premiere between screencasts) keep the
Premiere-style tail below. GIFs return to frame 0's state instead (the loop
point), and cards have no time at all.

**End buffer for Premiere transitions (standalone videos and traditional chapters):** the video holds
for ~2 s past its last narration beat before the composition ends. In that window, fade out the
foreground elements (panels, text, icons: everything the chapter added) but
keep the ground visible (in the hand-drawn style: one sheet wipe of the
whole drawing, leaving `NavyGround`), so Premiere
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
- **Backgrounds: the WWT navy sheet** (user decision, 2026-09-25,
  replacing the 2026-09-24 charcoal). Every narrated video's lesson frames
  sit on `<NavyGround />` (`src/components/sketch/Ground.tsx`): WWT navy
  (#1D1E48) lightest behind the drawing, falling to navy-ink (#11122E) in
  the corners, with a frozen fine grain. A standalone video's title and its
  thank-you card sit on `<TitleLight />` over it: two soft pools of WWT
  blue and indigo light drifting at about 30 px/s, fading with the title
  to exactly the lesson ground. Only the main marker and secondary colors
  sit on the title light; red never does. GIFs and cards use the flat
  navy `GROUND` from `theme.ts`. Grounds sit behind
  `{transparent ? null : ...}` guards, never in the overlay. Render with
  JPEG quality 95 (`remotion.config.ts`), or the falloff bands after
  encoding. The older `PaperBackdrop`/`TransitionBackdrop` stay only for
  chapters built before the switch.
- **Never open on bare backdrop.** A standalone video's (or a traditional
  chapter's) beat table sets `titleIn: 0`; the title light is up and the title's first stroke is
  already drawn on frame 0, so there's no flash of bare ground. The title
  and its light leave together, on one fade, back to the lesson ground.
  An **embedded micro-video** has no title card (the lab page shows the
  title): frame 0 already shows content, usually the output the learner just
  saw, redrawn.
- **GIFs** (lab-first paths): still called GIFs and designed as silent 5-15 s loops, 1280x720,
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
- **Music and sound effects are mixed into the render** (user decision,
  2026-09-24). Every narrated video gets a very low instrumental music bed
  that fills the narration's holds, plus sparse sound effects on key beats
  only. The `sound-engineer` agent owns each video's sound across all its
  chapters: it picks and fits the music (Epidemic Sound connector), places
  the effects, writes the mix, and checks the levels. The levels rules are in
  `.claude/references/sound-design.md`: the house mix keeps the music
  flat at 34 dB below the voice (about -40 dB in Premiere), the title silent apart from its effect,
  and one loudness target (-16 LUFS) for every final mix. GIFs and
  cards stay silent.
- **Caption safe area:** in videos, keep essential text out of the bottom 15%
  of the frame. Captions render there.
- **Reference cards** (lab-first paths): one static 1920x1080 frame, flat dark background,
  large type that reads at half size, lookup content only (tables, maps,
  syntax), nothing mid-animation.
- **Palette: the WWT design system** (user decision, 2026-09-25), one
  meaning per role across every course: main marker gray-50, secondary
  navy-25, ghost navy-50, accent A blue-50 (the focus; "network"), accent B
  orange-50 (the other side; "host"), key gold (the reveal, the setting
  that decides), problem red-50 (always with a cross or the word), success
  green (thick strokes only). Tokens and roles in
  `src/components/sketch/palette.ts`; `theme.ts` maps the runtime's
  `ACCENT`/`DANGER`/`SUCCESS`/`WARNING`/panel names to them. Full-strength
  brand colors are for fills and thick strokes only (4.5:1 or less on
  navy). Contrast table: `.claude/references/video-design/03-accessible-color.md`.
- **Easing:** all motion uses springs (`config: {damping: 200}`) or eased
  interpolation: smooth, no linear ramps.
- **Hold, don't pulse:** Lottie icons play their draw-in once and hold the last frame
  (`loop={false}` in `HudIcon`). No looping/repeating pulses. Elements enter once and
  stay until their scene cuts (no mid-scene exit fades).
- **Let the picture land: holds in the narration, sized to what moves.**
  A pause lasts as long as something is happening on screen, and no
  longer (user decision, 2026-09-24: 1.8-2 s pauses over a still frame
  felt too long):
  - **Still frame** (a scene change or a finished frame to read, nothing
    moving): about 0.2 s added to the voice's own sentence break, about
    1.0-1.25 s of silence in all.
  - **Key animation** that plays in silence (the reveal, a transform the
    lesson depends on): the animation's run time plus about 1-1.3 s to
    take in the result (li-v6-ch1's reveal: 1.5 s added, about 2.3 s of
    silence). The hold adds to the voice's own break, so measure it: in
    li-v6-ch1-hd the voice already paused 0.8 s after "left.", and the
    approved 2.4 s hold would have left the result sitting 2.2 s; it was
    built at 1.6 s.

  The designer places these holds in the shot list. Make each one by
  splitting the narration `<Audio>` at a sentence boundary (inside
  measured silence), so the narration never runs over a hold and the
  visuals stay in sync. Designer-inserted pauses at meaningful boundaries
  helped learning in three studies (Spanjers et al. 2012; Rey et al. 2019;
  Biard et al. 2018; see `.claude/references/video-design/01-instructional-evidence.md`),
  and learners rarely pause the player themselves. Background music added
  in post fills the gaps. `/scripts` budgets the holds (see its word budget).
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
- **Video-close convention (a standalone video, or a traditional video's
  last chapter):** narration ends with
  "Hope you found this helpful and I'd like to thank you for watching." and the
  sheet is wiped for `<SketchThankYou inSec={B.thankIn} />`
  (`src/components/sketch/`): the title light fades back in and "Thank You
  for Watching!" letters itself on (`ThankYouCard.tsx` is the older look's
  version). No next-video teasers. Embedded
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

Hand-drawn videos (details in `.claude/references/sketch-style.md`):

- Hand lettering measures 15-60% wider than a designer's box estimate
  (lowercase most). Measure with `layoutText` and fit the shapes around
  it (circles, braces, bubbles, enclosures); keep the cap sizes. Lettering
  touching a drawn shape is this style's most common defect.
- Anything that moves is drawn at home and moved with `translate`: the
  wobble comes from the stroke's coordinates, so moving the points would
  make it boil.
- A beat phrase can't reuse the previous beat's words (`beats.mjs`
  searches forward); trim to the unshared words, keeping the edge word.
- Letter short terms and acronyms steadier (`jitter` 0.6-0.9): a slanted
  I made "CIDR" read "C/DR", and tall x's read as capitals.
- Balance each scene in the 0-918 band; a strip in the top half for half a
  minute reads as sitting high (moved 45 px down in li-v6-ch1-hd).

Audio and timing:

- A title and its backdrop leave together, on one fade. When the fluid loop
  faded early and the title stayed on the plain paper, it read as a bug
  (li-v6-ch1 pilot). In a hybrid build, drive both fades from the same beat
  in beats.json with the same duration and easing.

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

- On the navy ground, a terminal or card panel (`TERM_BG` ink, `PANEL_BG`
  navy-ink) nearly disappears toward the frame edges. Give any panel whose
  edge matters a 2 px border at white 30-40% (first found on the charcoal
  ground, 2026-09-24; the same holds on navy).
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

<!-- FORMAT:status -->
(The Course Status entry template for this format, filled in by `/new-path`
from `formats/<format>/fragments/claude-status.md`.)
<!-- /FORMAT:status -->

(no media produced yet)
