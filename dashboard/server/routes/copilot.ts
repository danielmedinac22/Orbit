import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { parseFrontmatter } from '../parsers/frontmatter.js';
import { getAttentionItems, type AttentionItem } from '../intelligence/attention.js';
import { computeFocus, computeStalledThemes, computeOpenQuestions } from '../intelligence/focus.js';

export function copilotRoutes(orbitRoot: string): Router {
  const router = Router();

  function getConfig(): { name: string; last_ingest: string } | null {
    const configPath = path.join(orbitRoot, '.orbit', 'config.md');
    const parsed = parseFrontmatter<Record<string, unknown>>(configPath);
    if (!parsed) return null;
    return {
      name: (parsed.data.name as string) || '',
      last_ingest: (parsed.data.last_ingest as string) || '',
    };
  }

  router.get('/copilot', (_req, res) => {
    const orbitDir = path.join(orbitRoot, '.orbit');
    const initialized = fs.existsSync(orbitDir);

    if (!initialized) {
      return res.json({
        initialized: false,
        config: null,
        focus: null,
        needsImport: false,
        daysSinceLastIngest: 0,
        temporal: { today: [], thisWeek: [], nextWeek: [] },
        attentionItems: [],
        stalledThemes: [],
        openQuestions: [],
        recentBriefSlug: null,
      });
    }

    const configPath = path.join(orbitDir, 'config.md');
    const configParsed = parseFrontmatter<Record<string, unknown>>(configPath);
    const config = configParsed?.data || null;
    const configName = (config?.name as string) || '';
    const lastIngest = (config?.last_ingest as string) || '';

    // Import detection
    const today = new Date().toISOString().split('T')[0];
    let daysSinceLastIngest = 0;
    let needsImport = false;
    if (lastIngest) {
      daysSinceLastIngest = Math.floor(
        (new Date(today).getTime() - new Date(lastIngest).getTime()) / (1000 * 60 * 60 * 24)
      );
      needsImport = daysSinceLastIngest >= 1;
    } else {
      needsImport = true;
    }

    // Get all my items with attention classification
    const allItems = getAttentionItems(orbitRoot, configName || undefined);

    // Temporal buckets
    const sevenDays = new Date();
    sevenDays.setDate(sevenDays.getDate() + 7);
    const fourteenDays = new Date();
    fourteenDays.setDate(fourteenDays.getDate() + 14);
    const weekEnd = sevenDays.toISOString().split('T')[0];
    const twoWeekEnd = fourteenDays.toISOString().split('T')[0];

    const pendingItems = allItems.filter(i =>
      i.status.toLowerCase() !== 'done' && i.status.toLowerCase() !== 'completed'
    );

    const todayItems = pendingItems.filter(i => {
      if (!i.due || i.due === '—' || i.due === '~') return i.attention === 'overdue';
      return i.due <= today;
    });

    const thisWeekItems = pendingItems.filter(i => {
      if (!i.due || i.due === '—' || i.due === '~') return false;
      return i.due > today && i.due <= weekEnd;
    });

    const nextWeekItems = pendingItems.filter(i => {
      if (!i.due || i.due === '—' || i.due === '~') return false;
      return i.due > weekEnd && i.due <= twoWeekEnd;
    });

    // Attention items (any item with attention !== null)
    const attentionItems = pendingItems.filter(i => i.attention !== null);

    // Focus project
    const focus = computeFocus(orbitRoot, configName);

    // Stalled themes
    const stalledThemes = computeStalledThemes(orbitRoot);

    // Open questions
    const openQuestions = computeOpenQuestions(orbitRoot).slice(0, 10);

    // Most recent brief
    let recentBriefSlug: string | null = null;
    try {
      const briefsDir = path.join(orbitDir, 'briefs');
      const briefs = fs.readdirSync(briefsDir)
        .filter(f => f.endsWith('.md'))
        .sort()
        .reverse();
      if (briefs.length > 0) {
        recentBriefSlug = briefs[0].replace('.md', '');
      }
    } catch {}

    res.json({
      initialized: true,
      config,
      focus,
      needsImport,
      daysSinceLastIngest,
      temporal: {
        today: todayItems,
        thisWeek: thisWeekItems,
        nextWeek: nextWeekItems,
      },
      attentionItems,
      stalledThemes,
      openQuestions,
      recentBriefSlug,
    });
  });

  return router;
}
