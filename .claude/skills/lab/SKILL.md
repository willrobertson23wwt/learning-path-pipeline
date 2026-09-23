---
name: lab
description: Draft one lab of a lab-first path as its own WWT mkdocs lab repo (index, environment, module pages, reference cards, description) plus the internal SETUP.md with its portal checks and SUPPORT.md, under labs/<lab-slug>/, with the path's GIFs, micro-videos, predict prompts, hints, and checks embedded at their steps and the guidance level the outline sets. Also drafts the capstone repo, and the path page for Module 0 (pre-check and briefing). Use whenever the user asks to write, draft, or start a lab, the capstone, or the pre-check, e.g. "/lab linux-filesystem 3", "/lab linux-filesystem capstone". Guide only; review, topology, and the VM build are later stages.
argument-hint: <course-slug> <lab-number | capstone | 0>
---

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Draft one lab of a lab-first path. `$ARGUMENTS` is the course slug and one
of: a lab number (`/lab linux-filesystem 3`), `capstone`, or `0` for the
path page. Follow `.claude/house-style.md`, including "Lab-first design": in
a lab-first path the lab *is* the lesson, and the media only supports it.

**One repo per lab.** Every outline lab, and the capstone, is its own WWT lab
repo with its own environment, SETUP.md, and VM. Module 0 is not a lab: its
pre-check and briefing live on the learning path's page on the platform.

## Inputs

- `courses/<slug>/outline.md`: the lab's section (goal, guidance level,
  time, steps, media IDs, predict prompts, check), plus the labs before it
  for what the learner already knows. The lab exercises what the outline
  gives it, and nothing else.
- The lab's media specs in `courses/<slug>/scripts/NN-<lab-slug>/`, if
  written: titles, lengths, `optional` marks, and the exact commands GIFs and
  videos show, so the page and the media agree.
- CLAUDE.md's platform profile: shell, prompt, elevation model, lab
  environment default, output-trimming rule.
- The lab's research brief, `courses/<slug>/research/NN-<lab-slug>.md` (or
  `capstone.md`), shared with `/scripts`. If it's missing or stale (see
  "Research briefs" in `.claude/house-style.md`), launch the `researcher`
  agent in `lab` mode first. Its verified output shapes, predict outcomes,
  check commands, and gotchas feed the guide, SETUP.md, and the
  anticipated-output blocks; say in the report which blocks came from the
  brief instead of memory.

## Output

Write to `labs/<lab-slug>/`, named for what the lab is (no number prefix),
and add `**Lab repo:** <lab-slug>` under the lab's heading in the outline the
first time, so `/video` can deliver media into it. The files map 1:1 into
the `labdocs/docs/` folder of the WWT lab repo scaffold.

| File | What it is |
|---|---|
| `index.md` | The WWT logo line, `# <Path>: <Lab Title>`, and a Version History table |
| `environment.md` | The learner's Environment page |
| `module-1.md` … `module-N.md` | The lab's steps, split at natural checkpoints (each page about 10-20 minutes) |
| `reference.md` | The reference cards this lab uses, one heading and image each (omit if none) |
| `description.md` | The 2-4 sentence lab-listing blurb |
| `SETUP.md` | Internal build checklist, including the **portal checks** table (gitignored) |
| `SUPPORT.md` | Internal notes for the ATC support team (never pushed) |
| `media/index/`, `media/environment/`, `media/module-N/`, `media/reference/` | One folder per page, created up front |

- **Learner pages:** follow `references/guide-format.md`, including its
  "Lab-first pages" section: how GIFs, videos, cards, predict prompts,
  hints, and checks appear on a page, and how each guidance level reads.
- **Internal files:** follow `references/internal-docs.md`. Exact pre-seeded
  file contents go in SETUP.md from the start, and so does every portal
  check.
- **Logo:** copy `.claude/skills/lab/assets/wwt-logo-color-stacked-high.png`
  into `media/index/` while scaffolding. Every WWT lab repo uses that exact
  filename.
- **Media files** don't exist yet. Reference each at the path the guide
  format gives (`./media/module-N/<media-id>.gif`), and list them in the
  report; `/video` copies the rendered files into place.

## The capstone

`/lab <slug> capstone` drafts the capstone as its own repo from the outline's
capstone section:

- One module page per problem or a single page for all of them, goals only,
  in the scenario's voice ("A teammate reports three issues on this box").
- Every seeded problem is in SETUP.md's pre-seeded section, precise enough
  to build, and has a portal check that fails on the seeded state and passes
  once fixed.
- Hints sit in collapsed "Stuck?" blocks. The platform logs opening them, so
  say so in SUPPORT.md.
- No new videos. "Rewatch" links go to the earlier videos the outline
  names; copy those media files into this repo's `media/` so it stands on
  its own.

## The path page (`0`)

`/lab <slug> 0` writes `courses/<slug>/path-page.md`, the content for the
learning path's page on the platform (not a lab repo):

- The pre-check: each question, its answer, and the lab a correct answer
  lets the learner skip to.
- The briefing video (`<prefix>-briefing.mp4` with its captions), its length,
  and a link to its article.
- The reference cards introduced in Module 0.
- The lab sequence in order, with each lab's guidance level and time.

## Command output in a draft

No VM exists yet, so output can't be captured. Put each command's expected
output in a `text` block directly under it, and list those blocks in the
report as anticipated output. After the dry run, each block is replaced by a
rendered terminal screenshot (see "Command output" in the guide format).
Mark GUI steps with a screenshot placeholder per dialog:
`![<what it shows>](./media/module-N/<name>.png)`. In goal-only steps there
is no command to show, so the expected result goes in the collapsed reveal
or hint instead.

## Then stop

Before saving, run the unslop pass over each module, `environment.md`,
`reference.md`, and `description.md`. WWT Title Case headings and the
closing "Congratulations" paragraph stay; `SETUP.md`, commands, and shown
output are out of scope. Then run `prose-checker` on those saved files and
fix its FIX findings.

Report the files written, the media files the guide expects, the portal
checks, and the anticipated-output list, then stop for review. Don't write
Terraform or Ansible. The next stages are `/lab-review <lab-slug>`,
`/lab-topology <lab-slug>`, and then `/lab-build <lab-slug>`.
