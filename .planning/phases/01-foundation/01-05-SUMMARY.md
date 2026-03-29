---
phase: 01-foundation
plan: 05
subsystem: skills
tags: [orbit-pm, claude-code, skills, SKILL.md, ingest, brief, priorities, decisions, prep, artifact]

# Dependency graph
requires: []
provides:
  - orbit-ingest SKILL.md with complete 5-source guided flow (Granola/Jira/Slack/file/paste)
  - orbit-brief SKILL.md with daily/weekly Mission Briefing format
  - orbit-priorities SKILL.md with RICE scoring and Mission Priority Scan branding
  - orbit-decisions SKILL.md with Coordinate Audit (conflicts/stalled/stable)
  - orbit-prep SKILL.md with Pre-Launch Check and Crew briefing format
  - orbit-artifact SKILL.md with template validation, versioning, and Payload delivered branding
affects: [Phase 2 ingest implementation, Phase 3 PM workflow implementation, install.sh deployment]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SKILL.md files: YAML frontmatter (name/description/argument-hint) + workflow body with parse/flow/output/error sections"
    - "MCP detection pattern: check tool names matching granola/mcp__claude_ai_Atlassian__*/mcp__claude_ai_Slack__*"
    - "Spatial branding: functional skill names + spatial terms in terminal output messages only"
    - "All skills delegate analytical work to Engin; orbit-ingest delegates organization to Astro via hook"

key-files:
  created:
    - orbit-pm/.claude/skills/orbit-ingest/SKILL.md
    - orbit-pm/.claude/skills/orbit-brief/SKILL.md
    - orbit-pm/.claude/skills/orbit-priorities/SKILL.md
    - orbit-pm/.claude/skills/orbit-decisions/SKILL.md
    - orbit-pm/.claude/skills/orbit-prep/SKILL.md
    - orbit-pm/.claude/skills/orbit-artifact/SKILL.md
  modified: []

key-decisions:
  - "Skill bodies include complete workflow instructions — not stubs — so Phase 3 implementation is Claude instructions not code"
  - "orbit-ingest writes notes with themes: [] so Astro hook fires on every note creation"
  - "Spatial branding terms (Mission Briefing, Coordinate Audit, etc.) appear only in terminal output, not in YAML or skill descriptions"
  - "All 5 source paths (Granola/Jira/Slack/file/paste) covered in orbit-ingest with MCP detection gating availability"

patterns-established:
  - "SKILL.md structure: frontmatter → 1-line description → ## Parse Arguments → ## Context Assembly → ## [Mode/Flow] → ## Output Format → ## Completion Message → ## Error Handling"
  - "Skills offer guided mode (no args) and direct mode (with args) for all relevant commands"
  - "Every skill handles missing .orbit/ directory with explicit 'Run /orbit-init first' error"

requirements-completed: [FOUND-02]

# Metrics
duration: 12min
completed: 2026-03-28
---

# Phase 1 Plan 05: Remaining 6 Skill Files Summary

**Six complete SKILL.md files covering the full Orbit PM workflow: MCP-first note ingestion, daily/weekly briefing, RICE prioritization, decision auditing, meeting prep, and artifact generation — all with spatial branding and functional workflow bodies**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-28T20:38:14Z
- **Completed:** 2026-03-28T20:52:49Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- orbit-ingest and orbit-brief: complete guided flows with MCP detection, 5 source paths, Mission Briefing format with Drifting/Signals/Active Missions/Open Coordinates sections
- orbit-priorities and orbit-decisions: RICE scoring with evidence citations and Mission Priority Scan branding; full Coordinate Audit with conflict/stalled/stable sections
- orbit-prep and orbit-artifact: Pre-Launch Check with Crew section; template-driven artifact generation with versioning and Payload delivered completion message

## Task Commits

Each task was committed atomically:

1. **Task 1: Create orbit-ingest and orbit-brief skills** - `0a959be` (feat)
2. **Task 2: Create orbit-priorities, orbit-decisions, orbit-prep, and orbit-artifact skills** - `65f1b99` (feat)

**Plan metadata:** (docs commit — pending)

## Files Created/Modified

- `orbit-pm/.claude/skills/orbit-ingest/SKILL.md` - 5-source guided import with MCP detection, Note Creation Prompt for file/paste paths, Signal scan completion message
- `orbit-pm/.claude/skills/orbit-brief/SKILL.md` - Daily/weekly brief with Mission Briefing format, writes to .orbit/briefs/
- `orbit-pm/.claude/skills/orbit-priorities/SKILL.md` - RICE scoring with evidence citations, Mission Priority Scan format, writes rice-scorecard artifact
- `orbit-pm/.claude/skills/orbit-decisions/SKILL.md` - Coordinate Audit with ⚠️ Conflicts / ⏸ Uncharted / ✓ Stable sections, three audit modes
- `orbit-pm/.claude/skills/orbit-prep/SKILL.md` - Pre-Launch Check with Crew section, agenda, talking points, Coordinates to Lock, optional save
- `orbit-pm/.claude/skills/orbit-artifact/SKILL.md` - Template validation, versioning (v2/v3/etc.), Payload delivered message, 5 template types

## Decisions Made

- Skill bodies are complete workflow instructions written as Claude prompts — they ARE the Phase 3 implementation, not stubs pointing to future work
- MCP detection uses tool name pattern matching (granola, mcp__claude_ai_Atlassian__*, mcp__claude_ai_Slack__*) — only offer sources that are available
- Spatial branding terms appear exclusively in terminal output sections, never in YAML frontmatter or skill description fields
- orbit-ingest always writes `themes: []` in note frontmatter so the PostToolUse hook correctly identifies notes for Astro organization

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 6 skill SKILL.md files exist in `orbit-pm/.claude/skills/` — install.sh can copy them
- Each SKILL.md has valid frontmatter and complete workflow bodies
- Phase 2 (orbit-ingest implementation) and Phase 3 (PM workflow skills) can reference these SKILL.md files as-is
- Skills register as slash commands in Claude Code immediately after install

## Self-Check: PASSED

- orbit-pm/.claude/skills/orbit-ingest/SKILL.md — FOUND
- orbit-pm/.claude/skills/orbit-brief/SKILL.md — FOUND
- orbit-pm/.claude/skills/orbit-priorities/SKILL.md — FOUND
- orbit-pm/.claude/skills/orbit-decisions/SKILL.md — FOUND
- orbit-pm/.claude/skills/orbit-prep/SKILL.md — FOUND
- orbit-pm/.claude/skills/orbit-artifact/SKILL.md — FOUND
- Commit 0a959be (Task 1) — FOUND
- Commit 65f1b99 (Task 2) — FOUND

---
*Phase: 01-foundation*
*Completed: 2026-03-28*
