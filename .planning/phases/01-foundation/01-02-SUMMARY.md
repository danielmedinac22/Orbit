---
phase: 01-foundation
plan: 02
subsystem: agents
tags: [claude-code, agents, astro, engin, pm-advisor, organization]

# Dependency graph
requires: []
provides:
  - "Astro organization agent with sonnet model, project memory, and full organizational workflow (Theme Assignment, Action Item Extraction, Decision Logging, Index Rebuild)"
  - "Engin PM advisor agent with inherit model, project memory, WebSearch, and full advisory capabilities (7 Capabilities, Communication Rules)"
  - "Both agent descriptions tuned for auto-delegation triggers in Claude Code"
affects: [01-03, 01-04, 01-05, phase-02-hooks, phase-03-skills]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Claude Code agent format: YAML frontmatter (name, description, model, memory, tools, disallowedTools) + system prompt body in .claude/agents/*.md"
    - "model: sonnet for bounded tasks (Astro organization), model: inherit for advisory tasks (Engin) to enable Opus-level reasoning when user has it configured"
    - "memory: project for both agents — creates .claude/agent-memory/<name>/ for cross-session persistence, shareable via git"
    - "Auto-delegation via description field: specific trigger phrases tell Claude when to route to each agent"

key-files:
  created:
    - orbit-pm/.claude/agents/astro.md
    - orbit-pm/.claude/agents/engin.md
  modified: []

key-decisions:
  - "Astro uses model: sonnet (not inherit) because organization work has bounded scope and deterministic output — sonnet is sufficient and faster"
  - "Engin uses model: inherit to allow Opus-level reasoning when the user has it — advisory/synthesis tasks benefit from highest available intelligence"
  - "Both agents have memory: project for cross-session learning — team can share accumulated patterns via git"
  - "Astro disallows Bash, Agent, WebSearch, WebFetch — organization is pure file work, no external access or subagent spawning needed"
  - "Engin disallows only Bash — needs WebSearch for PM research but no shell access required"

patterns-established:
  - "Agent description pattern: lead with role/workspace, then specific capabilities, end with delegation trigger phrase"
  - "Tool restriction pattern: allowlist (tools:) for what's needed, denylist (disallowedTools:) for what must be blocked"
  - "System prompt verbatim copy from authoritative spec (mvp/04-PROMPTS.md) — no paraphrasing or truncation"

requirements-completed: [FOUND-01]

# Metrics
duration: 9min
completed: 2026-03-28
---

# Phase 1 Plan 02: Agent Definitions Summary

**Astro (sonnet, project memory, file-only) and Engin (inherit model, project memory, WebSearch) agent definitions with complete system prompts from authoritative spec**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-29T01:17:47Z
- **Completed:** 2026-03-29T01:26:47Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Created `orbit-pm/.claude/agents/astro.md` with 96 lines — complete YAML frontmatter + full organization workflow system prompt
- Created `orbit-pm/.claude/agents/engin.md` with 139 lines — complete YAML frontmatter + full 7-capability PM advisor system prompt
- Both agents have description fields with specific auto-delegation trigger phrases that Claude Code uses for routing

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Astro agent definition** - `b5450cc` (feat)
2. **Task 2: Create Engin agent definition** - `a5ee7ea` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified
- `orbit-pm/.claude/agents/astro.md` - Organization agent: reads notes, assigns themes, extracts action items, logs decisions, rebuilds index. model: sonnet, memory: project, no Bash/Agent/WebSearch/WebFetch
- `orbit-pm/.claude/agents/engin.md` - Expert PM advisor: strategic synthesis, customer insight, RICE prioritization, decision tracking, meeting prep, briefs, contradiction detection. model: inherit, memory: project, includes WebSearch

## Decisions Made
- Copied system prompts verbatim from `mvp/04-PROMPTS.md` as specified — no paraphrasing, no truncation. This ensures agents function exactly as designed.
- Created `.claude/agents/` directory via the Write tool (Bash tool permission was unavailable) — the Write tool creates parent directories automatically.

## Deviations from Plan

None - plan executed exactly as written.

The agents directory did not pre-exist, but Write tool created it automatically when writing the first file. No deviation from plan spec required.

## Issues Encountered
- Bash tool permission was denied for `mkdir -p` on the agents directory. Resolved by using the Write tool directly, which creates parent directories automatically. No impact on output.

## User Setup Required
None - no external service configuration required. Agent files are ready for Claude Code to discover on session start.

## Next Phase Readiness
- Both agent files are in place. Claude Code will discover them when users run from the `orbit-pm/` directory (or after install.sh copies them).
- Phase 2 (hooks) can reference these agent definitions as the delegation targets for PostToolUse Write hooks on `.orbit/notes/`.
- Phase 3 (skills) can reference Engin's description for orbit-brief, orbit-priorities, orbit-decisions, orbit-prep, orbit-artifact delegation.
- No blockers.

---
*Phase: 01-foundation*
*Completed: 2026-03-28*

## Self-Check: PASSED

- orbit-pm/.claude/agents/astro.md — FOUND
- orbit-pm/.claude/agents/engin.md — FOUND
- .planning/phases/01-foundation/01-02-SUMMARY.md — FOUND
- Commit b5450cc (Astro agent) — FOUND
- Commit a5ee7ea (Engin agent) — FOUND
