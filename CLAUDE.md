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

## First Session
- If `.orbit/` does not exist, suggest: "Run `/orbit-init` to set up your workspace."
- If `.orbit/` exists but has no notes, suggest: "Run `/orbit-ingest` to capture your first notes."
- If `.orbit/` has notes, suggest: "Run `/orbit-status` for an overview, or just ask me anything about your meetings."

## Help
- Run `/orbit-help` to see all available commands.

## Skills: /orbit-help, /orbit-init, /orbit-ingest, /orbit-status, /orbit-brief,
## /orbit-priorities, /orbit-decisions, /orbit-prep, /orbit-artifact
