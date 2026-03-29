# Roadmap: Orbit

## Overview

Orbit ships as four natural delivery boundaries. Phase 1 lays the workspace foundation — install script, CLAUDE.md, and the orbit-init/orbit-status skills. Phase 2 wires up the ingestion pipeline and the two agents (Astro and Engin) so notes arrive, get organized automatically, and Engin can answer questions from day one. Phase 3 adds the full intelligence layer: briefs, prioritization, decision tracking, meeting prep, and artifact generation. Phase 4 completes the distribution package with a polished README that makes the plugin self-explaining on GitHub.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Install script, CLAUDE.md, orbit-init, and orbit-status stand up a working workspace
- [ ] **Phase 2: Ingestion + Agents** - Notes flow in from all sources, Astro auto-organizes them, Engin answers questions
- [ ] **Phase 3: Intelligence Skills** - Briefs, prioritization, decision tracking, meeting prep, and artifact generation
- [ ] **Phase 4: Documentation** - README makes Orbit self-explaining and publishable on GitHub

## Phase Details

### Phase 1: Foundation
**Goal**: A PM can install Orbit in one command and end up with a configured workspace they can inspect
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06
**Success Criteria** (what must be TRUE):
  1. Running `bash install.sh` copies all skills, agents, and settings into the user's project with no additional steps
  2. CLAUDE.md exists at repo root and Claude Code loads project-level instructions automatically on session start
  3. Running `/orbit-init` asks for name, role, company, projects, goals, and stakeholders, then writes `config.md` and creates the full `.orbit/` directory tree
  4. Running `/orbit-init` reports which MCP servers (Granola, Atlassian, Slack) are available in the current environment
  5. Running `/orbit-status` displays a formatted overview showing notes count, themes, pending actions, decisions, artifacts, and last brief date
**Plans**: 6 plans

Plans:
- [ ] 01-01-PLAN.md — Repo scaffold: CLAUDE.md, LICENSE, README placeholder, settings.json with PostToolUse hook
- [ ] 01-02-PLAN.md — Agent definitions: astro.md and engin.md with full system prompts
- [ ] 01-03-PLAN.md — Artifact templates: 5 PM document templates (prd, decision-record, weekly-summary, stakeholder-update, rice-scorecard)
- [ ] 01-04-PLAN.md — Core skills: orbit-init (workspace setup) and orbit-status (workspace overview)
- [ ] 01-05-PLAN.md — Remaining skills: orbit-ingest, orbit-brief, orbit-priorities, orbit-decisions, orbit-prep, orbit-artifact
- [ ] 01-06-PLAN.md — install.sh: one-command installer with idempotent merge and smoke test

### Phase 2: Ingestion + Agents
**Goal**: Notes arrive from any source, get automatically organized into themes with action items and decisions extracted, and Engin can answer PM questions from that context
**Depends on**: Phase 1
**Requirements**: INGS-01, INGS-02, INGS-03, INGS-04, INGS-05, INGS-06, INGS-07, ASTR-01, ASTR-02, ASTR-03, ASTR-04, ASTR-05, ASTR-06, ASTR-07, ASTR-08, ENGN-01, ENGN-02, ENGN-03, ENGN-04, BRND-01, BRND-02, BRND-03, BRND-04
**Success Criteria** (what must be TRUE):
  1. Running `/orbit-ingest` presents source options based on detected MCPs and guides the user through each path (Granola, file, paste, Jira, Slack) to a structured note in `.orbit/notes/`
  2. Every note written to `.orbit/notes/` has valid YAML frontmatter (title, date, source, participants, themes, decisions, questions, action_items) plus a markdown body
  3. After a note is written, the hook in `settings.json` auto-triggers Astro — no manual step needed — and Astro assigns themes, extracts action items to `.orbit/themes/<theme>/action-items.md`, logs decisions to `.orbit/decisions/log.md`, and rebuilds `.orbit/index.md`
  4. Astro messages use navigator voice ("Signal scan complete. 4 signals → 3 constellations.") and `/orbit-status` uses spatial formatting (◉, ★, missions)
  5. Asking Engin a question returns an answer with cited sources (meeting title + date), distinguishes decisions from discussions, and Engin's memory persists context across sessions
**Plans**: TBD

### Phase 3: Intelligence Skills
**Goal**: A PM can generate daily/weekly briefs, score features with RICE against real meeting evidence, audit decisions for contradictions and staleness, prepare for meetings with full context, and produce PM artifacts from templates
**Depends on**: Phase 2
**Requirements**: BREF-01, BREF-02, BREF-03, PRIO-01, PRIO-02, PRIO-03, PRIO-04, DCSN-01, DCSN-02, DCSN-03, DCSN-04, PREP-01, PREP-02, PREP-03, PREP-04, ARTF-01, ARTF-02, ARTF-03, ARTF-04
**Success Criteria** (what must be TRUE):
  1. Running `/orbit-brief` produces a daily briefing (overdue items first, then theme updates, pending actions, open questions) written to `.orbit/briefs/YYYY-MM-DD.md` and displayed in conversation; `weekly` flag generates a weekly summary
  2. Running `/orbit-priorities` produces a ranked RICE scorecard at `.orbit/artifacts/rice-scorecard-YYYY-MM-DD.md` with evidence citations from meetings, and challenges the PM when data contradicts their ratings
  3. Running `/orbit-decisions` flags stalled decisions (confirmed but no follow-on actions within 7 days), contradictions across meetings, and suggests resolution actions
  4. Running `/orbit-prep <topic>` gathers relevant context, generates agenda, talking points, and risk areas, optionally writing to `.orbit/briefs/prep-YYYY-MM-DD-topic.md`
  5. Running `/orbit-artifact <template>` generates a document from one of 5 built-in templates (PRD, Decision Record, Weekly Summary, Stakeholder Update, RICE Scorecard), handles versioning (-v2, -v3), and every skill completion message suggests the logical next step
**Plans**: TBD

### Phase 4: Documentation
**Goal**: The README makes Orbit self-explaining to a technical PM landing on the GitHub repo — they know what it does, how to install it, how to use every skill, and what to ask Engin, without reading any other file
**Depends on**: Phase 3
**Requirements**: DOCS-01, DOCS-02, DOCS-03
**Success Criteria** (what must be TRUE):
  1. README contains install instructions that a technical PM can follow from zero to working Orbit in under 5 minutes, including the Granola MCP setup
  2. README shows a real usage example for each of the 8 skills (`/orbit-init`, `/orbit-ingest`, `/orbit-status`, `/orbit-brief`, `/orbit-priorities`, `/orbit-decisions`, `/orbit-prep`, `/orbit-artifact`)
  3. README documents Engin's 7 capabilities with an example query for each, so a PM knows exactly what to ask without guessing
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 4/6 | In Progress|  |
| 2. Ingestion + Agents | 0/TBD | Not started | - |
| 3. Intelligence Skills | 0/TBD | Not started | - |
| 4. Documentation | 0/TBD | Not started | - |
