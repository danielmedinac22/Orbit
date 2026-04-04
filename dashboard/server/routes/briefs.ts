import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { renderMarkdown } from '../parsers/render.js';

export function briefsRoutes(orbitRoot: string): Router {
  const router = Router();
  const briefsDir = () => path.join(orbitRoot, '.orbit', 'briefs');

  router.get('/briefs', (_req, res) => {
    try {
      const files = fs.readdirSync(briefsDir()).filter(f => f.endsWith('.md')).sort().reverse();
      const briefs = files.map(f => {
        const slug = f.replace('.md', '');
        let type: 'daily' | 'weekly' | 'prep' = 'daily';
        if (slug.startsWith('week-')) type = 'weekly';
        else if (slug.startsWith('prep-')) type = 'prep';
        const dateMatch = slug.match(/(\d{4}-\d{2}-\d{2})/);
        return { slug, filename: f, type, date: dateMatch?.[1] || '' };
      });
      res.json(briefs);
    } catch {
      res.json([]);
    }
  });

  router.get('/briefs/:slug', (req, res) => {
    const filePath = path.join(briefsDir(), `${req.params.slug}.md`);
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      res.json({ slug: req.params.slug, content: renderMarkdown(raw) });
    } catch {
      res.status(404).json({ error: 'Brief not found' });
    }
  });

  return router;
}
