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
  onGenerateComplaint: () => void;
  onOpenPortal: () => void;
  onGoRTI: () => void;
  onGoEnforcement: () => void;
}

function StatPill({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: T.muted, fontSize: '0.65rem' }}>{label}</span>
      <span className="text-sm font-bold" style={{ color: accent ?? T.txt }}>{value}</span>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg px-4 py-3" style={{ background: T.bg, border: `1px solid ${T.bordLight}` }}>
      <div className="text-xs uppercase tracking-widest mb-1 font-medium" style={{ color: T.dim, fontSize: '0.6rem', letterSpacing: '0.12em' }}>{label}</div>
      <div className="text-sm font-semibold leading-tight" style={{ color: T.txt }}>{value}</div>
    </div>
  );
}

function GuideChecklist({ guide, deptName }: { guide: DeptInfo['guide']; deptName: string }) {
  const [checked, setChecked] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const toggle = (i: number) => setChecked(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const pct = Math.round((checked.length / guide.length) * 100);
  const allDone = checked.length === guide.length;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.bord}`, background: T.surf }}>
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.bordLight}`, background: allDone ? '#f3fbf7' : T.bg }}>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: T.teal, fontSize: '0.65rem', letterSpacing: '0.14em' }}>Official Submission Guide</div>
            <div className="text-sm font-semibold mt-0.5" style={{ color: T.txt }}>{deptName} — step-by-step</div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-xs font-bold" style={{ color: allDone ? T.grn : T.muted }}>
              {checked.length}/{guide.length} complete
            </span>
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: T.bordLight }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: allDone ? T.grn : T.teal }} />
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y" style={{ borderColor: T.bordLight }}>
        {guide.map((g, i) => {
          const done = checked.includes(i);
          const open = expanded === i;
          return (
            <div key={i} style={{ background: done ? '#fafdf9' : T.surf }}>
              <div className="flex items-center gap-3.5 px-6 py-3.5 cursor-pointer" onClick={() => toggle(i)}>
                <div className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200"
                  style={{ border: `2px solid ${done ? T.teal : T.bord}`, background: done ? T.teal : 'transparent' }}>
                  {done && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: done ? T.tealLight : T.bg, color: done ? T.teal : T.dim, border: `1px solid ${done ? T.tealBord : T.bordLight}` }}>
                  {i + 1}
                </div>
                <span className="flex-1 text-sm leading-snug"
                  style={{ color: done ? T.muted : T.txtMid, textDecoration: done ? 'line-through' : 'none', fontWeight: done ? 400 : 500 }}>
                  {g.step}
                </span>
                {g.tip && (
                  <button
                    onClick={e => { e.stopPropagation(); setExpanded(open ? null : i); }}
                    className="text-xs px-2 py-0.5 rounded-md transition-colors flex-shrink-0"
                    style={{ color: open ? T.teal : T.dim, background: open ? T.tealLight : T.bg, border: `1px solid ${open ? T.tealBord : T.bordLight}`, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                    {open ? '▲ Hide' : '▼ Tip'}
                  </button>
                )}
              </div>
              {open && g.tip && (
                <div className="px-6 pb-3.5 pt-0">
                  <div className="rounded-lg px-3.5 py-2.5 text-xs leading-relaxed" style={{ background: T.tealLight, color: T.teal, border: `1px solid ${T.tealBord}` }}>
                    💡 {g.tip}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RoutingResult({ analysis, dept, complaint, loading, onGenerateComplaint, onOpenPortal, onGoRTI, onGoEnforcement }: RoutingResultProps) {
  const [diffColor, diffBg, diffBord] = DIFF_COLOR[dept.difficulty.label];

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900 }}>

      {/* Page header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-1.5 h-5 rounded-full" style={{ background: T.teal }} />
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: T.txt }}>Routing Result</h1>
        </div>
        <p className="text-sm ml-3.5" style={{ color: T.muted }}>AI has analysed your issue and routed it to the correct authority.</p>
      </div>

      {/* Hero routing banner */}
      <div className="rounded-2xl mb-5 overflow-hidden" style={{ border: `1px solid ${T.tealBord}`, background: 'linear-gradient(135deg, #ebf5f0 0%, #f6f9f7 60%, #ffffff 100%)' }}>
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: T.teal, letterSpacing: '0.14em' }}>Routed to</div>
                <SeverityBadge s={analysis.severity} />
              </div>
              <div className="text-xl font-bold mb-1" style={{ color: T.txt }}>{dept.dept}</div>
              <p className="text-sm leading-relaxed" style={{ color: T.txtMid, maxWidth: 480 }}>{analysis.issueSummary}</p>
            </div>
            <div className="flex gap-6 flex-shrink-0 flex-wrap">
              <StatPill label="SLA" value={`${dept.sla}h`} accent={T.teal} />
              <StatPill label="Level" value={dept.level} />
              <StatPill label="Avg Response" value={dept.intelligence.avgResponse} accent={T.blue} />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: T.muted, fontSize: '0.65rem' }}>Difficulty</span>
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded" style={{ color: diffColor, background: diffBg, border: `1px solid ${diffBord}` }}>{dept.difficulty.label}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 flex items-center gap-6 flex-wrap" style={{ borderTop: `1px solid ${T.tealBord}`, background: 'rgba(255,255,255,0.6)' }}>
          <a href={`tel:${dept.phone}`} className="flex items-center gap-1.5 text-sm font-semibold no-underline" style={{ color: T.teal }}>
            <span>📞</span>{dept.phone}
          </a>
          <a href={`mailto:${dept.email}`} className="flex items-center gap-1.5 text-sm font-semibold no-underline" style={{ color: T.blue }}>
            <span>✉</span>{dept.email}
          </a>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 260px' }}>

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-5">

          {/* Issue analysis */}
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.bord}`, background: T.surf }}>
            <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.bordLight}`, background: T.bg }}>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: T.teal, fontSize: '0.65rem', letterSpacing: '0.14em' }}>Issue Analysis</div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                <InfoCell label="Issue Type" value={analysis.issueType} />
                <InfoCell label="Department" value={dept.dept} />
                <InfoCell label="Gov. Level" value={analysis.governmentLevel} />
                <InfoCell label="Location" value={analysis.location} />
                <InfoCell label="Duration" value={analysis.duration} />
                <InfoCell label="Ward" value={analysis.ward ?? '—'} />
              </div>

              {analysis.keyFacts && analysis.keyFacts.length > 0 && (
                <div className="mb-5">
                  <div className="text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: T.dim, fontSize: '0.62rem', letterSpacing: '0.12em' }}>Key Facts</div>
                  <div className="flex flex-col gap-1.5">
                    {analysis.keyFacts.map((f, i) => (
                      <div key={i} className="flex gap-2.5 items-start">
                        <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: T.teal }} />
                        <span className="text-sm leading-snug" style={{ color: T.txtMid }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.confidenceScore !== undefined && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: T.dim, fontSize: '0.62rem', letterSpacing: '0.12em' }}>Classification Confidence</span>
                    <span className="text-sm font-bold" style={{ color: Math.round(analysis.confidenceScore * 100) >= 90 ? T.grn : T.txt }}>
                      {Math.round(analysis.confidenceScore * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: T.bordLight }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.round(analysis.confidenceScore * 100)}%`, background: `linear-gradient(90deg, ${T.teal}, ${T.grn})` }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Portal submission */}
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.bord}`, background: T.surf }}>
            <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.bordLight}`, background: T.bg }}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: T.teal, fontSize: '0.65rem', letterSpacing: '0.14em' }}>Official Submission Channel</div>
                <div className="flex gap-1.5 flex-wrap">
                  <TealChip>EST. STEPS: {dept.difficulty.steps}</TealChip>
                  <BlueChip>TIME: {dept.difficulty.mins}</BlueChip>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-3 rounded-xl p-4" style={{ background: T.bg, border: `1px solid ${T.bordLight}` }}>
                  <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: T.dim, fontSize: '0.62rem', letterSpacing: '0.12em' }}>Direct Complaint Registration</div>
                  <div className="text-xs font-mono mb-3 truncate" style={{ color: T.txtMid }}>{dept.portal.replace('https://', '')}</div>
                  <PrimaryBtn onClick={onOpenPortal} style={{ width: '100%' }}>Open Portal →</PrimaryBtn>
                  {dept.intelligence.requiredDocs.slice(0, 1).map((d, i) => (
                    <div key={i} className="text-xs mt-2.5 flex items-center gap-1.5" style={{ color: T.muted }}>
                      <span style={{ color: T.teal }}>✓</span>{d}
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-4" style={{ background: T.bg, border: `1px solid ${T.bordLight}` }}>
                  <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: T.dim, fontSize: '0.62rem', letterSpacing: '0.12em' }}>Email</div>
                  <a href={`mailto:${dept.email}`} className="text-xs font-semibold no-underline" style={{ color: T.blue }}>{dept.email}</a>
                </div>
                <div className="rounded-xl p-4" style={{ background: T.bg, border: `1px solid ${T.bordLight}` }}>
                  <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: T.dim, fontSize: '0.62rem', letterSpacing: '0.12em' }}>Helpline</div>
                  <a href={`tel:${dept.phone}`} className="text-sm font-bold no-underline flex items-center gap-1" style={{ color: T.teal }}>
                    📞 {dept.phone}
                  </a>
                </div>
                <div className="rounded-xl p-4" style={{ background: T.bg, border: `1px solid ${T.bordLight}` }}>
                  <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: T.dim, fontSize: '0.62rem', letterSpacing: '0.12em' }}>SLA</div>
                  <div className="text-sm font-bold" style={{ color: T.teal }}>{dept.sla} hours</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Complaint Letter */}
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.bord}`, background: T.surf }}>
            <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.bordLight}`, background: T.bg }}>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: T.teal, fontSize: '0.65rem', letterSpacing: '0.14em' }}>AI-Generated Complaint Letter</div>
            </div>
            <div className="p-6">
              {!complaint ? (
                <div className="flex flex-col items-start gap-3">
                  <p className="text-sm" style={{ color: T.muted }}>Generate a professionally worded complaint letter for this issue, ready to submit or email.</p>
                  <PrimaryBtn onClick={onGenerateComplaint} loading={loading.complaint}>
                    Generate Formal Complaint
                  </PrimaryBtn>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <CopyableText text={complaint} label="Formal Complaint Letter" />
                  <div className="mt-4 flex gap-2.5 flex-wrap">
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
            <div className="rounded-2xl overflow-hidden animate-fade-in" style={{ border: `1px solid ${T.bord}`, background: T.surf }}>
              <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.bordLight}`, background: T.bg }}>
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: T.teal, fontSize: '0.65rem', letterSpacing: '0.14em' }}>Complaint Fields — Copy Individually</div>
              </div>
              <div className="p-6">
                <p className="text-xs mb-4 leading-relaxed" style={{ color: T.muted }}>Each field can be copied separately and pasted into the corresponding input on the portal.</p>
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

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-4">

          {/* Portal intelligence */}
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.bord}`, background: T.surf }}>
            <div className="px-5 py-3.5" style={{ borderBottom: `1px solid ${T.bordLight}`, background: T.bg }}>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: T.teal, fontSize: '0.62rem', letterSpacing: '0.14em' }}>Portal Intelligence</div>
            </div>
            <div className="p-5">
              <div className="mb-5">
                <div className="text-xs uppercase tracking-widest mb-1.5 font-semibold" style={{ color: T.muted, fontSize: '0.6rem' }}>Avg Response Time</div>
                <div className="text-2xl font-bold" style={{ color: T.teal }}>{dept.intelligence.avgResponse}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest mb-2.5 font-semibold" style={{ color: T.muted, fontSize: '0.6rem' }}>Common Rejection Reasons</div>
                <div className="flex flex-col gap-2">
                  {dept.intelligence.rejectionReasons.map((r, i) => (
                    <div key={i} className="flex gap-2 items-start text-xs leading-snug" style={{ color: T.txtMid }}>
                      <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                        style={{ background: '#fdf1f0', border: '1px solid #f0b0a8' }}>
                        <span style={{ color: T.red, fontSize: '0.55rem', fontWeight: 700 }}>✕</span>
                      </div>
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Required docs */}
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.bord}`, background: T.surf }}>
            <div className="px-5 py-3.5" style={{ borderBottom: `1px solid ${T.bordLight}`, background: T.bg }}>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: T.teal, fontSize: '0.62rem', letterSpacing: '0.14em' }}>Required Docs</div>
            </div>
            <div className="p-5">
              <div className="flex flex-col gap-2">
                {dept.intelligence.requiredDocs.map((d, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs leading-snug" style={{ color: T.txtMid }}>
                    <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{ background: T.tealLight, border: `1px solid ${T.tealBord}` }}>
                      <span style={{ color: T.teal, fontSize: '0.55rem', fontWeight: 700 }}>✓</span>
                    </div>
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick tip */}
          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #ebf5f0, #f6faf8)', border: `1px solid ${T.tealBord}` }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: T.teal, fontSize: '0.62rem', letterSpacing: '0.14em' }}>💡 Quick Tip</div>
            <p className="text-xs leading-relaxed" style={{ color: T.txtMid }}>
              Include your exact ward and locality when filing to avoid rejection. Add a photo for faster resolution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
