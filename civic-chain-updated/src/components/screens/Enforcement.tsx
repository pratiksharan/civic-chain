// src/components/screens/Enforcement.tsx
import { useState } from 'react';
import { T } from '@/lib/theme';
import { ESC_CHAIN } from '@/lib/constants';
import { generateReopenDraft, generateFirstAppeal, generateSocialDraft, generateLokayuktaDraft } from '@/lib/api';
import { Card, SL, StatusBadge } from '@/components/ui';
import { PrimaryBtn, DangerBtn } from '@/components/ui/Button';
import { CopyableText } from '@/components/ui/CopyField';
import type { IssueAnalysis, DeptInfo, ComplaintStatus, LoadingState } from '@/types';

interface EnforcementProps {
  analysis: IssueAnalysis;
  dept: DeptInfo;
}

function genDummyRef() {
  return `BBMP-2026-${String(Math.floor(10000 + Math.random() * 90000))}`;
}

export function Enforcement({ analysis, dept }: EnforcementProps) {
  const [refNo, setRefNo] = useState('');
  const [refSaved, setRefSaved] = useState(false);
  const [status, setStatus] = useState<ComplaintStatus>('Acknowledged');
  const [daysElapsed, setDaysElapsed] = useState(0);
  const [escalLevel, setEscalLevel] = useState(1);
  const [reopenCount, setReopenCount] = useState(0);
  const [showReopen, setShowReopen] = useState(false);

  const [reopenDraft, setReopenDraft] = useState('');
  const [appealDraft, setAppealDraft] = useState('');
  const [socialDraft, setSocialDraft] = useState('');
  const [lokaDraft, setLokaDraft] = useState('');
  const [loading, setLoadingState] = useState<LoadingState>({});
  const setLoad = (k: keyof LoadingState, v: boolean) => setLoadingState(p => ({ ...p, [k]: v }));

  const [dummyRef] = useState(genDummyRef);
  const [dummyCopied, setDummyCopied] = useState(false);

  const slaDays = dept.sla / 24;
  const isOverdue = daysElapsed > slaDays;
  const daysOverdue = Math.max(0, daysElapsed - slaDays);
  const currentOfficer = ESC_CHAIN[Math.min(escalLevel - 1, ESC_CHAIN.length - 1)];
  const isSocialTrigger = isOverdue && daysOverdue >= 7;
  const isLegalMode = reopenCount >= 3;

  const handleClaimReopen = async () => {
    setShowReopen(false);
    setReopenCount(p => p + 1);
    setStatus('Reopened');
    setEscalLevel(p => Math.min(p + 1, 5));
    setLoad('reopen', true);
    try { setReopenDraft(await generateReopenDraft(analysis, dept, refNo, escalLevel, ESC_CHAIN)); } catch (e) { console.error(e); }
    setLoad('reopen', false);
  };

  const handleFirstAppeal = async () => {
    setLoad('appeal', true);
    try { setAppealDraft(await generateFirstAppeal(analysis, dept, refNo, daysElapsed)); } catch (e) { console.error(e); }
    setLoad('appeal', false);
  };

  const handleSocialDraft = async () => {
    setLoad('social', true);
    try { setSocialDraft(await generateSocialDraft(analysis, dept, refNo, daysOverdue)); } catch (e) { console.error(e); }
    setLoad('social', false);
  };

  const handleLokaDraft = async () => {
    setLoad('loka', true);
    try { setLokaDraft(await generateLokayuktaDraft(analysis, dept, refNo, `${reopenCount} prior reopens, ${daysOverdue} days overdue`)); } catch (e) { console.error(e); }
    setLoad('loka', false);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.txt }}>Enforcement</h1>
      <p className="text-sm mb-6" style={{ color: T.muted }}>SLA monitoring · Escalation workflow · Legal tools</p>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 280px' }}>
        <div>
          {/* Case Status Overview */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <SL style={{ marginBottom: 0 }}>Case Status Overview</SL>
              {refSaved && <StatusBadge status={status} />}
            </div>

            {!refSaved ? (
              <div>
                <div className="text-sm mb-2" style={{ color: T.muted }}>Enter your complaint reference number to activate tracking:</div>
                <div className="flex items-center gap-2.5 mb-4 px-3.5 py-2.5 rounded-lg" style={{ background: T.blueLight, border: '1px solid #c0d4e8' }}>
                  <span className="text-xs flex-shrink-0" style={{ color: T.muted }}>Dummy reference —</span>
                  <span className="font-mono text-sm font-semibold flex-1" style={{ color: T.blue }}>{dummyRef}</span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(dummyRef); setDummyCopied(true); setTimeout(() => setDummyCopied(false), 2000); }}
                    className="text-xs px-3 py-1 rounded-md font-semibold transition-all flex-shrink-0"
                    style={{ background: dummyCopied ? T.grnLight : '#fff', border: '1px solid #c0d4e8', color: dummyCopied ? T.grn : T.blue, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {dummyCopied ? '✓' : 'Copy'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    value={refNo}
                    onChange={e => setRefNo(e.target.value)}
                    placeholder="e.g. BBMP-2026-00345"
                    className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ border: `1px solid ${T.bord}`, background: T.bg, color: T.txt, fontFamily: 'inherit' }}
                  />
                  <PrimaryBtn onClick={() => { if (refNo.trim()) { setRefSaved(true); setDaysElapsed(0); } }} disabled={!refNo.trim()}>
                    Activate
                  </PrimaryBtn>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Current Officer', value: currentOfficer.title },
                    { label: 'Severity', value: analysis.severity.toUpperCase() },
                    { label: 'Days Elapsed', value: `${daysElapsed} days`, alert: isOverdue },
                    { label: 'SLA Deadline', value: `${slaDays} days`, alert: isOverdue },
                    { label: 'Escalation Level', value: `Level ${escalLevel} of 5` },
                  ].map(item => (
                    <div key={item.label} className="px-3.5 py-2.5 rounded-lg" style={{ background: item.alert ? T.redLight : T.bg, border: `1px solid ${item.alert ? '#f0b0a8' : T.bordLight}` }}>
                      <div className="text-xs uppercase tracking-wider mb-1" style={{ color: T.muted }}>{item.label}</div>
                      <div className="text-sm font-bold" style={{ color: item.alert ? T.red : T.txt }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* SLA bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: T.muted }}>
                    <span>SLA Progress</span>
                    <span className="font-semibold" style={{ color: isOverdue ? T.red : T.teal }}>
                      {isOverdue ? `${daysOverdue} days overdue` : daysElapsed === 0 ? 'Just filed' : `${Math.round(slaDays - daysElapsed)} days remaining`}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: T.bordLight }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (daysElapsed / slaDays) * 100)}%`, background: isOverdue ? T.red : T.teal }} />
                  </div>
                </div>

                {/* Days slider */}
                <div>
                  <div className="text-xs mb-1" style={{ color: T.muted }}>Simulate days elapsed: {daysElapsed}</div>
                  <input type="range" min={0} max={30} value={daysElapsed} onChange={e => setDaysElapsed(Number(e.target.value))} className="w-full" />
                </div>
              </div>
            )}
          </Card>

          {/* False resolution prompt */}
          {showReopen && (
            <Card style={{ background: T.ambLight, border: `1px solid #e8d080` }} className="animate-fade-in">
              <div className="text-sm font-bold mb-1" style={{ color: T.amb }}>Department claims the issue is resolved.</div>
              <div className="text-xs leading-relaxed mb-4" style={{ color: T.muted }}>If the issue persists, you can reopen and escalate to the next authority.</div>
              <div className="flex gap-2">
                <PrimaryBtn onClick={() => { setStatus('Resolved'); setShowReopen(false); }} style={{ background: T.grn, fontSize: 12 }}>✓ Confirm Resolution</PrimaryBtn>
                <DangerBtn onClick={handleClaimReopen} style={{ fontSize: 12 }}>✗ Reopen Ticket</DangerBtn>
              </div>
            </Card>
          )}

          {/* Reopen draft */}
          {reopenDraft && (
            <Card className="animate-fade-in">
              <CopyableText text={reopenDraft} label="Reopen / Escalation Letter" />
            </Card>
          )}

          {/* First appeal */}
          {refSaved && isOverdue && (
            <Card style={{ border: `1px solid #f0b0a8` }} className="animate-fade-in">
              <SL>File First Appeal — Sakala Act</SL>
              <div className="text-xs leading-relaxed mb-4" style={{ color: T.muted }}>
                SLA has been breached. File a First Appeal via the Sakala portal.
              </div>
              {!appealDraft ? (
                <DangerBtn onClick={handleFirstAppeal} loading={loading.appeal}>File First Appeal</DangerBtn>
              ) : (
                <div className="animate-fade-in">
                  <CopyableText text={appealDraft} label="First Appeal Draft" />
                  <div className="mt-3 flex gap-2">
                    <PrimaryBtn onClick={() => window.open('https://sakala.kar.nic.in', '_blank')} style={{ fontSize: 12 }}>Open Sakala Portal →</PrimaryBtn>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Social pressure */}
          {refSaved && isSocialTrigger && (
            <Card style={{ border: '1px solid #c0d4e8' }} className="animate-fade-in">
              <SL>Escalation via Public Accountability</SL>
              <div className="text-xs leading-relaxed mb-4" style={{ color: T.muted }}>
                SLA breached by {daysOverdue} days. Social media posts can amplify accountability.
              </div>
              {!socialDraft ? (
                <PrimaryBtn onClick={handleSocialDraft} loading={loading.social} style={{ background: T.blue }}>Generate Social Media Drafts</PrimaryBtn>
              ) : (
                <div className="animate-fade-in"><CopyableText text={socialDraft} label="Social Media Drafts" /></div>
              )}
            </Card>
          )}

          {/* Lokayukta */}
          {refSaved && isLegalMode && (
            <Card style={{ border: '1px solid #c0c8d0' }} className="animate-fade-in">
              <div className="text-sm font-bold mb-2" style={{ color: T.blue }}>Lokayukta Complaint — Form I</div>
              <div className="text-xs leading-relaxed mb-3" style={{ color: T.muted }}>Three failed resolution cycles constitutes maladministration under the Karnataka Lokayukta Act 1984.</div>
              <div className="px-3.5 py-3 rounded-lg mb-4" style={{ background: T.blueLight, border: '1px solid #c0d4e8' }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: T.blue }}>Where to file — Karnataka Lokayukta</div>
                <div className="flex gap-2 flex-wrap">
                  <a href="https://lokayukta.karnataka.gov.in" target="_blank" rel="noreferrer" className="text-xs font-semibold no-underline px-2 py-1 rounded" style={{ color: T.blue, background: '#fff', border: '1px solid #c0d4e8' }}>↗ lokayukta.karnataka.gov.in</a>
                  <a href="tel:080-22100060" className="text-xs font-semibold no-underline px-2 py-1 rounded" style={{ color: T.blue, background: '#fff', border: '1px solid #c0d4e8' }}>☎ 080-22100060</a>
                </div>
              </div>
              {!lokaDraft ? (
                <PrimaryBtn onClick={handleLokaDraft} loading={loading.loka}>Generate Lokayukta Draft</PrimaryBtn>
              ) : (
                <div className="animate-fade-in"><CopyableText text={lokaDraft} label="Lokayukta Form I Complaint" /></div>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Escalation chain */}
          <Card>
            <SL>Escalation Chain</SL>
            {ESC_CHAIN.map((e, i) => (
              <div key={e.level} className="py-2.5" style={{ borderBottom: i < ESC_CHAIN.length - 1 ? `1px solid ${T.bordLight}` : 'none' }}>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: escalLevel >= e.level ? T.teal : T.surfAlt, color: escalLevel >= e.level ? '#fff' : T.muted }}>
                    {e.level}
                  </div>
                  <div className="text-xs font-semibold" style={{ color: escalLevel === e.level ? T.teal : T.txt }}>{e.title}</div>
                </div>
                <div className="text-xs ml-7" style={{ color: T.muted }}>{e.timeframe}</div>
              </div>
            ))}
          </Card>

          {/* Legal channels */}
          <Card style={{ background: T.blueLight, border: '1px solid #c0d4e8' }}>
            <SL style={{ color: T.blue }}>Legal Escalation Channels</SL>
            {[
              { act: 'Sakala Act', desc: 'Mandated service delivery within SLA', portal: 'https://sakala.kar.nic.in', phone: '1800-425-0101', hint: 'File a complaint at the Sakala portal if your service was not delivered within the mandated timeframe.' },
              { act: 'RTI Act 2005', desc: 'Right to seek information from public authority', portal: 'https://rtionline.gov.in', phone: '011-23388320', hint: 'File online at rtionline.gov.in. Fee: ₹10 (Central). Response mandatory within 30 days.' },
              { act: 'Lokayukta Act', desc: 'Maladministration & dereliction of duty', portal: 'https://lokayukta.karnataka.gov.in', phone: '080-22100060', hint: 'Visit M.S. Building, Dr. Ambedkar Veedhi, Bengaluru or submit by post.' },
            ].map((item, i, arr) => (
              <div key={item.act} className="py-3" style={{ borderBottom: i < arr.length - 1 ? '1px solid #d0e0f0' : 'none' }}>
                <div className="text-xs font-bold mb-0.5" style={{ color: T.blue }}>{item.act}</div>
                <div className="text-xs mb-2" style={{ color: T.muted }}>{item.desc}</div>
                <div className="text-xs mb-2" style={{ color: T.txtMid }}>→ {item.act === 'Sakala Act' ? 'Karnataka Sakala Services Commission' : item.act === 'RTI Act 2005' ? 'Central / State Information Commission' : 'Karnataka Lokayukta, Bengaluru'}</div>
                <div className="flex gap-2 flex-wrap mb-2">
                  <a href={item.portal} target="_blank" rel="noreferrer" className="text-xs font-semibold no-underline px-2 py-0.5 rounded" style={{ color: T.blue, background: '#fff', border: '1px solid #c0d4e8' }}>{item.portal.replace('https://', '')} ↗</a>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#fff', border: '1px solid #d0e0f0', color: T.muted }}>{item.phone}</span>
                </div>
                <div className="text-xs italic" style={{ color: T.muted }}>{item.hint}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
