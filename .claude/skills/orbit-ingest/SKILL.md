---
name: orbit-ingest
description: >
  Import notes into the Orbit workspace. MCP-first: detects Granola, Jira,
  Slack and offers them as sources. Fallback to file or paste.
argument-hint: "[file-path | --granola | --jira | --slack]"
---

Import notes into the Orbit workspace. Detects available MCP integrations and guides the user through the best import path. Falls back to file or paste when no MCPs are available.

## Prerequisites

Before anything, check if `.orbit/config.md` exists. If not: "Run /orbit-init first to set up your workspace."

## MCP Detection

Before offering source options, check which tools are available:

- If tools matching "granola" or "mcp__*granola*" exist → Granola is available
- If tools matching "mcp__claude_ai_Atlassian__*" exist → Jira/Confluence is available
- If tools matching "mcp__claude_ai_Slack__*" exist → Slack is available

## Direct Mode (with arguments)

Handle these argument patterns without the guided flow:

- `/orbit-ingest meeting.txt` → reads file, generates structured note
- `/orbit-ingest --granola` → asks for date range, then fetches
- `/orbit-ingest --granola 5` → fetches last 5 days directly
- `/orbit-ingest --jira PROJECT-123` → fetches Jira issue context
- `/orbit-ingest --slack #product` → fetches Slack channel digest

## Guided Mode (no arguments)

When invoked as `/orbit-ingest` with no arguments, run a guided import flow.

### Step 1 — Identify note source

Ask (in the user's language from config.md):

**Spanish:**
```
¿Qué herramienta usas para capturar tus reuniones?

1. Granola [detected ✓ / no detectado — puedo ayudarte a conectarlo]
2. Tengo archivos de notas o transcripciones en una carpeta
3. Voy a pegar el contenido manualmente
```

**English:**
```
What do you use to capture your meetings?

1. Granola [detected ✓ / not connected — I can help you set it up]
2. I have note or transcript files in a folder
3. I'll paste the content manually
```

Only show Jira/Slack options if their MCPs are detected. Add them as options 2/3 and shift others down:
- "Jira (detected ✓) — import from issues and comments"
- "Slack (detected ✓) — import from a channel or thread"

### Step 2 — Branch by selection

#### If Granola (detected):

Ask two questions sequentially:

**Question 1:**
```
¿De cuántos días quieres que importe? (default: 7)
```
(EN: "How many days back should I import? (default: 7)")

**Question 2:**
```
¿Quieres importar solo las notas, o notas + transcripciones completas?

📊 Recomendación:
- Si tienes muchas reuniones (5+/semana): solo notas — más rápido y enfocado
- Si tienes pocas reuniones: notas + transcripciones — contexto más rico

Las transcripciones completas llenan el contexto más rápido pero dan
información más detallada para análisis.
```

(EN version:)
```
Do you want notes only, or notes + full transcriptions?

📊 Recommendation:
- If you have many meetings (5+/week): notes only — faster and more focused
- If you have fewer meetings: notes + transcriptions — richer context

Full transcriptions fill context faster but give more detailed information
for analysis.
```

Then call Granola MCP tools to fetch meetings for that date range. Apply the notes-only or notes+transcriptions preference (see Token Optimization section below).

#### If Granola (not connected, but user selected it):

Guide MCP setup:

```
Para conectar Granola necesitas configurar su MCP server en Claude Code.

1. Abre la configuración de Claude Code (settings)
2. Agrega el MCP server de Granola — puedes encontrar las instrucciones
   en la documentación de Granola o en su app de escritorio
3. Reinicia Claude Code para que detecte el nuevo MCP

¿Quieres que te ayude con la configuración paso a paso?
```

(EN: "To connect Granola you need to configure its MCP server in Claude Code...")

If the user says yes, walk them through the setup. After setup, suggest they restart Claude Code and run `/orbit-ingest` again.

If the user says no or wants to skip: fall through to the folder option.

#### If Jira (detected):

1. Ask: "What project or JQL filter?" (skip if provided in argument)
2. Call Atlassian MCP tools to fetch issues and recent comments
3. Write relevant discussions as structured notes to `.orbit/notes/YYYY-MM-DD-jira-title.md`
4. Include issue key, summary, description, and recent comment threads

#### If Slack (detected):

1. Ask: "Which channel or thread?" (skip if provided in argument)
2. Call Slack MCP tools to fetch the channel digest or thread
3. Write the conversation as a note to `.orbit/notes/YYYY-MM-DD-slack-channel.md`
4. Capture key decisions, questions, and action items from the thread

#### If folder of files:

```
¿En qué carpeta están tus notas o transcripciones?
```
(EN: "What's the path to your notes or transcript files?")

After receiving the path:
1. Use Glob to scan for `.md`, `.txt`, `.doc`, `.docx` files in that path
2. Show the user what was found:
   ```
   Encontré N archivos en [path]:
   - meeting-2026-03-28.md
   - standup-notes.txt
   - ...

   ¿Importo todos, o quieres seleccionar algunos?
   ```
3. Process each selected file through the Note Creation Prompt
4. Write each to `.orbit/notes/YYYY-MM-DD-title.md`

#### If paste (last resort):

1. Ask: "Paste your meeting notes or transcript."
2. Wait for user to paste content
3. Use the Note Creation Prompt to generate a structured note
4. Write to `.orbit/notes/YYYY-MM-DD-title.md`

---

## Token Optimization

Before processing raw content through the Note Creation Prompt, apply these optimizations:

### Pre-existing Summary Detection

1. Scan the input content for headings like "## Summary", "## Resumen", "## Key Takeaways", "## TL;DR", "## Meeting Summary", "## Notas", "## Notes"
2. If a summary section exists AND the full content exceeds approximately 3000 words:
   - Extract the existing summary section
   - Extract any clearly structured sections (decisions, action items, questions, participants)
   - Use these pre-extracted sections as the basis for the Orbit note
   - Do NOT re-process the full transcript/content through the Note Creation Prompt
   - Instead, use this abbreviated approach: structure the pre-extracted content into Orbit note format, preserving the existing summary verbatim
   - Only scan the remaining content for action items, decisions, or questions that the summary might have missed

### Granola Notes + Transcriptions Mode

When the user chose "notes + transcriptions" in the guided flow:
- If a Granola meeting provides both structured notes/summary AND a full transcript:
  - Use the structured notes as the primary basis for the Orbit note
  - Reference the transcript only for: exact participant names, verbatim quotes, and specific details not covered in the summary
  - Do NOT dump the full transcript into the note body
  - The note body should be concise — the transcript is source material, not output

### Large Content Without Summary

If content exceeds approximately 5000 words and has NO existing summary:
- First scan for: decisions, action items, questions, and participant names
- Then generate the summary and key points
- This two-pass approach prevents losing important details in very long transcripts

---

## Note Creation Prompt (File and Paste paths)

When processing raw content from file or paste (that hasn't been short-circuited by Token Optimization above), generate a structured note:

Read `.orbit/config.md` for the user's profile and context.

Write the note to `.orbit/notes/YYYY-MM-DD-title.md` with this structure:

```
---
title: [descriptive title]
date: YYYY-MM-DD
source: file | paste
participants: [names mentioned]
themes: []
decisions:
  - [any decisions made or confirmed]
questions:
  - [unresolved questions raised]
action_items:
  - text: [task]
    owner: [person or "unassigned"]
    due: [date if mentioned]
    status: pending
---

## Summary
[2-3 sentence overview — scannable in 15 seconds]

## Key Points
[Bullet points of the most important items]

## Discussion Details
[Longer form content preserving important context, organized by topic]
```

Rules:
- Same language as the content
- Extract real data only — never invent
- `themes: []` stays empty — Astro fills it in after ingestion
- Preserve important quotes verbatim
- If no clear owner for an action item, use "unassigned"

## Note Format (all sources)

All notes, regardless of source, use this frontmatter:

```yaml
---
title: [descriptive title]
date: YYYY-MM-DD
source: granola | jira | slack | file | paste
participants: [names from the meeting/thread]
themes: []
decisions:
  - [decisions confirmed]
questions:
  - [unresolved questions]
action_items:
  - text: [task description]
    owner: [person or "unassigned"]
    due: [date if mentioned]
    status: pending
---
```

The `themes: []` field always starts empty. After writing the note, the PostToolUse hook in `.claude/settings.json` triggers Astro to read the new note, assign themes, extract action items, log decisions, and update the index.

## After Ingestion

After writing all notes, report completion using this format:

```
Signal scan complete — N meetings captured from [source] (last X days).

  .orbit/notes/2026-03-28-standup.md
  .orbit/notes/2026-03-27-sprint-review.md
  [list each note written]

Astro is organizing... ✓ [themes], [missions], [coordinates] logged.

Next: /orbit-brief for today's mission briefing.
```

If token optimization was applied, add:
```
  📊 Optimization: M notes had existing summaries — used them directly.
```

Adapt message to the actual source (e.g., "4 notes captured from file" or "1 note captured from paste").

## Error Handling

- If `.orbit/` does not exist: "Run /orbit-init first to set up your workspace."
- If Granola MCP is not available and `--granola` was specified: "Granola not detected. Try /orbit-ingest with a file path or paste instead."
- If file path not found: "File not found: [path]. Check the path and try again."
- If no content provided for paste: ask again — "Paste your content when ready."
