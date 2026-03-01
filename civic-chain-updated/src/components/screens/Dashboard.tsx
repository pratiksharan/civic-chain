// src/components/screens/Dashboard.tsx
// Matches CivicChain_v5: tagline header, large title, blue CTA banner,
// 3-module card grid, and About section. No stats row.
import { T } from '@/lib/theme';
import { Card } from '@/components/ui';
import { PrimaryBtn, GhostBtn } from '@/components/ui/Button';
import type { IssueAnalysis, DeptInfo, Screen } from '@/types';

interface DashboardProps {
  analysis: IssueAnalysis | null;
  dept: DeptInfo | null;
  unlocked: boolean;
  city: string;
  onNavigate: (s: Screen) => void;
}

export function Dashboard({ city, onNavigate }: DashboardProps) {
  return (
    <div style={{ maxWidth: 860 }} className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>
          Civic Routing Platform
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 700, color: T.txt, margin: 0, marginBottom: 10, letterSpacing: '-0.03em', lineHeight: 1.25 }}>
          CivicChain
        </h1>
        <p style={{ color: T.muted, maxWidth: 500, lineHeight: 1.7, fontSize: 14, margin: 0 }}>
          Structured civic routing for {city}. Identify the correct authority, draft formal complaints,
          and track resolution through official channels.
        </p>
      </div>

      {/* Blue CTA banner */}
      <div style={{ background: T.blueLight, border: `1px solid #c0d4e8`, borderRadius: 10, padding: '20px 24px', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.blue, marginBottom: 4 }}>Describe your civic issue</div>
          <div style={{ fontSize: 12, color: T.muted }}>Issue analysis will identify the correct department and generate a formal complaint.</div>
        </div>
        <PrimaryBtn onClick={() => onNavigate('submit')}>Start →</PrimaryBtn>
      </div>

      <div style={{ height: 1, background: T.bord, marginBottom: 28 }} />

      {/* 3-module grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
        {[
          {
            title: 'Issue Routing',
            desc: 'Identifies the responsible department and official submission channel for your complaint.',
            action: 'Submit Issue',
            target: 'submit' as Screen,
          },
          {
            title: 'Enforcement Workflow',
            desc: 'SLA tracking, escalation drafts, and formal appeals if your complaint is unresolved.',
            action: 'View Enforcement',
            target: 'escalation' as Screen,
          },
          {
            title: 'Legal Escalation',
            desc: 'RTI applications and Lokayukta referrals when all escalation channels have been exhausted.',
            action: 'RTI Assistant',
            target: 'rti' as Screen,
          },
        ].map(m => (
          <div key={m.title} style={{ background: T.surf, border: `1px solid ${T.bord}`, borderRadius: 9, padding: '20px 22px' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.txt, marginBottom: 8 }}>{m.title}</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.65, marginBottom: 20 }}>{m.desc}</div>
            <GhostBtn onClick={() => onNavigate(m.target)} style={{ fontSize: 12, padding: '7px 14px' }}>
              {m.action}
            </GhostBtn>
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{ background: T.surfAlt, border: `1px solid ${T.bord}`, borderRadius: 9, padding: '16px 20px' }}>
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
