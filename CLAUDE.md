# Orbit — Context Copilot for Product Managers

## .orbit/ Directory
- `notes/` — Chronological meeting notes (the core data)
- `themes/` — Thematic organization (themes reference notes)
- `action-items/pending.md` — All pending action items
- `decisions/log.md` — Cross-meeting decision tracker
- `briefs/` — Daily and weekly briefs
- `artifacts/` — Generated PM documents
- `index.md` — Knowledge index (auto-rebuilt by Astro)
- `config.md` — PM's identity, role, goals, stakeholders

## Rules
- Notes are the source of truth. Never modify note content body.
- Only Astro updates the `themes:` field in note frontmatter.
- All factual claims cite the source: "(from Meeting Title, YYYY-MM-DD)"
- Respond in the same language as the user's query.
- Never invent information not present in the notes.
- When a user asks a PM question, delegate to the Engin agent.
- When notes need organization, delegate to the Astro agent.

## Skills: /orbit-init, /orbit-ingest, /orbit-status, /orbit-brief,
## /orbit-priorities, /orbit-decisions, /orbit-prep, /orbit-artifact
