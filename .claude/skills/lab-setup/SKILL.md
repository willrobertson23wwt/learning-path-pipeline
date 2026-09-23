---
name: lab-setup
description: Provision a delivered ATC lab vApp over SSH from the lab's SETUP.md (read-only audit, OS upgrade, then the lab-specific build from an idempotent dryrun/setup.sh), record the as-found state, and fill the lab's management IPs. Use once the vApp exists and its address is known, e.g. "/lab-setup log-rotation-tool 10.236.74.17"; the dry run and screenshots come after.
argument-hint: <lab-slug> <vapp-address>
---

# Lab setup

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Turn a stock vApp into the lab's golden image, driven from this machine.
`$ARGUMENTS` is `<lab-slug> <vapp-address>` (`/lab-setup log-rotation-tool
10.236.74.17`). The vApp comes from `/lab-build` (planned in Lab Builder, built
by the user) or is delivered by the ATC team; either way this skill starts
from its address. Worked example: the Linux Intermediate course repo's Log
Rotation Tool build (`labs/log-rotation-tool/SETUP.md` "vApp status"
paragraph and `labs/log-rotation-tool/dryrun/{setup,audit}.sh`).

The steps below are the Linux build on the stock `ubuntu2404-s` image, which
every lab so far has used. For another platform in the profile, keep the
order of operations (read-only audit, ask for egress, patch the OS,
idempotent setup script, hand-check, clean, reboot, re-audit, record) and use
the platform's remote tool (PowerShell remoting, or the device console) in
place of `lab-ssh`.

Out of scope (each has its own stop): the Module 1-N dry run and its phase
scripts, rendering `shots_spec.py`, the topology diagram, the vCD
edge-firewall changes themselves (the user makes those; you ask for them),
and the snapshot (the user takes it).

## Inputs

- `labs/<slug>/SETUP.md`: the checklist you are executing. Read it fully
  first.
- `labs/<slug>/environment.md`: **the credentials.** Log in with the exact
  username and password in its `## Device Access Information` table (the
  platform profile's default, `labuser` / `Labpass01!` on Linux). Never
  guess or try other accounts: the permission classifier treats an
  unconfirmed credential as credential exploration and denies the whole SSH
  call. If the table's account doesn't exist on the delivered VM, stop and
  ask the user what the vApp shipped with.
- The Linux Intermediate labs' `SETUP.md` files (`broken-path`,
  `confined-service`), for what "as found" notes and ticked items look like.
- `scripts/lab-ssh`, `scripts/lab-scp`: `expect` wrappers for password SSH
  and scp (no sshpass on the Mac; `expect` ships with macOS and installs on
  Linux). Pass the password only through the `LAB_PASS` environment
  variable, never on the command line:

  ```bash
  export LAB_PASS='<password from environment.md>'
  scripts/lab-ssh labuser@<addr> "hostname; id"
  scripts/lab-scp labs/<slug>/dryrun labuser@<addr>:~/
  ```

  `lab-ssh` allocates a tty and answers both the login prompt and
  `[sudo] password for <user>:`, so `sudo bash ~/dryrun/setup.sh` works. Do
  **not** pipe a script over stdin (`bash -s < file`): expect owns the pty and
  the remote shell waits forever. Copy scripts over with `lab-scp` and run
  them by path. If a remote command seems to stall, check from a second
  session with `ps -o pid,tty,etime,command -u <user>`: a process sitting in
  `sudo` means the prompt regex missed (a helper matching only `password:`
  never sees sudo's `password for labuser:`). In a multi-host lab, reach
  each VM through the gateway's port forwards (`-p 2210`, `-p 2211` style,
  from SETUP.md) and run every step below on each.

## Scripts you write

Everything that changes the VM lives in `labs/<slug>/dryrun/` beside the
`states/` folder `/lab` wrote, so the build is reproducible without this
session (pushed with the lab's own repo):

- `audit.sh`: read-only, no sudo prompts (use `sudo -n` or skip). Prints:
  hostname, `preserve_hostname`, and `/etc/hosts`; OS release and uptime;
  the lab user and groups; `ip -br addr`, `ip route`, netplan files;
  docker/snapd units and `snap list`; every package the guide needs; the
  seeded lab directory with sizes; the clean-slate checks (crontab, units,
  whatever the lab says must not exist yet); `timedatectl`; pending upgrades
  (`apt list --upgradable 2>/dev/null | wc -l`); `systemctl --failed`.
- `setup.sh`: `set -euo pipefail`, run with sudo, **idempotent** (a re-run
  restores the golden state; every seeded file is overwritten, every "must
  not exist" item is removed). Walks SETUP.md top to bottom with a
  `log "==> step"` line per section. Embed the pre-seeded files as quoted
  heredocs copied verbatim from SETUP.md's "Pre-seeded files" section, and
  pin their mtimes when the guide shows an `ls -la`.
- `README.md`: the copy-and-run steps for a human.

## Order of operations

1. **Read-only audit first.** `lab-scp` the folder, run `audit.sh`, and read
   the result before changing anything. Also probe the edge: `nc -zw5
   archive.ubuntu.com 80` and `443`, `getent hosts archive.ubuntu.com`.
   Record the as-found state (hostname, account, snaps, NICs, netplan keys,
   reachability); it goes in SETUP.md at the end.
2. **Ask for egress, then upgrade the OS before the lab build.** The standard
   edge table blocks 80/443 out, so `apt` fails until the user opens them.
   Ask once, wait for the yes, then:

   ```bash
   sudo apt-get update && sudo DEBIAN_FRONTEND=noninteractive apt-get -y full-upgrade
   sudo apt-get -y autoremove && sudo apt-get clean
   ```

   `full-upgrade`, not `upgrade`: the stock image holds back the kernel
   meta-packages otherwise. A few packages left "not upgraded" afterwards are
   Ubuntu's phased updates; that's normal, note them in SETUP.md and move on.
   Wait for the `unattended-upgrades` dpkg lock first (`until ! sudo fuser
   /var/lib/dpkg/lock-frontend 2>/dev/null; do sleep 10; done`), since the
   fresh image runs it at boot and `apt` fails with "Could not get lock" for
   the first few minutes. Reboot if `/var/run/reboot-required` exists, then
   continue.
3. **Run `setup.sh`** (`sudo bash ~/dryrun/setup.sh 2>&1 | tee /tmp/setup.log`).
   The standard base-image items every lab's script includes, in this order:
   - hostname, `/etc/hosts`, and `preserve_hostname: true`;
   - the lab account exists with the guide's password and sudo;
   - **the sudo drop-in:** write `/etc/sudoers.d/lab-sudo` with `Defaults
     !use_pty`, `Defaults timestamp_timeout=240`, `Defaults
     timestamp_type=global`, `chmod 440` it before any further `sudo` (a 644
     file is rejected), then `visudo -c`. This stops Ubuntu 24.04's sudo
     (1.9.15, `use_pty` compiled in) from swallowing the rest of a pasted
     block and keeps the ticket for four hours across terminal tabs.
     Changing `timestamp_type` invalidates the current ticket, so the next
     `sudo` prompts once; verify with `sudo -n true` from a second session;
   - remove the Docker and lxd snaps, then every non-`snapd` snap, then
     `snapd` itself (`snap remove --purge`, `apt-get purge -y snapd`, `rm -rf
     /var/snap /var/lib/snapd ~/snap`), and drop the account from the `lxd`
     group;
   - replace netplan's deprecated `gateway4` with a `routes:` entry (same
     addresses as delivered, `chmod 600`, `netplan generate`);
   - install the guide's packages, seed the lab directory, reset the
     clean-slate items, `chown -R` the lab directory, and print a verify
     block.

   Lab-specific items (extra disks, users, services, masked units) come from
   SETUP.md. On a NetworkManager-managed VM, mask
   `systemd-networkd-wait-online.service` (`systemctl disable --now` then
   `mask`), or every boot stalls for its full 120 s timeout with nothing to
   wait for; never on a gateway whose netplan renders to networkd.
4. **Hand-check** whatever SETUP.md's "Final verification pass" names (for
   Log Rotation Tool: run Module 1 steps 1-4 as the lab user, then delete the
   file it produced).
5. **Clean and reboot:** `unset HISTFILE; rm -rf ~/dryrun /tmp/setup.log
   ~/.bash_history ~/.lesshst ~/.viminfo ~/.sudo_as_admin_successful; sudo rm
   -f /root/.bash_history /root/.lesshst /root/.viminfo; sudo find <lab dirs>
   -name __pycache__ -exec rm -rf {} +; sudo systemctl reboot`. Any later SSH
   login that checks the result writes a fresh `.bash_history` on logout:
   `unset HISTFILE` first in that session, or clear the file last. Also:
   - Labs whose guide runs `aa-logprof`: `sudo truncate -s 0
     /var/log/audit/audit.log` (auditd opens it append-only, so truncating in
     place is safe); the snapshot check requires zero audit lines naming the
     lab's profile.
   - Any `Persistent=true` timer the guide creates leaves
     `/var/lib/systemd/timers/stamp-<unit>.timer`, and a stale stamp fires the
     timer the instant a learner enables it, so remove it.
   - The `ubuntu2404-s` image runs rsyslog, so `journalctl --vacuum` alone
     leaves the build in `/var/log/syslog`, `auth.log`, and `kern.log` (stop
     rsyslog, `truncate -s 0`, start) and in `wtmp`/`btmp`/`lastlog`
     (truncate).
   - Every `sudo` recreates `~/.sudo_as_admin_successful`, so delete it from
     inside the root shell that issues the reboot.
   - An interactive session still logged in at reboot writes its
     `.bash_history` on the way down. Log every portal or SSH session out
     first, and check `ls -la ~` once more after the VM is back.

   `/tmp` is wiped at boot, so re-copy `audit.sh` afterwards.
6. **Post-reboot audit:** run `audit.sh` again plus `systemctl --failed`,
   `systemd-analyze`, and the 80/443 probe. Every SETUP.md item must match.
7. **Record.** In SETUP.md: a dated "vApp status" paragraph under the header
   (address, as-found state, what ran, what is open), tick each completed
   item as `- [x] (done <date> via dryrun/setup.sh)`, and add an "As found"
   note under Management network (or the interface map) if the NIC layout
   differs from the design. Update `dryrun/README.md` with anything a human
   needs to repeat it.
8. **Sync the learner-visible facts that depend on the build.** In a lab with
   more than one device, fill every `TBD` in `_quickref_passwords.md` with the
   management IP as built, and correct any row that differs, so it matches
   SETUP.md's interface map. If the as-built hostname, account, or address
   plan differs from what the Environment page or `shots_spec.py` shows,
   don't change the build to hide it: report it for a `/lab-review` pass.
   SUPPORT.md's status line says the vApp is built and not yet dry-run.
9. **Hand off** with exactly the user's remaining steps: close 80/443 out at
   the edge, snapshot. The dry run is the next stop.

## Rules

- Try a denied remote write **once**; never split it into pieces to slip past
  the classifier. If denied, leave the ready-to-run script in `dryrun/` and
  hand the user the `lab-scp` plus `lab-ssh` one-liner to run themselves.
- Nothing outside the checklist: no extra packages, no editor configs, no
  "helpful" aliases. A lab VM looks like a stock server plus exactly what the
  guide assumes.
- Leave no trace: the dryrun folder, logs, histories, and any test output the
  hand-check produced are gone before the snapshot.
- Faithful reporting: if a step failed or was skipped (lock held, package
  missing, edge closed), SETUP.md says so under **Open:** and so does your
  final message.
