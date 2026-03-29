---
name: orbit-ingest
description: >
  Import notes into the Orbit workspace. MCP-first: detects Granola, Jira,
  Slack and offers them as sources. Fallback to file or paste.
argument-hint: "[file-path | --granola | --jira | --slack]"
---

Import notes into the Orbit workspace. Detects available MCP integrations and offers them as sources. Falls back to file or paste when no MCPs are available.

## MCP Detection

Before offering source options, check which tools are available:

- If tools matching "granola" or "mcp__*granola*" exist → Granola is available
- If tools matching "mcp__claude_ai_Atlassian__*" exist → Jira/Confluence is available
- If tools matching "mcp__claude_ai_Slack__*" exist → Slack is available

Only offer sources that are actually available. Always offer File and Paste.

## Guided Mode (no arguments)

When invoked as `/orbit-ingest` with no arguments:

Ask: "Where do you want to bring notes from?" and list only available sources.

Example response when Granola and Slack are detected:
```
Where do you want to bring notes from?

1. Granola (detected) — import from your recent meetings
2. Slack (detected) — import from a channel or thread
3. File — provide a file path
4. Paste — paste content directly
```

## Direct Mode (with arguments)

Handle these argument patterns:

- `/orbit-ingest meeting.txt` → reads file, generates structured note
- `/orbit-ingest --granola` → asks for date range, then fetches
- `/orbit-ingest --granola 5` → fetches last 5 days directly
- `/orbit-ingest --jira PROJECT-123` → fetches Jira issue context
- `/orbit-ingest --slack #product` → fetches Slack channel digest

## Source Flows

### Granola

1. Ask: "How many days back? (default: 7)" (skip if days provided in argument)
2. Call Granola MCP tools to fetch meetings for that date range
3. For each meeting, shape data into Orbit note format and write to `.orbit/notes/YYYY-MM-DD-title.md`
4. Granola notes come pre-structured — use data as-is, do not re-extract action items already present

### Jira

1. Ask: "What project or JQL filter?" (skip if provided in argument)
2. Call Atlassian MCP tools to fetch issues and recent comments
3. Write relevant discussions as structured notes to `.orbit/notes/YYYY-MM-DD-jira-title.md`
4. Include issue key, summary, description, and recent comment threads

### Slack

1. Ask: "Which channel or thread?" (skip if provided in argument)
2. Call Slack MCP tools to fetch the channel digest or thread
3. Write the conversation as a note to `.orbit/notes/YYYY-MM-DD-slack-channel.md`
4. Capture key decisions, questions, and action items from the thread

### File

1. Read the provided file path
2. Use the Note Creation Prompt (below) to generate a structured note from the raw content
3. Write to `.orbit/notes/YYYY-MM-DD-title.md`

### Paste

1. Ask: "Paste your meeting notes or transcript."
2. Wait for user to paste content
3. Use the Note Creation Prompt (below) to generate a structured note
4. Write to `.orbit/notes/YYYY-MM-DD-title.md`

## Note Creation Prompt (File and Paste paths)

When processing raw content from file or paste, generate a structured note:

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

Adapt message to the actual source (e.g., "4 notes captured from file" or "1 note captured from paste").

## Error Handling

- If `.orbit/` does not exist: "Run /orbit-init first to set up your workspace."
- If Granola MCP is not available and `--granola` was specified: "Granola not detected. Try /orbit-ingest with a file path or paste instead."
- If file path not found: "File not found: [path]. Check the path and try again."
- If no content provided for paste: ask again — "Paste your content when ready."
