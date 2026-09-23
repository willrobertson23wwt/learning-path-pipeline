---
subject: Writing style and mechanics for the lab-first course pipeline (APA 7 and comparable manuals)
researched: 2026-09-23
sources: 58
scope: learner prose (outlines, lab guides, narration, cards, articles, path page) and internal research briefs
---

# Writing style and mechanics: research report

## 1. Summary

- **Base manual: the Google developer documentation style guide**, used with its own fallback order (Merriam-Webster for spelling, Chicago for nontechnical questions, Microsoft Writing Style Guide for technical ones) [1]. It already agrees with most house rules: sentence-case headings, straight quotes, no en dashes, hyphen ranges, serial comma, contractions, present tense, second person, no "e.g.", and inclusive terms [2][4][8][12][13][19].
- **APA 7 is a secondary source for two areas only:** bias-free language (Chapter 5) and the reference format for research briefs (Chapters 9 and 10). APA's mechanics suit scholarly papers. Its title-case headings, ban on contractions, en-dash ranges, and punctuation inside quotation marks all conflict with house rules [31].
- **House rules override every manual.** Deliberate deviations: no em dashes or en dashes anywhere, logical punctuation with quotation marks, numerals for all durations, and the house word list (`pre-check`, `micro-video`).
- **Top mechanics to add:** ranges ("30 to 90 seconds" in prose, "30-90 s" in labels), a space before unit symbols ("90 s", never "90s"), MiB versus MB when the tool counts in 1024s, zero to nine in words, a defined Title Case scheme for titles, UI labels in bold, and no possessives or verbs made from code names.
- **Inclusive language:** replace master/slave, whitelist/blacklist, sanity check, dummy, hang, "guys", and ableist idioms in prose. When a command or its output still uses an old term, show it verbatim in code font and describe it in neutral words on first mention [18][45].
- **Conflicts with current house text:** unslop 13 bans parentheses the templates use; "90s" durations; an undefined Title Case scheme with sentence-case titles in the worked example; UI labels in quotes; emphasis italics; the brief source format; em dashes in CLAUDE.md and labdrop; en dashes and a lab-number callback in `linux-filesystem-path.md` (Section 4).
- **Briefs:** switch the source list to a compact APA 7 entry that keeps an ISO access date on every entry. Mark findings with numeric keys like `[3]`.

## 2. Style sheet

Scope: learner prose. Narration keeps its TTS exceptions (spoken numbers, phonetic spellings), and code, commands, and shown output are never edited to fit these rules. "House" in the Source column means the rule is a deliberate house choice; the cited manuals are the evidence behind it or the manual it departs from.

### Punctuation

| Topic | Rule | Example (right) | Example (wrong) | Source |
|---|---|---|---|---|
| Serial comma | Always put a comma before the final "and" or "or" in a series of three or more. | Press Tab, Enter, and Ctrl+C. | Press Tab, Enter and Ctrl+C. | APA 6.3 [34]; Google [5]; AP omits it [44] |
| Em dash | Never. Use a period, a comma, or two sentences. | The mount hides the files. Unmount it to see them. | The mount hides the files (em dash) unmount it to see them. | House; Google and Microsoft allow it [4][21] |
| En dash | Never, including ranges and compound modifiers. | 2016-2020, pages 12-18 | 2016 (en dash) 2020 | House; Google [2][4]. APA, Chicago, and Microsoft use it [32][42][21] |
| Ranges in prose | Use "to" and spell out the unit. Never combine "from" or "between" with a hyphen. | Micro-videos run 30 to 90 seconds. | Micro-videos run from 30-90 seconds. | Google units [3]; Chicago [43] |
| Ranges in labels and tables | Hyphen with no spaces, unit symbol once after the range. | GIF (5-15 s) | GIF (5 - 15s) | Google numbers [2]; house |
| Spaced hyphen | Never use " - " or "--" as a dash. | See the output. It lists three files. | See the output - it lists three files. | Microsoft [21]; unslop 13 |
| Parentheses | Fine for asides, abbreviations, lengths, and labels. Not as a stand-in for a dropped em dash around a whole clause. | Video (75 s, optional) | The inode (and this is the key idea) stores the metadata. | House (clarifies unslop 13) |
| Colon | Lowercase after a colon in a sentence unless a proper noun, code, or a label follows. Capitalize after a colon in a title or heading. | Two files share an inode: `a.txt` and `b.txt`. / Linux Filesystem: Inodes and Links | Two files share an inode: They are... | Google [7]; Microsoft [23] |
| Quotation marks | Straight double quotes. Single quotes only inside a double-quoted quotation or in code. | "one tree" | curly quotes, 'one tree' | Google [12]; unslop 19 |
| Punctuation with quotes | Logical: a comma or period goes inside only if it belongs to the quoted text. | Click **Reconnect**, then read the prompt. / The capstone links say "Rewatch". | The links say "Rewatch." (when the label has no period) | House; Google literal-string exception [12]; Chicago 7.84 precision exception [43]. APA 6.7 and Chicago 6.9 put them inside |
| Literal text | Commands, paths, flags, users, hosts, file contents, and error text go in code font, not quotation marks. | `ls` prints `No such file or directory`. | ls prints "No such file or directory". | Google code in text [11] |
| UI labels | Bold, capitalized as the UI shows them. No quotes, no code font. | Click **Reconnect**. | Click "Reconnect". | Google UI elements [58] |
| Slashes | Don't use a slash for "and" or "or" in prose. Keep slashes that are part of a name or path. | a predict or try step; TCP/IP; `/etc` | a predict/try step; user/group/other bits | Unslop 33; APA [42] |
| Ellipsis | Don't use the ellipsis character. Write three periods only to show elided output. | You have completed the lab. | You have completed the lab... (as a template tail) | House |
| Symbols in prose | Spell out +, ->, and arrows in sentences. Symbols stay in code, cards, and visual briefs. | goal plus hint; `/bin` links to `/usr/bin` | Goal + hint; `/bin` -> `/usr/bin` | Unslop 33 |

### Numbers

| Topic | Rule | Example (right) | Example (wrong) | Source |
|---|---|---|---|---|
| Words or numerals | Words for zero through nine, numerals for 10 and above, in running prose. | The path has five labs and 12 GIFs. | The path has 5 labs. | APA 6.32 [31]; Google [2]; Microsoft [20]; Chicago alternative rule 9.3 [43] |
| Always numerals | Units of measure (including durations), sizes, versions, ports, modes, percentages, step and module numbers, values the learner types or sees, and all counts in tables and labels. | 8 s; 2 hours; port 22; mode `644`; Ubuntu 24.04; step 3 | eight s; mode six four four | APA 6.32 [31]; Google [2]; Microsoft [20] |
| Durations | Numerals even below 10. This departs from Microsoft, which spells out small time units. | Allow 5 minutes. | Allow five minutes. | House, APA [31], Google [2]; Microsoft differs [20] |
| Sentence start | Never start a sentence with a numeral or a lowercase command. Rewrite. | The `sudo` command prompts for a password. / Twelve GIFs cover... | `sudo` prompts for a password. / 12 GIFs cover... | Google [2]; Microsoft [20][23] |
| Mixed series | If one item of a kind needs a numeral, use numerals for all of that kind. | 3 videos and 12 GIFs | three videos and 12 GIFs | Microsoft [20] |
| Large numbers | Commas at four or more digits in prose. Output keeps its own format. | 1,024 bytes | 1024 bytes (in prose) | Google [2]; Microsoft [20] |
| Percentages | Numeral plus % with no space. | at least 80% | at least 80 percent; 80 % | Google [2]; APA [31]; AP [44]; Microsoft spells out "percent" [20] |
| Ordinals | Spell out. | the first elevated command | the 1st elevated command | Google [2]; Microsoft [20] |
| Decimals | Leading zero. | 0.5 s | .5 s | Google [2]; Microsoft [20] |
| Narration | Exempt. Write numbers the way the voice should say them. | "thirty to ninety seconds" | (none) | `/scripts` TTS rules |

### Units of measure

| Topic | Rule | Example (right) | Example (wrong) | Source |
|---|---|---|---|---|
| Space before a unit symbol | One space (non-breaking in HTML) between the number and the symbol. No space before %. | 90 s; 2 GB; 15 min | 90s; 2GB | Google [3]; Microsoft [22] |
| Why "90 s" | "90s" also reads as a decade. | Video (90 s) | Video (90s) | House |
| Symbols | s, ms, min for time; spell out "hours" and "days". MB, GB for powers of 1000; MiB, GiB for powers of 1024. | 1.5 GiB of RAM | 1.5 gigs | Google [3] |
| Match the tool | State the unit the tool uses. GNU `truncate -s 100M` means 100 MiB. | Create a 100 MiB disk image. | Create a 100 MB disk image (with `-s 100M`). | truncate(1) [57]; Google [3] |
| Spelled-out unit as a modifier | Hyphenate. | a 90-second video | a 90 second video | Chicago 7.85 [43]; Microsoft [22] |
| Symbol as a modifier | No hyphen. | a 100 MiB disk | a 100-MiB disk | Chicago 7.85 [43]; Google [3]. Microsoft hyphenates [22] |
| Prose versus labels | Spell units in sentences; use symbols in labels, tables, and parenthetical lengths. | GIFs run 5 to 15 seconds. / **GIF (8 s): Tab completion.** | GIFs run 5-15s. | House; Google [3] |
| Long media | m:ss for a video of 60 seconds or longer in labels. | Briefing video (2:30) | Briefing video (150s) | House (current practice) |
| Dimensions | Lowercase x, no spaces. | 1920x1080 | 1920 X 1080 | Google [2]; Microsoft uses a spaced multiplication sign [20] |

### Dates and times

| Topic | Rule | Example (right) | Example (wrong) | Source |
|---|---|---|---|---|
| Dates in prose | Full month, day, four-digit year. No ordinals. | September 23, 2026 | Sept. 23rd, 2026; 9/23/26 | Google [14]; Microsoft [20]; APA [31] |
| Numeric dates | ISO 8601 in frontmatter, tables, file names, and the lab index table. | 2026-09-23 | 09/23/2026 | Google [14] |
| Times | 12-hour clock with a space and capital AM or PM. Use 24-hour time only when the system shows it. | 3:30 PM; the cron job runs at 02:00 | 3:30pm; 15:30 (in prose) | Google [14]; Microsoft [20] |
| Time zones | Avoid. When needed, give UTC with an offset. | 2:00 PM UTC | 2 PM ET | Google [14] |

### Capitalization

| Topic | Rule | Example (right) | Example (wrong) | Source |
|---|---|---|---|---|
| Section headings | Sentence case for H2 and below in articles, path pages, outlines, and briefs. | ## How hard links survive deletion | ## How Hard Links Survive Deletion | Google [7][8]; Microsoft [23]; unslop 17. APA uses title case [31] |
| Titles | Title Case for H1 titles of labs, videos, cards, and articles, and for WWT lab headings. Capitalize the first and last word and every other word except a, an, the; and, but, or, nor, yet, so; and prepositions of four or fewer letters. "vs." stays lowercase. | Moving Around the Tree; Absolute vs. Relative Paths; What You Have Learned | Absolute vs relative paths; Moving Around The Tree | Microsoft title style [23][29]. APA capitalizes words of four or more letters, so "With" and "From" differ [31] |
| One title, one form | A title keeps the same case in the outline, the media label, Root.tsx, and the lab page. | **Video (75 s): Virtual Filesystems** everywhere | "Virtual filesystems" in the outline, "Virtual Filesystems" in the lab | House |
| Product names | Write them as the vendor does. Rewrite a sentence that would start with a lowercase name. | PowerShell, IOS XE, Ubuntu; The systemd journal keeps... | Powershell; Systemd keeps... | Google [7]; Microsoft [23] |
| Code items | Keep exact case in code font, even at the start of a list item. | `ls -l`, `Get-ChildItem` | `Ls -l` | Google [11]; Microsoft [25] |
| Key names | Capitalized, plain text, "press". Join combinations with a plus sign and no spaces. | Press Tab. Press Ctrl+C. | Hit tab. Press CTRL + C. | Google [58][19]; Microsoft [30] (Microsoft prefers "select") |
| Page and card names | Capitalize named pages and cards; lowercase the generic noun. | the Permission Bits card on the Reference Cards page; a reference card | the permission bits Card | Google [7]; guide-format |
| Emphasis | No all caps, and no bold or italics for emphasis in prose. Italics only for a term at the point it is defined. | A *hard link* is a second name for the same inode. | The video comes *after* the attempt. | APA 6.22 [31]; Microsoft [23] |

### Hyphenation and compounds

| Topic | Rule | Example (right) | Example (wrong) | Source |
|---|---|---|---|---|
| Compound modifier before a noun | Hyphenate. | a command-line tool; a read-only directory; a lab-first path | a command line tool | Google [6]; APA 6.12 [42] |
| Same words after the noun | Leave open unless the dictionary hyphenates them. | Run it on the command line. The directory is read only. | Run it on the command-line. | Google [6]; APA [42] |
| -ly adverbs | No hyphen. | a fully guided lab | a fully-guided lab | Google [6]; APA [42] |
| Prefixes | Close them up unless a capital, a number, or a doubled letter follows, or the house word list says otherwise. | preinstalled, nonzero, non-Ubuntu | pre-installed, non-zero | Google [6]; APA 6.12 [31] |
| House word list | pre-check, pre-seeded, micro-video, filename, command line (noun) and command-line (modifier), set up (verb) and setup (noun), log in (verb) and login (noun, prompt), built-in. | the pre-check; set up the VM; the login prompt | the precheck; setup the VM | House; Google word list for filename [19] |

### Abbreviations and acronyms

| Topic | Rule | Example (right) | Example (wrong) | Source |
|---|---|---|---|---|
| First use | Spell out on first use on each learner page (each lab repo stands alone), acronym in parentheses, expansion lowercase unless a proper noun. | Filesystem Hierarchy Standard (FHS); access control list (ACL) | FHS (first mention, no expansion) | Google [9]; Microsoft [24]; APA 6.25 [31] |
| Skip the expansion | For terms better known as acronyms: CPU, RAM, USB, URL, IP, DNS, SSH, HTML, PDF, and units. | Connect over SSH. | Connect over Secure Shell (SSH). (in a Linux lab) | Google [9]; Microsoft [24] |
| Used once | Don't introduce an acronym you use only once. Spell it out. | the Filesystem Hierarchy Standard | the Filesystem Hierarchy Standard (FHS), never used again | Microsoft [24] |
| Headings | Don't introduce an acronym in a heading. Expand it in the body text that follows. | (body) The Filesystem Hierarchy Standard (FHS)... | ## FHS basics (first mention) | Microsoft [24] |
| Plurals | Add s, no apostrophe. | two VMs, three APIs | two VM's | Google [9]; Microsoft [24] |
| Articles | Choose by pronunciation. | an SSH key, a URL, an NTP server | a SSH key | Google [9]; Microsoft [24] |
| Periods | None in acronyms or unit symbols. | VM, GB, s | V.M., sec. | Google [9]; APA [31] |
| Latin abbreviations | None in learner prose: write "for example", "such as", "that is". Avoid "etc." Write "versus" in text and "vs." only in titles. Internal docs may use "e.g." inside parentheses. | Tools such as `df` and `lsblk` | Tools, e.g. `df`, `lsblk`, etc. | Google [19][9]; Microsoft [29]; Chicago [43]; APA allows them in parentheses [31] |

### Lists

| Topic | Rule | Example (right) | Example (wrong) | Source |
|---|---|---|---|---|
| Type | Numbered for steps and sequences; bullets for unordered items; lettered (a., b., c.) for predict options. | 1. Run `pwd`. | Bulleted procedure steps | Google [10]; Microsoft [25]; APA 6.50-6.52 [40] |
| Lead-in | Introduce a list with a complete sentence ending in a colon, or with a heading. | The portal checks two things: | Checks: | Google [10]; Microsoft [25] |
| Parallel | Every item has the same grammatical form. | Create the file. List it. Remove it. | Create the file. Listing it. Removal. | APA 6.49 [31]; Google [10]; Microsoft [25] |
| Capitals | Start each item with a capital unless it starts with lowercase code. | - Hard links share an inode | - hard links share an inode | Google [10]; Microsoft [25]. APA lowercases fragments [40] |
| End punctuation | Period if the item is a sentence or has a verb; none for fragments of three words or fewer, code-only items, UI labels, or link text. Be consistent within a list. | - `/etc` (no period) / - Run `ls -li` to see inode numbers. | Mixed periods in one list | Google [10]; Microsoft [25] |
| No trailing joiners | No semicolons, commas, or "and" at item ends. | - Owner | - Owner; | Microsoft [25] |
| Length | Two to seven items where possible; split longer lists. | (none) | (none) | Microsoft [25] |

### Grammar, word choice, and voice

| Topic | Rule | Example (right) | Example (wrong) | Source |
|---|---|---|---|---|
| Contractions | Use common ones, especially negations. No noun-plus-verb contractions and no ambiguous 'd or 'll forms. | It's hidden. The file doesn't exist. | The file's gone. It'll fail. | Google [13]; Microsoft [26]. APA bans contractions [31] |
| That and which | "that" with no comma for restrictive clauses; ", which" for nonrestrictive ones. | the file that you created; `/proc`, which the kernel generates | the file which you created | Google [5] |
| Possessives of code and products | Never. Use the name as a modifier or rephrase with "of". | the `ls` output; the value of `PATH` | `ls`'s output; PATH's value | Google [17][11]; Microsoft [24] |
| Code as a verb | Never. Name the action and give the tool. | Search the log with `grep`. | `grep` the log. | Google [11] |
| Tense | Present tense for how systems behave; "will" only for a later event. Keep one tense within a paragraph. | The kernel frees the data when the count reaches 0. | The kernel will free the data. | Google [15]; APA 4.12 [31] |
| Person | Second person and imperatives in steps. | Run `cd -`. You return to the last directory. | The learner runs `cd -`. | Google [15]; house |
| Generic person | Singular "they", or a role, or "you". Never "he or she", "s/he", or generic "he". | If a user lacks the bit, they get `Permission denied`. | If a user lacks the bit, he or she gets... | APA [37][33]; Microsoft [27]; Chicago 18 [43] |
| Anthropomorphism | Don't give software perception, desire, or knowledge. Unambiguous function verbs are fine. | The kernel detects the device. `ls` shows two files. | The kernel sees the device. The shell wants a path. | Google [16]; APA 4.11 [35]; unslop 32 |
| Direction words | Point to content by position in the flow, not "above" or "below". | the following output; the previous step | the output below | Google word list [19] |
| "once" and "since" | Use "after" for time and "because" for cause. | After the mount finishes, run `ls`. | Once the mount finishes, run `ls`. | Google word list [19] |
| Minimizers | Don't use "simply", "just", "easy", "easily", "obviously", or "of course". | Run `pwd`. | Just run `pwd`. It's easy. | Google word list [19] |
| Plain verbs for IT | "run" not "execute" (the `x` bit stays "execute permission"); "stop responding" not "hang"; "stop" or "end" not "kill" or "abort" (the `kill` command keeps its name); "press" not "hit"; "unavailable" not "grayed out". | The service stops responding. Stop it with `kill`. | The service hangs. Kill it. | Google word list [19]; Microsoft [27][30] |
| Pronoun antecedents | Put a noun after "this" or "that" when the referent could be two things. | This mount hides the directory. | This hides it. | APA 4.7-4.11 [31]; plain language [55] |
| One term per thing | Pick one term and repeat it (inode, not also "file record"). | (none) | (none) | Plain language [55]; unslop 11 |
| Redundancy | Cut doublets and filler modifiers ("each and every", "completely empty", "actually"). | The directory is empty. | The directory is completely empty. | Plain language [55]; APA 4.4-4.6 [31] |

## 3. Findings

### Q1. What to take from APA 7, and the base manual

APA 7 was written for scholarly papers in the social sciences. Its student checklist confirms that it bans contractions and colloquialisms, requires title-case headings, forbids italics for emphasis, puts commas and periods inside quotation marks, and limits Latin abbreviations to parentheses [31]. Training prose for IT professionals is conversational, second person, and full of literal strings, so several of those rules would hurt it.

Worth adopting from APA 7:

- Serial comma (6.3) [34][31].
- The zero-to-nine rule with its numeral exceptions for units, times, percentages, and numbers in a series (6.32-6.39) [31].
- Hyphenation principles for compound modifiers and closed prefixes (6.11-6.12) [31][42].
- Parallel list items (6.49) [31].
- Conciseness and clarity (4.4-4.11): wordiness, redundancy, precise wording, anthropomorphism [31][35].
- Consistent verb tense (4.12) [31].
- Bias-free language (Chapter 5), including singular "they" and person-first or identity-first disability language [33][37][39].
- The reference-entry model for research briefs (Chapters 9 and 10) [32].

Not worth adopting: title-case headings (2.27), the contraction ban (4.4-4.11), en-dash ranges, punctuation inside quotation marks (6.7), lowercase bullet fragments [40], author-date citations, paper formatting, and "retrieval date only for changing works" (Section 5 below explains why briefs keep one).

**Recommendation:** adopt the Google developer documentation style guide as the base manual, with its published fallback order: Merriam-Webster for spelling, Chicago for nontechnical style, Microsoft for technical style [1]. Use APA 7 for bias-free language and brief references. House rules override all of them. Google is the closest fit: it bans en dashes and uses hyphen ranges [2][4], uses sentence case for headings [8], straight quotes [12], contractions [13], present tense [15], and no "e.g." or "i.e." [19], and it has an explicit rule for non-inclusive terms that are fixed in code [18]. Microsoft diverges on ranges (en dash, "from 9 through 17") [20][21], hyphenated unit modifiers [22], "percent" [20], and "select" for keys [30]. Treat those as Microsoft-only rules that the house does not follow.

**Deliberate deviations from the base manual:**

1. No em dashes (Google allows them) [4].
2. Numerals for all durations, even under 10 (Microsoft spells them out; Google is silent) [20].
3. Logical punctuation with every quotation, not only code (Google's default is American) [12].
4. Title Case for H1 titles and WWT lab headings (Google uses sentence case everywhere) [8].
5. House word list overrides the prefix rule: `pre-check`, `pre-seeded`, `micro-video` [6].
6. "log in" and "login" for Linux and device consoles (Google prefers "sign in") [19], because the platform prints `login:`.

### Q3. Bias-free and inclusive language for IT content

**Principles.** APA's two general principles are to describe people at the right level of specificity and to be sensitive to labels, calling people what they call themselves [33][39]. Microsoft adds diverse names and roles in fictional examples, no generalizations about cultures, and no slang [27]. The Linux kernel coding style (Section 4) bans new uses of master/slave and blacklist/whitelist in symbols and documentation. It allows exceptions only for an existing user-space ABI or for a hardware or protocol specification (as of 2020) that mandates the terms [45]. The IESG endorses NIST's NISTIR 8366 guidance for IETF documents [47][48]. The IETF terminology draft itself expired without standing (version 14, February 2024) [49]. RFC 9454 (August 2023) renamed the OSPF master/slave roles to leader/follower without changing the protocol [50].

**Term table for learner prose.** Replace these in prose, on cards, and in narration. The paragraph after the table covers the case where the platform still prints the old word.

| Avoid | Use | Notes | Source |
|---|---|---|---|
| master/slave (roles) | primary/secondary, primary/replica, leader/follower, controller/device, active/standby (Cisco stacks) | Pick the pair the vendor now uses, if it has one | [45][19][27][53] |
| master (branch) | main, or "the default branch" | Git still defaults to `master` until Git 3.0, which has no release date [51] | [51][19] |
| whitelist/blacklist | allowlist/denylist, or blocklist; "allow list" and "block list" on Cisco small-business gear | Allowlist is a noun only, not a verb | [19][45][53] |
| sanity check | quick check, check for correctness | Inclusive Naming Initiative tier 2 | [18][46] |
| dummy value, dummy file | placeholder, sample, test file | | [18][19] |
| hang, hung | stop responding | | [19][27] |
| kill, abort (in prose) | stop, end, cancel | The command names `kill` and `abort()` stay | [19][46] |
| cripple, crippled | disable, slow down, break | | [18][28][46] |
| blind to, turn a blind eye | ignore, unaware of | | [19] |
| crazy, insane, dumb, lame | unexpected, confusing, or the precise word | | [18][28] |
| guys, you guys | everyone, you, all of you | | [19] |
| man-hours, manpower | person-hours, staff | | [18][27] |
| he, she (generic) | you, they, a role | Rotate names in fictional scenarios | [27][37] |
| native (feature) | built-in | | [19] |
| grandfathered | legacy, exempt | Tier 1; the replacement words are this report's suggestion | [46] |
| STONITH | fencing | | [18] |
| DMZ | perimeter network (Microsoft) | Consider only. Exam objectives and firewall UIs say DMZ, so keep it with a definition | [27] |
| hit (a key) | press | | [19] |

**Commands and output that still use old terms.** Google's rule is to write the neutral term in prose and give the literal name in code font in parentheses on first mention [18]. Cisco documentation states the same exception, for language hardcoded in the product's interfaces [53]. Real cases on current platforms:

- `ip link set dev eth1 master br0`, and the `master` field in `ip link` output. The man page still documents `master`, `bond_slave`, and `bridge_slave` [57].
- The Linux bonding driver prints `Slave Interface:` lines in `/proc/net/bonding/bond0` [57].
- `git init` still creates `master` unless `init.defaultBranch` is set [51].
- Cisco IOS XE still has `ntp master` [54]. Stack roles now read active, standby, and member [53].
- MySQL 8.0.22 and later replaced `SHOW SLAVE STATUS` with `SHOW REPLICA STATUS`, and 8.0.23 added `CHANGE REPLICATION SOURCE TO` [52]. Teach the new form when the baseline supports it.

House rule: never change a command, flag, or output line to avoid a term, since copy accuracy wins. In the sentence around it, use the neutral term and name the literal once: "Attach the interface to the bridge (the option is named `master`)." Later mentions use the neutral word. Narration speaks the keyword only when the learner must type it.

### Q4. Clarity and conciseness beyond the unslop rules

Unslop already covers filler phrases (23), hedging (24), plain words (31), dense sentences (28), active voice (29), and synonym cycling (11). APA and plain-language guidance add these:

- **Anthropomorphism is broader than unslop 32.** Rule 32 targets figurative verbs ("rides along", "the plan holds it"). APA 4.11 and Google add verbs of perception, knowledge, and desire: "sees", "knows", "wants", "tells", "is happy" [35][16]. APA explicitly allows constructions that are widespread and unambiguous ("the data provide evidence", "this section addresses") [35], and the tech equivalents ("the command returns", "the output shows", "the kernel generates") are fine. Proposed addition: extend rule 32's exception text with that list (Section 4).
- **Verb tense consistency.** APA 4.12 wants one tense across adjacent sentences [31]. Google wants present tense for behavior and "will" only for real future events [15]. Lab reveals slip here ("The mount hid the file, so `ls` will show..."). This is new.
- **Pronoun antecedents.** A bare "this" or "it" after a sentence that names two things (a file and its link) forces the reader to guess. APA's clarity sections (4.7-4.11) cover precise reference [31]. This is new.
- **Redundancy and doublets.** Plain-language guidance cuts pairs such as "due and payable" and filler modifiers ("absolutely, actually, completely, really, quite, totally, very") [55]. Unslop 30 covers adverbs in general. Name these specifically in prose-checker.
- **One term, used consistently.** Plain language says to use the same term throughout [55]. This matches unslop 11 but extends it across a whole lab, not one paragraph.
- **Define a term where it is used,** and don't define common words [56]. For labs, the definition goes at the step where the term first appears, not only on a reference card.
- **Minimizers** ("simply", "just", "easy") are both filler and a tone problem for learners who find the step hard [19]. Prose-checker already names "simply". Add the rest.
- **Sentence length.** APA asks for varied length and warns against strings of short sentences [31]. This matches the existing TTS lesson in CLAUDE.md about choppy narration. No change needed.

### Q5. Citation format for research briefs

The current format, `1. <title>, <URL> (accessed YYYY-MM-DD)`, has no author, no publication date, and no version. A later reader can't tell a 2019 blog from current vendor docs. APA 7's reference model has four elements: author, date, title, and source [31]. Its rules that matter here:

- Use the date of last update when the page shows one, "n.d." when it has none, and never the footer copyright year [32].
- Omit the site name when it matches the author [32].
- Give a DOI instead of a URL when one exists [32].
- Don't add a period after the URL, and don't write "Retrieved from" before it [31].
- Put a version in parentheses and a description in square brackets after the title [41].

APA includes a retrieval date only for unarchived works designed to change [38]. **Deviation:** briefs keep an ISO access date on every entry, because vendor docs and man pages change without notice and each brief is pinned to a baseline. Chicago 18 also permits a public archive URL in place of an access date for webpages [43].

**Proposed entry format:**

```
N. Author. (Date or n.d.). *Title* (version or identifier) [description]. Site. URL (accessed YYYY-MM-DD) [confirmed|likely|conflicting]
```

Examples:

```
1. Microsoft. (2025, April 11). *Em dashes, en dashes, hyphens, and minus signs*. Microsoft Writing Style Guide. https://learn.microsoft.com/en-us/style-guide/punctuation/dashes-hyphens/ (accessed 2026-09-23)
2. Google. (n.d.). *Units of measurement*. Google developer documentation style guide. https://developers.google.com/style/units-of-measure (accessed 2026-09-23)
3. Fielding, R., Nottingham, M., & Reschke, J. (Eds.). (2022). *HTTP semantics* (RFC 9110). Internet Engineering Task Force. https://doi.org/10.17487/RFC9110 (accessed 2026-09-23)
4. IESG. (2021, May 11). *IESG statement on inclusive language*. IETF Datatracker. https://datatracker.ietf.org/doc/statement-iesg-iesg-statement-on-inclusive-language-20210511/ (accessed 2026-09-23)
5. GNU coreutils. (n.d.). *truncate(1)* [Manual page]. Ubuntu 24.04 manpages. https://manpages.ubuntu.com/manpages/noble/man1/truncate.1.html (accessed 2026-09-23)   (URL pattern; this report did not fetch it)
6. The kernel development community. (n.d.). *Linux kernel coding style*. The Linux Kernel documentation. https://www.kernel.org/doc/html/latest/process/coding-style.html (accessed 2026-09-23)
7. Git project. (n.d.). *BreakingChanges*. Git documentation. https://git-scm.com/docs/BreakingChanges (accessed 2026-09-23)
8. <username>. (2025, March 2). *<question title>* [Online forum post]. Unix & Linux Stack Exchange. <URL> (accessed 2026-09-23)
```

Rules to add to the researcher's brief format:

- Number the sources and cite a finding with its key, for example `[3]`, or `[3][7]` for several. Numeric keys are shorter than APA author-date in-text citations and fit tables.
- For man pages, cite the baseline distribution's archive (for example `manpages.ubuntu.com/manpages/noble/`) rather than an unversioned mirror, so the source matches the brief's `baseline`.
- For vendor docs, prefer the page version for the baseline release (for example an IOS XE 17.x guide) and put the release in the title's parentheses.
- Titles use sentence case, as APA does; the italics mark stand-alone works [32].
- When a page blocks automated fetching and a fact comes from a search-index excerpt, say so in the entry ("[via search excerpt]").

### Q6. What an APA or Chicago copy editor would flag in the current files

Learner-facing (the worked example and the templates skills copy from):

1. **En dashes in ranges**, on six lines of `linux-filesystem-path.md` (16, 18, 23, 24, 228, 229), for example "5 (en dash) 15 seconds", "Labs 1 (en dash) 2", and "45 (en dash) 90s". APA and Chicago would accept them. They break unslop rule 13 and the house ban, and the worked example is the pattern the skills copy.
2. **Durations without a space.** The repo has about 34 "Ns" forms ("8s", "90s", "Rewatch: inodes (90s)" in house-style.md, the worked example, and skills) against about 17 "N s" forms (house-style's media table, guide-format's "(75 s, optional)"). Every manual consulted puts a space before the unit symbol [3][22].
3. **Title case is inconsistent.** Worked-example video titles are sentence case ("Absolute vs relative paths", "Virtual filesystems", "Octal permissions in 60 seconds"), while `/outline` requires Title Case and guide-format shows "Virtual Filesystems". The briefing is "One tree, everything hangs off it" in the example but "One Tree, Everything Hangs Off It" in the article skill. `## Lab 3: Inodes and links (fully written example)` mixes the two.
4. **Callback by lab number** in learner-facing video text: "This builds on Lab 3's model" (line 166). This breaks the house callback rule.
5. **"vs" without a period** in prose (house-style.md line 29; worked example lines 14 and 73). Chicago and APA write "vs."; Microsoft spells out "versus" in text [29].
6. **Numeral for a small count**: "split into 5 labs plus a capstone" (line 5). It should be "five labs" [2][31].
7. **Unit mismatch**: "Create a 100 MB virtual disk" with `truncate -s 100M`, which makes 100 MiB (104,857,600 bytes) [57].
8. **Symbols in prose**: "Goal + hint", "Pre-check + Briefing", "Fading + expertise reversal", and "the `/bin` (arrow) `/usr/bin` merge" (line 93). Unslop 33 applies to outline copy.
9. **Slash for "or"**: "a predict/try step" (line 24), "user/group/other" (line 156).
10. **Italics for emphasis**: "*after*", "*why*", "*before*", "*where to click or what to type*", "*directory*", "*path*". APA 6.22 forbids this [31].
11. **Quotation punctuation**: commas outside quotation marks ("one tree", "names point to inodes"). APA 6.7 and Chicago 6.9 would move them inside. The recommended house rule (logical punctuation) keeps them, but the rule needs writing down so reviewers stop flagging it.
12. **UI labels in quotes**: guide-format says learners click "Reconnect", and the capstone has a "Stuck?" button. Google puts UI labels in bold [58].
13. **Ellipsis character in templates**: the closing paragraph template ends with a Unicode ellipsis character after "lab" (guide-format.md line 60). A drafting agent may copy it literally.
14. **Title-colon capitalization**: "Learning Path: The Linux Filesystem (lab-first redesign)" puts sentence case in a Title Case title.
15. **Lowercase lead-ins against capitalized lists**: several lists mix fragments with and without periods (Media types, lines 23-26). Google and Microsoft want one consistent pattern per list [10][25].

Internal files (not learner prose, but skills copy their wording into output):

16. **Em dashes**: about 20 in CLAUDE.md, about 12 in `labdrop/SKILL.md` (whose slides become on-screen text), and one in `closeout/SKILL.md` line 72.
17. **Unslop rule 13's wording** says "no parentheses", yet house templates rely on parentheses ("Video (75 s, optional)", "(2:30)"). An editor would read this as a contradiction. It should read "no parentheses as a replacement for an em dash".
18. **"Sanity-check"** in `closeout/SKILL.md` line 50. It is internal, but it is the only non-inclusive term found in the repo.
19. **`/home/student`** in the worked example (line 65) against the platform-profile default user `labuser`. This is a consistency issue rather than a style one, but a copy editor checking names would catch it.

The repo is otherwise clean on inclusive terms: a word-bounded search found no master, slave, whitelist, blacklist, dummy, cripple, blind, or "guys" in `.claude/`, CLAUDE.md, or the worked example. "hangs off it" is a spatial metaphor, not the "stop responding" sense.

## 4. Recommendations mapped to files

Proposal: add one `## Mechanics` section to `.claude/house-style.md` holding the style sheet (Section 2) as numbered rules M1-Mn, so a rule changes in one place. prose-checker then cites `M<n>` beside unslop rule numbers. Unslop stays focused on AI tells.

| Rule | Target file | Status | Proposed wording |
|---|---|---|---|
| Base manual and fallback order | house-style.md (new "Mechanics" intro) | New | "Mechanics follow the Google developer documentation style guide, then Merriam-Webster (spelling), Chicago (nontechnical), and Microsoft (technical). APA 7 governs bias-free language and brief references. The rules below override all of them." |
| Style sheet M1-Mn | house-style.md | New | Paste Section 2's tables. |
| No en dashes; ranges use "to" in prose and a hyphen in labels | house-style.md; unslop 13 | Already covered (the ban). **Conflicts with APA, Chicago, and Microsoft**, which use en dashes for ranges; the house rule wins | "Ranges: '30 to 90 seconds' in sentences; '30-90 s' in labels and tables. Never 'from 30-90' or 'between 30-90'." |
| Parentheses in unslop 13 | unslop/SKILL.md rule 13 | **Conflicts with current house practice** (templates use parentheses) | Change "(no parentheses, no en dashes, no hyphen-as-dash substitutes)" to "(no en dashes, no spaced hyphens, and no parentheses wrapped around a clause the em dash used to set off)". |
| Space before unit symbols; "90 s" | house-style.md; guide-format.md; outline and scripts label formats | **Conflicts with current usage** ("8s", "90s", "Rewatch: inodes (90s)" in house-style "Lab-first design") | "Write a space between a number and its unit symbol: `(8 s)`, `(90 s)`, `2 GB`. Videos of 60 s or more use m:ss: `(2:30)`." Update the capstone example to "Rewatch: inodes (90 s)". |
| Title Case scheme | house-style.md; unslop "Course content" rule 17 exception; outline/SKILL.md line 233; guide-format.md line 211 | New (the scheme is undefined). **Conflicts with the worked example's sentence-case video titles** | "Title Case: capitalize the first and last word and all others except a, an, the; and, but, or, nor, yet, so; prepositions of four or fewer letters. Write 'vs.' in lowercase. A title keeps one form everywhere it appears." |
| Sentence-case headings | unslop 17 | Already covered. Conflicts with APA 2.27 (title case), which the house does not follow | No change. Add "(Google and Microsoft style; APA's title-case headings do not apply)". |
| Contractions allowed | house-style.md | Already practiced, not written down. Conflicts with APA 4.4-4.11 | "Use common contractions (don't, it's, you're). No noun-plus-verb contractions (the file's gone) and no it'll or there'd." |
| Logical punctuation with quotes | house-style.md; prose-checker | Already practiced. **Conflicts with APA 6.7 and Chicago 6.9** | "Put a period or comma inside quotation marks only when it belongs to the quoted text. Literal strings go in code font instead of quotes." |
| UI labels in bold | guide-format.md "One portal tab per device" and elsewhere | **Conflicts with current wording** (clicks "Reconnect" in quotes) | "Portal and UI labels are bold and match the UI: click **Reconnect**." |
| Numbers: zero to nine in words, numerals for units and durations | house-style.md | New. Deviates from Microsoft for durations | "Words for zero through nine in prose; numerals for 10 and above, and always for units, durations, sizes, versions, ports, modes, percentages, and step numbers. Narration is exempt." |
| MiB versus MB | house-style.md; researcher (lab mode, "Verified facts per step") | New | "State the unit the tool uses: GNU size suffixes K, M, G are powers of 1024 (KiB, MiB, GiB); KB, MB, GB are powers of 1000." |
| Italics not for emphasis | house-style.md; prose-checker | New. **Conflicts with the worked example** | "No bold or italics for emphasis in prose. Italicize a term only where it is defined. Bold is for UI labels, media labels, and term-list leads." |
| Latin abbreviations | house-style.md; prose-checker | New for learner prose. Internal docs unaffected | "In learner prose write 'for example', 'such as', 'that is', and 'versus'. No 'e.g.', 'i.e.', 'etc.', or 'vs' in sentences." |
| Symbols and slashes in prose | unslop 33 (Course content note) | Partly covered (arrows, in articles). Extend to outline and lab prose | "Spell out +, arrows, and slash-for-or in sentences ('goal plus hint', 'predict or try'). Paths, protocol names, and code keep their slashes." |
| Code names: no possessive, no verbing, no lowercase sentence start | house-style.md; prose-checker; lab-review step 6 | New | "Don't make a code item possessive or a verb ('`ls` output', not '`ls`'s output'; 'search with `grep`', not '`grep` it'). Rewrite a sentence that would start with a lowercase command." |
| Inclusive terms table | house-style.md (new "Inclusive language"); prose-checker; lab-review grep | New | Paste the Q3 term table. Add to the lab-review grep: `grep -niwE 'master\|slave\|whitelist\|blacklist\|sanity\|dummy\|hangs?\|cripple[sd]?\|guys\|blind to'` over learner pages, ignoring code blocks. |
| Vendor keywords that keep old terms | guide-format.md "House rules"; house-style.md | New | "Never alter a command or its output to avoid a term. In the sentence around it, use the neutral term and name the literal once in code font: 'Attach the interface to the bridge (the option is named `master`).'" |
| Anthropomorphism | unslop 32 (Course content exception) | Partly covered. Extends rule 32 | "Rule 32 also covers software that sees, knows, wants, tells, or thinks. Function verbs are fine: returns, prints, shows, detects, generates." |
| Tense and antecedents | unslop "Course content" or house-style Mechanics | New | "Present tense for how the system behaves; 'will' only for a later event. After a sentence that names two things, give 'this' a noun." |
| Minimizers | prose-checker "What to flag"; lab-review grep | Partly covered ("simply") | Add "just", "easy", "easily", "obviously", "of course" to the list and to the lab-review grep. |
| IT word choices | house-style.md Mechanics | New | "run (not execute), stop responding (not hang), stop or end (not kill or abort, except the command names), press (not hit) a key, the following (not below)." |
| House word list | house-style.md | New. **Conflicts with the APA 6.12 and Google prefix rule** for pre-check and pre-seeded (deliberate) | "pre-check, pre-seeded, micro-video, filename, command line (noun) and command-line (modifier), set up (verb) and setup (noun), log in (verb) and login (noun)." |
| Mechanics checks in review | prose-checker.md | New | Under "What to flag", add: "house mechanics M1-Mn (ranges, unit spacing, number words, title case, UI bold, code possessives, inclusive terms). Cite as `M<n>`. Never flag code, commands, or shown output." |
| Source entry format | researcher.md "Brief format" and "Cite everything" | **Conflicts with the current `1. <title>, <URL> (accessed ...)` format** | Replace the Sources template with the Q5 entry format. Add: "Cite findings with numeric keys `[n]`. Cite man pages from the baseline distribution's archive. Mark search-excerpt sources." |
| Dates | guide-format.md index.md table; house-style Mechanics | New | "Dates in tables and frontmatter are ISO (2026-09-23); in prose, September 23, 2026." |
| Ellipsis in the closing template | guide-format.md line 60 | New | Show the full closing sentence, or end the template with "(then name the skills and where they apply)" instead of the ellipsis character. |
| Worked example cleanup | linux-filesystem-path.md | **Conflicts** with unslop 13, the callback rule, and the new rules | Replace en dashes with hyphens or "to"; write "8 s" and "90 s"; Title Case all media titles; change "Lab 3's model" to "the names-and-inodes model from the links lab"; "five labs"; "100 MiB"; spell out "+" and arrows; "vs." or "versus"; drop emphasis italics; `/home/labuser`. |
| Em dashes in internal skills | CLAUDE.md; labdrop/SKILL.md; closeout/SKILL.md | **Conflicts with the house em-dash ban** as applied to text that reaches the screen | Replace them with periods or commas, starting with labdrop, whose slide wording becomes on-screen text. |
| "Sanity-check" | closeout/SKILL.md line 50 | Conflicts with the new inclusive-terms rule (internal) | "Check the count against..." |

## 5. Sources

All accessed 2026-09-23. The apastyle.apa.org HTML pages block automated fetching (Incapsula). APA content was taken from APA's own PDF handouts [31][32][33], from the two pages that loaded [34][35], and from search-index excerpts of APA pages, marked "(search excerpt)".

1. Google. (n.d.). *Google developer documentation style guide* (reference hierarchy). https://developers.google.com/style
2. Google. (n.d.). *Numbers*. https://developers.google.com/style/numbers
3. Google. (n.d.). *Units of measurement*. https://developers.google.com/style/units-of-measure
4. Google. (n.d.). *Dashes*. https://developers.google.com/style/dashes
5. Google. (n.d.). *Commas*. https://developers.google.com/style/commas
6. Google. (n.d.). *Hyphens*. https://developers.google.com/style/hyphens
7. Google. (n.d.). *Capitalization*. https://developers.google.com/style/capitalization
8. Google. (n.d.). *Headings and titles*. https://developers.google.com/style/headings
9. Google. (n.d.). *Abbreviations*. https://developers.google.com/style/abbreviations
10. Google. (n.d.). *Lists*. https://developers.google.com/style/lists
11. Google. (n.d.). *Code in text*. https://developers.google.com/style/code-in-text
12. Google. (n.d.). *Quotation marks*. https://developers.google.com/style/quotation-marks
13. Google. (n.d.). *Contractions*. https://developers.google.com/style/contractions
14. Google. (n.d.). *Dates and times*. https://developers.google.com/style/dates-times
15. Google. (n.d.). *Verb tense*. https://developers.google.com/style/tense
16. Google. (n.d.). *Anthropomorphism*. https://developers.google.com/style/anthropomorphism
17. Google. (n.d.). *Possessives*. https://developers.google.com/style/possessives
18. Google. (n.d.). *Write inclusive documentation*. https://developers.google.com/style/inclusive-documentation
19. Google. (n.d.). *Word list*. https://developers.google.com/style/word-list
20. Microsoft. (2022, May 13). *Numbers*. Microsoft Writing Style Guide. https://learn.microsoft.com/en-us/style-guide/numbers
21. Microsoft. (2025, April 11). *Em dashes, en dashes, hyphens, and minus signs*. https://learn.microsoft.com/en-us/style-guide/punctuation/dashes-hyphens/
22. Microsoft. (2024, November 26). *Units of measure terms*. https://learn.microsoft.com/en-us/style-guide/a-z-word-list-term-collections/term-collections/units-of-measure-terms
23. Microsoft. (2024, August 26). *Capitalization*. https://learn.microsoft.com/en-us/style-guide/capitalization
24. Microsoft. (2024, August 26). *Acronyms*. https://learn.microsoft.com/en-us/style-guide/acronyms
25. Microsoft. (2023, June 14). *Lists*. https://learn.microsoft.com/en-us/style-guide/scannable-content/lists
26. Microsoft. (2019, August 23). *Use contractions*. https://learn.microsoft.com/en-us/style-guide/word-choice/use-contractions
27. Microsoft. (2024, April 18). *Bias-free communication*. https://learn.microsoft.com/en-us/style-guide/bias-free-communication
28. Microsoft. (2025, June 27). *Accessibility terms*. https://learn.microsoft.com/en-us/style-guide/a-z-word-list-term-collections/term-collections/accessibility-terms
29. Microsoft. (2018, January 19). *versus, vs.* https://learn.microsoft.com/en-us/style-guide/a-z-word-list-term-collections/v/versus-vs
30. Microsoft. (2023, May 10). *Keys and keyboard shortcuts*. https://learn.microsoft.com/en-us/style-guide/a-z-word-list-term-collections/term-collections/keys-keyboard-shortcuts
31. American Psychological Association. (2021). *Publication Manual, 7th edition student paper checklist* [Handout; section numbers for Chapters 2, 4, 5, 6, 9, 10]. https://apastyle.apa.org/instructional-aids/publication-manual-formatting-checklist.pdf
32. American Psychological Association. (2022). *Creating an APA Style reference list guide* [Handout]. https://apastyle.apa.org/instructional-aids/creating-reference-list.pdf
33. American Psychological Association. (2025). *Brief guide to bias-free and inclusive language* [Handout]. https://apastyle.apa.org/instructional-aids/inclusive-language.pdf
34. American Psychological Association. (n.d.). *Serial comma*. https://apastyle.apa.org/style-grammar-guidelines/punctuation/serial-comma
35. American Psychological Association. (n.d.). *Anthropomorphism*. https://apastyle.apa.org/style-grammar-guidelines/grammar/anthropomorphism
36. American Psychological Association. (n.d.). *Numbers expressed in numerals* (search excerpt). https://apastyle.apa.org/style-grammar-guidelines/numbers/numerals
37. American Psychological Association. (n.d.). *Singular "they"* and *Gender* (search excerpt). https://apastyle.apa.org/style-grammar-guidelines/grammar/singular-they ; https://apastyle.apa.org/style-grammar-guidelines/bias-free-language/gender
38. American Psychological Association. (n.d.). *When do you include a retrieval date in a citation?* (search excerpt). https://apastyle.apa.org/learn/faqs/when-include-retrieval-date
39. American Psychological Association. (n.d.). *Disability* and *General principles for reducing bias* (search excerpt). https://apastyle.apa.org/style-grammar-guidelines/bias-free-language/disability ; https://apastyle.apa.org/style-grammar-guidelines/bias-free-language/general-principles
40. American Psychological Association. (n.d.). *Bulleted lists*, *Numbered lists*, *Lettered lists* (search excerpt). https://apastyle.apa.org/style-grammar-guidelines/lists
41. American Psychological Association. (n.d.). *Using parentheses and brackets in APA Style references* (search excerpt). https://apastyle.apa.org/blog/parentheses-brackets
42. American Psychological Association. (n.d.). *Hyphenation principles* and *Punctuation* (search excerpt). https://apastyle.apa.org/style-grammar-guidelines/spelling-hyphenation/hyphenation
43. The Chicago Manual of Style Online and CMOS Shop Talk (University of Chicago Press): *En dashes, the editor's mark* (2020), https://cmosshoptalk.com/2020/06/09/en-dashes-the-editors-mark/ ; *Commas and periods with quotation marks* (2020, cites CMOS 6.9, 6.10, 7.84), https://cmosshoptalk.com/2020/10/20/commas-and-periods-with-quotation-marks/ ; *I.e., e.g., etc.* (2023, CMOS 6.54, 10.4), https://cmosshoptalk.com/2023/04/11/i-e-e-g-etc/ ; *Section 7.85 in the spotlight* (2016), https://cmosshoptalk.com/2016/08/09/section-7-85-in-the-spotlight/ ; Q&A on numbers and en dashes (CMOS 18), https://www.chicagomanualofstyle.org/qanda/data/faq/topics/HyphensEnDashesEmDashes/faq0070.html ; *Chicago Style Workout 77: Numerals* (rules 9.2 and 9.3, search excerpt), https://cmosshoptalk.com/2023/06/27/chicago-style-workout-77-numerals/ ; Q&A on singular they (CMOS 18, search excerpt), https://www.chicagomanualofstyle.org/qanda/data/faq/topics/Pronouns/faq0031.html ; What's new in CMOS 18, https://www.chicagomanualofstyle.org/help-tools/what-s-new.html
44. AP Stylebook rules as summarized by university writing centers (secondary; apstylebook.com is paywalled): Boston University, https://www.bu.edu/com/files/2019/04/WC_apstyle.pdf ; Northern Illinois University, https://web.news.niu.edu/2019/02/25/numbers-in-ap-style/
45. The kernel development community. (n.d.). *Linux kernel coding style* (Section 4, Naming). https://www.kernel.org/doc/html/latest/process/coding-style.html
46. Inclusive Naming Initiative. (n.d.). *Word lists*. https://inclusivenaming.org/word-lists/
47. IESG. (2021, May 11). *IESG statement on inclusive language*. https://datatracker.ietf.org/doc/statement-iesg-iesg-statement-on-inclusive-language-20210511/
48. National Institute of Standards and Technology. (2021). *Guidance for NIST staff on using inclusive language in documentary standards* (NISTIR 8366). https://www.nist.gov/node/1660111
49. *Terminology, power, and inclusive language in Internet-Drafts and RFCs* (draft-knodel-terminology-14) [Expired Internet-Draft]. (2024, February 25). IETF Datatracker. https://datatracker.ietf.org/doc/draft-knodel-terminology/
50. RFC Editor. (2023). *Update to OSPF terminology* (RFC 9454). https://www.rfc-editor.org/rfc/rfc9454.html
51. Git project. (n.d.). *BreakingChanges*. https://git-scm.com/docs/BreakingChanges ; GitHub. (2020). *Highlights from Git 2.28*. https://github.blog/open-source/git/highlights-from-git-2-28/
52. Oracle. (n.d.). *SHOW REPLICA STATUS statement* (MySQL 8.0 Reference Manual). https://dev.mysql.com/doc/refman/8.0/en/show-replica-status.html
53. Cisco. (n.d.). *Cisco Business: Glossary of new terms* and the Cisco documentation bias-free language statement. https://www.cisco.com/c/en/us/support/docs/smb/switches/Cisco-Business-Switching/kmgmt-2331-glossary-of-non-bias-language.html
54. Cisco. (n.d.). *System management configuration guide, Cisco IOS XE 17.x: Network Time Protocol* (`ntp master`). https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/syst-mgmt/b-system-management/m_bsm-time-calendar-set.html
55. Digital.gov. (n.d.). *Write short and simple* and *Principles of plain language* (carried forward from the retired PlainLanguage.gov). https://digital.gov/guides/plain-language/principles/short-simple ; https://digital.gov/guides/plain-language/principles
56. Digital.gov. (n.d.). *Avoid jargon*. https://digital.gov/guides/plain-language/principles/avoid-jargon ; context: Center for Plain Language, *The Federal Plain Language Guidelines are missing*, https://centerforplainlanguage.org/the-federal-plain-language-guidelines-are-missing/
57. *truncate(1)* [Manual page], GNU coreutils, via man7.org. https://man7.org/linux/man-pages/man1/truncate.1.html ; *ip-link(8)*, iproute2, https://man7.org/linux/man-pages/man8/ip-link.8.html ; *Linux Ethernet bonding driver HOWTO*, https://docs.kernel.org/networking/bonding.html ; RFC Editor, *RFC 9110: HTTP semantics*, https://www.rfc-editor.org/info/rfc9110/
58. Google. (n.d.). *UI elements and interaction*. https://developers.google.com/style/ui-elements
