---
name: lab-topology
description: Draw a lab's environment topology diagram, a blueprint-style SVG of the devices and their IP addresses, at labs/<lab-slug>/media/environment/lab-topology.svg, render and check it, then write the diagram's alt text into the lab's LISTING.md. Use when the user asks for a lab's topology, network diagram, environment diagram, or wants the existing one fixed or redrawn, e.g. "/lab-topology broken-path".
argument-hint: <lab-slug>
---

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Draw the environment diagram for one lab. `$ARGUMENTS` is the lab slug
(`/lab-topology broken-path`). The output is one hand-authored SVG at
`labs/<lab-slug>/media/environment/lab-topology.svg`, the path every lab's
Environment page already references (`![environment](./media/environment/lab-topology.svg)`).

Worked example: the Linux Intermediate course repo's
`labs/broken-path/media/environment/lab-topology.svg` (multi-host, one lab
network). Starter for the common single-VM lab:
`.claude/skills/lab-topology/template.svg`; copy it, rename the host, fix the
role line, done.

## Inputs

- `labs/<lab-slug>/environment.md`: the device table (hosts, addresses,
  roles) and access method, and in a multi-host lab "The Network as
  Designed". The diagram must agree with it exactly: same hostnames, same
  addresses, same prefixes. If the page lists a designed address plan and a
  deliberately broken starting state, draw the **designed** plan. The diagram
  sits right above that table and has no room to explain a mismatch.
- `labs/<lab-slug>/SETUP.md`, for what not to draw: WAN addresses, port
  forwards, and management NICs are provisioning detail, not learner content.

## What goes on the page

**Devices and IP addresses only.** No explanatory callouts, no pre-seeded
"starts broken" lists, no firewall or traffic arrows, no italic asides, no
footer caption. The prose around the image does the explaining.

- **Never draw the management network** (`eth1` / `10.0.0.0/24`), even
  though every lab has one. It plays no part in any exercise.
- **One cloud, not two:** `INTERNET` with `WWT ATC Lab Portal` as its
  subtitle. No separate portal cloud and no dashed "terminal session" line;
  the access path reads through cloud to gateway or VM on its own.
- **The learner is a laptop card labeled `YOU` / `web browser`,** top left,
  linked to the cloud with a two-headed blue `HTTPS` arrow. Its screen is a
  plain browser window (address bar and gray page lines), never a shell
  prompt.
- **Host cards** carry: icon, hostname (16px bold), OS or platform line, one
  role line (`nginx · port 80`, `domain controller`, `your workstation`).
  Their `<interface> · a.b.c.d/nn` label (`eth0`, `Ethernet0`, `Gi0/0/1`)
  sits beside the stub that joins them to the network bus.
- **A gateway or router card** (when the lab has one) shows its lab address
  as a blue port-tag pill on its bottom edge, directly under the router icon,
  with a straight drop line to the bus. Route the drop so it lands on the bus
  clear of any host stub and its label (at least 100px from the nearest stub,
  or anchor that label away from the line).
- **Network container:** a dashed blue rounded rect with a caps label
  `LAB NETWORK · 192.168.10.0/24`, a 3px blue bus, and 4px junction dots with
  a white ring. Single-VM labs need no container at all: laptop, cloud, and
  VM in one row, as in the template.

## Style

Blueprint look, light theme (this renders on a white mkdocs page):

| element | value |
|---|---|
| background | `#f5f8fc` + 20px grid pattern `#dbe4f0` @ 0.7, outer border `#c7d2e0`, rx 10 |
| cards | white, stroke `#64748b` 1.5, rx 10, `feDropShadow` (dy 1.5, blur 1.5, 16%) |
| accent (lab network, router, HTTPS) | `#2563eb`; tag pills `#e0ecff` fill, `#1e40af` text |
| neutral links / cloud stroke | `#94a3b8` / `#64748b` |
| text | `#1e293b` titles, `#334155` body, `#64748b` subtitles |
| font | `'Segoe UI', Helvetica, Arial, sans-serif`; mono `Menlo, Consolas, monospace` |

Icons are simple line art:

- **Router:** rounded rect, two opposing arrows, two antenna stalks, green
  LEDs.
- **Server tower:** three slot bars and LEDs.
- **Terminal window** (the host icon for the learner's workstation): dark,
  traffic-light dots, a short green prompt at 8px such as `$ ip route`,
  `$ _`, `PS> _`, or `Router#`.
- **Laptop:** dark bezel, light browser screen, gray base.
- **Clouds:** draw the circles and rect once with a 3px stroke, then the same
  shapes again fill-only on top. That hides the interior strokes and leaves a
  clean 1.5px outline.

## Layout rules

- Rows share the canvas center. Compute each row's extent and shift so both
  midpoints match (wrap a row in `<g transform="translate(dx,0)">`). The
  first Broken Path draft had the top row 90px left of the lab block, and the
  user asked for it to be centered.
- Trim the canvas to the content plus about 55px margins; no dead space on
  one side.
- Size labels so nothing touches: a 9.5px `eth0 · 192.168.10.80/24` label is
  about 120px wide; check it against any vertical line to its right.
- Text-in-icon rule: mono text at 8px is about 4.8px per character, so a
  60px-wide terminal icon fits about 11 characters. Keep icon strings short
  (`$ ip route`).

## Alt text

Once the diagram is approved, write (or refresh) the `TOPOLOGY ALT TEXT`
section of `labs/<lab-slug>/LISTING.md`, the internal, never-published
plain-text file that pastes into the ATC lab form. One paragraph, literal and
in reading order: "Lab topology diagram. A laptop labeled YOU, web browser,
connects over HTTPS to an Internet cloud labeled WWT ATC Lab Portal, ...",
then each host card with hostname, OS, role, and interface address, the
router's address, and the lab-network label; single-VM labs end with "No lab
network is drawn because the exercises never touch the network." No
markdown, no bullets. Worked examples: the Linux Intermediate labs'
`broken-path/LISTING.md` (multi-host) and `confined-service/LISTING.md`
(single VM). If `LISTING.md` doesn't exist yet, create it from
`.claude/skills/lab/references/internal-docs.md`. The Environment page's
image line stays `![environment](./media/environment/lab-topology.svg)`.

## Verify before handing over

Don't trust `qlmanage`; it crops SVG thumbnails square. Render with headless
Chrome at 2x and read the PNG:

```bash
# macOS. On Windows use "C:\Program Files\Google\Chrome\Application\chrome.exe"
# (or $CHROME) with the same flags.
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=<W>,<H> --screenshot=<scratchpad>/topology.png \
  "file://$PWD/labs/<lab-slug>/media/environment/lab-topology.svg"
```

`<W>,<H>` are the SVG's `width` and `height`. Also check that it's
well-formed XML (`xmllint --noout <file>`, or `python3 -c "import
xml.dom.minidom,sys; xml.dom.minidom.parse(sys.argv[1])" <file>`).

Look for text spilling out of an icon or card, a label crossing a line,
off-center rows, and one-sided dead space. Fix and re-render until clean,
show the user the render, and stop for review. Handle their feedback the
same way, and refresh the alt text whenever the diagram changes.
