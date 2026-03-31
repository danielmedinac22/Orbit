---
name: orbit-init
description: Initialize the Orbit PM workspace. Creates .orbit/ directory and user profile.
argument-hint: "[--sample to include example data]"
---

You are setting up an Orbit PM workspace. Follow these steps in order.

---

## Step 0 — Idempotency Check

Before doing anything, check if `.orbit/config.md` already exists using the Read tool.

If it exists, ask the user:
> "An Orbit workspace already exists at `.orbit/config.md`. Re-initialize? This will ask for your context again but will NOT delete existing notes. [y/N]"

If the user says no (or anything other than "y" or "yes"), stop here and do not continue.

If `.orbit/config.md` does not exist, continue to Step 1.

---

## Step 1 — Welcome + Context Question

Display this welcome message, then ask for context. Output this exactly (adapt language if needed — see language detection below):

```
◉ Bienvenido a Orbit — tu Copiloto de Contexto.

Voy a ser tu segunda memoria para reuniones, decisiones y tareas pendientes.
Capturo señales de tus meetings, las organizo en temas, y te doy briefings
para que nada se te escape.

💡 Pro tip: Si usas herramientas como Wispr Flow o Granola para transcribir,
Orbit funciona mejor entre más detalle tengan tus notas.

Para armar tu workspace, cuéntame:
- ¿Cuál es tu nombre y rol?
- ¿En qué empresa y proyectos trabajas?
- ¿Cuáles son tus objetivos principales este trimestre?
- ¿Quiénes son tus stakeholders clave?
```

Wait for the user's response before continuing.

**Language detection:** Detect the language of the user's response. If they respond in English, switch all subsequent messages to English. If they respond in Spanish or any other language, conduct all subsequent messages in that language. YAML field names and file structure always stay in English.

**English version of the welcome (use if prior conversation context indicates the user communicates in English):**

```
◉ Welcome to Orbit — your Context Copilot.

I'll be your second brain for meetings, decisions, and action items.
I capture signals from your meetings, organize them into themes, and give you
briefings so nothing falls through the cracks.

💡 Pro tip: If you use tools like Wispr Flow or Granola for transcription,
Orbit works best when your notes have maximum detail.

To set up your workspace, tell me:
- What's your name and role?
- What company are you at, and what are you working on?
- What are your main goals this quarter?
- Who are your key stakeholders?
```

---

## Step 2 — Warm Acknowledgment + Write config.md

After the user responds, first output a warm acknowledgment using their name:

- Spanish: `¡Listo, [Name]! Vamos a armar tu estación de trabajo.`
- English: `Got it, [Name]! Let's build your workspace.`

Then parse the user's response and extract: name, role, company, projects, goals, and key stakeholders.

Write `.orbit/config.md` with this exact structure:

```
---
name: [extracted name]
role: [extracted role]
company: [extracted company]
projects: [Project 1, Project 2, Project 3]
language: auto
brief_style: concise
---

## Goals
- [extracted goal 1]
- [extracted goal 2]

## Key Stakeholders
- [Name] — [Role]
- [Name] — [Role]
```

Use YAML array syntax for `projects`. If the user lists multiple projects, include all of them.

---

## Step 3 — Create .orbit/ Directory Structure (with context)

Create all required files using the Write tool. **As you create each file, output a brief explanation of what it does** so the user understands their workspace.

**Create `.orbit/action-items/pending.md`** and output:
> "Creando tu tracker de tareas — yo me encargo de traer las tareas de tus reuniones aquí. No necesitas revisarlo manualmente."
> (EN: "Creating your task tracker — I'll pull action items from your meetings automatically. You won't need to check this manually.")

```
# Pending Action Items

| Task | Owner | Due | Theme | Status |
|------|-------|-----|-------|--------|
```

**Create `.orbit/decisions/log.md`** and output:
> "Creando tu log de decisiones — cada decisión de tus meetings queda registrada con su fuente. Te aviso si hay contradicciones."
> (EN: "Creating your decision log — every decision from your meetings gets tracked with its source. I'll flag contradictions automatically.")

```
# Decision Log

| Date | Decision | Source | Theme | Status |
|------|----------|--------|-------|--------|
```

**Create `.orbit/index.md`** (use today's actual date) and output:
> "Creando tu índice de conocimiento — Astro lo reconstruye cada vez que llegan notas nuevas."
> (EN: "Creating your knowledge index — Astro rebuilds it every time new notes come in.")

```
# Orbit Knowledge Index

**Last updated:** YYYY-MM-DD
**Notes:** 0 total
**Active themes:** none yet
**Pending action items:** 0
**Tracked decisions:** 0

*Run /orbit-ingest to bring in your first notes. Astro will build this index.*
```

**Create placeholder files** and output:
> "Preparando el resto del workspace — themes/, briefs/ y artifacts/ se llenan conforme uses Orbit."
> (EN: "Preparing the rest of your workspace — themes/, briefs/ and artifacts/ fill up as you use Orbit.")

- `.orbit/themes/_suggested/.gitkeep` (empty file)
- `.orbit/briefs/.gitkeep` (empty file)
- `.orbit/artifacts/.gitkeep` (empty file)

**Important:** Output the explanation message BEFORE or AS you create each file, not batched at the end. Use only the language detected in Step 1 (don't show both languages).

---

## Step 4 — Verify Templates

Check if `.orbit/templates/` exists and contains `.md` files using Glob.

- If templates exist: continue silently (no output needed).
- If templates are missing: read from `./templates/` and copy them to `.orbit/templates/` as a fallback. If `./templates/` is not found, check the parent directory.

---

## Step 5 — Write Sample Note

Output: "Escribiendo una nota de ejemplo para que veas Orbit en acción..." (EN: "Writing a sample note so you can see Orbit in action...")

Write a realistic PM meeting note to `.orbit/notes/`. Use yesterday's date for the filename.

**Filename format:** `YYYY-MM-DD-sprint-review.md` (use yesterday's actual date)

The note MUST use this exact frontmatter structure:

```
---
title: Sprint Review — API v2 Migration
date: [yesterday's actual date in YYYY-MM-DD]
source: manual
participants: [Alex, Jordan, Sam]
themes: []
decisions:
  - Adopt REST over GraphQL for the v2 API to reduce client complexity
  - Delay mobile app launch to Q2 to align with API completion
questions:
  - Who owns the data migration from the legacy system?
  - Can we get an external security vendor for the audit?
action_items:
  - text: Draft REST API migration plan with timeline
    owner: Alex
    due: [today's date + 7 days]
    status: pending
  - text: Schedule security audit kickoff
    owner: Jordan
    due: [today's date + 5 days]
    status: pending
  - text: Update mobile app roadmap for Q2 target
    owner: Sam
    due: [today's date + 10 days]
    status: pending
---
```

**Critical: `themes: []` must be empty.** Astro fills this during organization. Never pre-populate themes in notes.

Follow the frontmatter with this body:

```
## Summary

Sprint review covering API v2 progress, mobile app timeline, and upcoming security requirements. Team aligned on REST-first approach and Q2 mobile target.

## Key Points

- REST migration is 60% complete and unblocking the mobile app
- Mobile app pushed to Q2 due to API dependency — design team notified
- Security audit is a hard launch requirement; no vendor selected yet

## Discussion Details

Alex opened with the API migration update. The team confirmed REST over GraphQL after last week's spike — the reduction in client complexity outweighs the migration cost. Jordan flagged the security audit as a launch blocker that needs immediate action. Sam proposed adjusting the mobile roadmap and will communicate the Q2 target to stakeholders.
```

---

## Step 6 — Detect Available MCP Tools

Check which MCP tools are available in this Claude Code session:

- If you have access to tools with names containing "granola" or matching "mcp__*granola*" → Granola is available
- If you have access to tools with names matching "mcp__claude_ai_Atlassian__*" → Jira/Confluence is available
- If you have access to tools with names matching "mcp__claude_ai_Slack__*" → Slack is available

Build the detected MCPs list based on what is actually available to you right now.

---

## Step 7 — Report Completion

Output the completion message in the detected language:

**Spanish:**
```
◉ Orbit está listo.

  Workspace:  .orbit/
  Config:     .orbit/config.md
  Templates:  5 blueprints listos
  Ejemplo:    1 nota de muestra cargada

  Detected: [MCP list, or "Sin MCPs — usa /orbit-ingest con archivos o paste"]

  ¿Siguiente paso? /orbit-ingest para traer tus reuniones reales.
```

**English:**
```
◉ Orbit is ready.

  Workspace:  .orbit/
  Config:     .orbit/config.md
  Templates:  5 blueprints ready
  Sample:     1 example note loaded

  Detected: [MCP list, or "No MCPs — use /orbit-ingest with files or paste"]

  Next up? /orbit-ingest to bring in your real meetings.
```

---

## Implementation Notes

- The `config.md already exists` check guards against accidental re-initialization and data loss
- `themes: []` in the sample note is intentional — Astro reads this to know the note needs organizing
- If the user's response is very minimal, ask a targeted follow-up before writing config.md
- All date fields in the sample note must use real calculated dates, not placeholder text
