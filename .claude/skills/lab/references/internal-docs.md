# Internal files: SETUP.md, SUPPORT.md, LISTING.md, shots_spec.py, dryrun/

Files that live beside the guide and are never shown to learners. Worked
examples for every one of them: the Linux Intermediate course repo's
`labs/*/` (Broken Path for a multi-host build, Confined Service and Log
Rotation Tool for single VMs).

Where they go when a lab publishes: the course repo ignores `labs/`. In the
lab's own repo the pages map 1:1 into `labdocs/docs/`; none of these files
goes there, since mkdocs publishes every `.md` in that folder. `shots_spec.py`
and `dryrun/` sit at the lab repo root and are pushed. `SETUP.md`,
`SUPPORT.md`, and `LISTING.md` stay out of the lab repo, and its `.gitignore`
lists `SUPPORT.md` and `LISTING.md` so a copy never lands there by accident.

## SETUP.md: the build checklist

For whoever builds the ATC vApp, never the learner. A plain checkbox punch
list, not an executable script (the script is `dryrun/setup.sh`, which
`/lab-setup` writes from this file).

```markdown
# Setup Checklist: <Lab Title> (internal, not published)

Not part of the learner-facing guide. This is the punch list to work through against a fresh <base image> before this lab is handed to a student, so the VM matches exactly what the Environment page and the modules assume. The exact pre-seeded file contents are in the "Pre-seeded files" section at the end of this file.

Status <YYYY-MM-DD>: <what the latest pass did, and whether the vApp is built and dry-run yet>
```

Then these sections, in this order (Log Rotation Tool and Confined Service
are the single-VM models):

1. `## Base image and account`: the OS image; the hostname as a
   `hostnamectl` block with the `/etc/hosts` line and cloud-init's
   `preserve_hostname: true` (pick `<lab-word>-lab` if the guide needs no
   specific name, and say so; prompts and journal lines depend on it); the
   lab account and password from the Device Access table, with sudo; and
   the elevation fix. On Linux that is the sudo drop-in, as its own item:

    ```bash
    printf 'Defaults !use_pty\nDefaults timestamp_timeout=240\nDefaults timestamp_type=global\n' \
      | sudo tee /etc/sudoers.d/lab-sudo
    sudo chmod 440 /etc/sudoers.d/lab-sudo      # BEFORE the next sudo
    sudo visudo -c                               # every file: parsed OK
    ```

   with the reason (Ubuntu 24.04's sudo 1.9.15 has `use_pty` compiled in and
   swallows the rest of a pasted block; stock sudo forgets the password after
   15 minutes and keys the ticket to the tty) and the two tests: paste
   `sudo sleep 2`, `echo second`, `echo third` at once and all three run; a
   second terminal tab runs `sudo -n true` without a prompt.
2. `## Base image hygiene`: no leftover Docker or lxd snaps (a background
   dockerd adds iptables rules and resource noise no lab expects), and
   anything else the shared base image carries that the lab must not.
3. `## vApp edge firewall (vCloud Director, the vApp's own edge)`: keep this
   heading, because Lab Builder's `setup_rules.py` finds the section by it
   and parses the table:

    ```markdown
    | # | Name | Action | Protocol | Source | Destination | Ports |
    |---|---|---|---|---|---|---|
    | 1 | Allow portal SSH in | Allow | TCP | external : Any | internal : lab VM | 22 |
    | 2 | Allow DNS/NTP out (optional) | Allow | UDP | internal : lab VM | external : Any | 53, 123 |
    | 3 | Default policy | Deny | Any | Any : Any | Any : Any | logging **on** |
    ```

   Inbound allows only the portal SSH ports to the gateway or lab VM
   (`22, 2210, 2211` when a gateway forwards to each host). Outbound allows
   only what the guide's commands need, for example ICMP, UDP 33434-33534
   for traceroute, and 53 for DNS. Default deny with logging on. Then three
   items: don't narrow rule 1's source to one portal IP unless the portal's
   egress range is known; open TCP 80/443 outbound temporarily for package
   updates during image maintenance and close it before the snapshot; and a
   verify step (which ports answer on the vApp address, which commands in
   the guide must work).
4. `## Management network`: the management NIC and its address, and an
   "As found" note when the delivered NIC layout differs from the design.
   Multi-host labs replace this with `## Network fabric` (segments, which
   NIC is on which, and that the portal's access doesn't ride the lab NIC),
   `### Interface map (as built)` (VM, interface, MAC, address, role; MACs
   live only here), a section for the gateway VM (NICs, forwarding, NAT, DNS,
   port forwards, a reference config), and one section per host.
5. `## Packages`: what to verify or install, with the check that proves the
   binary exists (`which tcpdump dig`), not only `dpkg -s`.
6. Lab-specific sections: the lab directory, accounts, services, disks,
   seeded faults, each item precise enough to build.
7. `## Clean slate for <what the lab creates>`: what must not exist yet
   (no crontab, no units, no array), since a leftover short-circuits the lab.
8. `## Final verification pass`: a hand-check of the first module's steps,
   removing what the hand-check created, leaving no trace (histories, the
   dryrun folder, logs), then the snapshot, after closing 80/443 again.
9. `## Pre-seeded files (exact content)`: a table of paths and what each
   holds, then one `### <file> (exact starting content)` subsection per file
   with a paste-ready `tee <path> >/dev/null <<'EOF'` block plus its
   `chmod`/`chown` lines. Generated data (sample logs) gets a small shell
   generator that hits the sizes the guide quotes, not a "for example"
   fragment. For the capstone, this section also creates each seeded
   problem, and a table maps problem to seeded state.

Items are `- [ ]` checkboxes with any commands in an indented block under
them. `/lab-setup` ticks them as `- [x] (done <date> via dryrun/setup.sh)`
and adds a dated "vApp status" paragraph under the header.

## SUPPORT.md: notes for the ATC support team

For the support desk once the lab is live. **Plain text, not markdown:** each
section pastes into a plain textarea on the ATC lab form, which renders no
markdown and no bullets. No backticks, bold, headings or list markers; quote
commands with double quotes inline, or one per line for a reset sequence;
separate items with blank lines. Never include the lab password: name the
account and point at the guide's Device Access table.

The first line: "Support notes for <Lab Title>. Internal, never published.
Plain text on purpose: each section below pastes straight into the matching
box on the ATC lab form (the boxes do not render markdown or bullets).
SETUP.md in this folder has the full build checklist." Then three ALL-CAPS
section labels, two blank lines before each:

- LAB NOTES answers the form's "what needs to happen to run this lab": VMs,
  sizing, disks, network, credentials, seeded state that must be present
  (and that a broken start is on purpose), reboot count, portal behavior,
  learner time, build and test status.
- LAB PURPOSE is one paragraph.
- TROUBLESHOOTING opens "Symptoms are listed in the order a learner meets
  them." and has one paragraph per symptom, the symptom as the first
  sentence, then cause, check, and fix, prefixed with the module ("Module 2:
  ..."). It ends with a reset-to-starting-state command sequence and a
  verify paragraph.

LAB NOTES and LAB PURPOSE can be short. Until the vApp has been built and
dry-run, say so up front and call the entries anticipated.

## LISTING.md: the ATC lab form's listing boxes

Same plain-text rules as SUPPORT.md. The first line: "Listing copy for <Lab
Title>. Internal, never published: the course repo ignores labs/ and the lab
repo's .gitignore lists this file. Plain text on purpose: each section below
pastes straight into the matching box on the ATC lab form (the boxes do not
render markdown or bullets). description.md holds the listing description;
SUPPORT.md holds the support notes; SETUP.md holds the build checklist." Then
four ALL-CAPS sections, two blank lines before each:

- SOLUTION OVERVIEW: one paragraph, 5-8 sentences, the same ground as
  `description.md` in different words, in the voice of "In this lab you ...".
- GOALS AND OBJECTIVES: about three goals, one per line with a literal `- `
  prefix (the one place a list marker is allowed, since the box shows it as
  typed). Each names a skill and the artifact or proof it produces.
- TOPOLOGY ALT TEXT: a literal screen-reader description of
  `media/environment/lab-topology.svg`, written by `/lab-topology` once the
  diagram is approved. Until then the section holds `pending /lab-topology`.
- HARDWARE AND SOFTWARE: one line, the VM count and OS
  (`1x Ubuntu 24.04 LTS Server VM`, `3x Ubuntu 24.04 LTS Server VMs`). No
  hostnames, sizing, package, or access lines.

## shots_spec.py: every output screenshot in one place

Every command-output image under `media/module-N/` (and, in the capstone,
under `media/solutions/`) is rendered from one table, so all of them can be
re-rendered together. Log Rotation Tool's is the model:

```python
"""Terminal-screenshot spec for the <Lab Title> lab guide.

Every command-output image under media/module-N/ is generated from the SHOTS
table below by scripts/lab-terminal-shot.py in the course repo. Re-render:

    python3 shots_spec.py                 # all shots
    python3 shots_spec.py sudo-v          # just the named shot(s)

STATUS <YYYY-MM-DD>: anticipated, not captured. <After the dry run: every
output below is a verbatim capture from dryrun/<log>.>
"""
import os, sys, pathlib
from importlib import util
LAB = pathlib.Path(__file__).resolve().parent   # media/ lives beside this file
TOOL = os.environ.get("LAB_SHOT") or LAB.parents[1] / "scripts/lab-terminal-shot.py"
spec = util.spec_from_file_location("shot", TOOL)
shot = util.module_from_spec(spec); spec.loader.exec_module(shot)
P = "labuser@<hostname>:~$ "

SHOTS = {
 (1, "sudo-v"):      [P + "sudo -v", "[sudo] password for labuser: ", P],
 (1, "ip-br-addr"):  [P + "ip -br addr",
                      "lo               UNKNOWN        127.0.0.1/8",
                      "eth0             UP             192.168.10.42/26", P],
}
if __name__ == "__main__":
    only = sys.argv[1:]
    for (m, name), lines in SHOTS.items():
        if only and name not in only: continue
        folder = "solutions" if m == "s" else f"module-{m}"
        shot.render(lines, str(LAB / f"media/{folder}/{name}.png"))
```

Each entry is the prompt plus the command as typed, the output lines, and a
trailing bare prompt (which draws the cursor). Prompts come from the platform
profile with the SETUP.md hostname. The `[sudo] password` line appears only in
`sudo -v` shots. From the lab repo root, `LAB_SHOT` points the file at the
course repo's copy of the renderer.

`/lab` writes the file with every shot the guide references and its
anticipated lines (from the research brief where it has them). `/lab-review`
corrects anticipated lines against its command walk. The dry run replaces
every entry with the real capture and sets the STATUS line; only then are
the PNGs rendered.

## dryrun/: the reproducible build and walk

Everything that changes the VM, and every checkpoint the guide pastes, lives
here, so the build and the dry run repeat without the session that wrote them.

- `states/`: one file per whole-file block in the guide, in guide order,
  named `<basename>.N` for the Nth block that writes that path
  (`rotate.sh.1`, `rotate.sh.2`), or `<dir>.d-<basename>.N` for a file
  inside a `.d` directory (`ssh.socket.d-override.conf.1`,
  `apparmor.d-usr.local.bin.webapp.py.2`). `/lab` writes these with the guide; any later edit to a
  block edits its state file too.
- `check-states.py`: proves each guide block equals its state byte for byte.
  `/lab` writes it into every lab that has a whole-file block:

    ```python
    #!/usr/bin/env python3
    """Every whole-file heredoc in module-*.md (and solutions.md) must equal its
    dryrun/states/ checkpoint byte for byte. The Nth heredoc for a target path, in
    page order, maps to states/<name>.N, where <name> is the file's basename, or
    <dir>.d-<basename> for a file in a .d directory. Run from anywhere."""
    import pathlib, re, sys
    lab = pathlib.Path(__file__).resolve().parent.parent
    docs = lab / "labdocs/docs" if (lab / "labdocs/docs").is_dir() else lab
    states = lab / "dryrun/states"
    pages = sorted(docs.glob("module-*.md")) + sorted(docs.glob("solutions.md"))
    seen, bad, n = {}, 0, 0
    for page in pages:
        lines = page.read_text().split("\n")
        i = 0
        while i < len(lines):
            m = re.match(r"\s*(?:sudo tee|cat >) (\S+)(?: > /dev/null)? << 'EOF'$", lines[i])
            if not m: i += 1; continue
            path = m.group(1); body = []; i += 1
            while lines[i].strip() != "EOF":
                body.append(lines[i][4:] if lines[i].startswith("    ") else lines[i]); i += 1
            p = pathlib.PurePosixPath(path)
            name = f"{p.parent.name}-{p.name}" if p.parent.name.endswith(".d") else p.name
            seen[name] = seen.get(name, 0) + 1
            state = states / f"{name}.{seen[name]}"
            got = "\n".join(body) + "\n"; n += 1
            if not state.exists(): print(f"MISSING {state.name}  ({page.name}:{i})"); bad += 1
            elif state.read_text() != got: print(f"DIFF    {state.name}  ({page.name}:{i})"); bad += 1
            else: print(f"ok      {state.name:34} {page.name}")
    unused = sorted(set(f.name for f in states.iterdir()) - {f"{k}.{j}" for k, v in seen.items() for j in range(1, v + 1)}) if states.is_dir() else []
    if unused: print("UNUSED", unused); bad += 1
    print(f"{n} heredocs checked, {bad} problems"); sys.exit(1 if bad else 0)
    ```

  A `crontab - << 'EOF'` block or another platform's whole-file write needs
  its own pattern added to the regex.
- `setup.sh`, `audit.sh`, `README.md`: written by `/lab-setup` from SETUP.md.
  `setup.sh` is idempotent (a re-run restores the golden state), `audit.sh`
  is read-only, `README.md` is the copy-and-run steps for a human.
- The dry run itself (by hand, after `/lab-setup`): `lib.sh` plus one
  `phase*.sh` per stretch of the guide (or one `walk.sh`), run as the lab
  user, logging every command and its real output under the guide's prompt
  to `/tmp/dryrun.log`; where the guide pastes a whole file, the phase
  script installs the matching `states/` file. The captured log is kept as
  `dryrun-<date>.log`, `shots_spec.py` is reconciled against it, the shots
  are rendered, and `revert.sh` returns the VM to golden (the reset
  SUPPORT.md describes, plus the trace cleanup from `/lab-setup`).
