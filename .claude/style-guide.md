# Writing style guide

How learner-facing prose is written: outlines, lab guides, the path page,
reference cards, and articles. Narration follows the same voice but is
written for the ear; its rules are in `/scripts` "Writing for the ear", and
the exemptions are listed at the end of this file. Research briefs follow
the "Citations in research briefs" section.

Rule IDs (`V2`, `M4`, `F4`) are stable, so `prose-checker` and
`/lab-review` can cite them. A removed rule leaves a gap in the numbering.

Code, commands, flags, paths, and shown output are never edited to fit these
rules. Copy accuracy wins.

## Base manual

1. **The Google developer documentation style guide**
   (https://developers.google.com/style) is the base manual. Where it is
   silent, follow its own fallback order: Merriam-Webster for spelling,
   the Chicago Manual of Style for nontechnical questions, and the
   Microsoft Writing Style Guide for technical ones.
2. **APA 7** governs two areas only: bias-free language (its Chapter 5,
   applied in the "Inclusive language" section) and the reference entries
   in research briefs. Its other mechanics (title-case headings, no
   contractions, en-dash ranges) are for scholarly papers and don't apply.
3. **House rules override every manual.** `.claude/house-style.md` and this
   file win where they disagree with Google.

Deliberate departures from Google, so reviewers stop flagging them:

- No em dashes (Google allows them) and no en dashes.
- Numerals for every duration, even under 10 ("5 minutes").
- Logical punctuation with every quotation, not only code (M10).
- Title Case for H1 titles and for WWT lab headings (M8). Google, Microsoft,
  and Red Hat use sentence case; the WWT lab format requires Title Case.
- The house word list (M12) overrides the closed-prefix rule:
  `pre-check`, `pre-seeded`, `micro-video`.
- "log in" and "login" on Linux and device consoles, not "sign in", because
  the platform prints `login:`.

## Lab pages

Lab pages (the learner-facing pages in `labs/<lab-slug>/`) follow the
voice and conventions of the linux-intermediate labs (`broken-path` and
`log-rotation-tool` are the reference), the model for every lab. Where a rule
in this file conflicts with those labs, the labs win on lab pages. These
rules don't apply there:

- **Heading form.** Module titles are imperative ("Fix the Address") and
  step-group headings are gerund phrases ("Fixing the Prefix", "Opening a
  Terminal and Surveying the Damage"). The base manual's imperative,
  no-gerund task-heading rule gives way. Title Case (M8) still applies.
- **P1 lead-in form.** A step opens with a plain sentence ("Confirm the
  change.", "Try to reach `web01` anyway, by its known address.") and no
  required "To X, run:".
- **P4 wording.** No required "The output is similar to the following".
  Say what varies in the note after the screenshot ("your output may show a
  few extra rows"). The result still follows the action.
- **P2 one command per block.** Related commands can share a block when
  they're read together ("Confirm the change." with `ip -br addr` and `ip
  route show`).
- **P8 one-step groups.** A group with one step is still a numbered list.
- **G1 paragraph length.** Explanations after a step run as long as the
  lesson needs; each paragraph is still one source line (the labdocs build
  turns line breaks into visible breaks).
- **F9 quoted output.** Screenshot alt text is short: the command or the
  result ("ip -br addr", "ping: Network is unreachable"), not quoted output
  lines.
- **F6 position words.** "below" and "above" are fine ("the password
  below").
- **G2 once and since.** "Once your lab is provisioned" and "since the path
  depends on the network" are fine. G2's other pairs still apply.
- **V3 'll.** "You'll" and "you'll" are fine.
- **V4 "just".** "just" is fine ("They just never get a reply"). The
  other minimizers are still out.
- **F2 "click".** Portal buttons are clicked: "click **Launch**". Labels
  stay bold.
- **M4 spelled durations.** Durations in sentences can be spelled out, as
  the labs do ("about fifteen minutes", "up to five minutes").
- **Concept-only callbacks** (house style). A lab page can name a video by
  its topic: "the addressing video showed you". Never by number.

Still in force on lab pages: the inclusive-language rules, M4 and M5 for
every other number and unit, no em dashes or en dashes (M2), and no emojis.
Lab markup for the ATC labdocs build is documented in the `/lab` skill.

## Voice and tone

- **V1. Address the learner as "you".** Don't use "we", "us", or "let's".
  In WWT material "we" reads as WWT.
- **V2. Present tense** for how the system behaves: "`ls` lists the
  directory", not "`ls` will list". Use "will" only for something that
  happens later in the lab. Keep one tense within a paragraph, including
  predict reveals.
- **V3. Common contractions are fine**, especially negatives: don't, isn't,
  can't, it's, you're. Never noun plus verb ("the file's ready"), and never
  'd or 'll ("it'll", "there'd"). Several contractions in one sentence is
  a density problem, not a ban.
- **V4. No minimizers.** Delete "just", "simply", "easy", "easily",
  "obviously", "of course", "quickly", "straightforward", and "please".
  What is easy for the author isn't easy for a learner stuck on the step.
- **V5. No blame and no praise.** Describe a problem by what's on screen,
  not by what the learner did wrong: "If the mode shows `644`, the file
  isn't executable yet", not "You forgot to add the bit". No exclamation
  marks. The lab's closing Congratulations paragraph is the only
  congratulation.
- **V6. Software doesn't perceive, know, want, or think.** "The kernel
  detects the device", not "sees"; "the shell expects a path", not
  "wants". Plain function verbs are fine: returns, prints, shows, lists,
  detects, generates, rejects. (This extends unslop rule 32.)
- **V7. "may" means permission.** For possibility write "might" or "can":
  "The first run might take a minute."

## Global English

Many learners read English as a second language, and all of them read with
a terminal open beside the page.

- **G1. Short sentences and paragraphs.** Aim for 25 words or fewer per
  sentence and five sentences or fewer per paragraph in lab pages. Subject,
  verb, object order. Narration has its own sentence rule in `/scripts`.
- **G2. Unambiguous words.** "because", not "since"; "although", not
  "while" (for contrast); "after", not "once" (for time); "for example",
  "such as", "that is", and "versus", not "e.g.", "i.e.", "etc.", or "vs"
  in sentences ("vs." is fine in a title). Drop "via": "through" or "with".
- **G3. No idioms or culture-specific phrases.** "under the hood", "out of
  the box", "spin up", "sanity check", "on the fly", "rule of thumb",
  "in a nutshell". Prefer a single verb over a phrasal verb when one exists
  ("remove", not "get rid of"). "Set up" and "log in" are fine.
- **G4. Keep the small words.** Keep "that", articles, and "who". Stack at
  most two nouns before a noun ("the mount point directory", not "the
  data disk mount point directory list").
- **G5. One term per concept, across the whole lab**, not only within a
  paragraph (unslop rule 11). Don't use one word for two things either:
  "link" could mean a hard link or a symbolic link, so say "hard link" or
  "symlink" every time.
- **G6. Give "this" a noun** when the previous sentence named two things:
  "This mount hides the directory", not "This hides it".
- **G7. Define terms and acronyms where they're used.** Define a term at the
  step where it first appears, not only on a card. Spell out an acronym on
  first use on each page (each lab repo stands alone): "access control list
  (ACL)". Skip the expansion for terms better known as acronyms (CPU, RAM,
  URL, IP, DNS, SSH, USB). Don't introduce an acronym in a heading, and don't
  introduce one you use only once.

## Mechanics

- **M1. Serial comma.** "Press Tab, Enter, and Ctrl+C."
- **M2. No em dashes, en dashes, or spaced hyphens (" - ", "--") as
  dashes.** Use a period, a comma, or two sentences. Parentheses are fine
  for asides, abbreviations, lengths, and labels ("Video (75 s,
  optional)"); don't use them to wrap a whole clause that an em dash used to
  set off.
- **M3. Ranges.** In sentences, "to" with the unit spelled out: "Micro-videos
  run 30 to 90 seconds." In labels and tables, a hyphen with no spaces and
  the unit once: "GIF (5-15 s)". Never combine "from" or "between" with a
  hyphen ("from 30-90").
- **M4. Numbers.** Words for zero through nine in sentences, numerals for 10
  and above: "five labs and 12 GIFs". Always numerals for units and
  durations, sizes, versions, ports, modes, percentages, step and module
  numbers, values the learner types or sees, and counts in tables and
  labels: "8 s", "port 22", "mode `644`", "Ubuntu 24.04", "step 3". If one
  item in a series needs a numeral, use numerals for all items of that kind
  ("3 videos and 12 GIFs"). Don't start a sentence with a numeral; rewrite.
  Commas in numbers of four or more digits in prose ("1,024 bytes"; output
  keeps its own format). Percentages as "80%". Spell out ordinals ("the
  first elevated command"). Leading zero on decimals ("0.5 s").
- **M5. Units.** One space between a number and its unit symbol: "8 s",
  "90 s", "2 GB", "15 min". Never "90s", which also reads as a decade. Spell
  units out in sentences and use symbols in labels, tables, and lengths in
  parentheses. A spelled-out unit as a modifier takes a hyphen ("a
  90-second video"); a symbol doesn't ("a 100 MiB disk"). Label media under
  2 minutes in seconds ("Video (75 s)") and the briefing in m:ss
  ("Briefing video (2:30)"). Dimensions use a lowercase x: 1920x1080.
- **M6. Binary units match the tool.** MB and GB are powers of 1000; MiB and
  GiB are powers of 1024. GNU size suffixes (`truncate -s 100M`, `dd
  bs=1M`) are powers of 1024, so that disk is "100 MiB".
- **M7. Dates and times.** ISO 8601 in frontmatter, tables, and filenames
  (2026-09-23); "September 23, 2026" in sentences, no ordinals. Times as
  "3:30 PM"; use 24-hour time only when the system shows it ("the job runs
  at 02:00").
- **M8. Capitalization.**
  - Sentence case for H2 and lower headings in articles, the path page, the
    outline, and research briefs.
  - Title Case for H1 titles of labs, videos, cards, and articles, and for
    WWT lab headings: capitalize the first and last word and every other
    word except a, an, the; and, but, or, nor, yet, so; and prepositions of
    four or fewer letters ("vs." stays lowercase). "Moving Around the Tree",
    "Absolute vs. Relative Paths", "What You Have Learned".
  - A title keeps one form everywhere: the outline, the media label, the
    composition, and the lab page.
  - Write product names as the vendor does (PowerShell, IOS XE, Ubuntu).
    Code keeps its exact case in code font, even at the start of a list
    item. Rewrite a sentence that would start with a lowercase command or
    product name: "The `sudo` command prompts for a password."
  - Capitalize a named page or card, not the generic noun: "the Permission
    Bits card", "the Environment page", "a reference card".
- **M9. No emphasis formatting in prose.** No bold, italics, or capitals to
  stress a word. Italicize a term only where it's defined ("A *hard link*
  is a second name for the same inode"). Bold is for UI labels (F2), keys
  (F3), media labels (`**GIF (8 s): Tab Completion.**`), and bold lead-ins.
- **M10. Quotation marks.** Straight double quotes; single quotes only
  inside a double-quoted quotation or in code. A period or comma goes inside
  the quotation marks only when it belongs to the quoted text. Literal
  strings (commands, paths, errors, file contents) go in code font, not
  quotation marks.
- **M11. Lists.**
  - Numbered lists for steps and sequences, bullets for unordered items,
    and lettered options for predict prompts, written as bullets
    (`- a. It gets deleted`) so each renders on its own line.
  - Introduce a list with a complete sentence ending in a colon, or with a
    heading.
  - Every item has the same grammatical form.
  - Start each item with a capital unless it starts with code.
  - End an item with a period if it's a sentence or has a verb; leave
    short fragments, code-only items, and UI labels bare. Be consistent
    within one list. No semicolons or "and" at item ends.
  - Two to seven items where possible; split longer lists.
- **M12. Hyphens and the house word list.** Hyphenate a compound modifier
  before its noun ("a command-line tool", "a read-only directory") and leave
  it open after ("run it on the command line"). No hyphen after an -ly
  adverb ("a fully guided lab"). Close up prefixes ("preinstalled",
  "nonzero") except before a capital or number and in the house word list:
  pre-check, pre-seeded, micro-video, filename, command line (noun) and
  command-line (modifier), set up (verb) and setup (noun), log in (verb) and
  login (noun), built-in.
- **M13. Symbols in sentences.** Spell out +, arrows, and a slash meaning
  "or": "goal plus hint", "a predict or try step", "owner, group, and
  other". Slashes that are part of a name or path stay (TCP/IP, `/etc`).
  Symbols stay in code, cards, and visual briefs. Never use the ellipsis
  character; three periods only mark cut output.
- **M14. Code names aren't possessives or verbs.** "the `ls` output", not
  "`ls`'s output"; "search the log with `grep`", not "`grep` the log";
  "connect with SSH", not "ssh into"; "extract", not "untar".

## Formatting technical text

- **F1. Code font** for commands, flags, paths, users, hostnames, file
  contents, and error text, with exact case. Name the thing: "the
  `/etc/hostname` file", "the `~/linklab` directory". Name file types, not
  extensions ("a YAML file").
- **F2. UI labels** are bold and match the UI's capitalization, without the
  element type unless it's needed: "select **Reconnect**", not 'click the
  "Reconnect" button'. Use "select" and "enter"; never "click on" or "hit".
  Menu paths: **File > Open**.
- **F3. Keys** are bold, as labeled on the keyboard, with a plus sign and no
  spaces for combinations: "press **Tab**", "press **Ctrl+C**". "Press",
  never "hit".
- **F4. Placeholders.** Labs run on a fixed environment, so write the real
  values (`labuser`, the SETUP.md hostname) and no placeholder. When a value
  is the learner's own choice, write it as `UPPER_SNAKE` and put "Replace
  `NAME` with ..." directly under the block. Never use `<name>` (bash and
  PowerShell treat angle brackets as operators, so a pasted command fails
  with a confusing error), and never `x` or `xxx`.
- **F5. Command blocks hold the command only**, no prompt. The step text says
  where it runs and with what privilege: the tab, the mode (`configure
  terminal`, an elevated PowerShell), and whether it needs `sudo`.
- **F6. Links and position words.** Link text names the destination and
  makes sense read alone; never "here", "this page", or "click here". Don't
  point by position ("above", "below", "on the right"); write "the previous
  step", "the following output", "the Environment page".
- **F7. Never color alone.** "The line in green" also names or quotes the
  line: "the `inet` line".
- **F8. Tables** have a header row with no empty header cells, no merged
  cells, and no layout-only use.
- **F9. Alt text** says what the image shows, not that it's an image ("Image
  of", "GIF of", "Screenshot of" are out). Keep it under about 155
  characters, except where it has to carry text: a screenshot of command
  output quotes, verbatim, the lines the learner compares against (lab
  pages use short alt text instead; see "Lab pages"). A
  diagram gets a short alt that names what's in it, with the long
  description in the page nearby (the Device Access Information table for
  a topology).

## Procedures

- **P1. Goal and place before the action.** Start a step with its purpose
  when the purpose isn't obvious, and with the place when there's more than
  one: "To list inode numbers with their names, run:", "In the **web01**
  tab, run:".
- **P2. One action per step**, one command block per step. Combine two
  actions only when they happen in the same place and nothing needs
  checking between them.
- **P3. Imperative, complete sentences.** "Run", not "execute"; "Create the
  file", not "File creation".
- **P4. Result right after the action.** State what the learner sees
  directly after the command, in the same step. When values vary (PIDs,
  timestamps, inode numbers), write "The output is similar to the
  following" and say which values differ. Then one sentence on what to
  notice.
- **P5. Error recovery at the step that fails.** Where a step commonly goes
  wrong (a mistyped path, a missing `sudo`, the wrong tab), add one line
  under it: "If you see `Permission denied`, you ran it without `sudo`. Run
  it again with `sudo`." Name the exact error text.
- **P6. Say when a failure is deliberate.** Outside a predict prompt, a step
  that fails on purpose says so first: "This command fails. Read the error
  it prints."
- **P7. Optional steps** start with `**Optional:**`, and nothing later
  depends on them. No parenthetical "(stretch)".
- **P8. No sub-steps.** Split them into numbered steps. A group with one step
  is a bullet, not a numbered list.
- **P9. Observable goals.** A goal uses a verb someone could watch you do:
  explain, create, find, fix, predict, compare, restore. Never
  "understand", "know", "learn", or "be familiar with". "Explain why a hard
  link survives deletion and a symlink doesn't."
- **P10. Goal-only tasks have one defensible end state.** The goal names the
  object (the exact path or host), an end state the learner can see in the
  terminal, and any constraint ("leave `/etc` unchanged"). If two careful
  learners could build different end states from the same words, rewrite
  it.

## Inclusive language

Follow APA 7 bias-free language: describe people at the level of detail the
point needs, and call groups what they call themselves. For a generic person
write "you", a role ("the administrator"), or singular "they", never "he or
she" or "s/he". Vary names in fictional examples.

Replace these in prose, on cards, and in narration:

| Avoid | Use |
|---|---|
| master/slave (roles) | primary/secondary, primary/replica, leader/follower, active/standby; the vendor's current pair if it has one |
| master (branch) | main, or "the default branch" |
| whitelist/blacklist | allowlist/denylist (nouns), or "allow list" and "block list" where the product says so |
| sanity check | quick check |
| dummy (value, file) | placeholder, sample, test file |
| hang, hung | stop responding |
| kill, abort (in prose) | stop, end, cancel |
| cripple, crippled | disable, slow down, break |
| blind to, turn a blind eye | ignore, unaware of |
| crazy, insane, dumb, lame | unexpected, confusing, or the precise word |
| guys, you guys | everyone, you |
| manpower, man-hours | staff, person-hours |
| native (feature) | built-in |
| grandfathered | legacy, exempt |

**When the platform still uses the old word.** Never change a command, flag,
or output line to avoid a term; copy accuracy wins. `ip link set dev eth1
master br0`, the bonding driver's `Slave Interface:` lines, `git`'s default
`master` branch, and Cisco's `ntp master` stay exactly as printed. In the
sentence around it, use the neutral word and name the literal once in code
font: "Attach the interface to the bridge (the option is named `master`)."
Later mentions use the neutral word. When the baseline supports a renamed
form (`SHOW REPLICA STATUS` instead of `SHOW SLAVE STATUS`), teach the new
one. The `kill` command and the execute permission bit keep their names.

## Citations in research briefs

Brief sources use a compact APA 7 entry with an ISO access date on every
entry, because vendor docs and man pages change without notice:

```
N. Author. (Date or n.d.). *Title* (version or identifier) [description]. Site. URL (accessed YYYY-MM-DD)
```

- The date is the page's last-updated date when it shows one, "n.d." when it
  doesn't, never the footer copyright year.
- Leave out the site name when it's the same as the author. Use a DOI
  instead of a URL when one exists.
- Cite man pages from the baseline distribution's archive
  (`manpages.ubuntu.com/manpages/noble/...`) and vendor docs from the
  baseline release's version of the page, with the release in the title's
  parentheses.
- When a page blocked fetching and the fact came from a search excerpt,
  add `[via search excerpt]`.
- Cite findings with numeric keys, `[3]` or `[3][7]`.

Examples:

```
1. Google. (n.d.). *Units of measurement*. Google developer documentation style guide. https://developers.google.com/style/units-of-measure (accessed 2026-09-23)
2. GNU coreutils. (n.d.). *truncate(1)* [Manual page]. Ubuntu 24.04 manpages. https://manpages.ubuntu.com/manpages/noble/man1/truncate.1.html (accessed 2026-09-23)
3. Fielding, R., Nottingham, M., & Reschke, J. (Eds.). (2022). *HTTP semantics* (RFC 9110). Internet Engineering Task Force. https://doi.org/10.17487/RFC9110 (accessed 2026-09-23)
```

## Narration exemptions

Narration is written for the ear and read by a TTS voice, so:

- Numbers are words, spelled the way the voice should say them ("thirty to
  ninety seconds", "seven five five"), not M4 numerals.
- Spoken symbol and flag names stay ("pipe", "dash L"), not M13.
- Phonetic spellings from the platform profile's TTS list stay.
- F rules (code font, bold, links) don't apply; there is no formatting.
- V, G, and the inclusive-language rules apply in full.

## Sources

The research behind these rules, with every source cited, is in
`.claude/references/writing/`: `style-guidelines.md` (base manual,
mechanics, inclusive language, citations), `technical-writing.md`
(procedures, formatting, accessibility, global English), and
`video-scripts.md` (narration, captions, GIFs).
