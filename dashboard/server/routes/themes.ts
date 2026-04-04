import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { parseAllInDir } from '../parsers/frontmatter.js';
import { parseMarkdownTable } from '../parsers/table.js';

export function themesRoutes(orbitRoot: string): Router {
  const router = Router();
  const themesDir = () => path.join(orbitRoot, '.orbit', 'themes');
  const notesDir = () => path.join(orbitRoot, '.orbit', 'notes');

  router.get('/themes', (_req, res) => {
    const dir = themesDir();
    const themes: Array<{
      name: string;
      type: 'active' | 'suggested';
      signalCount: number;
      missionCount: number;
      latestSignalDate: string | null;
    }> = [];

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory());
      const notes = parseAllInDir<{ themes: string[]; date: string }>(notesDir());

      for (const entry of entries) {
        if (entry.name === '_suggested') {
          try {
            const suggested = fs.readdirSync(path.join(dir, '_suggested'), { withFileTypes: true })
              .filter(d => d.isDirectory());
            for (const s of suggested) {
              const matchingNotes = notes.filter(n => (n.data.themes || []).includes(s.name));
              themes.push({
                name: s.name,
                type: 'suggested',
                signalCount: matchingNotes.length,
                missionCount: 0,
                latestSignalDate: matchingNotes[0]?.data.date || null,
              });
            }
          } catch {}
          continue;
        }

        const matchingNotes = notes.filter(n => (n.data.themes || []).includes(entry.name));
        let missionCount = 0;
        try {
          const aiPath = path.join(dir, entry.name, 'action-items.md');
          const content = fs.readFileSync(aiPath, 'utf-8');
          const rows = parseMarkdownTable(content);
          missionCount = rows.filter(r => (r.status || '').toLowerCase() !== 'done' && (r.status || '').toLowerCase() !== 'completed').length;
        } catch {}

        themes.push({
          name: entry.name,
          type: 'active',
          signalCount: matchingNotes.length,
          missionCount,
          latestSignalDate: matchingNotes[0]?.data.date || null,
        });
      }
    } catch {}

    res.json(themes);
  });

  router.get('/themes/:name', (req, res) => {
    const name = req.params.name;
    const notes = parseAllInDir<{ themes: string[]; date: string; title: string; decisions: string[]; questions: string[] }>(notesDir());
    const themeNotes = notes.filter(n => (n.data.themes || []).includes(name));

    let actionItems: Array<Record<string, string>> = [];
    try {
      const aiPath = path.join(themesDir(), name, 'action-items.md');
      const content = fs.readFileSync(aiPath, 'utf-8');
      actionItems = parseMarkdownTable(content);
    } catch {}

    const decisions: string[] = [];
    const questions: string[] = [];
    for (const n of themeNotes) {
      decisions.push(...(n.data.decisions || []));
      questions.push(...(n.data.questions || []));
    }

    res.json({
      name,
      signals: themeNotes.map(n => ({ slug: n.slug, title: n.data.title, date: n.data.date })),
      missions: actionItems,
      decisions: [...new Set(decisions)],
      questions: [...new Set(questions)],
    });
  });

  return router;
}
