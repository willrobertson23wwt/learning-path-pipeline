# Lab guide format and house rules

The shape of every learner-facing page in a WWT lab repo, the rules `/lab`
writes to, and the rules `/lab-review` checks. The learner sees the rendered
mkdocs site with only this guide open, so everything they need has to be on
these pages.

The model is the Linux Intermediate course repo's five finished labs
(`labs/broken-path/`, `labs/confined-service/`, `labs/log-rotation-tool/`,
`labs/performance-investigation/`, `labs/service-packaging/`). Where this file
and those labs disagree, the labs win; fix this file. Broken Path is the
multi-host example, Confined Service the single-VM example, and Log Rotation
Tool the whole-file heredoc example. Broken Path predates the `sudo -v` rule,
so copy the elevation wording from Confined Service Module 1.

Prose on lab pages follows `.claude/style-guide.md` with its "Lab pages"
scoping note: the labs' voice wins where the style guide conflicts (gerund
step-group headings, plain step lead-ins, short screenshot alt text, video
callbacks by topic). Inclusive language, numbers and units, no em or en
dashes, and no emojis still apply.

## The ATC labdocs build

Each lab repo publishes through the ATC labdocs mkdocs build: the
`readthedocs` theme, the `admonition`, `extra`, `nl2br`, `sane_lists`,
`pymdownx.superfences`, `pymdownx.smartsymbols`, and `mdx_include`
extensions, and the `macros` plugin. These come from the build config of
another ATC lab repo; confirm each on the first real lab that uses it.

- **One source line per paragraph.** `nl2br` turns every newline into a
  visible line break, so a paragraph, a list item's text, and a note body
  are each one source line, however long. Never hard-wrap prose.
- **No Material for MkDocs features.** The theme is `readthedocs`, so no
  content tabs, no attribute lists on code blocks, no annotations, no
  `???` collapsible admonitions. Use `!!! note` and raw `<details>`.
- **`<details>` needs `markdown="1"`** (`extra` includes `md_in_html`) or the
  markdown inside it renders as literal text: `<details markdown="1"><summary>Reveal</summary>`,
  a blank line, the content, a blank line, `</details>`.
- **Each `<video>` element is one source line**, indented with the step
  it belongs to (4 spaces inside a numbered step), so it neither splits
  the numbered list nor picks up `nl2br` breaks.
- **`smartsymbols`** turns `-->` into an arrow and `(c)`, `(r)`, `(tm)`
  into symbols in prose. Keep those strings inside code spans or blocks.
- **Jinja-safe text.** The `macros` plugin parses `{{`, `{%` and `{#`
  anywhere in a page. `${#files[@]}` reads as an unterminated comment and
  the whole page fails with "Missing end of comment tag" (Log Rotation
  Tool). Any page containing `{#`, `{{` or `{%` in shell text gets
  `{% raw %}` as its first line and `{% endraw %}` as its last (no lab page
  uses real macros). Check with `grep -n '{#\|{{\|{%' *.md` before
  publishing.
- **Nav order** (the lab repo's `labdocs/config/nav.yaml`): the index page,
  the Environment page, Module 1 to Module N, then Solutions in the
  capstone. Drop the scaffold's `Guide:` entry. `_quickref_passwords.md` is
  not a nav page.

## index.md

```markdown
![WWT Logo](./media/index/wwt-logo-color-stacked-high.png)

# <Path>: <Lab Title>

## Version History

| Date       | Version | Author         | Description     |
|------------|---------|----------------|------------------|
| <YYYY-MM-DD> | 1.0     | <author>       | Initial release  |
```

The logo line is exact, and `/lab` copies the logo file into `media/index/`
while scaffolding (every WWT lab repo uses that filename). The date is today,
ISO 8601. Nothing else goes on the page.

## environment.md

Every Environment page has the same sections in the same order: `# Environment
Overview`, the diagram line, `## The Network as Designed` (multi-host labs
only), `## Accessing Your Lab Environment`, `## Device Access Information`.
The diagram line is exactly
`![environment](./media/environment/lab-topology.svg)`; `/lab-topology`
draws the SVG later and writes its long alt text into LISTING.md. State the
starting condition precisely (files, services, disks), since it is the spec
the builder checks SETUP.md against, but exact file contents, sizes, and
sample data live in SETUP.md's "Pre-seeded files" section, never here.

### Single device (about 17 lines)

```markdown
# Environment Overview

This lab runs on a single Ubuntu 24.04 LTS virtual machine, accessed as a browser-based terminal through the WWT ATC Lab Portal. You work entirely from a terminal on this VM. No other hosts take part in the exercises. <One sentence on the network: "The VM's network connection is only the path the portal uses to reach it; no exercise in this lab touches the network." Then any hardware the lab uses: extra disks, core count, RAM, swap.>

<The starting state: what is pre-seeded, installed, running, or deliberately missing, and why the lab needs it. "Nothing has been built on the three spare disks yet." "No crontab entries or systemd timers exist yet.">

![environment](./media/environment/lab-topology.svg)

## Accessing Your Lab Environment

Access your lab environment through the WWT ATC Lab Portal. Once your lab is provisioned, click **Launch**. The portal opens a browser terminal tab for the VM, and you land at a shell prompt, ready to begin. Log in as `labuser` with the password below if the tab ever shows a login prompt. <Reboots: "This lab never reboots the VM." or "This lab reboots the VM three times, and each reboot step in the guide says what to expect.">

## Device Access Information

| Device            | Access Method        | Username  | Password    |
|-------------------|----------------------|-----------|-------------|
| Ubuntu 24.04 VM   | Browser (ATC Portal) | labuser   | Labpass01!  |
```

The first paragraph can be split in two when it runs long (Log Rotation Tool
puts the network and hardware sentences with the first, the starting state in
the second). The device row, OS, account, and password come from the platform
profile in CLAUDE.md.

### Multiple devices (Broken Path)

- `# Environment Overview`: one paragraph naming each host, what the
  learner does on it, and which ones they never log into ("`gateway` is an
  infrastructure router you never log into"); one paragraph on the
  management network (`eth1`, `10.0.0.0/24`), that it plays no part in any
  exercise, and that the guide points it out the first time it shows up in
  output; one paragraph on the starting state, including a deliberately
  broken start and why the portal sessions survive it.
- The diagram line.
- `## The Network as Designed`: one sentence ("This is the address plan
  `client01` and `web01` are supposed to follow."), then a table with the
  columns Host, Lab address (`eth0`), Management (`eth1`), and Role, one row
  per host including the gateway, then one sentence saying which network the
  exercises touch. When the lab starts broken, this table is the designed
  plan, never the seeded faults.
- `## Accessing Your Lab Environment`: the portal paragraph with "The portal
  opens a browser terminal tab for each machine, one for `client01` and one
  for `web01`", which modules use which tab, and the login sentence.
- `## Device Access Information`: one row per VM, `Browser (ATC Portal)` for
  each one the learner touches, and `none, infrastructure only | n/a | n/a`
  for the rest.

## _quickref_passwords.md

Every lab with more than one device gets this page (from the SD-WAN labdocs
model); single-device labs don't. It has no heading and exactly this shape:

```markdown
Login details for each device used in the lab are provided below:

| Device | Management IP | Method(s) | Username | Password |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| client01 | 10.0.0.10 | SSH | labuser | Labpass01! |
| web01 | 10.0.0.11 | SSH | labuser | Labpass01! |
| gateway | 10.0.0.1 | n/a | n/a | n/a |
```

One row per device in the Device Access Information table, same names and
credentials. Method(s) is how the device is reached: `SSH` for a browser
terminal tab, `RDP` for a desktop, `HTTPS` for a web console, `n/a` for a
device nobody logs into. The management IPs are the lab as built (SETUP.md
and the vApp), and they vary lab by lab: `/lab` fills the ones SETUP.md
already fixes and writes `TBD` in the rest; `/lab-review` and `/lab-setup`
keep the page in sync with the built lab.

## Module pages

- `# <Task-shaped title>` in the imperative ("Fix the Address", "Confine
  It with AppArmor"), then an intro paragraph: why this task matters and
  what the learner accomplishes. Teach as well as instruct: every command
  gets a sentence of purpose before or after it.
- `## <Step group>` sections named with gerund phrases in WWT Title Case
  ("Fixing the Prefix", "Proving the Gap Exists", "Doing the Subnet
  Math"), each holding numbered steps. A group with one step is still
  numbered `1.`. A group can open with one sentence of framing, or with a
  small reference table (Confined Service's LVM layer table).
- **Each step:** a plain lead-in sentence that names the one action ("Confirm
  the change.", "Try to reach `web01` anyway, by its known address."), the
  fenced command block tagged with the platform's shell (commands only, no
  prompt), the output as a screenshot reference, then what to look for in it.
  Several commands share a block when they run in the same place and
  nothing needs checking between them. Everything in a step is indented
  4 spaces under its number.
- **Where output varies,** say so in the sentence after the screenshot
  ("Your exact counts will differ.", "your output may have a few extra
  rows"). No stock "The output is similar to the following" line.
- `!!! note` admonitions, body indented 4 spaces and on one source line,
  1-3 per module, for conceptual asides, gotchas, and "what this really
  means" moments. A note can sit inside a step (the `sudo -v` note, the
  reboot note) or between groups.
- Small tables for reference material (flag meanings, layer models, subnet
  blocks), each with a header row.
- Module 1 opens with orientation: a step group named "Opening a Terminal
  and Surveying the Starting State" (or "... Surveying the Damage",
  "... Confirming the Starting State"), whose first step says the portal
  session opens at a shell prompt and surveys what the Environment page
  promised. Later modules build toward the finished artifact, following the
  arc of the videos the lab covers.
- Every module but the last ends with `## What You Have Learned`: bullets of
  concrete skills and findings, then one paragraph bridging to the next
  module.
- The final module ends with `## <Lab Title> Workflow Summary` (or `## <Lab
  Title> Summary`): a lead sentence, the numbered end-to-end procedure the
  lab walked through, then the closing paragraph: "Congratulations. You have
  completed the **<Path>: <Lab Title>** lab." followed by the skills gained
  and where they apply. No separate conclusion page.

## Commands and files

- **Copy-accurate commands** that run in order on the stated environment,
  with real values (`labuser`, the SETUP.md hostname, the pre-seeded paths).
  Placeholder IPs and hostnames are reserved or fictional.
- **Every fenced block runs as pasted.** The only fenced blocks in a module
  are commands to type and whole-file writes. No snippet fences: a fenced
  block of the changed function or the new line reads as something to paste.
  The explanation of a change goes in prose under the whole-file block.
- **No editor steps.** Never tell the learner to open a file in an editor
  and change lines; an editor round trip in a browser terminal is where
  learners lose the thread. Every file change is one pasteable command that
  writes the complete file: `cat > file << 'EOF' … EOF` (plus `chmod +x` on
  first creation) for the learner's own files, `sudo tee file > /dev/null
  << 'EOF' … EOF` for root-owned ones, `crontab - << 'EOF' … EOF` instead of
  `crontab -e`. A one-line change to a packaged config file can be a single
  `sudo sed -i` command, as Performance Investigation does for
  `journald.conf`; anything more is a whole-file write. One step per file version: a lead-in naming what changes,
  the whole-file block, then the explanation of the new lines. Explain the
  quoted `'EOF'` marker once, at its first use. Each whole-file block is a
  `dryrun/states/` checkpoint (see `internal-docs.md`), so the dry run and
  the guide can't drift. On other platforms the same rule holds with the
  platform's whole-file write (`Set-Content` with a here-string in
  PowerShell; a full config paste in a device CLI).
- **Interactive tools get a table, not prose.** Where a step drives an
  interactive prompt (`aa-logprof`, `mdadm --create`'s continue question,
  an installer menu), give a short "how to read the prompt" list, then a
  table with one row per prompt in the order it appears, the exact keys to
  press, and what each does. Name the fallback for a prompt the table
  doesn't list: the tool's harmless choice (for `aa-logprof`, `I` to
  ignore, never `D`). Confined Service Module 4 is the model.
- **Keys and typed answers** go in code spans (`y`, `2` then `A`,
  `Ctrl+C`); Enter reads as plain "press Enter". Portal buttons are bold
  and clicked: "click **Launch**".

### Elevation: `sudo -v` first

The platform profile names the elevation model; Linux uses `sudo` and this
rule. The lab image carries `/etc/sudoers.d/lab-sudo` (`!use_pty`,
`timestamp_timeout=240`, `timestamp_type=global`; `/lab-setup` installs
it), because Ubuntu 24.04's sudo otherwise swallows the rest of a pasted
block and forgets the password after 15 minutes.

- Immediately before the lab's first `sudo` command, wherever that falls
  (not at the top of Module 1 if sudo comes later), the step gets a code
  block holding only `sudo -v`, then once the `!!! note`, then the `sudo -v`
  screenshot. Copy Confined Service Module 1:

    ````markdown
    Before the first `sudo` command of the lab, cache your password on its own line.

    ```bash
    sudo -v
    ```

    !!! note
        `sudo -v` does nothing except ask for your password and cache it. Type `Labpass01!` and press Enter; nothing echoes while you type, not even dots. The lab image keeps that password cached for four hours, and it survives closing and reopening the terminal tab. Only a reboot clears it, which is why every post-reboot section starts with this same command. Running it on its own line matters: when a block of several commands is pasted and the first one asks for a password, the lines that follow get swallowed as password attempts.

    ![sudo -v caching the password](./media/module-1/sudo-v.png)
    ````

  Drop the "Only a reboot clears it" sentence in a lab that never reboots.
- After every reboot, the first step back ("Once you're back in, cache your
  password again (the reboot cleared it), then ...") repeats the bare
  `sudo -v` block with no note.
- Never write "this is the first sudo, so it asks for your password"
  anywhere, and no screenshot other than the `sudo -v` shot shows a
  `[sudo] password for labuser: ` line.
- A module that starts more than a sitting later can say "If `sudo` asks for
  your password here, more than four hours have passed since you last cached
  it; type it once and carry on."
- Windows and device CLIs: the first elevated step gets the platform's
  equivalent note (opening an elevated PowerShell and the UAC prompt;
  `enable` and its password), once.

## Command output

Every command's output is a rendered terminal screenshot, never a fenced
`text` block, and never both. The ATC site puts a copy button on every code
block, so output in a block reads like another command to run. This is
absolute: a fenced `text` block in a module is only ever something the
learner types, and with whole-file writes there are almost none.

- Reference each shot as `![<short alt>](./media/module-N/<name>.png)`
  directly under the command block. The alt text is short and names the
  command or the result: "ip -br addr", "ping: Network is unreachable",
  "array reassembled after the reboot". It never starts with "Image of" or
  "Screenshot of" and never quotes output lines; the sentence after the
  image says what to notice.
- Shots are rendered by `scripts/lab-terminal-shot.py` from the lab's
  `shots_spec.py` (green-on-black portal look: the platform prompt plus the
  command as typed, the real output, a trailing prompt with cursor). Until
  the dry run, `shots_spec.py` holds the anticipated lines; the dry-run
  capture replaces them (see `internal-docs.md`).
- A step that shows no screenshot still says what the learner should see
  ("You should see the same five-line shape three times").

**Desktop and GUI screenshots.** A lab on a Linux or Windows desktop, or in
a web console, shows windows and dialogs, not terminal output, and the user
captures those by hand after the lab is built. Write the guide as if the
image were there:

- Reference the image at its step the same way,
  `![<short alt>](./media/module-N/<name>.png)`, with a descriptive
  filename (`server-manager-add-roles.png`) and short alt text naming the
  window or result ("Add Roles and Features wizard").
- On the next line, an HTML comment saying what the capture should show, so
  whoever takes it knows the window, the state, and what to highlight:
  `<!-- desktop screenshot: Server Manager, Manage menu open, Add Roles and Features highlighted -->`.
  The comment doesn't render, so the published page is unaffected, and it
  can stay after the image is added.
- No `shots_spec.py` entry; that file is only for rendered terminal shots.
- The step text carries everything the learner needs without the image:
  the exact labels to select (bold, as the UI shows them) and what the
  window shows afterward, so the lab reads correctly before the captures
  exist.

A lab can mix both kinds: terminal shots rendered from `shots_spec.py` and
desktop shots captured by hand.
- **Trim shown output** per the platform profile's output-trimming rule.
  Keep commands as taught and trim only the output. On Linux and Windows
  networking labs, no IPv6 or layer-2 detail anywhere a learner sees it:
  keep `ip -br addr` and `ss -tlnp` but drop `fe80::` link-locals, `::1`,
  `[::]` listener rows, `(v6)` ufw rows, MAC addresses, and any prose
  explaining them. Interface and MAC tables belong only in SETUP.md.

## The portal and more than one device

- The ATC portal opens one browser terminal tab per lab VM. Write
  multi-host steps as tab switches: "In the **web01 tab**, check its
  firewall.", "Switch to the **client01 tab** and ...", "Back in the
  **web01 tab**, ...". Name the tab in each step and remind the learner to
  read the prompt. Never have learners SSH or RDP between lab hosts or use
  tmux for a second shell.
- A reboot step: the `sudo reboot` block, then "The reboot drops your
  terminal session. Reconnect from the ATC portal once the VM is back, then
  continue.", then this note:

    ```markdown
    !!! note
        The VM can take up to five minutes to come back after a reboot. The portal's Reconnect button fails while the machine is still booting, so click it again every minute or so until the login prompt returns. A failed reconnect does not mean the lab is broken.
    ```

## Lab-first pieces

A lab-first lab carries its own teaching, with media placed at the steps
that need it. Placement and the reasons for it are in `.claude/house-style.md`
"Lab-first design"; this is how each piece sits inside the structure above.
Each item starts with a bold label (`**GIF (8 s): Tab Completion.**`), the
item's Title Case title from the outline, never an emoji. Media files use the
item's media ID and live in that module's media folder.

**GIF**, at the top of the step it helps with: after the step's lead-in
sentence, before its command block, indented with the step. It ships as a
muted looping MP4 that autoplays with controls, so a learner can pause it
(WCAG 2.2.2), plus a PNG poster of the finished state:

````markdown
3. Complete the path with Tab instead of typing it out.

    **GIF (8 s): Tab Completion.**

    <video autoplay loop muted playsinline controls preload="auto" poster="./media/module-1/lf-l1-g1.png" aria-label="Typing cd /us and pressing Tab completes the line to cd /usr/" src="./media/module-1/lf-l1-g1.mp4"></video>

    ```bash
    cd /usr/
    ```
````

The `aria-label` names every key pressed and the visible result, under
about 155 characters, never starting with "GIF of". Every string the loop
types appears in the `aria-label` or in the step's own text, so the step
works without the loop. The length lives in the bold label.

**Video**, at the end of the predict or try step it explains, after the
result, with its length and "optional" when the outline marks it. One source
line, captions track inside:

```markdown
    **Video (75 s, optional): Virtual Filesystems.**

    <video controls preload="metadata" width="100%" src="./media/module-2/lf-l2-v1.mp4"><track kind="captions" src="./media/module-2/lf-l2-v1.vtt" srclang="en" label="English" default></video>
```

No transcript under it: the narration names every fact the visuals depend on
(`/scripts`), and the captions carry it. The step before the video already
showed the result, so the page never depends on the video. Refer to videos
by topic, the way the labs do: "the addressing video showed you", "the same
order the LVM video drew the stack". Never by number.

**Predict**, inside the step that runs the command it tests, before the
command block. The question, the options as a bulleted list with the letters
in the text (each renders on its own line), "Decide on your answer, then run
the next command.", the command, then a collapsed reveal. The step's output
screenshot goes inside the reveal, so reading ahead doesn't give the answer
away:

````markdown
2. Remove the original file, then read both names.

    **Predict:** Which `cat` command still prints `hello`?

    - a. Both
    - b. Only `cat hard.txt`
    - c. Only `cat soft.txt`
    - d. Neither

    Decide on your answer, then run the commands.

    ```bash
    rm original.txt
    cat hard.txt
    cat soft.txt
    ```

    <details markdown="1"><summary>Reveal</summary>

    ![cat on both names after the rm](./media/module-2/cat-after-rm.png)

    Only `cat hard.txt` works. The hard link is a second name for the same inode, so removing one name leaves the data in place. The symlink stores a path, and that path is gone.

    </details>
````

**Hints** follow the guidance level (table below). **Hint** names the tool
or where to look, specific enough to act on; a vague first hint teaches
learners to skip hints. **Answer** holds what the fully guided version of the
step would: the command block, the screenshot, and what to notice. Each is its
own `<details markdown="1">` block, Hint first. At the goal-plus-hint level
the Hint is an italic line in the open (``*Hint: `chmod` accepts an octal
mode.*``) and only the Answer is collapsed.

**Reference cards** go inline, in the step where the card is first needed:
the bold label, the image, and the card's content as text (a Markdown table
or list taken from the card spec's `## Card layout`, same rows and values in
the same order), so the card is never only an image of text. The image file
goes in that module's media folder. Later steps name the card and where it
is ("the Permission Bits card in Module 2"). No separate reference page.

```markdown
    **Reference card: Permission Bits.**

    ![Permission Bits card](./media/module-2/lf-card-permission-bits.png)

    | Bit | Value | On a file | On a directory |
    |---|---|---|---|
    | `r` | 4 | Read the contents | List the names in it |
    | `w` | 2 | Change the contents | Create, delete, and rename entries |
    | `x` | 1 | Run it as a program | Enter it and reach entries by name |
```

**No checks.** The ATC portal can't run automated checks yet, so a lab has
no check section and no question-style check. Each module ends on
`## What You Have Learned`, the final one on its summary and Congratulations
paragraph.

**Guidance levels.** The outline sets one per lab. Write every step to it. The
five Linux Intermediate labs are all at the first level; later levels change
only the step wording and where the command and screenshot sit.

| Level | How a step reads | Hint levels |
|---|---|---|
| Full commands and expected output | Lead-in, command, screenshot, what to notice | None |
| Full commands with predict prompts | The same, with predict steps before the key commands | None |
| New commands given, goals for known ones | Commands the path hasn't taught yet appear exactly; for ones it has, the step states the goal ("list the directory with inode numbers") | Answer, collapsed, on goal steps |
| Goal plus hint | The goal, then the Hint as an italic line | Hint in the open, Answer collapsed |
| Goal plus collapsed hint | The goal, then the collapsed blocks | Hint and Answer, both collapsed |
| Goals only (the capstone) | The goal and nothing else | `Solution`, collapsed, with the full worked solution; all solutions again on the Solutions page |

A goal step has one defensible end state. It names the object (the exact
path or host), an end state the learner can see in the terminal, and any
constraint: "Make `~/permlab/run.sh` executable by you and your group but not
by others, and keep its read and write bits as they are. `ls -l` then reads
`-rwxr-xr--`." In the first two levels, show one way to do each task.

## solutions.md (capstone only)

The capstone's goals-only modules put each problem's full worked solution
in a collapsed `<details markdown="1"><summary>Solution</summary>` block
under it. One page after the last module repeats every solution in one
place:

- `# Solutions`, then one paragraph: try each problem first, and the
  solutions follow the order of the modules.
- One `## <Problem title>` section per problem, in module order, each in the
  fully guided step format, the same content as the module's collapsed
  Solution: lead-in, command, screenshot (the module's image from
  `media/module-N/`), what to notice,
  whole-file writes as `dryrun/states/` checkpoints, and the one sentence on
  why the fault produced the symptom the scenario describes.
- No other lab gets a solutions page, and the final capstone module still
  ends with its Workflow Summary and Congratulations paragraph.

## Style

- Second person, present tense, plain confident prose, matching the Linux
  Intermediate labs. Concrete failure stories and short verdict sentences
  ("Not a timeout.", "It worked.") are the voice; keep them.
- The learner completes the lab with only this guide open.
- Never mention markdown filenames in learner text. Learners see page
  names: "the Environment page", "Module 2", "the Solutions page".
- Callbacks to other labs name the lab or the concept ("the way you
  scheduled it in the Log Rotation Tool lab", "the inodes model from the
  links lab"), never a lab number. Within a lab, "Module 2" is the nav
  name and fine.
- Courses are standalone: this path's videos and labs only, never other
  courses.
- Old terms in platform literals stay exactly as printed (`master` in
  `ip link set dev eth1 master br0`); the sentence around them uses the
  neutral word.
- `description.md` is 2-4 sentences that lead with what the learner does
  and why it matters. It never opens with the "Ubuntu desktop hosted in the
  WWT ATC" boilerplate.
