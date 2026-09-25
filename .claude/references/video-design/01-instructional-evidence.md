# Instructional evidence for short narrated explainers

Research brief, September 2026. Scope: what the learning-science evidence
says about designing 30-90 s narrated micro-videos and 1-3 min standalone
explainers that teach technical IT topics with motion graphics. Everything
is stated as what the viewer sees and hears; no production tools. Bracketed
numbers point to the references at the end. Effect sizes are Cohen's d or
Hedges' g (0.2 small, 0.5 medium, 0.8 large). Mayer's own tallies come
mostly from his lab's short lessons with immediate tests and run higher than
independent meta-analyses; where both exist, both are given.

## Design rules this supports

1. Animate only what changes over time (a packet moving, a pointer
   re-targeting, a table filling). Show structure and anything the learner
   will look up as a still, persistent picture. [5][6][7][8]
2. Give every motion a meaning. Decorative animation has no learning
   benefit (g = -0.05); representational animation does (g = 0.40). [6][3]
3. Put words on screen only as short labels or key terms (two or three
   words) placed on the thing they name. Never mirror whole narrated
   sentences on screen. [16][15][35][2]
4. Make each visual appear on the words that describe it, not before and
   not after. [1][3]
5. Put a label on or beside its object, not in a legend or a corner. [3]
6. Cue the one element the narration is about: recolor it, dim the rest,
   or spotlight it. Prefer a cue that follows the path of cause and effect
   over a static arrow. [10][12][13]
7. Treat a cue as a way to aim the eyes, not as an explanation. The
   narration must still say how the cued parts relate. [14][20]
8. Split every explainer into meaningful segments, and mark each boundary
   with a brief hold and a visible scene change. [17][18][19]
9. Don't rely on the viewer to pause. Build the pauses in. [19][7]
10. Name and show each component, and what it does, before showing the
    components working together. [25]
11. Keep one anchor object on screen across a sequence and transform it in
    place; don't cut to a fresh drawing of the same thing. [26][5]
12. Stage a complex change as a series of simple ones, about a second each,
    with eased starts and stops and no overlapping objects. [26]
13. Build a diagram up piece by piece in time with the narration rather
    than presenting it finished. [24][23]
14. Start from the concrete thing the learner just saw (the real output,
    the real device), then fade to the abstract model. [27][7]
15. Walk through a worked example step by step, saying why each step
    happens, not only what happens. [28][29]
16. Cut interesting but irrelevant material, especially anything that
    stays on screen. [3]
17. Keep new text on screen for at least a quarter to a third of a second
    per word, plus time to find it. [32][33]
18. Pair every explainer with something the viewer does: predict before,
    explain or apply after. [30][23]
19. Narrate with energy at a natural conversational rate; don't slow the
    voice down artificially, and don't pack difficult content fast. [21][34]

## Findings

### Mayer's principles as they apply to narrated animation

The Cambridge Handbook, 3rd edition [2], and Mayer's 2017 review [1] give
the core set. Mayer's median effect sizes from his lab [1]: coherence
d = 0.70, signaling 0.46, redundancy 0.87, spatial contiguity 0.79 to 1.10
(depending on the tally), temporal contiguity 1.22 (9 of 9 tests),
segmenting 0.70, pre-training 0.46, modality 0.72. The independent overview
of 29 meta-analyses (1,189 studies, 78,177 participants) by Noetel et al.
[3] found smaller but still reliable effects: contiguity g = 0.74 (Ginns),
spatial contiguity 0.63, temporal contiguity 0.78, signaling 0.43,
modality 0.38 (Reinwein's larger review), segmenting 0.34, coherence
(removing seductive details) 0.33, and verbal redundancy 0.15.

Two moderators in [3] matter directly for this pipeline. Design quality
mattered more in system-paced media (g = 0.41) than learner-paced media
(0.27), and far more for complex material (0.70) than simple material
(0.20). A video plays at its own pace and technical content is usually
high in element interactivity, so these are the conditions where the
principles pay off most.

**Redundancy, precisely.** The classic finding: adding on-screen text that
repeats the narration to a narrated animation lowers transfer [35]. Its
boundary conditions matter more than the rule [2][15][16]:

- Two or three printed words that name the main event, placed beside the
  matching part of the diagram, improved retention (not transfer) over no
  text [16]. Keywords guide the eye rather than compete with it.
- Across 57 studies, adding written text to spoken words helped overall
  (g = 0.29 for adding text to audio), but mainly when there were no
  pictures, when the lesson was system-paced, and for low prior knowledge
  learners. Much of the advantage came from displaying key terms rather
  than full text [15][3].
- So on-screen text in a narrated animation should be labels, key terms,
  and exact syntax (a command, a path, a flag), not sentences.

**Modality, and its technical-content exception.** Spoken words beside a
picture beat printed words beside a picture [1][3], but the effect reverses
when the spoken segment is long, because speech is gone once it's heard
[8][9]. For IT content this has a direct consequence: anything the learner
must parse character by character (a command, an address, a permission
string) belongs on screen in print, with the narration explaining it.

**Pre-training.** Learners who first learned each component's name and
behavior (a piston moves forward or back; fluid compresses or doesn't)
before a narrated animation of the whole system did better on transfer in
all three experiments [25]. The two-stage account is: build component
models, then build the causal model.

### Animation versus static graphics

Tversky, Morrison and Betrancourt [5] found that many studies where
animation "won" gave the animated group more information or interactivity
than the static group. Their two principles still frame the question:
congruence (the change on screen should match the change in the concept)
and apprehension (the change must be slow and simple enough to perceive).

The meta-analyses give a modest overall benefit. Höffler and Leutner [6]:
d = 0.37 across 76 comparisons, 0.40 when the animation is
representational, 1.06 for procedural-motor skills, and no benefit for
decorative animation. Berney and Bétrancourt [7], with 140 comparisons
from 61 experiments (N = 7,036): g = 0.23, with high heterogeneity. Two of
their moderators are unexpected. System-paced animations outperformed
learner-controlled ones (g = 0.31), and animation helped more for iconic
depictions (realistic or schematic pictures) than for abstract ones
(charts, symbols, notation). Much IT content is abstract, which is one
reason to anchor it in something recognizable first.

**Transience** is the main cost. Information that disappears must be held
in working memory, and when segments are long, animation loses its edge
over statics and spoken text loses to written text [8][9]. Shortening
segments restored both effects [8][9]. Mitigations that follow: short
segments, keeping the previous state visible while the next change
happens, and moving anything that needs repeated lookup to a still.

### Attention cueing and signaling

Schneider et al. [10] pooled 103 studies (N = 12,201): signaling improved
retention (g = 0.53) and transfer (g = 0.33) and reduced cognitive load.
One review in [3] (Alpizar et al.) found dynamic, moving signals
particularly effective (d = 0.43). De Koning et al. [11] classify cues by
function: selection (where to look), organization (the structure), and
integration (how parts relate). Selection cues are well supported;
organizing and relating cues need more careful design.

What works in animation specifically:

- A spotlight that dims everything except the part being explained
  improved comprehension and transfer, for cued and uncued content alike
  [12].
- Color that spreads along the path of cause and effect beat both arrows
  and no cue, on comprehension and on where eyes actually went [13].
- Arrows reliably attract the eyes, but in an eye-tracking study they did
  not improve understanding [14]. A second study found the same pattern
  for spotlight cues on a complex animation: eyes followed, learning did
  not always follow [20]. A cue gets attention to the right place; the
  narration still has to explain what is happening there.

Zooming as a cue has much less direct evidence than color or spotlighting;
treat it as a composition choice, not a proven signal.

### Pacing, segment length, and pauses

**Length.** Guo, Kim and Rubin [21] mined 6.9 million edX sessions: median
engagement time was at most about 6 minutes whatever the video's length,
drawn tutorials were more engaging than slides or code screencasts, and
faster, enthusiastic speakers (up to 254 wpm) held attention better than
mid-pace ones. This is engagement, not learning. A 30-90 s micro-video is
far inside the 6-minute ceiling, so length isn't the constraint; segment
structure within the video is.

**Segmenting.** Rey et al. [17] (88 comparisons) found segmenting improved
retention (d = 0.32) and transfer (0.36) and reduced cognitive load.
System-paced segmentation, where the designer inserts the breaks, was
significant on retention (0.42), transfer (0.35), and load; learner-paced
segmentation was significant only on transfer. Spanjers et al. [18]
separated the two ingredients: 2 s pauses between segments improved test
scores, while briefly darkening the screen at each boundary (a temporal
cue) lowered mental effort without changing scores. Biard et al. [19]
found that when a video had a pause button, learners barely used it;
system-inserted pauses improved procedural learning.

**Playback speed.** A 2025 meta-analysis of 12 studies [34] found that
speeding up playback raised cognitive load and lowered test scores, with
1.5x hurting on difficult content and 2x consistently harmful. Energetic
narration is good; cramming isn't.

**Reading time for on-screen text.** Adults read English non-fiction
silently at about 238 wpm, roughly 0.25 s per word [32]. Subtitle viewers
kept up with text at 12, 16 and 20 characters per second with no loss of
comprehension [33]. A label that must be found in a busy frame needs time
to locate before the reading starts.

### Transformation, identity, and a persistent anchor

Heer and Robertson [26] tested animated transitions between chart forms.
Animated transitions improved viewers' ability to track what changed over
instant cuts, and staged transitions (one kind of change at a time) were
preferred and in several conditions more accurate. Their principles translate directly:
keep each intermediate frame meaningful, never reuse a shape to stand for
something different, move related objects together, avoid occlusion, use
eased timing so the end state is predictable, split complex changes into
stages, and keep each stage around a second. This is Tversky's congruence
principle [5] made concrete: an object that is the same thing should stay
the same object on screen. It's also the visual counterpart of the
notional machine in computing education [31]: a consistent picture of the
system that each explanation acts on.

Dynamic drawing supports the same idea. Watching a diagram being drawn
alongside the narration beat seeing the finished drawing (d = 0.54) [24],
and it is one of the five evidence-based video techniques in [23].

### Worked examples and concrete to abstract

Worked examples beat unguided problem solving for novices; a 2023
mathematics meta-analysis found g = 0.48 [29]. Process-oriented examples,
which state why each step is taken, improved transfer over examples that
show only the steps [28]. For an explainer, the "why" belongs in the
narration while the step happens on screen.

Concreteness fading [27] starts with a concrete representation, moves
through an intermediate one, and ends with the abstract form, explicitly
linking each to the last. It outperformed concrete-only and abstract-only
instruction in the reviewed mathematics and science studies. Combined with
Berney and Bétrancourt's iconic-over-abstract moderator [7], this supports
opening on the real output or device the learner has seen and then
revealing the model underneath it.

### Teaching computing concepts visually

Hundhausen, Douglas and Stasko [30] reviewed 24 algorithm-visualization
experiments. Only 11 (46%) found a significant benefit. What predicted
success was what learners did with the visualization, not how good it
looked: studies built on active engagement found significant results in
10 of 14 cases (71%), while studies premised on better graphics alone
predicted 30% of significant results. Mayer, Fiorella and Stull [23]
reach the same conclusion for video generally: prompts to summarize or
explain are one of the five techniques that raise learning.

## Agreement and conflict with house-style.md and CLAUDE.md

- **Agree:** short single-purpose media (Höffler and Leutner; Guo), static
  cards for lookup (transient information effect), a music bed kept
  very low with few effects (coherence; the user chose a bed on 2026-09-24,
  see `.claude/references/sound-design.md`), elements that enter once and stay (transience mitigation),
  fewer text containers and larger labels (redundancy boundary), narration
  that names every on-screen fact (modality), predict then watch (active
  engagement [30], generative activity [23]).
- **Adds nuance:** Guo's 6-minute figure is an engagement ceiling, not a
  learning optimum; it doesn't justify 30-90 s on its own. The segmenting
  and transience evidence [8][9][17] does.
- **Conflict: pauses.** CLAUDE.md says inserted pauses don't improve
  learning, citing Fiorella and Mayer (2018). That commentary [22]
  endorses learner-paced segments; it doesn't show designer pauses fail.
  Designer-inserted pauses at meaningful boundaries did help [17][18][19],
  and learners rarely use a pause button themselves [19]. The house rule's
  hold at scene changes is right in kind, but the tested pauses were 2-3 s
  [17][18], longer than the house default of about 1 s. Pauses at
  arbitrary points, not at boundaries, have no support.
- **Conflict, minor: expertise reversal.** The fading ladder rests on
  Kalyuga. Noetel et al. [3] found prior knowledge did not reliably
  moderate multimedia effects across meta-analyses, and segmenting helped
  high prior knowledge learners more [17]. Fading is still sensible for
  practice guidance; it is weaker grounds for simplifying video design for
  more advanced learners.
- **Tension: captions.** Closed captions are full-text redundancy [35],
  but they are viewer-controlled and required for accessibility. Keep
  them, keep the frame's own text to labels and syntax, and keep captions
  out of the diagram area (the house bottom-15% rule does this).

## Where the evidence is weak or contested

- **Effect-size inflation.** Mayer's medians (often d > 0.8) come mostly
  from one lab, short lessons, college students, and immediate tests.
  Independent pooling [3] gives roughly half those sizes. A 2025
  meta-analysis of Mayer-authored studies [4] found large effects for text
  plus diagrams but less consistent effects for animation, larger on
  inference and transfer than on facts.
- **Animation's overall benefit is small** (g = 0.23) and heterogeneous
  [7]; whether it helps depends on the moderators above.
- **Learner control** is genuinely mixed: system pacing beat learner
  pacing for animation [7], but learner-paced segments helped transfer
  [17]. Few studies test 30-90 s clips.
- **Cueing type.** Color-spreading beating arrows rests largely on one
  mechanism study [13]; cues that move the eyes without improving
  understanding [14][20] show the limit.
- **Pause length** has no dose-response evidence; 2-3 s is what was
  tested, not an optimum.
- **Reading-time rules** come from subtitle research on films [33] and
  general reading rates [32], not from labels inside technical diagrams.
- **Speaking rate** evidence [21] is correlational engagement data; the
  acceleration meta-analysis [34] is small (12 studies).
- **Concreteness fading** [27] is reviewed mainly in school mathematics
  and science; computing evidence is thin.
- **Algorithm visualization** research [30] is dated (1990s studies) and
  mostly about interactive tools, not narrated video.
- Almost no study tests networking or Linux explainers directly; all of
  the above is transfer from biology, mechanics, mathematics, and
  programming.

## References

1. Mayer, R. E. (2017). Using multimedia for e-learning. *Journal of Computer Assisted Learning, 33*(5), 403-423. https://doi.org/10.1111/jcal.12197 (accessed 2026-09-24) [via search excerpt]
2. Mayer, R. E., & Fiorella, L. (Eds.). (2022). *The Cambridge handbook of multimedia learning* (3rd ed.). Cambridge University Press. https://doi.org/10.1017/9781108894333 (accessed 2026-09-24) [via search excerpt]
3. Noetel, M., Griffith, S., Delaney, O., Harris, N. R., Sanders, T., Parker, P., del Pozo Cruz, B., & Lonsdale, C. (2022). Multimedia design for learning: An overview of reviews with meta-meta-analysis. *Review of Educational Research, 92*(3), 413-454. https://doi.org/10.3102/00346543211052329 (preprint read at https://osf.io/pynzr/, accessed 2026-09-24)
4. Cromley, J. G., & Chen, R. (2025). A meta-analysis of Richard Mayer's multimedia learning research: Searching for boundary conditions of design principles across multiple media types. *Educational Research Review, 49*, 100730. https://www.sciencedirect.com/science/article/pii/S1747938X25000673 (accessed 2026-09-24) [via search excerpt]
5. Tversky, B., Morrison, J. B., & Betrancourt, M. (2002). Animation: Can it facilitate? *International Journal of Human-Computer Studies, 57*(4), 247-262. https://doi.org/10.1006/ijhc.2002.1017 (accessed 2026-09-24)
6. Höffler, T. N., & Leutner, D. (2007). Instructional animation versus static pictures: A meta-analysis. *Learning and Instruction, 17*(6), 722-738. https://doi.org/10.1016/j.learninstruc.2007.09.013 (accessed 2026-09-24)
7. Berney, S., & Bétrancourt, M. (2016). Does animation enhance learning? A meta-analysis. *Computers & Education, 101*, 150-167. https://doi.org/10.1016/j.compedu.2016.06.005 (conference version read at https://tecfa.unige.ch/perso/sandra/pdf/Earli2016_berney_betrancourt_FINAL.pdf, accessed 2026-09-24)
8. Leahy, W., & Sweller, J. (2011). Cognitive load theory, modality of presentation and the transient information effect. *Applied Cognitive Psychology, 25*(6), 943-951. https://doi.org/10.1002/acp.1787 (accessed 2026-09-24) [via search excerpt]
9. Wong, A., Leahy, W., Marcus, N., & Sweller, J. (2012). Cognitive load theory, the transient information effect and e-learning. *Learning and Instruction, 22*(6), 449-457. https://www.sciencedirect.com/science/article/abs/pii/S0959475212000369 (accessed 2026-09-24) [via search excerpt]
10. Schneider, S., Beege, M., Nebel, S., & Rey, G. D. (2018). A meta-analysis of how signaling affects learning with media. *Educational Research Review, 23*, 1-24. https://www.sciencedirect.com/science/article/abs/pii/S1747938X17300581 (accessed 2026-09-24) [via search excerpt]
11. de Koning, B. B., Tabbers, H. K., Rikers, R. M. J. P., & Paas, F. (2009). Towards a framework for attention cueing in instructional animations: Guidelines for research and design. *Educational Psychology Review, 21*(2), 113-140. https://doi.org/10.1007/s10648-009-9098-7 (accessed 2026-09-24) [via search excerpt]
12. de Koning, B. B., Tabbers, H. K., Rikers, R. M. J. P., & Paas, F. (2007). Attention cueing as a means to enhance learning from an animation. *Applied Cognitive Psychology, 21*(6), 731-746. https://doi.org/10.1002/acp.1346 (accessed 2026-09-24) [via search excerpt]
13. Boucheix, J.-M., & Lowe, R. K. (2010). An eye tracking comparison of external pointing cues and internal continuous cues in learning with complex animations. *Learning and Instruction, 20*(2), 123-135. https://www.sciencedirect.com/science/article/abs/pii/S0959475209000231 (accessed 2026-09-24) [via search excerpt]
14. Kriz, S., & Hegarty, M. (2007). Top-down and bottom-up influences on learning from animations. *International Journal of Human-Computer Studies, 65*(11), 911-930. https://www.sciencedirect.com/science/article/abs/pii/S1071581907000869 (accessed 2026-09-24) [via search excerpt]
15. Adesope, O. O., & Nesbit, J. C. (2012). Verbal redundancy in multimedia learning environments: A meta-analysis. *Journal of Educational Psychology, 104*(1), 250-263. https://doi.org/10.1037/a0026147 (accessed 2026-09-24) [via search excerpt]
16. Mayer, R. E., & Johnson, C. I. (2008). Revising the redundancy principle in multimedia learning. *Journal of Educational Psychology, 100*(2), 380-386. https://doi.org/10.1037/0022-0663.100.2.380 (accessed 2026-09-24) [via search excerpt]
17. Rey, G. D., Beege, M., Nebel, S., Wirzberger, M., Schmitt, T. H., & Schneider, S. (2019). A meta-analysis of the segmenting effect. *Educational Psychology Review, 31*(2), 389-419. https://doi.org/10.1007/s10648-018-9456-4 (accessed 2026-09-24)
18. Spanjers, I. A. E., van Gog, T., Wouters, P., & van Merriënboer, J. J. G. (2012). Explaining the segmentation effect in learning from animations: The role of pausing and temporal cueing. *Computers & Education, 59*(2), 274-280. https://doi.org/10.1016/j.compedu.2011.12.024 (accessed 2026-09-24)
19. Biard, N., Cojean, S., & Jamet, E. (2018). Effects of segmentation and pacing on procedural learning by video. *Computers in Human Behavior, 89*, 411-417. https://doi.org/10.1016/j.chb.2017.12.002 (accessed 2026-09-24) [via search excerpt]
20. de Koning, B. B., Tabbers, H. K., Rikers, R. M. J. P., & Paas, F. (2010). Attention guidance in learning from a complex animation: Seeing is understanding? *Learning and Instruction, 20*(2), 111-122. https://www.sciencedirect.com/science/article/abs/pii/S0959475209000103 (accessed 2026-09-24) [via search excerpt]
21. Guo, P. J., Kim, J., & Rubin, R. (2014). How video production affects student engagement: An empirical study of MOOC videos. In *Proceedings of the First ACM Conference on Learning @ Scale* (pp. 41-50). https://doi.org/10.1145/2556325.2566239 (accessed 2026-09-24)
22. Fiorella, L., & Mayer, R. E. (2018). What works and doesn't work with instructional video. *Computers in Human Behavior, 89*, 465-470. https://doi.org/10.1016/j.chb.2018.07.015 (accessed 2026-09-24) [via search excerpt]
23. Mayer, R. E., Fiorella, L., & Stull, A. (2020). Five ways to increase the effectiveness of instructional video. *Educational Technology Research and Development, 68*(3), 837-852. https://doi.org/10.1007/s11423-020-09749-6 (accessed 2026-09-24) [via search excerpt]
24. Fiorella, L., Stull, A. T., Kuhlmann, S., & Mayer, R. E. (2019). Instructor presence in video lectures: The role of dynamic drawings, eye contact, and instructor visibility. *Journal of Educational Psychology, 111*(7), 1162-1171. https://eric.ed.gov/?id=EJ1230834 (accessed 2026-09-24) [via search excerpt]
25. Mayer, R. E., Mathias, A., & Wetzell, K. (2002). Fostering understanding of multimedia messages through pre-training: Evidence for a two-stage theory of mental model construction. *Journal of Experimental Psychology: Applied, 8*(3), 147-154. https://pubmed.ncbi.nlm.nih.gov/12240927/ (accessed 2026-09-24) [via search excerpt]
26. Heer, J., & Robertson, G. G. (2007). Animated transitions in statistical data graphics. *IEEE Transactions on Visualization and Computer Graphics, 13*(6), 1240-1247. https://doi.org/10.1109/TVCG.2007.70539 (read at https://idl.cs.washington.edu/files/2007-AnimatedTransitions-InfoVis.pdf, accessed 2026-09-24)
27. Fyfe, E. R., McNeil, N. M., Son, J. Y., & Goldstone, R. L. (2014). Concreteness fading in mathematics and science instruction: A systematic review. *Educational Psychology Review, 26*(1), 9-25. https://doi.org/10.1007/s10648-014-9249-3 (accessed 2026-09-24) [via search excerpt]
28. van Gog, T., Paas, F., & van Merriënboer, J. J. G. (2004). Process-oriented worked examples: Improving transfer performance through enhanced understanding. *Instructional Science, 32*, 83-98. https://doi.org/10.1023/B:TRUC.0000021810.70784.b0 (accessed 2026-09-24) [from prior knowledge; not re-fetched]
29. Barbieri, C. A., Miller-Cotto, D., Clerjuste, S. N., & Chawla, K. (2023). A meta-analysis of the worked examples effect on mathematics performance. *Educational Psychology Review, 35*, 11. https://doi.org/10.1007/s10648-023-09745-1 (accessed 2026-09-24) [via search excerpt]
30. Hundhausen, C. D., Douglas, S. A., & Stasko, J. T. (2002). A meta-study of algorithm visualization effectiveness. *Journal of Visual Languages and Computing, 13*(3), 259-290. https://faculty.cc.gatech.edu/~stasko/papers/jvlc02.pdf (accessed 2026-09-24)
31. Sorva, J. (2013). Notional machines and introductory programming education. *ACM Transactions on Computing Education, 13*(2), Article 8. https://doi.org/10.1145/2483710.2483713 (accessed 2026-09-24) [via search excerpt]
32. Brysbaert, M. (2019). How many words do we read per minute? A review and meta-analysis of reading rate. *Journal of Memory and Language, 109*, 104047. https://doi.org/10.1016/j.jml.2019.104047 (accessed 2026-09-24) [via search excerpt]
33. Szarkowska, A., & Gerber-Morón, O. (2018). Viewers can keep up with fast subtitles: Evidence from eye movements. *PLOS ONE, 13*(6), e0199331. https://doi.org/10.1371/journal.pone.0199331 (accessed 2026-09-24)
34. Huang, Du, & Yang. (2025). Facilitating or hindering learning: A meta-analysis of acceleration on video learning. *Frontiers in Psychology*. https://pmc.ncbi.nlm.nih.gov/articles/PMC12412133/ (accessed 2026-09-24)
35. Mayer, R. E., Heiser, J., & Lonn, S. (2001). Cognitive constraints on multimedia learning: When presenting more material results in less understanding. *Journal of Educational Psychology, 93*(1), 187-198. https://doi.org/10.1037/0022-0663.93.1.187 (accessed 2026-09-24) [from prior knowledge; not re-fetched]
