import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { parseAllInDir, parseFrontmatter } from '../parsers/frontmatter.js';
import { parseMarkdownTable } from '../parsers/table.js';
import { buildThemeActivity, classifyAttention, type AttentionReason } from '../intelligence/attention.js';

export function themesRoutes(orbitRoot: string): Router {
  const router = Router();
  const themesDir = () => path.join(orbitRoot, '.orbit', 'themes');
  const notesDir = () => path.join(orbitRoot, '.orbit', 'notes');
  const cacheDir = () => path.join(orbitRoot, '.orbit', '.cache', 'narratives');

  router.get('/themes', (_req, res) => {
    const dir = themesDir();
    const configPath = path.join(orbitRoot, '.orbit', 'config.md');
    let configName = '';
    try {
      const cfgContent = fs.readFileSync(configPath, 'utf-8');
      const match = cfgContent.match(/^name:\s*(.+)$/m);
      configName = match ? match[1].trim().toLowerCase() : '';
    } catch {}

    const themes: Array<{
      name: string;
      type: 'active' | 'suggested';
      signalCount: number;
      missionCount: number;
      latestSignalDate: string | null;
      snippet: string;
    }> = [];

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory());
      const notes = parseAllInDir<{ themes: string[]; date: string; decisions: string[]; title: string }>(notesDir());
      const today = new Date().toISOString().split('T')[0];

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
                snippet: '',
              });
            }
          } catch {}
          continue;
        }

        const matchingNotes = notes.filter(n => (n.data.themes || []).includes(entry.name));
        let missionCount = 0;
        let myPendingCount = 0;
        let overdueCount = 0;
        let latestDecision = '';
        let rows: Array<Record<string, string>> = [];

        try {
          const aiPath = path.join(dir, entry.name, 'action-items.md');
          const content = fs.readFileSync(aiPath, 'utf-8');
          rows = parseMarkdownTable(content);
          missionCount = rows.filter(r => (r.status || '').toLowerCase() !== 'done' && (r.status || '').toLowerCase() !== 'completed').length;
          myPendingCount = rows.filter(r =>
            (r.owner || '').toLowerCase() === configName &&
            (r.status || '').toLowerCase() !== 'done' &&
            (r.status || '').toLowerCase() !== 'completed'
          ).length;
          overdueCount = rows.filter(r =>
            r.due && r.due !== '—' && r.due !== '~' && r.due < today &&
            (r.status || '').toLowerCase() !== 'done' &&
            (r.status || '').toLowerCase() !== 'completed'
          ).length;
        } catch {}

        // Get latest decision from notes
        for (const n of matchingNotes) {
          const decs = n.data.decisions || [];
          if (decs.length > 0 && !latestDecision) {
            latestDecision = typeof decs[0] === 'string' ? decs[0] : '';
          }
        }

        // Build snippet
        const snippetParts: string[] = [];
        if (matchingNotes.length > 0) {
          const latest = matchingNotes[0];
          const daysAgo = Math.floor((new Date(today).getTime() - new Date(latest.data.date).getTime()) / (1000 * 60 * 60 * 24));
          snippetParts.push(daysAgo === 0 ? 'Active today' : daysAgo <= 3 ? `Active ${daysAgo}d ago` : `Last activity ${daysAgo}d ago`);
        }
        if (overdueCount > 0) snippetParts.push(`${overdueCount} overdue`);
        if (myPendingCount > 0) snippetParts.push(`${myPendingCount} items tuyos`);
        if (latestDecision) snippetParts.push(latestDecision.length > 60 ? latestDecision.slice(0, 57) + '...' : latestDecision);

        themes.push({
          name: entry.name,
          type: 'active',
          signalCount: matchingNotes.length,
          missionCount,
          latestSignalDate: matchingNotes[0]?.data.date || null,
          snippet: snippetParts.join(' · '),
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

    // Read cached narrative
    let narrative: string | null = null;
    let narrativeGeneratedAt: string | null = null;
    try {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const narrativePath = path.join(cacheDir(), `${slug}.md`);
      const parsed = parseFrontmatter<{ generatedAt: string }>(narrativePath);
      if (parsed) {
        narrative = parsed.content.trim();
        narrativeGeneratedAt = parsed.data.generatedAt || null;
      }
    } catch {}

    // Compute insights from attention engine
    const today = new Date().toISOString().split('T')[0];
    const themeActivity = buildThemeActivity(orbitRoot);
    const insights: Array<{ type: AttentionReason; text: string }> = [];

    for (const item of actionItems) {
      const status = (item.status || '').toLowerCase();
      if (status === 'done' || status === 'completed') continue;

      const { attention, detail } = classifyAttention(
        { task: item.task || '', owner: item.owner || '', due: item.due || '', theme: name, status: item.status || '' },
        today,
        themeActivity
      );
      if (attention) {
        insights.push({ type: attention, text: `${item.task || 'Unknown task'}: ${detail}` });
      }
    }

    // Deduplicate insights by type (keep first 3 per type)
    const seenTypes = new Map<string, number>();
    const filteredInsights = insights.filter(i => {
      const count = seenTypes.get(i.type) || 0;
      if (count >= 3) return false;
      seenTypes.set(i.type, count + 1);
      return true;
    });

    res.json({
      name,
      signals: themeNotes.map(n => ({ slug: n.slug, title: n.data.title, date: n.data.date })),
      missions: actionItems,
      decisions: [...new Set(decisions)],
      questions: [...new Set(questions)],
      narrative,
      narrativeGeneratedAt,
      insights: filteredInsights,
    });
  });

  // Generate narrative via Claude
  router.post('/themes/:name/narrative', (req, res) => {
    // This will be triggered from the frontend and handled by claude route
    // For now, return instructions for the frontend to use the claude/run endpoint
    res.json({
      message: 'Use POST /api/claude/run with prompt to generate narrative',
      suggestedPrompt: `Generate a 3-paragraph forward-looking narrative for the theme "${req.params.name}". Paragraph 1: what changed recently. Paragraph 2: what is stalled or at risk. Paragraph 3: recommended next steps. Save to .orbit/.cache/narratives/${req.params.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.md with frontmatter generatedAt: ${new Date().toISOString()}.`,
    });
  });

  return router;
}
