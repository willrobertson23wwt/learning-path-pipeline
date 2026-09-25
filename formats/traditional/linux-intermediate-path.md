<!--
  Worked example of a traditional learning path: the approved outline of
  Linux Intermediate (finished and posted), copied from its course repo
  (courses/linux-intermediate/outline.md) on 2026-09-25. Reference only:
  /outline follows its shape (modules, globally numbered videos with 2-4
  chapters, key points and visual moments, a closing lab per module), not
  its content.

  Where it predates the current rules (don't copy these):
  - chapter folders are unpadded, `li-v6-ch1`, whatever its frontmatter
    comment says;
  - some callbacks name a video or module number ("video 25's rule"); they
    now name the concept;
  - chapter titles are sentence case; they're Title Case now (they print on
    the title card);
  - labs are listed by title only; new outlines add `- **Goal:**` and
    `- **Modules:**` lines under each `**Lab:**`;
  - chapter lengths read "(~N s)"; new outlines say "(~N s narration)";
  - it ends on its last topic video with a capstone note; the house style
    now wants a final "putting it together" capstone video.
-->

---
slug: linux-intermediate
prefix: li        # chapter folders li-vNN-chM, composition IDs LiV<N>Ch<M>
title: Linux Intermediate
audience: Learners who completed a Linux fundamentals course and can navigate
  the shell, edit files, and manage packages; comfortable in a terminal.
status: approved  # Full outline (modules 1-5) approved 2026-07-07; module 1 produced
---

# Linux Intermediate

Source: `Intermediate_Learning_Path_Outline.pdf` (Mac_Vault/Linux Intermediate,
transcribed 2026-07-07). Videos are numbered globally (video NN drives the
`scripts/NN-*/` folders and `li-vNN-chM` audio folders); each module closes
with a hands-on lab, which is authored separately (not a pipeline video).

## Course goal

Learners move beyond single commands and basic scripts to running real
systems: they can build robust, schedulable automation, diagnose network and
performance problems methodically, shape service behavior with systemd, and
manage storage and mandatory access control on production Linux hosts.

Module 1 is fully produced (videos 1-5). Modules 2-5 are approved and ready for
scripting (`/scripts linux-intermediate <video>`). Callbacks and forward
references stay WITHIN this course; the running example shifts per module (the
log-rotation script for Module 1, then per-module diagnostic and administration
scenarios).

## Module 1 - Advanced Shell Scripting

### 1. Functions and Return Values (4-6 min)
- **Description:** Structure a growing bash script into reusable functions,
  keep variables from leaking with local, and send status and data back out
  the right way.
- **Goal:** Structure a growing script into named, reusable functions and get
  data out of them the right way.

#### 1.1 From repeated blocks to functions (~90 s)
- **Key points:** The same five lines pasted three times is a maintenance bug
  waiting to happen; `name() { ... }` defines, bare `name` calls; functions
  must be defined before use. Introduces cleanup.sh, the running example this
  module grows into the lab's log rotation tool.
- **Visual moments:** cleanup.sh with three highlighted duplicate blocks that
  collapse into one `log_msg()` function; call sites light up in sequence.

#### 1.2 Arguments and local variables (~110 s)
- **Key points:** Inside a function `$1 $2 $#` are the FUNCTION's arguments,
  not the script's; `local` keeps variables from leaking; a global name
  collision shown failing without `local`, fixed with it.
- **Visual moments:** Split view, script-level `$1` vs function-level `$1`
  each highlighted with its own caller; ✗/✓ contrast where a loop counter
  clobbers a global until `local i` fixes it.

#### 1.3 Return values done right (~110 s)
- **Key points:** `return` sends an exit STATUS (0-255), not data; test it
  with `$?` or directly in `if my_func`; real data comes back via `echo` +
  command substitution `result=$(my_func)`; the classic `return 42`-for-data
  mistake and why it breaks past 255.
- **Visual moments:** Two lanes labeled "status" and "data": status lane shows
  `if check_disk; then`, data lane shows `size=$(get_size /var)`; a ✗ beat
  where `return 300` wraps around to 44.

### 2. Arrays and Parameter Expansion (4-6 min)
- **Description:** Hold file lists safely in bash arrays, quote them so a
  filename with a space never breaks a loop, and reshape strings in-shell
  with parameter expansion.
- **Goal:** Hold lists safely in arrays and reshape strings with built-in
  expansion instead of extra processes.

#### 2.1 Indexed arrays (~100 s)
- **Key points:** `files=(/var/log/*.log)` builds a list; `${files[0]}`,
  `${#files[@]}` count, append with `+=`; loop with
  `for f in "${files[@]}"`.
- **Visual moments:** Array visualized as indexed slots filling from a glob;
  the count badge updates as `+=` appends.

#### 2.2 Quote your arrays (~90 s)
- **Key points:** `"${files[@]}"` keeps each element intact; unquoted arrays
  word-split on spaces; a filename with a space breaks the unquoted loop.
- **Visual moments:** ✗/✓ contrast: `archive 2024 report.log` splitting into
  two bogus items, then the quoted version holding one element together.

#### 2.3 The parameter expansion toolkit (~120 s)
- **Key points:** `${var:-default}` fallbacks, `${var%.log}` strip suffix,
  `${var##*/}` strip path (basename without a subprocess),
  `${var/old/new}` replace; these run in-shell, no `sed`/`basename` fork.
- **Visual moments:** Reference-card grid, one card per expansion, each row
  lighting with input → output; closing pill "no subprocess needed".

### 3. Defensive Scripting: traps and getopts (4-6 min)
- **Description:** Make scripts clean up after themselves with trap, parse
  real command-line options with getopts, and fail like a professional tool
  with usage messages and meaningful exit codes.
- **Goal:** Make scripts clean up after themselves and take options like real
  command-line tools.

#### 3.1 Clean up with trap (~110 s)
- **Key points:** Interrupted scripts leave temp files and half-done work;
  `trap 'rm -f "$TMP"' EXIT` always runs, even on Ctrl-C or `set -e` failure;
  EXIT vs INT/TERM.
- **Visual moments:** Script killed mid-run, orphaned `/tmp` files stack up
  ✗; rerun with the trap line highlighted, files sweep away on the same
  interrupt ✓.

#### 3.2 Real options with getopts (~120 s)
- **Key points:** Hand-rolled `$1` flag checks don't scale;
  `while getopts "vo:" opt` + `case`, `OPTARG` for values,
  `shift $((OPTIND-1))` to reach positional args.
- **Visual moments:** Command line `./rotate.sh -v -o /backup logs` with each
  token flowing into the matching `case` branch; `OPTARG` catches `/backup`.

#### 3.3 Fail like a professional tool (~90 s)
- **Key points:** A `usage()` function (functions callback) printing to
  `>&2`; meaningful distinct exit codes so OTHER scripts can react; ties into
  the status-vs-data rule from video 1.
- **Visual moments:** Bad invocation → clean usage block on stderr; small
  exit-code table (0 ok, 1 usage, 2 missing dir) with a caller checking `$?`.

### 4. Debugging Scripts with set -x and shellcheck (4-6 min)
- **Description:** Trace a misbehaving script with set -x to see what bash
  actually ran, catch bugs before they run with shellcheck, and turn both
  into a repeatable debugging workflow.
- **Goal:** Diagnose a misbehaving script with tracing and catch bugs before
  they run with a linter.

#### 4.1 Watch it run with set -x (~110 s)
- **Key points:** `set -x` prints each command AFTER expansion, so you see
  what bash actually ran; wrap just the suspect section with `set -x` /
  `set +x`; richer `PS4='+${LINENO}: '` adds line numbers.
- **Visual moments:** A failing script, then the trace with the expanded
  (empty!) variable highlighted as the smoking gun; PS4 line numbers appear.

#### 4.2 Lint it with shellcheck (~100 s)
- **Key points:** shellcheck reads the script without running it; each finding
  has an SC code you can look up; the unquoted-variable warning it flags is
  the exact bug from the last chapter.
- **Visual moments:** Editor gutter fills with warnings; one SC2086 expands
  into its explanation; warnings tick out as fixes land, exit clean.

#### 4.3 A repeatable debugging workflow (~80 s)
- **Key points:** Reproduce, isolate with set -x, fix, re-run, then lint every
  script before it ships; shellcheck belongs in your editor or pre-commit
  habit, not just emergencies.
- **Visual moments:** Four-step strip (Reproduce → Trace → Fix → Lint) ticking
  green; closing pill "lint before it breaks".

### 5. Scheduling with cron and systemd Timers (4-6 min)
- **Description:** Run scripts automatically with cron's five time fields,
  sidestep its stripped-down environment, build a systemd timer pair, and
  choose the right scheduler for each job.
- **Goal:** Run scripts automatically on a schedule and pick the right
  scheduler for the job.

#### 5.1 cron essentials (~120 s)
- **Key points:** `crontab -e` per user; the five time fields; cron's sparse
  environment (PATH!) is the classic "works in my shell, fails in cron" bug;
  capture output with a redirect since there is no terminal.
- **Visual moments:** A crontab entry with each field labeled on beat; ✗ beat
  where the job fails on PATH, fixed by an absolute path; output redirect
  appended.

#### 5.2 systemd timers (~120 s)
- **Key points:** A `.timer` activates a matching `.service`;
  `OnCalendar=daily` syntax; `systemctl list-timers` shows last/next run;
  `Persistent=true` catches up runs missed while powered off, which cron
  never does.
- **Visual moments:** service and timer unit files side by side with an arrow
  pairing them; `list-timers` table with NEXT/LAST columns; a powered-off
  gap on a timeline that Persistent backfills.

#### 5.3 Choosing your scheduler, and the lab (~80 s)
- **Key points:** cron for quick per-user jobs, timers for system services
  that need logging, dependencies, and catch-up; forward reference: systemd
  units get their own module later; hand-off to the lab where the module's
  script gets scheduled.
- **Visual moments:** Two-column comparison card; closing lab pill "Log
  Rotation Tool: build it, harden it, schedule it".

**Lab:** Log Rotation Tool

## Module 2 - Networking in Depth

### 6. Addressing and Subnetting (4-6 min)
- **Description:** Read any IPv4 address and CIDR prefix on sight, work out
  networks, ranges, and broadcast addresses, and see how a host decides
  which traffic stays local.
- **Goal:** Read any IP address and prefix and know exactly which hosts are on
  the local network and which are not.

#### 6.1 Addresses and prefixes (~110 s)
- **Key points:** An IPv4 address is 32 bits split into a network part and a
  host part; `/24` CIDR notation says where the split is; the same address
  with a different prefix means a different network; private ranges
  (10.x, 172.16-31.x, 192.168.x) are where lab and office networks live.
- **Visual moments:** `192.168.10.42/24` rendered as 32 bit-cells, a slider at
  bit 24 splitting network (cyan) from host (green); the slider drags to /16
  and the coloring re-splits to show the network change.

#### 6.2 Subnet math you can do on sight (~120 s)
- **Key points:** Network address (host bits all 0) and broadcast (all 1);
  usable range is what's between; each bit borrowed halves the hosts; the
  practical question "are these two hosts on the same subnet?" decided by
  comparing network parts; mismatched subnet assumptions are a classic
  "can ping some things, not others" failure.
- **Visual moments:** A /26 worked example: network, first host, last host,
  broadcast rows filling a card; ✗/✓ beat where 192.168.10.42/26 and
  192.168.10.100/26 land in different color-coded quarter blocks of the /24.

#### 6.3 Why subnetting matters on a real host (~80 s)
- **Key points:** A host decides local-vs-remote per packet using its own
  address + prefix: local goes direct via ARP, remote goes to the gateway;
  a wrong prefix on an interface silently misroutes traffic; forward
  reference: routing tables get the next video pair.
- **Visual moments:** Two-lane decision diagram, packet hits the "same
  network?" diamond and flows to "ARP direct" or "send to gateway"; a
  wrong-prefix ✗ beat where a reachable host is misjudged as remote.

### 7. The ip Suite: interfaces and addresses (4-6 min)
- **Description:** Inspect and change interfaces and addresses with the
  modern ip command, make changes survive a reboot, and retire ifconfig
  with a legacy-to-ip mapping.
- **Goal:** Inspect and configure interfaces and addresses with the modern ip
  command instead of the deprecated ifconfig.

#### 7.1 Reading ip addr (~110 s)
- **Key points:** `ip addr show` is the first command on any network problem;
  reading one interface block: name, state UP/DOWN, MAC, `inet` line with
  CIDR prefix (the subnetting payoff); lo vs real NICs; `ip -br addr` for the
  compact view.
- **Visual moments:** A real `ip addr` block with each part annotated on beat
  (state chip, MAC, inet + prefix highlighted); the `-br` variant slides in
  beneath as the "daily driver" three-column view.

#### 7.2 Changing addresses, and making them stick (~120 s)
- **Key points:** `ip addr add 192.168.10.5/24 dev eth0` and `ip link set
  eth0 up` for immediate change; everything done with ip alone vanishes on
  reboot; persistent config belongs to the distro's network manager
  (nmcli / netplan); the runtime-vs-persistent split is the classic gotcha.
- **Visual moments:** Terminal type-on adds the address, a green "live now"
  chip; a reboot sweep wipes it ✗; the persistent-config card reapplies it
  with a "survives reboot" ✓ chip.

#### 7.3 ifconfig is gone, and the lab ahead (~70 s)
- **Key points:** ifconfig/route/netstat are legacy net-tools, unmaintained
  and often not installed; the ip suite replaces them all (`ip addr`,
  `ip route`, `ip neigh`); mapping card for muscle-memory conversion;
  hand-off: the module lab breaks a host's addressing on purpose.
- **Visual moments:** Old-vs-new mapping table, each legacy command fading
  out as its ip replacement lights; closing pill "one suite, ip".

### 8. Routing and the Default Gateway (4-6 min)
- **Description:** Read the routing table the way the kernel does, fix the
  classic missing-default-gateway failure, and trace a packet's path hop by
  hop to see whose problem it is.
- **Goal:** Read a routing table, understand how a packet picks its route, and
  fix a missing or wrong default gateway.

#### 8.1 Reading the routing table (~110 s)
- **Key points:** `ip route show`: the `default via` line, connected-network
  routes that appear automatically with an address, longest-prefix match
  decides; every packet consults this table, every time.
- **Visual moments:** Three-row routing table; a packet chip for
  10.0.0.7 tests each row, specific /24 route lights and wins over default;
  a second packet for 8.8.8.8 falls through to `default via`.

#### 8.2 When the gateway is wrong (~110 s)
- **Key points:** No default route means local traffic works and everything
  else fails, the signature "LAN fine, internet dead" pattern; `ip route add
  default via ...`; the gateway must itself be on a connected network;
  runtime-vs-persistent applies here too (video 7 callback).
- **Visual moments:** ✗ beat: ping to the LAN succeeds while ping to an
  outside address dies at a missing default row (the empty slot highlighted);
  the `ip route add` line types on and the outside ping goes green ✓.

#### 8.3 Tracing the path (~90 s)
- **Key points:** `traceroute` (or `tracepath`) shows each hop a packet takes;
  where the trace stops tells you whose problem it is: first hop = your
  gateway, beyond = upstream; a systematic out-from-the-host method: local
  addr → gateway → beyond (this becomes the lab's diagnosis flow).
- **Visual moments:** Hop-by-hop path builds left to right (host → gateway →
  ISP → destination), each hop ticking green; a ✗ variant where hops go dark
  after the gateway, an "upstream problem" tag landing on the break.

### 9. DNS Resolution and /etc/resolv.conf (4-6 min)
- **Description:** Follow a name lookup from application to resolver to
  nameserver, interrogate DNS with dig, and split "pings by IP but not by
  name" problems in half with one test.
- **Goal:** Follow a name lookup end to end and diagnose "it pings by IP but
  not by name" failures.

#### 9.1 How a name becomes an address (~110 s)
- **Key points:** Apps ask the resolver, not DNS directly; lookup order:
  /etc/hosts first, then the nameservers in /etc/resolv.conf (say it
  phonetically once, show it on screen); on systemd distros resolv.conf is
  often a stub managed by systemd-resolved; edit the manager's config, not
  the symlink.
- **Visual moments:** Pipeline diagram app → resolver → /etc/hosts →
  nameserver, a query chip traveling it; the resolv.conf panel shows
  `nameserver 192.168.10.1` with a "managed stub" badge beat.

#### 9.2 Interrogating DNS with dig (~120 s)
- **Key points:** `dig example.com` anatomy: ANSWER section, TTL, which
  server answered; `dig @8.8.8.8` to bypass the local resolver and split the
  problem in half (local resolver vs the record itself); `+short` for
  scripts (module 1 callback); NXDOMAIN vs no answer vs timeout mean
  different failures.
- **Visual moments:** A dig output panel with ANSWER row, TTL, and SERVER
  footer annotated on beat; a two-lane contrast where local dig fails ✗ but
  `@8.8.8.8` answers ✓, an arrow pinning the fault on the local resolver.

#### 9.3 The name-vs-IP split test (~80 s)
- **Key points:** Ping the IP, then ping the name: IP works + name fails =
  DNS problem, both fail = routing problem (video 8 callback); this single
  split is the fastest triage move in networking; hand-off to the lab's
  broken-path scenario.
- **Visual moments:** Decision card: two ping rows feed a diamond routing to
  "fix DNS" or "fix routing" branches; closing pill "split the problem in
  half".

### 10. Inspecting Connections with ss (4-6 min)
- **Description:** See exactly what is listening and connected with ss, tie
  every socket back to its owning process, and read connection states to
  triage a service that won't answer.
- **Goal:** See exactly what is listening and connected on a host, and tie
  every socket back to the process that owns it.

#### 10.1 What is listening? (~110 s)
- **Key points:** `ss -tlnp` decoded flag by flag (tcp, listening, numeric,
  processes); reading a row: local address:port and the owning pid/name;
  0.0.0.0 (every interface) vs 127.0.0.1 (local only) is a security-relevant
  distinction; finding what holds port 80.
- **Visual moments:** The flag string expands into four labeled chips; an
  ss output table where the 0.0.0.0 row glows amber "public" against a
  127.0.0.1 row's green "local only" tag.

#### 10.2 Established connections and states (~100 s)
- **Key points:** `ss -tnp` for live connections; ESTABLISHED is a working
  conversation, a pile of TIME-WAIT after load is normal, growing SYN-SENT
  means the far end isn't answering; filter syntax like
  `ss -tn state established '( dport = :443 )'` narrows thousands of rows.
- **Visual moments:** A connection list where state chips get color-coded
  (green ESTAB, gray TIME-WAIT, amber SYN-SENT); a SYN-SENT row pulses once
  with "no reply from far end" caption; a filter types on and rows fall away.

#### 10.3 The listener triage (~80 s)
- **Key points:** The repeatable question chain: is the service listening?
  on which address? owned by which process? reachable from where you stand?
  ss answers the first three, ping/dig the last (videos 8-9 callback);
  netstat is the legacy tool, ss is faster and current.
- **Visual moments:** Four-question strip ticking green as each maps to its
  command; closing pill "socket first, then the wire".

### 11. Capturing Traffic with tcpdump (4-6 min)
- **Description:** Capture packets with tcpdump when higher-level tools
  disagree, cut the noise with capture filters, and read the wire to pin
  down exactly where traffic stops.
- **Goal:** Capture the packets themselves when higher-level tools disagree,
  and read what actually crossed the wire.

#### 11.1 First capture (~110 s)
- **Key points:** tcpdump shows ground truth beneath every other tool;
  `tcpdump -i eth0 -n` (interface, no name resolution); reading a line:
  timestamp, src > dst, flags; needs root; Ctrl-C ends with a
  captured/dropped summary (trap callback from module 1 is a wink, not a
  dependency).
- **Visual moments:** Terminal starts a capture and packet lines stream in;
  one line freezes and gets src/dst/flags annotated; the summary footer
  counts up on the stop beat.

#### 11.2 Filters that cut the noise (~120 s)
- **Key points:** Capture filters keep only what matters: `host 192.168.10.5`,
  `port 443`, combinators `and`/`or`/`not`; the practical recipe "everything
  to or from this host except my own SSH session"; write to a file with `-w`
  for Wireshark later.
- **Visual moments:** A firehose stream thins in stages as host and port
  filter chips stack on; the `not port 22` chip strikes out the viewer's own
  session lines; a `-w capture.pcap` file card docks at the end.

#### 11.3 Answering a real question (~90 s)
- **Key points:** The module's method converges: ss says a service listens,
  but does traffic arrive? tcpdump shows SYNs with no reply = firewall or
  routing, SYN+RST = service refusing; capture on both ends when possible;
  hand-off: the lab's Broken Path is diagnosed exactly this way.
- **Visual moments:** Two-lane capture, client lane shows repeated SYN chips
  crossing while the server lane stays empty, a "never arrived" tag on the
  gap; contrast beat where RST bounces back instead; closing lab pill
  "Broken Path: find where the packets stop".

**Lab:** Broken Path

## Module 3 - Advanced systemd and Service Architecture

### 12. Anatomy of a Unit File (4-6 min)
- **Description:** Read a service unit file section by section, write a
  minimal real service of your own, and override a packaged unit safely
  with drop-ins that survive upgrades.
- **Goal:** Read and write a service unit file section by section, and
  override a packaged unit without editing it.

#### 12.1 The three sections (~110 s)
- **Key points:** This pays off the timer video's forward reference: [Unit]
  is identity and relationships, [Service] is how to run it, [Install] is
  when it joins the boot; `ExecStart` must be an absolute path (the cron
  PATH lesson echoes here); units live in /lib (packaged) vs /etc (yours),
  and /etc wins.
- **Visual moments:** A unit file builds section by section, each getting a
  role caption; a two-shelf diagram where an /etc unit slides in front of
  the /lib copy with a "wins" chip.

#### 12.2 Writing your first real service (~120 s)
- **Key points:** A minimal working unit for a small daemon:
  Description, ExecStart, `User=` to drop root (least privilege),
  `WorkingDirectory=`, `Environment=`; `daemon-reload` after every edit,
  then start and check with `systemctl status`; reading status output:
  active state, main PID, recent journal lines.
- **Visual moments:** The unit types on line by line with per-directive
  captions; a forgot-daemon-reload ✗ beat where the old ExecStart still
  runs, fixed with the reload ✓; a status panel with the green active dot
  annotated.

#### 12.3 Overrides with systemctl edit (~90 s)
- **Key points:** Never edit the packaged file, upgrades clobber it;
  `systemctl edit nginx` writes a drop-in override.conf that changes only
  the directives you set; `systemctl cat` shows the merged result;
  overrides survive package updates.
- **Visual moments:** ✗ beat, a direct edit swept away by an upgrade wave;
  the drop-in card layers on top of the base unit, changed directive
  glowing; `systemctl cat` shows base + drop-in stacked with the override
  highlighted.

### 13. Dependencies, Ordering, and Targets (4-6 min)
- **Description:** Split dependencies into whether (Wants, Requires) and
  when (After, Before), see what enable really wires into a target, and
  read the dependency graph instead of guessing at it.
- **Goal:** Express "needs" and "after" correctly so services start in the
  right order for the right reasons.

#### 13.1 Wants, Requires, and After (~120 s)
- **Key points:** The crucial split: Wants/Requires say WHETHER units start
  together, After/Before say WHEN; the classic bug is Requires without
  After, both start but in an unpredictable order; Wants is the sane
  default, Requires only when running without the dependency is pointless.
- **Visual moments:** Two-column card "starts it" vs "orders it"; a ✗ replay
  where an app and its database launch simultaneously and the app crashes on
  connect, then `After=postgresql.service` types on and the timeline staggers
  ✓.

#### 13.2 Targets, not runlevels (~100 s)
- **Key points:** Targets are named sync points that group units:
  multi-user.target, graphical.target, network-online.target;
  `WantedBy=multi-user.target` is what `enable` wires up (the [Install]
  payoff); `network-online.target` + After for services that truly need the
  network up (module 2 callback).
- **Visual moments:** Boot flows as a tree of targets, units hanging off
  each; the enable command draws a symlink arrow from the service into the
  target's wants directory.

#### 13.3 Seeing the graph (~80 s)
- **Key points:** `systemctl list-dependencies`, and
  `systemd-analyze critical-chain` shows what actually gated your service's
  start time; dependency debugging is reading, not guessing; hand-off: the
  lab's packaged service depends on a database and the network.
- **Visual moments:** A dependency tree expands from the service; the
  critical-chain view lights the slowest path in amber with per-unit
  timings; closing pill "declare needs, let systemd order them".

### 14. Service Types and Restart Behavior (4-6 min)
- **Description:** Match Type= to when your daemon is genuinely ready, add
  automatic restarts with guardrails that stop silent crash loops, and
  read a failed service fast with status and the journal.
- **Goal:** Match Type= to how a daemon actually behaves and make failures
  recover automatically without masking real problems.

#### 14.1 Type= tells systemd when "started" is true (~120 s)
- **Key points:** simple assumes started the moment the process launches;
  forking waits for the parent to exit (classic daemons); notify lets the
  service say "ready" itself; oneshot for scripts that run and finish
  (RemainAfterExit for on/off state); wrong Type makes dependents start
  against a service that isn't ready, the video 13 ordering work wasted.
- **Visual moments:** Four timeline cards, each showing where the green
  "ready" flag drops relative to launch; a ✗ beat where simple's early
  flag lets a dependent connect to a not-yet-listening port.

#### 14.2 Restart= and its guardrails (~110 s)
- **Key points:** `Restart=on-failure` restarts crashes but not clean stops;
  `always` for must-run daemons; RestartSec pause between attempts;
  StartLimitBurst/Interval stop infinite crash loops, leaving the unit
  `failed` so you notice; `reset-failed` to clear the counter after fixing.
- **Visual moments:** A service crashes and a restart arrow loops it back up
  with a RestartSec stopwatch; the crash repeats until a counter fills
  5/5 and a red "start-limit-hit" stamp lands.

#### 14.3 Reading a failure (~80 s)
- **Key points:** `systemctl status` first: Active line, exit code, and the
  last journal lines are usually the answer; `journalctl -u` for the full
  story (module 1's journal beat, now for services); exit codes matter
  again, the module 1 status rule at system scale.
- **Visual moments:** A failed status panel with exit-code and journal-tail
  callouts; the `code=exited, status=2` chip links back to a "meaningful
  exit codes" badge; closing pill "status, then journal, then fix".

### 15. Resource Control with cgroups and Slices (4-6 min)
- **Description:** See the cgroup tree every process already lives in, cap
  a hungry service's memory and CPU with two directives, and limit whole
  categories of services at once with slices.
- **Goal:** See where every process lives in the cgroup tree and cap a
  service's memory and CPU with two directives.

#### 15.1 Every process lives in a cgroup (~110 s)
- **Key points:** systemd places every unit in a cgroup automatically;
  the tree: slices group services (system.slice, user.slice), each service
  is its own node; `systemd-cgls` shows the tree, `systemd-cgtop` is "top,
  but per service"; killing a service kills its whole cgroup, no orphans
  (the trap/cleanup theme at system scale).
- **Visual moments:** The cgroup tree fans out from root with the target
  service's node glowing; cgtop rows sort live with per-slice CPU/memory
  columns filling.

#### 15.2 Capping a hungry service (~120 s)
- **Key points:** `MemoryMax=512M` hard-caps memory (the kernel OOM-kills
  the service, not the host); `CPUQuota=50%` caps CPU; set them in a
  drop-in (video 12 callback), reload, restart; verify in cgtop; protecting
  the host from one runaway service is the point.
- **Visual moments:** A memory-leak graph climbs toward the host ceiling ✗;
  the MemoryMax line types into an override and the graph replays, hitting
  the 512M line where the service (only) restarts, host stays green ✓.

#### 15.3 Slices for whole groups (~80 s)
- **Key points:** Custom slices cap a CATEGORY (all batch jobs, all user
  sessions) with one setting; `Slice=batch.slice` assigns a service; limits
  nest, a child can't exceed its slice; hand-off: the lab's service gets a
  memory cap as part of packaging.
- **Visual moments:** Three job services dock inside a slice box that carries
  one shared MemoryMax badge; the box compresses as the cap engages;
  closing pill "cap the group, not just the process".

### 16. Socket Activation (4-6 min)
- **Description:** Hold a port with a socket unit while the service sleeps,
  wake it on the first connection without dropping anything, and know when
  on-demand startup earns its place.
- **Goal:** Start services on first connection with a socket unit and know
  when on-demand startup is the right architecture.

#### 16.1 The socket listens so the service can sleep (~120 s)
- **Key points:** A .socket unit owns the port; the matching .service starts
  on the first connection (the timer pairing pattern, but the trigger is a
  connection instead of a clock); systemd holds the connection during
  startup so nothing is dropped; sshd.socket vs always-running sshd is the
  canonical example.
- **Visual moments:** A socket chip holds port 22 while the service box
  sleeps dimmed; a connection arrow arrives, the service wakes and the
  held connection hands off, buffered chip "no drop".

#### 16.2 Writing the pair (~110 s)
- **Key points:** ListenStream=8080 in the socket, same-name service gets
  started on demand; enable the SOCKET, not the service; `systemctl
  list-sockets` shows the wiring; Accept=no (one service instance) is the
  normal case.
- **Visual moments:** Socket and service unit files side by side (the video
  5 pair layout returns), pairing arrow labeled "same name"; a list-sockets
  table row lights LISTEN → UNIT → ACTIVATES columns on beat.

#### 16.3 When to use it, and the module lands (~80 s)
- **Key points:** Wins: rarely-used services cost nothing idle, restarts
  don't drop connections, boot gets faster; skip it for hot-path daemons
  that must be warm; module recap chain: unit anatomy → dependencies →
  types/restarts → resource caps → activation; hand-off to the Service
  Packaging lab which uses all five.
- **Visual moments:** Two-column "good fit / poor fit" card; a five-chip
  module recap strip ticking green in sequence; closing lab pill "Service
  Packaging: wire it, cap it, activate it".

**Lab:** Service Packaging

## Module 4 - Observability and Performance

### 17. Persistent journald and Log Filtering (4-6 min)
- **Description:** Make the journal survive a reboot with persistent
  storage, filter it by unit, time, and priority, and use the structured
  fields underneath every entry.
- **Goal:** Make the journal survive reboots and pull exactly the log lines a
  question needs.

#### 17.1 Make the journal survive a reboot (~100 s)
- **Key points:** Default volatile journals live in /run and vanish on
  reboot, exactly when you need them most (crash forensics); persistence is
  `Storage=persistent` in journald.conf (or creating /var/log/journal);
  cap growth with SystemMaxUse; `journalctl --disk-usage` to check.
- **Visual moments:** ✗ beat: a crash, a reboot sweep, and the journal panel
  comes back empty; the Storage=persistent line types on, replay keeps the
  pre-crash lines ✓ with a disk-usage badge.

#### 17.2 Filtering: time, unit, priority (~120 s)
- **Key points:** The three filters that answer most questions:
  `-u nginx` (unit, the module 3 habit), `--since "1 hour ago"` /
  `--until`, `-p err` priority and worse; combine them; `-f` to follow
  live; `-b -1` for "last boot", the crash-forensics move that needs 17.1.
- **Visual moments:** A firehose of journal lines thins as unit, since, and
  priority filter chips stack on (the tcpdump filter motif on logs); a
  `-b -1` beat pulls up the previous boot's final lines with a "why it
  died" highlight.

#### 17.3 Fields and JSON output (~80 s)
- **Key points:** Every entry carries structured fields (`_PID`, `_UID`,
  `_SYSTEMD_UNIT`); `journalctl -o json-pretty` exposes them; field matches
  like `_PID=1234` filter without grep; JSON output feeds scripts, the
  module 1 toolchain meets the journal; hand-off: the performance lab
  starts from journal evidence.
- **Visual moments:** One log line explodes into its JSON fields, three
  fields annotated on beat; a field-match filter types on and isolates one
  process's lines; closing pill "filter first, grep last".

### 18. CPU and Load with vmstat and sar (4-6 min)
- **Description:** Read load average against your core count, split CPU
  time with vmstat's us/sy/id/wa columns, and keep round-the-clock history
  with sar so 3 AM questions get answers.
- **Goal:** Read load average and CPU columns correctly and tell run-queue
  pressure from I/O wait.

#### 18.1 What load average really is (~110 s)
- **Key points:** The three numbers are 1/5/15-minute averages of runnable
  PLUS uninterruptible-wait tasks, not CPU percent; compare load to core
  count (`nproc`), load 8 on 8 cores is busy, on 2 cores it's drowning;
  rising 1-min vs calm 15-min means it's happening now.
- **Visual moments:** Load triple with a per-core yardstick beside it, the
  same "8.0" glowing green against 8 core slots and red against 2; a
  1/5/15 trend arrow beat showing "arriving" vs "draining".

#### 18.2 vmstat's CPU columns (~110 s)
- **Key points:** `vmstat 1` streams; r column is the run queue (waiting for
  CPU), us/sy/id/wa split where cycles go; high us = app work, high sy =
  kernel/syscall churn, high wa = CPUs idle waiting on disk, a different
  problem (forward reference to the iostat video); watch trends, not one
  sample.
- **Visual moments:** A vmstat stream with r and the us/sy/id/wa block
  annotated on beat; three mini-scenarios recolor the same row (compute
  100% us, syscall storm sy, stalled-on-disk wa) with a verdict chip each.

#### 18.3 sar remembers yesterday (~90 s)
- **Key points:** vmstat shows now, sar (sysstat) records history on a
  schedule (a cron/timer callback); `sar -u` replays CPU by timestamp,
  `sar -q` load; "it was slow at 3 AM" becomes answerable; hand-off: the
  lab investigation leans on sar's history.
- **Visual moments:** A timeline scrubber drags backward over a sar CPU
  graph to a 03:00 spike; the spike aligns with a journal entry from
  video 17 in a stacked-evidence beat; closing pill "now from vmstat,
  history from sar".

### 19. Memory Pressure and Swap (4-6 min)
- **Description:** Read free -h without false alarms, tell harmless swap
  usage from real thrashing with vmstat, and follow the OOM killer's paper
  trail in the journal.
- **Goal:** Read free/available memory correctly and recognize real memory
  pressure before the OOM killer does.

#### 19.1 free, and why "free" looks scary (~110 s)
- **Key points:** In `free -h` the free column is nearly zero on a healthy
  box because Linux uses idle RAM as page cache; AVAILABLE is the number
  that matters, cache is reclaimable; the classic false alarm "my server is
  out of memory" debunked.
- **Visual moments:** A RAM bar filled mostly with a soft "cache" band that
  drains instantly when an app claims it; free vs available columns glow
  red-herring amber vs trustworthy green.

#### 19.2 Swap is a symptom meter (~110 s)
- **Key points:** Some swap USED is fine, sustained swap ACTIVITY is the
  problem; vmstat's si/so columns (the video 18 tool, two columns left)
  show pages moving per second; heavy si/so = thrashing, everything gets
  slow at once; swappiness in one line as tuning foreshadowing (video 21).
- **Visual moments:** Two vmstat streams contrast: si/so all zeros with
  swap used ✓ calm, vs si/so climbing ✗ with a thrash-shudder on the whole
  panel; a "used ≠ active" two-chip verdict.

#### 19.3 The OOM killer and reading its aftermath (~90 s)
- **Key points:** When RAM and swap run out the kernel kills the biggest
  offender by oom_score; the evidence lands in the journal (`journalctl -k`,
  video 17 callback) as "Out of memory: Killed process"; MemoryMax from
  module 3 is the fence that keeps a runaway service from triggering it;
  hand-off to the lab's memory-leak scenario.
- **Visual moments:** Pressure gauge sweeps into red, the fattest process
  chip gets a kernel strike-through; the journal line slides in beneath as
  the paper trail; a MemoryMax fence beat replays containment ✓.

### 20. Disk I/O with iostat (4-6 min)
- **Description:** Confirm a disk bottleneck with iostat's await and %util
  columns, name the process behind it with iotop, and run the
  CPU-memory-disk triage chain in order.
- **Goal:** Confirm or rule out the disk as the bottleneck with iostat and
  find which process is hammering it.

#### 20.1 Reading iostat (~120 s)
- **Key points:** `iostat -x 1` per-device: r/s w/s (IOPS), rkB/s wkB/s
  (throughput), await (average wait per I/O, the latency headline), %util
  (device busy); await climbing while throughput stalls is saturation;
  this is where video 18's wa column sends you.
- **Visual moments:** An iostat table with the four column groups annotated
  on beat; a healthy row morphs into a saturated one, await and %util
  climbing to red while rkB/s flatlines, "the disk is the queue" caption.

#### 20.2 Which process is doing it? (~100 s)
- **Key points:** iostat names devices, not culprits; `iotop` (or pidstat
  -d) ranks processes by disk I/O live; the usual suspects: logging gone
  wild, a backup at the wrong hour (a wink at module 1's rotate.sh),
  a database checkpoint; match the process's file activity to the device.
- **Visual moments:** An iotop leaderboard where one process chip surges to
  the top with a MB/s counter; an arrow ties it back to the saturated
  device row from the previous scene.

#### 20.3 The CPU-memory-disk triage chain (~80 s)
- **Key points:** The module's method assembles: load high? → vmstat splits
  CPU vs wa → wa points at iostat → iotop names the process → journal
  explains it (17-20 in one chain); rule things OUT in order instead of
  guessing; hand-off: the Performance Investigation lab runs this chain on
  a mystery-slow host.
- **Visual moments:** A four-node triage flowchart lights node by node with
  each video's tool badge; closing lab pill "Performance Investigation:
  follow the chain".

### 21. Tuning Kernel Parameters with sysctl (4-6 min)
- **Description:** Inspect the kernel's runtime knobs under /proc/sys,
  change them live with sysctl -w, persist them in /etc/sysctl.d, and tie
  every tweak to a measured reason.
- **Goal:** Inspect and change kernel parameters safely, and make the changes
  survive a reboot.

#### 21.1 The knobs under /proc/sys (~100 s)
- **Key points:** sysctl parameters are the kernel's runtime knobs, mirrored
  as files under /proc/sys; `sysctl -a` lists, `sysctl vm.swappiness` reads
  one (the video 19 foreshadow lands); dotted names map to slashed paths;
  read first, change second.
- **Visual moments:** A parameter tree fans out (vm, net, fs, kernel); the
  dotted name `vm.swappiness` morphs into its /proc/sys path and back; a
  value chip reads 60.

#### 21.2 Change it now, keep it forever (~110 s)
- **Key points:** `sysctl -w vm.swappiness=10` applies instantly and
  vanishes on reboot, the module's recurring runtime-vs-persistent split
  (videos 7 and 8 callback); persistence is a .conf drop-in under
  /etc/sysctl.d, loaded by `sysctl --system`; verify after reboot; change
  one thing at a time and measure (module 4's whole ethic).
- **Visual moments:** The -w command flips the live value chip 60→10; a
  reboot sweep resets it ✗; the sysctl.d drop-in card docks and the replay
  holds 10 ✓ (the video 7 make-it-stick motif on kernel knobs).

#### 21.3 Tune with a reason (~90 s)
- **Key points:** Worked example: swappiness for a database host, or
  fs.file-max for a busy server, each tied to a symptom measured earlier in
  the module; cargo-cult sysctl pastes from forums are how hosts get weird;
  the loop is measure → change → re-measure; module recap chain 17→21 and
  hand-off to the lab.
- **Visual moments:** A measure→change→re-measure loop diagram ticking
  around once with real numbers improving; a struck-through "50-line magic
  sysctl paste" forum snippet ✗ against a one-line justified change ✓;
  closing pill "every knob earns its line".

**Lab:** Performance Investigation

## Module 5 - Advanced Storage and Access Control

### 22. RAID Concepts and mdadm (4-6 min)
- **Description:** Choose a RAID level by what it trades away, build and
  persist a mirror with mdadm, and catch the silent degraded state before
  a second disk dies.
- **Goal:** Choose the right RAID level for a workload and build and monitor a
  software array with mdadm.

#### 22.1 RAID levels in five minutes (~120 s)
- **Key points:** RAID 0 stripes for speed with zero safety (one disk dies,
  everything dies); RAID 1 mirrors; RAID 5 stripes with parity, survives one
  disk; RAID 10 mirrors then stripes for the fast-AND-safe option; RAID is
  uptime insurance, NOT a backup, deletion replicates instantly.
- **Visual moments:** Four level cards, data blocks streaming into each
  layout on beat; a disk-failure strike hits each card, RAID 0 goes all-red
  ✗ while 1/5/10 keep serving ✓; a stamped "RAID ≠ backup" banner.

#### 22.2 Building an array with mdadm (~110 s)
- **Key points:** `mdadm --create /dev/md0 --level=1 --raid-devices=2` over
  two disks; the array is one block device you format and mount like any
  other; watch the initial sync in /proc/mdstat; persist with
  `mdadm --detail --scan >> mdadm.conf` (the module's make-it-stick move).
- **Visual moments:** Two disk chips merge into one md0 device chip; a
  /proc/mdstat progress bar fills for the initial sync; the scan line
  types into mdadm.conf with a "survives reboot" ✓ chip.

#### 22.3 Living with degraded (~90 s)
- **Key points:** A dead member drops the array to degraded, still serving
  but one failure from loss; /proc/mdstat shows [U_]; replace with
  `mdadm --manage --add` and watch the rebuild; monitoring matters because
  degraded is silent (a journal/monitoring wink at module 4).
- **Visual moments:** One disk chip in the mirror dims and a [UU] badge
  flips to [U_] amber "degraded, still serving"; the --add command docks a
  fresh disk and a rebuild bar restores [UU] green ✓.

### 23. LVM Snapshots (4-6 min)
- **Description:** Stack physical volumes, volume groups, and logical
  volumes, freeze instant point-in-time snapshots with copy-on-write, and
  roll back a bad change with lvconvert --merge.
- **Goal:** Use LVM snapshots for instant point-in-time copies and safe
  rollback before risky changes.

#### 23.1 The LVM stack, quickly (~100 s)
- **Key points:** Physical volumes pool into a volume group, logical volumes
  carve it up; LVs resize while mounted (the flexibility partitions never
  had); `pvs/vgs/lvs` to see each layer; this stack is where snapshots
  live.
- **Visual moments:** Three-layer diagram builds bottom-up (PV disks → VG
  pool → LV slices), each layer labeled with its command; an LV stretches
  wider inside the pool while its mount stays live.

#### 23.2 Snapshot in one second (~120 s)
- **Key points:** `lvcreate -s -n backup-snap -L 2G /dev/vg0/data` freezes a
  point-in-time view instantly; copy-on-write means it stores only changed
  blocks, so it's small until the origin churns; a FULL snapshot dies
  silently, size it for the churn window; snapshots enable consistent
  backups of a live system (rotate.sh gets a wink).
- **Visual moments:** A camera-flash beat freezes the LV; changed blocks
  copy across to the snapshot as the origin keeps writing (CoW animated);
  a usage meter climbs toward 100% with an amber "size for the churn"
  warning.

#### 23.3 Rollback as an undo button (~90 s)
- **Key points:** Snapshot before the risky upgrade, `lvconvert --merge`
  rolls the origin back if it goes wrong; merge applies on next activation
  (often a reboot); this is exactly the pre-change safety net the module 3
  and 4 changes deserved; delete stale snapshots, CoW costs performance.
- **Visual moments:** A timeline: snapshot flash → upgrade beat goes red ✗ →
  the merge arrow sweeps state back to the flash point ✓; a "before every
  risky change" pill.

### 24. Encryption at Rest with LUKS (4-6 min)
- **Description:** Encrypt a volume with LUKS so a lost disk is unreadable
  noise, open and mount it through the mapper device, and manage keys and
  header backups before you need them.
- **Goal:** Encrypt a volume with LUKS so a lost disk is unreadable, and
  manage its keys responsibly.

#### 24.1 Why and how LUKS sits in the stack (~100 s)
- **Key points:** Disk encryption protects data when the HARDWARE walks away
  (stolen laptop, decommissioned drive), not from live attackers on a
  running system; LUKS is a layer: raw device → LUKS → filesystem (it
  stacks with LVM and RAID); one passphrase unlocks at boot or mount.
- **Visual moments:** A stolen-disk beat: an unencrypted disk chip spills
  readable file chips ✗, the LUKS disk shows only noise ✓; the layer
  diagram slots LUKS between device and filesystem.

#### 24.2 Creating and opening an encrypted volume (~120 s)
- **Key points:** `cryptsetup luksFormat /dev/sdb1` (destructive, deliberate
  YES confirmation), `luksOpen` maps it to /dev/mapper/secret, then format
  and mount the mapper device; `luksClose` after unmount; crypttab +
  a key or prompt for unlock at boot.
- **Visual moments:** Terminal type-on with the all-caps YES confirmation
  highlighted amber; a padlock on the raw device springs open into the
  mapper chip (the course's padlock motif returns); mount lands on the
  mapper, not the raw device, with an arrow disambiguating.

#### 24.3 Keys are the whole game (~90 s)
- **Key points:** LUKS has 8 key slots: add a second passphrase or keyfile
  with `luksAddKey` BEFORE you need it; `luksDump` shows slot status; a
  header backup (`luksHeaderBackup`) is the recovery parachute, lose the
  header and passphrase and the data is gone forever, which is the point.
- **Visual moments:** An 8-slot key rack fills slot 0 and 1 (passphrase +
  keyfile chips); the header-backup card docks in a vault; a red beat where
  a corrupted header with no backup fades the whole volume to noise ✗.

### 25. How Mandatory Access Control Works (4-6 min)
- **Description:** See where rwx permissions stop protecting you, how
  mandatory access control confines even root-owned processes by policy,
  and meet SELinux and AppArmor.
- **Goal:** Explain why file permissions aren't enough and how MAC confines
  even root-owned processes by policy.

#### 25.1 Where permissions stop (~110 s)
- **Key points:** rwx permissions are discretionary: the owner decides, and
  a compromised process IS its user, wielding every permission that user
  has; a hijacked web server reads every file www-data can, and a root
  daemon can touch everything; the gap: nothing constrains what a program
  SHOULD do.
- **Visual moments:** A www-data process chip gets a compromise flash, then
  a dotted blast radius sweeps across every file chip its user can reach ✗;
  a "the process is the user" caption lands.

#### 25.2 Policy beats privilege (~110 s)
- **Key points:** MAC adds a kernel policy layer that checks every access
  AFTER permissions: this process type may read these file types, nothing
  else; root running a confined process is still confined; the same
  hijacked daemon now bounces off policy even for files its user could
  read.
- **Visual moments:** The same compromise replay but a policy boundary box
  wraps the process, the blast-radius arrows bounce off with deny badges ✓;
  a gold root crown on the process makes the point as it still bounces.

#### 25.3 Two implementations, one idea (~80 s)
- **Key points:** SELinux (labels on everything, default on RHEL/Fedora)
  and AppArmor (per-program path profiles, default on Ubuntu/SUSE) are the
  two mainstream MACs; same purpose, different mental models; never turn
  them off to "fix" an app, the next two videos write real policy for each;
  denials land in the audit log (module 4's journal habit pays off).
- **Visual moments:** Two badge cards (SELinux labels vs AppArmor paths)
  with a "same purpose" tie bar; a struck-through "just disable it" forum
  post ✗ (the course's anti-pattern motif); an Enforcing toggle that stays
  ON.

### 26. Writing an AppArmor Profile (4-6 min)
- **Description:** Confine a real program with AppArmor path rules, let
  complain mode and aa-logprof write the profile for you, and fix
  production denials without dropping the fence.
- **Goal:** Confine a real program with an AppArmor profile, from complain
  mode to enforce.

#### 26.1 Profiles are path rules (~100 s)
- **Key points:** A profile lists what one program may do by path:
  `/var/log/app/* w`, `/etc/app.conf r`, plus capability lines; profiles
  live in /etc/apparmor.d named after the binary path; `aa-status` shows
  what's confined and in which mode.
- **Visual moments:** A profile file with three path rules, each rule chip
  drawing an arrow to the matching file chip with r/w badges; an aa-status
  panel splits enforce vs complain columns.

#### 26.2 Complain mode writes the profile for you (~120 s)
- **Key points:** The workflow: `aa-complain` logs would-be denials without
  blocking; exercise the app normally, then `aa-logprof` turns the logged
  accesses into proposed rules you approve one by one; a rule you don't
  recognize is a finding, not a formality; flip to `aa-enforce` when clean.
- **Visual moments:** The app runs in complain mode and each access appends
  a log line; aa-logprof replays the log as accept/deny prompt cards
  stacking into the profile; the mode chip flips complain → enforce green.

#### 26.3 Denials in production (~90 s)
- **Key points:** When the app breaks under enforce, check the audit log for
  DENIED lines (journalctl or dmesg, the module 4 reflex); the fix is a
  rule, not disabling the profile (video 25's rule); update the profile,
  reload with apparmor_parser; hand-off: the lab confines a service this
  exact way.
- **Visual moments:** A DENIED journal line highlights path and operation;
  the missing rule types into the profile and a reload sweep turns the
  app's request green ✓; closing pill "add the rule, keep the fence".

### 27. Writing an SELinux Policy (4-6 min)
- **Description:** Read SELinux labels and AVC denials, triage with
  restorecon and booleans first, and write a minimal custom policy module
  only when the access is genuinely legitimate.
- **Goal:** Diagnose an SELinux denial and fix it the right way: booleans,
  contexts, or a small custom module, in that order.

#### 27.1 Labels and contexts (~110 s)
- **Key points:** Everything gets a label: processes run in a domain
  (httpd_t), files carry a type (httpd_sys_content_t); policy says which
  domains touch which types; `ls -Z` / `ps -Z` reveal labels; most "SELinux
  broke it" cases are a file with the WRONG label, often after mv (which
  keeps the old context where cp inherits the target's).
- **Visual moments:** Process and file chips wear label tags, allowed pairs
  tie green; a mv beat drags a file in still wearing its old amber tag and
  the tie snaps ✗; the cp contrast inherits the right tag ✓.

#### 27.2 Reading a denial (~110 s)
- **Key points:** Denials land in the audit log as AVC records;
  `ausearch -m avc -ts recent` finds them, `audit2why` explains the cause
  category; the triage order: is it mislabeled (restorecon), is there a
  boolean for it (`setsebool -P`), only then consider custom policy;
  restorecon fixes labels back to policy defaults.
- **Visual moments:** An AVC record with source domain, target type, and
  denied operation annotated on beat; a three-step triage strip
  (restorecon → boolean → policy) lighting in order with "stop at the
  first fix" caption.

#### 27.3 A small custom module, and the course lands (~100 s)
- **Key points:** When triage says the access is legitimate and no boolean
  exists, `audit2allow -M mymodule` generates a minimal policy module from
  the denial; READ the generated .te before `semodule -i`, blindly allowing
  is disabling with extra steps; course capstone note: storage, encryption,
  and MAC together are what "production-ready host" means; hand-off to the
  Confined Service lab.
- **Visual moments:** The denial record transforms into a three-line .te
  rule with each line captioned; a review-first beat magnifies the allow
  line before an approve tick; closing lab pill "Confined Service: label
  it, allow exactly enough" and a course-arc strip (scripting → network →
  services → performance → storage/MAC) ticking green.

**Lab:** Confined Service
