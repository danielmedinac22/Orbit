---
name: orbit-theme
description: >
  Deep-dive into a specific theme. Review all open items, decisions, questions,
  and take action: close items, resolve decisions, generate artifacts.
argument-hint: "[theme-name]"
---

Deep-dive into a theme to close open loops: action items, stalled decisions, unanswered questions. Delegates analysis to Engin.

## Prerequisites

Check if `.orbit/config.md` exists. If not: "Run /orbit-init first to set up your workspace."
Check if `.orbit/index.md` has any themes. If no themes: "No themes yet. Run /orbit-ingest first to bring in notes, then Astro will create themes."

## Step 1 — Theme Selection

### If a theme name is provided as argument:

Find the matching theme directory in `.orbit/themes/` (case-insensitive, partial match). If not found, list available themes and ask user to pick.

### If no argument provided — identify top priority theme:

1. Read `.orbit/action-items/pending.md` — count overdue items per theme
2. Read `.orbit/decisions/log.md` — count stalled/conflicting decisions per theme
3. Read `.orbit/index.md` — check which themes have most recent activity (notes in last 2 weeks)
4. Score each theme: `overdue_items × 3 + stalled_decisions × 2 + recent_notes × 1`
5. Select the highest-scoring theme

Present the selection (in user's language from config.md):

**Spanish:**
```
El tema que más atención necesita ahora es: **[Theme Name]**
Razón: N tareas vencidas, N decisiones estancadas, N señales recientes

¿Trabajo en este tema, o prefieres otro?
[list other themes with scores]
```

**English:**
```
The theme that needs the most attention right now is: **[Theme Name]**
Reason: N overdue items, N stalled decisions, N recent signals

Work on this theme, or pick another?
[list other themes with scores]
```

Wait for user confirmation before proceeding.

## Step 2 — Theme Dashboard

Read all context for the selected theme and display a comprehensive dashboard:

```
◉ Theme Deep-Dive: [Theme Name]
─────────────────

## Open Missions (Action Items)
- [ ] [OVERDUE] **[Owner]**: [task] — due [date], [N] days overdue
- [ ] **[Owner]**: [task] — due [date]

## Coordinates (Decisions)
- [Confirmed] [decision] — from [meeting], [date]
- [STALLED] [decision] — confirmed [date], no follow-up after [N] days

## Open Questions
- [question] — raised in [meeting], [date]

## Recent Signals (last 2 weeks)
- [note title] — [date], [1-line summary]

## Key People
- [person] — [N action items, last mentioned [date]]
```

**Data sources:**
- Action items: `.orbit/themes/<theme>/action-items.md` and `.orbit/action-items/pending.md`
- Decisions: `.orbit/decisions/log.md` filtered by theme
- Questions: from note frontmatter `questions:` in notes tagged with this theme
- Recent signals: notes in `.orbit/notes/` with this theme in frontmatter, last 2 weeks
- Key people: extracted from action item owners and note participants

If a section has no entries, omit it.

## Step 3 — Suggest Actions

Based on the dashboard, suggest concrete next actions:

**Spanish:**
```
Acciones sugeridas:
1. Cerrar tareas vencidas: [list specific items that can be marked done or reassigned]
2. Resolver decisiones estancadas: [list decisions that need a call]
3. Responder preguntas abiertas: [list questions that should be addressed]
4. Generar artifact: /orbit-artifact [type] para [theme]
```

**English:**
```
Suggested next actions:
1. Close overdue items: [list specific items that can be marked done or reassigned]
2. Resolve stalled decisions: [list decisions that need a call]
3. Answer open questions: [list questions that should be addressed]
4. Generate artifact: /orbit-artifact [type] for [theme]
```

Wait for the user to select an action or ask a question about the theme.

## Step 4 — Execute Actions

Based on user selection:

- **Close/complete an action item**: Update status in `.orbit/action-items/pending.md` and `.orbit/themes/<theme>/action-items.md` — change `pending` to `done`
- **Reassign an action item**: Update the owner field
- **Resolve a decision**: Update status in `.orbit/decisions/log.md`
- **Answer a question**: Document the answer and add to the relevant note or decision log
- **Generate artifact**: Suggest the appropriate `/orbit-artifact` command for the theme
- **Ask about the theme**: Delegate to the Engin agent for deep analysis

After each action, show an updated mini-status of remaining open items for this theme.

## Error Handling

- Theme not found: list available themes
- No overdue or stalled items: "This theme is healthy — no urgent items. Try /orbit-priorities for a cross-theme view."
- No notes for theme: "No signals found for this theme yet."
