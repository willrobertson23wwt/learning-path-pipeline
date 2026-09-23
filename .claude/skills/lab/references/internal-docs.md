# SETUP.md and SUPPORT.md

Two internal files that live beside the guide but are never shown to
learners. The course repo ignores `labs/`; `labs/**/SETUP.md` is gitignored,
and each lab repo's `.gitignore` lists `SUPPORT.md`, so never copy either
into a lab repo.

## SETUP.md: the build checklist

For whoever builds the ATC VM. A plain checkbox punch list, not a script.

1. A dated `Status <YYYY-MM-DD>:` paragraph at the top saying what the latest
   pass did and whether the VM has been built and dry-run.
2. Base image and accounts, and the hostname (pick `<lab-word>-lab` if the
   guide doesn't need a specific one, and say so). Journal lines and prompts
   in the guide depend on it.
3. **vApp edge firewall:** a rules table for the vCloud Director edge. Inbound
   allows only the portal SSH ports to the gateway or lab VM. Outbound allows
   only what the guide's commands need (for example ICMP, UDP 33434-33534 for
   traceroute, 53 for DNS). Default deny with logging on. Add a note to open
   TCP 80/443 outbound temporarily for package updates (`apt`, Windows
   Update, `install add`) during image maintenance. `/lab-build` parses this
   table.
4. Packages, features, and licenses to verify or install.
5. Confirm a clean slate: no leftovers from building the checklist itself.
6. A final dry-run, reset, and snapshot step.
7. `## Pre-seeded files (exact content)`: a table of paths, then paste-ready
   `tee ... <<'EOF'` blocks with the `chmod`/`chown` lines for each file.
   Generated data (sample logs) gets a small shell generator that hits the
   sizes the guide quotes, not a "for example" fragment. This section is the
   spec for the environment automation, so be precise about files, sizes,
   services, and running config. For the capstone, this section also creates
   each seeded problem.
8. `## Portal checks`: one row per check the guide names, for whoever wires
   the checks into the lab portal:

   | ID | Page | Runs on | Command (as root) | Passes when | On the starting state | Fail message |
   |---|---|---|---|---|---|---|
   | `l4-run-sh` | Module 1 | lab VM | `stat -c %a /home/labuser/permlab/run.sh` | output is `770` or `750` | prints `644`, fails | `run.sh` is not yet executable by you and your group, with no access for others. |

   Every check is non-interactive, safe to run repeatedly, and changes
   nothing. Prefer a command whose exit code is the verdict (`test`,
   `grep -q`, `readlink -e`); otherwise state the exact passing output. Each
   check must fail on the starting state and pass on the finished one; the
   "On the starting state" column proves the first half. The fail message is
   for the portal to show the learner when the check fails, and for
   SUPPORT.md's troubleshooting paragraph: one sentence, in the page's words,
   naming the condition that isn't met, never the check command or blame
   (style guide V5).

## SUPPORT.md: notes for the support team

For the ATC support team once the lab is live. **Plain text, not markdown.**
Each section is pasted into a plain textarea on the ATC lab form, which
renders no markdown or bullets.

- No backticks, bold, headings, or list markers. Quote commands inline with
  double quotes, or one per line for a reset sequence. Separate items with
  blank lines.
- Never include the lab password. Name the account and point at the guide's
  Device Access table.
- Until the VM has been built and dry-run, say so at the top and call the
  entries anticipated.

Three ALL-CAPS section labels:

- LAB NOTES answers the form's question "what needs to happen to run this
  lab": VMs, sizing, disks, network, credentials, seeded state that must be
  present, reboot count, portal behavior, learner time, build and test status.
- LAB PURPOSE is one paragraph.
- TROUBLESHOOTING has one paragraph per symptom, in module order, with the
  symptom as the first sentence, then cause, check, and fix. Include a
  paragraph for each portal check a learner is likely to fail, naming the
  check by what it verifies. End with a reset-to-starting-state command
  sequence and a verify paragraph.
- For the capstone, LAB NOTES says that opening a "Stuck?" hint is logged.

LAB NOTES and LAB PURPOSE can be short.
