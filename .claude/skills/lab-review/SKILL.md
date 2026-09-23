---
name: lab-review
description: Documentation-only review of a drafted lab guide in labs/<lab-slug>/ before its VM exists. Walks every command against a running model of the shell and system state, fixes command bugs, applies the lab house rules, trims the Environment page to its published shape, runs unslop, and syncs SETUP.md and SUPPORT.md. Use when the user asks to review, check, clean up, or proofread a drafted lab, e.g. "/lab-review log-rotation-tool". No screenshots, topology, or VM work.
argument-hint: <lab-slug>
---

# Lab review

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Bring one drafted lab's documentation up to the standard of the finished
labs, without anything that needs a built VM. `$ARGUMENTS` is the lab slug
(`/lab-review log-rotation-tool`).

Out of scope on purpose, because each has its own stage: rendering
screenshots or writing `shots_spec.py`, drawing the topology
(`/lab-topology`), building or dry-running the VM, pushing to the lab repo.
Command output stays in `text` blocks until a dry run exists to capture from.
Don't invent "realistic" output beyond what the fixes below require.

## How this runs

Three agents, so the review isn't done by whoever drafted the lab:

1. **`lab-walker`** carries out steps 1-6 below in a fresh context and
   returns the step 6 report. Keep its agent ID.
2. When it returns, launch in parallel:
   - **`prose-checker`** on `description.md`, `environment.md`, every
     `module-*.md`, and `reference.md` if the lab has one.
   - **`lab-learner`** with the lab slug, plus the course slug and the lab's
     number in the outline (or `capstone`). Find them from the
     `**Lab repo:** <lab-slug>` line in `courses/*/outline.md`; if none
     matches, run it without them and say so.
     It reads only the learner pages, never SETUP.md, so it catches gaps
     the walk can't see.
3. Triage. Send every prose-checker FIX, and every learner BLOCKING or
   CLARIFY finding with an unambiguous wording fix, back to the walker with
   `SendMessage`. Keep learner findings that need a design decision (a step
   to add, a concept the videos didn't teach) for the user.
4. Report the walker's step 6 report, its fix-round replies, and a
   **learner findings for you** list of what you kept back. Stop for review.

If the agents are unavailable, do steps 1-6 here yourself.

## Read first

- `labs/<slug>/`: `index.md`, `description.md`, `environment.md`,
  `module-*.md`, `SETUP.md`, `SUPPORT.md`.
- `.claude/skills/lab/references/guide-format.md` (page shapes and house
  rules) and `.claude/skills/lab/references/internal-docs.md` (SETUP and
  SUPPORT formats). This review checks against them.
- `.claude/style-guide.md`, whose rule IDs (V, G, M, F, P) the findings
  cite, and `.claude/skills/unslop/SKILL.md` for the prose pass.
- CLAUDE.md's platform profile. The command walk is checked against that
  platform.
- The lab's section of `courses/<course-slug>/outline.md` (found by its
  `**Lab repo:** <slug>` line): its guidance level, steps, media IDs,
  predict prompts, and checks.
- `courses/<course-slug>/research/NN-<lab-slug>.md` (or `capstone.md`), if
  it exists: the researched output shapes, predict outcomes, check commands,
  and gotchas for the lab's image. Prefer it to memory for the "output shape
  of well-known tools" check, and say in the report which blocks it
  confirmed.
- A finished lab in `labs/` if there is one, for target wording. The Linux
  Intermediate repo's `broken-path` and `confined-service` are the reference
  shape.

## 1. Environment page to its published shape

Trim `environment.md` to the shape in the guide format. Move anything else it
holds (pre-seeded file tables, exact contents, sample data, sizes) into
SETUP.md's `## Pre-seeded files (exact content)` section in the format given
there, and repoint any SETUP.md item that said "see environment.md". Update
SETUP.md's `Status` paragraph to say what this pass did and that the VM isn't
built or dry-run yet.

## 2. Walk the commands with a running model

Read the modules in order. After every step, keep a written model of three
things:

- the learner's **shell or session**: cwd, mode, and variables set at the
  interactive prompt (almost none);
- the **system state**: which files, directories, services, registry keys, or
  config lines exist, who owns them, what a log contains;
- the **artifact under construction**: the script, unit file, GPO, or running
  config, as exact current text.

Every command in the guide has to work against that model. The checks below
are the bug classes this catches. They were collected on Linux drafts; for
another platform, translate each class using "Platform equivalents" and add
what you find there.

- A variable set inside the script used at the learner's prompt
  (`mkdir -p "$ARCHIVE_DIR"` where it's unset). Move the command into the
  script or name the path directly.
- `echo $?` after a second command (`./x.sh; cat log; echo $?` reports
  `cat`). Put it on the same line as the command it measures.
- Output order a real shell wouldn't produce. `ls` and globs sort by
  collation (`app.log` before `archive 2024 report.log` in both C and
  en_US). Fix the order in every `text` block and in every log excerpt from a
  loop over the glob.
- `tail -N` or `head -N` that doesn't match the line count the model says the
  file has.
- Claims about linters. If the guide says `shellcheck` is clean, lint the
  checkpoint script in your head against SC2086 (unquoted expansion), SC2155
  (`local x="$(cmd)"` on one line), SC2181 (`if [ $? ...]`), SC2046, and
  SC2164 (`cd` without `|| exit`). Fix the script, and turn the fix into a
  teaching sentence where it helps.
- Parameter-expansion edge cases against the real sample data: `${var/ /_}`
  replaces one space, so a name with two spaces needs `//`.
- Timing races in interrupt demos (`timeout N` vs `sleep M` per iteration).
  Pick values so the interrupt lands mid-sleep with margin on both sides, and
  show the leftover file the model says is in flight at that moment.
- `env -i` demos: the first external command the script calls fails first
  (`date` inside a logging function, not `mktemp` further down). Compute the
  reported line numbers from the checkpoint script instead of guessing, and
  show the first few lines plus "the output goes on like that".
- Tools that print notices as well as results. GNU `tar` prints `Removing
  leading '/' from member names`; `cryptsetup luksFormat` wants an uppercase
  `YES`; `crontab -e` on a fresh Ubuntu asks for an editor (tell the learner
  to type `1` for nano and give the save and exit keys).
- Services started by systemd run as root unless the unit says otherwise. If
  the learner goes back to the files as their own account, add
  `User=<account>` and a sentence on why.
- Output shape of well-known tools on the image SETUP.md names (e.g. Ubuntu
  24.04, systemd 255): `systemctl status` for a finished oneshot run shows
  `○ ... inactive (dead)` with `Process:` and `Main PID: ...
  status=0/SUCCESS`; `list-timers` ends with `N timers listed.`; `journalctl`
  lines carry the hostname. Make the guide's blocks plausible for that image,
  then list them in the report for the dry run to confirm.
- Checkpoint blocks ("your script should now read") must equal the sum of the
  edits above them, including where each function sits. Diff them line by
  line.
- Anything that shows a hostname (journal lines, prompts) needs the hostname
  decided in SETUP.md. Pick `<lab-word>-lab` if there isn't one and say so.
- **Predict reveals** must match what the model says the command prints. A
  reveal that's wrong on the real image teaches the opposite of the lesson;
  treat it as the most serious bug in the lab.
- **Portal checks:** run each check in SETUP.md's table against the model
  twice, on the starting state (it must fail, as the table's last column
  says) and on the state after the page's steps (it must pass). A check
  that passes on the starting state, or that a correct but different
  solution fails (mode `750` where the page allows `750` or `770`), is a bug.
  Every check the pages name is in the table, and every table row is named
  on a page.
- **Capstone seeding:** each seeded problem in SETUP.md produces exactly the
  symptom the scenario describes, and nothing else is broken.

### Platform equivalents

- **PowerShell / Windows Server:** `$?` is a boolean and `$LASTEXITCODE` is
  the native exit code. A script the learner just created needs the execution
  policy the guide set (or `-ExecutionPolicy Bypass`). `Get-ChildItem` sorts
  by name with the culture's collation. Cmdlets that need a module report the
  import the first time. Commands that need elevation fail with a distinct
  access-denied message in a non-elevated session. `Restart-Service` is silent
  on success. Reboots drop the portal session ("Reconnect").
- **Cisco IOS / IOS-XE:** `show` commands run in privileged EXEC; config
  commands need `configure terminal` and the right sub-mode, and every shown
  prompt must match the mode (`Router#`, `Router(config)#`,
  `Router(config-if)#`). Interfaces start `shutdown`. `write memory` or `copy
  run start` before any reload. `show ip interface brief` and `show ip route`
  output depends on the IOS version in SETUP.md.
- **Web consoles and GUIs (Azure, vCenter, Windows MMC):** every click path is
  a numbered step with a screenshot placeholder per dialog, wording matches
  the console's current labels, and the learner's tenant or subscription
  scope is stated up front.

## 3. House rules

Check every item in the guide format's "House rules" list and the module
page endings (What You Have Learned, the final summary and Congratulations,
1-3 notes per module). Then the "Lab-first pages" section:

- Every step reads at the lab's guidance level. Exact commands for a task
  the path already taught, in a goal-plus-hint lab, is a fix; a missing
  command in a fully guided one is too.
- Each GIF sits directly before the step it helps with; each video directly
  after the predict or try step it explains, with its length, its
  "optional" label when the outline has one, and its captions track.
- Each predict prompt asks the learner to decide before the step that runs
  the command, and its reveal is collapsed.
- Media references use the media IDs from the outline, at the paths the
  format gives, and every item the outline places in this lab appears.
- Reference cards are on the Reference Cards page and named at the step
  that first needs them. Each has a text version under its image (a table
  or list) that matches the card spec's `## Card layout` row for row.
- Each GIF is the guide format's `<video autoplay loop muted playsinline
  controls preload="auto" poster=... aria-label=...>` embed pointing at
  `<media-id>.mp4` and its `<media-id>.png` poster, never a `.gif` image.
  Its `aria-label` names every key pressed and the visible result, and
  every string the loop shows is in the `aria-label` or the step text right
  after it (F9).
- Alt text says what the image shows and never starts with "Image of",
  "Screenshot of", or "GIF of" (F9). The topology alt names each device, its
  hostname, and its network, with the Device Access Information table as
  the long description. An output screenshot already on a page quotes,
  verbatim, the lines the learner compares against.
- Predict options are bullets with the letter in the text (`- a. It gets
  deleted`, M11). Bare `a.` lines render as one paragraph.
- Hints follow the guide format's two levels, Hint then Answer (`Stuck?
  Hint` and `Stuck? Answer` in the capstone), at the levels the
  guidance-level table gives. A Hint that doesn't name the tool or where to
  look is too vague to act on.
- Each goal step has one defensible end state in the words of its portal
  check's pass condition (P10), and each check row in SETUP.md has a fail
  message.
- Callbacks to other labs name the concept, never a lab number.

Then the style guide's procedure and formatting rules at each step: purpose
and place before the command (P1), one action and one block per step with
no prompt in the block (P2, F5), the result in the same step with "The
output is similar to the following:" where values vary (P4), a recovery
line at each error-prone step (P5), deliberate failures announced (P6),
`**Optional:**` steps nothing later depends on (P7), and no sub-steps (P8).
A note never holds a step; a gotcha that makes a step fail belongs in the
step or a `!!! warning` before it. Task headings start with an imperative
verb and run 3 to 11 words, with no gerunds and no code. UI labels and keys
are bold (F2, F3), and placeholders follow F4.

Fix them without asking, and cite the rule ID (P4, F9, M11) with each fix in
the report.

## 4. Unslop

Run the unslop pass over `description.md`, `environment.md`, every module,
and the text versions on `reference.md`, respecting its "Course content" exceptions. The tells that show up
most in lab drafts: em dashes, colon-as-connector ("This is the problem:
..."), "not X, but Y", "exactly / actually / genuinely / simply", and closing
flourishes ("the exact skills you will lean on ..."). Contractions are a
density judgment, not a tell (V3): don't, isn't, and it's are fine; fix
noun-plus-verb forms ("the file's ready"), 'd and 'll, and a sentence
stacked with several. Keep a concrete failure story or a deliberate repeat
when it's the lesson.

## 5. Sync SETUP.md and SUPPORT.md

Carry over anything the walk changed that a builder or the support desk
needs: hostname, packages, new files, and new gotchas as troubleshooting
paragraphs in SUPPORT.md's format. Keep SUPPORT.md's status line saying the
lab isn't built or dry-run.

## 6. Final sweep, then report

```bash
cd labs/<slug>
P=(description.md environment.md module-*.md); [ -f reference.md ] && P+=(reference.md)
prose() { awk 'FNR==1{f=0} /^[[:space:]]*```/{f=!f; next} !f{print FILENAME":"FNR": "$0}' "${P[@]}"; }   # prose only, fenced blocks dropped
perl -CSD -ne 'print "$ARGV:$.: $_" if /[\x{2013}\x{2014}\x{2026}\x{2018}\x{2019}\x{201C}\x{201D}]/; close ARGV if eof' "${P[@]}"   # em and en dashes, ellipsis, curly quotes (M2, M10, M13)
grep -n 'environment\.md\|module-[0-9]\.md' "${P[@]}"
prose | grep -i 'exactly\|actually\|genuinely\|precisely\|in order to\|leverage\|crucial\|ensure'   # unslop tells
prose | grep -iwE 'just|simply|easy|easily|obviously|of course|quickly|straightforward|please'   # minimizers (V4)
prose | grep -iwE "we|us|let's|our"                                  # first person plural (V1)
prose | grep -iE "[a-z]'(ll|d)([^[:alnum:]]|$)"                      # 'll and 'd contractions (V3)
prose | grep -iwE 'e\.g\.|i\.e\.|etc\.|via|since'                   # ambiguous words (G2)
prose | grep -iwE 'above|below|here|on the (right|left)'             # position words, bare link text (F6)
prose | grep -iwE 'master|slave|whitelist|blacklist|sanity|dummy|hangs?|hung|cripple[sd]?|guys|blind to'   # inclusive terms
prose | grep -E '[0-9]s([^[:alnum:]_]|$)'                            # unspaced durations such as "(8s)" (M5)
grep -nE '^[a-z]\. ' module-*.md                                     # predict options not in list syntax (M11)
grep -n '\.gif' "${P[@]}"                                            # GIFs ship as .mp4 plus a .png poster
grep -n '<video autoplay' module-*.md | grep -vE 'loop muted playsinline controls .*poster=.*aria-label="[^"]+"'   # GIF embed shape
grep -niE '!\[(image|screenshot|gif|picture)|!\[environment\]|!\[\]|aria-label="(gif|video|animation) of' "${P[@]}"   # weak alt text (F9)
```

Every line should print nothing; judge the hits. A literal "exactly one word
per element" is fine, and so is "since" meaning "from that time", "here" in
a sentence that doesn't point by position, a duration inside a code span
(`sleep 5s`), or an old term inside inline code that the platform prints
(the vendor-literal exception in the style guide's "Inclusive language").
The grep can't tell those apart, so read each hit.

Then report, grouped by file: what moved, each command fix with a one-line
reason, each rule fix with its style-guide ID, the hostname you chose, and a
separate **anticipated, confirm at dry run** list of every output block you
adjusted from knowledge instead of capture. End with **Open items**, which
always includes this one until the user settles it: test whether the ATC
site renders Material for MkDocs `{ .text .no-copy }` output blocks (the
`attr_list` extension) without a copy button. If it does, propose to the
user switching command output from screenshots to text blocks; don't switch
it in this pass. Stop for review.

## Editing mechanics

Read a module in full before editing it. Make changes with exact-match
replacements that fail loudly when the anchor is missing (the Edit tool, or a
small Python `rep(path, old, new)` that asserts exactly one match), never with
regexes over whole files. A regex that silently matches the wrong place, or
nothing, corrupts a guide in ways the final sweep won't catch.
