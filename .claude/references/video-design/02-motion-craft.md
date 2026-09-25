# Motion craft for narrated explainers

Research brief, September 2026. Scope: how skilled explainers compose,
choreograph, and pace narrated technical animation, stated purely as what
the viewer sees. Production tools are deliberately left out; where a source
discusses one, only the on-screen idea is kept. Bracketed numbers point to
the references at the end. Anything marked *(judgment)* is a translation
from interface guidance to narrated video, not a sourced number.

## Design rules this supports

1. Show the picture before the name. Put a concrete example, object, or
   case on screen first; introduce the term, symbol, or formula only after
   the viewer has watched it do something. [1][2][6][9]
2. Never open a scene on a definition. A definition is where a scene
   lands, not where it starts. [2]
3. Give every movement a job you can name: reveal, relate, transform,
   compare, or point. If you can't name it, cut it. [2][11][12]
4. Make the picture say what the narration says, at the same moment. A
   visual appears on the words that describe it, not before and not after.
   [2][13]
5. One thing moves at a time. When two things must change, stagger them so
   the eye can follow each. [12][14]
6. Keep one anchor object on screen across a sequence and change it rather
   than replacing it. Viewers track identity; cuts break it. [7][14][16]
7. When one thing becomes another, morph it in place so each part of the
   input visibly lands on its part of the output. [7][16]
8. Scale a move's duration to its distance and size: small nudges are
   quick, large travels and full-frame changes take longer. [4][5]
9. Ease every move: accelerate quickly, settle slowly. Entrances
   decelerate in, exits accelerate out. [4][5]
10. Reserve big, expressive motion for the one moment per video that
    matters; everything else is quiet and quick. [5]
11. Text holds still while it is read. Animate text in, then freeze it for
    at least 0.3 s per word or 1 s per 13 characters. [17][18]
12. Body text at 1080p is at least 40-60 px tall; titles about 1.5x that.
    [18]
13. Keep essential content inside title safe (the central 90% of the
    frame) and out of the bottom caption band. [19]
14. A color means one thing for the whole series. Grey is the default;
    saturated color is for what the viewer should look at now. [20][21]
15. Plan in beats tied to narration phrases, record each beat's resting
    state, and check pacing with a timed rough cut before building. [22][23]
16. Cut anything that is not needed to understand the point, however good
    it looks. [2][13][15]

## Findings

### How visual explainers think

**Concrete first, abstract last.** Grant Sanderson's standing advice to
aspiring explainers is to give examples before general frameworks and to
treat definitions as the end point of a lesson rather than its start [2].
He describes the textbook habit of leading with the general case as a trap
that experts fall into because the abstraction feels efficient once you
already understand it [1][3]. Nicky Case gives the same rule for any
explanation: show, then tell; concrete, then abstract; familiar, then
unfamiliar [9]. Bret Victor frames it as moving deliberately up and down a
"ladder of abstraction": one specific case drawn with fixed values, then
the same picture generalized over a variable, then back down to check [8].

**The visual is the question, not the decoration.** Sanderson says the
visual is woven into the story: it poses the mystery the narration then
resolves [1]. Putting visuals first gives the viewer a sense of ownership
over the idea before words arrive [6]. His SoME criteria for a strong
explanation are motivation (the viewer knows why to care within about 30
seconds), clarity, novelty, and memorability [10b]. In his review of the
winners he notes that visual polish alone did not win; entries with plain
visuals and a sharp idea rose to the top [10c].

**Deliberate motion, aligned with the voice.** His FAQ is explicit: every
movement on screen should be deliberate and have an identifiable purpose,
the visuals should make the same point as the narration so the two
reinforce each other, and pointless motion such as shuffling equations
around the screen should go [2].

**One object becoming another.** Sanderson's reason for animating at all
is correspondence: a static before-and-after of a transformation doesn't
show which part of the input went where, so he morphs the input into the
output continuously [7]. In his determinant lesson a shaded square
deforms into a parallelogram as the grid moves, while the label for its
area changes in step and a copy of the number travels to the equation,
tying the shape to the symbol [7]. He also keeps a small family of visual
types and makes each new picture "a variant of that core visual" so
viewers see connections between ideas [11].

**A persistent scene.** Bartosz Ciechanowski's interactive essays reuse
one scene (a set of colored spheres on a checkerboard) across an entire
article, shooting it first with a bare sensor, then a pinhole, then a lens,
so each new idea is a change to a familiar picture rather than a new
picture [16]. Each section adds exactly one element to the previous
diagram (a filter grid laid over the same detector grid, for example).
The same pattern runs through Sebastian Lague's and Reducible's videos:
one working artifact stays on screen and grows (observed; neither
publishes a written method).

**Story logic.** Case's rule of "therefore and but, not and then" applies
to beats: each scene should exist because the last one created a problem
or a consequence [9].

### Research on when animation helps

Tversky, Morrison and Betrancourt's review found animation often fails to
beat a good static diagram [12]. Two conditions decide it: *congruence*
(the motion matches the change being taught; animate what actually
changes over time) and *apprehension* (the motion is slow and simple
enough to be perceived). Animations that are too fast, too detailed, or
have several simultaneous movements lose viewers; schematic drawings,
highlighting of the moving part, and breaking a process into discrete
steps help [12]. Mayer's multimedia principles add: cut extraneous material
(coherence), cue the essential part (signaling), and present words and
their picture at the same time and in the same place (temporal and spatial
contiguity) [13].

### Motion principles from design systems

**Material Design.** Duration should follow distance travelled, velocity,
and change in surface area; short hops are short, large travels are long
[4]. For interfaces it quotes roughly 225 ms for entering, 195 ms for
exiting, 300 ms standard, 375 ms for full-screen change, and warns that
over 400 ms feels slow [4]. Its four curves: standard (fast out, slow
settle) for things moving on screen, deceleration for entrances,
acceleration for exits, sharp for things that leave and may return [4].
Material's motion principles are informative (shows relationships and
outcomes), focused (highlights essentials without distraction), and
expressive [15]. Its choreography guidance: keep one clear focal point,
let new surfaces grow from their point of origin, stagger items that
appear together rather than showing them all at once, avoid elements
crossing paths, and minimize how many shared elements travel together
[14]. Its transition patterns encode relationship strength: *container
transform* (one element visibly becomes the next) for the strongest link,
*shared axis* (both slide along the same direction) for siblings or steps
in a sequence, *fade through* (old fades out completely, then new fades in
with a slight scale) for unrelated content [24].

**IBM Carbon.** Two motion styles: *productive* motion is quick and subtle
for moments where the viewer is focused on a task; *expressive* motion is
slower and more visible, reserved for occasional significant moments [5].
Duration grows non-linearly with size and distance, on a scale from about
70 ms (tiny state change) through 240 ms (a system message) to 400-700 ms
(large expansion, dimming the background) [5]. Easing comes in three kinds:
standard for elements that stay visible while moving, entrance, and exit
[5].

**Apple HIG.** Add motion purposefully and never for its own sake;
gratuitous motion distracts and can make people physically uncomfortable
[25]. Prefer brief, precise motion. Keep motion physically plausible;
motion that defies physics disorients. Never make motion the only carrier
of information, since some viewers won't perceive it [25].

**Translating to narrated video** *(judgment)*. Interface durations are a
floor: they assume a viewer who caused the change and expects it. In a
narrated explainer the viewer did not trigger the move and must parse it,
so a small element settles in roughly 0.3-0.5 s and a large transform or
travel across the frame runs roughly 0.8-1.5 s, still scaled by distance.
"Productive" becomes the default register (labels, highlights, small
additions) and "expressive" is spent once, on the reveal.

**Disney's principles, adapted.** Val Head names timing,
follow-through, anticipation, squash and stretch, and appeal as the most
useful for interface motion, and staging as least relevant there [26].
For narrated explainers staging returns to the top: it is composition in
time, using motion to direct the eye to the one thing that matters [27].
Anticipation becomes a small cue before a change (a highlight lands on the
part about to move). Follow-through is a gentle settle rather than a hard
stop. Slow in and slow out is easing. Secondary action is a subordinate
change that supports the main one (a label updating while its shape
moves) and must never compete with it. Willenskomer's UX motion
principles give the relational vocabulary: offset and delay (stagger to
show grouping), parenting (children move with their parent), and
transformation, value change, masking, and cloning, all of which tell the
viewer how two things relate [28].

### Choreography

- **What moves first:** the thing the narration names first. Supporting
  labels follow it, never lead it. [13][14]
- **Stagger** groups so each member is seen arriving; items that arrive as
  a group read as a group. Material's interface figure is a few tens of
  milliseconds apart; in narrated video, stagger to the rhythm of the words
  that name each item. [14][28]
- **Grow from origin.** A new element emerges from the thing that caused
  it, which shows causality without a word. [14]
- **Transitions show relationship strength:** morph for "this becomes
  that," shared slide for "next step," full fade-through only for a new
  topic. [24]
- **Preserve identity across edits.** If an object carries forward, keep
  it on screen and move it to its new place rather than cutting away and
  redrawing it. [7][14][16]
- **No crossing paths, no two unrelated moves at once.** [12][14]

### Composition for 16:9

- **One focal point per beat.** Material asks for a clear focal point
  during every transition [14]; Datawrapper's rule is that grey is the most
  important color because it lets the highlighted thing win [20].
- **Hierarchy through contrast, size, and color**, not through boxes.
  De-emphasize by dimming, not by removing, when context still matters.
  [20]
- **Negative space** is what makes the focal element legible; a
  crowded frame fails the apprehension test. [12]
- **Safe areas.** EBU R95: action safe is 93% of width and height, title
  safe 90% (on a 1920x1080 frame, 96 px in from the sides and 54 px from
  top and bottom) [19]. For captioned learning video, also keep essential
  content out of the bottom caption band (this project reserves the bottom
  15%).
- **Near, not far.** Put a label next to what it labels; a legend across
  the frame makes the eye commute. [13][21]

### Typography in motion

- **Size:** for 1920x1080 video likely to be watched on a phone, body text
  at least 40-60 px and titles at least 50% larger [18].
- **Contrast and face:** strong light-on-dark or dark-on-light contrast, a
  plain sans-serif, no text over busy texture or gradients, and no
  red-on-green pairings [18].
- **Amount:** at most about 30 characters per line and 3 lines at once
  [18]; storyboard practice caps on-screen supers at about 6 words [22].
- **Reading time:** broadcast subtitling budgets about 0.3 s per word
  (160-180 wpm) [17]; German accessibility standards budget 1 s per 13
  characters of text that is not moving [18]. Take the longer of the two.
- **Hold still while read.** Text animation should be discreet and
  consistent, and text must not move during reading [18].
- **Writing on vs fading:** a write-on (letters or strokes drawn in
  order) draws attention to the text as it arrives and suits a term being
  introduced; a quick fade or rise suits a label that just needs to be
  there *(judgment)*. Either way, the reading clock starts when the text
  is complete.
- **Redundancy:** narration plus identical full-sentence on-screen text
  hurts learning; on-screen words should be labels and key terms, not the
  script [13].

### Color as meaning

- **Consistent semantics.** Keep one color per meaning across every video
  in a series; readers tolerate seeing a key repeated but not having to
  hunt for what a color means [21]. Carry the color into labels and the
  narration's on-screen terms, so the word and the thing share a hue [21].
  Sanderson colors the terms of an equation to match the parts of the
  diagram they stand for, and builds formulas up piece by piece as each is
  annotated [29].
- **Categories vs states.** Use distinct hues for categories (this kind of
  thing vs that kind) and reserve a separate small set for states
  (success, warning, failure) so a state color is never mistaken for a
  category *(judgment, consistent with [20])*.
- **Restraint.** Grey or dim for context, one or two saturated colors for
  what matters now [20].

### Storyboards, shot lists, animatics

The standard order is a locked script, a timing pass, the shot list and
storyboard, then an animatic, then production; boarding before the script
is locked means redrawing every time a sentence changes [22][23]. A useful
shot list records per beat: the narration line it rides on, the visual
(sketch or description), duration from word count, any on-screen text, and
motion notes [22]. A 60-second piece runs roughly 6-12 frames; a frame
longer than about 8 seconds should be split [22]. For an explainer, also
record each beat's *resting state* (what the frame looks like fully
assembled, the frame a viewer sees if they pause) and the transition into
the next beat. The animatic (boards timed against scratch or final
narration) tests pacing, not content [23].

### Common failures

- **Too much on screen:** several simultaneous moves or dense detail
  exceed what a viewer can perceive [12].
- **Motion competing with narration:** a visual that illustrates a
  different point than the words, or arrives late [2][13].
- **Decorative movement:** drifting, bobbing, or shuffling that carries no
  meaning [2][25].
- **Polish standing in for the idea** [10c].
- **Inconsistent motifs:** a color or shape meaning different things in
  different scenes [11][21].
- **Text that moves while being read**, or leaves before it can be read
  [17][18].
- **Cutting away from an object that should have transformed**, so the
  viewer loses which part became which [7].

## Signature moves

1. **The persistent anchor.** One diagram, grid, or object stays on
   screen through the whole sequence and each new idea is a change to it.
   Right when later ideas are variations on one structure.
2. **The morph.** The old form deforms smoothly into the new form in
   place, parts traveling to their counterparts. Right whenever the point
   is "this is the same thing, rewritten."
3. **Picture, then name.** The object acts first; its term or symbol is
   written on only after the viewer has seen what it does. Right for every
   new concept.
4. **Build up one piece at a time.** A formula, command, or diagram
   assembles term by term as the narration reaches each part, and each
   part takes the color of what it stands for. Right for anything with
   structure.
5. **Color bridge.** A region of the diagram and the symbol or word for it
   share a color, so the eye links them without an arrow. Right when a
   picture and notation sit side by side.
6. **Travel to the equation.** A value or label lifts off the diagram and
   flies to its slot in the formula or table. Right when a number is read
   off a picture.
7. **Dim the rest.** Everything but the subject drops to grey; the subject
   keeps full color. Right when context must stay visible but attention
   must narrow.
8. **Grow from the cause.** A new element emerges out of the thing that
   produces it rather than fading in from nowhere. Right for cause and
   effect, outputs, and children of a parent.
9. **Concrete case, then the general one.** One specific instance with
   fixed values plays out, then the same picture sweeps across many values
   to show the pattern. Right for rules and generalizations.
10. **Cue, then change.** A highlight lands on the exact part about to
    change a beat before it moves. Right for any change the viewer must not
    miss.
11. **Before and after, side by side.** After a transform, a faint ghost
    of the original stays beside the result. Right when the difference is
    the lesson.
12. **Shared slide for steps.** Each step exits one way and the next
    arrives from the other along the same axis. Right for sequences and
    procedures; use a full fade-through only for a new topic.
13. **The reveal.** The whole piece stays quiet and quick until one
    larger, slower, expressive move delivers the insight. Right once per
    video, at the "aha."
14. **Hold the assembled frame.** At a scene change the finished picture
    sits completely still long enough to be read before anything new
    moves. Right at every scene change that brings new text.
15. **Ask with the picture.** The scene opens on a puzzle (a surprising
    output, a mismatch) and the narration then works to explain it. Right
    for openings and predict moments.

## References

1. Dropbox Blog, "Grant Sanderson channels his passion for math into marvelously intuitive explainer videos." https://blog.dropbox.com/topics/work-culture/grant-sanderson-channels-his-passion-for-math-into-marvelously-i
2. Grant Sanderson, 3Blue1Brown FAQ (advice for aspiring creators). https://www.3blue1brown.com/faq
3. Antoine Buteau, "Lessons from Grant Sanderson" (compiled interview quotes). https://www.antoinebuteau.com/lessons-from-grant-sanderson/
4. Material Design (v1), Duration and easing. https://m1.material.io/motion/duration-easing.html
5. IBM Carbon Design System, Motion overview. https://v10.carbondesignsystem.com/guidelines/motion/overview/ and https://carbondesignsystem.com/elements/motion/overview/
6. Stanford Daily, "3Blue1Brown creator Grant Sanderson '15 talks engaging with math using stories and visuals" (2020). https://stanforddaily.com/2020/01/24/3blue1brown-creator-grant-sanderson-15-talks-engaging-with-math-using-stories-and-visuals/
7. Dropbox Blog (as 1), determinant and morphing discussion; see also 3Blue1Brown, Essence of Linear Algebra. https://www.3blue1brown.com/?topic=linear-algebra
8. Bret Victor, "Up and Down the Ladder of Abstraction" (2011). https://worrydream.com/LadderOfAbstraction/
9. Nicky Case, "How To Explain Things Real Good" (Stanford talk transcript, 2022). https://ncase.me/StanfordTalk/transcript.html
10. (b) Grant Sanderson, "The Summer of Math Exposition" (criteria). https://www.3blue1brown.com/blog/some1 ; (c) SoME1 results. https://www.3blue1brown.com/blog/some1-results
11. David Perell, "Grant Sanderson: Math for the Masses" (podcast). https://perell.com/podcast/grant-sanderson-math-for-the-masses/
12. Tversky, Morrison, Betrancourt, "Animation: can it facilitate?" International Journal of Human-Computer Studies (2002). https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf
13. Mayer and Fiorella, "Principles for reducing extraneous processing in multimedia learning." https://www.researchgate.net/publication/262915119_Principles_for_reducing_extraneous_processing_in_multimedia_learning_Coherence_signaling_redundancy_spatial_contiguity_and_temporal_contiguity_principles
14. Material Design (v1), Choreography. https://m1.material.io/motion/choreography.html
15. Material Design, Understanding motion. https://m2.material.io/design/motion/understanding-motion.html
16. Bartosz Ciechanowski, "Cameras and Lenses." https://ciechanow.ski/cameras-and-lenses/
17. BBC subtitle guidelines, summarized by Clevercast. https://www.clevercast.com/bbc-subtitling-guidelines/
18. legibility.info, "Rules for text in videos" (FFA, ARD/ORF/SRF/ZDF standards, DBSV focus group). https://legibility.info/rules-for-text-in-videos
19. EBU R95, Safe areas for 16:9 television production. https://tech.ebu.ch/publications/r095 ; summary: https://en.wikipedia.org/wiki/Safe_area_(television)
20. Lisa Charlotte Muth, "Emphasize what you want readers to see with color," Datawrapper. https://www.datawrapper.de/blog/emphasize-with-color-in-data-visualizations
21. Lisa Charlotte Muth, "Remind readers of the colors in your data visualization," Datawrapper. https://www.datawrapper.de/blog/remind-readers-of-colors-in-data-vis
22. Pexo, "Explainer video storyboard." https://pexo.ai/blog/explainer-video-storyboard-1513
23. Moonb, "How to make an animatic." https://www.moonb.io/blog/how-to-make-an-animatic
24. Material motion transition patterns (container transform, shared axis, fade through), Android Developers. https://medium.com/androiddevelopers/material-motion-with-mdc-c1f09bb90bf9 ; https://m2.material.io/design/motion/the-motion-system.html
25. Apple Human Interface Guidelines, Motion. https://developer.apple.com/design/human-interface-guidelines/motion
26. Val Head, "What does Disney know about interface animation anyway?" (2016). https://valhead.com/2016/01/18/what-does-disney-know-about-interface-animation-anyway/
27. Interaction Design Foundation, "UI Animation: How to apply Disney's 12 principles." https://ixdf.org/literature/article/ui-animation-how-to-apply-disney-s-12-principles-of-animation-to-ui-design
28. Issara Willenskomer, "Creating Usability with Motion: The UX in Motion Manifesto." https://medium.com/ux-in-motion/creating-usability-with-motion-the-ux-in-motion-manifesto-a87a4584ddc
29. "FFL: A Language and Live Runtime for Styling and Labeling Typeset Math Formulas", UIST 2023 (analyzes step-by-step, color-annotated formulas in 3Blue1Brown videos). https://dl.acm.org/doi/fullHtml/10.1145/3586183.3606731
