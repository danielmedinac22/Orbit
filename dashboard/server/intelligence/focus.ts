import fs from 'fs';
import path from 'path';
import { parseAllInDir } from '../parsers/frontmatter.js';
import { parseMarkdownTable } from '../parsers/table.js';
import { buildThemeActivity, classifyAttention, type AttentionReason } from './attention.js';

export interface FocusProject {
  theme: string;
  reason: string;
  score: number;
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

interface ThemeScore {
  theme: string;
  score: number;
  overdueCount: number;
  dueThisWeekCount: number;
  openQuestionCount: number;
  daysSinceLastNote: number;
}

export function computeFocus(orbitRoot: string, configName: string): FocusProject | null {
  const pendingPath = path.join(orbitRoot, '.orbit', 'action-items', 'pending.md');
  const today = new Date().toISOString().split('T')[0];
  const themeActivity = buildThemeActivity(orbitRoot);

  let rows: Array<Record<string, string>>;
  try {
    const content = fs.readFileSync(pendingPath, 'utf-8');
    rows = parseMarkdownTable(content);
  } catch {
    return null;
  }

  // Filter to user's items
  const myItems = rows.filter(r =>
    (r.owner || '').toLowerCase() === configName.toLowerCase() ||
    (r.owner || '').toLowerCase() === 'unassigned'
  );

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const weekEnd = sevenDaysFromNow.toISOString().split('T')[0];

  // Score per theme
  const themeScores = new Map<string, ThemeScore>();

  for (const item of myItems) {
    const theme = item.theme || 'Unassigned';
    const status = (item.status || '').toLowerCase();
    if (status === 'done' || status === 'completed') continue;

    if (!themeScores.has(theme)) {
      const activity = themeActivity.get(theme);
      themeScores.set(theme, {
        theme,
        score: 0,
        overdueCount: 0,
        dueThisWeekCount: 0,
        openQuestionCount: activity?.openQuestions.length || 0,
        daysSinceLastNote: activity?.daysSinceLastNote || 999,
      });
    }

    const ts = themeScores.get(theme)!;
    const due = item.due || '';

    if (due && due !== '—' && due !== '~' && due < today) {
      ts.overdueCount++;
    } else if (due && due !== '—' && due !== '~' && due <= weekEnd) {
      ts.dueThisWeekCount++;
    }
  }

  // Compute composite scores
  let best: ThemeScore | null = null;
  for (const ts of themeScores.values()) {
    ts.score = (ts.overdueCount * 30)
      + (ts.dueThisWeekCount * 20)
      + (ts.openQuestionCount * 10)
      + (ts.daysSinceLastNote > 7 ? 15 : 0);

    if (!best || ts.score > best.score) {
      best = ts;
    }
  }

  if (!best || best.score === 0) return null;

  // Build reason string
  const parts: string[] = [];
  if (best.overdueCount > 0) parts.push(`${best.overdueCount} overdue`);
  if (best.dueThisWeekCount > 0) parts.push(`${best.dueThisWeekCount} due this week`);
  if (best.openQuestionCount > 0) parts.push(`${best.openQuestionCount} open questions`);
  if (best.daysSinceLastNote > 7) parts.push(`no activity in ${best.daysSinceLastNote}d`);

  return {
    theme: best.theme,
    reason: parts.join(', '),
    score: best.score,
  };
}

export function computeStalledThemes(orbitRoot: string): StalledTheme[] {
  const pendingPath = path.join(orbitRoot, '.orbit', 'action-items', 'pending.md');
  const themeActivity = buildThemeActivity(orbitRoot);

  let rows: Array<Record<string, string>>;
  try {
    const content = fs.readFileSync(pendingPath, 'utf-8');
    rows = parseMarkdownTable(content);
  } catch {
    return [];
  }

  const stalledThemes: StalledTheme[] = [];

  for (const [theme, activity] of themeActivity) {
    if (activity.daysSinceLastNote > 7) {
      const openItems = rows.filter(r =>
        r.theme === theme &&
        (r.status || '').toLowerCase() !== 'done' &&
        (r.status || '').toLowerCase() !== 'completed'
      ).length;

      if (openItems > 0) {
        stalledThemes.push({
          theme,
          daysSinceActivity: activity.daysSinceLastNote,
          openItems,
        });
      }
    }
  }

  return stalledThemes.sort((a, b) => b.daysSinceActivity - a.daysSinceActivity);
}

export function computeOpenQuestions(orbitRoot: string): OpenQuestion[] {
  const notesDir = path.join(orbitRoot, '.orbit', 'notes');
  const today = new Date().toISOString().split('T')[0];
  const themeActivity = buildThemeActivity(orbitRoot);

  const notes = parseAllInDir<{
    themes: string[];
    date: string;
    title: string;
    questions: string[];
  }>(notesDir);

  const openQuestions: OpenQuestion[] = [];

  for (const note of notes) {
    const questions = note.data.questions || [];
    const themes = note.data.themes || [];
    const mainTheme = themes[0] || 'General';

    for (const q of questions) {
      const activity = themeActivity.get(mainTheme);
      if (activity && !activity.hasMatchingDecision(q)) {
        const daysPending = note.data.date
          ? Math.floor((new Date(today).getTime() - new Date(note.data.date).getTime()) / (1000 * 60 * 60 * 24))
          : 0;
        openQuestions.push({
          question: q,
          theme: mainTheme,
          source: note.data.title || note.slug,
          daysPending,
        });
      }
    }
  }

  return openQuestions.sort((a, b) => b.daysPending - a.daysPending);
}
