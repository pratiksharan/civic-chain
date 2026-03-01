// src/types/index.ts

export type IssueType =
  | 'garbage' | 'pothole' | 'water' | 'electricity'
  | 'streetlight' | 'sewage' | 'noise' | 'encroachment'
  | 'health' | 'general';

export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type GovLevel = 'Local' | 'State' | 'Central';
export type DifficultyLabel = 'Easy' | 'Medium' | 'Hard';
export type ComplaintStatus = 'Acknowledged' | 'In Progress' | 'Resolved' | 'Overdue' | 'Reopened' | 'Escalated';
export type Screen = 'dashboard' | 'submit' | 'routing' | 'escalation' | 'rti' | 'settings';
export type AuthScreen = 'login' | 'register' | 'app';

export interface IssueAnalysis {
  issueType: IssueType;
  issueSummary: string;
  location: string;
  ward: string | null;
  duration: string;
  durationHours: number;
  severity: Severity;
  governmentLevel: GovLevel;
  keyFacts: string[];
  urgencyReason: string;
  confidenceScore: number;
}

export interface GuideStep {
  step: string;
  tip: string;
  link?: string;
}

export interface DeptIntelligence {
  avgResponse: string;
  rtiAvgResponse: string;
  rtiFee: string;
  appealDeadline: string;
  rejectionReasons: string[];
  rtiRejectionReasons: string[];
  requiredDocs: string[];
}

export interface DeptDifficulty {
  label: DifficultyLabel;
  steps: number;
  mins: string;
}

export interface DeptInfo {
  dept: string;
  sla: number;
  level: GovLevel;
  icon: string;
  portal: string;
  deepLink: string;
  hasDeepLink: boolean;
  email: string;
  phone: string;
  category: string;
  difficulty: DeptDifficulty;
  intelligence: DeptIntelligence;
  guide: GuideStep[];
}

export interface EscalationLevel {
  level: number;
  title: string;
  timeframe: string;
  trigger: string;
  note: string;
  contact: {
    phone: string;
    email: string;
    portal: string;
    address: string;
    howTo: string;
  };
}

export interface PastComplaint {
  id: string;
  title: string;
  desc: string;
  type: IssueType;
  date: string;
  status: ComplaintStatus;
  daysElapsed: number;
  sla: number;
}

export interface AppState {
  screen: Screen;
  issueText: string;
  analysis: IssueAnalysis | null;
  complaint: string;
  rtiDraft: string;
  unlocked: boolean;
  companionMode: boolean;
  city: string;
}

export interface LoadingState {
  analyze?: boolean;
  complaint?: boolean;
  rti?: boolean;
  appeal?: boolean;
  social?: boolean;
  loka?: boolean;
  reopen?: boolean;
}

export interface SettingsValues {
  city: string;
  ward: string;
}
