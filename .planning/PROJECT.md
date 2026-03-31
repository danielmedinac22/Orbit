# Orbit

## What This Is

Orbit is an open-source Claude Code plugin that turns a Product Manager's terminal into a 100x productivity system. It ships as a set of skills, agents, and templates — no code, no infrastructure — that organize meeting notes by themes, track decisions, prioritize with RICE scoring, generate PM artifacts, and provide daily briefings. A PM clones the repo, runs the installer, and immediately has two specialized agents (Astro for organization, Engin for expert PM advice) and 8 guided workflows at their disposal.

Target: individual technical PMs who use Claude Code and want structured meeting intelligence without a SaaS subscription.

## Core Value

A PM can import their meetings (from Granola MCP, Jira, Slack, or manual paste), have them automatically organized into themes with action items and decisions tracked, and then use that organized context to make better decisions faster — via briefs, RICE prioritization, decision audits, meeting prep, and artifact generation.

## Current State

**v1.0 MVP shipped 2026-03-31.** All 47 requirements validated across 4 phases (12 plans, 22 tasks). The product is publishable at https://github.com/danielmedinac22/Orbit.

Includes: 8 skills, 2 agents, 5 templates, 1-command installer, complete README.

## Requirements

### Validated

- ✓ Workspace initialization (`/orbit-init`) — v1.0
- ✓ Workspace status (`/orbit-status`) — v1.0
- ✓ Install script (`install.sh`) — v1.0
- ✓ 5 artifact templates — v1.0
- ✓ Spatial branding (Astro + Engin voices) — v1.0
- ✓ Note ingestion (`/orbit-ingest`) — 5-source flow with MCP detection — v1.0
- ✓ Automatic organization (Astro agent) — theme assignment, action extraction, decision logging — v1.0
- ✓ Engin agent — 7 capabilities, cited sources, advisor voice — v1.0
- ✓ Daily/weekly briefing (`/orbit-brief`) — v1.0
- ✓ RICE prioritization (`/orbit-priorities`) — v1.0
- ✓ Decision tracking (`/orbit-decisions`) — v1.0
- ✓ Meeting preparation (`/orbit-prep`) — v1.0
- ✓ Artifact generation (`/orbit-artifact`) — v1.0
- ✓ README documentation — v1.0

### Active

(None — planning next milestone)

### Out of Scope

- TypeScript CLI / npm package — no code, pure prompts
- Multi-platform adapters (Codex, Cursor, Gemini) — Claude Code only for v1
- HTML/presentation export — post-MVP
- Web UI or dashboard — terminal only
- Custom template creation command — users create .md files directly
- Scheduled automation via cron — document `/loop` patterns, don't implement cron

## Context

- **Author:** Daniel Medina (@danielmedinac22) — PM, writes at Product Systems. "Este espacio es para PMs que quieren construir sistemas reales."
- **Origin:** Orbit was originally a full-stack SaaS (FastAPI + Next.js + Postgres + pgvector). The rework reduces it to pure Claude Code skills/agents — zero infrastructure.
- **Repo:** https://github.com/danielmedinac22/Orbit
- **Claude Code features used:** Skills (`.claude/skills/`), Agents (`.claude/agents/`), Hooks (`settings.json`), persistent agent memory (`memory: project`).

## Constraints

- **No code:** The entire product is markdown files — skills, agents, templates, install script. No TypeScript, no build step, no package.json.
- **Claude Code only:** v1 targets Claude Code exclusively. Multi-platform adapters are a v2 consideration.
- **Repo location:** Root of the Orbit repo is the publishable product (skills, agents, templates, install.sh at top level).
- **Branding:** Level 1 — clear skill names (orbit-ingest, orbit-brief), spatial experience in agent messages and terminal output.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Skills + Agents instead of Commands | Skills have frontmatter (arguments, tool restrictions, model control), agents have persistent memory | ✓ Good — core architectural choice validated |
| Notes as core unit (not "sources") | Granola/Claude already process transcripts; Orbit organizes, doesn't reprocess | ✓ Good — clean separation of concerns |
| Hooks for auto-Astro after ingestion | No manual `/astro` step needed — seamless flow | ✓ Good — zero-friction organization |
| Decision log as first-class artifact | Most PM tools ignore decision tracking; this is a differentiator | ✓ Good — contradictions/reversals detection is unique |
| Flat notes, themes as views | Notes in `.orbit/notes/`, themes reference via frontmatter — no file moving | ✓ Good — simple data model |
| Level 1 branding (spatial experience, clear names) | PM must understand skills without reading docs; spatial flavor in messages | ✓ Good — spatial vocab stays in terminal output only |

---
*Last updated: 2026-03-31 after v1.0 milestone*
