// src/components/screens/RTIAssistant.tsx
import { useState } from 'react';
import { T } from '@/lib/theme';
import { Card, SL } from '@/components/ui';
import { PrimaryBtn } from '@/components/ui/Button';
import { CopyableText } from '@/components/ui/CopyField';
import type { IssueAnalysis, DeptInfo } from '@/types';

interface RTIAssistantProps {
  analysis: IssueAnalysis;
  dept: DeptInfo;
  rtiDraft: string;
  loading: boolean;
  onGenerateRTI: () => void;
}

const RTI_STEPS = (deptName: string, rtiFee: string) => [
  { step: 'Open RTI Online Portal', tip: 'Visit rtionline.gov.in — the official government RTI filing portal.', link: 'https://rtionline.gov.in' },
  { step: `Select Public Authority: ${deptName}`, tip: 'Under Ministry/Department dropdown. For BBMP: select Karnataka → Urban Local Bodies → BBMP.' },
  { step: 'Enter Subject of RTI Application', tip: 'Copy the subject line from the generated application below.' },
  { step: 'Paste RTI Application Text', tip: 'Copy the complete RTI application text. Do not modify the legal language.' },
  { step: 'Upload ID Proof (if required)', tip: 'Aadhaar card or Voter ID. Keep a scanned copy ready.' },
  { step: `Pay Application Fee`, tip: `Application fee is ${rtiFee}. BPL applicants are exempt.` },
  { step: 'Save Reference Number', tip: 'The portal generates a Registration Number. Save for First Appeal if needed.' },
];

export function RTIAssistant({ analysis, dept, rtiDraft, loading, onGenerateRTI }: RTIAssistantProps) {
  const [checked, setChecked] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const steps = RTI_STEPS(dept.dept, dept.intelligence.rtiFee);
  const toggle = (i: number) => setChecked(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const pct = Math.round((checked.length / steps.length) * 100);

  return (
    <div className="animate-fade-in" style={{ maxWidth: 760 }}>
      <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.txt }}>RTI Assistant</h1>
      <p className="text-sm mb-6" style={{ color: T.muted }}>File a Right to Information application for {dept.dept}.</p>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 260px' }}>
        <div>
          {/* RTI Guide */}
          <div className="rounded-xl p-5 mb-4" style={{ background: '#f8faf8', border: `1px solid ${T.tealBord}` }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: T.teal }}>RTI Submission Guide</div>
                <div className="text-xs mt-0.5" style={{ color: T.muted }}>Step-by-step portal navigation checklist</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold" style={{ color: checked.length === steps.length ? T.grn : T.muted }}>
                  {checked.length}/{steps.length} steps
                </div>
                <div className="w-20 h-1 rounded mt-1" style={{ background: T.bordLight }}>
                  <div className="h-full rounded transition-all" style={{ width: `${pct}%`, background: checked.length === steps.length ? T.grn : T.teal }} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {steps.map((g, i) => {
                const done = checked.includes(i);
                const open = expanded === i;
                return (
                  <div key={i} className="rounded-lg overflow-hidden" style={{ border: `1px solid ${done ? '#b0d9c8' : T.bordLight}`, background: done ? '#f3fbf7' : T.surf }}>
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer" onClick={() => toggle(i)}>
                      <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ border: `2px solid ${done ? T.grn : T.bord}`, background: done ? T.grn : 'transparent', color: done ? '#fff' : T.dim }}>
                        {done ? <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> : i + 1}
                      </div>
                      <div className="flex-1 text-sm" style={{ color: done ? T.muted : T.txt, fontWeight: done ? 400 : 500, textDecoration: done ? 'line-through' : 'none' }}>{g.step}</div>
                      <div className="flex gap-2 items-center">
                        {g.link && (
                          <a href={g.link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                            className="text-xs px-2 py-0.5 rounded no-underline font-semibold" style={{ color: T.blue, background: T.blueLight, border: '1px solid #c0d4e8' }}>
                            Open →
                          </a>
                        )}
                        {g.tip && (
                          <button onClick={e => { e.stopPropagation(); setExpanded(open ? null : i); }}
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{ color: open ? T.teal : T.dim, background: open ? T.tealLight : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                            {open ? '▲ Hide' : '▼ Tip'}
                          </button>
                        )}
                      </div>
                    </div>
                    {open && g.tip && (
                      <div className="px-3.5 pb-2.5 pt-2" style={{ borderTop: `1px solid ${T.bordLight}`, background: '#f0f8f4' }}>
                        <div className="text-xs leading-relaxed" style={{ color: T.teal }}>{g.tip}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generate RTI */}
          <Card>
            <SL>AI-Generated RTI Application</SL>
            {!rtiDraft ? (
              <PrimaryBtn onClick={onGenerateRTI} loading={loading}>Generate RTI Application</PrimaryBtn>
            ) : (
              <div className="animate-fade-in">
                <CopyableText text={rtiDraft} label="RTI Application" />
                <div className="mt-4 px-4 py-3.5 rounded-lg" style={{ background: T.blueLight, border: '1px solid #c0d4e8' }}>
                  <div className="text-sm font-semibold mb-1" style={{ color: T.blue }}>Submit via Official Portal</div>
                  <div className="text-xs mb-3 leading-relaxed" style={{ color: T.muted }}>Submit via rtionline.gov.in or the department portal.</div>
                  <div className="flex gap-2 flex-wrap">
                    <PrimaryBtn onClick={() => window.open('https://rtionline.gov.in', '_blank')} style={{ fontSize: 12 }}>RTI Online Portal →</PrimaryBtn>
                    <button onClick={() => window.open(dept.hasDeepLink && dept.deepLink ? dept.deepLink : dept.portal, '_blank')}
                      className="px-3.5 py-2 rounded-lg text-xs font-medium" style={{ background: T.surf, border: `1px solid ${T.bord}`, color: T.txtMid, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Dept. Portal →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card style={{ background: T.surfAlt }}>
            <SL>RTI Key Facts</SL>
            {[
              ['Response Time', '30 days (mandatory)'],
              ['First Appeal', 'If unsatisfied with response'],
              ['Second Appeal', 'Central/State Info Commission'],
              ['Penalty', '₹250/day if authority delays'],
              ['Fee', `${dept.intelligence.rtiFee} (Central)`],
            ].map(([k, v]) => (
              <div key={k} className="py-2" style={{ borderBottom: `1px solid ${T.bordLight}` }}>
                <div className="text-xs mb-0.5" style={{ color: T.muted }}>{k}</div>
                <div className="text-xs font-semibold" style={{ color: T.txt }}>{v}</div>
              </div>
            ))}
          </Card>

          <Card style={{ background: T.surfAlt }}>
            <SL>RTI Reference</SL>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Avg RTI Response', value: dept.intelligence.rtiAvgResponse },
                { label: 'Appeal Deadline', value: dept.intelligence.appealDeadline },
                { label: 'Application Fee', value: dept.intelligence.rtiFee },
              ].map(item => (
                <div key={item.label} className="px-3 py-2.5 rounded-lg" style={{ background: T.surf, border: `1px solid ${T.bord}` }}>
                  <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: T.muted }}>{item.label}</div>
                  <div className="text-sm font-semibold" style={{ color: T.txt }}>{item.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
