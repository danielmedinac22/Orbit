#!/usr/bin/env node
// Orbit Statusline for Claude Code
// Shows: ◉ Orbit │ model │ context usage bar

const fs = require('fs');
const path = require('path');
const os = require('os');

let input = '';
const stdinTimeout = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input);
    const model = data.model?.display_name || 'Claude';
    const session = data.session_id || '';
    const remaining = data.context_window?.remaining_percentage;

    // Context window display (used percentage scaled to usable context)
    // Claude Code reserves ~16.5% for autocompact buffer
    const AUTO_COMPACT_BUFFER_PCT = 16.5;
    let ctx = '';
    if (remaining != null) {
      const usableRemaining = Math.max(0, ((remaining - AUTO_COMPACT_BUFFER_PCT) / (100 - AUTO_COMPACT_BUFFER_PCT)) * 100);
      const used = Math.max(0, Math.min(100, Math.round(100 - usableRemaining)));

      // Write bridge file for context monitoring
      if (session) {
        try {
          const bridgePath = path.join(os.tmpdir(), `claude-ctx-${session}.json`);
          fs.writeFileSync(bridgePath, JSON.stringify({
            session_id: session,
            remaining_percentage: remaining,
            used_pct: used,
            timestamp: Math.floor(Date.now() / 1000)
          }));
        } catch (e) {}
      }

      // 10-segment progress bar
      const filled = Math.floor(used / 10);
      const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);

      if (used < 50) {
        ctx = ` \x1b[32m${bar} ${used}%\x1b[0m`;
      } else if (used < 65) {
        ctx = ` \x1b[33m${bar} ${used}%\x1b[0m`;
      } else if (used < 80) {
        ctx = ` \x1b[38;5;208m${bar} ${used}%\x1b[0m`;
      } else {
        ctx = ` \x1b[5;31m${bar} ${used}%\x1b[0m`;
      }
    }

    // Update notification
    let update = '';
    const cacheDir = path.join(data.workspace?.current_dir || process.cwd(), '.claude', 'cache');
    const cacheFile = path.join(cacheDir, 'orbit-update-check.json');
    if (fs.existsSync(cacheFile)) {
      try {
        const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
        if (cache.update_available) {
          update = ' \x1b[33m⬆ /orbit-update\x1b[0m │';
        }
      } catch (e) {}
    }

    process.stdout.write(`\x1b[36m◉ Orbit\x1b[0m │${update} \x1b[2m${model}\x1b[0m${ctx}`);
  } catch (e) {
    // Silent fail
  }
});
