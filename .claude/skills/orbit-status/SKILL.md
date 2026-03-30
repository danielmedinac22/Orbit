---
name: orbit-status
description: Show Orbit workspace status — notes, themes, action items, decisions, artifacts. Use when the user asks for a workspace overview, status, or how many notes they have.
allowed-tools: [Read, Glob, Grep]
---

You are displaying a read-only overview of the Orbit PM workspace. Follow these steps exactly.

---

## Step 0 — Existence Check

Check if `.orbit/config.md` exists using the Read tool.

If it does NOT exist, respond with this plain message (no spatial language):
> "No Orbit workspace found. Run /orbit-init to set up your workspace."

Stop here if the workspace does not exist.

---

## Step 1 — Collect Workspace Data

Read the workspace files to gather counts and state. Collect all of the following:

### Notes (Signals)
- Use Glob to count `.md` files in `.orbit/notes/` — this is the total signal count
- Count notes from this week: check filenames for dates on or after Monday of the current week (dates are prefixed in YYYY-MM-DD format)
- If no notes directory exists, count is 0

### Themes (Constellations)
- Use Glob to list directories in `.orbit/themes/` excluding `_suggested/`
- Count of active themes = number of non-`_suggested/` directories found
- Use Glob to list directories in `.orbit/themes/_suggested/`
- Count of suggested themes = number of directories in `_suggested/`
- For each active theme directory, check if `action-items.md` exists and count pending rows

### Action Items (Missions)
- Read `.orbit/action-items/pending.md` and count table rows where status column is "pending"
- Count overdue items: rows where the due date exists and is earlier than today and status is "pending"
- Active missions = pending items total; drifting missions = overdue items

### Decisions (Coordinates)
- Read `.orbit/decisions/log.md` and count data rows in the table (skip the header row)
- Count rows where status column is "conflicting" or "stalled"
- Locked coordinates = total decisions; conflicting = conflicting/stalled count

### Artifacts (Payloads)
- Count `.md` files in `.orbit/artifacts/` (excluding `.gitkeep`)
- Count `.md` files in each `.orbit/themes/*/artifacts/` directory
- Total payloads = sum of all artifact files found

### Last Brief
- Use Glob to find files in `.orbit/briefs/` (sorted by filename — dates are prefixed)
- The most recent file is the last briefing date
- Extract the date from the filename (format: `YYYY-MM-DD.md` or `week-YYYY-MM-DD.md`)
- If no briefs exist, show "none yet"

---

## Step 2 — Display Output

### For a workspace with notes (1 or more notes):

Display the full spatial format:

```
◉ Orbit Station
─────────────────
Signals:        N captured (N this week)
Constellations: N active, N suggested
Missions:       N active, N drifting
Coordinates:    N locked, N conflicting
Payloads:       N delivered
Last briefing:  YYYY-MM-DD

Constellations:
  ★ Theme Name    — N signals, N active missions
  ★ Theme Name    — N signals, N active missions

Suggested:
  ○ Theme Name    — detected in N signals

Next: [contextual suggestion — see Step 3]
```

**Vocabulary mapping (apply consistently):**
- Notes → Signals
- Themes → Constellations
- Action items (pending) → Missions (active)
- Overdue action items → Missions drifting
- Decisions → Coordinates (locked)
- Decision conflicts or stalled decisions → Coordinates (conflicting)
- Artifacts → Payloads (delivered)

**Constellation detail format:** For each active theme, show:
- Name with `★` prefix
- Number of notes tagged with this theme (search note frontmatter for `themes:` containing the theme name)
- Number of active missions (pending action items) for this theme

**Suggested themes format:** For each directory in `_suggested/`, show:
- Name with `○` prefix
- How many notes mention the theme (if determinable from the suggested theme file, otherwise omit the count)

**Alignment:** Pad labels with spaces so values align cleanly in a column.

### For an empty workspace (0 notes):

Display the simpler variant without spatial terminology:

```
◉ Orbit Station
─────────────────
No signals yet.

Next: Run /orbit-ingest to capture your first notes.
```

---

## Step 3 — Suggest the Next Action

Choose the most relevant suggestion based on current workspace state. Add it as the final `Next:` line in the output.

**Priority order (use the first matching condition):**

1. No notes at all → `Next: Run /orbit-ingest to capture your first signals.`
2. Has overdue action items → `Next: N missions drifting. Run /orbit-brief to review.`
3. Has suggested themes awaiting confirmation → `Next: N constellations pending confirmation. Ask Astro to review.`
4. Has conflicting or stalled decisions → `Next: Coordinate conflict detected. Run /orbit-decisions to audit.`
5. No brief today → `Next: Run /orbit-brief for today's mission briefing.`
6. Everything healthy → `Next: Run /orbit-brief for today's briefing or /orbit-priorities for a priority scan.`

Replace `N` with the actual count in all suggestions.

---

## Step 4 — Handle Edge Cases

- **Missing `.orbit/action-items/pending.md`:** Count as 0 missions
- **Missing `.orbit/decisions/log.md`:** Count as 0 coordinates
- **Missing `.orbit/briefs/` directory or no files in it:** Show "Last briefing: none yet"
- **Themes directory exists but has no subdirectories:** Show "Constellations: 0 active, 0 suggested"
- **Theme exists but has no action-items.md:** Show 0 active missions for that theme

---

## Implementation Notes

- This skill is read-only. Do NOT write, edit, or modify any files.
- Do not use spatial error language. "No Orbit workspace found" — not "Station offline" or similar.
- Spatial vocabulary applies to the display output, not to error messages or file structure
- Use Glob for file counting (more efficient than Read for directory listing)
- Use Grep for counting table rows in log files (pattern: `| ` prefix indicates a data row)
- When counting "this week's" notes, determine the current date and calculate Monday of the current week
- For overdue detection, compare due dates in action-items/pending.md against today's date
