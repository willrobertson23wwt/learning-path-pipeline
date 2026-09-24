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
| **Transient information effect** | Anything learners look up repeatedly (the directory map, the permission bits table) is a static reference card, not a video, placed inline at the step that first needs it. |
| **Guided for novices** (Kirschner et al.) | Labs 1 and 2 give exact commands and expected output. |
| **Fading and expertise reversal** (Kalyuga) | Guidance drops with each lab. The capstone gives goals only. Every video is optional and labeled with its length. |

### Media types

- **GIF**: 5-15 s, silent loop (a muted MP4 with a pause control). Shows where to click or what to type. Placed before the step.
- **Micro-video**: 30-90 s, narrated, one idea. Explains why. Placed after a predict or try step.
- **Reference card**: Static, for lookup. Placed inline at the step that first needs it, as the image plus a text version.
- **Predict**: The learner commits to an answer (multiple choice or free text) before running the command.

### Lab structure

- Each lab is its own lab repo with the same page set. Only the number of module pages varies, and each lab's module list sets it.
- A module covers one skill or one fault, runs about 10 to 20 minutes, and ends on a working state. The final module closes the lab with a workflow summary and Congratulations.
- Every lab here runs on one VM, so none needs a `_quickref_passwords.md` page. A lab with more than one device would add one.
- The capstone is its own lab repo too, a challenge lab with each problem's full solution collapsed under it and all the solutions again on a Solutions page (`solutions.md`) after its last module. No other lab has a Solutions page.

---

## Path overview

| # | Lab | Guidance level | Modules | Time | Media |
|---|---|---|---|---|---|
| 0 | Briefing | None | n/a | 5 min | Briefing video (2:30) |
| 1 | Moving Around the Tree | Full commands and expected output | 1 | 15 min | 2 GIFs, 1 video, Filesystem Map card |
| 2 | Where Things Live | Full commands, predict prompts | 2 | 20 min | 1 GIF, 2 videos |
| 3 | Inodes and Links | New commands given, goals for known ones | 2 | 20 min | 1 video |
| 4 | Ownership and Permissions | Goal plus hint | 2 | 25 min | 1 GIF, 2 videos, Permission Bits card |
| 5 | Disks and Mounts | Goal plus collapsed hint | 2 | 20 min | 1 video |
| C | Capstone: "The Server Is Misbehaving" | Goals only | 2, then Solutions | 20 min | Links back to earlier videos only |

---

## Module 0: Briefing

**Briefing video (2:30): One Tree, Everything Hangs off It.** It gives the supportive information up front:
- There are no drive letters. Everything starts at `/`.
- Directories have jobs: config, logs, programs, user data, and temporary files.
- Disks, USB drives, and even kernel data get attached into the tree (mounting).
- "Everything is a file", including devices and process information.

---

## Lab 1: Moving Around the Tree (fully guided)

| # | Module | Scope | Time |
|---|---|---|---|
| 1 | Find Your Way from the Root | Read the tree from `/`, complete paths with Tab, and reach one place by absolute and relative paths | 15 min |

### Module 1: Find Your Way from the Root

1. Run `pwd`. Expected output: `/home/labuser`.
2. **Reference card: Filesystem Map.** A single diagram of `/` with the main directories and a one-line purpose for each (`/etc`, `/var`, `/home`, `/usr`, `/tmp`, `/proc`, `/dev`, `/mnt`, `/opt`, `/boot`). It appears here, where it's first needed, as the image plus a text version.
   Run `cd /` and then `ls`. Compare what you see to the Filesystem Map card.
3. **GIF (8 s): Tab Completion.** Shows typing `cd /us`, pressing **Tab**, and the shell completing it to `/usr/`.
   Now type `cd /usr/sh` and press **Tab**. Then run `ls`.
4. Run `cd ~`, then `cd -`, then `cd ~` again. Run `pwd` after each one.
5. **GIF (10 s): Hidden Files.** Shows `ls` next to `ls -a` in the home directory. The dotfiles appear.
6. **Predict:** You're in `/var/log`. Where will `cd ../../etc` take you?
   Run `cd /var/log && cd ../../etc && pwd` to confirm.
7. **Video (60 s): Absolute vs. Relative Paths.** An animation shows the same destination reached from two starting points. Paths that start with `/` always start from the root.

---

## Lab 2: Where Things Live (guided, predict-heavy)

| # | Module | Scope | Time |
|---|---|---|---|
| 1 | Find the Configuration and the Logs | Locate the hostname, release, and log files under `/etc` and `/var` | 10 min |
| 2 | Tell Real Files from Virtual Ones | Follow the `/bin` symlink and measure a `/proc` file that reports 0 bytes | 10 min |

### Module 1: Find the Configuration and the Logs

1. **Predict:** Which directory holds your system's hostname setting?
   - a. `/home`
   - b. `/etc`
   - c. `/var`
   - d. `/usr`

   Run `cat /etc/hostname`.
2. Run `cat /etc/os-release`. Note the distribution and version.
3. Logs: run `ls /var/log`, then `sudo tail -n 5 /var/log/syslog`.
   Why is it `/var`? The directory holds "variable" data that grows while the system runs.

### Module 2: Tell Real Files from Virtual Ones

1. Programs: run `which ls`.
   **Predict:** Is `/bin` a real directory? Run `ls -ld /bin` to confirm.

   <details><summary>Reveal</summary>

   No. The output shows `/bin -> usr/bin`, so `/bin` is a symlink to `usr/bin`.
   </details>
2. **GIF (12 s): Reading `ls -l` Output.** Highlights the `l` file type and the `->` arrow on a symlink. Short procedural help, placed right before the learner needs it.
3. **Predict:** How big, in bytes, is `/proc/cpuinfo` on disk?
   Run `ls -l /proc/cpuinfo`. The size column shows `0`.
   Then run `wc -c /proc/cpuinfo`. It counts thousands of bytes.
4. **Video (75 s): Virtual Filesystems.** The `/proc` and `/sys` directories aren't on disk. The kernel generates their contents on demand when you read them. This is a productive-failure moment: the surprise sets up the explanation.
5. **Video (45 s, optional): What `/usr` Actually Means.** A short history of the merge of `/bin` into `/usr/bin`, for curious learners.

---

## Lab 3: Inodes and Links (fully written example)

> **Goal:** Explain what a filename is, and why a hard link survives deletion and a symlink doesn't.

| # | Module | Scope | Time |
|---|---|---|---|
| 1 | Make Hard Links and Symlinks | Create both kinds of link and compare their inode numbers and link counts | 10 min |
| 2 | Break a Link and Explain It | Delete the original, explain the result with the inode model, and apply the model to a recreated file | 10 min |

### Module 1: Make Hard Links and Symlinks

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

### Module 2: Break a Link and Explain It

**Step 1: Break something on purpose.** The next commands remove the original, then read both links.

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

**Step 2: Apply the model.** The next commands recreate the original, then read both links again.

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

---

## Lab 4: Ownership and Permissions (goal plus hint)

| # | Module | Scope | Time |
|---|---|---|---|
| 1 | Read and Set Permission Bits | Decode two system files' modes, then make a pre-seeded script executable for its owner and group | 15 min |
| 2 | Delete Through the Directory | Delete a read-only file, lock a directory, and restore it | 10 min |

### Module 1: Read and Set Permission Bits

1. **GIF (10 s): Decoding `-rwxr-x---`.** The string gets split into its type, user, group, and other segments.
   **Reference card: Permission Bits.** The card covers `rwx`, octal values (4, 2, and 1), user, group, and other, and what `r`, `w`, and `x` mean on a directory versus a file. It appears here, at the first step that reads a mode, and it's static, so learners can glance back at it.
   **Goal:** Explain the permissions on `/etc/shadow` and `/usr/bin/passwd` (use `ls -l`).
2. **Goal:** Make `~/permlab/run.sh` (pre-seeded, mode `644`) executable by you and your group, but not by others.
   **Hint (collapsed):** The `chmod` command supports both symbolic forms such as `u+x,g+x` and octal forms.
3. **Video (60 s): Octal Permissions in 60 Seconds.** Placed after the learner's first attempt at step 2.

### Module 2: Delete Through the Directory

1. **Predict:** Can you delete a file you can't write to? Create one with `echo secret > locked.txt && chmod 444 locked.txt`, then try `rm locked.txt`.

   <details><summary>Reveal</summary>

   Yes. The `rm` command asks for confirmation, and after you answer `y` the file is deleted.
   </details>
2. **Goal:** Now make the `~/permlab` directory read-only (`chmod 555 ~/permlab`) and try to create or delete a file inside it. Then restore it with `chmod 755 ~/permlab`.
3. **Video (75 s): Deleting Is a Directory Operation.** The video explains why deletion depends on the directory's `w` bit, not the file's. It builds on the names-and-inodes model from the links lab: the `rm` command removes a name from a directory.

---

## Lab 5: Disks and Mounts (goal plus collapsed hints)

| # | Module | Scope | Time |
|---|---|---|---|
| 1 | Survey and Build a Disk | Report free space and block devices, then create and format a 100 MiB disk image | 10 min |
| 2 | Mount over a Directory | Mount the image over a directory that holds a file, then unmount and find the file again | 10 min |

### Module 1: Survey and Build a Disk

1. **Goal:** Find how much free space the root filesystem has, and list the block devices.
   **Hint:** `df -h`, `lsblk`, and `findmnt`.
2. **Goal:** Create a 100 MiB virtual disk and format it as ext4.
   **Hint:**
   ```bash
   truncate -s 100M ~/disk.img
   mkfs.ext4 ~/disk.img
   ```

### Module 2: Mount over a Directory

1. Set up a directory with a file in it:
   ```bash
   sudo mkdir -p /mnt/data
   echo "I was here first" | sudo tee /mnt/data/before.txt
   ```
   **Predict:** You mount the new disk on `/mnt/data`. What happens to `before.txt`?
   - a. It gets deleted.
   - b. It gets copied onto the new disk.
   - c. It's hidden.
   - d. The mount fails.
2. Mount the disk and look:
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
3. **Video (80 s): Mounting Is Grafting.** An animation shows a new tree being attached over a branch and hiding what was under it. It ties back to the briefing's "one tree" idea.

---

## Capstone: "The Server Is Misbehaving" (goals only)

The capstone is its own lab repo, pre-seeded with three problems. There are no new videos. Each problem links back to the earlier video it draws on, labeled "Rewatch: Names, Inodes, and Data (90 s)" and so on.

| # | Module | Scope | Time |
|---|---|---|---|
| 1 | Find What Filled the Disk | Problem 1: find the largest file under `/var` and report its path | 10 min |
| 2 | Get the App Starting Again | Problems 2 and 3: repoint the `current` symlink and let the `deploy` group run `start.sh` | 10 min |

Module 2 closes the lab with the workflow summary and Congratulations. A Solutions page follows it, with the full solution to each problem.

> A teammate reports three issues on this server. Fix each one:
> 1. Disk usage under `/var` has grown sharply. Find the largest file and report its path.
> 2. The `/opt/app/current` symlink should point to the latest release, but the app won't start.
> 3. The `deploy` group needs to run `/opt/app/current/start.sh`, but gets `Permission denied`.

What's seeded:
- A 400 MB file at `/var/tmp/.cache/core.dump`.
- The `/opt/app/current` symlink points to a deleted `release-1.2`, and `release-1.3` exists.
- The `start.sh` file in `release-1.3` is mode `640`, group `deploy`.

Each problem's full solution sits collapsed under it, and the Solutions page repeats all three:
1. `sudo du -ah /var | sort -h | tail -n 5` lists the largest entries, hidden directories included, and shows `/var/tmp/.cache/core.dump`.
2. `ls -l /opt/app` shows `current` pointing at the missing `release-1.2`. `sudo ln -sfn /opt/app/release-1.3 /opt/app/current` repoints it in place.
3. The file's group bits are `r--`, and running a script needs `x`. `sudo chmod g+x /opt/app/current/start.sh` lets the `deploy` group run it.

---

## Production inventory

| Asset | Count | Length each | Notes |
|---|---|---|---|
| Briefing video | 1 | 2:30 | The only video before any hands-on work |
| Micro-videos | 7 | 45-90 s | Narrated, captioned, one idea each, most placed after a predict step |
| GIFs | 4 | 8-12 s | Silent, looping, UI or command mechanics only |
| Reference cards | 2 | n/a | Filesystem Map, Permission Bits |

That's about 11 minutes of video in total for about 2 hours of learning, which is roughly the reverse of a typical video-then-lab path.
