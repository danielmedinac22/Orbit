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

**Question 1:**
```
¿De cuántos días quieres que importe? (default: 7)
```
(EN: "How many days back should I import? (default: 7)")

**After Question 1 — Fetch meeting count:** Immediately call `mcp__granola__list_meetings` (or equivalent) for the specified date range. Count the results before asking Question 2.

**Question 2 (data-driven recommendation):**

Based on the actual meeting count N found:

**If N ≤ 5 meetings — Spanish:**
```
Encontré N reuniones en los últimos X días.

¿Quieres importar solo las notas, o notas + transcripciones completas?

📊 Mi recomendación para N reuniones:
   notas + transcripciones — son pocas reuniones, vale la pena el contexto extra
```

**If N is 6-15 meetings — Spanish:**
```
Encontré N reuniones en los últimos X días.

¿Quieres importar solo las notas, o notas + transcripciones completas?

📊 Mi recomendación para N reuniones:
   solo notas — con N reuniones, las transcripciones llenarían el contexto rápidamente
```

**If N > 15 meetings — Spanish:**
```
Encontré N reuniones en los últimos X días. Son bastantes.

¿Quieres importar solo las notas, o notas + transcripciones completas?

📊 Mi recomendación para N reuniones:
   solo notas — y te sugiero empezar con las últimas 10 para no saturar el contexto

¿Importo todas las N, o empezamos con las últimas 10?
```

**English versions follow the same structure:**
- ≤5: "notes + transcriptions — few enough meetings to get full context"
- 6-15: "notes only — with N meetings, transcriptions would fill context quickly"
- >15: "notes only — and I'd suggest starting with the most recent 10" + offer to limit

If the user chooses to limit (>15 case), process only the most recent 10 (sorted by date descending).

Apply the notes-only or notes+transcriptions preference (see Token Optimization section below).

#### If Granola (not connected, but user selected it):

Ask directly (in user's language):

**Spanish:**
```
Granola no está conectado todavía. ¿Quieres que lo conecte automáticamente?
```

**English:**
```
Granola isn't connected yet. Want me to set it up automatically?
```

If the user says yes:
1. Run via Bash: `claude mcp add --transport http --scope user granola "https://mcp.granola.ai/mcp"`
2. Output:
   ```
   ✓ Granola MCP configurado. Reinicia Claude Code y ejecuta /orbit-ingest de nuevo.
   ```
   (EN: "✓ Granola MCP configured. Restart Claude Code and run /orbit-ingest again.")
3. Stop here — the user needs to restart before Granola tools are available.

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

## Delegation to Astro

After gathering all import parameters and fetching content from the source (Granola MCP calls, file reads, or paste content), delegate the entire note-writing and organization process to the **Astro agent**.

### What to pass to Astro

Delegate to the Astro agent with a structured prompt containing:

```
Import and organize notes with these parameters:

Source: [granola | file | paste | jira | slack]
Mode: [notes-only | notes+transcriptions] (if Granola)
Meeting count: N
Date range: last X days

Content:
[Include ALL fetched content here — for Granola: the meeting notes/transcripts
retrieved via MCP; for files: the file contents read; for paste: the pasted text]
```

**Important:** You MUST include the actual fetched content in the delegation prompt. Astro cannot call Granola MCP tools directly — the main session fetches the content, then passes it to Astro for processing.

### What Astro will do

Astro handles everything from here: applying token optimization, writing structured notes to `.orbit/notes/`, assigning themes, extracting action items, logging decisions, rebuilding the index, updating `last_ingest` in config.md, writing `ORBIT-STATUS.md`, and reporting completion.

### After delegation

After Astro completes, output:
```
Next: /orbit-brief for today's mission briefing.
```

## Error Handling

- If `.orbit/` does not exist: "Run /orbit-init first to set up your workspace."
- If Granola MCP is not available and `--granola` was specified: "Granola not detected. Try /orbit-ingest with a file path or paste instead."
- If file path not found: "File not found: [path]. Check the path and try again."
- If no content provided for paste: ask again — "Paste your content when ready."
