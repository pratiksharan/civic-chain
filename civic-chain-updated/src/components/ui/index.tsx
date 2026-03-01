// src/components/ui/index.tsx
import { T } from '@/lib/theme';
import type { Severity, ComplaintStatus, DifficultyLabel } from '@/types';

// ── Card ────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}
export function Card({ children, style, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-xl p-6 mb-4 ${className}`}
      style={{ background: T.surf, border: `1px solid ${T.bord}`, ...style }}
    >
      {children}
    </div>
  );
}

// ── Section Label ────────────────────────────────────────────────────────────
export function SL({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className="text-xs font-bold uppercase tracking-widest mb-3.5"
      style={{ color: T.teal, letterSpacing: '0.14em', ...style }}
    >
      {children}
    </div>
  );
}

// ── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex items-center gap-2.5 text-sm" style={{ color: T.muted }}>
      <span
        className="inline-block w-4 h-4 rounded-full border-2 animate-spin-fast"
        style={{ borderColor: T.bord, borderTopColor: T.teal }}
      />
      Analysing…
    </div>
  );
}

// ── Severity Badge ────────────────────────────────────────────────────────────
const SEVERITY_MAP: Record<Severity, [string, string, string]> = {
  low:      [T.grn,      T.grnLight,  '#b0d9c0'],
  medium:   [T.amb,      T.ambLight,  '#f0d080'],
  high:     [T.red,      T.redLight,  '#f0b0a8'],
  critical: ['#7b0000',  '#fdf0f0',   '#e88080'],
};
export function SeverityBadge({ s }: { s: Severity }) {
  const [col, bg, bord] = SEVERITY_MAP[s] ?? SEVERITY_MAP.medium;
  return (
    <span
      className="text-xs font-bold uppercase tracking-wider rounded px-2 py-0.5"
      style={{ color: col, background: bg, border: `1px solid ${bord}` }}
    >
      {s}
    </span>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_MAP: Record<ComplaintStatus, [string, string, string]> = {
  'Acknowledged': [T.blue,     T.blueLight,   '#c0d4e8'],
  'In Progress':  [T.amb,      T.ambLight,    '#e8d080'],
  'Resolved':     [T.grn,      T.grnLight,    '#b0d9c0'],
  'Overdue':      [T.red,      T.redLight,    '#f0b0a8'],
  'Reopened':     ['#7b3f00',  '#fff8f0',     '#e8b070'],
  'Escalated':    [T.blue,     '#e8eeff',     '#b0b8f0'],
};
export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const [col, bg, bord] = STATUS_MAP[status] ?? STATUS_MAP['Acknowledged'];
  return (
    <span
      className="text-xs font-bold uppercase tracking-wide rounded-md px-2.5 py-1"
      style={{ color: col, background: bg, border: `1px solid ${bord}` }}
    >
      {status}
    </span>
  );
}

// ── Difficulty Badge ──────────────────────────────────────────────────────────
const DIFF_MAP: Record<DifficultyLabel, [string, string, string]> = {
  Easy:   [T.grn, T.grnLight,  '#b0d9c0'],
  Medium: [T.amb, T.ambLight,  '#e8d080'],
  Hard:   [T.red, T.redLight,  '#f0b0a8'],
};
export function DifficultyBadge({ label }: { label: DifficultyLabel }) {
  const [col, bg, bord] = DIFF_MAP[label];
  return (
    <span className="text-xs font-bold uppercase tracking-wider rounded px-2 py-0.5" style={{ color: col, background: bg, border: `1px solid ${bord}` }}>
      {label}
    </span>
  );
}

// ── Chip variants ─────────────────────────────────────────────────────────────
export function TealChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-bold uppercase tracking-wider rounded px-2 py-0.5"
      style={{ background: T.tealLight, color: T.teal, border: `1px solid ${T.tealBord}` }}>
      {children}
    </span>
  );
}
export function BlueChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-bold uppercase tracking-wider rounded px-2 py-0.5"
      style={{ background: T.blueLight, color: T.blue, border: '1px solid #c0d4e8' }}>
      {children}
    </span>
  );
}
