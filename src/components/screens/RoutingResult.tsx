// src/components/screens/RoutingResult.tsx
import { useState } from 'react';
import { T } from '@/lib/theme';
import { SeverityBadge, TealChip, BlueChip } from '@/components/ui';
import { PrimaryBtn, GhostBtn } from '@/components/ui/Button';
import { CopyField, CopyableText } from '@/components/ui/CopyField';
import type { IssueAnalysis, DeptInfo, LoadingState, DifficultyLabel } from '@/types';

const DIFF_COLOR: Record<DifficultyLabel, [string, string, string]> = {
  Easy:   ['#1a6e3f', '#eefaf2', '#b0d9c0'],
  Medium: ['#b45309', '#fef9ee', '#e8d080'],
  Hard:   ['#c0392b', '#fdf1f0', '#f0b0a8'],
};

interface RoutingResultProps {
  analysis: IssueAnalysis;
  dept: DeptInfo;
  complaint: string;
  loading: LoadingState;
  isMobile: boolean;
  onGenerateComplaint: () => void;
  onOpenPortal: () => void;
  onGoRTI: () => void;
  onGoEnforcement: () => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: T.teal, letterSpacing: '0.12em' }}>
      {children}
    </p>
  );
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 px-4 rounded-lg" style={{ background: T.bg, border: `1px solid ${T.bordLight}` }}>
      <p className="text-xs mb-1" style={{ color: T.muted }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color: T.txt }}>{value || '—'}</p>
    </div>
  );
}

function Divider() {
  return <div className="my-5" style={{ height: 1, background: T.bordLight }} />;
}

function GuideChecklist({ guide, deptName }: { guide: DeptInfo['guide']; deptName: string }) {
  const [checked, setChecked] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const toggle = (i: number) => setChecked(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const pct = Math.round((checked.length / guide.length) * 100);
  const allDone = checked.length === guide.length;

  return (
    <div className="rounded-xl" style={{ border: `1px solid ${T.bord}`, background: T.surf, overflow: 'hidden' }}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${T.bordLight}`, background: T.bg }}>
        <div>
          <SectionLabel>Submission Guide</SectionLabel>
          <p className="text-sm font-medium -mt-2" style={{ color: T.txt }}>{deptName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold mb-1.5" style={{ color: allDone ? T.grn : T.muted }}>{checked.length} / {guide.length} steps</p>
          <div className="w-28 h-1 rounded-full" style={{ background: T.bordLight }}>
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: allDone ? T.grn : T.teal }} />
          </div>
        </div>
      </div>
      {guide.map((g, i) => {
        const done = checked.includes(i);
        const open = expanded === i;
        return (
          <div key={i} style={{ borderBottom: i < guide.length - 1 ? `1px solid ${T.bordLight}` : 'none', background: done ? '#fafdf9' : T.surf }}>
            <div className="flex items-center gap-3 px-6 py-3.5 cursor-pointer select-none" onClick={() => toggle(i)}>
              <div className="flex-shrink-0 flex items-center justify-center transition-all"
                style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${done ? T.teal : T.bord}`, background: done ? T.teal : 'transparent' }}>
                {done && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <span className="text-xs font-semibold w-12 flex-shrink-0" style={{ color: T.muted }}>Step {i + 1}</span>
              <span className="flex-1 text-sm" style={{ color: done ? T.muted : T.txtMid, fontWeight: done ? 400 : 500, textDecoration: done ? 'line-through' : 'none' }}>{g.step}</span>
              {g.tip && (
                <button onClick={e => { e.stopPropagation(); setExpanded(open ? null : i); }}
                  className="text-xs px-2 py-1 rounded flex-shrink-0"
                  style={{ color: open ? T.teal : T.dim, background: open ? T.tealLight : T.bg, border: `1px solid ${open ? T.tealBord : T.bordLight}`, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {open ? '↑ Hide' : '↓ Tip'}
                </button>
              )}
            </div>
            {open && g.tip && (
              <div className="px-6 pb-4">
                <p className="text-xs leading-relaxed px-3 py-2.5 rounded-lg" style={{ color: T.teal, background: T.tealLight, border: `1px solid ${T.tealBord}` }}>{g.tip}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function RoutingResult({ analysis, dept, complaint, loading, isMobile, onGenerateComplaint, onOpenPortal, onGoRTI, onGoEnforcement }: RoutingResultProps) {
  const [diffColor, diffBg, diffBord] = DIFF_COLOR[dept.difficulty.label];

  return (
    <div className="animate-fade-in" style={{ maxWidth: 860 }}>

      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: T.txt, fontSize: isMobile ? 20 : undefined }}>Routing Result</h1>
        <p className="text-sm" style={{ color: T.muted }}>AI has analysed your issue and routed it to the correct authority.</p>
      </div>

      {/* Routing summary banner */}
      <div className="rounded-xl mb-5" style={{ border: `1px solid ${T.tealBord}`, background: T.tealLight, overflow: 'hidden' }}>
        <div style={{ padding: isMobile ? '16px' : '20px 24px' }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            {/* Left */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.teal }}>Routed to</span>
                <SeverityBadge s={analysis.severity} />
              </div>
              <h2 style={{ margin: '0 0 6px', fontSize: isMobile ? 16 : 18, fontWeight: 700, color: T.txt }}>{dept.dept}</h2>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: T.txtMid }}>{analysis.issueSummary}</p>
            </div>
            {/* Stats — 4-col on desktop, 2x2 on mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, auto)', gap: isMobile ? '12px 24px' : '0 28px', flexShrink: 0 }}>
              {[
                { label: 'SLA', value: `${dept.sla}h`, color: T.teal },
                { label: 'Level', value: dept.level, color: T.txt },
                { label: 'Avg Response', value: dept.intelligence.avgResponse, color: T.txt },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: T.muted }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</p>
                </div>
              ))}
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 11, color: T.muted }}>Difficulty</p>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4, color: diffColor, background: diffBg, border: `1px solid ${diffBord}` }}>{dept.difficulty.label}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Contact strip */}
        <div style={{ padding: isMobile ? '10px 16px' : '10px 24px', borderTop: `1px solid ${T.tealBord}`, background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <a href={`tel:${dept.phone}`} style={{ fontSize: 13, fontWeight: 500, color: T.teal, textDecoration: 'none' }}>📞 {dept.phone}</a>
          <a href={`mailto:${dept.email}`} style={{ fontSize: 13, fontWeight: 500, color: T.blue, textDecoration: 'none' }}>✉ {dept.email}</a>
        </div>
      </div>

      {/* Two-column body — stacks on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 252px', gap: 20 }}>

        {/* LEFT */}
        <div className="flex flex-col gap-5">

          {/* Issue Analysis */}
          <div className="rounded-xl px-6 py-5" style={{ border: `1px solid ${T.bord}`, background: T.surf }}>
            <SectionLabel>Issue Analysis</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr', gap: 10 }}>
              <MetaBlock label="Issue Type" value={analysis.issueType} />
              <MetaBlock label="Department" value={dept.dept} />
              <MetaBlock label="Gov. Level" value={analysis.governmentLevel} />
              <MetaBlock label="Location" value={analysis.location} />
              <MetaBlock label="Duration" value={analysis.duration} />
              <MetaBlock label="Ward" value={analysis.ward ?? '—'} />
            </div>
            {analysis.keyFacts && analysis.keyFacts.length > 0 && (
              <>
                <Divider />
                <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.muted, marginBottom: 10 }}>Key Facts</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {analysis.keyFacts.map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: T.txtMid }}>
                      <span style={{ marginTop: 6, width: 4, height: 4, borderRadius: '50%', background: T.teal, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {analysis.confidenceScore !== undefined && (
              <>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.muted }}>Classification Confidence</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.txt }}>{Math.round(analysis.confidenceScore * 100)}%</p>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: T.bordLight }}>
                  <div style={{ height: '100%', borderRadius: 99, width: `${Math.round(analysis.confidenceScore * 100)}%`, background: T.teal }} />
                </div>
              </>
            )}
          </div>

          {/* Submission Channel */}
          <div className="rounded-xl" style={{ border: `1px solid ${T.bord}`, background: T.surf, overflow: 'hidden' }}>
            <div style={{ padding: '14px 24px', borderBottom: `1px solid ${T.bordLight}`, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <SectionLabel>Official Submission Channel</SectionLabel>
              <div style={{ display: 'flex', gap: 8, marginTop: -10 }}>
                <TealChip>EST. STEPS: {dept.difficulty.steps}</TealChip>
                <BlueChip>TIME: {dept.difficulty.mins}</BlueChip>
              </div>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: T.muted }}>Direct Complaint Registration</p>
              <p style={{ margin: '0 0 14px', fontSize: 13, fontFamily: 'monospace', color: T.txtMid }}>{dept.portal.replace('https://', '')}</p>
              <PrimaryBtn onClick={onOpenPortal} style={{ width: '100%', marginBottom: 16 }}>Open Portal →</PrimaryBtn>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 10 }}>
                <div style={{ borderRadius: 8, padding: '12px 14px', background: T.bg, border: `1px solid ${T.bordLight}` }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: T.muted }}>Official Email</p>
                  <a href={`mailto:${dept.email}`} style={{ fontSize: 13, fontWeight: 600, color: T.blue, textDecoration: 'none' }}>{dept.email}</a>
                </div>
                <div style={{ borderRadius: 8, padding: '12px 14px', background: T.bg, border: `1px solid ${T.bordLight}` }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: T.muted }}>Helpline</p>
                  <a href={`tel:${dept.phone}`} style={{ fontSize: 13, fontWeight: 700, color: T.teal, textDecoration: 'none' }}>📞 {dept.phone}</a>
                </div>
                <div style={{ borderRadius: 8, padding: '12px 14px', background: T.bg, border: `1px solid ${T.bordLight}` }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: T.muted }}>SLA</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.txt }}>{dept.sla} hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Complaint Letter */}
          <div className="rounded-xl" style={{ border: `1px solid ${T.bord}`, background: T.surf, overflow: 'hidden' }}>
            <div style={{ padding: '14px 24px', borderBottom: `1px solid ${T.bordLight}`, background: T.bg }}>
              <SectionLabel>AI-Generated Complaint Letter</SectionLabel>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {!complaint ? (
                <>
                  <p style={{ margin: '0 0 16px', fontSize: 13, color: T.muted }}>Generate a professionally worded complaint letter ready to submit or email.</p>
                  <PrimaryBtn onClick={onGenerateComplaint} loading={loading.complaint}>Generate Formal Complaint</PrimaryBtn>
                </>
              ) : (
                <div className="animate-fade-in">
                  <CopyableText text={complaint} label="Formal Complaint Letter" />
                  <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <PrimaryBtn onClick={onOpenPortal}>Open Portal →</PrimaryBtn>
                    <GhostBtn onClick={onGoRTI}>RTI Assistant →</GhostBtn>
                    <GhostBtn onClick={onGoEnforcement}>Enforcement →</GhostBtn>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submission guide */}
          <GuideChecklist guide={dept.guide} deptName={dept.dept} />

          {/* Copy fields */}
          {complaint && (
            <div className="rounded-xl animate-fade-in" style={{ border: `1px solid ${T.bord}`, background: T.surf, overflow: 'hidden' }}>
              <div style={{ padding: '14px 24px', borderBottom: `1px solid ${T.bordLight}`, background: T.bg }}>
                <SectionLabel>Complaint Fields — Copy Individually</SectionLabel>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <p style={{ margin: '0 0 16px', fontSize: 12, color: T.muted }}>Copy each field and paste into the corresponding input on the portal.</p>
                <CopyField label="Subject Line" value={complaint.split('\n')[0].replace(/^Subject:\s*/i, '')} />
                <CopyField label="Department" value={dept.dept} />
                <CopyField label="Category" value={dept.category} />
                <CopyField label="Location" value={analysis.location} />
                <CopyField label="Duration" value={analysis.duration} />
                <CopyField label="Severity" value={analysis.severity.toUpperCase()} />
                <CopyField label="Ward" value={analysis.ward ?? '—'} />
                <CopyField label="Full Description" value={complaint} />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR — renders below on mobile */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl" style={{ border: `1px solid ${T.bord}`, background: T.surf, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.bordLight}`, background: T.bg }}>
              <SectionLabel>Portal Intelligence</SectionLabel>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <p style={{ margin: '0 0 4px', fontSize: 11, color: T.muted }}>Avg Response Time</p>
              <p style={{ margin: '0 0 18px', fontSize: 22, fontWeight: 700, color: T.teal }}>{dept.intelligence.avgResponse}</p>
              <p style={{ margin: '0 0 10px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.muted }}>Common Rejection Reasons</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dept.intelligence.rejectionReasons.map((r, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: T.txtMid }}>
                    <span style={{ color: T.red, fontWeight: 700, flexShrink: 0 }}>✕</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl" style={{ border: `1px solid ${T.bord}`, background: T.surf, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.bordLight}`, background: T.bg }}>
              <SectionLabel>Required Docs</SectionLabel>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dept.intelligence.requiredDocs.map((d, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: T.txtMid }}>
                    <span style={{ color: T.teal, fontWeight: 700, flexShrink: 0 }}>✓</span>{d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
