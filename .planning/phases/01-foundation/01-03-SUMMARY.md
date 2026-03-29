---
phase: 01-foundation
plan: 03
subsystem: templates
tags: [markdown, pm-artifacts, templates, prd, decision-record, rice-scorecard]

# Dependency graph
requires: []
provides:
  - 5 PM artifact templates in orbit-pm/templates/ (prd, decision-record, weekly-summary, stakeholder-update, rice-scorecard)
  - YAML frontmatter with machine-readable template identifiers
  - HTML comment guidance for /orbit-artifact to populate each section
  - Placeholder variables in {curly braces} for runtime substitution
affects:
  - Phase 3 orbit-artifact skill (consumes these templates to generate documents)
  - orbit-init (copies templates to .orbit/templates/ during project setup)
  - install.sh (ships templates/ directory in repo)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Template structure: YAML frontmatter + H1 title + metadata header + HTML comment–guided sections + {placeholder} variables"
    - "Machine-readable template field in frontmatter enables orbit-artifact to identify and select templates"
    - "HTML comments as instructions to Engin — not visible in rendered output, embedded in template source"

key-files:
  created:
    - orbit-pm/templates/prd.md
    - orbit-pm/templates/decision-record.md
    - orbit-pm/templates/weekly-summary.md
    - orbit-pm/templates/stakeholder-update.md
    - orbit-pm/templates/rice-scorecard.md
  modified: []

key-decisions:
  - "Templates use HTML comments (not visible in output) to instruct Engin what content to fill per section — keeps template clean when rendered"
  - "RICE Scoring Guide uses a table mapping dimension levels to meeting-evidence criteria (frequency of mention, business impact) — grounded in actual PM note patterns"
  - "Challenge section added to RICE scorecard as Engin's distinct voice — one pointed question based on scoring contradictions"

patterns-established:
  - "Template frontmatter pattern: template name + version + description — enables machine identification"
  - "Section instruction pattern: <!-- Fill with: [what goes here] --> standardized across all 5 templates"
  - "Placeholder pattern: {variable_name} in curly braces for runtime substitution by orbit-artifact"

requirements-completed: [FOUND-03]

# Metrics
duration: 2min
completed: 2026-03-29
---

# Phase 1 Plan 03: PM Artifact Templates Summary

**5 PM artifact templates (PRD, Decision Record, Weekly Summary, Stakeholder Update, RICE Scorecard) with YAML frontmatter, HTML comment guidance, and {placeholder} variables for /orbit-artifact consumption**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-29T01:17:47Z
- **Completed:** 2026-03-29T01:19:16Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Created orbit-pm/templates/ directory with all 5 required PM artifact templates
- Each template has YAML frontmatter with machine-readable `template:` field and `version: 1.0`
- Each template has realistic PM document sections (not generic placeholders) with HTML comments instructing Engin what to fill in each section
- RICE Scorecard includes full Scoring Guide table, Analysis, Challenge (Engin's voice), and Evidence Cited sections

## Task Commits

Each task was committed atomically:

1. **Task 1: Create PRD and Decision Record templates** - `284e935` (feat)
2. **Task 2: Create Weekly Summary, Stakeholder Update, and RICE Scorecard templates** - `a9dafef` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `orbit-pm/templates/prd.md` - Product Requirements Document template with Problem Statement, Goals & Success Metrics, Scope, Requirements, Stakeholders, Open Questions, Decisions Log, Action Items
- `orbit-pm/templates/decision-record.md` - Decision Record template with Decision, Context, Options Considered (A/B), Decision & Rationale, Consequences, Decision Trail
- `orbit-pm/templates/weekly-summary.md` - Weekly Summary template with Highlights, Theme Progress, Decisions Made, Action Item Status (Completed/Added/Overdue), Open Questions, Next Week Focus
- `orbit-pm/templates/stakeholder-update.md` - Stakeholder Update template with Executive Summary, Status, Progress Since Last Update, Key Decisions, Risks & Issues, Upcoming Milestones, Decisions Needed
- `orbit-pm/templates/rice-scorecard.md` - RICE Scorecard template with Scoring Guide table, Scorecard table, Analysis, Challenge (Engin's voice), Evidence Cited

## Decisions Made

- Templates use HTML comments to instruct Engin — not visible in rendered output, embedded in source; keeps generated documents clean
- RICE Scoring Guide criteria grounded in meeting-evidence patterns (frequency of mention, business impact) rather than abstract numeric scales
- Challenge section added to RICE scorecard as Engin's distinct voice — one pointed question based on data contradictions or scoring assumptions

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 5 templates ready for consumption by /orbit-artifact in Phase 3
- Templates follow the interface contract: YAML frontmatter with `template:` field, `{placeholder}` variables, HTML comment guidance
- orbit-init and install.sh can reference orbit-pm/templates/ as the source for copying to .orbit/templates/

## Self-Check: PASSED

- orbit-pm/templates/prd.md: FOUND
- orbit-pm/templates/decision-record.md: FOUND
- orbit-pm/templates/weekly-summary.md: FOUND
- orbit-pm/templates/stakeholder-update.md: FOUND
- orbit-pm/templates/rice-scorecard.md: FOUND
- .planning/phases/01-foundation/01-03-SUMMARY.md: FOUND
- Commit 284e935: FOUND
- Commit a9dafef: FOUND

---
*Phase: 01-foundation*
*Completed: 2026-03-29*
