import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {HandText} from './HandText';
import {InkDefs} from './Ink';
import {INK} from './palette';
import {TitleLight} from './TitleLight';

// The standalone-video close in the hand-drawn style: the title light fades
// back in at `inSec` and "Thank You for Watching!" letters itself on over it,
// then holds to the end. Put it after the last scene's sheet wipe.
export const SketchThankYou: React.FC<{inSec: number; transparent?: boolean}> = ({inSec, transparent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < inSec) return null;
  const p = interpolate(t, [inSec + 0.3, inSec + 1.4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });
  return (
    <AbsoluteFill>
      {transparent ? null : <TitleLight fadeInStartSec={inSec} fadeSec={0.6} />}
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <InkDefs />
        <g filter="url(#marker)">
          <HandText text="Thank You for Watching!" x={960} y={560} cap={76} align="middle" color={INK.line} progress={p} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
