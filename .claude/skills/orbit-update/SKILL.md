---
name: orbit-update
description: Check for and apply Orbit updates from the remote repository.
argument-hint: ""
---

Check for Orbit updates and apply them if the user confirms.

## Step 1 — Check Current Version

Read the `VERSION` file at the project root. If it does not exist, get the current version from git:

```bash
git describe --tags --abbrev=0 2>/dev/null || echo "unknown"
```

## Step 2 — Check Remote for Updates

Run via Bash:

```bash
git fetch origin --tags 2>/dev/null
```

Then check if there are commits ahead on origin/main:

```bash
git log HEAD..origin/main --oneline 2>/dev/null
```

## Step 3 — Display Results

### If updates are available:

**Spanish:**
```
◉ Orbit — Actualización disponible

  Versión actual:  [current version/commit]
  Última versión:  [latest version/commit]

  Cambios:
  [git log --oneline output, each line as a bullet]

  ¿Aplicar actualización? [y/N]
```

**English:**
```
◉ Orbit — Update Available

  Current:  [current version/commit]
  Latest:   [latest version/commit]

  Changes:
  [git log --oneline output, each line as a bullet]

  Apply update? [y/N]
```

### If no updates:

**Spanish:** `◉ Orbit está al día.`
**English:** `◉ Orbit is up to date.`

## Step 4 — Apply Update

If the user confirms:

```bash
git pull origin main
```

After successful pull:
1. Read the new `VERSION` file to confirm updated version
2. Check if any files in `.claude/skills/` or `.claude/agents/` changed:
   ```bash
   git diff HEAD~1..HEAD --name-only -- .claude/
   ```
3. If skill/agent files changed, suggest restart:
   - **Spanish:** `Archivos de skills o agentes actualizados. Reinicia Claude Code para que tome los cambios.`
   - **English:** `Skill or agent files updated. Restart Claude Code to pick up the changes.`
4. If only other files changed: `Update complete — v[version].`

## Step 5 — Update Cache for Statusline

After checking (regardless of whether update was applied), write a cache file for the statusline to read:

```bash
mkdir -p .claude/cache
```

Write `.claude/cache/orbit-update-check.json`:
```json
{
  "update_available": true/false,
  "current_version": "...",
  "latest_version": "...",
  "checked_at": "YYYY-MM-DDTHH:MM:SS"
}
```

This file is read by the statusline hook to show the update indicator.

## Error Handling

- If not a git repo: "Orbit is not installed as a git repository. Manual update required."
- If no remote configured: "No remote repository configured. Check your git remote settings."
- If git pull fails (merge conflict, etc.): Show the error and suggest manual resolution.
