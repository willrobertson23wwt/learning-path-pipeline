# Pipeline diagrams

One diagram per stage. Each reads top to bottom: on the left, the steps the
main chat runs and the stops where it waits for you; on the right, what a
step hands off to (an agent, or an outside tool such as ElevenLabs or Lab
Builder). Dashed boxes run only when needed. Which agents a stage uses is
set by CLAUDE.md "Who does the work".

All of them are drawn by `agent-diagrams.py` (plain Python). When a skill
or agent changes, edit its rows there and redraw, then commit the SVGs and
PNGs together:

```bash
python3 docs/diagrams/agent-diagrams.py docs/diagrams --png
```

## The whole pipeline

Every skill and the agents it runs, in both formats:

![Learning path pipeline: skills and their agents](learning-path-agents-overview.png)

The video section's skills, and where the helper skills fit:

![The video section: skills and where they fit](skills-video-section.png)

## Starting a path

![/new-path: start a learning path](stage-new-path.png)

## Outline, scripts and audio

![/outline: plan the path](stage-outline.png)

![/scripts: narration and visual briefs](stage-scripts.png)

![/audio: narration, timings and captions](stage-audio.png)

## Video

A traditional path builds one video of 2-4 chapters per run:

![/video, traditional: one video, 2-4 chapters](stage-video-traditional.png)

A lab-first path builds one lab's media per run:

![/video, lab-first: one lab's media](stage-video-lab-first.png)

![/article: the written version of a video](stage-article.png)

![/revise: act on your review notes](stage-revise.png)

## Labs

![/lab: draft a lab guide](stage-lab.png)

![/lab-review and /lab-topology](stage-lab-review.png)

![/lab-build and /lab-setup](stage-lab-build-setup.png)

## Finishing a path

![/closeout and /toolkit-review](stage-closeout.png)
