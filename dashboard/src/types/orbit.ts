export type AttentionReason = 'overdue' | 'blocked' | 'forgotten' | 'needs-decision' | 'stale';

export interface OrbitConfig {
  name: string;
  role: string;
  company: string;
  projects: string[];
  language: string;
  brief_style: string;
  created: string;
  last_ingest: string;
}

export interface Note {
  slug: string;
  title: string;
  date: string;
  source: string;
  participants: string[];
  themes: string[];
  decisions: string[];
  questions: string[];
  action_items: NoteActionItem[];
  body?: string;
}

export interface NoteActionItem {
  text: string;
  owner: string;
  due: string;
  status: string;
}

export interface Theme {
  name: string;
  type: 'active' | 'suggested';
  signalCount: number;
  missionCount: number;
  latestSignalDate: string | null;
  snippet: string;
}

export interface ActionItem {
  index: number;
  task: string;
  owner: string;
  due: string;
  theme: string;
  status: string;
  drifting: boolean;
  attention: AttentionReason | null;
  attentionDetail: string;
}

export interface ConstellationInsight {
  type: AttentionReason;
  text: string;
}

export interface ThemeDetail {
  name: string;
  signals: Array<{ slug: string; title: string; date: string }>;
  missions: Array<Record<string, string>>;
  decisions: string[];
  questions: string[];
  narrative: string | null;
  narrativeGeneratedAt: string | null;
  insights: ConstellationInsight[];
}

export interface Decision {
  date: string;
  decision: string;
  source: string;
  theme: string;
  status: string;
}

export interface Brief {
  slug: string;
  filename: string;
  type: 'daily' | 'weekly' | 'prep';
  date: string;
  content?: string;
}

export interface StalledTheme {
  theme: string;
  daysSinceActivity: number;
  openItems: number;
}

export interface OpenQuestion {
  question: string;
  theme: string;
  source: string;
  daysPending: number;
}

export interface CopilotData {
  config: OrbitConfig | null;
  initialized: boolean;
  focus: { theme: string; reason: string; score: number } | null;
  needsImport: boolean;
  daysSinceLastIngest: number;
  temporal: {
    today: ActionItem[];
    thisWeek: ActionItem[];
    nextWeek: ActionItem[];
  };
  attentionItems: ActionItem[];
  stalledThemes: StalledTheme[];
  openQuestions: OpenQuestion[];
  recentBriefSlug: string | null;
}

export interface WorkspaceStats {
  config: OrbitConfig | null;
  signals: { total: number; thisWeek: number };
  constellations: { active: number; suggested: number };
  missions: { active: number; drifting: number; done: number; needsAttention: number };
  coordinates: { confirmed: number; conflicting: number; stalled: number };
  briefs: number;
  artifacts: number;
  initialized: boolean;
}

export interface EnginAskState {
  loading: boolean;
  response: string | null;
  error: string | null;
}

export interface ClaudeAction {
  action: string;
  args?: string;
  prompt?: string;
}

export interface ClaudeMessage {
  type: 'output' | 'status' | 'error' | 'done';
  content: string;
}
