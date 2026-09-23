---
name: lab
description: Draft one lab of a lab-first path as its own WWT mkdocs lab repo (index, environment, the outline's module pages, description) plus the internal SETUP.md build checklist, SUPPORT.md, LISTING.md, shots_spec.py, and dryrun states, under labs/<lab-slug>/, with the path's GIFs, micro-videos, reference cards, predict prompts, and hints embedded at their steps and the guidance level the outline sets. Also drafts the capstone repo (with its Solutions page), and the path page for Module 0 (pre-check and briefing). Use whenever the user asks to write, draft, or start a lab, the capstone, or the pre-check, e.g. "/lab linux-filesystem 3", "/lab linux-filesystem capstone". Guide only; review, topology, and the VM build are later stages.
argument-hint: <course-slug> <lab-number | capstone | 0>
---

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Draft one lab of a lab-first path. `$ARGUMENTS` is the course slug and one
of: a lab number (`/lab linux-filesystem 3`), `capstone`, or `0` for the
path page. The lab title comes from the outline's heading for that lab. In a
lab-first path the lab *is* the lesson, and the media only supports it
(`.claude/house-style.md` "Lab-first design").

**One repo per lab.** Every outline lab, and the capstone, is its own WWT lab
repo with its own environment, SETUP.md, and vApp. Module 0 is not a lab: its
pre-check and briefing live on the learning path's page on the platform.

**The model is the Linux Intermediate labs.** That course repo's
`labs/broken-path/` (multi-host), `labs/confined-service/` (single VM), and
`labs/log-rotation-tool/` (whole-file writes and dryrun states) are exactly
how a lab should look, file by file. Read the ones that match this lab's
shape before writing, and copy their wording where the references below say
to.

## Inputs

- `courses/<slug>/outline.md`: the lab's section (goal, guidance level,
  time, its **module list**, steps, media IDs, predict prompts), plus the
  labs before it for what the learner already knows. The lab exercises what
  the outline gives it, plus reasonable prerequisites from earlier labs, and
  nothing else.
- The lab's media specs in `courses/<slug>/scripts/NN-<lab-slug>/`, if
  written: titles, lengths, `optional` marks, loop specs, card layouts, and
  the exact commands GIFs and videos show, so the page and the media agree.
  Reuse their running examples for continuity.
- CLAUDE.md's platform profile: shell and fenced-block tag, prompt,
  elevation model, lab environment default and credentials, output-trimming
  rule, placeholder conventions.
- The lab's research brief, `courses/<slug>/research/NN-<lab-slug>.md` (or
  `capstone.md`), shared with `/scripts`. If it's missing or stale (see
  "Research briefs" in `.claude/house-style.md`), launch the `researcher`
  agent in `lab` mode first. Its verified output shapes, predict outcomes,
  and gotchas feed the guide, SETUP.md, and the anticipated lines in
  `shots_spec.py`; say in the report which came from the brief instead of
  memory.

## Modules come from the outline

The structure is fixed; only the number of module pages varies. Write one
`module-N.md` per row of the lab's `**Modules:**` table in the outline
(`# | Module | Scope | Time`), in its order: the row's title is the page's
H1, its scope is what the page covers and the working state it ends on, and
the `### Module N:` block under the table holds that page's steps and media.
If the outline has no module list for this lab, stop and ask the user for
one, proposing a split at the lab's natural checkpoints (each page about
10-20 minutes, Module 1 starting from orientation). Never pick the count
yourself.

## Output

Write to `labs/<lab-slug>/`, named for what the lab is (no number prefix,
since each folder becomes its own GitHub repo), and add `**Lab repo:**
<lab-slug>` under the lab's heading in the outline the first time, so
`/video` can deliver media into it. The learner pages map 1:1 into the
`labdocs/docs/` folder of the WWT lab repo scaffold.

| File | What it is | Format |
|---|---|---|
| `index.md` | WWT logo line, `# <Path>: <Lab Title>`, Version History table | guide format |
| `environment.md` | The Environment page, single or multi-host shape | guide format |
| `module-1.md` to `module-N.md` | One page per outline module | guide format |
| `solutions.md` | Capstone only: the worked solution for every problem | guide format |
| `_quickref_passwords.md` | Labs with more than one device: the login quick reference | guide format |
| `description.md` | The 2-4 sentence lab-listing blurb | guide format |
| `LISTING.md` | Plain-text copy for the ATC lab form's listing boxes (internal) | internal docs |
| `SETUP.md` | Build checklist with the exact pre-seeded file contents (internal) | internal docs |
| `SUPPORT.md` | Plain-text notes for the ATC support team (internal) | internal docs |
| `shots_spec.py` | Every output screenshot's lines, anticipated until the dry run | internal docs |
| `dryrun/states/`, `dryrun/check-states.py` | One checkpoint per whole-file block, and the checker | internal docs |
| `media/index/`, `media/environment/`, `media/module-N/` (and `media/solutions/` in the capstone) | One folder per page, created up front | |

- **Learner pages:** follow `references/guide-format.md`: the labdocs build
  rules, each page's shape, the module format, commands and files (the
  elevation rule, whole-file writes, interactive-prompt tables), command
  output, the portal, and the lab-first pieces (GIFs, videos, predict
  prompts, hints, inline reference cards, guidance levels). The voice is the
  Linux Intermediate labs'; `.claude/style-guide.md` "Lab pages" says which
  style-guide rules give way to it.
- **Internal files:** follow `references/internal-docs.md`. Exact pre-seeded
  file contents go in SETUP.md from the start; LISTING.md's TOPOLOGY ALT TEXT
  says `pending /lab-topology`; `_quickref_passwords.md` gets `TBD` for any
  management IP SETUP.md doesn't fix yet.
- **Logo:** copy `.claude/skills/lab/assets/wwt-logo-color-stacked-high.png`
  into `media/index/` while scaffolding, so it is always present. Every WWT
  lab repo uses that exact filename. Every other media folder starts empty.
- **Media files** don't exist yet. Reference each at the path the guide
  format gives and list them in the report; `/video` copies the rendered
  files into place. A GIF is `./media/module-N/<media-id>.mp4` (the muted
  loop) plus `<media-id>.png` (its poster), a video is `<media-id>.mp4`
  plus `<media-id>.vtt`, and a reference card is `<media-id>.png` in the
  folder of the module that first shows it, with its text version under it
  from the card spec's `## Card layout`. If a spec isn't written yet, draft
  from the outline's description and list it in the report, so `/scripts`
  and the page end up with the same keys, strings, and rows. Write each
  GIF's `aria-label` from its loop spec.
- **Screenshots** are rendered later, after the dry run. Reference each at
  `![<short alt>](./media/module-N/<name>.png)` where a result deserves one
  and put its anticipated lines in `shots_spec.py`. Never put output in a
  fenced `text` block, not even in a draft. Desktop and GUI screenshots
  (a Linux or Windows desktop, a web console) are captured by hand later:
  reference them the same way with a `<!-- desktop screenshot: ... -->`
  capture note under each and no `shots_spec.py` entry (guide-format.md
  "Desktop and GUI screenshots"), and list them in the report as shots to
  capture.

Then stop for review. Don't write Terraform or Ansible: the guide and its
internal files only.

## The capstone

`/lab <slug> capstone` drafts the capstone as its own repo from the outline's
capstone section, with the standard file set above plus `solutions.md`:

- Module pages from the outline's module list, written at the goals-only
  level in the scenario's voice ("A teammate reports three issues on this
  box"). Module 1 still opens with the terminal and a survey of the
  starting state, and each module still ends with `## What You Have
  Learned`; the last one ends with its Workflow Summary and Congratulations
  paragraph.
- Each problem is a goal step with one defensible end state the learner can
  see in the terminal, followed by one collapsed `Stuck? Hint` that names
  the tool or where to look. No Answer blocks on module pages.
- `solutions.md`, after the last module in the nav, holds the full worked
  solution for every problem in the guide's fully guided step format, with
  its screenshots in `media/solutions/`. No other lab gets one.
- Every seeded problem is in SETUP.md's pre-seeded section, precise enough to
  build, with a table mapping problem to seeded state.
- No new videos. Where the outline names a rewatch, the embed goes inside
  that problem's `Stuck? Hint`, labeled `**Video (90 s, rewatch): <Title>.**`,
  and the media file is copied into this repo's module folder so the repo
  stands on its own.

## The path page (`0`)

`/lab <slug> 0` writes `courses/<slug>/path-page.md`, the content for the
learning path's page on the platform (not a lab repo):

- The pre-check: each question, its answer, and the lab a correct answer
  lets the learner skip to.
- The briefing video (`<prefix>-briefing.mp4` with its captions), its length,
  and a link to its article.
- The reference cards introduced in Module 0, each with its text version.
- The lab sequence in order, with each lab's guidance level and time.

## Then stop

Before saving, run the unslop pass (`.claude/skills/unslop/SKILL.md`) over
each module, `solutions.md`, `environment.md`, and `description.md`. WWT
Title Case headings and the closing "Congratulations" paragraph stay;
`SETUP.md`, `SUPPORT.md`, `LISTING.md`, commands, and shown output are out
of scope. Then run `grep -n '{#\|{{\|{%' *.md` (any hit outside a `{% raw %}`
wrapper gets one) and `python3 dryrun/check-states.py`, and run
`prose-checker` on the saved learner pages and fix its FIX findings.

Report the files written, the module list used, the media files the guide
expects, the screenshots `shots_spec.py` anticipates (which lines came from
the research brief), and any `TBD` management IPs, then stop for review. The
next stages, each its own stop: `/lab-review <lab-slug>`, `/lab-topology
<lab-slug>`, `/lab-build <lab-slug>` (plans the vApp), `/lab-setup <lab-slug>
<address>` (builds the guests once the vApp exists), then the dry run.
