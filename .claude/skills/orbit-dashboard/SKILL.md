---
name: orbit-dashboard
description: Launch the Orbit web dashboard to visualize your workspace.
user_invocable: true
---

Launch the Orbit Dashboard — a local web app that visualizes your .orbit/ workspace.

## Steps

1. Check if `dashboard/package.json` exists at the project root. If not:
   - Tell the user: "Dashboard not found. Make sure the `dashboard/` directory exists in your Orbit project."
   - Stop.

2. Check if `dashboard/node_modules/` exists. If not:
   - Tell the user: "Installing dashboard dependencies..."
   - Run via Bash: `cd dashboard && npm install`

3. Launch the dashboard in background via Bash:
   ```bash
   cd dashboard && npm run dev
   ```

4. Output to the user:
   ```
   ◉ Orbit Dashboard launching...

     Local:  http://localhost:5173
     API:    http://localhost:3001

   Open http://localhost:5173 in your browser.
   The dashboard auto-refreshes when .orbit/ changes.

   To stop: press Ctrl+C in the dashboard terminal, or close this session.
   ```
