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
}

export interface ActionItem {
  index: number;
  task: string;
  owner: string;
  due: string;
  theme: string;
  status: string;
  drifting: boolean;
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

export interface WorkspaceStats {
  config: OrbitConfig | null;
  signals: { total: number; thisWeek: number };
  constellations: { active: number; suggested: number };
  missions: { active: number; drifting: number; done: number };
  coordinates: { confirmed: number; conflicting: number; stalled: number };
  briefs: number;
  artifacts: number;
  initialized: boolean;
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
