---
name: lab-topology
description: Draw a lab's environment topology diagram, a blueprint-style SVG of the devices and their IP addresses, at labs/<lab-slug>/media/environment/lab-topology.svg, then render and check it. Use when the user asks for a lab's topology, network diagram, environment diagram, or wants the existing one fixed or redrawn, e.g. "/lab-topology broken-path".
argument-hint: <lab-slug>
---

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Draw the environment diagram for one lab. `$ARGUMENTS` is the lab slug
(`/lab-topology broken-path`). The output is one hand-authored SVG at
`labs/<lab-slug>/media/environment/lab-topology.svg`, the path every lab's
Environment page already references.

**Starting points:** for the common single-VM lab, copy
`.claude/skills/lab-topology/template.svg`, rename the host, and fix the role
line. For a multi-host lab, use a finished one as the pattern if it's
available (`broken-path` in the Linux Intermediate repo: several hosts on one
lab network).

## Inputs

- `labs/<lab-slug>/environment.md`: the device table (hosts, addresses,
  roles) and access method. The diagram must match it exactly: hostnames,
  addresses, prefixes. If the page lists a designed address plan and a
  deliberately broken starting state, draw the designed plan. The diagram sits
  right above that table and has no room to explain a mismatch.
- `labs/<lab-slug>/SETUP.md`, to know what not to draw. WAN addresses, port
  forwards, and management NICs are provisioning detail, not learner content.

## What goes on the page

Devices and IP addresses only. No explanatory callouts, "starts broken"
lists, firewall or traffic arrows, italic asides, or footer caption. The prose
around the image does the explaining.

- **No management network** (`eth1` / `10.0.0.0/24`), even though every lab
  has one. It plays no part in any exercise.
- **One cloud:** `INTERNET`, subtitled `WWT ATC Lab Portal`. No separate
  portal cloud and no dashed "terminal session" line; the path reads through
  cloud to gateway or VM on its own.
- **The learner** is a laptop card labeled `YOU` / `web browser`, top left,
  linked to the cloud by a two-headed blue `HTTPS` arrow. Its screen is a
  plain browser window (address bar and gray page lines), never a shell
  prompt.
- **Host cards:** icon, hostname (16px bold), OS or platform line, one role
  line (`nginx · port 80`, `domain controller`, `your workstation`). The
  `<interface> · a.b.c.d/nn` label (`eth0`, `Ethernet0`, `Gi0/0/1`) sits
  beside the stub joining the card to the network bus.
- **A gateway or router card**, when there is one, shows its lab address as a
  blue port-tag pill on its bottom edge, directly under the router icon, with
  a straight drop line to the bus. Land the drop at least 100px from the
  nearest host stub and its label, or anchor that label away from the line.
- **Network container:** a dashed blue rounded rect with a caps label
  `LAB NETWORK · 192.168.10.0/24`, a 3px blue bus, and 4px junction dots with
  a white ring. Single-VM labs need no container: laptop, cloud, and VM in one
  row, as in the template.

## Style

Blueprint look on a light theme, since it renders on a white mkdocs page.

| element | value |
|---|---|
| background | `#f5f8fc` + 20px grid pattern `#dbe4f0` @ 0.7, outer border `#c7d2e0`, rx 10 |
| cards | white, stroke `#64748b` 1.5, rx 10, `feDropShadow` (dy 1.5, blur 1.5, 16%) |
| accent (lab network, router, HTTPS) | `#2563eb`; tag pills `#e0ecff` fill, `#1e40af` text |
| neutral links / cloud stroke | `#94a3b8` / `#64748b` |
| text | `#1e293b` titles, `#334155` body, `#64748b` subtitles |
| font | `'Segoe UI', Helvetica, Arial, sans-serif`; mono `Menlo, Consolas, monospace` |

Icons are simple line art:

- **Router:** rounded rect, two opposing arrows, two antenna stalks, green LEDs.
- **Server tower:** three slot bars and LEDs.
- **Terminal window** (the learner's workstation icon): dark, traffic-light
  dots, a short green prompt at 8px such as `$ ip route`, `PS> _`, or
  `Router#`.
- **Laptop:** dark bezel, light browser screen, gray base.
- **Clouds:** draw the circles and rect once with a 3px stroke, then the same
  shapes again fill-only on top. That hides the interior strokes and leaves a
  clean 1.5px outline.

## Layout

- **Center every row on the canvas.** Compute each row's extent and shift it
  so the midpoints match (`<g transform="translate(dx,0)">`). An off-center
  top row is the most common fix the user asks for.
- Trim the canvas to the content plus ~55px margins, with no dead space on one
  side.
- Size labels so nothing touches. A 9.5px `eth0 · 192.168.10.80/24` label is
  about 120px wide; check it against any vertical line to its right.
- Mono text at 8px is about 4.8px per character, so a 60px terminal icon fits
  about 11 characters. Keep icon strings short.

## Verify before handing over

Don't trust `qlmanage`; it crops SVG thumbnails square. Render with headless
Chrome at 2x and look at the PNG:

```bash
# macOS. On Windows use "C:\Program Files\Google\Chrome\Application\chrome.exe"
# (or $CHROME) with the same flags.
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=<W>,<H> --screenshot=<scratchpad>/topology.png \
  "file://$PWD/labs/<lab-slug>/media/environment/lab-topology.svg"
```

`<W>,<H>` are the SVG's `width` and `height`. Also check that it's well-formed
XML (`xmllint --noout <file>`, or `python3 -c "import
xml.dom.minidom,sys; xml.dom.minidom.parse(sys.argv[1])" <file>`).

Look for text spilling out of an icon or card, a label crossing a line,
off-center rows, and one-sided dead space. Fix and re-render until clean, show
the user the render, and stop for review. Handle their feedback the same way.
