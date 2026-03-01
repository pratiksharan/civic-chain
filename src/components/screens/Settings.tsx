// src/components/screens/Settings.tsx
import { T } from '@/lib/theme';
import { Card, SL } from '@/components/ui';
import { PrimaryBtn, GhostBtn } from '@/components/ui/Button';
import type { SettingsValues } from '@/types';

interface SettingsProps {
  settingsVals: SettingsValues;
  onSettingsChange: (vals: SettingsValues) => void;
  notifPush: boolean; onNotifPush: (v: boolean) => void;
  notifEmail: boolean; onNotifEmail: (v: boolean) => void;
  notifLaws: boolean; onNotifLaws: (v: boolean) => void;
  city: string;
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative flex-shrink-0 mt-0.5 rounded-full transition-colors"
      style={{ width: 42, height: 24, background: on ? T.teal : T.bord, border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <div
        className="absolute top-0.75 rounded-full bg-white shadow-sm transition-all"
        style={{ width: 18, height: 18, top: 3, left: on ? 21 : 3, transition: 'left 0.2s' }}
      />
    </button>
  );
}

export function Settings({ settingsVals, onSettingsChange, notifPush, onNotifPush, notifEmail, onNotifEmail, notifLaws, onNotifLaws, city }: SettingsProps) {
  const inputCls = 'w-full px-3 py-2.5 rounded-lg text-sm outline-none font-sans';
  const inputStyle = { border: `1px solid ${T.bord}`, background: T.bg, color: T.txt, fontFamily: 'inherit', boxSizing: 'border-box' as const };

  const storedKey = sessionStorage.getItem('civicchain_apikey') || '';
  const [apiKey, setApiKeyLocal] = window.__apiKeyState ?? ['', () => {}];

  const notifs = [
    { key: 'push', state: notifPush, set: onNotifPush, label: 'Push Notifications', desc: 'Receive alerts on your device when your complaint status changes.', icon: '📱' },
    { key: 'email', state: notifEmail, set: onNotifEmail, label: 'Email Notifications', desc: 'Get email updates about complaint progress and SLA deadlines.', icon: '✉' },
    { key: 'laws', state: notifLaws, set: onNotifLaws, label: 'New Laws & Regulations', desc: 'Be notified when new civic laws or RTI amendments are implemented.', icon: '⚖' },
  ];

  return (
    <div className="max-w-xl animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.txt }}>Settings</h1>
      <p className="text-sm mb-7" style={{ color: T.muted }}>Configure your defaults and notification preferences.</p>

      <Card>
        <SL>Location Preferences</SL>
        {[{ key: 'city', label: 'City', placeholder: 'Bengaluru' }, { key: 'ward', label: 'Ward Number', placeholder: 'e.g. 12' }].map(f => (
          <div key={f.key} className="mb-4">
            <div className="text-xs mb-1.5" style={{ color: T.muted }}>{f.label}</div>
            <input
              value={settingsVals[f.key as keyof SettingsValues] || ''}
              onChange={e => onSettingsChange({ ...settingsVals, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className={inputCls}
              style={inputStyle}
            />
          </div>
        ))}
      </Card>

      <Card>
        <SL>Notification Preferences</SL>
        <p className="text-xs mb-4 leading-relaxed" style={{ color: T.muted }}>
          Stay updated on the status of your complaints and new civic regulations affecting your area.
        </p>
        {notifs.map((n, i) => (
          <div key={n.key} className="flex items-start gap-3.5 py-3.5" style={{ borderBottom: i < notifs.length - 1 ? `1px solid ${T.bordLight}` : 'none' }}>
            <div className="text-xl mt-0.5 flex-shrink-0">{n.icon}</div>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-0.5" style={{ color: T.txt }}>{n.label}</div>
              <div className="text-xs leading-relaxed" style={{ color: T.muted }}>{n.desc}</div>
            </div>
            <Toggle on={n.state} onToggle={() => n.set(!n.state)} />
          </div>
        ))}
        {(notifPush || notifEmail) && (
          <div className="mt-3.5 px-3.5 py-2.5 rounded-lg text-xs leading-relaxed animate-fade-in" style={{ background: T.grnLight, border: '1px solid #b0d9c0', color: T.grn }}>
            ✓ Notifications enabled. You'll be alerted when complaint statuses change.
          </div>
        )}
      </Card>

      <Card>
        <SL>About CivicChain</SL>
        <div className="text-xs leading-loose" style={{ color: T.muted }}>
          <div>Coverage: {city}, Karnataka</div>
          <div className="mt-3 px-3.5 py-2.5 rounded-lg italic" style={{ background: T.surfAlt }}>
            "All data stays on your device. Official submission is done externally via government portals."
          </div>
        </div>
      </Card>
    </div>
  );
}
