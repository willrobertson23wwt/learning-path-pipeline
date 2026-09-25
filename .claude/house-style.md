# House style

Rules shared by the pipeline skills. Each skill links here instead of repeating
them, so a rule changes in one place. Skill-specific rules stay in the skill.

## Where content lives

Course content never goes in a template repo. Stop before writing anything
if either is true:

- `package.json`'s `name` is `learning-path-pipeline` (the template), or
- a `TEMPLATE.md` file sits at the repo root (an older template folder).

Tell the user this folder is a template, and that the work belongs in a
learning-path folder made from it with `/new-path <topic>`. A template is
copied into every new learning path, so anything written into it leaks into
all of them.

<!-- FORMAT:design -->
## Course design

(Filled in by `/new-path` from
`formats/<format>/fragments/house-style-design.md`: how a path in this
format is shaped and why.)
<!-- /FORMAT:design -->

## Learner-facing prose

This covers outline copy, narration, articles, and lab guides.

- **Style guide.** Write to `.claude/style-guide.md`: the Google developer
  documentation style guide as the base manual, with house departures and
  rule IDs for voice (V), global English (G), mechanics (M), formatting
  (F), procedures (P), inclusive language, and brief citations. Narration
  follows its voice rules and the ear-writing rules in `/scripts`. Lab
  pages follow the linux-intermediate lab conventions, and the style
  guide's "Lab pages" section lists the rules they set aside.
- **Text alternatives for every medium.** A screenshot's alt text on a lab
  page is short: the command or the result. In a lab-first path, a GIF's
  `aria-label` names the keys pressed and the visible result, and each
  reference card has a text version under its image, inline at the step
  that uses it. Narration names,
  by meaning, every on-screen fact the explanation depends on, so a video
  needs no separate audio description (WCAG 1.2.5).
- **No emojis, anywhere.** Not in learner content, on-screen text, outlines,
  lab guides, research briefs, agent reports, or replies to the user. Label
  things with words. The user strips them on sight, as with em dashes.
- **No em dashes or en dashes.** Use commas, periods, or separate sentences. They are the
  most visible AI tell and the user strips them on sight.
- **Placeholders are reserved or fictional:** IPs, hostnames, CVEs, tenant
  IDs, serial numbers. Real ones in training material either point learners at
  someone else's systems or go stale.
- **Courses are standalone.** Never reference the user's other courses ("as
  you saw in the intro course"). Learners may skip prerequisites, and a
  dangling callback confuses them.
- **Callbacks name the concept, never a video or lab number:** "the inodes
  model from the links lab", not "Lab 3" or "video 5". On lab pages a video
  can be named by its topic ("the addressing video showed you"). Learners
  skip around, each lab is its own repo, and the platform doesn't number
  things the way the outline does.
- **Code-block language tags and shown prompts** come from the platform
  profile in CLAUDE.md (`bash`, `powershell`, or `text` for device CLIs;
  `yaml`/`json`/`ini` for config files).
- **Last step before saving:** run the unslop pass
  (`.claude/skills/unslop/SKILL.md`) over the prose, respecting its "Course
  content" exceptions.
- **Then have it checked:** after saving, run the `prose-checker` agent on
  the saved files and fix each FIX it returns (NOTEs at your judgment). It
  cites unslop rule numbers and style-guide IDs. Authors miss their own tells; a fresh reader catches them. A subagent
  can't launch agents, so when an agent wrote the prose, whoever launched it
  runs the checker and sends the findings back.

## Research briefs

The `researcher` agent writes cited briefs to `courses/<slug>/research/`
(`outline.md`, then per format: lab-first paths keep one `NN-<lab-slug>.md`
per lab shared by `/scripts` and `/lab`, and `capstone.md`; traditional
paths keep one `module-N-<module-slug>.md` per module shared by `/scripts`
and `/lab`). They're internal
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
- **Sources use the style guide's citation format** (a compact APA 7 entry
  with an access date, cited by numeric key), so a later reader can tell
  current vendor docs from an old blog post.
- **Nothing from a brief is cited in learner content.** No provider names,
  no "according to", no links unless the lesson itself needs one.

## Tooling

- Node commands (`node`, `npx`, `npm`) on macOS with nvm need the PATH export
  from CLAUDE.md's "Environment / gotchas" section. Windows installs put `node`
  on PATH already.
- Run `npx`/`npm` from the project root.
