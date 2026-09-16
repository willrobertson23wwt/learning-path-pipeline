import {useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT, FONT_STACK, LINE, MONO_STACK, PANEL_BG} from '../theme';
import {appear} from '../terminal/kit';
import {useFlag, useNum} from '../layout';
import {DEFAULT_STAGE_CENTER_Y, SCENES, sceneFade, T1} from './kit1';

const CHIPS = ['Functions', 'Arrays', 'Traps & options', 'Debugging', 'Scheduling'];

export const RoadmapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fade = sceneFade(frame, fps, SCENES.C);
  const centerY = useNum('stageCenterY', DEFAULT_STAGE_CENTER_Y);
  const show = useFlag('showRoadmap', true);
  if (fade <= 0 || !show) return null;

  const headP = appear(frame, fps, T1.growHeader, 16);
  const arrowP = appear(frame, fps, T1.growHeader + 1.6, 18);
  const toolP = appear(frame, fps, T1.toolLabel, 14);
  const litP = appear(frame, fps, T1.firstChipLit, 12);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: centerY,
        transform: 'translate(-50%, -50%)',
        opacity: fade,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 44,
        fontFamily: FONT_STACK,
      }}
    >
      <div style={{fontSize: 26, fontWeight: 600, letterSpacing: 3, color: 'rgba(255,255,255,0.6)', opacity: headP}}>
        THIS MODULE
      </div>

      {/* cleanup.sh → a real log rotation tool */}
      <div style={{display: 'flex', alignItems: 'center', gap: 30, opacity: headP, transform: `translateY(${(1 - headP) * 16}px)`}}>
        <div
          style={{
            fontFamily: MONO_STACK,
            fontSize: 42,
            fontWeight: 700,
            color: LINE,
            background: PANEL_BG,
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 16,
            padding: '18px 34px',
            boxShadow: '0 16px 44px rgba(0,0,0,0.45)',
          }}
        >
          cleanup.sh
        </div>
        <svg width="120" height="30" viewBox="0 0 120 30" style={{opacity: arrowP}}>
          <line x1="4" y1="15" x2={4 + 96 * arrowP} y2="15" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" />
          <path
            d={`M${88 * arrowP + 4} 5 L${100 * arrowP + 8} 15 L${88 * arrowP + 4} 25`}
            fill="none"
            stroke={ACCENT}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: 'white',
            opacity: toolP,
            transform: `translateY(${(1 - toolP) * 12}px)`,
          }}
        >
          a real log rotation tool
        </div>
      </div>

      {/* Roadmap chips — the module's steps, first one lit */}
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        {CHIPS.map((c, i) => {
          const p = appear(frame, fps, T1.chipsIn + i * 0.32, 12);
          const lit = i === 0 ? litP : 0;
          return (
            <div key={c} style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: lit > 0.3 ? ACCENT : 'rgba(255,255,255,0.85)',
                  background: PANEL_BG,
                  border: `2px solid ${lit > 0.3 ? ACCENT : 'rgba(255,255,255,0.18)'}`,
                  borderRadius: 999,
                  padding: '14px 28px',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 14}px) scale(${1 + lit * 0.06})`,
                  boxShadow: lit > 0.3 ? '0 0 34px rgba(0,194,255,0.35)' : '0 10px 30px rgba(0,0,0,0.35)',
                  whiteSpace: 'nowrap',
                }}
              >
                {c}
              </div>
              {i < CHIPS.length - 1 ? (
                <div style={{width: 22, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.3)', opacity: p}} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
