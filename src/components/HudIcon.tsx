import {Lottie, LottieAnimationData} from '@remotion/lottie';
import deniedData from '../assets/hud/denied.json';
import firewallData from '../assets/hud/firewall.json';
import keyData from '../assets/hud/key.json';
import lockData from '../assets/hud/lock.json';

export type HudIconName = 'key' | 'firewall' | 'denied' | 'lock';

const DATA: Record<HudIconName, LottieAnimationData> = {
  key: keyData as unknown as LottieAnimationData,
  firewall: firewallData as unknown as LottieAnimationData,
  denied: deniedData as unknown as LottieAnimationData,
  lock: lockData as unknown as LottieAnimationData,
};

// The icon badge sits at (480, 540) in the source 1920x1080 comp, ~660px wide.
const ICON_CENTER = {x: 480, y: 540};
const CROP = 720;

/**
 * Envato HUD callout icon, cropped to the animated badge. Plays its eased
 * draw-in once at the start of the cue, then holds on the final frame —
 * loop is off, so it never redraws / pulses in and out.
 */
export const HudIcon: React.FC<{name: HudIconName; size?: number}> = ({name, size = 320}) => {
  const scale = size / CROP;
  return (
    <div style={{width: size, height: size, margin: '0 auto', position: 'relative', overflow: 'hidden'}}>
      <Lottie
        animationData={DATA[name]}
        loop={false}
        style={{
          width: 1920 * scale,
          height: 1080 * scale,
          position: 'absolute',
          left: size / 2 - ICON_CENTER.x * scale,
          top: size / 2 - ICON_CENTER.y * scale,
        }}
      />
    </div>
  );
};
