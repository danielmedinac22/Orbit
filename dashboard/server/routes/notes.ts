import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { parseAllInDir, parseFrontmatter } from '../parsers/frontmatter.js';
import { renderMarkdown } from '../parsers/render.js';

interface NoteFrontmatter {
  title: string;
  date: string;
  source: string;
  participants: string[];
  themes: string[];
  decisions: string[];
  questions: string[];
  action_items: Array<{ text: string; owner: string; due: string; status: string }>;
}

export function notesRoutes(orbitRoot: string): Router {
  const router = Router();
  const notesDir = () => path.join(orbitRoot, '.orbit', 'notes');

  router.get('/notes', (req, res) => {
    const theme = req.query.theme as string | undefined;
    const notes = parseAllInDir<NoteFrontmatter>(notesDir());

    const result = notes
      .filter(n => !theme || (n.data.themes || []).includes(theme))
      .map(n => ({
        slug: n.slug,
        title: n.data.title || n.slug,
        date: n.data.date || '',
        source: n.data.source || 'unknown',
        participants: n.data.participants || [],
        themes: n.data.themes || [],
        decisions: n.data.decisions || [],
        questions: n.data.questions || [],
        action_items: n.data.action_items || [],
      }));

    res.json(result);
  });

  router.get('/notes/:slug', (req, res) => {
    const filePath = path.join(notesDir(), `${req.params.slug}.md`);
    const parsed = parseFrontmatter<NoteFrontmatter>(filePath);
    if (!parsed) return res.status(404).json({ error: 'Note not found' });

    res.json({
      slug: req.params.slug,
      title: parsed.data.title || req.params.slug,
      date: parsed.data.date || '',
      source: parsed.data.source || 'unknown',
      participants: parsed.data.participants || [],
      themes: parsed.data.themes || [],
      decisions: parsed.data.decisions || [],
      questions: parsed.data.questions || [],
      action_items: parsed.data.action_items || [],
      body: renderMarkdown(parsed.content),
    });
  });

  router.delete('/notes/:slug', (req, res) => {
    const filePath = path.join(notesDir(), `${req.params.slug}.md`);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Note not found' });

    try {
      fs.unlinkSync(filePath);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: 'Failed to delete note' });
    }
  });

  return router;
}
