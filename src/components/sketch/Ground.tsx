import React from 'react';
import {AbsoluteFill} from 'remotion';
import {WWT} from './palette';

// The lesson ground for the hand-drawn style: WWT navy, lightest where the
// drawing sits (centered on the usable area above the caption band, like
// the L1 charcoal) and falling to navy-ink in the corners, with a frozen
// grain so the falloff can't band and the surface reads as a sheet.
export const NavyGround: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill
      style={{background: `radial-gradient(ellipse 75% 80% at 50% 42.5%, ${WWT.navy} 0%, #1B1C44 35%, #16173A 70%, ${WWT.navyInk} 100%)`}}
    />
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={3} stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.9 0.9 0.9 0 -1.1" />
      </filter>
      <rect width="1920" height="1080" filter="url(#grain)" opacity={0.05} />
    </svg>
  </AbsoluteFill>
);
