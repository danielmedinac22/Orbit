import fs from 'fs';
import path from 'path';
import { parseAllInDir } from '../parsers/frontmatter.js';
import { parseMarkdownTable } from '../parsers/table.js';

export type AttentionReason = 'overdue' | 'blocked' | 'forgotten' | 'needs-decision' | 'stale';

export interface AttentionItem {
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

const BLOCKED_KEYWORDS = [
  'espera', 'esperando', 'waiting', 'pendiente de', 'blocked',
  'requiere', 'confirma', 'confirmar', 'depende', 'depends',
];

interface ThemeActivity {
  latestNoteDate: string | null;
  daysSinceLastNote: number;
  openQuestions: string[];
  hasMatchingDecision: (question: string) => boolean;
}

function daysBetween(dateStr: string, today: string): number {
  const d1 = new Date(dateStr);
  const d2 = new Date(today);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

function tokenize(text: string): string[] {
  const STOPWORDS = new Set([
    'de', 'el', 'la', 'los', 'las', 'que', 'en', 'por', 'para', 'con',
    'un', 'una', 'del', 'al', 'es', 'se', 'no', 'si', 'su', 'the',
    'a', 'to', 'of', 'and', 'is', 'in', 'it', 'or', 'y', 'o',
  ]);
  return text.toLowerCase()
    .replace(/[^\w\sáéíóúñü]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

function questionsMatchDecision(question: string, decisions: string[]): boolean {
  const qTokens = tokenize(question);
  for (const dec of decisions) {
    const dTokens = tokenize(dec);
    const overlap = qTokens.filter(t => dTokens.includes(t));
    if (overlap.length >= 3) return true;
  }
  return false;
}

export function buildThemeActivity(orbitRoot: string): Map<string, ThemeActivity> {
  const notesDir = path.join(orbitRoot, '.orbit', 'notes');
  const decisionsPath = path.join(orbitRoot, '.orbit', 'decisions', 'log.md');
  const today = new Date().toISOString().split('T')[0];

  const notes = parseAllInDir<{
    themes: string[];
    date: string;
    questions: string[];
    decisions: string[];
  }>(notesDir);

  let allDecisions: string[] = [];
  try {
    const content = fs.readFileSync(decisionsPath, 'utf-8');
    const rows = parseMarkdownTable(content);
    allDecisions = rows.map(r => r.decision || '');
  } catch {}

  const themeMap = new Map<string, ThemeActivity>();

  // Build per-theme data
  const themeNotes = new Map<string, { dates: string[]; questions: string[] }>();
  for (const note of notes) {
    const themes = note.data.themes || [];
    for (const theme of themes) {
      if (!themeNotes.has(theme)) {
        themeNotes.set(theme, { dates: [], questions: [] });
      }
      const entry = themeNotes.get(theme)!;
      if (note.data.date) entry.dates.push(note.data.date);
      entry.questions.push(...(note.data.questions || []));
    }
  }

  for (const [theme, data] of themeNotes) {
    const sortedDates = data.dates.sort().reverse();
    const latestNoteDate = sortedDates[0] || null;
    const daysSince = latestNoteDate ? daysBetween(latestNoteDate, today) : 999;

    // Filter decisions relevant to this theme
    const themeDecisions = allDecisions; // Compare against all decisions

    themeMap.set(theme, {
      latestNoteDate,
      daysSinceLastNote: daysSince,
      openQuestions: data.questions.filter(q => !questionsMatchDecision(q, themeDecisions)),
      hasMatchingDecision: (q: string) => questionsMatchDecision(q, themeDecisions),
    });
  }

  return themeMap;
}

export function classifyAttention(
  item: { task: string; owner: string; due: string; theme: string; status: string },
  today: string,
  themeActivity: Map<string, ThemeActivity>
): { attention: AttentionReason | null; detail: string } {
  const status = (item.status || '').toLowerCase();
  if (status === 'done' || status === 'completed') {
    return { attention: null, detail: '' };
  }

  // 1. Overdue
  if (item.due && item.due !== '—' && item.due !== '~' && item.due < today) {
    const days = daysBetween(item.due, today);
    return { attention: 'overdue', detail: `${days} days overdue` };
  }

  // 2. Blocked (keyword detection)
  const taskLower = item.task.toLowerCase();
  for (const kw of BLOCKED_KEYWORDS) {
    if (taskLower.includes(kw)) {
      return { attention: 'blocked', detail: `Contains "${kw}" — may depend on someone else` };
    }
  }

  // 3. Needs decision (theme has unresolved questions)
  const activity = themeActivity.get(item.theme);
  if (activity && activity.openQuestions.length > 0) {
    return {
      attention: 'needs-decision',
      detail: `${activity.openQuestions.length} open question(s) in ${item.theme}`,
    };
  }

  // 4. Forgotten (theme inactive + no due date)
  if (activity && activity.daysSinceLastNote > 7 && (!item.due || item.due === '—' || item.due === '~')) {
    return {
      attention: 'forgotten',
      detail: `No activity on ${item.theme} for ${activity.daysSinceLastNote} days`,
    };
  }

  // 5. Stale (pending too long)
  if (activity && activity.daysSinceLastNote > 10) {
    return {
      attention: 'stale',
      detail: `Theme inactive for ${activity.daysSinceLastNote} days`,
    };
  }

  return { attention: null, detail: '' };
}

export function getAttentionItems(orbitRoot: string, ownerFilter?: string): AttentionItem[] {
  const pendingPath = path.join(orbitRoot, '.orbit', 'action-items', 'pending.md');
  const today = new Date().toISOString().split('T')[0];
  const themeActivity = buildThemeActivity(orbitRoot);

  let rows: Array<Record<string, string>>;
  try {
    const content = fs.readFileSync(pendingPath, 'utf-8');
    rows = parseMarkdownTable(content);
  } catch {
    return [];
  }

  let items = rows.map((row, index) => {
    const item = {
      task: row.task || '',
      owner: row.owner || '',
      due: row.due || '',
      theme: row.theme || '',
      status: row.status || 'pending',
    };

    const { attention, detail } = classifyAttention(item, today, themeActivity);
    const isDrifting = !!(item.due && item.due !== '—' && item.due !== '~' && item.due < today
      && item.status.toLowerCase() !== 'done' && item.status.toLowerCase() !== 'completed');

    return {
      index,
      ...item,
      drifting: isDrifting,
      attention,
      attentionDetail: detail,
    };
  });

  if (ownerFilter) {
    items = items.filter(i => i.owner.toLowerCase() === ownerFilter.toLowerCase());
  }

  return items;
}
