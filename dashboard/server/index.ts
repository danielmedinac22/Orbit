import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { workspaceRoutes } from './routes/workspace.js';
import { notesRoutes } from './routes/notes.js';
import { themesRoutes } from './routes/themes.js';
import { actionsRoutes } from './routes/actions.js';
import { decisionsRoutes } from './routes/decisions.js';
import { briefsRoutes } from './routes/briefs.js';
import { claudeRoutes } from './routes/claude.js';
import { setupWatcher } from './watcher.js';

const PORT = parseInt(process.env.PORT || '3001');
const ORBIT_ROOT = process.env.ORBIT_ROOT || path.resolve(process.cwd(), '..');

const app = express();
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// API routes
app.use('/api', workspaceRoutes(ORBIT_ROOT));
app.use('/api', notesRoutes(ORBIT_ROOT));
app.use('/api', themesRoutes(ORBIT_ROOT));
app.use('/api', actionsRoutes(ORBIT_ROOT));
app.use('/api', decisionsRoutes(ORBIT_ROOT));
app.use('/api', briefsRoutes(ORBIT_ROOT));
app.use('/api', claudeRoutes(wss));

// File watcher for live reload
setupWatcher(ORBIT_ROOT, wss);

wss.on('connection', () => {
  console.log('  Dashboard client connected');
});

server.listen(PORT, () => {
  console.log(`\n  \x1b[36m◉ Orbit API\x1b[0m running on http://localhost:${PORT}`);
  console.log(`  Watching: ${path.join(ORBIT_ROOT, '.orbit')}\n`);
});
