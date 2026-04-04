import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { parseMarkdownTable } from '../parsers/table.js';

export function decisionsRoutes(orbitRoot: string): Router {
  const router = Router();

  router.get('/decisions', (_req, res) => {
    const filePath = path.join(orbitRoot, '.orbit', 'decisions', 'log.md');
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const rows = parseMarkdownTable(content);

      const decisions = rows.map(row => ({
        date: row.date || '',
        decision: row.decision || '',
        source: row.source || '',
        theme: row.theme || '',
        status: row.status || 'confirmed',
      }));

      res.json(decisions);
    } catch {
      res.json([]);
    }
  });

  return router;
}
