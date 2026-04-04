import chokidar from 'chokidar';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';

export function setupWatcher(orbitRoot: string, wss: WebSocketServer) {
  const orbitDir = path.join(orbitRoot, '.orbit');

  const watcher = chokidar.watch(`${orbitDir}/**/*.md`, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 },
  });

  watcher.on('all', (event, filePath) => {
    const relative = path.relative(orbitDir, filePath);
    const msg = JSON.stringify({ type: 'file-change', event, path: relative });
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  return watcher;
}
