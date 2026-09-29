# Draws the two agent diagrams in docs/diagrams/ as SVG (the PNGs next to
# them are 2x renders of these SVGs):
#
#   python3 docs/diagrams/agent-diagrams.py docs/diagrams [~/Documents ...]
#
#   learning-path-agents-overview.svg     every skill and the agents it runs
#   learning-path-agents-video-stage.svg  the /video stage in detail
#
# Edit the rows and boxes below when a skill or agent changes, rerun, and
# re-export the PNGs from the SVGs at 1360 px wide (any browser, or a
# one-frame Remotion composition that shows the SVG with <Img>). Plain
# Python 3, no dependencies. Colors are the light-mode ramps the diagrams
# were first drawn with: gray = you or a skill, purple = an agent that
# writes files, teal = a read-only reviewer; dashed = on demand or a choice
# (the main thread decides, by CLAUDE.md "Who does the work").
import os
C = {
 'gray':   dict(fill='#F1EFE8', stroke='#5F5E5A', t='#2C2C2A', s='#5F5E5A'),
 'purple': dict(fill='#EEEDFE', stroke='#534AB7', t='#26215C', s='#534AB7'),
 'teal':   dict(fill='#E1F5EE', stroke='#0F6E56', t='#04342C', s='#0F6E56'),
}
ARR = '#5F5E5A'
FONT = "font-family=\"-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif\""
def box(x, y, w, title, sub, c, h=56, dashed=False):
    k = C[c]; cx = x + w / 2
    dash = ' stroke-dasharray="5 4"' if dashed else ''
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{k["fill"]}" stroke="{k["stroke"]}" stroke-width="1"{dash}/>'
            f'<text x="{cx}" y="{y+23}" text-anchor="middle" font-size="14" font-weight="600" fill="{k["t"]}">{title}</text>'
            f'<text x="{cx}" y="{y+43}" text-anchor="middle" font-size="12" fill="{k["s"]}">{sub}</text>')
def arr(x1, y1, x2, y2):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{ARR}" stroke-width="1.5" marker-end="url(#a)"/>'
def path(d, head=True, dashed=False):
    m = ' marker-end="url(#a)"' if head else ''
    dash = ' stroke-dasharray="4 3"' if dashed else ''
    return f'<path d="{d}" fill="none" stroke="{ARR}" stroke-width="1.5"{m}{dash}/>'
def legend(y, items):
    out = []
    for x, c, label in items:
        k = C[c]
        out.append(f'<rect x="{x}" y="{y}" width="14" height="14" rx="3" fill="{k["fill"]}" stroke="{k["stroke"]}"/>'
                   f'<text x="{x+22}" y="{y+12}" font-size="12" fill="#444441">{label}</text>')
    return ''.join(out)
def svg(h, title, sub, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="1360" height="{h*2}" viewBox="0 0 680 {h}" {FONT}>'
            f'<defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">'
            f'<path d="M2 1L8 5L2 9" fill="none" stroke="{ARR}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>'
            f'<rect width="680" height="{h}" fill="#FFFFFF"/>'
            f'<text x="40" y="34" font-size="18" font-weight="600" fill="#2C2C2A">{title}</text>'
            f'<text x="40" y="54" font-size="12" fill="#5F5E5A">{sub}</text>'
            f'<g transform="translate(0 40)">{body}</g></svg>')

# Overview
b = []
# Row 0: /new-path and the format choice
b.append(box(40, 40, 130, '/new-path', 'asks the format', 'gray'))
b.append(arr(172, 68, 197, 68))
b.append(box(200, 40, 210, 'traditional', 'videos, articles, a lab each module', 'gray', dashed=True))
b.append(box(430, 40, 210, 'lab-first', 'labs with media at their steps', 'gray', dashed=True))
b.append('<text x="420" y="73" text-anchor="middle" font-size="12" fill="#5F5E5A">or</text>')
b.append(arr(105, 98, 105, 113))
rows = [
 ('/outline', 'path plan', [('researcher', 'outline mode', 'purple'), ('prose-checker', 'rereads prose', 'teal')]),
 ('/scripts', 'narration scripts', [('researcher', 'module or lab brief', 'purple'), ('script-linter', 'pre-audio QA', 'teal'), ('prose-checker', 'large batches only', 'teal', True)]),
 ('/audio', 'narration', [('script-linter', 'gate before voice', 'teal')]),
 ('/video', 'videos and media', None),
 ('/lab', 'lab guide', [('researcher', 'reuses the brief', 'purple')]),
 ('/lab-review', 'fresh-eyes check', [('lab-walker', 'if drafted here', 'purple', True), ('lab-learner', 'literal learner', 'teal'), ('prose-checker', 'runs alongside', 'teal')]),
]
cols = [200, 360, 510]
for i, (skill, sub, agents) in enumerate(rows):
    y = 116 + i * 76
    b.append(box(40, y, 130, skill, sub, 'gray'))
    b.append(arr(172, y + 28, 197, y + 28))
    if agents is None:
        b.append(f'<rect x="200" y="{y}" width="440" height="56" rx="8" fill="none" stroke="#888780" stroke-width="1" stroke-dasharray="5 4"/>'
                 f'<text x="420" y="{y+23}" text-anchor="middle" font-size="14" font-weight="600" fill="#2C2C2A">main chat designs; agents build and mix</text>'
                 f'<text x="420" y="{y+43}" text-anchor="middle" font-size="12" fill="#5F5E5A">detail in the video stage diagram</text>')
    else:
        for j, (n, s2, c, *d) in enumerate(agents):
            b.append(box(cols[j], y, 130, n, s2, c, dashed=bool(d)))
            if j > 0 and not (skill == '/lab-review' and j == 2):
                b.append(arr(cols[j - 1] + 132, y + 28, cols[j] - 3, y + 28))
    if i < len(rows) - 1:
        b.append(arr(105, y + 58, 105, y + 73))
b.append(legend(582, [(40, 'gray', 'skill (you review after each)'), (250, 'purple', 'agent that writes files'), (430, 'teal', 'read-only reviewer')]))
b.append('<text x="40" y="626" font-size="12" fill="#5F5E5A">Dashed: the main chat decides. Both formats run the same stages; the format decides what each writes.</text>')
ov = svg(680, 'Learning path pipeline: skills and their agents', 'One template, two formats. The main chat runs each stage and calls these agents; rows read left to right.', ''.join(b))

# Video stage
b = []
b.append(box(200, 40, 280, 'Main chat: the shot list', 'designs first, then checks the toolkit', 'gray'))
b.append(arr(340, 98, 340, 117))
b.append(box(200, 120, 280, 'You approve the shot list', 'review stop', 'gray'))
b.append(path('M340 178 L340 190 L130 190 L130 205', dashed=True))
b.append(arr(340, 178, 340, 205))
b.append(path('M340 190 L550 190 L550 205', dashed=True))
b.append(box(40, 208, 180, 'manim-builder', 'exact plots, on demand', 'purple', dashed=True))
b.append(box(250, 208, 180, 'sketch-builder', 'parallel builds; else main chat', 'purple', dashed=True))
b.append(box(460, 208, 180, 'blender-builder', 'real 3D devices, on demand', 'purple', dashed=True))
b.append(path('M222 236 L247 236', dashed=True))
b.append(path('M458 236 L433 236', dashed=True))
b.append(arr(340, 266, 340, 297))
steps = [
 ('sound-engineer', 'plans alongside the build', 'purple'),
 ('You pick music and effects', 'approve downloads', 'gray'),
 ('Stills review', 'whoever didn&#8217;t build it', 'teal'),
 ('You tweak in Studio', 'positions, toggles', 'gray'),
 ('Final render', 'main chat, loudness check', 'gray'),
]
for i, (n, s, c) in enumerate(steps):
    y = 300 + i * 80
    b.append(box(200, y, 280, n, s, c))
    if i < len(steps) - 1:
        b.append(arr(340, y + 58, 340, y + 77))
b.append('<line x1="40" y1="700" x2="640" y2="700" stroke="#B4B2A9" stroke-width="0.75" stroke-dasharray="4 4"/>')
b.append('<text x="40" y="692" font-size="12" fill="#5F5E5A">Also in /video:</text>')
b.append(box(40, 716, 150, 'media-builder', '3+ GIFs, cards', 'purple', dashed=True))
b.append(box(212, 716, 140, 'stills-reviewer', 'if main chat built it', 'teal', dashed=True))
b.append(arr(192, 744, 209, 744))
b.append(box(378, 716, 130, 'article-writer', 'a video&#8217;s article', 'purple'))
b.append(box(530, 716, 130, 'Main chat', 'reviews the article', 'gray'))
b.append(arr(510, 744, 527, 744))
b.append(legend(792, [(40, 'gray', 'you or the main chat'), (230, 'purple', 'writes files'), (370, 'teal', 'review')]))
b.append('<text x="40" y="838" font-size="12" fill="#5F5E5A">Traditional: all of a video&#8217;s chapters in one pass, built in parallel. Lab-first: each video, plus GIFs and cards.</text>')
vs = svg(890, 'The /video stage: hand-drawn narrated video flow', 'The main chat designs and orchestrates. Dashed: the main chat decides, or only for exact pieces.', ''.join(b))

import sys
outs = sys.argv[1:] or [os.path.expanduser('~/Documents')]
for out in outs:
    for name, svgtext in (('learning-path-agents-overview', ov), ('learning-path-agents-video-stage', vs)):
        open(os.path.join(out, name + '.svg'), 'w').write(svgtext)
        print(os.path.join(out, name + '.svg'))
