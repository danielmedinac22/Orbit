import { Router } from 'express';
import { spawn, ChildProcess } from 'child_process';
import { WebSocketServer, WebSocket } from 'ws';

const ALLOWED_ACTIONS = [
  'orbit-brief', 'orbit-theme', 'orbit-decisions', 'orbit-priorities',
  'orbit-prep', 'orbit-artifact', 'orbit-ingest', 'orbit-status',
];

let activeProcess: ChildProcess | null = null;

export function claudeRoutes(wss: WebSocketServer): Router {
  const router = Router();

  router.post('/claude/run', (req, res) => {
    const { action, args, prompt } = req.body || {};

    if (activeProcess) {
      return res.status(409).json({ error: 'Claude is already running a task' });
    }

    let commandPrompt: string;
    if (action && ALLOWED_ACTIONS.includes(action)) {
      commandPrompt = args ? `/${action} ${args}` : `/${action}`;
    } else if (prompt) {
      // Sanitize: remove shell-dangerous characters
      const safePrompt = prompt.replace(/[`$\\]/g, '');
      commandPrompt = safePrompt;
    } else {
      return res.status(400).json({ error: 'Invalid action or prompt' });
    }

    const broadcast = (msg: { type: string; content: string }) => {
      const data = JSON.stringify(msg);
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    };

    broadcast({ type: 'status', content: `Running: ${commandPrompt}` });

    try {
      activeProcess = spawn('claude', ['-p', commandPrompt, '--output-format', 'json'], {
        cwd: process.cwd(),
        env: { ...process.env },
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let output = '';

      activeProcess.stdout?.on('data', (chunk: Buffer) => {
        const text = chunk.toString();
        output += text;
        broadcast({ type: 'output', content: text });
      });

      activeProcess.stderr?.on('data', (chunk: Buffer) => {
        broadcast({ type: 'error', content: chunk.toString() });
      });

      activeProcess.on('close', (code) => {
        activeProcess = null;
        broadcast({ type: 'done', content: code === 0 ? 'Completed' : `Exited with code ${code}` });
      });

      activeProcess.on('error', (err) => {
        activeProcess = null;
        broadcast({ type: 'error', content: `Failed to start Claude: ${err.message}` });
      });

      res.json({ status: 'started', command: commandPrompt });
    } catch (err: unknown) {
      activeProcess = null;
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  router.post('/claude/stop', (_req, res) => {
    if (activeProcess) {
      activeProcess.kill('SIGTERM');
      activeProcess = null;
      res.json({ status: 'stopped' });
    } else {
      res.json({ status: 'no active process' });
    }
  });

  return router;
}
