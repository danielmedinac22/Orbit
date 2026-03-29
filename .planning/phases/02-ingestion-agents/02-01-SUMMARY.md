---
phase: 02-ingestion-agents
plan: "01"
subsystem: hooks
tags: [claude-hooks, PostToolUse, python3, settings.json, astro, navigator-voice]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: settings.json placeholder hook and Astro agent with basic system prompt

provides:
  - PostToolUse hook that auto-delegates to Astro after .orbit/notes/ writes
  - Navigator voice completion report format in astro.md (spatial vocabulary)
  - install.sh ships upgraded hook — fresh installs get real Astro delegation

affects:
  - 02-ingestion-agents (remaining plans that depend on hook being active)
  - 03-skills (orbit-ingest skill triggers hook pipeline)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "PostToolUse hook uses python3 inline script for JSON parsing and path-conditional output"
    - "Hook prints delegation directive only for .orbit/notes/ writes — silent for all other paths"
    - "Navigator spatial vocabulary: signals/constellations/missions/star chart in Astro reports"

key-files:
  created: []
  modified:
    - orbit-pm/.claude/settings.json
    - orbit-pm/.claude/agents/astro.md

key-decisions:
  - "Hook uses conditional print (None on no-match) instead of exit(0) guard + unconditional echo — old approach fired echo regardless of path check"
  - "Imperative delegation language: 'Delegate to the Astro agent now' replaces weak 'Consider running Astro'"
  - "install.sh requires no logic changes — upgraded settings.json is shipped automatically via ORBIT_SETTINGS reference"

patterns-established:
  - "PostToolUse hook pattern: python3 inline + path check + conditional print + 2>/dev/null || true"
  - "Astro navigator voice: Completion Report section with exact format spec and vocabulary table"

requirements-completed: [ASTR-08, BRND-01, ASTR-02, ASTR-03, ASTR-04, ASTR-05, ASTR-06, ASTR-07]

# Metrics
duration: 9min
completed: 2026-03-29
---

# Phase 02 Plan 01: Ingestion Hook + Navigator Voice Summary

**PostToolUse hook upgraded from weak placeholder to imperative Astro delegation directive, with navigator voice (signals/constellations/star chart) added to Astro's completion report format**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-29T17:23:12Z
- **Completed:** 2026-03-29T17:32:01Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Replaced unconditional echo placeholder with python3 inline script that fires delegation directive only for `.orbit/notes/` writes
- Added `## Completion Report` section to astro.md with exact spatial vocabulary format from mvp/06-BRANDING.md
- Verified install.sh ships upgraded files without any code changes — smoke test passed against fresh temp directory

## Task Commits

Each task was committed atomically:

1. **Task 1: Upgrade PostToolUse hook and patch Astro navigator voice** - `e4bcf7c` (feat)
2. **Task 2: Sync install.sh with upgraded hook** - No code changes; verified via smoke test

**Plan metadata:** (docs commit — see final)

## Files Created/Modified
- `orbit-pm/.claude/settings.json` - PostToolUse hook upgraded: path-conditional print, imperative delegation language, suppressed stderr
- `orbit-pm/.claude/agents/astro.md` - Added Completion Report section with navigator voice format; removed old generic summary line

## Decisions Made
- Hook uses `print(...) if '.orbit/notes/' in p else None` rather than `exit(0)` + `echo` — the old pattern fired `echo` unconditionally after the python3 guard returned exit 0
- Delegation directive is imperative ("Delegate to the Astro agent now") not suggestive ("Consider running")
- install.sh needs no changes: `ORBIT_SETTINGS="$SCRIPT_DIR/.claude/settings.json"` already references the upgraded file
- Unicode characters preserved as specified: `●` (U+25CF), `○` (U+25CB), `→` (U+2192) in completion report template

## Deviations from Plan

None - plan executed exactly as written. Task 2 confirmed no code changes required for install.sh, as the research indicated.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- The full ingest-to-organize pipeline is now complete: write note → hook fires → Astro auto-delegates → spatial voice report
- Phase 02 Plan 02 (if any) can rely on the hook being active
- orbit-ingest skill (Phase 03) will trigger the hook automatically on every note write

---
*Phase: 02-ingestion-agents*
*Completed: 2026-03-29*
