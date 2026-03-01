// src/components/ui/Button.tsx
import { T } from '@/lib/theme';

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function PrimaryBtn({ children, onClick, loading, disabled, style, className = '' }: BtnProps) {
  return (
    <button
      disabled={loading || disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white tracking-wide transition-all font-sans ${className}`}
      style={{ background: loading || disabled ? T.dim : T.blue, cursor: loading || disabled ? 'not-allowed' : 'pointer', border: 'none', fontFamily: 'inherit', ...style }}
    >
      {loading && (
        <span className="inline-block w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin-fast" />
      )}
      {children}
    </button>
  );
}

export function GhostBtn({ children, onClick, style, className = '' }: BtnProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 font-sans ${className}`}
      style={{ background: T.surf, border: `1px solid ${T.bord}`, color: T.txtMid, cursor: 'pointer', fontFamily: 'inherit', ...style }}
    >
      {children}
    </button>
  );
}

export function DangerBtn({ children, onClick, loading, style, className = '' }: BtnProps) {
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all font-sans ${className}`}
      style={{ background: T.redLight, border: `1px solid ${T.red}`, color: T.red, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', ...style }}
    >
      {loading && (
        <span className="inline-block w-3 h-3 rounded-full border-2 animate-spin-fast" style={{ borderColor: `${T.red}40`, borderTopColor: T.red }} />
      )}
      {children}
    </button>
  );
}
