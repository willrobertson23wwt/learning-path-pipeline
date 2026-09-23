---
name: lab-review
description: Documentation-only review of a drafted lab guide in labs/<lab-slug>/ before its VM exists. Walks every command against a running model of the shell and system state, fixes command bugs, applies the lab house rules and the lab-first checks, trims the Environment page to its published shape, runs unslop, and syncs SETUP.md, SUPPORT.md, LISTING.md, the quickref page, shots_spec.py, and the dryrun states. Use when the user asks to review, check, clean up, or proofread a drafted lab, e.g. "/lab-review log-rotation-tool". No screenshots rendered, no topology, no VM work.
argument-hint: <lab-slug>
---

# Lab review

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Clean up one lab's documentation to the standard of the finished labs
without touching anything that needs a built VM. `$ARGUMENTS` is the lab slug
(`/lab-review log-rotation-tool`). The target shape of every file is the
Linux Intermediate course repo's finished labs (`labs/broken-path/`
multi-host, `labs/confined-service/` single VM); its Log Rotation Tool pass is
the worked example of this review.

Out of scope, on purpose (each has its own stop): rendering screenshots,
drawing the topology (`/lab-topology`), building or dry-running the VM,
pushing to the lab repo. Command output never goes in a `text` block, draft
or not: the guide carries screenshot references and `shots_spec.py` carries
their anticipated lines, which this review corrects against its walk. Don't
invent "realistic" output beyond what the walk requires you to correct.

## How this runs

Three agents, so the review isn't done by whoever drafted the lab:

1. **`lab-walker`** carries out steps 1-6 below in a fresh context and
   returns the step 6 report. Keep its agent ID.
2. When it returns, launch in parallel:
   - **`prose-checker`** on `description.md`, `environment.md`, every
     `module-*.md`, and `solutions.md` in the capstone.
   - **`lab-learner`** with the lab slug, plus the course slug and the lab's
     number in the outline (or `capstone`). Find them from the
     `**Lab repo:** <lab-slug>` line in `courses/*/outline.md`; if none
     matches, run it without them and say so. It reads only what a learner
     sees, never SETUP.md, so it catches gaps the walk can't see.
3. Triage. Send every prose-checker FIX, and every learner BLOCKING or
   CLARIFY finding with an unambiguous wording fix, back to the walker with
   `SendMessage`. A prose-checker finding that contradicts the Linux
   Intermediate labs' voice (see `.claude/style-guide.md` "Lab pages") is
   not a fix; drop it. Keep learner findings that need a design decision (a
   step to add, a concept the videos didn't teach) for the user.
4. Report the walker's step 6 report, its fix-round replies, and a
   **learner findings for you** list of what you kept back. Stop for review.

If the agents are unavailable, do steps 1-6 here yourself.

## Read first

- `labs/<slug>/`: `index.md`, `description.md`, `environment.md`,
  `module-*.md`, `solutions.md` (capstone), `_quickref_passwords.md`
  (multi-device), `SETUP.md`, `SUPPORT.md`, `LISTING.md`, `shots_spec.py`,
  `dryrun/states/`.
- `.claude/skills/lab/SKILL.md` and its `references/guide-format.md` (page
  shapes, labdocs build rules, house rules, lab-first pieces) and
  `references/internal-docs.md` (SETUP, SUPPORT, LISTING, shots_spec,
  dryrun). This review checks against them.
- `.claude/style-guide.md`, its "Lab pages" section first, and
  `.claude/skills/unslop/SKILL.md` for the prose pass.
- CLAUDE.md's platform profile. The command walk is checked against that
  platform.
- The lab's section of `courses/<course-slug>/outline.md` (found by its
  `**Lab repo:** <slug>` line): its guidance level, module list, steps,
  media IDs, and predict prompts.
- `courses/<course-slug>/research/NN-<lab-slug>.md` (or `capstone.md`), if
  it exists: researched output shapes, predict outcomes, and gotchas for the
  lab's image. Prefer it to memory for output shapes, and say in the report
  which shots it confirmed.

## 1. Environment page to its published shape

The learner page carries only the sections in the guide format:
`# Environment Overview` (what the environment is, what state it starts in),
the `![environment](./media/environment/lab-topology.svg)` line, `## The
Network as Designed` in a multi-host lab, `## Accessing Your Lab
Environment` (portal paragraph; how many reboots the lab does, or that it
never reboots), `## Device Access Information`. Target length is about 17
lines for a single-VM lab. Match the Confined Service wording for the
network sentence and the portal paragraph, and Broken Path's for a
multi-host page. No provisioning note.

Anything else in the file (pre-seeded file tables, exact file contents,
sample data, sizes) moves to SETUP.md's `## Pre-seeded files (exact
content)` section, as paste-ready `tee ... <<'EOF'` blocks plus the
`chmod`/`chown` lines, with a table of paths. Rewrite any SETUP.md item that
said "see environment.md" to point at that section. Generated data (sample
logs) gets a small shell generator that hits the sizes the guide quotes, not
a "for example" fragment.

Add a dated `Status <today>:` paragraph near the top of SETUP.md saying what
this pass did and that the VM is not built or dry-run yet.

## 2. Walk the commands with a running model

Read the modules in order (then `solutions.md` in the capstone) and keep a
written model of three things after every step:

- the learner's **shell or session**: cwd, mode, the tab it's in, and
  variables set at the interactive prompt (almost none);
- the **system state**: which files, directories, services, or config lines
  exist, who owns them, what a log contains;
- the **artifact under construction**: the script, unit file, profile, or
  running config, as exact current text.

Every command in the guide has to work against that model, and every
anticipated shot in `shots_spec.py` has to be what the model says the
command prints. Things this catches, all found in real drafts:

- A variable set inside the script used at the learner's prompt
  (`mkdir -p "$ARCHIVE_DIR"` where it's unset). Move the command into the
  script or name the path directly.
- `echo $?` after a second command (`./x.sh; cat log; echo $?` reports
  `cat`). Put it on the same line as the command it measures.
- Shown output whose order a real shell wouldn't produce. `ls` and globs
  sort by collation: `app.log` before `archive 2024 report.log` in both C
  and en_US. Fix the order in every shot and in every log excerpt derived
  from a loop over the glob.
- `tail -N` or `head -N` that doesn't match the line count the model says
  the file has.
- Claims about linters. If the guide says `shellcheck` is clean, lint the
  checkpoint script in your head against SC2086 (unquoted expansion), SC2155
  (`local x="$(cmd)"` on one line), SC2181 (`if [ $? ...]`), SC2046, and
  SC2164 (`cd` without `|| exit`). Fix the script, and turn the fix into a
  sentence of teaching where it helps.
- Parameter-expansion edge cases against the real sample data: `${var/ /_}`
  replaces one space, so a name with two spaces needs `//`.
- Timing races in interrupt demos (`timeout N` vs `sleep M` per iteration).
  Pick values so the interrupt lands mid-sleep with margin on both sides,
  and show the leftover file the model says is in flight at that moment.
- `env -i` demos: the first external command the script calls fails first
  (`date` inside a logging function, not `mktemp` further down), and bare
  `env -i` leaves `PATH` unset so bash supplies a default and nothing fails
  (use `env -i PATH=/usr/local/bin`). Compute the reported line numbers from
  the checkpoint script, and show the first few lines plus "the output goes
  on like that".
- Tools that print notices as well as results: GNU `tar` prints `Removing
  leading '/' from member names`; `cryptsetup luksFormat` wants an uppercase
  `YES`; `mdadm --create` asks to continue.
- Services started by systemd run as root unless the unit says otherwise. If
  the learner then goes back to the files as their own account, add
  `User=<account>` and a sentence on why.
- Output shape of well-known tools on the image SETUP.md names (Ubuntu 24.04,
  systemd 255): `systemctl status` for a finished oneshot run is `○ ...
  inactive (dead)` with `Process:` and `Main PID: ... status=0/SUCCESS`;
  `list-timers` ends with `N timers listed.`; `journalctl` lines carry the
  hostname. Make the anticipated shots plausible for that, then list them in
  the report for the dry run to confirm.
- Every whole-file block equals the sum of the changes the prose describes
  since the previous version of that file, including where each function
  sits, and equals its `dryrun/states/` file byte for byte. Update the state
  file with every block you change.
- Anything that shows a hostname (journal lines, prompts) needs the hostname
  decided in SETUP.md. Pick `<lab-word>-lab` if none exists and say so.
- **Predict reveals** match what the model says the command prints. A reveal
  that's wrong on the real image teaches the opposite of the lesson; treat
  it as the most serious bug in the lab.
- **Capstone seeding:** each seeded problem in SETUP.md produces exactly the
  symptom the scenario describes and nothing else is broken, and each
  Solutions page section fixes it from that seeded state.

### Platform equivalents

The checks above were collected on Linux labs. For another platform,
translate each class and add these:

- **PowerShell / Windows Server:** `$?` is a boolean and `$LASTEXITCODE` is
  the native exit code. A script the learner just created needs the
  execution policy the guide set (or `-ExecutionPolicy Bypass`).
  `Get-ChildItem` sorts by name with the culture's collation. Cmdlets that
  need a module report the import the first time. Commands that need
  elevation fail with a distinct access-denied message in a non-elevated
  session. `Restart-Service` is silent on success. Reboots drop the portal
  session (Reconnect).
- **Cisco IOS / IOS-XE:** `show` commands run in privileged EXEC; config
  commands need `configure terminal` and the right sub-mode, and every shown
  prompt matches the mode (`Router#`, `Router(config)#`,
  `Router(config-if)#`). Interfaces start `shutdown`. `write memory` or
  `copy run start` before any reload. `show ip interface brief` and `show ip
  route` output depends on the IOS version in SETUP.md.
- **Web consoles and GUIs:** every click path is a numbered step with a
  screenshot reference per dialog (a desktop screenshot with its capture
  note), wording matches the console's current
  labels, and the learner's tenant or subscription scope is stated up front.

## 3. House rules

Check each of these and fix silently:

- **Elevation:** immediately before the lab's first `sudo` command (not
  earlier) sits a block holding only `sudo -v`, followed by the one-time
  `!!! note` (password verbatim, nothing echoes, cached four hours, survives
  tab reconnects, own line) and the `sudo -v` shot; every post-reboot step
  starts with the bare `sudo -v` block again. No "first sudo asks for your
  password" sentences anywhere, and no `[sudo] password` line in any shot
  except the `sudo -v` shots. Copy the Confined Service Module 1 wording.
  Other platforms: the platform profile's elevation note, once.
- **No editor steps:** every file change is a whole-file `cat > … << 'EOF'`
  or `sudo tee … << 'EOF'` block (crontab via `crontab - << 'EOF'`), and each
  matches a `dryrun/states/` checkpoint. No snippet fences: every fenced
  block runs as pasted, and the explanation of a change sits under the
  whole-file block, not in a separate snippet.
- **Interactive prompts** are a "how to read the prompt" list plus a
  per-prompt table of keys and the harmless fallback, not prose.
- **Output:** no fenced `text` block holding output, and no output shown
  both as a block and a shot. Every terminal screenshot reference has an
  entry in `shots_spec.py`, and every entry is referenced. A desktop or GUI
  screenshot instead has a `<!-- desktop screenshot: ... -->` capture note
  on the next line and no `shots_spec.py` entry; its missing image file is
  expected, not a defect. Alt text is short (the command or the result),
  and the sentence after the image says what to notice.
- **Trimmed output** per the platform profile: no IPv6 or layer-2 detail in
  shown output on Linux and Windows networking labs.
- **Portal language:** one browser terminal tab per VM ("In the **web01
  tab**"), the reboot paragraph and Reconnect note after each reboot, never
  SSH, RDP, or tmux between lab hosts.
- **Page shape:** Module 1 opens with its "Opening a Terminal and ..."
  group; step-group headings are gerund phrases in WWT Title Case, module
  H1s imperative; a one-step group is still numbered; 1-3 `!!! note`s per
  module with 4-space-indented bodies; every module ends with `## What You
  Have Learned` plus a bridge sentence; the last module ends with the
  Workflow Summary and the Congratulations paragraph. No check sections, no
  conclusion page, no reference page.
- **Build safety:** every paragraph, list item, and note body is one source
  line (`nl2br`); every `<details>` carries `markdown="1"`; every `<video>`
  is one line, indented in its step; `-->`, `(c)`, `(r)` appear only in code;
  a page with `{#`, `{{`, or `{%` has the `{% raw %}` wrapper.
- No markdown filenames in learner text ("the Environment page", "Module
  2"). Callbacks name the lab or concept, and videos by topic ("the
  addressing video"), never by number.
- `description.md` doesn't open with the ATC boilerplate.

Then the lab-first pieces, against the guide format's "Lab-first pieces":

- Every step reads at the lab's guidance level. Exact commands for a task
  the path already taught, in a goal-plus-hint lab, is a fix; a missing
  command in a fully guided one is too.
- Each GIF sits at the top of the step it helps with, as the guide format's
  `<video autoplay loop muted playsinline controls preload="auto" poster=...
  aria-label=... src=...>` embed pointing at `<media-id>.mp4` and its
  `<media-id>.png` poster, never a `.gif` image. Its `aria-label` names
  every key pressed and the visible result, and every string the loop types
  is in the `aria-label` or the step text.
- Each video sits at the end of the predict or try step it explains, with
  its length, its "optional" label when the outline has one, and its
  captions track.
- Each predict prompt asks the learner to decide before the command, its
  options are bullets with the letter in the text (`- a. It gets deleted`),
  and its reveal is collapsed and holds the step's screenshot.
- Hints follow the guidance-level table: Hint then Answer, and in the
  capstone one `Stuck? Hint` per problem with no Answer on the module page.
  A Hint that doesn't name the tool or where to look is too vague.
- Each goal step has one defensible end state the learner can see in the
  terminal.
- Each reference card sits inline at the step that first needs it, image in
  that module's media folder, with a text version that matches the card
  spec's `## Card layout` row for row. Later mentions name the card and the
  module.
- Media references use the outline's media IDs at the guide format's paths,
  and every item the outline places in this lab appears.
- Module pages match the outline's module list, one page per entry.

## 4. Unslop

Run the unslop pass over `description.md`, `environment.md`, every module,
and `solutions.md`, respecting its "Course content" exceptions (lab headings,
the Congratulations paragraph, commands and output are out of scope). The
tells that show up most in lab drafts: em dashes, colon-as-connector ("This
is the problem: ..."), "not X, but Y", "exactly / actually / genuinely /
simply", noun-plus-verb contractions ("the file's ready") piling up in
teaching prose, and closing flourishes ("the exact skills you will lean on
..."). Keep a concrete failure story or a deliberate repeat when it's the
lesson, and keep the labs' voice: "You'll", "once", "since", "just" meaning
"only", "below", and "click **Launch**" are fine on lab pages.

## 5. Sync the internal files

Anything the walk changed that a builder or the support desk needs:

- **SETUP.md:** hostname, packages, new files, the pre-seeded section, the
  capstone's seeded problems, the edge table if a command's network needs
  changed.
- **SUPPORT.md:** new gotchas as troubleshooting paragraphs (symptom first,
  plain text, no markdown, no password, in module order), the reset
  sequence, and the status line still saying the lab isn't built or dry-run.
- **LISTING.md:** still agrees with `description.md`, the host table, and
  the package list; HARDWARE AND SOFTWARE is one line. Leave TOPOLOGY ALT
  TEXT alone unless the diagram changed.
- **`_quickref_passwords.md`** (multi-device labs): one row per device in the
  Device Access Information table, same names and credentials, and every
  management IP SETUP.md fixes filled in. Create it if a multi-device lab
  lacks it; a single-device lab doesn't have one.
- **`shots_spec.py`:** the anticipated lines match the walk, the prompts
  carry the SETUP.md hostname, and the STATUS line still says anticipated.
- **`dryrun/states/`:** one file per whole-file block, equal byte for byte.

## 6. Final sweep, then report

```bash
cd labs/<slug>
P=(description.md environment.md module-*.md); [ -f solutions.md ] && P+=(solutions.md)
prose() { awk 'FNR==1{f=0} /^[[:space:]]*```/{f=!f; next} !f{print FILENAME":"FNR": "$0}' "${P[@]}"; }   # prose only, fenced blocks dropped
perl -CSD -ne 'print "$ARGV:$.: $_" if /[\x{2013}\x{2014}\x{2026}\x{2018}\x{2019}\x{201C}\x{201D}]/; close ARGV if eof' "${P[@]}"   # em and en dashes, ellipsis, curly quotes
grep -n 'environment\.md\|module-[0-9]*\.md\|solutions\.md\|_quickref' "${P[@]}"   # markdown filenames in learner text
prose | grep -i 'exactly\|actually\|genuinely\|simply\|precisely\|in order to\|leverage\|crucial\|ensure'   # unslop tells
prose | grep -iwE 'easy|easily|obviously|of course|quickly|straightforward|please'   # minimizers
prose | grep -iwE 'master|slave|whitelist|blacklist|sanity|dummy|hangs?|hung|cripple[sd]?|guys|blind to'   # inclusive terms
prose | grep -E '[0-9]s([^[:alnum:]_]|$)'                            # unspaced durations such as "(8s)"
grep -n '{#\|{{\|{%' "${P[@]}"                                       # Jinja tokens (mkdocs macros plugin)
grep -n -B1 -A3 '```text' module-*.md                                # output in a fenced block?
grep -n 'nano \|vim\? \|systemctl edit\|crontab -e' module-*.md   # editor steps
awk 'FNR==1{f=0;p=""} /^[[:space:]]*```/{f=!f;p="";next} f{next} {t=$0; sub(/^[[:space:]]+/,"",t)} t!="" && p!="" && t !~ /^([-*] |[0-9]+\. |\||#|!|<|>|\{%)/ && p !~ /^(\||!!!)/ {print FILENAME":"FNR": "$0} {p=t}' "${P[@]}"   # wrapped paragraph (nl2br breaks it)
grep -n '<details' "${P[@]}" | grep -v 'markdown="1"'                # details without markdown="1"
grep -n '<video\|</video>' "${P[@]}" | grep -vE ':[[:space:]]*<video .*</video>[[:space:]]*$'   # video split over lines
grep -n '<video autoplay' "${P[@]}" | grep -vE 'autoplay loop muted playsinline controls preload="auto" poster="[^"]+" aria-label="[^"]+" src="[^"]+\.mp4"'   # GIF embed shape
grep -n '\.gif' "${P[@]}"                                            # GIFs ship as .mp4 plus a .png poster
grep -nE '^[[:space:]]*[a-d]\. ' "${P[@]}"                           # predict options not in list syntax
grep -niE '!\[(image|screenshot|picture) of|aria-label="(gif|video|animation) of' "${P[@]}"   # weak alt text
prose | grep -E -- '-->|\((c|r|tm)\)'                                # smartsymbols would convert these
grep -n '\[sudo\] password' shots_spec.py                            # only in sudo -v shots
[ -f _quickref_passwords.md ] && grep -n 'TBD' _quickref_passwords.md   # management IPs still to fill
python3 dryrun/check-states.py                                       # whole-file blocks equal their states
```

Read every hit and judge it: a literal "exactly one word per element" is
fine, and so is a duration inside a code span (`sleep 5s`), an old term
inside inline code that the platform prints, or `hung` quoted from a tool.
The Jinja grep may only hit a page's `{% raw %}` first line and `{% endraw
%}` last line; any other hit means that page needs the wrapper or the
labdocs build fails with "Missing end of comment tag". The `text` grep lists
every `text` fence: each must be something the learner types, never what a
command printed; replace output with the screenshot reference and a
`shots_spec.py` entry. `[sudo] password` may appear only in `sudo-v`
entries (or a constant only they use). The editor grep may hit prose that
names the interactive tool the block replaces ("`crontab -e` would open the
same file in an editor"); only an instruction to edit is a defect. `TBD` is expected until the vApp is built; list it under Open items.

Then report, grouped by file: what moved, each command fix with the one-line
reason, each rule fix, the hostname you chose, and a separate **anticipated,
confirm at dry run** list of every shot you adjusted on knowledge rather
than capture (and which the research brief confirmed), and a **Shots to
capture** list of every desktop or GUI screenshot with its filename and
capture note, for the user to take after the lab is built. End with **Open
items**: any `TBD` management IPs, and, until a lab has been published and
checked on the ATC site, confirming that `<details markdown="1">`, a
`<video>` indented inside a numbered step, and one-line paragraphs under
`nl2br` render as the guide format expects. Stop for review.

## Editing mechanics

Read a page in full before editing it. Make changes with exact-match
replacements that fail loudly when the anchor is missing (the Edit tool, or a
small Python `rep(path, old, new)` that asserts exactly one match), never
with regexes over whole files. Anchors are copied verbatim, indentation
included. A regex that silently matches the wrong place, or nothing, corrupts
a guide in ways the final sweep won't catch.
