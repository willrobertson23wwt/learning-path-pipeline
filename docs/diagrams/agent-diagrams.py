# Draws the pipeline diagrams in docs/diagrams/ as SVG, and with --png also
# renders each one to a 1360 px wide PNG with headless Chrome:
#
#   python3 docs/diagrams/agent-diagrams.py docs/diagrams --png
#
#   learning-path-agents-overview   every skill and the agents it runs
#   skills-video-section            the video section's skills and helpers
#   stage-*                         one per stage, top to bottom: the main
#                                   chat's steps, your stops, and what each
#                                   step hands off to
#
# Edit the rows below when a skill or agent changes, rerun, and commit the
# SVGs and PNGs together. Plain Python 3, no dependencies (Chrome for
# --png; set $CHROME if it isn't in the usual place). Colors are the
# light-mode ramps the diagrams were first drawn with: gray = you or a
# skill, amber = a stop for you, purple = an agent that writes files, teal
# = a read-only reviewer, blue = an outside tool or repo, coral = a helper
# skill; dashed = on demand or a choice (the main thread decides, by
# CLAUDE.md "Who does the work").
import os
C = {
 'gray':   dict(fill='#F1EFE8', stroke='#5F5E5A', t='#2C2C2A', s='#5F5E5A'),
 'purple': dict(fill='#EEEDFE', stroke='#534AB7', t='#26215C', s='#534AB7'),
 'teal':   dict(fill='#E1F5EE', stroke='#0F6E56', t='#04342C', s='#0F6E56'),
 'amber':  dict(fill='#FAEEDA', stroke='#854F0B', t='#412402', s='#854F0B'),
 'blue':   dict(fill='#E6F1FB', stroke='#185FA5', t='#042C53', s='#185FA5'),
 'coral':  dict(fill='#FAECE7', stroke='#993C1D', t='#4A1B0C', s='#993C1D'),
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
    sub = sub.replace('<', '&lt;').replace('>', '&gt;')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="1360" height="{h*2}" viewBox="0 0 680 {h}" {FONT}>'
            f'<defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">'
            f'<path d="M2 1L8 5L2 9" fill="none" stroke="{ARR}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>'
            f'<rect width="680" height="{h}" fill="#FFFFFF"/>'
            f'<text x="40" y="34" font-size="18" font-weight="600" fill="#2C2C2A">{title}</text>'
            f'<text x="40" y="54" font-size="12" fill="#5F5E5A">{sub}</text>'
            f'<g transform="translate(0 40)">{body}</g></svg>')


# One stage, top to bottom: the main column is the stage's steps (the main
# chat, or a stop for you); boxes to its right are what that step hands off
# to, an agent or an outside tool. Each row is
#   (title, sub, color, dashed, [(title, sub, color, dashed), ...])
# and each side list may be empty.
X0, W0, X1, W1, H, GAP, SGAP = 40, 260, 360, 280, 56, 26, 10
def flow(title, sub, rows, legend_items, notes=()):
    b, y, prev = [], 40, None
    for i, (t, s2, c, d, side) in enumerate(rows):
        hgt = max(H, len(side) * H + (len(side) - 1) * SGAP)
        my = y + (hgt - H) / 2 if len(side) > 1 else y
        if prev is not None:
            b.append(arr(X0 + W0 / 2, prev + 2, X0 + W0 / 2, my - 3))
        prev = my + H
        b.append(box(X0, my, W0, t, s2, c, dashed=d))
        for j, (st, ss, sc, sd) in enumerate(side):
            sy = y + j * (H + SGAP)
            b.append(box(X1, sy, W1, st, ss, sc, dashed=sd))
            if j == 0 and len(side) == 1:
                b.append(path(f'M{X0+W0+2} {my+28} L{X1-3} {sy+28}', dashed=sd))
            else:
                b.append(path(f'M{X0+W0+2} {my+28} L330 {my+28} L330 {sy+28} L{X1-3} {sy+28}', dashed=sd))
        y += hgt + GAP
    y += 34 - GAP
    b.append(legend(y, legend_items))
    y += 40
    for n in notes:
        n = n.replace('<', '&lt;').replace('>', '&gt;')
        b.append(f'<text x="40" y="{y}" font-size="12" fill="#5F5E5A">{n}</text>')
        y += 20
    return svg(y + 40 + 10, title, sub, ''.join(b))

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


# Stage diagrams. Row helpers: M = a main-chat step, U = a stop for you,
# A = an agent that writes files, R = a read-only reviewer agent, E = an
# outside tool or repo, K = a helper skill. Pass dashed=True for "only when
# needed" (the main thread decides, or a condition holds).
def M(t, s, side=(), d=False): return (t, s, 'gray', d, list(side))
def U(t, s, side=(), d=False): return (t, s, 'amber', d, list(side))
def A(t, s, d=False): return (t, s, 'purple', d)
def R(t, s, d=False): return (t, s, 'teal', d)
def E(t, s, d=False): return (t, s, 'blue', d)
def K(t, s, d=False): return (t, s, 'coral', d)
LG = [(40, 'gray', 'main chat'), (150, 'amber', 'your stop'), (260, 'purple', 'agent, writes files'), (430, 'teal', 'reviewer, read-only')]
LGE = LG[:2] + [(260, 'purple', 'agent'), (350, 'teal', 'reviewer'), (460, 'blue', 'outside tool')]
DASH = 'Dashed: only when needed (the main chat decides, or the condition in the box holds).'

STAGES = {}

STAGES['stage-new-path'] = flow('/new-path: start a learning path',
 'Run from the template, or from a new empty folder through the personal wrapper.', [
  M('Pick the target', 'This empty folder, or a sibling'),
  U('Traditional or lab-first?', 'Asked unless you already said'),
  M('Copy, apply the format', 'Template files, then apply-format'),
  U('Platform details', 'Shell, prompt, elevation, prefix'),
  M('Install and smoke test', 'npm install, tsc, one still', [E('lp-toolkit', 'Fetched at the pinned tag')]),
  M('Memory notes, git init', 'Notes copied, first commit'),
  U('Open the new folder', 'Then run /outline there'),
 ], [LG[0], LG[1], (260, 'blue', 'outside tool or repo')],
 ['No agents. Nothing course-specific is ever written into the template itself.'])

STAGES['stage-outline'] = flow('/outline: plan the path',
 'An interactive plan, built with you step by step from a research survey.', [
  M('Scope, start research', 'Picks the slug first', [A('researcher', 'Outline mode, in the background')]),
  U('Scoping questions', 'Audience, outcome, environment'),
  U('Research findings', 'You pick the shape and topics'),
  U('The skeleton', 'Revised until you approve it'),
  M('Full draft', 'Design rules, unslop, saved as draft', [R('prose-checker', 'Rereads the saved outline')]),
  U('You approve the outline', 'You set status: approved'),
 ], LG,
 ['Traditional: modules, globally numbered videos of 2-4 chapters, a closing lab per module.',
  'Lab-first: a Module 0 briefing, labs with guidance levels, GIFs and cards, a capstone.'])

STAGES['stage-scripts'] = flow('/scripts: narration and visual briefs',
 'Every word the narrator says, written before any narration credits are spent.', [
  M('Read the outline', 'Asks if it is still a draft'),
  M('Research briefs', 'For each module or lab in range', [A('researcher', 'One per module or lab, in parallel')]),
  M('Write the scripts', 'Narration, visual brief, unslop'),
  M('Check and fix', 'Blocking and fix findings', [R('script-linter', 'Always: the pre-audio check'), R('prose-checker', 'Batches, or when you ask', True)]),
  U('You review the scripts', 'Edit freely before /audio'),
 ], LG,
 ['Traditional: each video gets 00-intro.md (chapter 0) and one file per chapter.',
  'Lab-first: one spec per media ID: narration for videos, a loop spec per GIF, a layout per card.', DASH])

STAGES['stage-audio'] = flow('/audio: narration, timings and captions',
 'Spends ElevenLabs credits, so it runs only when you ask for it.', [
  M('Dry run', 'Character counts, the plan', [R('script-linter', 'Lints in parallel; blocking stops it')]),
  M('Generate narration', 'npx lp-generate-audio', [E('ElevenLabs', 'Skips takes that already exist')]),
  M('Transcribe and caption', 'lp-transcribe, lp-captions'),
  U('You listen to every take', 'Retakes: fix the script, rerun'),
 ], LGE,
 ['Traditional: every chapter and chapter 0; regenerate at most once per video, after the shot list.',
  'Lab-first: videos and the briefing only. GIFs and cards are silent.',
  '/produce runs /audio then /video and skips only this listen stop.'])

STAGES['stage-video-traditional'] = flow('/video, traditional: one video, 2-4 chapters',
 'Every chapter designed in one pass, then built in parallel. The main chat orchestrates.', [
  M('Inputs and continuity', 'Scripts, transcripts, a style note', [A('article-writer', 'The article, in the background')]),
  M('Shot lists, every chapter', 'You, using video-designer.md', [A('video-designer', 'Only for a fresh design', True)]),
  M('Toolkit check, engine plan', 'Measure text, size the holds', [A('manim-builder', 'Feasibility of exact pieces', True)]),
  U('You approve the shot lists', 'Narration changes, assets, Blender'),
  M('Scaffold and launch', 'Stubs in Root.tsx, one message', [A('sketch-builder', 'One per chapter, in parallel'), A('sound-engineer', 'Plan mode: music candidates'), A('manim / blender-builder', 'Exact plots or real 3D devices', True)]),
  M('Stills review gate', 'You check the builders’ stills', [R('stills-reviewer', 'Only for a chapter you built', True)]),
  U('You pick the music', 'Nothing downloads before this', [A('sound-engineer', 'Build mode: mix, mastered voice')]),
  U('Studio handoff', 'Your tweaks; /revise for notes'),
  M('Render, captions, loudness', 'One chapter at a time'),
  M('Deliver and record', 'MP4, VTT, article, Course Status'),
 ], LG,
 ['Chapter 0 is narration only: its MP3 and captions go straight to deliverables/.', DASH])

STAGES['stage-video-lab-first'] = flow('/video, lab-first: one lab’s media',
 'The briefing, micro-videos, GIFs and cards a lab embeds. The main chat orchestrates.', [
  M('Inputs and continuity', 'Specs, transcripts, a lab note', [A('article-writer', 'Standalone videos only, background', True)]),
  M('GIFs and cards', 'Built from their specs', [A('media-builder', 'Three or more: one each, parallel', True)]),
  M('Shot lists, narrated items', 'Design first, then toolkit check', [A('video-designer', 'Only for a fresh design', True)]),
  U('You approve the shot lists', 'Assets, Blender, narration changes'),
  M('Build narrated items', 'You, or builders in parallel', [A('sketch-builder', 'Two or more: one per item', True), A('sound-engineer', 'Plan mode, alongside the build'), A('manim / blender-builder', 'Exact plots or real 3D devices', True)]),
  M('Stills review gate', 'Whoever didn’t build it checks', [R('stills-reviewer', 'For items you built', True)]),
  U('You pick the music', 'Nothing downloads before this', [A('sound-engineer', 'Build mode: mix, mastered voice')]),
  U('Studio handoff', 'Your tweaks; /revise for notes'),
  M('Render each item', 'Video, muted GIF loop, card still'),
  M('Deliver and record', 'deliverables/, the lab repo, status'),
 ], LG,
 ['Media IDs: <prefix>-briefing, <prefix>-lN-vM (micro-video), <prefix>-lN-gM (GIF), <prefix>-card-<name>.', DASH])

STAGES['stage-article'] = flow('/article: the written version of a video',
 'Usually started by /video in the background; run it alone to write or redo one.', [
  M('Check the inputs', 'Scripts, the outline description'),
  M('Description lines', 'Writes any that are missing'),
  M('Write the articles', 'From the reviewed scripts', [A('article-writer', 'One per video, in parallel')]),
  M('Independent check', 'Against unslop and house style', [R('prose-checker', 'Only if you wrote the article', True)]),
  U('You review the articles', 'Paths, word counts, gaps'),
 ], LG,
 ['Lab-first: standalone videos only (the briefing, or items marked standalone).', DASH])

STAGES['stage-revise'] = flow('/revise: act on your review notes',
 'Notes come from the review editor: a mark on a frame, or a time range, with a comment.', [
  U('You mark frames', 'In the review editor, then Send'),
  M('Load the notes', 'Submitted or reopened ones'),
  M('Find each element', 'Beats, bounding box, shot list'),
  M('Fix each note', 'Redraw, retime, reposition', [A('sound-engineer', 'Music or effect notes', True), A('manim / blender-builder', 'Exact layers', True)]),
  M('After-stills', 'Typecheck, compare the frames', [R('stills-reviewer', 'If more than a tweak changed', True)]),
  U('You verify or reopen', 'In the editor'),
 ], LG,
 ['A change to the narration wording is out of scope: it goes back through /audio.', DASH])

STAGES['stage-lab'] = flow('/lab: draft a lab guide',
 'A WWT lab repo draft in labs/<lab-slug>/, from the outline, scripts and research.', [
  M('Read the inputs', 'Outline, scripts, articles'),
  M('Research brief', 'If missing or out of date', [A('researcher', 'Lab or module mode')]),
  U('Module split', 'Only if the outline has none', d=True),
  M('Write learner pages', 'Index, environment, modules'),
  M('Write internal files', 'SETUP, SUPPORT, LISTING, shots'),
  M('Unslop and checks', 'Dryrun states checked'),
  U('You review the draft', 'Then /lab-review'),
 ], LG,
 ['Traditional: one fully guided lab per module.',
  'Lab-first: guidance levels and embedded media. /lab <slug> capstone adds a Solutions page,',
  'and /lab <slug> 0 writes the path page instead of a lab.', DASH])

STAGES['stage-lab-review'] = flow('/lab-review and /lab-topology',
 'A documentation-only review before any VM exists, then the environment diagram.', [
  M('Walk the lab', 'Commands, house rules, unslop', [A('lab-walker', 'If /lab ran in this chat', True)]),
  M('Fresh-eyes reviews', 'Launched together, read-only', [R('lab-learner', 'Follows it as a learner would'), R('prose-checker', 'Rereads the learner pages')]),
  M('Triage and sync', 'Apply fixes, sync the files'),
  U('You review the report', 'Design questions held for you'),
  M('/lab-topology', 'Hand-drawn SVG of the devices', [E('headless Chrome', 'Renders and checks the SVG')]),
  U('You approve the diagram', 'Then its alt text goes in'),
 ], LGE, ['No screenshots and no VM work at this stage.', DASH])

STAGES['stage-lab-build-setup'] = flow('/lab-build and /lab-setup',
 'From a reviewed guide to a golden vApp, then the dry run and screenshots.', [
  M('/lab-build: read the lab', 'Environment page, SETUP.md'),
  M('Lay out the vApp', 'Images, networks, firewall', [E('Lab Builder', 'lab.yaml, PLAN.md, catalog match')]),
  M('Plan the build', 'Nothing to change or destroy', [E('terraform', 'Plan only, never applied')]),
  U('You run the build', 'And note the vApp address'),
  M('/lab-setup: audit', 'Read-only, over SSH', [E('the vApp', 'lab-ssh and lab-scp')]),
  U('You open egress', 'Ports 80 and 443 at the edge'),
  M('Upgrade and set up', 'setup.sh, hand-check, clean'),
  M('Record the build', 'SETUP, SUPPORT, quickref IPs'),
  U('You close egress, snapshot', 'The golden image'),
  U('Dry run and screenshots', 'By hand: real output, PNGs'),
 ], [LG[0], LG[1], (260, 'blue', 'outside tool or system')],
 ['Skip /lab-build when the ATC team delivers a stock vApp. No agents in either skill.'])

STAGES['stage-closeout'] = flow('/closeout and /toolkit-review',
 'Archive a finished path, then share what it built through lp-toolkit.', [
  M('Preconditions', 'Deliverables present, git clean'),
  M('Dry run, build the zip', 'Manifest, verified listing'),
  U('Delete the renders?', 'Only on a clear yes'),
  M('Toolkit review: gather', 'Repeats, workarounds, drift'),
  U('You pick candidates', 'Row by row, or skip it'),
  M('Add to lp-toolkit', 'Linked checkout, stills check', [E('lp-toolkit repo', 'One version bump and tag')]),
  U('You approve the push', 'Then the path moves to the tag'),
 ], [LG[0], LG[1], (260, 'blue', 'outside repo')],
 ['/toolkit-review runs the last four steps on its own, any time, from a path folder.',
  'In /closeout it runs on a whole-path closeout only, and never changes the delivered path.'])

STAGES['skills-video-section'] = flow('The video section: skills and where they fit',
 'Stage skills run in order and wait for you; helpers sit beside the stage that uses them.', [
  M('/outline', 'Videos, chapters, visual moments'),
  M('/scripts', 'Narration and visual brief', [K('/unslop', 'Cuts AI tells before saving')]),
  M('/audio', 'Narration, timings, captions', [K('/produce', '/audio then /video, no listen stop', True)]),
  U('You listen to the takes', 'Retakes go back to /audio'),
  M('/video', 'Design, build, mix, render', [K('/article', 'Written version, in background'), K('/revise', 'Fixes notes marked in the editor')]),
  M('/closeout', 'Zips deliverables, frees disk', [K('/toolkit-review', 'Moves shared code to lp-toolkit')]),
 ], [(40, 'gray', 'stage skill'), (160, 'amber', 'your check'), (280, 'coral', 'helper skill')],
 ['Dashed: a shortcut you run by request.'])

import shutil, subprocess, sys
def find_chrome():
    if os.environ.get('CHROME'):
        return os.environ['CHROME']
    for c in ('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
              r'C:\Program Files\Google\Chrome\Application\chrome.exe'):
        if os.path.exists(c):
            return c
    for n in ('google-chrome', 'google-chrome-stable', 'chrome', 'chromium'):
        if shutil.which(n):
            return shutil.which(n)
    sys.exit('Chrome not found; set $CHROME, or drop --png.')
args = [a for a in sys.argv[1:] if a != '--png']
png = '--png' in sys.argv
outs = args or [os.path.expanduser('~/Documents')]
diagrams = {'learning-path-agents-overview': ov, **STAGES}
for out in outs:
    for name, svgtext in diagrams.items():
        f = os.path.abspath(os.path.join(out, name + '.svg'))
        open(f, 'w').write(svgtext)
        print(f)
        if png:
            hgt = int(svgtext.split('height="', 1)[1].split('"', 1)[0])
            subprocess.run([find_chrome(), '--headless', '--disable-gpu', '--hide-scrollbars',
                            f'--window-size=1360,{hgt}', f'--screenshot={f[:-4]}.png', 'file://' + f],
                           check=True, capture_output=True)
            print(f[:-4] + '.png')
