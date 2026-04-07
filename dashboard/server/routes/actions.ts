import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { parseMarkdownTable, writeMarkdownTable } from '../parsers/table.js';

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

  function readItems() {
    const content = fs.readFileSync(filePath(), 'utf-8');
    const rows = parseMarkdownTable(content);
    const today = new Date().toISOString().split('T')[0];

    return rows.map((row, index) => ({
      index,
      task: row.task || '',
      owner: row.owner || '',
      due: row.due || '',
      theme: row.theme || '',
      status: row.status || 'pending',
      drifting: !!(row.due && row.due < today && (row.status || '').toLowerCase() !== 'done' && (row.status || '').toLowerCase() !== 'completed'),
    }));
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
      const items = readItems();
      const owner = req.query.owner as string | undefined;
      const configName = getConfigName();
      const filtered = owner
        ? items.filter(i => i.owner.toLowerCase() === owner.toLowerCase())
        : items;

      res.json({ items: filtered, configName });
    } catch {
      res.json({ items: [], configName: '' });
    }
  });

  router.put('/action-items/:index', (req, res) => {
    try {
      const idx = parseInt(req.params.index, 10);
      const items = readItems();
      if (idx < 0 || idx >= items.length) return res.status(404).json({ error: 'Item not found' });

      const { status } = req.body;
      if (status) items[idx].status = status;

      writeItems(items);
      res.json({ ok: true, item: items[idx] });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update item' });
    }
  });

  router.delete('/action-items/:index', (req, res) => {
    try {
      const idx = parseInt(req.params.index, 10);
      const items = readItems();
      if (idx < 0 || idx >= items.length) return res.status(404).json({ error: 'Item not found' });

      items.splice(idx, 1);
      writeItems(items);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: 'Failed to delete item' });
    }
  });

  return router;
}
