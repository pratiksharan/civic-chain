// src/components/screens/Dashboard.tsx
import { T } from '@/lib/theme';
import { PrimaryBtn, GhostBtn } from '@/components/ui/Button';
import { PastComplaints } from './PastComplaints';
import type { IssueAnalysis, DeptInfo, Screen, PastComplaint } from '@/types';

interface DashboardProps {
  analysis: IssueAnalysis | null;
  dept: DeptInfo | null;
  unlocked: boolean;
  city: string;
  isMobile: boolean;
  pastComplaints: PastComplaint[];
  onNavigate: (s: Screen) => void;
}

export function Dashboard({ city, isMobile, pastComplaints, onNavigate }: DashboardProps) {
  return (
    <div style={{ maxWidth: 860 }} className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>
          Civic Routing Platform
        </div>
        <h1 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: T.txt, margin: 0, marginBottom: 10, letterSpacing: '-0.03em', lineHeight: 1.25 }}>
          CivicChain
        </h1>
        <p style={{ color: T.muted, maxWidth: 500, lineHeight: 1.7, fontSize: 14, margin: 0 }}>
          Structured civic routing for {city}. Identify the correct authority, draft formal complaints,
          and track resolution through official channels.
        </p>
      </div>

      {/* Blue CTA banner */}
      <div style={{
        background: T.blueLight, border: `1px solid #c0d4e8`, borderRadius: 10,
        padding: isMobile ? '16px' : '20px 24px', marginBottom: 28,
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? 14 : 0,
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.blue, marginBottom: 4 }}>Describe your civic issue</div>
          <div style={{ fontSize: 12, color: T.muted }}>Issue analysis will identify the correct department and generate a formal complaint.</div>
        </div>
        <PrimaryBtn onClick={() => onNavigate('submit')} style={isMobile ? { width: '100%', justifyContent: 'center' } : {}}>Start →</PrimaryBtn>
      </div>

      <div style={{ height: 1, background: T.bord, marginBottom: 24 }} />

      {/* Module grid — 3 col desktop, 1 col mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 14, marginBottom: 28 }}>
        {[
          { title: 'Issue Routing', desc: 'Identifies the responsible department and official submission channel for your complaint.', action: 'Submit Issue', target: 'submit' as Screen },
          { title: 'Enforcement Workflow', desc: 'SLA tracking, escalation drafts, and formal appeals if your complaint is unresolved.', action: 'View Enforcement', target: 'escalation' as Screen },
          { title: 'Legal Escalation', desc: 'RTI applications and Lokayukta referrals when all escalation channels have been exhausted.', action: 'RTI Assistant', target: 'rti' as Screen },
        ].map(m => (
          <div key={m.title} style={{ background: T.surf, border: `1px solid ${T.bord}`, borderRadius: 9, padding: '18px 20px' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.txt, marginBottom: 8 }}>{m.title}</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.65, marginBottom: 18 }}>{m.desc}</div>
            <GhostBtn onClick={() => onNavigate(m.target)} style={{ fontSize: 12, padding: '7px 14px' }}>
              {m.action}
            </GhostBtn>
          </div>
        ))}
      </div>

      {/* Past & Active Complaints */}
      <PastComplaints complaints={pastComplaints} isMobile={isMobile} />

      {/* About */}
      <div style={{ background: T.surfAlt, border: `1px solid ${T.bord}`, borderRadius: 9, padding: '16px 20px', marginTop: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.txtMid, marginBottom: 4 }}>About CivicChain</div>
        <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
          CivicChain does not replace official grievance portals. It guides citizens to the correct channel
          with structured communication and enforcement support. All submissions are made directly to
          official government portals.
        </div>
      </div>
    </div>
  );
}
