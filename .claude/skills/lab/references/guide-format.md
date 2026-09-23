# Lab guide format and house rules

The shape of every learner-facing page in a WWT lab, and the rules `/lab`
writes to and `/lab-review` checks. The learner sees the rendered mkdocs site
with only this guide open, so everything they need has to be on these pages.

## index.md

```markdown
![WWT Logo](./media/index/wwt-logo-color-stacked-high.png)

# <Path>: <Lab Title>

| Date | Version | Author | Notes |
|---|---|---|---|
| <today> | 1.0 | <author> | Initial release |
```

## environment.md

About 17 lines for a single-device lab. Three sections:

1. `# Environment Overview`: two short paragraphs. The first says what the
   environment is (the platform profile's default, e.g. one Ubuntu VM reached
   through the WWT ATC Lab Portal) and includes the management-network
   sentence. The second summarizes the starting state (what's pre-seeded and
   why). Then the diagram line
   `![environment](./media/environment/lab-topology.svg)`. `/lab-topology`
   draws the SVG later.
2. `## Accessing Your Lab Environment`: the portal paragraph, how many times
   the lab reboots (or that it never does), and a `!!! note` that on-demand
   provisioning takes a few minutes.
3. `## Device Access Information`: one row per device the learner touches,
   `<Device> | Browser (ATC Portal) | <account> | <password>`, defaults from
   the platform profile (e.g. `Ubuntu 24.04 VM | Browser (ATC Portal) |
   labuser | Labpass01!`).

Exact file contents, sizes, and sample data belong in SETUP.md, not here.
When a finished lab exists, reuse its wording for the management-network
sentence and the portal paragraph.

## Module pages

- `# <Task-shaped title>`, then an intro paragraph on why the task matters and
  what the learner will accomplish. Teach, don't just instruct: every command
  gets a sentence of purpose before or after it.
- `## <Step group>` sections with numbered steps. Each step is one action: a
  fenced block tagged with the platform's shell holding the copy-accurate
  command, then its output, then what to look for in it.
- 1-3 `!!! note` admonitions per module (body indented 4 spaces) for
  conceptual asides, gotchas, and "what this really means" moments.
- Small tables for reference material (flag meanings, layer models).
- Module 1 starts with orientation (an "Opening a Terminal" reminder, then a
  survey of the starting state). Later modules build toward the finished
  artifact, following the arc of the videos the lab covers.
- Every module but the last ends with `## What You Have Learned`: bullets of
  concrete skills and findings, then one sentence bridging to the next module.
- The final module ends instead with `## <Workflow> Summary` (the numbered
  end-to-end procedure they just did) and a closing paragraph:
  "Congratulations. You have completed the **<Course>: <Lab Title>** lab…"
  naming the skills gained and where they apply.

## Lab-first pages

A lab-first lab carries its own teaching, with media placed at the steps
that need it. Placement and the reasons for it are in `.claude/house-style.md`
"Lab-first design"; this is how each piece appears on a page. Label every
item with words, never an emoji or icon.

**GIF**, directly before the step it helps with:

```markdown
![Typing cd /us and pressing Tab completes it to /usr/ (8 s loop)](./media/module-1/lf-l1-g1.gif)
```

The alt text says what the loop shows, so it still works for a screen
reader or a failed load.

**Video**, directly after the predict or try step it explains, with a bold
label giving its title and length, and "optional" when the outline marks it:

```html
**Video (75 s, optional): Virtual Filesystems**

<video controls preload="metadata" width="100%" src="./media/module-2/lf-l2-v1.mp4">
  <track kind="captions" src="./media/module-2/lf-l2-v1.vtt" srclang="en" label="English" default>
</video>
```

Every video has its captions track. The page never depends on the video:
the step before it already showed the learner the result, and the video
explains why.

**Predict**, before the command it tests. Ask the learner to decide first,
give multiple-choice options as a lettered list when the outline has them,
then the step that runs the command, then a collapsed reveal:

```html
**Predict:** You mount the new disk on `/mnt/data`. What happens to `before.txt`?

a. It gets deleted
b. It gets copied onto the new disk
c. It's hidden
d. The mount fails

Decide on your answer, then run the next step to find out.

<details><summary>Reveal</summary>

It's hidden. The mount covers the directory, so `ls` shows only the new
disk's `lost+found`. Unmount it and `before.txt` is back.

</details>
```

Keep the blank lines inside `<details>` so the markdown in it renders.

**Hints**, as the guidance level allows (below): an italic line for "goal
plus hint", a collapsed block for "goal plus collapsed hint", and a
collapsed "Stuck?" block in the capstone:

```html
<details><summary>Hint</summary>

`chmod` takes both symbolic (`u+x,g+x`) and octal forms.

</details>
```

**Reference cards** live on the lab's Reference Cards page (`reference.md`,
in the site nav, so a card is always one click away): one `## <Card Title>`
heading and `![<card title>](./media/reference/<id>.png)` per card. The step
that first needs a card points to it by name ("the Permission Bits card on
the Reference Cards page").

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

| Level | How a step reads |
|---|---|
| Full commands and expected output | The exact command, then its expected output, then what to notice |
| Full commands with predict prompts | The same, with predict steps before the key commands |
| New commands given, goals for known ones | Commands the path hasn't taught yet appear exactly; for ones it has, the step states the goal ("list the directory with inode numbers") |
| Goal plus hint | The goal, then an italic hint naming the tool |
| Goal plus collapsed hint | The goal, with the hint in a collapsed block |
| Goals only | The goal and nothing else; "Stuck?" blocks only (the capstone) |

**Callbacks across labs** name the concept ("the inodes model from the links
lab"), never a lab number. Each lab is its own repo, and learners arrive at
it from different places.

## Command output

In the published guide, every command's output is a rendered terminal
screenshot, never a fenced `text` block. The ATC site adds a copy button to
every code block, so output in a code block reads like another command to
run.

Render the screenshots with `scripts/lab-terminal-shot.py` after the dry run.
They use the portal's green-on-black look: the platform prompt plus the
command as typed, the real output, and a trailing prompt with cursor. Include
the elevation prompt (e.g. `[sudo] password for labuser: `) on a session's
first elevated command. Save them to `media/module-N/<descriptive-name>.png`,
reference them as `![<what it shows>](./media/module-N/<name>.png)`, and keep
the spec for every shot in `labs/<slug>/shots_spec.py` so they can all be
re-rendered together. That file is pushed to the lab repo root too.

Until then, drafts carry expected output in `text` blocks (see `/lab`).

## House rules

- **Copy-accurate commands** that run in order on the stated environment.
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
  ("In the **web01 tab**, ..."), name the tab in each step, and remind the
  learner to read the prompt. Never have learners SSH or RDP between lab
  hosts or use tmux for a second shell. After a reboot the learner clicks
  "Reconnect".
- **No markdown filenames** in learner text. Learners see page names, so
  write "the Environment page" and "Module 2", not `environment.md`.
- **Headings** use WWT Title Case.
- **References** go to this path's videos and labs by concept, never to other
  courses.
- **description.md** leads with what the learner will do and why it matters.
  It never opens with the "<OS> desktop hosted in the WWT ATC" boilerplate.
