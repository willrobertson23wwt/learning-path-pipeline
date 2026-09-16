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
"""
import html, os, pathlib, shutil, subprocess, sys, tempfile

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

def render(lines, out_png):
    body = "\n".join(html.escape(l) for l in lines)
    import math
    cols = int((WIDTH - 2) // 9.63)
    visual = sum(max(1, math.ceil(len(l.expandtabs(8)) / cols)) for l in lines)
    height = round(LINE_H * visual)
    doc = f"""<!doctype html><meta charset="utf-8"><style>
html,body{{margin:0;background:{BG}}} body{{width:{WIDTH}px;height:{height}px;overflow:hidden}}
pre{{margin:0;padding:0 0 0 2px;font:{FONT_PX}px/{LINE_H}px Menlo,"DejaVu Sans Mono",monospace;color:{FG};white-space:pre-wrap;word-break:break-all;tab-size:8}}
.cur{{display:inline-block;width:9px;height:17px;background:{FG};vertical-align:-3px}}
</style><pre>{body}<span class="cur"></span></pre>"""
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as f:
        f.write(doc); src = f.name
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--force-device-scale-factor=1", f"--window-size={WIDTH},{height}",
                    f"--screenshot={out_png}", f"file://{src}"],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    pathlib.Path(src).unlink()
    print(f"wrote {out_png} ({WIDTH}x{height})")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    out = sys.argv[1]
    lines = sys.argv[2:] or sys.stdin.read().splitlines()
    render(lines, out)
