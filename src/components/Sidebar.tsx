// src/components/Sidebar.tsx
import { T } from '@/lib/theme';
import { NAV_ITEMS } from '@/lib/constants';
import type { Screen } from '@/types';

interface SidebarProps {
  screen: Screen;
  unlocked: boolean;
  city: string;
  sidebarOpen: boolean;
  isMobile: boolean;
  onNavigate: (id: Screen) => void;
  onToggle: () => void;
}

const MAIN_NAV = NAV_ITEMS.filter(i => i.id !== 'settings');
const SETTINGS_NAV = NAV_ITEMS.filter(i => i.id === 'settings');

export function Sidebar({ screen, unlocked, city, sidebarOpen, isMobile, onNavigate, onToggle }: SidebarProps) {
  const handleNav = (id: Screen) => {
    onNavigate(id);
    if (isMobile) onToggle(); // close on mobile after navigation
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={onToggle}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.45)',
          }}
        />
      )}

      <div
        style={{
          width: 240,
          minWidth: 240,
          background: T.sideBase,
          borderRight: `1px solid ${T.sideBord}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'transform 0.22s ease',
          flexShrink: 0,
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: isMobile ? 50 : 'auto',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        } as React.CSSProperties}
      >
        <style>{`
          .nav-btn { transition: background 0.15s, box-shadow 0.15s !important; }
          .nav-btn:hover { background: ${T.sideHover} !important; box-shadow: inset 0 0 0 1px ${T.sideBord} !important; opacity: 1 !important; }
        `}</style>

        {/* Logo */}
        <div style={{ padding: '18px 16px 16px', borderBottom: `1px solid ${T.sideBord}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="34" height="34" viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }}>
              <polygon points="22,2 40,12 40,32 22,42 4,32 4,12" fill="none" stroke="#2e9d82" strokeWidth="2.2" strokeLinejoin="round" />
              <rect x="18" y="20" width="5" height="12" rx="1.5" fill="#e8f2f8" />
              <rect x="12" y="26" width="4" height="6" rx="1.5" fill="#2e9d82" opacity="0.7" />
              <rect x="26" y="23" width="4" height="9" rx="1.5" fill="#2e9d82" opacity="0.55" />
            </svg>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Georgia, serif', letterSpacing: '-0.3px', lineHeight: 1.2, color: '#e8f2f8' }}>
                Civic<span style={{ color: '#2e9d82' }}>Chain</span>
              </div>
              <div style={{ fontSize: 8, color: T.sideMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>{city}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '14px 10px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: 9, color: T.sideDim, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '0 11px', marginBottom: 8 }}>
            Navigation
          </div>

          {MAIN_NAV.map((item) => {
            const isLocked = 'locked' in item && item.locked && !unlocked;
            const isActive = screen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => !isLocked && handleNav(item.id as Screen)}
                className="nav-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '9px 12px', borderRadius: 7, border: 'none',
                  cursor: isLocked ? 'default' : 'pointer', textAlign: 'left',
                  fontSize: 12.5, fontWeight: isActive ? 600 : 400,
                  background: isActive ? T.sideActive : 'transparent',
                  color: isLocked ? T.sideDim : isActive ? '#e0f4ee' : T.sideTxt,
                  borderLeft: `3px solid ${isActive ? T.sideActiveBord : 'transparent'}`,
                  marginBottom: 2, fontFamily: 'inherit',
                  opacity: isLocked ? 0.45 : 1, boxShadow: 'none',
                }}
              >
                <span style={{ fontSize: 13, width: 18, textAlign: 'center', opacity: isLocked ? 0.5 : 1 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {isLocked && <span style={{ fontSize: 9, color: T.sideDim }}>—</span>}
                {isActive && <div style={{ width: 4, height: 4, borderRadius: '50%', background: T.sideActiveBord, flexShrink: 0 }} />}
              </button>
            );
          })}

          <div style={{ height: 1, background: T.sideBord, margin: '12px 6px' }} />

          {SETTINGS_NAV.map((item) => {
            const isActive = screen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id as Screen)}
                className="nav-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '9px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
                  textAlign: 'left', fontSize: 12.5,
                  background: isActive ? T.sideActive : 'transparent',
                  color: isActive ? '#e0f4ee' : T.sideMuted,
                  borderLeft: `3px solid ${isActive ? T.sideActiveBord : 'transparent'}`,
                  fontFamily: 'inherit', boxShadow: 'none',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom city label */}
        <div style={{ padding: '14px 16px', borderTop: `1px solid ${T.sideBord}` }}>
          <div style={{ fontSize: 10, color: T.sideDim, letterSpacing: '0.08em', textAlign: 'center' }}>{city}, Karnataka</div>
        </div>
      </div>
    </>
  );
}
