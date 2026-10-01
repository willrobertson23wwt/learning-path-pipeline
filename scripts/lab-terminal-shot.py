#!/usr/bin/env python3
"""Render a fake ATC-portal terminal capture (green on black) to PNG.

Matches the look of the hand-taken portal screenshots in labs/*/media:
787px wide, pure black background, #548b41 text, 16px Menlo at 21.6px line
height, block cursor after the final prompt. Uses headless Google Chrome (macOS, Windows, Linux; override with $CHROME).

usage:
  scripts/lab-terminal-shot.py OUT.png < lines.txt
  scripts/lab-terminal-shot.py OUT.png "labuser@client01:~$ ip -br addr" "lo  UNKNOWN  127.0.0.1/8" ...

Every argument (or stdin line) is one terminal line, printed verbatim. End with
a bare prompt line (e.g. "labuser@client01:~$ ") to get the cursor after it.

Options (all off by default, so existing shots render unchanged):
  --cols N   terminal width in columns; the image is round(N x 9.63) + 2 px wide
             (a 105-column ATC portal tab is 1013 px, measured 2026-09-30), and
             long lines hard-wrap at exactly N characters, as the terminal does.
  --fit      with --cols: the image is only as wide as its longest line (+1 cell
             for the cursor), so short output isn't shrunk to fit the page column.
  --scale S  device pixel ratio (2 = sharp on Retina); the page must then set the
             display width, which render() returns: ![alt](src){: width="W" }.
  ANSI SGR color escapes in a line ("\x1b[34m...\x1b[0m", as ls --color prints
  them) are drawn in the portal's colors (PORTAL_FG/PORTAL_BG); unsampled codes
  fall back to xterm defaults. Bold (1) is ignored: the portal draws it at
  normal weight.
"""
import html, os, pathlib, re, shutil, subprocess, sys, tempfile

def find_chrome():
    """Google Chrome binary: $CHROME wins, then the platform's usual locations."""
    if os.environ.get("CHROME"):
        return os.environ["CHROME"]
    candidates = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    for name in ("google-chrome", "google-chrome-stable", "chrome", "chromium"):
        if shutil.which(name):
            return shutil.which(name)
    sys.exit("Google Chrome not found. Install it or set CHROME=/path/to/chrome.")

CHROME = find_chrome()
WIDTH, LINE_H, FONT_PX = 787, 21.6, 16
FG, BG = "#548b41", "#000"
CELL_PX = 9.63
# ATC portal colors, sampled from a real portal tab's `ls /` (2026-09-30):
# 34 directories, 36 links, 30;42 the sticky /tmp. The rest are xterm defaults.
PORTAL_FG = {30: "#000", 31: "#cd3131", 32: FG, 33: "#e5e510", 34: "#605df5",
             35: "#bc3fbc", 36: "#96f9fe", 37: "#e5e5e5"}
PORTAL_BG = {40: "#000", 41: "#cd3131", 42: FG, 43: "#e5e510", 44: "#605df5",
             45: "#bc3fbc", 46: "#96f9fe", 47: "#e5e5e5"}
SGR = re.compile(r"\x1b\[([0-9;]*)m")

def plain(line):
    """The line as the terminal shows it: escapes removed (for wrap counting)."""
    return SGR.sub("", line)

def cells(line):
    """The line as (char, fg, bg) cells, the way the terminal draws it."""
    out, fg, bg, pos = [], None, None, 0
    def add(text):
        out.extend((ch, fg, bg) for ch in text)
    for m in SGR.finditer(line):
        add(line[pos:m.start()]); pos = m.end()
        for c in [int(x) for x in (m.group(1) or "0").split(";") if x]:
            if c == 0: fg = bg = None
            elif c == 39: fg = None
            elif c == 49: bg = None
            elif c in PORTAL_FG: fg = PORTAL_FG[c]
            elif c in PORTAL_BG: bg = PORTAL_BG[c]
    add(line[pos:])
    return out

def cells_html(cs):
    """Escape cells, one styled span per run of the same colors."""
    out, i = [], 0
    while i < len(cs):
        _, fg, bg = cs[i]; j = i
        while j < len(cs) and cs[j][1:] == (fg, bg): j += 1
        t = html.escape("".join(c[0] for c in cs[i:j]))
        style = (f"color:{fg};" if fg else "") + (f"background:{bg};" if bg else "")
        out.append(f'<span style="{style}">{t}</span>' if style else t)
        i = j
    return "".join(out)

def to_html(line):
    """Escape a line, turning ANSI SGR color runs into styled spans."""
    return cells_html(cells(line))

def render(lines, out_png, cols=None, fit=False, scale=1):
    import math
    if cols:
        # Hard-wrap at exactly `cols` cells, as the terminal does; the browser
        # doesn't wrap (white-space: pre), so rounding in the font can't move a break.
        width = round(cols * CELL_PX) + 2
        rows = []
        for l in lines:
            cs = cells(l.expandtabs(8))
            rows += [cs[i:i + cols] for i in range(0, len(cs), cols)] or [[]]
        body = "\n".join(cells_html(r) for r in rows)
        visual, wrap = len(rows), "pre"
        if fit:
            # Only as wide as the longest row (+1 cell for the cursor), so short
            # output isn't shrunk to fit the page column.
            used = max(len(r) for r in rows) + 1
            width = round(min(used, cols) * CELL_PX) + 2
    else:
        body = "\n".join(to_html(l) for l in lines)
        width = WIDTH
        per = int((width - 2) // CELL_PX)
        visual = sum(max(1, math.ceil(len(plain(l).expandtabs(8)) / per)) for l in lines)
        wrap = "pre-wrap;word-break:break-all"
    height = round(LINE_H * visual)
    doc = f"""<!doctype html><meta charset="utf-8"><style>
html,body{{margin:0;background:{BG}}} body{{width:{width}px;height:{height}px;overflow:hidden}}
pre{{margin:0;padding:0 0 0 2px;font:{FONT_PX}px/{LINE_H}px Menlo,"DejaVu Sans Mono",monospace;color:{FG};white-space:{wrap};tab-size:8}}
.cur{{display:inline-block;width:9px;height:17px;background:{FG};vertical-align:-3px}}
</style><pre>{body}<span class="cur"></span></pre>"""
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as f:
        f.write(doc); src = f.name
    cmd = [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
           f"--force-device-scale-factor={scale}", f"--window-size={width},{height}",
           f"--screenshot={out_png}", f"file://{src}"]
    for attempt in (1, 2):   # headless Chrome is occasionally killed mid-shot; retry once
        try:
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            break
        except subprocess.CalledProcessError:
            if attempt == 2:
                raise
    pathlib.Path(src).unlink()
    print(f"wrote {out_png} ({width}x{height}" + (f" at {scale}x" if scale != 1 else "") + ")")
    return width   # the display width in CSS px, for the page's { width } attribute

def set_page_widths(docs, widths):
    """Write each shot's display width into the pages that show it.

    widths maps a docs-relative image path ("media/module-1/id.png") to its
    CSS width; every ![alt](./media/...png) reference to it in docs/*.md gets
    (or has its old) {: width="W" } after it. Returns the references changed."""
    changed = 0
    for page in sorted(pathlib.Path(docs).glob("*.md")):
        text = page.read_text()
        new = text
        for rel, w in widths.items():
            pat = re.compile(r"(\]\(\./" + re.escape(rel) + r"\))(\{: width=\"\d+\" \})?")
            new = pat.sub(lambda m: m.group(1) + f'{{: width="{w}" }}', new)
        if new != text:
            changed += sum(1 for a, b in zip(text.splitlines(), new.splitlines()) if a != b)
            page.write_text(new)
    return changed

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    args = sys.argv[1:]
    cols = None
    if "--cols" in args:
        i = args.index("--cols"); cols = int(args[i + 1]); del args[i:i + 2]
    fit = "--fit" in args
    if fit: args.remove("--fit")
    scale = 1
    if "--scale" in args:
        i = args.index("--scale"); scale = float(args[i + 1]); del args[i:i + 2]
    out = args[0]
    lines = args[1:] or sys.stdin.read().splitlines()
    render(lines, out, cols, fit, scale)
