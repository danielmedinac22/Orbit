# Orbit

## What This Is

Orbit is an open-source Claude Code plugin that turns a Product Manager's terminal into a 100x productivity system. It ships as a set of skills, agents, and templates — no code, no infrastructure — that organize meeting notes by themes, track decisions, prioritize with RICE scoring, generate PM artifacts, and provide daily briefings. A PM clones the repo, runs the installer, and immediately has two specialized agents (Astro for organization, Engin for expert PM advice) and 8 guided workflows at their disposal.

Target: individual technical PMs who use Claude Code and want structured meeting intelligence without a SaaS subscription.

## Core Value

A PM can import their meetings (from Granola MCP, Jira, Slack, or manual paste), have them automatically organized into themes with action items and decisions tracked, and then use that organized context to make better decisions faster — via briefs, RICE prioritization, decision audits, meeting prep, and artifact generation.

## Requirements

### Validated

- ✓ Workspace initialization (`/orbit-init`) — creates `.orbit/` structure with user profile, detects available MCPs — Phase 1
- ✓ Workspace status (`/orbit-status`) — overview of notes, themes, actions, decisions, artifacts — Phase 1
- ✓ Install script (`install.sh`) — one command copies skills, agents, settings into user's project — Phase 1
- ✓ 5 artifact templates — PRD, Decision Record, Weekly Summary, Stakeholder Update, RICE Scorecard — Phase 1
- ✓ Spatial branding — Astro and Engin have distinct voices, terminal output uses space station metaphor — Phase 1
- ✓ Note ingestion (`/orbit-ingest`) — 5-source guided flow with MCP detection — Validated in Phase 2
- ✓ Automatic organization (Astro agent) — theme assignment, action extraction, decision logging, index rebuild, auto-triggered via hook — Validated in Phase 2
- ✓ Engin agent with persistent memory — 7 capabilities, cited sources, fact-type labeling, advisor voice — Validated in Phase 2

- ✓ Daily/weekly briefing (`/orbit-brief`) — morning brief with overdue items first, key updates by theme, stalled decisions in Drifting section — Validated in Phase 3
- ✓ RICE prioritization (`/orbit-priorities`) — score features using meeting evidence, PM override with asterisk/gut-call labeling, Challenge section — Validated in Phase 3
- ✓ Decision tracking (`/orbit-decisions`) — contradictions, reversals (distinct section), stalled (7-day threshold), resolution suggestions — Validated in Phase 3
- ✓ Meeting preparation (`/orbit-prep`) — topic research, attendee context from participants: field, agenda, talking points, optional save — Validated in Phase 3
- ✓ Artifact generation (`/orbit-artifact`) — template-based with dual context path, versioning (-v2/-v3), 5 templates — Validated in Phase 3

### Active

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
- **Repo location:** Root of the Orbit repo is the publishable product (skills, agents, templates, install.sh at top level).
- **Branding:** Level 1 — clear skill names (orbit-ingest, orbit-brief), spatial experience in agent messages and terminal output. See `mvp/06-BRANDING.md`.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Skills + Agents instead of Commands | Skills have frontmatter (arguments, tool restrictions, model control), agents have persistent memory | — Pending |
| Notes as core unit (not "sources") | Granola/Claude already process transcripts; Orbit organizes, doesn't reprocess | — Pending |
| Hooks for auto-Astro after ingestion | No manual `/astro` step needed — seamless flow | Implemented Phase 2 |
| Decision log as first-class artifact | Most PM tools ignore decision tracking; this is a differentiator | — Pending |
| Flat notes, themes as views | Notes in `.orbit/notes/`, themes reference via frontmatter — no file moving | — Pending |
| Level 1 branding (spatial experience, clear names) | PM must understand skills without reading docs; spatial flavor in messages | — Pending |

---
*Last updated: 2026-03-30 after Phase 3 completion — all 5 intelligence skills verified (brief, priorities, decisions, prep, artifact), 19/19 requirements passed*
