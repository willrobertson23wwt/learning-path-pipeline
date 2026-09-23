# Lab guide format and house rules

The shape of every learner-facing page in a WWT lab, and the rules `/lab`
writes to and `/lab-review` checks. The learner sees the rendered mkdocs site
with only this guide open, so everything they need has to be on these pages.

The prose on these pages follows `.claude/style-guide.md` (voice V, global
English G, mechanics M, formatting F, procedures P). This file adds where
things go on a page and the markup for them; rule IDs in parentheses point
into the style guide.

## index.md

```markdown
![WWT Logo](./media/index/wwt-logo-color-stacked-high.png)

# <Path>: <Lab Title>

| Date | Version | Author | Notes |
|---|---|---|---|
| <YYYY-MM-DD> | 1.0 | <author> | Initial release |
```

The date is ISO 8601 (M7).

## environment.md

About 17 lines for a single-device lab. Three sections:

1. `# Environment Overview`: two short paragraphs. The first says what the
   environment is (the platform profile's default, such as one Ubuntu VM
   reached through the WWT ATC Lab Portal) and includes the
   management-network sentence. The second summarizes the starting state
   (what's pre-seeded and why). Then the diagram line, whose alt text names
   each device with its hostname and the network it sits on (F9):
   `![Lab topology: one Ubuntu 24.04 VM, ubuntu-lab, on the management network](./media/environment/lab-topology.svg)`.
   The Device Access Information table is the diagram's long description,
   so the alt stays short. `/lab-topology` draws the SVG later.
2. `## Accessing Your Lab Environment`: the portal paragraph, how many times
   the lab reboots (or that it never does), and a `!!! note` that on-demand
   provisioning takes a few minutes.
3. `## Device Access Information`: one row per device the learner touches,
   `<Device> | Browser (ATC Portal) | <account> | <password>`, defaults from
   the platform profile (for example `Ubuntu 24.04 VM | Browser (ATC Portal) |
   labuser | Labpass01!`).

Exact file contents, sizes, and sample data belong in SETUP.md, not here.
When a finished lab exists, reuse its wording for the management-network
sentence and the portal paragraph.

## Module pages

- `# <Task-shaped title>`, then an intro paragraph on why the task matters and
  what the learner will accomplish. Teach as well as instruct: every command
  gets a sentence of purpose before it, goal first (P1): "To list inode
  numbers with their names, run:". The sentence after the output says what
  to notice.
- `## <Step group>` sections with numbered steps. Open each group with one
  sentence on what it does and why, not a restatement of its heading. Then
  the steps:
  - **Place first** when there's more than one (P1): "In the **web01** tab,
    run:", "In the `/etc/ssh/sshd_config` file, find the `PermitRootLogin`
    line."
  - **One action per step** (P2): one fenced block tagged with the
    platform's shell, holding the copy-accurate command and nothing else (no
    prompt, F5). Combine two actions only when they happen in the same place
    and nothing needs checking between them.
  - **The result in the same step** (P4): the output, then what to look for
    in it. When values vary (PIDs, timestamps, inode numbers), introduce it
    with "The output is similar to the following:" and name the values that
    differ ("Your inode numbers differ.").
  - **A recovery line** under any step that commonly goes wrong (P5): "If you
    see `Permission denied`, you ran it without `sudo`. Run it again with
    `sudo`." Quote the exact error text.
  - **Deliberate failures** outside a predict prompt say so first (P6): "This
    command fails. Read the error it prints."
  - **Optional steps** start with `**Optional:**`, and no later step depends
    on them (P7).
  - **No sub-steps** (P8). Split them into numbered steps; a group with one
    step is a bullet.
- 1-3 `!!! note` admonitions per module (body indented 4 spaces) for
  conceptual asides and "what this really means" moments. A note holds
  optional context and never contains a step. A gotcha that makes a step
  fail goes in the step itself, or in a `!!! warning` placed before the step
  that states the problem, its cause, and the fix.
- Small tables for reference material (flag meanings, layer models), each
  with a header row, no empty header cells, and no merged cells (F8).
- Module 1 starts with orientation (an "Open a Terminal" reminder, then a
  survey of the starting state). Later modules build toward the finished
  artifact, following the arc of the videos the lab covers.
- Every module but the last ends with `## What You Have Learned`: bullets of
  concrete skills and findings, then one sentence bridging to the next module.
- The final module ends instead with `## <Workflow> Summary` (the numbered
  end-to-end procedure the lab walked through) and a closing paragraph that opens
  "Congratulations. You have completed the **<Course>: <Lab Title>** lab."
  and then names the skills gained and where they apply.

## Lab-first pages

A lab-first lab carries its own teaching, with media placed at the steps
that need it. Placement and the reasons for it are in `.claude/house-style.md`
"Lab-first design"; this is how each piece appears on a page. Label every
item with words, never an emoji or icon.

**GIF**, directly before the step it helps with. The media type keeps the
name GIF, but it ships as a muted looping MP4 that autoplays with controls,
so a learner can pause it (WCAG 2.2.2), plus a PNG poster of the finished
state. Both files use the media ID: `<media-id>.mp4` and `<media-id>.png`.

```html
**GIF (8 s): Tab Completion.**

<video autoplay loop muted playsinline controls preload="auto" poster="./media/module-1/lf-l1-g1.png" aria-label="Typing cd /us and pressing Tab completes the line to cd /usr/" src="./media/module-1/lf-l1-g1.mp4"></video>
```

The `aria-label` is the loop's text alternative (F9): it names every key
pressed and the visible result, under about 155 characters, and never
starts with "GIF of" or "Video of". Every string and key the loop shows
appears in the `aria-label` or in the step text right after it, so the step
still works for a screen reader or a failed load. The loop length lives in
the label, not the `aria-label`.

**Video**, directly after the predict or try step it explains, with a bold
label giving its title and length, and "optional" when the outline marks it:

```html
**Video (75 s, optional): Virtual Filesystems.**

<video controls preload="metadata" width="100%" src="./media/module-2/lf-l2-v1.mp4">
  <track kind="captions" src="./media/module-2/lf-l2-v1.vtt" srclang="en" label="English" default>
</video>
```

Every video has its captions track, and no transcript goes under it: the
narration names every fact the visuals depend on (`/scripts`), and the
captions carry the narration. The page never depends on the video: the step
before it already showed the learner the result, and the video explains
why.

**Predict**, before the command it tests. Ask the learner to decide first,
give multiple-choice options as a bulleted list with the letters in the
text (M11) so each renders on its own line, then the step that runs the
command, then a collapsed reveal:

```html
**Predict:** You mount the new disk on `/mnt/data`. What happens to `before.txt`?

- a. It gets deleted
- b. It gets copied onto the new disk
- c. It's hidden
- d. The mount fails

Decide on your answer, then run the next step to find out.

<details><summary>Reveal</summary>

It's hidden. The mount covers the directory, so `ls` shows only the new
disk's `lost+found`. Unmount it and `before.txt` is back.

</details>
```

Keep the blank lines inside `<details>` so the markdown in it renders.

**Hints** come in two levels, each in its own collapsed block, in this
order. **Hint** names the tool or where to look, specific enough to act on;
a vague first hint teaches learners to skip hints. **Answer** gives the exact
command, or for a goal with no single command, the expected end state. The
"Hint levels" column of the guidance-level table decides which a step gets. In
a goal-plus-hint lab the Hint is an italic line in the open, and only the
Answer is collapsed.

````html
<details><summary>Hint</summary>

`chmod` accepts an octal mode. The Permission Bits card on the Reference
Cards page gives the value for each set of bits.

</details>

<details><summary>Answer</summary>

```bash
chmod 750 ~/permlab/run.sh
```

</details>
````

In the capstone the same two levels are labeled `Stuck? Hint` and `Stuck?
Answer`; the platform logs opening them.

**Reference cards** live on the lab's Reference Cards page (`reference.md`,
in the site nav, so a card is always one click away). Each card gets a
`## <Card Title>` heading, the image with a short alt that names the card
and what it covers, and then the card's content as text: a Markdown table
or list taken from the card spec's `## Card layout`, so the card isn't only
an image of text (WCAG 1.4.5). The text version holds the same rows and
values as the image, in the same order.

```markdown
## Permission Bits

![Permission Bits card: read, write, and execute values on files and directories](./media/reference/lf-card-permission-bits.png)

| Bit | Value | On a file | On a directory |
|---|---|---|---|
| `r` | 4 | Read the contents | List the names in it |
| `w` | 2 | Change the contents | Create, delete, and rename entries |
| `x` | 1 | Run it as a program | Enter it and reach entries by name |
```

The step that first needs a card points to it by name ("the Permission Bits
card on the Reference Cards page").

**Checks** close each module (or wherever the outline puts them). The lab
portal runs them; the page says what the portal verifies, in plain words,
and what to look at if it fails:

```markdown
## Check Your Work

The lab portal checks that `run.sh` is executable by you and your group but
not by others, and that `~/permlab` is back to mode `755`. If the first
check fails, list the file with `ls -l` and compare its mode to the
Permission Bits card.
```

A question-style check (when the outline has no command to verify) is a
`**Check:**` question with a collapsed answer. The check command itself
lives only in SETUP.md's portal checks table, never on the learner's page.

**Guidance levels.** The outline sets one per lab. Write every step to it:

| Level | How a step reads | Hint levels |
|---|---|---|
| Full commands and expected output | The exact command, then its expected output, then what to notice | None |
| Full commands with predict prompts | The same, with predict steps before the key commands | None |
| New commands given, goals for known ones | Commands the path hasn't taught yet appear exactly; for ones it has, the step states the goal ("list the directory with inode numbers") | Answer, collapsed, on goal steps |
| Goal plus hint | The goal, then the Hint as an italic line | Hint in the open, Answer collapsed |
| Goal plus collapsed hint | The goal, then the collapsed blocks | Hint and Answer, both collapsed |
| Goals only | The goal and nothing else (the capstone) | `Stuck? Hint` and `Stuck? Answer`, both collapsed |

In the first two levels, show one way to do each task. Name an alternative
only when the portal check accepts it too.

A goal step has one defensible end state (P10). It names the object (the
exact path or host), the end state, any constraint, and how the learner can
confirm it, in words that match the portal check's pass condition: "Make
`~/permlab/run.sh` executable by you and your group, and not by others.
Confirm with `ls -l`: the mode reads `-rwxr-x---` or `-rwxrwx---`."

**Callbacks across labs** name the concept ("the inodes model from the links
lab"), never a lab number. Each lab is its own repo, and learners arrive at
it from different places.

## Command output

In the published guide, every command's output is a rendered terminal
screenshot, never a fenced `text` block. The ATC site adds a copy button to
every code block, so output in a code block reads like another command to
run. Whether the site supports Material for MkDocs `{ .text .no-copy }`
blocks, which would let output ship as text, is an open question that
`/lab-review` raises; until it's settled, output stays as screenshots.

Every output screenshot's alt text quotes, verbatim, the output lines the
learner compares against (F9), because the image is the only place that
text exists. Name the command, then the lines, and leave out the prompt
and any lines the step doesn't ask the learner to read:

```markdown
The output is similar to the following, with different inode numbers and times:

![ls -li output: 1048601 -rw-r--r-- 2 labuser labuser 6 Sep 23 10:14 hard.txt and 1048601 -rw-r--r-- 2 labuser labuser 6 Sep 23 10:14 notes.txt](./media/module-2/ls-li-hard-link.png)

Both names show the same inode number and a link count of `2`.
```

Render the screenshots with `scripts/lab-terminal-shot.py` after the dry run.
They use the portal's green-on-black look: the platform prompt plus the
command as typed, the real output, and a trailing prompt with cursor. Include
the elevation prompt (for example `[sudo] password for labuser: `) on a
session's first elevated command. Save them to
`media/module-N/<descriptive-name>.png`, reference them as
`![<command> output: <quoted lines>](./media/module-N/<name>.png)`, and keep
the spec for every shot in `labs/<slug>/shots_spec.py` so they can all be
re-rendered together. That file is pushed to the lab repo root too.

Until then, drafts carry expected output in `text` blocks (see `/lab`), with
cut output marked by `...` on its own line.

## House rules

- **Copy-accurate commands** that run in order on the stated environment.
- **Command blocks hold the command only** (F5). The step text says where it
  runs and with what privilege: the tab, the mode (`configure terminal`, an
  elevated PowerShell), and whether it needs `sudo`.
- **Real values, not placeholders** (F4): `labuser`, the SETUP.md hostname,
  the pre-seeded paths. When a value is the learner's own choice, write it as
  `UPPER_SNAKE` with "Replace `NAME` with ..." directly under the block.
  Never `<name>`, `x`, or `xxx`.
- **Trim shown output** to what the lesson needs, per the platform profile.
  Keep commands as taught and trim only the output. On Linux and Windows
  networking labs, leave out IPv6 and layer-2 detail everywhere a learner
  sees it: `fe80::` link-locals, `::1`, `[::]` listener rows, `(v6)` firewall
  rows, MAC addresses, and prose explaining them. On device CLIs, drop
  unrelated interfaces and boilerplate banners. MAC and interface tables
  belong only in SETUP.md.
- **First elevated command** gets a `!!! note` on the platform's elevation
  model. For `sudo`: it prompts for the lab user's password, which the note
  gives verbatim (lab credentials aren't secret); nothing echoes while typing;
  sudo remembers it for about 15 minutes. For Windows: how to open an
  elevated PowerShell and what the UAC prompt looks like. For a device CLI:
  `enable` and the enable password. Copy a finished lab's wording when there
  is one.
- **One portal tab per device.** The ATC portal opens a browser terminal or
  console tab for each lab device. Write multi-host steps as tab switches
  ("In the **web01** tab, run:"), name the tab in each step, and remind the
  learner to read the prompt. Never have learners SSH or RDP between lab
  hosts or use tmux for a second shell. After a reboot the learner selects
  **Reconnect**.
- **UI labels and keys are bold** and match what's on screen (F2, F3):
  "select **Reconnect**", "press **Tab**", "press **Ctrl+C**". Menu paths
  read **File > Open**. "Select", "enter", and "press"; never "click on" or
  "hit".
- **No markdown filenames** in learner text. Learners see page names, so
  write "the Environment page" and "Module 2", not `environment.md`.
- **Headings** use WWT Title Case (M8). Task headings, the module H1s and
  step groups, start with an imperative verb and run 3 to 11 words: "Create
  a Hard Link", not "Creating a Hard Link", "Understanding Hard Links", or
  "Run `ln`". No gerunds and no code or links in a heading. The fixed
  headings (`Check Your Work`, `What You Have Learned`, `<Workflow>
  Summary`, and the Environment page's three) keep their form.
- **Old terms in platform literals** stay exactly as printed (`master` in
  `ip link set dev eth1 master br0`); the sentence around them uses the
  neutral word and names the literal once (style guide "Inclusive
  language").
- **References** go to this path's videos and labs by concept, never to other
  courses.
- **description.md** leads with what the learner will do and why it matters.
  It never opens with the "<OS> desktop hosted in the WWT ATC" boilerplate.
