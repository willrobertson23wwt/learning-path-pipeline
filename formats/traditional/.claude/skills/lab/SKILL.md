---
name: lab
description: Draft a module's closing lab in a traditional path as its own WWT mkdocs lab repo (index, environment, 2-4 module pages, description) plus the internal SETUP.md build checklist, SUPPORT.md, LISTING.md, shots_spec.py, and dryrun states, under labs/<lab-slug>/. The lab exercises only what that module's videos taught, reuses the running example from their scripts, and is fully guided. Use whenever the user asks to write, draft, or start a module's lab, e.g. "/lab linux-intermediate 1". Guide only; review, topology, and the VM build are later stages.
argument-hint: <course-slug> <module-number>
---

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Draft the closing lab for one module of a traditional path. `$ARGUMENTS` is
the course slug and the module number (`/lab linux-intermediate 1`). The lab
title comes from the module's `**Lab:**` line in the outline. In a
traditional path the videos teach and the lab is where the learner does it
with their own hands (`.claude/house-style.md` "Traditional course design").

**One repo per module.** Each module's lab is its own WWT lab repo with its
own environment, SETUP.md, and vApp.

**The model is the Linux Intermediate labs.** That course was built in this
format, and its five labs are exactly how a lab should look, file by file:
`labs/log-rotation-tool/` (single VM, whole-file writes and dryrun states,
and a module's running example grown into the lab's artifact),
`labs/confined-service/` (single VM, the `sudo -v` wording),
`labs/broken-path/` (multi-host), `labs/performance-investigation/`, and
`labs/service-packaging/`, all in that course repo. Read the ones that match
this lab's shape before writing, and copy their wording where the references
below say to.

## Inputs

- `courses/<slug>/outline.md`: the module's section (each video's goal, its
  chapters' key points and visual moments, the `**Lab:**` line, and any lab
  notes or module list under it), plus the modules before it for what the
  learner already knows. The lab exercises the skills this module's videos
  taught, plus reasonable prerequisites from earlier modules, and nothing
  else. If the lab can't work without a skill no video teaches, give it a
  sentence of purpose on the page when it is a small supporting command
  (`cd`, `ls -la`), and raise it with the user when it is a real topic:
  that's a scope change, not the lab's call.
- The module's chapter scripts in `courses/<slug>/scripts/NN-<video-slug>/`,
  every video of the module, if written. Reuse their running example (the
  script, file names, paths, hostnames, sample data) so the lab continues
  what the videos built: in Linux Intermediate, Module 1's `cleanup.sh`
  becomes the lab's rotation tool. Take the exact commands and outputs the
  visual briefs show, and keep every promise a chapter makes about the lab
  ("the module lab breaks a host's addressing on purpose"). If the scripts
  aren't written yet, draft from the outline and say so in the report, so
  `/scripts` and the lab end up with the same example.
- The module's articles in `courses/<slug>/articles/`, if written. Where an
  article corrected a script for copy accuracy, the lab uses the corrected
  command.
- CLAUDE.md's platform profile: shell and fenced-block tag, prompt,
  elevation model, lab environment default and credentials, output-trimming
  rule, placeholder conventions.
- The module's research brief, `courses/<slug>/research/module-N-<module-slug>.md`, shared
  with `/scripts`. If it's missing or stale (see "Research briefs" in
  `.claude/house-style.md`), launch the `researcher` agent in `module` mode
  first. Its verified output shapes and gotchas feed the guide, SETUP.md,
  and the anticipated lines in `shots_spec.py`; say in the report which came
  from the brief instead of memory.

## Module pages

The structure is fixed; only the number of module pages varies: 2-4 pages,
each a 10-20 minute exercise, titled in the imperative and ending on a
working state.

- If the outline lists the lab's pages (the `- **Modules:**` line under the
  `**Lab:**` entry, `1. <Imperative Title> (15 min); 2. ...`), write one
  `module-N.md` per entry, in its order: the entry's title is the page's H1,
  and its time is the page's budget; the scope is what the module's videos
  taught toward the lab's `- **Goal:**`, ending on a working state.
- If it doesn't, propose a split and stop for the user to approve it before
  writing any page. Follow the arc of the module's videos: Module 1 starts
  from orientation and the first video's skill, each later page adds the
  next video's skill (or the next two) to the artifact, and the final page
  finishes it. Show the table with the videos each page exercises, by title.
  Never pick the count yourself. Once approved, write it on a
  `- **Modules:**` line under the module's `**Lab:**` entry in the outline,
  so a rerun uses the same split.

## Output

Write to `labs/<lab-slug>/`, named for what the lab is, not its module
number (no number prefix, since each folder becomes its own GitHub repo),
and add `**Lab repo:** <lab-slug>` under the module's `**Lab:**` line in the
outline the first time, so the later lab skills and reruns use the same
folder. The learner pages map 1:1 into the `labdocs/docs/` folder of the WWT
lab repo scaffold.

| File | What it is | Format |
|---|---|---|
| `index.md` | WWT logo line, `# <Path>: <Lab Title>`, Version History table | guide format |
| `environment.md` | The Environment page, single or multi-host shape | guide format |
| `module-1.md` to `module-N.md` | One page per lab module | guide format |
| `_quickref_passwords.md` | Labs with more than one device: the login quick reference | guide format |
| `description.md` | The 2-4 sentence lab-listing blurb | guide format |
| `LISTING.md` | Plain-text copy for the ATC lab form's listing boxes (internal) | internal docs |
| `SETUP.md` | Build checklist with the exact pre-seeded file contents (internal) | internal docs |
| `SUPPORT.md` | Plain-text notes for the ATC support team (internal) | internal docs |
| `shots_spec.py` | Every output screenshot's lines, anticipated until the dry run | internal docs |
| `dryrun/states/`, `dryrun/check-states.py` | One checkpoint per whole-file block, and the checker | internal docs |
| `media/index/`, `media/environment/`, `media/module-N/` | One folder per page, created up front | |

- **Learner pages:** follow `references/guide-format.md`: the labdocs build
  rules, each page's shape, the module format, commands and files (the
  elevation rule, whole-file writes, interactive-prompt tables), command
  output, the portal, and its "No checks" section. Skip its "Lab-first pieces"
  and `solutions.md` sections otherwise: a traditional lab embeds no GIFs,
  micro-videos, or reference cards, and has no predict prompts, hints, or
  collapsed answers. Every step is fully guided, the way all five Linux
  Intermediate labs are: a plain lead-in, the command, the screenshot, and
  what to notice. The voice is the Linux Intermediate labs';
  `.claude/style-guide.md` "Lab pages" says which style-guide rules give
  way to it.
- **Pointing back to the videos:** a page can name the module's videos by
  title or topic where a step relies on them ("the way you saw in the
  videos", "the order the Dependencies, Ordering, and Targets video drew
  the graph"). Never by number, never another course, and no video embeds
  or links unless the user gives you the platform URLs. A comparison card
  or labeled diagram from a video can reappear as a small reference table
  where the lab needs it.
- **Something lab-first-like in the outline.** If the module's lab entry
  asks for a challenge module, a predict question, or a solutions page,
  ask the user how they want it presented, then follow the matching
  section of `references/guide-format.md`.
- **Internal files:** follow `references/internal-docs.md`. Exact pre-seeded
  file contents go in SETUP.md from the start; LISTING.md's TOPOLOGY ALT TEXT
  says `pending /lab-topology`; `_quickref_passwords.md` gets `TBD` for any
  management IP SETUP.md doesn't fix yet.
- **Logo:** copy `.claude/skills/lab/assets/wwt-logo-color-stacked-high.png`
  into `media/index/` while scaffolding, so it is always present. Every WWT
  lab repo uses that exact filename. Every other media folder starts empty.
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

## Then stop

Before saving, run the unslop pass (`.claude/skills/unslop/SKILL.md`) over
each module, `environment.md`, and `description.md`. WWT Title Case
headings and the closing "Congratulations" paragraph stay; `SETUP.md`,
`SUPPORT.md`, `LISTING.md`, commands, and shown output are out of scope.
Then run `grep -n '{#\|{{\|{%' *.md` (any hit outside a `{% raw %}` wrapper
gets one) and `python3 dryrun/check-states.py`, and run `prose-checker` on
the saved learner pages and fix its FIX findings.

Report the files written, the module list used (from the outline, or the
split the user approved) with the videos each page exercises, any command
the lab uses that differs from what a script shows (so the user can fix the
script and video), any skill the lab needed that no video teaches, the
screenshots `shots_spec.py` anticipates (which lines came from the research
brief), desktop shots to capture, and any `TBD` management IPs, then stop
for review. The next stages, each its own stop: `/lab-review <lab-slug>`,
`/lab-topology <lab-slug>`, `/lab-build <lab-slug>` (plans the vApp),
`/lab-setup <lab-slug> <address>` (builds the guests once the vApp exists),
then the dry run.
