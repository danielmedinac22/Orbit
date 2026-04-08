import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { parseMarkdownTable, writeMarkdownTable } from '../parsers/table.js';
import { getAttentionItems } from '../intelligence/attention.js';

export function actionsRoutes(orbitRoot: string): Router {
  const router = Router();
  const filePath = () => path.join(orbitRoot, '.orbit', 'action-items', 'pending.md');
  const configPath = () => path.join(orbitRoot, '.orbit', 'config.md');

  function getConfigName(): string {
    try {
      const content = fs.readFileSync(configPath(), 'utf-8');
      const match = content.match(/^name:\s*(.+)$/m);
      return match ? match[1].trim() : '';
    } catch {
      return '';
    }
  }

  function writeItems(rows: Array<{ task: string; owner: string; due: string; theme: string; status: string }>) {
    const tableRows = rows.map(r => ({
      task: r.task,
      owner: r.owner,
      due: r.due || '—',
      theme: r.theme,
      status: r.status,
    }));
    const content = writeMarkdownTable(
      '# Pending Action Items',
      ['Task', 'Owner', 'Due', 'Theme', 'Status'],
      tableRows
    );
    fs.writeFileSync(filePath(), content, 'utf-8');
  }

  router.get('/action-items', (req, res) => {
    try {
      const configName = getConfigName();
      const owner = req.query.owner as string | undefined;
      const all = req.query.all === 'true';

      // Use attention engine for enriched items
      const ownerFilter = all ? undefined : (owner || configName || undefined);
      const items = getAttentionItems(orbitRoot, ownerFilter);

      res.json({ items, configName });
    } catch {
      res.json({ items: [], configName: '' });
    }
  });

  router.put('/action-items/:index', (req, res) => {
    try {
      const idx = parseInt(req.params.index, 10);
      const content = fs.readFileSync(filePath(), 'utf-8');
      const rows = parseMarkdownTable(content);
      if (idx < 0 || idx >= rows.length) return res.status(404).json({ error: 'Item not found' });

      const { status } = req.body;
      if (status) rows[idx].status = status;

      writeItems(rows.map(r => ({
        task: r.task || '',
        owner: r.owner || '',
        due: r.due || '',
        theme: r.theme || '',
        status: r.status || 'pending',
      })));
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update item' });
    }
  });

  router.delete('/action-items/:index', (req, res) => {
    try {
      const idx = parseInt(req.params.index, 10);
      const content = fs.readFileSync(filePath(), 'utf-8');
      const rows = parseMarkdownTable(content);
      if (idx < 0 || idx >= rows.length) return res.status(404).json({ error: 'Item not found' });

      rows.splice(idx, 1);
      writeItems(rows.map(r => ({
        task: r.task || '',
        owner: r.owner || '',
        due: r.due || '',
        theme: r.theme || '',
        status: r.status || 'pending',
      })));
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: 'Failed to delete item' });
    }
  });

  return router;
}
