import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { parseFrontmatter } from '../parsers/frontmatter.js';
import { parseMarkdownTable } from '../parsers/table.js';

export function workspaceRoutes(orbitRoot: string): Router {
  const router = Router();

  router.get('/workspace', (_req, res) => {
    const orbitDir = path.join(orbitRoot, '.orbit');
    const initialized = fs.existsSync(orbitDir);

    if (!initialized) {
      return res.json({
        initialized: false,
        config: null,
        signals: { total: 0, thisWeek: 0 },
        constellations: { active: 0, suggested: 0 },
        missions: { active: 0, drifting: 0, done: 0 },
        coordinates: { confirmed: 0, conflicting: 0, stalled: 0 },
        briefs: 0,
        artifacts: 0,
      });
    }

    // Config
    const configPath = path.join(orbitDir, 'config.md');
    const config = parseFrontmatter(configPath)?.data || null;

    // Notes count
    const notesDir = path.join(orbitDir, 'notes');
    let noteFiles: string[] = [];
    try { noteFiles = fs.readdirSync(notesDir).filter(f => f.endsWith('.md')); } catch {}
    const total = noteFiles.length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = noteFiles.filter(f => {
      const dateMatch = f.match(/^(\d{4}-\d{2}-\d{2})/);
      return dateMatch && new Date(dateMatch[1]) >= oneWeekAgo;
    }).length;

    // Themes
    const themesDir = path.join(orbitDir, 'themes');
    let activeThemes = 0;
    let suggestedThemes = 0;
    try {
      const dirs = fs.readdirSync(themesDir, { withFileTypes: true }).filter(d => d.isDirectory());
      for (const d of dirs) {
        if (d.name === '_suggested') {
          try {
            suggestedThemes = fs.readdirSync(path.join(themesDir, '_suggested'), { withFileTypes: true })
              .filter(sd => sd.isDirectory()).length;
          } catch {}
        } else {
          activeThemes++;
        }
      }
    } catch {}

    // Action items
    const pendingPath = path.join(orbitDir, 'action-items', 'pending.md');
    let active = 0, drifting = 0, done = 0;
    try {
      const content = fs.readFileSync(pendingPath, 'utf-8');
      const rows = parseMarkdownTable(content);
      const today = new Date().toISOString().split('T')[0];
      for (const row of rows) {
        const status = (row.status || '').toLowerCase();
        if (status === 'done' || status === 'completed') {
          done++;
        } else if (row.due && row.due < today && status !== 'done' && status !== 'completed') {
          drifting++;
        } else {
          active++;
        }
      }
    } catch {}

    // Decisions
    const decisionsPath = path.join(orbitDir, 'decisions', 'log.md');
    let confirmed = 0, conflicting = 0, stalled = 0;
    try {
      const content = fs.readFileSync(decisionsPath, 'utf-8');
      const rows = parseMarkdownTable(content);
      for (const row of rows) {
        const s = (row.status || '').toLowerCase();
        if (s === 'conflicting') conflicting++;
        else if (s === 'stalled') stalled++;
        else confirmed++;
      }
    } catch {}

    // Briefs & artifacts count
    let briefCount = 0, artifactCount = 0;
    try { briefCount = fs.readdirSync(path.join(orbitDir, 'briefs')).filter(f => f.endsWith('.md')).length; } catch {}
    try { artifactCount = fs.readdirSync(path.join(orbitDir, 'artifacts')).filter(f => f.endsWith('.md')).length; } catch {}

    res.json({
      initialized: true,
      config,
      signals: { total, thisWeek },
      constellations: { active: activeThemes, suggested: suggestedThemes },
      missions: { active, drifting, done },
      coordinates: { confirmed, conflicting, stalled },
      briefs: briefCount,
      artifacts: artifactCount,
    });
  });

  return router;
}
