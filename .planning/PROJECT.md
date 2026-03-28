# Orbit

## What This Is

Orbit is an open-source Claude Code plugin that turns a Product Manager's terminal into a 100x productivity system. It ships as a set of skills, agents, and templates — no code, no infrastructure — that organize meeting notes by themes, track decisions, prioritize with RICE scoring, generate PM artifacts, and provide daily briefings. A PM clones the repo, runs the installer, and immediately has two specialized agents (Astro for organization, Engin for expert PM advice) and 8 guided workflows at their disposal.

Target: individual technical PMs who use Claude Code and want structured meeting intelligence without a SaaS subscription.

## Core Value

A PM can import their meetings (from Granola MCP, Jira, Slack, or manual paste), have them automatically organized into themes with action items and decisions tracked, and then use that organized context to make better decisions faster — via briefs, RICE prioritization, decision audits, meeting prep, and artifact generation.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Workspace initialization (`/orbit-init`) — creates `.orbit/` structure with user profile, detects available MCPs
- [ ] Note ingestion (`/orbit-ingest`) — guided flow: Granola MCP / Jira / Slack / file / paste → notes in `.orbit/notes/`
- [ ] Automatic organization (Astro agent) — assigns themes, extracts action items, logs decisions, rebuilds index. Triggered via hook after ingestion.
- [ ] Workspace status (`/orbit-status`) — overview of notes, themes, actions, decisions, artifacts
- [ ] Daily/weekly briefing (`/orbit-brief`) — morning brief with overdue items, key updates, open questions
- [ ] RICE prioritization (`/orbit-priorities`) — score features/initiatives using real meeting evidence
- [ ] Decision tracking (`/orbit-decisions`) — audit decisions: find contradictions, stalled, reversals
- [ ] Meeting preparation (`/orbit-prep`) — gather context per attendee, generate talking points, suggested agenda
- [ ] Artifact generation (`/orbit-artifact`) — generate PRDs, decision records, summaries from templates + context
- [ ] Engin agent with persistent memory — expert PM advisor with 7 capabilities, gets smarter across sessions
- [ ] Spatial branding — Astro and Engin have distinct voices, terminal output uses space station metaphor (signals, constellations, missions, coordinates)
- [ ] Install script (`install.sh`) — one command copies skills, agents, settings into user's project
- [ ] 5 artifact templates — PRD, Decision Record, Weekly Summary, Stakeholder Update, RICE Scorecard
- [ ] README — install instructions, quick start, Granola setup, skill reference, Engin capabilities

### Out of Scope

- TypeScript CLI / npm package — no code, pure prompts
- Multi-platform adapters (Codex, Cursor, Gemini) — Claude Code only for MVP
- HTML/presentation export — post-MVP
- Web UI or dashboard — terminal only
- Standalone CLI binary — Claude Code skills replace this
- Custom template creation command — users create .md files directly
- Scheduled automation via cron — document `/loop` patterns, don't implement cron

## Context

- **Author:** Daniel Medina (@danielmedinac22) — PM, writes at Product Systems. "Este espacio es para PMs que quieren construir sistemas reales."
- **Origin:** Orbit was originally a full-stack SaaS (FastAPI + Next.js + Postgres + pgvector). The rework reduces it to pure Claude Code skills/agents — zero infrastructure.
- **Design docs:** `mvp/01-CONTEXT.md` through `mvp/06-BRANDING.md` contain the complete design specification.
- **Granola MCP:** Available in the development environment. Primary ingestion path for real testing.
- **Atlassian + Slack MCPs:** Also available via `mcp__claude_ai_Atlassian__*` and `mcp__claude_ai_Slack__*` tools.
- **Claude Code features used:** Skills (`.claude/skills/`), Agents (`.claude/agents/`), Hooks (`settings.json`), persistent agent memory (`memory: project`).

## Constraints

- **No code:** The entire product is markdown files — skills, agents, templates, install script. No TypeScript, no build step, no package.json.
- **Claude Code only:** MVP targets Claude Code exclusively. Multi-platform comes in v0.3.
- **Repo location:** Built at `/Users/equipo/Orbit/orbit-pm/` as a publishable subdirectory.
- **Branding:** Level 1 — clear skill names (orbit-ingest, orbit-brief), spatial experience in agent messages and terminal output. See `mvp/06-BRANDING.md`.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Skills + Agents instead of Commands | Skills have frontmatter (arguments, tool restrictions, model control), agents have persistent memory | — Pending |
| Notes as core unit (not "sources") | Granola/Claude already process transcripts; Orbit organizes, doesn't reprocess | — Pending |
| Hooks for auto-Astro after ingestion | No manual `/astro` step needed — seamless flow | — Pending |
| Decision log as first-class artifact | Most PM tools ignore decision tracking; this is a differentiator | — Pending |
| Flat notes, themes as views | Notes in `.orbit/notes/`, themes reference via frontmatter — no file moving | — Pending |
| Level 1 branding (spatial experience, clear names) | PM must understand skills without reading docs; spatial flavor in messages | — Pending |

---
*Last updated: 2026-03-28 after initialization*
