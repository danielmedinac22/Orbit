---
phase: 03-intelligence-skills
plan: 02
subsystem: skills
tags: [rice, prioritization, orbit-priorities, rice-scorecard, pm-overrides, gut-call]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: orbit-priorities SKILL.md and rice-scorecard template (Phase 1 Plan 05)
provides:
  - orbit-priorities SKILL.md with PM score override handling (asterisk notation, gut-call labeling)
  - rice-scorecard template with Overrides section and footnote pattern
affects: [03-intelligence-skills, verifier, any context assembly reading PRIO requirements]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "PM score overrides marked with * (asterisk) in scorecard tables and labeled as 'gut call'"
    - "HTML comment Fill with: pattern used for override instructions in templates (established Phase 1)"

key-files:
  created: []
  modified:
    - orbit-pm/.claude/skills/orbit-priorities/SKILL.md
    - orbit-pm/templates/rice-scorecard.md

key-decisions:
  - "D-05 honored: orbit-priorities SKILL.md and rice-scorecard template now use identical asterisk notation and gut-call labeling for PM overrides — skill describes behavior, template shows format"

patterns-established:
  - "Override consistency: when a locked decision affects both a skill file and a template, patch both atomically to maintain behavioral/format consistency"

requirements-completed: [PRIO-01, PRIO-02, PRIO-03, PRIO-04]

# Metrics
duration: 3min
completed: 2026-03-30
---

# Phase 03 Plan 02: RICE Override Notation Summary

**orbit-priorities SKILL.md patched with PM score override section (asterisk notation + gut-call labeling) and rice-scorecard template updated with matching Overrides table per locked decision D-05**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-30T11:59:55Z
- **Completed:** 2026-03-30T12:02:55Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added `## PM Score Overrides` section to orbit-priorities SKILL.md documenting asterisk notation and gut-call/evidence-based labeling (D-05)
- Updated Output Format scorecard table example in SKILL.md with `*` override row and footnote format
- Added HTML comment override instructions to rice-scorecard template Scorecard table
- Added new `## Overrides` section to rice-scorecard template with structured table for PM override documentation

## Task Commits

Each task was committed atomically:

1. **Task 1: Verify and patch orbit-priorities SKILL.md against PRIO-01/02/03/04 + D-04/D-05** - `8297d02` (feat)
2. **Task 2: Patch rice-scorecard template with asterisk override notation per D-05** - `96a90c5` (feat)

## Files Created/Modified

- `orbit-pm/.claude/skills/orbit-priorities/SKILL.md` — Added PM Score Overrides section with asterisk notation, gut-call labeling, and override row in Output Format example table
- `orbit-pm/templates/rice-scorecard.md` — Added HTML comment override instructions in Scorecard table and new ## Overrides section with Initiative/Dimension/Evidence Score/PM Score/Label table

## Decisions Made

None — followed D-05 locked decision as specified. Both files patch is consistent: the skill describes the override behavior, the template shows the override format.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- PRIO-01 through PRIO-04 all verified PASS
- D-04 (direct pushback Challenge section) was already present — no change needed
- D-05 (gut-call asterisk notation) now fully implemented in both skill and template
- Ready for phase verifier or next plan

## Self-Check: PASSED

- orbit-pm/.claude/skills/orbit-priorities/SKILL.md: FOUND
- orbit-pm/templates/rice-scorecard.md: FOUND
- .planning/phases/03-intelligence-skills/03-02-SUMMARY.md: FOUND
- Commit 8297d02: FOUND
- Commit 96a90c5: FOUND

---
*Phase: 03-intelligence-skills*
*Completed: 2026-03-30*
