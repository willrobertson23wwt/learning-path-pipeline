# Learning Path: The Linux Filesystem (Lab-First Redesign)

**Audience:** New to Linux administration. Can open a terminal and run a command.
**Environment:** Ubuntu 24.04 lab VM with `sudo` access. The commands and output in this path assume this image.
**Total time:** about 2 hours, split into five labs plus a capstone.

---

## Design rules applied

| Research finding | How this path applies it |
|---|---|
| **Doer effect** (Koedinger): practice beats watching about 6:1 | At least 80% of the time is spent at the terminal. There are no standalone lecture modules. |
| **4C/ID: supportive versus procedural information** | Big mental models ("one tree", "names point to inodes") go in the briefing and on a reference card. How-to help (GIFs, command hints) appears at the step that needs it. |
| **Productive failure** (Sinha & Kapur) | Conceptual moments follow predict, then try, then watch. The explainer video comes after the attempt, never before. |
| **Animation for procedures, short segments** (Höffler & Leutner; Guo) | GIFs run 5 to 15 seconds and loop. Videos run 30 to 90 seconds, cover one idea, and have pause, scrub, and captions. |
| **Transient information effect** | Anything learners look up repeatedly (the directory map, the permission bits table) is a static reference card, not a video. |
| **Guided for novices** (Kirschner et al.) | Labs 1 and 2 give exact commands and expected output. |
| **Fading and expertise reversal** (Kalyuga) | Guidance drops with each lab. The capstone gives goals only. A pre-check lets experienced learners skip ahead. Every video is optional and labeled with its length. |

### Media types

- **GIF**: 5-15 s, silent loop (a muted MP4 with a pause control). Shows where to click or what to type. Placed before the step.
- **Micro-video**: 30-90 s, narrated, one idea. Explains why. Placed after a predict or try step.
- **Reference card**: Static, always one click away, for lookup.
- **Predict**: The learner commits to an answer (multiple choice or free text) before running the command.

---

## Path overview

| # | Module | Guidance level | Time | Media |
|---|---|---|---|---|
| 0 | Pre-check and Briefing | None | 5 min | Briefing video (2:30), Filesystem Map card |
| 1 | Moving Around the Tree | Full commands and expected output | 15 min | 2 GIFs, 1 video |
| 2 | Where Things Live | Full commands, predict prompts | 20 min | 1 GIF, 2 videos |
| 3 | Inodes and Links | New commands given, goals for known ones | 20 min | 1 video |
| 4 | Ownership and Permissions | Goal plus hint | 25 min | 1 GIF, 2 videos, Permission Bits card |
| 5 | Disks and Mounts | Goal plus collapsed hint | 20 min | 1 video |
| C | Capstone: "The Server Is Misbehaving" | Goals only, auto-checks | 20 min | Links back to earlier videos only |

---

## Module 0: Pre-check and Briefing

**Pre-check (skip-ahead gate).** Each correct answer to these five quick questions unlocks **Skip to** for the matching lab:
1. You're in `/var/log`. Where does `cd ../../etc` put you?
2. Which directory holds system-wide configuration files?
3. You delete a file that has a hard link. Can you still read the data?
4. What does `chmod 750 script.sh` allow the group to do?
5. You mount a disk on a directory that already has files in it. What happens to those files?

**Briefing video (2:30): One Tree, Everything Hangs off It.** It gives the supportive information up front:
- There are no drive letters. Everything starts at `/`.
- Directories have jobs: config, logs, programs, user data, and temporary files.
- Disks, USB drives, and even kernel data get attached into the tree (mounting).
- "Everything is a file", including devices and process information.

**Reference card: Filesystem Map.** A single diagram of `/` with the main directories and a one-line purpose for each (`/etc`, `/var`, `/home`, `/usr`, `/tmp`, `/proc`, `/dev`, `/mnt`, `/opt`, `/boot`). It stays pinned in the lab sidebar for the whole path.

---

## Lab 1: Moving Around the Tree (fully guided)

1. Run `pwd`. Expected output: `/home/labuser`.
2. Run `cd /` and then `ls`. Compare what you see to the Filesystem Map card.
3. **GIF (8 s): Tab Completion.** Shows typing `cd /us`, pressing **Tab**, and the shell completing it to `/usr/`.
   Now type `cd /usr/sh` and press **Tab**. Then run `ls`.
4. Run `cd ~`, then `cd -`, then `cd ~` again. Run `pwd` after each one.
5. **GIF (10 s): Hidden Files.** Shows `ls` next to `ls -a` in the home directory. The dotfiles appear.
6. **Predict:** You're in `/var/log`. Where will `cd ../../etc` take you?
   Run `cd /var/log && cd ../../etc && pwd` to confirm.
7. **Video (60 s): Absolute vs. Relative Paths.** An animation shows the same destination reached from two starting points. Paths that start with `/` always start from the root.

**Check:** An auto-check confirms the learner ran `pwd` from `/etc`.

---

## Lab 2: Where Things Live (guided, predict-heavy)

1. **Predict:** Which directory holds your system's hostname setting?
   - a. `/home`
   - b. `/etc`
   - c. `/var`
   - d. `/usr`

   Run `cat /etc/hostname`.
2. Run `cat /etc/os-release`. Note the distribution and version.
3. Logs: run `ls /var/log`, then `sudo tail -n 5 /var/log/syslog`.
   Why is it `/var`? The directory holds "variable" data that grows while the system runs.
4. Programs: run `which ls`.
   **Predict:** Is `/bin` a real directory? Run `ls -ld /bin` to confirm.

   <details><summary>Reveal</summary>

   No. The output shows `/bin -> usr/bin`, so `/bin` is a symlink to `usr/bin`.
   </details>
5. **GIF (12 s): Reading `ls -l` Output.** Highlights the `l` file type and the `->` arrow on a symlink. Short procedural help, placed right before the learner needs it.
6. **Predict:** How big, in bytes, is `/proc/cpuinfo` on disk?
   Run `ls -l /proc/cpuinfo`. The size column shows `0`.
   Then run `wc -c /proc/cpuinfo`. It counts thousands of bytes.
7. **Video (75 s): Virtual Filesystems.** The `/proc` and `/sys` directories aren't on disk. The kernel generates their contents on demand when you read them. This is a productive-failure moment: the surprise sets up the explanation.
8. **Video (45 s, optional): What `/usr` Actually Means.** A short history of the merge of `/bin` into `/usr/bin`, for curious learners.

**Check:** The learner answers "Which directory would you look in for a service's config? And for its logs?"

---

## Lab 3: Inodes and Links (fully written example)

> **Goal:** Explain what a filename is, and why a hard link survives deletion and a symlink doesn't.

**Setup.** Create a working directory and a file, then list the file with its inode number:
```bash
mkdir ~/linklab && cd ~/linklab
echo "hello" > original.txt
ls -li original.txt
```
The first column is the *inode number*. The third column is the *link count*, which is `1` right now.

**Step 1: Make two kinds of links.** The next commands create a hard link and a symlink to `original.txt`, then list the directory with inode numbers.

**Predict:** Which files will share an inode number? What will the link count on `original.txt` be?

Run the commands and compare the output with your prediction:
```bash
ln original.txt hard.txt
ln -s original.txt soft.txt
ls -li
```

<details><summary>Reveal</summary>

The files `original.txt` and `hard.txt` share an inode, and the link count is `2`. The symlink `soft.txt` has its own inode and shows `soft.txt -> original.txt`.
</details>

**Step 2: Break something on purpose.** The next commands remove the original, then read both links.

**Predict:** Which `cat` command works?

Run:
```bash
rm original.txt
cat hard.txt
cat soft.txt
```

<details><summary>Reveal</summary>

Reading `hard.txt` prints `hello`. Reading `soft.txt` fails with `No such file or directory`, and `ls -l` shows it as a dangling link.
</details>

**Video (90 s): Names, Inodes, and Data.** An animation shows three layers: directory entry, inode, and data blocks. A hard link is a second name pointing at the same inode. A symlink is a tiny file that stores a path. Deleting a name only removes that pointer, and the data is freed when the link count reaches 0. The video comes after the learner has seen the surprise, not before.

**Step 3: Apply the model.** The next commands recreate the original, then read both links again.

**Predict:** What does each `cat` command print? Use the model from the video.

Run:
```bash
echo "back" > original.txt
cat soft.txt
cat hard.txt
```

<details><summary>Reveal</summary>

The symlink `soft.txt` prints `back` because its path resolves again. The hard link `hard.txt` still prints `hello` because it points to the old inode.
</details>

**Optional:** Try to create a hard link to a directory with `ln /etc ~/etclink`. The command fails. Read the error it prints. Why might Linux forbid hard links to directories?

**Auto-check:**
- `hard.txt` exists with link count 1: `stat -c %h ~/linklab/hard.txt` returns `1`.
- `soft.txt` resolves: `readlink -e ~/linklab/soft.txt` succeeds.

---

## Lab 4: Ownership and Permissions (goal plus hint)

**Reference card: Permission Bits.** The card covers `rwx`, octal values (4, 2, and 1), user, group, and other, and what `r`, `w`, and `x` mean on a directory versus a file. It's static, so learners can glance back at it.

1. **GIF (10 s): Decoding `-rwxr-x---`.** The string gets split into its type, user, group, and other segments.
   **Goal:** Explain the permissions on `/etc/shadow` and `/usr/bin/passwd` (use `ls -l`).
2. **Goal:** Make `~/permlab/run.sh` (pre-seeded, mode `644`) executable by you and your group, with no access for others.
   **Hint (collapsed):** The `chmod` command supports both symbolic forms such as `u+x,g+x` and octal forms.
3. **Video (60 s): Octal Permissions in 60 Seconds.** Placed after the learner's first attempt at step 2.
4. **Predict:** Can you delete a file you can't write to? Create one with `echo secret > locked.txt && chmod 444 locked.txt`, then try `rm locked.txt`.

   <details><summary>Reveal</summary>

   Yes. The `rm` command asks for confirmation, and after you answer `y` the file is deleted.
   </details>
5. **Goal:** Now make the `~/permlab` directory read-only (`chmod 555 ~/permlab`) and try to create or delete a file inside it. Then restore it with `chmod 755 ~/permlab`.
6. **Video (75 s): Deleting Is a Directory Operation.** The video explains why deletion depends on the directory's `w` bit, not the file's. It builds on the names-and-inodes model from the links lab: the `rm` command removes a name from a directory.

**Check:** The `run.sh` file has mode `770` or `750` (the auto-check accepts either), and `~/permlab` is back to `755`.

---

## Lab 5: Disks and Mounts (goal plus collapsed hints)

1. **Goal:** Find how much free space the root filesystem has, and list the block devices.
   **Hint:** `df -h`, `lsblk`, and `findmnt`.
2. **Goal:** Create a 100 MiB virtual disk and format it as ext4.
   **Hint:**
   ```bash
   truncate -s 100M ~/disk.img
   mkfs.ext4 ~/disk.img
   ```
3. Set up a directory with a file in it:
   ```bash
   sudo mkdir -p /mnt/data
   echo "I was here first" | sudo tee /mnt/data/before.txt
   ```
   **Predict:** You mount the new disk on `/mnt/data`. What happens to `before.txt`?
   - a. It gets deleted.
   - b. It gets copied onto the new disk.
   - c. It's hidden.
   - d. The mount fails.
4. Mount the disk and look:
   ```bash
   sudo mount -o loop ~/disk.img /mnt/data
   ls /mnt/data
   ```
   Only `lost+found` shows. Now unmount and look again:
   ```bash
   sudo umount /mnt/data
   ls /mnt/data
   ```
   The `before.txt` file is back.
5. **Video (80 s): Mounting Is Grafting.** An animation shows a new tree being attached over a branch and hiding what was under it. It ties back to the briefing's "one tree" idea.

**Check:** The `disk.img` file is an ext4 filesystem (checked with `blkid`), and `before.txt` exists.

---

## Capstone: "The Server Is Misbehaving" (goals only)

The lab environment is pre-seeded with three problems. There are no new videos. The sidebar links back to earlier ones, labeled "Rewatch: inodes (90 s)" and so on, and the reference cards stay available.

> A teammate reports three issues on this server. Fix each one:
> 1. Disk usage under `/var` has grown sharply. Find the largest file and report its path.
> 2. The `/opt/app/current` symlink should point to the latest release, but the app won't start.
> 3. The `deploy` group needs to run `/opt/app/current/start.sh`, but gets `Permission denied`.

What's seeded, and what the auto-check verifies:
- A 400 MB file at `/var/tmp/.cache/core.dump`. The learner submits its path.
- The `/opt/app/current` symlink points to a deleted `release-1.2`, and `release-1.3` exists. The check confirms `readlink -e` resolves to `release-1.3`.
- The `start.sh` file is mode `640`. The check confirms the group has execute permission.

Hints are hidden behind a **Stuck?** button that costs nothing but gets logged. The log shows where the path's teaching is weak.

---

## Production inventory

| Asset | Count | Length each | Notes |
|---|---|---|---|
| Briefing video | 1 | 2:30 | The only video before any hands-on work |
| Micro-videos | 7 | 45-90 s | Narrated, captioned, one idea each, most placed after a predict step |
| GIFs | 4 | 8-12 s | Silent, looping, UI or command mechanics only |
| Reference cards | 2 | n/a | Filesystem Map, Permission Bits |
| Auto-check scripts | 6 | n/a | One per lab plus the capstone |

That's about 11 minutes of video in total for about 2 hours of learning, which is roughly the reverse of a typical video-then-lab path.

## Measuring whether it works

- **Hint and Stuck? click rate per step.** Shows where the guidance fades too fast.
- **Video watch rate per clip.** Low watch rates on optional clips are fine. High rewatch rates flag a concept that needs a better lab step.
- **Predict accuracy.** This should start low (that's the point) and improve on the "apply the model" steps.
- **Capstone completion without hints.** This is the real transfer measure.
- **If possible, A/B one module** (for example, Lab 3) against your current video-then-lab version, using the same capstone as the outcome measure.
