---
name: lab-review
description: Documentation-only review of a drafted lab guide before the VM exists. Trims environment.md to the published shape, walks every module's commands for correctness, applies the lab house rules, runs unslop, and syncs SETUP.md and SUPPORT.md. No screenshots, no topology, no VM.
---

# Lab review

Clean up one lab's documentation to the standard of the finished labs
(any lab in `labs/` that has shipped; the Linux Intermediate repo's
`broken-path` and `confined-service` are the reference shape) without
touching anything that needs a built VM. `$ARGUMENTS` is the lab slug (e.g.
`/lab-review log-rotation-tool`).

Out of scope, on purpose (each has its own stop): rendering screenshots or
writing `shots_spec.py`, drawing the topology (`/lab-topology <slug>`),
building or dry-running the VM, pushing to the lab repo. Command output stays
in `text` blocks until a dry run exists to capture from. Do not invent
"realistic" output beyond what the review below requires you to correct.

## Inputs

- `labs/<slug>/{index,description,environment,module-*}.md`, `SETUP.md`,
  `SUPPORT.md`.
- A finished lab, for the target shape of each file.
- CLAUDE.md's platform profile (shell, prompt, elevation model, output
  trimming rule) — the command walk below is checked against THAT platform.
- `.claude/skills/lab/SKILL.md` (the format rules) and
  `.claude/skills/unslop/SKILL.md` (the prose pass). Read both first.

## 1. environment.md to the published shape

The learner page carries only: `# Environment Overview` (two paragraphs: what
the environment is, what state it starts in), the
`![environment](./media/environment/lab-topology.svg)` line, `## Accessing
Your Lab Environment` (portal paragraph; say how many reboots the lab does,
or that it never reboots), `## Device Access Information`. Target length is
about 17 lines for a single-device lab. Reuse a finished lab's wording for the
management-network sentence and the portal paragraph.

Anything else that was in the file (pre-seeded file tables, exact file
contents, sample data, sizes) moves to `SETUP.md` under a final
`## Pre-seeded files (exact content)` section, as paste-ready `tee ... <<'EOF'`
blocks plus the `chmod`/`chown` lines, with a table of paths. Rewrite any
`SETUP.md` item that said "see environment.md" to point at that section.
Generated data (sample logs) gets a small shell generator that hits the sizes
the guide quotes, not a "for example" fragment.

Add a dated `Status <today>:` paragraph near the top of `SETUP.md` saying
what this pass did and that the VM is not built or dry-run yet.

## 2. Walk the commands with a running model

Read the modules in order and keep a written model of three things after
every step: the learner's **shell or session** (cwd, mode, variables set in
the interactive shell, which is almost none), the **system state** (which
files, directories, services, registry keys or config lines exist, who owns
them, what a log contains), and the **artifact under construction** (the
script, unit file, GPO or running-config, as exact current text). Every
command in the guide has to work against that model.

The checks below are the classes of bug this catches. The examples are from
Linux drafts because that is where the list was built; for another platform,
translate each class using the "Platform equivalents" notes at the end and
add what you find to that list.

- A variable set inside the script used in the learner's shell
  (`mkdir -p "$ARCHIVE_DIR"` at the prompt, where it is unset). Move the
  command into the script or name the path directly.
- `echo $?` after a second command (`./x.sh; cat log; echo $?` reports
  `cat`). Put it on the same line as the command it measures.
- Shown output whose order a real shell would not produce. `ls` and globs
  sort by collation: `app.log` before `archive 2024 report.log` in both C
  and en_US. Fix the order in every `text` block and in every log excerpt
  derived from a loop over the glob.
- `tail -N` or `head -N` that does not match the number of lines the model
  says the file has.
- Claims about linters or tools. If the guide says `shellcheck` is clean,
  lint the checkpoint script in your head against the common codes:
  SC2086 (unquoted expansion), SC2155 (`local x="$(cmd)"` on one line),
  SC2181 (`if [ $? ...]`), SC2046, SC2164 (`cd` without `|| exit`). Fix the
  script, and turn the fix into a sentence of teaching where it helps.
- Parameter-expansion edge cases against the actual sample data. `${var/ /_}`
  replaces one space; a sample name with two spaces needs `//`.
- Timing races in interrupt demos (`timeout N` vs `sleep M` per iteration).
  Choose values so the interrupt lands in the middle of a sleep with margin
  on both sides, and make the shown leftover file the one the model says is
  in flight at that moment.
- `env -i` demos: the first external command the script calls is the one
  that fails first (`date` inside a logging function, not `mktemp` further
  down). Compute the reported line numbers from the checkpoint script, do
  not guess them, and show the first few lines plus "the output goes on like
  that".
- Tools that print notices as well as results: GNU `tar` prints
  `Removing leading '/' from member names`, `cryptsetup luksFormat` wants an
  uppercase `YES`, `crontab -e` on a fresh Ubuntu asks which editor to use
  (tell the learner to type `1` for nano and give the save/exit keys).
- Services started by systemd run as root unless the unit says otherwise.
  If the learner then goes back to the files as their own account, add
  `User=<account>` and a sentence on why.
- Output shape of well-known tools on the image named in `SETUP.md` (e.g.
  Ubuntu 24.04, systemd 255): `systemctl status` for a finished oneshot-style run is
  `○ ... inactive (dead)` with `Process:` and `Main PID: ... status=0/SUCCESS`;
  `list-timers` ends with `N timers listed.`; `journalctl` lines carry the
  hostname. Make the guide's blocks plausible for that, then list them in
  the report as items the dry run must confirm.
- Checkpoint blocks ("your script should now read") must equal the sum of
  the incremental edits above them, including where each function sits.
  Diff them mentally line by line.
- Anything that needs a hostname (journal lines, prompts) needs the hostname
  decided in `SETUP.md`. Pick `<lab-word>-lab` if none exists and say so.

### Platform equivalents

Build the same running-model checks for the platform in CLAUDE.md's profile.
Starting points:

- **PowerShell / Windows Server:** `$?` is a boolean, `$LASTEXITCODE` is the
  native exit code; a script the learner just created needs the execution
  policy the guide set (or `-ExecutionPolicy Bypass`); `Get-ChildItem` sorts
  by name with the culture's collation; cmdlets that need a module report
  the import the first time; commands that need elevation fail with a
  distinct access-denied message in a non-elevated session; `Restart-Service`
  output is silent on success; reboots drop the portal session ("Reconnect").
- **Cisco IOS / IOS-XE:** `show` commands run in privileged EXEC, config
  commands need `configure terminal` and the right sub-mode, and the prompt
  in every shown block must reflect the mode (`Router#`, `Router(config)#`,
  `Router(config-if)#`); interfaces start `shutdown`; `write memory`/`copy
  run start` before any reload; `show ip interface brief` and `show ip
  route` output shape depends on the IOS version named in `SETUP.md`.
- **Web consoles / GUIs (Azure, vCenter, Windows MMC):** every click path is
  a numbered step with a screenshot placeholder per dialog; wording matches
  the console's current labels; the learner's tenant or subscription scope is
  stated up front.

## 3. House rules from `/lab`

Check each of these and fix silently:

- The first elevated command in the lab gets the `!!! note` matching the
  platform's elevation model (for `sudo`: the password verbatim, "nothing
  echoes", "about 15 minutes"; copy a finished lab's wording).
- No markdown filenames in learner text ("the Environment page", "Module 2").
- Shown output trimmed per the platform profile (no IPv6 or layer-2 detail
  on Linux/Windows networking labs).
- Portal language: one browser terminal or console tab per device,
  "Reconnect" after reboots, never SSH/RDP or tmux between lab hosts.
- Every module ends with `## What You Have Learned` plus a bridge sentence;
  the last module ends with the workflow summary and the Congratulations
  paragraph.
- Section headings keep WWT Title Case; `!!! note` bodies are 4-space
  indented; 1-3 notes per module.
- `description.md` does not open with the ATC boilerplate.

## 4. Unslop

Run `.claude/skills/unslop/SKILL.md` over `description.md`,
`environment.md`, and every `module-N.md`, respecting its "Course content"
exceptions (lab headings, the Congratulations paragraph, commands and output
are out of scope). The tells that show up most in lab drafts: em dashes,
colon-as-connector ("This is the problem: ..."), "not X, but Y", "exactly /
actually / genuinely / simply", contractions piling up in teaching prose,
and closing flourishes ("the exact skills you will lean on ..."). Keep a
concrete failure story or a deliberate repeat when it is the lesson.

## 5. Sync SETUP.md and SUPPORT.md

Anything the walk changed that a builder or the support desk needs:
hostname, packages, new files, new gotchas as troubleshooting paragraphs
(symptom first, plain text, no markdown, no password), and the status line
at the top of `SUPPORT.md` still saying the lab is not built or dry-run.

## 6. Final sweep, then report

```bash
cd labs/<slug>
grep -n '—\|[“”‘’]' description.md environment.md module-*.md          # em dashes, curly quotes
grep -n 'environment\.md\|module-[0-9]\.md' description.md environment.md module-*.md
grep -n -i 'exactly\|actually\|genuinely\|simply\|precisely\|in order to\|leverage\|crucial\|ensure' description.md environment.md module-*.md
```

All three should print nothing (a literal "exactly one word per element" is
fine; judge the hits). Then report to the user, grouped by file: what moved,
each command fix with the one-line reason, and a separate **anticipated,
confirm at dry run** list of every output block you adjusted on knowledge
rather than capture. Name the hostname you chose. STOP for review.

## Editing mechanics

Make the changes with exact-match replacements that fail loudly when the
anchor text is missing (a small Python `rep(path, old, new)` asserting one
match), never with regexes over whole files. Read a module in full before
editing it; the anchors must be copied verbatim, indentation included.
