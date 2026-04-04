import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { parseMarkdownTable } from '../parsers/table.js';

export function actionsRoutes(orbitRoot: string): Router {
  const router = Router();

  router.get('/action-items', (_req, res) => {
    const filePath = path.join(orbitRoot, '.orbit', 'action-items', 'pending.md');
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const rows = parseMarkdownTable(content);
      const today = new Date().toISOString().split('T')[0];

      const items = rows.map(row => ({
        task: row.task || '',
        owner: row.owner || '',
        due: row.due || '',
        theme: row.theme || '',
        status: row.status || 'pending',
        drifting: !!(row.due && row.due < today && (row.status || '').toLowerCase() !== 'done' && (row.status || '').toLowerCase() !== 'completed'),
      }));

      res.json(items);
    } catch {
      res.json([]);
    }
  });

  return router;
}
