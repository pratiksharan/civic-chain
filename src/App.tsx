// src/App.tsx
// Top-level app shell. Matches CivicChain_v5 layout:
//   - Sidebar slides to width 0 when closed (not icon-only)
//   - Topbar: hamburger (☰) left | page label | location pin chip right
//   - Companion mode shown as a topbar badge, not a full banner below
import { useState, useCallback, useEffect } from 'react';
import { T } from '@/lib/theme';
import { DEPT_MAP } from '@/lib/constants';
import { extractIssue, generateComplaint, generateRTI } from '@/lib/api';
import { Sidebar } from '@/components/Sidebar';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { SubmitIssue } from '@/components/screens/SubmitIssue';
import { Settings } from '@/components/screens/Settings';
import { RoutingResult } from '@/components/screens/RoutingResult';
import { Enforcement } from '@/components/screens/Enforcement';
import { RTIAssistant } from '@/components/screens/RTIAssistant';
import { Dashboard } from '@/components/screens/Dashboard';

import { useIsMobile } from '@/lib/useIsMobile';
import type { Screen, AuthScreen as AuthScreenType, IssueAnalysis, LoadingState, SettingsValues, PastComplaint, ComplaintStatus } from '@/types';

const STORAGE_KEY = 'civicchain_complaints';

function loadComplaints(): PastComplaint[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
}

function saveComplaints(list: PastComplaint[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

function makeId(dept: string): string {
  const prefix = dept.replace(/[^A-Z]/g, '').slice(0, 5) || 'CVC';
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 900000) + 100000);
  return `${prefix}-${year}-${num}`;
}

function daysElapsed(dateStr: string): number {
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}

/** Human-readable breadcrumb for the topbar */
const SCREEN_LABELS: Record<Screen, string> = {
  dashboard: 'Dashboard',
  submit: 'Submit Issue',
  routing: 'Routing Result',
  escalation: 'Enforcement',
  rti: 'RTI Assistant',
  settings: 'Settings',
};

/** Screens that require analysis to be present */
const LOCKED_SCREENS: Screen[] = ['routing', 'escalation', 'rti'];

export default function App() {
  const isMobile = useIsMobile();
  const [authScreen, setAuthScreen] = useState<AuthScreenType>('login');
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [issueText, setIssueText] = useState('');
  const [analysis, setAnalysis] = useState<IssueAnalysis | null>(null);
  const [complaint, setComplaint] = useState('');
  const [rtiDraft, setRtiDraft] = useState('');
  const [loading, setLoadingState] = useState<LoadingState>({});
  const [unlocked, setUnlocked] = useState(false);
  const [companionMode, setCompanion] = useState(false);
  const [city, setCity] = useState('Detecting…');
  const [settingsVals, setSettings] = useState<SettingsValues>({ city: '', ward: '' });
  const [pastComplaints, setPastComplaints] = useState<PastComplaint[]>(loadComplaints);
  const [notifPush, setNotifPush] = useState(false);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifLaws, setNotifLaws] = useState(false);

  const dept = analysis ? (DEPT_MAP[analysis.issueType] ?? DEPT_MAP.general) : null;
  const setLoad = (k: keyof LoadingState, v: boolean) => setLoadingState(p => ({ ...p, [k]: v }));

  // Auto-detect city on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
            .then(r => r.json())
            .then((data: { address?: { city?: string; town?: string; county?: string } }) => {
              const c = data.address?.city ?? data.address?.town ?? data.address?.county ?? 'Bengaluru';
              setCity(c); setSettings(p => ({ ...p, city: c }));
            })
            .catch(() => { setCity('Bengaluru'); setSettings(p => ({ ...p, city: 'Bengaluru' })); });
        },
        () => { setCity('Bengaluru'); setSettings(p => ({ ...p, city: 'Bengaluru' })); }
      );
    } else {
      setCity('Bengaluru'); setSettings(p => ({ ...p, city: 'Bengaluru' }));
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!issueText.trim() || issueText.trim().length < 10) return;
    setLoad('analyze', true);
    try {
      const result = await extractIssue(issueText);
      if (result) {
        setAnalysis(result); setComplaint(''); setRtiDraft('');
        setUnlocked(true); setScreen('routing');
        const d = DEPT_MAP[result.issueType] ?? DEPT_MAP.general;
        const today = new Date().toISOString().split('T')[0];
        const newEntry: PastComplaint = {
          id: makeId(d.dept),
          title: result.issueSummary.length > 60 ? result.issueSummary.slice(0, 57) + '…' : result.issueSummary,
          desc: result.issueSummary,
          type: result.issueType,
          date: today,
          status: 'Acknowledged' as ComplaintStatus,
          daysElapsed: 0,
          sla: d.sla,
        };
        setPastComplaints(prev => {
          const updated = [newEntry, ...prev];
          saveComplaints(updated);
          return updated;
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      alert(`AI error: ${msg}\n\nMake sure GEMINI_API_KEY is set in your Vercel environment variables.`);
    }
    setLoad('analyze', false);
  }, [issueText]);

  const handleGenerateComplaint = async () => {
    if (!analysis || !dept) return;
    setLoad('complaint', true);
    try { setComplaint(await generateComplaint(analysis, dept)); } catch (e) { console.error(e); }
    setLoad('complaint', false);
  };

  const handleRTI = async () => {
    if (!analysis || !dept) return;
    setLoad('rti', true);
    try { setRtiDraft(await generateRTI(analysis, dept)); } catch (e) { console.error(e); }
    setLoad('rti', false);
  };

  const navigate = (id: Screen) => {
    if (LOCKED_SCREENS.includes(id) && !unlocked) return;
    setScreen(id);
  };

  const handleOpenPortal = () => {
    if (!dept) return;
    window.open(dept.hasDeepLink && dept.deepLink ? dept.deepLink : dept.portal, '_blank');
    setCompanion(true);
  };

  if (authScreen !== 'app') {
    return <AuthScreen authScreen={authScreen} onSetAuth={setAuthScreen} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 14, color: T.txt }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
        .animate-fade-in { animation: fadeIn 0.28s ease forwards; }
        .animate-spin-fast { animation: spin 0.7s linear infinite; }
        * { box-sizing: border-box; }
        button:hover { opacity: 0.87; }
        textarea:focus { border-color: #2e7d62 !important; box-shadow: 0 0 0 3px #2e7d6214; }
        input:focus { border-color: #2e7d62 !important; outline: none; box-shadow: 0 0 0 3px #2e7d6214; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334; border-radius: 3px; }
      `}</style>

      {/* Companion floating banner (bottom-right) */}
      {companionMode && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 100,
            background: T.surf, border: `1px solid ${T.tealBord}`,
            borderLeft: `4px solid ${T.teal}`, borderRadius: 10,
            padding: '14px 18px', maxWidth: 300,
            boxShadow: '0 4px 20px #0000000d',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.txt }}>Submission Mode</span>
            <button onClick={() => setCompanion(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.dim, fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
          </div>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, marginBottom: 10 }}>
            The official portal is open in a new tab. Return here to follow the checklist and copy each field.
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: T.teal }}>Follow the checklist below ↓</div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        screen={screen} unlocked={unlocked} city={city}
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
        onNavigate={navigate}
        onToggle={() => setSidebarOpen(v => !v)}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Topbar — matches v5: hamburger left, breadcrumb, location pin chip right */}
        <div style={{
          background: T.surf,
          borderBottom: `1px solid ${T.bord}`,
          padding: '11px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: 17, padding: '2px 4px', lineHeight: 1 }}
          >
            ☰
          </button>

          {/* Breadcrumb */}
          <div style={{ fontSize: 11, color: T.dim, letterSpacing: '0.08em', marginLeft: 4 }}>
            {SCREEN_LABELS[screen] ?? 'CivicChain'}
          </div>

          <div style={{ flex: 1 }} />

          {/* Right side */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {companionMode && (
              <div style={{ fontSize: 11, background: '#fff8ec', border: `1px solid #e8d070`, borderRadius: 5, padding: '3px 10px', color: T.amb, fontWeight: 600 }}>
                ◉ Submission Mode
              </div>
            )}
            {/* Location chip with pin icon — matches v5 exactly */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              background: T.blueLight, color: T.blue, border: `1px solid #c0d4e8`,
              borderRadius: 4, padding: '3px 8px',
            }}>
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path d="M5 0C3.07 0 1.5 1.57 1.5 3.5C1.5 6.13 5 11 5 11C5 11 8.5 6.13 8.5 3.5C8.5 1.57 6.93 0 5 0ZM5 4.75C4.31 4.75 3.75 4.19 3.75 3.5C3.75 2.81 4.31 2.25 5 2.25C5.69 2.25 6.25 2.81 6.25 3.5C6.25 4.19 5.69 4.75 5 4.75Z" fill={T.blue} />
              </svg>
              {city}
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '20px 16px' : '32px 36px' }}>
          {screen === 'dashboard' && (
            <Dashboard analysis={analysis} dept={dept} unlocked={unlocked} city={city} isMobile={isMobile} onNavigate={navigate}
              pastComplaints={pastComplaints.map(c => ({ ...c, daysElapsed: daysElapsed(c.date) }))}
            />
          )}

          {screen === 'submit' && (
            <SubmitIssue
              issueText={issueText} onIssueChange={setIssueText}
              onAnalyze={handleAnalyze} loading={!!loading.analyze} city={city} isMobile={isMobile}
            />
          )}

          {screen === 'routing' && analysis && dept && (
            <RoutingResult
              analysis={analysis} dept={dept} complaint={complaint}
              loading={loading} isMobile={isMobile} onGenerateComplaint={handleGenerateComplaint}
              onOpenPortal={handleOpenPortal}
              onGoRTI={() => navigate('rti')}
              onGoEnforcement={() => navigate('escalation')}
            />
          )}
          {screen === 'routing' && (!analysis || !dept) && (
            <div className="animate-fade-in" style={{ maxWidth: 500, paddingTop: 40 }}>
              <div style={{ background: T.surf, border: `1px solid ${T.bord}`, borderRadius: 12, padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: T.txt, marginBottom: 8 }}>No Issue Submitted Yet</div>
                <div style={{ fontSize: 13, color: T.muted, marginBottom: 24, lineHeight: 1.6 }}>Submit a civic issue to see routing results.</div>
                <button onClick={() => navigate('submit')} style={{ padding: '10px 22px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: T.blue, color: '#fff', fontFamily: 'inherit' }}>
                  Submit an Issue
                </button>
              </div>
            </div>
          )}

          {screen === 'escalation' && analysis && dept && (
            <Enforcement analysis={analysis} dept={dept} />
          )}
          {screen === 'escalation' && (!analysis || !dept) && (
            <div className="animate-fade-in" style={{ maxWidth: 500, paddingTop: 40 }}>
              <div style={{ background: T.surf, border: `1px solid ${T.bord}`, borderRadius: 12, padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: T.txt, marginBottom: 8 }}>Submit an Issue First</div>
                <div style={{ fontSize: 13, color: T.muted, marginBottom: 24, lineHeight: 1.6 }}>Submit a civic issue to activate the enforcement workflow.</div>
                <button onClick={() => navigate('submit')} style={{ padding: '10px 22px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: T.blue, color: '#fff', fontFamily: 'inherit' }}>
                  Submit an Issue
                </button>
              </div>
            </div>
          )}

          {screen === 'rti' && analysis && dept && (
            <RTIAssistant
              analysis={analysis} dept={dept}
              rtiDraft={rtiDraft} loading={!!loading.rti}
              onGenerateRTI={handleRTI}
            />
          )}
          {screen === 'rti' && (!analysis || !dept) && (
            <div className="animate-fade-in" style={{ maxWidth: 500, paddingTop: 40 }}>
              <div style={{ background: T.surf, border: `1px solid ${T.bord}`, borderRadius: 12, padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: T.txt, marginBottom: 8 }}>Submit an Issue First</div>
                <div style={{ fontSize: 13, color: T.muted, marginBottom: 24, lineHeight: 1.6 }}>Submit a civic issue to unlock the RTI assistant.</div>
                <button onClick={() => navigate('submit')} style={{ padding: '10px 22px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: T.blue, color: '#fff', fontFamily: 'inherit' }}>
                  Submit an Issue
                </button>
              </div>
            </div>
          )}

          {screen === 'settings' && (
            <Settings
              settingsVals={settingsVals} onSettingsChange={setSettings}
              notifPush={notifPush} onNotifPush={setNotifPush}
              notifEmail={notifEmail} onNotifEmail={setNotifEmail}
              notifLaws={notifLaws} onNotifLaws={setNotifLaws}
              city={city}
            />
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${T.bord}`, padding: '12px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.surf }}>
          <div style={{ fontSize: 11, color: T.dim }}>CivicChain © 2026</div>
          <div style={{ fontSize: 11, color: T.dim }}>{city}, Karnataka</div>
        </div>
      </div>
    </div>
  );
}
