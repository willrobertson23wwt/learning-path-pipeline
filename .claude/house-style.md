# House style

Rules shared by the pipeline skills. Each skill links here instead of repeating
them, so a rule changes in one place. Skill-specific rules stay in the skill.

## Where content lives

Course content never goes in a template repo. Stop before writing anything
if either is true:

- `package.json`'s `name` is `learning-path-pipeline` (the video-first
  template), or
- a `TEMPLATE.md` file sits at the repo root (the lab-first template).

Tell the user this folder is a template, and that the work belongs in a
learning-path folder made from it with `/new-path <topic>`. A template is
copied into every new learning path, so anything written into it leaks into
all of them.

## Lab-first design

Every path made from the lab-first template follows these rules. The worked
example, `linux-filesystem-path.md`, applies each one. None of them fixes how
many labs, videos, GIFs, or cards a path has; the outline decides that.

- **Practice first (doer effect, Koedinger).** Practice teaches about six
  times as much as watching. At least 80% of a learner's time is at the
  terminal or console, and there are no standalone lecture modules.
- **Supportive vs procedural information (4C/ID).** Mental models ("one
  tree", "names point to inodes") go in the briefing and on reference cards.
  How-to help (a GIF, a command hint) sits at the step that needs it.
- **Predict, then try, then watch (productive failure, Sinha & Kapur).** At
  a conceptual moment, the learner commits to a prediction, runs the command,
  and only then gets the explainer video. The video never comes before the
  attempt.
- **Short, single-purpose media (Höffler & Leutner; Guo).** GIFs run 5-15 s,
  loop, and have no audio. Micro-videos run 30-90 s, cover one idea, and
  have pause, scrub, and captions. The briefing is the one longer video
  (about 2-3 minutes) and the only one before hands-on work.
- **No transient reference (transient information effect).** Anything
  learners look up repeatedly (a directory map, a permission-bits table) is
  a static reference card, pinned and one click away, never a video.
- **Guided for novices (Kirschner et al.).** Early labs give exact commands
  and expected output.
- **Fade the guidance (Kalyuga, expertise reversal).** Guidance drops lab by
  lab, down this ladder: full commands and expected output; full commands
  with predict prompts; new commands given, goals for known ones; goal plus
  hint; goal plus collapsed hint; goals only. A pre-check lets experienced
  learners skip ahead, and every video is optional and labeled with its
  length.
- **Capstone for transfer.** The capstone is goals only, on a pre-seeded
  broken system, with auto-checks. It adds no new videos; it links back to
  earlier ones ("Rewatch: inodes (90s)").
- **Every lab ends in a check.** A portal check (a command the lab portal
  runs, whose result proves the state) or a short question, stated in the
  outline.

**Media types.** Outlines and lab drafts label each item with a bold word
at the start of its step (`**GIF (8s): Tab completion.**`,
`**Predict:**`), never with an emoji or symbol.

| Label | Item | Placement |
|---|---|---|
| GIF | 5-15 s, silent, loops; shows where to click or what to type | Before the step that needs it |
| Video | 30-90 s, narrated, one idea; explains why | After a predict or try step |
| Briefing video | The one longer video, about 2-3 minutes | Before the first lab |
| Reference card | Static reference for lookup | Pinned for the whole path, or from its lab on |
| Predict | Learner commits (multiple choice or free text) before running | Before the command it tests, with a collapsed reveal |
| Check | Auto-check or question | End of each lab and each capstone problem |

## Learner-facing prose

This covers outline copy, narration, articles, and lab guides.

- **No emojis, anywhere.** Not in learner content, on-screen text, outlines,
  lab guides, research briefs, agent reports, or replies to the user. Label
  things with words. The user strips them on sight, as with em-dashes.
- **No em-dashes.** Use commas, periods, or separate sentences. They are the
  most visible AI tell and the user strips them on sight.
- **Placeholders are reserved or fictional:** IPs, hostnames, CVEs, tenant
  IDs, serial numbers. Real ones in training material either point learners at
  someone else's systems or go stale.
- **Courses are standalone.** Never reference the user's other courses ("as
  you saw in the intro course"). Learners may skip prerequisites, and a
  dangling callback confuses them.
- **Callbacks name the concept, never a video or lab number:** "the inodes
  model from the links lab", not "Lab 3" or "video 5". Learners skip around,
  each lab is its own repo, and the platform doesn't number things the way
  the outline does.
- **Code-block language tags and shown prompts** come from the platform
  profile in CLAUDE.md (`bash`, `powershell`, or `text` for device CLIs;
  `yaml`/`json`/`ini` for config files).
- **Last step before saving:** run the unslop pass
  (`.claude/skills/unslop/SKILL.md`) over the prose, respecting its "Course
  content" exceptions.
- **Then have it checked:** after saving, run the `prose-checker` agent on
  the saved files and fix each FIX it returns (NOTEs at your judgment).
  Authors miss their own tells; a fresh reader catches them. A subagent
  can't launch agents, so when an agent wrote the prose, whoever launched it
  runs the checker and sends the findings back.

## Research briefs

The `researcher` agent writes cited briefs to `courses/<slug>/research/`
(`outline.md`, one `NN-<lab-slug>.md` per lab shared by `/scripts` and
`/lab`, and `capstone.md`). They're internal
and git-tracked, so a later skill can see what a fact was checked against.

- **Reuse before re-researching.** Launch the researcher only when the
  brief is missing, older than 90 days, or built on a different `baseline`
  than the current platform profile, or when the user asks for a refresh.
- **The user can skip it.** "No research" or "skip research" in the request
  means write from the outline and scripts alone, and say so in the report.
- **Facts versus scope.** Fix a factual error the brief confirms (syntax,
  defaults, output shape, a deprecation) without asking. Anything that
  changes scope (a topic to add or drop, a reordering) is a proposal for the
  user, never a silent change to an approved outline.
- **Nothing from a brief is cited in learner content.** No provider names,
  no "according to", no links unless the lesson itself needs one.

## Tooling

- Node commands (`node`, `npx`, `npm`) on macOS with nvm need the PATH export
  from CLAUDE.md's "Environment / gotchas" section. Windows installs put `node`
  on PATH already.
- Run `npx`/`npm` from the project root.
