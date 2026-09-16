---
name: lab-topology
description: Draw a lab's environment topology diagram (blueprint-style SVG of the devices and their IP addresses) for labs/<lab-slug>/media/environment/lab-topology.svg
---

Draw the environment diagram for one lab. `$ARGUMENTS` is the lab slug
(e.g. `/lab-topology broken-path`). Output is a single hand-authored SVG at
`labs/<lab-slug>/media/environment/lab-topology.svg` — the path every lab's
`environment.md` already references.

Worked example: `labs/broken-path/media/environment/lab-topology.svg`
(multi-host, one lab network). Starter for the common single-VM lab:
`.claude/skills/lab-topology/template.svg` — copy it, rename the host, fix the
role line, done.

## Inputs

- `labs/<lab-slug>/environment.md` — the device table (hosts, addresses,
  roles) and access method. The diagram must agree with it exactly: same
  hostnames, same addresses, same prefixes. If the environment doc lists a
  "designed" address plan AND a deliberately broken starting state, draw the
  **designed** plan — the diagram sits right above that table and has no room
  to explain a mismatch.
- `labs/<lab-slug>/SETUP.md` — for what NOT to draw (WAN addresses, port
  forwards, management NICs are provisioning detail, not learner content).

## What goes on the page (house rules)

**Devices and IP addresses only.** No explanatory callouts, no pre-seeded
"starts broken" lists, no firewall/traffic arrows, no italic asides, no footer
caption. The prose around the image does the explaining.

- **Never draw the management network** (`eth1` / `10.0.0.0/24`), even though
  every lab has one. It plays no part in any exercise.
- **One cloud, not two:** `INTERNET` with `WWT ATC Lab Portal` as its subtitle.
  Do not draw a separate portal cloud or a dashed "terminal session" line —
  the access path reads through cloud → gateway/VM on its own.
- **The learner is a laptop card labeled `YOU` / `web browser`,** top-left,
  linked to the cloud with a two-headed blue `HTTPS` arrow. Its screen is a
  plain browser window (address bar + gray page lines) — never a shell prompt.
- **Host cards** carry: icon, hostname (16px bold), OS/platform line, one role
  line (`nginx · port 80`, `domain controller`, `your workstation`). Their
  `<interface> · a.b.c.d/nn` label (`eth0`, `Ethernet0`, `Gi0/0/1`) sits beside
  the stub that joins them to the network bus.
- **A gateway/router card** (when the lab has one) shows its lab address as a
  blue port-tag pill on its bottom edge, placed directly under the router icon,
  with a straight drop line to the bus. Route the drop so it lands on the bus
  clear of any host stub and its label (≥ 100px from the nearest stub, or
  anchor that label away from the line).
- **Network container:** dashed blue rounded rect with a caps label
  `LAB NETWORK · 192.168.10.0/24`, a 3px blue bus, 4px junction dots with a
  white ring. Single-VM labs need no container at all — laptop → cloud → VM in
  one row (see the template).

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

Icons are simple line art: router (rounded rect, two opposing arrows, two
antenna stalks, green LEDs), server tower (three slot bars + LEDs), terminal
window (dark, traffic-light dots, a short green prompt at 8px such as
`$ ip route`, `PS> _` or `Router#` — this is the host icon for the learner's
workstation), laptop (dark bezel, light
browser screen, gray base). **Clouds:** draw the circles+rect once with a 3px
stroke, then the same shapes again fill-only on top — that hides the interior
strokes and leaves a clean 1.5px outline.

## Layout rules

- Rows share the canvas center. Compute each row's extent and shift so both
  midpoints match (wrap a row in `<g transform="translate(dx,0)">`) — the first
  broken-path draft had the top row 90px left of the lab block and the user
  asked for it to be centered.
- Trim the canvas to the content plus ~55px margins; no dead space on one side.
- Size labels so nothing touches: a 9.5px `eth0 · 192.168.10.80/24` label is
  ~120px wide — check it against any vertical line to its right.
- Text-in-icon rule: mono text at 8px is ~4.8px/char; a 60px-wide terminal
  icon fits ~11 chars. Keep icon strings short (`$ ip route`).

## Verify (required before handing over)

`qlmanage` crops SVG thumbnails square — do not trust it. Render with headless
Chrome at 2x and READ the PNG:

```bash
# macOS (Windows: "C:\Program Files\Google\Chrome\Application\chrome.exe";
# or whatever $CHROME points at — same flags on both)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=<W>,<H> --screenshot=<scratchpad>/topology.png \
  "file://$PWD/labs/<lab-slug>/media/environment/lab-topology.svg"
```

(`<W>,<H>` = the SVG's `width`/`height`.) Also check the file is well-formed
XML (`xmllint --noout` on macOS/Linux, or `python3 -c "import
xml.dom.minidom,sys; xml.dom.minidom.parse(sys.argv[1])" <file>` anywhere).
Look for: text spilling out of an icon or card, a label crossing a line, rows
off-center, one-sided dead space. Fix and re-render until clean, then show the
user the render and STOP for review. Iterate on their feedback the same way.
