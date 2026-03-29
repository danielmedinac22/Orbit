---
phase: 01-foundation
plan: "06"
subsystem: install
tags: [bash, python3, install.sh, settings.json, CLAUDE.md, hooks]

requires:
  - phase: 01-01
    provides: orbit-pm repo structure and CLAUDE.md
  - phase: 01-02
    provides: agent files (astro.md, engin.md) and settings.json
  - phase: 01-03
    provides: templates/ directory
  - phase: 01-04
    provides: orbit-init and orbit-status skill directories
  - phase: 01-05
    provides: remaining six skill directories

provides:
  - orbit-pm/install.sh — executable bash installer

affects: [users who clone orbit-pm, future install verification tasks]

tech-stack:
  added: []
  patterns:
    - "Idempotency via grep marker check before appending to CLAUDE.md"
    - "JSON merge with python3 set intersection for hook deduplication"
    - "read || response='' guard for non-TTY stdin robustness"
    - "cp -r with ${var%/} to strip trailing slash and preserve directory name"

key-files:
  created:
    - orbit-pm/install.sh
  modified: []

key-decisions:
  - "install.sh is purely a file installer — it does not auto-run /orbit-init (per locked decision)"
  - "CLAUDE.md idempotency uses '# Orbit — Context Copilot for Product Managers' marker string"
  - "settings.json merge uses python3 with set intersection deduplication (no jq dependency)"
  - "read || response='' guards interactive prompts for non-TTY robustness without changing UX"

patterns-established:
  - "Installer pattern: ask-before-overwrite with default N protects user's existing files"
  - "Idempotency pattern: marker-based append check prevents duplicate CLAUDE.md sections"
  - "JSON merge pattern: python3 set intersection deduplication prevents duplicate hooks"

requirements-completed: [FOUND-02]

duration: 4min
completed: "2026-03-29"
---

# Phase 01 Plan 06: install.sh Summary

**One-command bash installer that merges orbit-pm files into any project — idempotent, non-destructive, and safe to re-run**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-03-29T12:35:39Z
- **Completed:** 2026-03-29T12:38:58Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Created `orbit-pm/install.sh` — executable bash script with `set -euo pipefail`
- Implemented all 5 install steps: agents, skills, settings.json merge (python3), CLAUDE.md append, templates
- Smoke-tested in `/tmp` to confirm fresh install and idempotency (second run produces no duplicates)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create install.sh** - `55e7c36` (feat)
2. **Task 2: Smoke test + bug fix** - `852b944` (fix)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `orbit-pm/install.sh` — The one-command installer: copies agents, skills, templates; merges settings.json hooks; appends CLAUDE.md section

## Decisions Made

- `install.sh` does NOT auto-run `/orbit-init` — prints a reminder instead (locked decision from CONTEXT.md)
- Used `read || response=""` instead of disabling `set -e` to handle non-TTY stdin gracefully
- Used `${src_skill_dir%/}` to strip trailing slash from glob pattern, ensuring `cp -r` preserves the directory name rather than copying contents

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `cp -r` with trailing slash copies contents not directory**
- **Found during:** Task 2 (smoke test)
- **Issue:** The bash glob `"$SCRIPT_DIR/.claude/skills"/*/` appends a trailing slash; `cp -r path/to/dir/ dest/` copies the directory's contents, not the directory itself. Skills were installed flat (`SKILL.md` directly under `.claude/skills/`) instead of in named subdirectories.
- **Fix:** Changed `cp -r "$src_skill_dir" "$DEST/.claude/skills/"` to `cp -r "${src_skill_dir%/}" "$DEST/.claude/skills/"` — the `%/` strips the trailing slash, preserving the directory name in the copy.
- **Files modified:** `orbit-pm/install.sh`
- **Verification:** Smoke test confirmed `orbit-init/SKILL.md` and `orbit-status/SKILL.md` exist at correct paths after install.
- **Committed in:** `852b944`

**2. [Rule 1 - Bug] `read` returns non-zero when stdin is not a TTY, causing `set -e` script exit**
- **Found during:** Task 2 (idempotency test with piped input)
- **Issue:** When the second install run was tested with piped `N` responses, `read` returned a non-zero exit code on EOF, which caused `set -euo pipefail` to abort the script mid-install.
- **Fix:** Added `|| response=""` to all three `read` calls so the variable is set to empty string (treated as "N" by the default case) instead of failing.
- **Files modified:** `orbit-pm/install.sh`
- **Verification:** Piped `N` responses ran the full second install to completion; "installed successfully" printed; no duplicates created.
- **Committed in:** `852b944`

---

**Total deviations:** 2 auto-fixed (Rule 1 — bugs discovered during smoke test)
**Impact on plan:** Both fixes necessary for correct file layout and cross-environment robustness. No scope creep.

## Issues Encountered

None beyond the two auto-fixed bugs above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Phase 1 (Foundation) is fully complete: CLAUDE.md, agents, settings.json, templates, skills, and install.sh all delivered
- `orbit-pm/install.sh` is the capstone deliverable — running it in any project sets up a functional Orbit workspace
- Phase 2 can begin; Astro auto-delegation hook (ASTR-08) will build on the settings.json hook structure established here

---
*Phase: 01-foundation*
*Completed: 2026-03-29*
