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

## Step 1 — Ask One Freeform Question

Ask the user ONE question covering all the context you need. Do not ask multiple separate questions. Use this exact phrasing:

> "To set up your Orbit workspace, I need a bit of context. Tell me: What's your name and role? What company are you at and what projects are you working on? What are your main goals this quarter? Who are your key stakeholders?"

Wait for the user's response before continuing.

**Language detection:** Detect the language of the user's response. If they respond in Spanish, conduct all subsequent messages in Spanish (except YAML field names and file content structure, which stay in English). Apply this to any language — the workspace should feel native to the user.

---

## Step 2 — Write config.md

Parse the user's response and extract: name, role, company, projects, goals, and key stakeholders.

Write `.orbit/config.md` with this exact structure:

```
---
name: [extracted name]
role: [extracted role]
company: [extracted company]
projects: [Project 1, Project 2, Project 3]
max_themes: 5
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

## Step 3 — Create .orbit/ Directory Structure

Create all the required files and directories using the Write tool. This builds the full workspace tree.

**Create `.orbit/action-items/pending.md`:**

```
# Pending Action Items

| Task | Owner | Due | Theme | Status |
|------|-------|-----|-------|--------|
```

**Create `.orbit/decisions/log.md`:**

```
# Decision Log

| Date | Decision | Source | Theme | Status |
|------|----------|--------|-------|--------|
```

**Create `.orbit/index.md`** (use today's actual date):

```
# Orbit Knowledge Index

**Last updated:** YYYY-MM-DD
**Notes:** 0 total
**Active themes:** none yet
**Pending action items:** 0
**Tracked decisions:** 0

*Run /orbit-ingest to bring in your first notes. Astro will build this index.*
```

**Create placeholder files to establish directories:**
- `.orbit/themes/_suggested/.gitkeep` (empty file)
- `.orbit/briefs/.gitkeep` (empty file)
- `.orbit/artifacts/.gitkeep` (empty file)

These empty files create the required directory structure for orbit-status to work correctly.

---

## Step 4 — Copy Templates

Copy the 5 built-in templates from `./templates/` to `.orbit/templates/`. Read each source file and write it to the destination:

- `./templates/prd.md` → `.orbit/templates/prd.md`
- `./templates/decision-record.md` → `.orbit/templates/decision-record.md`
- `./templates/weekly-summary.md` → `.orbit/templates/weekly-summary.md`
- `./templates/stakeholder-update.md` → `.orbit/templates/stakeholder-update.md`
- `./templates/rice-scorecard.md` → `.orbit/templates/rice-scorecard.md`

If `./templates/` is not found in the current directory, check the parent directory. The templates are installed by install.sh alongside the skills.

---

## Step 5 — Write Sample Note

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

Output the completion message, adapting the Detected line based on your MCP detection results:

When MCPs are detected:

```
◉ Orbit station online.

  Workspace: .orbit/
  Config:    .orbit/config.md
  Blueprints: 5 templates loaded

  Detected: Granola MCP, Slack MCP

  Next: /orbit-ingest to capture your first signals.
```

When no MCPs are detected:

```
◉ Orbit station online.

  Workspace: .orbit/
  Config:    .orbit/config.md
  Blueprints: 5 templates loaded

  Detected: No MCPs detected — use /orbit-ingest to import from files or paste

  Next: Run /orbit-ingest and choose 'file' or 'paste' to import your first notes.
```

---

## Implementation Notes

- The `config.md already exists` check guards against accidental re-initialization and data loss
- `themes: []` in the sample note is intentional — Astro reads this to know the note needs organizing
- Do not use spatial language in error messages or file content — spatial terms belong in terminal output messages only
- If the user's response is very minimal, ask a targeted follow-up before writing config.md
- All date fields in the sample note must use real calculated dates, not placeholder text
