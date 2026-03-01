// src/components/ui/CopyField.tsx
import { useState } from 'react';
import { T } from '@/lib/theme';
import { GhostBtn } from './Button';

interface CopyFieldProps {
  label: string;
  value?: string;
}

export function CopyField({ label, value }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-2.5">
      <div className="text-xs uppercase tracking-widest mb-1.5" style={{ color: T.muted }}>
        {label}
      </div>
      <div className="flex gap-2">
        <div
          className="flex-1 px-3 py-2 rounded-md text-xs font-mono leading-relaxed select-all min-h-8"
          style={{ border: `1px solid ${T.bord}`, background: T.bg, color: T.txtMid }}
        >
          {value || <span style={{ color: T.dim }}>—</span>}
        </div>
        <button
          onClick={copy}
          className="px-3.5 rounded-md text-xs font-semibold flex-shrink-0 min-w-16 transition-all"
          style={{
            border: `1px solid ${T.bord}`,
            background: copied ? T.grnLight : T.surf,
            color: copied ? T.grn : T.muted,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {copied ? '✓ Done' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

// ── CopyableText (large textarea with copy + download) ────────────────────────
interface CopyableTextProps {
  text: string;
  label?: string;
}

export function CopyableText({ text, label }: CopyableTextProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${label ?? 'document'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2.5">
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: T.teal }}>
          {label ?? 'Generated Document'}
        </div>
        <div className="flex gap-2">
          <GhostBtn onClick={copy} style={{ fontSize: 12, padding: '6px 12px' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </GhostBtn>
          <GhostBtn onClick={download} style={{ fontSize: 12, padding: '6px 12px' }}>
            Download
          </GhostBtn>
        </div>
      </div>
      <textarea
        value={text}
        readOnly
        className="w-full min-h-60 rounded-lg text-xs font-mono leading-7 p-3.5 resize-y outline-none"
        style={{ background: T.bg, border: `1px solid ${T.bord}`, color: T.txt }}
      />
    </div>
  );
}
