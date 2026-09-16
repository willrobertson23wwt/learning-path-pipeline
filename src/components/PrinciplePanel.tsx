import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PrincipleIcon} from '../types';
import {HudIcon, HudIconName} from './HudIcon';
import {FONT_STACK, PANEL_BG} from './theme';

// Envato HUD callout icons (see scripts/prepare-hud.mjs)
const HUD_ICONS: Record<PrincipleIcon, HudIconName> = {
  leastPrivilege: 'key',
  defenseInDepth: 'firewall',
  attackSurface: 'denied',
};

// Rest position is chosen so the panel + bullet list read as a centered pair:
// panel 210..810, gap, bullet list 950..1710 — symmetric 210px margins.
const PANEL_LEFT = 210;
const PANEL_WIDTH = 600;
const COMP_WIDTH = 1920;
// Horizontal shift that takes the panel from its left anchor to screen center.
const CENTER_OFFSET = COMP_WIDTH / 2 - (PANEL_LEFT + PANEL_WIDTH / 2);

export const PrinciplePanel: React.FC<{
  text: string;
  subtitle?: string;
  icon: PrincipleIcon;
  /** Seconds (relative to the cue) when the panel slides from center to the side */
  slideAt?: number;
}> = ({text, subtitle, icon, slideAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Fade/rise in, centered; no exit — the panel holds until the scene cuts.
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 22});

  // Slide from center to the left when the bullet list arrives. With no slideAt,
  // the panel simply stays centered for the whole cue.
  const slide =
    slideAt != null
      ? spring({frame, fps, delay: Math.round(slideAt * fps), config: {damping: 200}, durationInFrames: 30})
      : 0;
  const offsetX = (1 - slide) * CENTER_OFFSET;
  const scale = 1 + (1 - slide) * 0.06; // a touch larger while it owns the center

  const hudName = HUD_ICONS[icon];

  return (
    <div style={{position: 'absolute', left: PANEL_LEFT, top: '50%', width: PANEL_WIDTH, transform: 'translateY(-50%)'}}>
      <div
        style={{
          transform: `translateX(${offsetX}px) translateY(${(1 - enter) * 30}px) scale(${scale})`,
          opacity: enter,
          fontFamily: FONT_STACK,
          background: PANEL_BG,
          borderRadius: 18,
          padding: '40px 48px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
          textAlign: 'center',
        }}
      >
        <HudIcon name={hudName} />
        <div style={{fontSize: 46, fontWeight: 800, color: 'white', marginTop: 24}}>{text}</div>
        {subtitle ? (
          <div style={{fontSize: 27, fontWeight: 500, color: 'rgba(255,255,255,0.72)', marginTop: 10}}>
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
};
