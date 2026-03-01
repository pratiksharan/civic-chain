// src/components/screens/SubmitIssue.tsx
// Matches CivicChain_v5: 2-column layout with a "How it works" step sidebar,
// full-width Analyse Issue button, and Spinner displayed below the button.
import { T } from '@/lib/theme';
import { PrimaryBtn } from '@/components/ui/Button';
import { Card, SL, Spinner } from '@/components/ui';

interface SubmitIssueProps {
  issueText: string;
  onIssueChange: (v: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  city: string;
}

const HOW_IT_WORKS = [
  ['01', 'Describe',  'Plain language issue description'],
  ['02', 'Analysis',  'Extracts dept, severity, location'],
  ['03', 'Routing',   'Correct portal and contact shown'],
  ['04', 'Draft',     'Formal complaint letter generated'],
  ['05', 'Guide',     'Step-by-step submission checklist'],
  ['06', 'Enforce',   'Escalation and legal tools'],
] as const;

export function SubmitIssue({ issueText, onIssueChange, onAnalyze, loading, city }: SubmitIssueProps) {
  return (
    <div style={{ maxWidth: 820 }} className="animate-fade-in">
      <h1 style={{ fontSize: 24, fontWeight: 700, color: T.txt, margin: 0, marginBottom: 5, letterSpacing: '-0.02em' }}>
        Submit Issue
      </h1>
      <p style={{ fontSize: 13, color: T.muted, margin: 0, marginBottom: 28 }}>
        Describe your civic issue in plain language. The system will identify the department and draft a formal complaint.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Left: textarea */}
        <div>
          <Card>
            <SL>Issue Description</SL>
            <textarea
              value={issueText}
              onChange={e => onIssueChange(e.target.value)}
              placeholder={`Describe your issue in detail...\n\nInclude:\n• Location and ward number\n• How long the issue has persisted\n• Impact on residents\n• Any prior complaints filed\n\ne.g. Garbage not collected for 5 days in Ward 12, ${city}. Large pile near school gate is creating hygiene risks.`}
              style={{
                width: '100%',
                minHeight: 220,
                background: T.bg,
                border: `1px solid ${T.bord}`,
                borderRadius: 7,
                color: T.txt,
                fontFamily: 'inherit',
                fontSize: 14,
                padding: 14,
                resize: 'vertical',
                outline: 'none',
                lineHeight: 1.65,
                boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: 11, color: T.dim, marginTop: 6 }}>
              {issueText.length} chars · Include location, ward, and duration for best results.
            </div>
            <div style={{ marginTop: 16 }}>
              <PrimaryBtn
                onClick={onAnalyze}
                loading={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 14 }}
              >
                Analyse Issue
              </PrimaryBtn>
            </div>
            {loading && (
              <div style={{ marginTop: 14 }}>
                <Spinner />
              </div>
            )}
          </Card>
        </div>

        {/* Right: How it works */}
        <div>
          <Card>
            <SL>How it works</SL>
            {HOW_IT_WORKS.map(([n, t, d]) => (
              <div key={n} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 5,
                  background: T.tealLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: T.teal, fontWeight: 700, flexShrink: 0,
                }}>
                  {n}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: T.txt, fontWeight: 600, marginBottom: 2 }}>{t}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{d}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
