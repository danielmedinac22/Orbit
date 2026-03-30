---
name: orbit-artifact
description: >
  Generate PM documents from templates using Orbit workspace context.
  Templates: prd, decision-record, weekly-summary, stakeholder-update, rice-scorecard.
argument-hint: "<template> [--theme <name>] [--title 'Title']"
---

Generate professional PM documents from templates using Orbit workspace context. Delegates document generation to Engin.

## Parse Arguments

- Template name is required (first argument)
- `--theme <name>` is optional — scope context to a specific theme
- `--title 'Title'` is optional — override the generated document title

Examples:
- `/orbit-artifact prd --theme launch-readiness`
- `/orbit-artifact decision-record --theme api-redesign`
- `/orbit-artifact weekly-summary`
- `/orbit-artifact stakeholder-update --theme launch-readiness --title "Q1 Update"`

If no template is provided, ask: "Which template? Options: prd, decision-record, weekly-summary, stakeholder-update, rice-scorecard"

## Template Validation

Valid templates are: `prd`, `decision-record`, `weekly-summary`, `stakeholder-update`, `rice-scorecard`

If an invalid template name is given:
"Unknown template: '[name]'. Available templates: prd, decision-record, weekly-summary, stakeholder-update, rice-scorecard"

## Context Assembly

Read the template file from `.orbit/templates/<name>.md`

If the template file doesn't exist in `.orbit/templates/`, check if a default template is available from the Orbit installation. If not found:
"Template file not found at .orbit/templates/[name].md. Run /orbit-init to restore default templates."

Then gather context:

**If `--theme` specified:**
1. Read all notes in `.orbit/themes/<theme>/` (or notes tagged with this theme)
2. Read `.orbit/themes/<theme>/action-items.md`
3. Read decisions from `.orbit/decisions/log.md` filtered to this theme
4. Read any existing artifacts in `.orbit/themes/<theme>/artifacts/` for consistency

**If no theme:**
1. Read notes across all themes (`.orbit/notes/`)
2. Read `.orbit/action-items/pending.md`
3. Read `.orbit/decisions/log.md` — full log
4. Read `.orbit/artifacts/` for consistency

## Versioning Check

Before generating, determine the output path:

- With theme: `.orbit/themes/<theme>/artifacts/<template>.md`
- Without theme: `.orbit/artifacts/<template>.md`

If the file already exists at that path:
- Increment version: check for `<template>-v2.md`, `<template>-v3.md`, etc.
- Use the next available version number
- Output path becomes: `<template>-v2.md` (or v3, v4, etc.)

## Document Generation

Using the Artifact Generation process:

1. Read the template structure and follow it exactly — do not change section order or headings
2. Fill every section with real data from the gathered context
3. Never use "[TBD]" or placeholder text — if data is missing, note the gap explicitly: "[Data not available — check with [stakeholder] or run /orbit-ingest to add more notes]"
4. Match the language of the majority of notes
5. Include document metadata at the top:
   - Title, date, version (v1/v2/etc.), theme (if specified), source notes used
6. For version updates (v2, v3): note what changed vs the previous version

## Template-Specific Guidance

**prd**: Include problem statement, user stories, acceptance criteria, out-of-scope, risks. Pull from notes that discuss user pain points, feature requests, and technical constraints.

**decision-record**: Include context, decision, rationale, alternatives considered, consequences. Pull from decisions/log.md and the source notes for each decision.

**weekly-summary**: Theme-by-theme progress, decision velocity, action item burndown. Pull from all notes in the last 7 days.

**stakeholder-update**: Executive summary, key wins, risks/blockers, asks. Keep concise — stakeholders skim. Pull from high-priority action items and confirmed decisions.

**rice-scorecard**: Run full RICE analysis if no existing scorecard is current. Or format the most recent `.orbit/artifacts/rice-scorecard-*.md` into the document template.

## Write Output

Write the generated document to the determined output path.

## Completion Message

After writing the file:

```
Payload delivered: [Template] — [Title]

  [output path]
  Sources: N signals, N missions, N coordinates

  Review and refine. Run /orbit-artifact [template] --theme [theme]
  again to generate v2 with updates.
```

Adapt the message to the actual template and context used.

Suggest next step based on template:
- prd → "Share with stakeholders. Run /orbit-artifact stakeholder-update to generate an accompanying update."
- decision-record → "Add this to your next stakeholder sync. Run /orbit-prep for the discussion."
- weekly-summary → "Run /orbit-brief for today's mission briefing."
- stakeholder-update → "Review with your manager before sending."
- rice-scorecard → "Run /orbit-priorities to see the interactive analysis."

## Error Handling

- If `.orbit/` does not exist: "Run /orbit-init first to set up your workspace."
- If no notes exist: "No notes found. Run /orbit-ingest to bring in meeting notes before generating artifacts."
- If theme specified but not found: "Theme '[name]' not found in .orbit/themes/. Run /orbit-status to see active themes."
- If template has no data to fill (empty workspace): generate the document structure with explicit gap notes and warn: "Limited data available — N sections could not be filled from current notes."
