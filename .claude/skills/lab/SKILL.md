---
name: lab
description: Draft the hands-on lab guide (WWT mkdocs format) for a module's lab
---

Draft the lab guide for one module's closing lab. `$ARGUMENTS` is the course
slug and module number (e.g. `/lab powershell-fundamentals 1`). The lab title comes
from the outline's `**Lab:**` line for that module.

## Inputs

- `courses/<slug>/outline.md` — the module's videos and lab title. The lab must
  exercise the skills that module's videos taught (and only those, plus
  reasonable prerequisites from earlier modules).
- The module's scripts in `courses/<slug>/scripts/` if written — reuse their
  running examples for continuity (e.g. the module's example script becomes the
  artifact the lab builds on).

## Output

Write to `labs/<lab-slug>/` in this repo (drafting location; each lab folder is
later uploaded as its own standalone GitHub repo, so name the slug for what the
lab is, not its module number — no `01-`/`02-` prefix; the files map 1:1 into
the `labdocs/docs/` folder of the WWT lab repo scaffold):

- `index.md` — opens with the WWT logo line exactly as
  `![WWT Logo](./media/index/wwt-logo-color-stacked-high.png)`, then
  `# <Course>: <Lab Title>`, and a Version History table (today's date, `1.0`,
  author, `Initial release`). Copy the logo itself from
  `.claude/skills/lab/assets/wwt-logo-color-stacked-high.png` into the lab's
  `media/index/` as part of scaffolding (house rule: the logo must
  always be present, never hand-copied later; the same filename is used by every
  WWT lab repo).
- `environment.md` — see below.
- `module-1.md` … `module-N.md` — 2-4 modules, each a 10-20 minute exercise.
- `description.md` — a 2-4 sentence lab-listing blurb. **Never open it with the
  "<OS> desktop hosted in the WWT ATC" boilerplate** — lead with what the
  learner will do and why it matters.
- `SETUP.md` — internal provisioning checklist for whoever builds the ATC VM,
  never the learner. A plain checkbox punch list (not an executable script):
  base image/account, a **vApp edge firewall** section (house rule:
  a rules table for the vCloud Director edge — inbound only the portal SSH
  ports to the gateway/lab VM, outbound only what the guide's commands need
  such as ICMP, UDP 33434-33534 for traceroute and 53 for DNS, default deny
  with logging on, plus a note to open TCP 80/443 out temporarily for package
  updates (`apt`, Windows Update, `install add`) during image maintenance),
  packages/features/licenses to verify/install, exact
  pre-seeded files and directories with ownership/permissions (reference
  `environment.md` rather than duplicating it), confirming a clean slate (no
  leftover artifacts from building the checklist itself), and a final
  dry-run-then-reset-then-snapshot step. `labs/**/SETUP.md` is gitignored — never part of the published guide.
- `SUPPORT.md` — internal notes for the ATC support team once the lab is live, never pushed to GitHub: the course repo ignores
  `labs/`, and each lab repo's `.gitignore` lists `SUPPORT.md`, so never copy
  it into the lab repo. **Plain text, not markdown**: each section pastes into
  a plain textarea on the ATC lab form, which renders no markdown and no
  bullets. No backticks, bold, headings or list markers; quote commands with
  double quotes inline, or one per line for a reset sequence; separate items
  with blank lines. Three ALL-CAPS section labels: LAB NOTES (the form asks
  "what needs to happen to run this lab": VMs, sizing, disks, network,
  credentials, seeded state that must be present, reboot count, portal
  behavior, learner time, build/test status), LAB PURPOSE (one paragraph),
  TROUBLESHOOTING (one paragraph per symptom in module order, symptom as the
  first sentence, then cause, check and fix; end with a reset-to-starting-state
  command sequence and a verify paragraph). Never put the lab password in it;
  name the account and point at the guide's Device Access table. The first
  two can be short. Until the VM has been built and dry-run, say so up front
  and call the entries anticipated.
- `media/environment/`, `media/index/`, and `media/module-1/` … `media/module-N/`
  — one folder per file that can carry screenshots, created up front as a
  standard part of every lab's structure, even before any screenshots exist.
  All are empty except `media/index/`, which always holds the WWT logo above.

Then STOP for user review. Do not create terraform/ansible provisioning — the
guide only; the vApp is planned later with `/lab-build <lab-slug>` (Lab Builder)
after `/lab-review`. Screenshots are captured by the user later: reference them as
`![name](./media/module-N/name.png)` (or `./media/environment/name.png`,
`./media/index/name.png`) placeholders at each point where a command result
deserves one.

## environment.md format

1. `# Environment Overview` — two short paragraphs: what the environment is
   (the default from CLAUDE.md's platform profile, e.g. an Ubuntu VM, a
   Windows Server VM, or a Cisco device, reached through the WWT ATC Lab
   Portal) and what state it starts in (pre-seeded files/services/config the lab
   needs), then `![environment](./media/environment/lab-topology.svg)`. The
   SVG itself is drawn afterwards with `/lab-topology <lab-slug>` (a separate
   review stop) — don't hand-draw it here.
2. `## Accessing Your Lab Environment` — ATC portal access paragraph plus a
   `!!!note` about on-demand provisioning taking a few minutes.
3. `## Device Access Information` — credentials table, one row per device
   (`<Device> | Browser (ATC Portal) | <account> | <password>`, defaults from the
   platform profile, e.g. `Ubuntu 24.04 VM | Browser (ATC Portal) | labuser |
   Labpass01!`).

State the pre-seeded starting condition precisely (files, sizes, services,
running-config) —
it is the spec for whoever builds the environment automation later.

## Module format (match the existing WWT labs)

- `# <Task-shaped title>` then an intro paragraph: why this task matters and
  what the learner will accomplish. Teach, don't just instruct — every command
  gets a sentence of purpose before or after it.
- `## <Step group>` sections containing numbered steps. Each step: one action,
  a fenced block tagged with the platform's shell (`bash`, `powershell`, or
  `text` for device CLIs, per CLAUDE.md's platform profile) holding the
  copy-accurate command, then the output as a **rendered terminal
  screenshot**, then what to look for in it. Never put command output in a
  fenced `text` block: the ATC site script puts a copy button on every code
  block, so output blocks read like commands. Render each output with
  `scripts/lab-terminal-shot.py` (green-on-black portal look: prompt + command
  as typed, realistic full output, trailing prompt with cursor; the prompt
  string from the platform profile, e.g. `labuser@<host>:~$ `,
  `PS C:\Users\labuser> `, `Router#`; include the elevation prompt, e.g.
  `[sudo] password for labuser: `, on a session's first elevated command)
  into `media/module-N/<descriptive-name>.png` and reference it as
  `![<what it shows>](./media/module-N/<name>.png)`. Keep the spec for all of
  a lab's shots in `labs/<slug>/shots_spec.py` so they can be re-rendered
  together (also pushed to the lab repo root). GUI steps (a Windows console,
  a web UI) get a real screenshot placeholder per dialog instead. Trim shown
  output per the platform profile's output-trimming rule, see below.
- `!!!note` admonitions (4-space indented body) for conceptual asides,
  gotchas, and "what this really means" moments — 1-3 per module.
- Small tables for reference material (flag meanings, layer models).
- Module 1 starts from inspection/orientation ("Opening a Terminal" reminder,
  then survey the starting state); later modules build to the finished
  artifact; the lab's arc mirrors the module's videos.
- Each module ends with `## What You Have Learned` — bullets of the concrete
  findings/skills, plus a sentence bridging to the next module.
- The FINAL module instead ends with a `## <Workflow> Summary` (the numbered
  end-to-end procedure they just performed) and a closing paragraph:
  "Congratulations. You have completed the **<Course>: <Lab Title>** lab…"
  naming the skills gained and where they apply.

## Style

- Second person, present tense, plain confident prose. No em-dashes.
- Commands copy-accurate and runnable in order on the stated environment; any
  placeholder values (IPs, hostnames, serials, tenant IDs) reserved/fictional.
- Trim shown output to what the lesson needs, per the platform profile's
  output-trimming rule. Keep the commands as taught, trim only the output. On
  Linux and Windows networking labs that means no IPv6 or layer-2 detail
  anywhere in the learner-facing guide: drop `fe80::` link-locals and `::1`,
  `[::]` listener rows, `(v6)` firewall rows, MAC addresses, and any prose
  explaining them. On device CLIs drop unrelated interfaces and boilerplate
  banners. MAC/interface tables belong only in the internal SETUP.md.
- Standalone within the course: reference this module's videos freely ("as you
  saw in the videos"), never other courses.
- The learner should be able to complete the lab with ONLY this guide open.
- At the lab's FIRST elevated command, add a `!!! note` explaining the
  platform's elevation model (from the platform profile). For `sudo`: it will
  prompt for the lab user's password, give the password verbatim (lab
  credentials are not secret), typing doesn't echo, and sudo caches it for
  ~15 minutes. For Windows: how to open an elevated PowerShell and what the
  UAC prompt looks like. For a device CLI: `enable` and the enable password.
- The ATC portal opens one browser terminal (or console) tab per lab device.
  Write multi-host steps as tab switches
  ("In the **web01 tab**, ..."), name the tab in each step, and remind the
  learner to read the prompt. Never have learners SSH/RDP between lab hosts or
  use tmux just to get a second shell. Every device the learner touches gets a
  `Browser (ATC Portal)` row in the Device Access table.
- Never mention markdown filenames in learner-facing text (`environment.md`,
  `module-2.md`). Learners see the rendered mkdocs site, so refer to pages by
  their nav names: "the Environment page", "Module 2".
- Unslop pass before saving: run
  `.claude/skills/unslop/SKILL.md` over each module, `environment.md` and
  `description.md` as the last step. Lab section headings keep the WWT Title
  Case format and the closing "Congratulations" paragraph stays; `SETUP.md`,
  commands and shown output are out of scope.
