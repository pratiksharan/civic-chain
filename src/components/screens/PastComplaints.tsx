// src/components/screens/PastComplaints.tsx
import { useState } from 'react';
import { T } from '@/lib/theme';
import { StatusBadge } from '@/components/ui';
import type { PastComplaint, ComplaintStatus } from '@/types';

const STATUS_MSG: Record<ComplaintStatus, string> = {
  'Acknowledged':  'Your complaint has been received and acknowledged by the department.',
  'In Progress':   'This complaint is currently being processed by the relevant department.',
  'Resolved':      'This complaint has been marked as resolved by the department.',
  'Overdue':       'This complaint has exceeded its SLA deadline without resolution.',
  'Reopened':      'This complaint was reopened after the initial resolution was disputed.',
  'Escalated':     'This complaint has been escalated to a higher authority.',
};

const STATUS_ICON: Record<ComplaintStatus, string> = {
  'Acknowledged': '📋', 'In Progress': '⏳', 'Resolved': '✅',
  'Overdue': '🚨', 'Reopened': '🔄', 'Escalated': '⚠️',
};

const STATUS_BG: Record<ComplaintStatus, string> = {
  'Acknowledged': '#eaf1f8', 'In Progress': '#fef9ee', 'Resolved': '#eefaf2',
  'Overdue': '#fdf1f0', 'Reopened': '#fff8f0', 'Escalated': '#eaf1f8',
};
const STATUS_BORD: Record<ComplaintStatus, string> = {
  'Acknowledged': '#c0d4e8', 'In Progress': '#e8d080', 'Resolved': '#b0d9c0',
  'Overdue': '#f0b0a8', 'Reopened': '#e8b070', 'Escalated': '#b0b8f0',
};

function ComplaintModal({ c, onClose, isMobile }: { c: PastComplaint; onClose: () => void; isMobile: boolean }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(15,25,35,0.4)', backdropFilter: 'blur(2px)' }} />
      <div
        className="animate-fade-in"
        style={{
          position: 'fixed', zIndex: 70,
          // Full-screen bottom sheet on mobile, centered modal on desktop
          ...(isMobile
            ? { bottom: 0, left: 0, right: 0, top: 'auto', borderRadius: '14px 14px 0 0', maxHeight: '88vh', overflowY: 'auto' }
            : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 480, maxWidth: 'calc(100vw - 48px)', borderRadius: 14 }),
          background: T.surf,
          border: `1px solid ${T.bord}`,
          boxShadow: '0 8px 40px rgba(0,0,0,0.16)',
          overflow: isMobile ? 'auto' : 'hidden',
        }}
      >
        {/* Drag handle on mobile */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: T.bord }} />
          </div>
        )}

        {/* Header */}
        <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${T.bordLight}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.txt, lineHeight: 1.3 }}>{c.title}</h2>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: T.muted, fontFamily: 'monospace' }}>{c.id}</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.dim, fontSize: 22, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 22px 24px' }}>
          <p style={{ margin: '0 0 18px', fontSize: 13, color: T.txtMid, lineHeight: 1.6 }}>{c.desc}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
            {[
              { label: 'Filed On', value: c.date },
              { label: 'Days Elapsed', value: `${c.daysElapsed} day${c.daysElapsed !== 1 ? 's' : ''}` },
              { label: 'SLA', value: `${c.sla / 24} day${c.sla / 24 !== 1 ? 's' : ''}` },
              { label: 'Status', value: c.status },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: T.bg, border: `1px solid ${T.bordLight}`, borderRadius: 8, padding: '10px 14px' }}>
                <p style={{ margin: '0 0 4px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.muted, fontWeight: 600 }}>{label}</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.txt }}>{value}</p>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 14 }}>
            <StatusBadge status={c.status} />
          </div>
          <div style={{ background: STATUS_BG[c.status], border: `1px solid ${STATUS_BORD[c.status]}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: T.txtMid, lineHeight: 1.6 }}>
            {STATUS_ICON[c.status]} {STATUS_MSG[c.status]}
          </div>
        </div>
      </div>
    </>
  );
}

interface PastComplaintsProps {
  complaints: PastComplaint[];
  isMobile: boolean;
}

export function PastComplaints({ complaints, isMobile }: PastComplaintsProps) {
  const [selected, setSelected] = useState<PastComplaint | null>(null);
  if (complaints.length === 0) return null;

  return (
    <>
      <div style={{ marginTop: 28 }}>
        <div style={{ marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.teal }}>
            Past & Active Complaints
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: T.muted }}>
            Click a complaint to view its details and current status.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {complaints.map(c => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              style={{ background: T.surf, border: `1px solid ${T.bord}`, borderRadius: 10, padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, transition: 'border-color 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = T.tealBord; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(46,125,98,0.07)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = T.bord; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: T.txt, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</p>
                <p style={{ margin: 0, fontSize: 11, color: T.muted, fontFamily: 'monospace' }}>{c.id}</p>
                <p style={{ margin: '3px 0 0', fontSize: 11, color: T.dim }}>{c.date} · {c.daysElapsed} day{c.daysElapsed !== 1 ? 's' : ''} elapsed</p>
              </div>
              <div style={{ flexShrink: 0 }}>
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {selected && <ComplaintModal c={selected} onClose={() => setSelected(null)} isMobile={isMobile} />}
    </>
  );
}
