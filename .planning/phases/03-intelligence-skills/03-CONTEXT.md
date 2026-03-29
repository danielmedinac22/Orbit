# Phase 3: Intelligence Skills - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Five PM skills that transform organized meeting data into actionable intelligence: daily/weekly briefs (`/orbit-brief`), RICE prioritization (`/orbit-priorities`), decision audits (`/orbit-decisions`), meeting preparation (`/orbit-prep`), and artifact generation (`/orbit-artifact`). All 5 skill files and 5 templates already exist from Phase 1 — this phase verifies and refines them against the 19 requirements (BREF, PRIO, DCSN, PREP, ARTF).

</domain>

<decisions>
## Implementation Decisions

### Brief structure & priority
- **D-01:** Daily brief leads with overdue items (drifting missions + stalled coordinates) before showing new signals — force attention on what's slipping
- **D-02:** When no items are overdue, skip the drifting section entirely — cleaner output, draws attention when it does appear
- **D-03:** Weekly brief is structurally different from daily: focuses on decision velocity (confirmed vs stalled), action burndown (completed/new/overdue), cross-theme patterns, and trend detection — not just a wider time window

### RICE challenge tone
- **D-04:** Engin uses direct pushback when evidence contradicts PM ratings — advisor voice, not yes-man. Example: "You scored X high-impact but it hasn't appeared in any meeting for 3 weeks. Is this a gut call or did I miss a signal?"
- **D-05:** PM can override any RICE score. Engin labels overrides as "gut call" vs "evidence-based" in the scorecard so the distinction is visible (asterisk notation with footnote)

### Decision staleness rules
- **D-06:** Stalled decision = confirmed but no action items followed within 7 days (one sprint cadence)
- **D-07:** Contradictions: flag with both source meetings cited, suggest scheduling a 15-min call to resolve ("lock coordinates")
- **D-08:** Reversals get a distinct callout from contradictions — a later meeting overturning an earlier decision without explicit acknowledgment is flagged separately so PM can confirm the reversal was intentional

### Claude's Discretion
- Meeting prep depth: how much context per attendee, how many themes to pull
- Artifact versioning UX: exact auto-increment behavior (v2, v3)
- Skill completion message wording (within BRND-04 constraint: always suggest next step)
- How many items to show before truncating in briefs
- Template fill behavior when data is missing

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Skill definitions (existing implementations to verify/refine)
- `orbit-pm/.claude/skills/orbit-brief/SKILL.md` — Daily/weekly briefing flow, section structure, spatial formatting
- `orbit-pm/.claude/skills/orbit-priorities/SKILL.md` — RICE scoring flow, candidate identification, challenge logic
- `orbit-pm/.claude/skills/orbit-decisions/SKILL.md` — Decision audit flow, staleness detection, contradiction/reversal logic
- `orbit-pm/.claude/skills/orbit-prep/SKILL.md` — Meeting prep flow, attendee context, agenda generation
- `orbit-pm/.claude/skills/orbit-artifact/SKILL.md` — Artifact generation from templates, versioning, context assembly

### Templates (existing, verify completeness)
- `orbit-pm/templates/prd.md` — PRD template with variable substitution
- `orbit-pm/templates/decision-record.md` — Decision record template
- `orbit-pm/templates/rice-scorecard.md` — RICE scorecard with challenge section
- `orbit-pm/templates/stakeholder-update.md` — Stakeholder update template
- `orbit-pm/templates/weekly-summary.md` — Weekly summary template

### Agent definitions (behavior contracts)
- `orbit-pm/.claude/agents/engin.md` — Engin's 7 capabilities, advisor voice, communication rules, fact-type labeling
- `orbit-pm/.claude/agents/astro.md` — Astro's organization rules (skills read from Astro's output)

### Design specs
- `mvp/05-SKILLS.md` — Skill frontmatter format, flow descriptions for all skills
- `mvp/06-BRANDING.md` — Vocabulary map, agent voices, completion message templates, visual identity
- `mvp/04-PROMPTS.md` — Engin and Astro prompt definitions, capability details

### Requirements
- `.planning/REQUIREMENTS.md` §Briefs — BREF-01, BREF-02, BREF-03
- `.planning/REQUIREMENTS.md` §Prioritization — PRIO-01, PRIO-02, PRIO-03, PRIO-04
- `.planning/REQUIREMENTS.md` §Decision Tracking — DCSN-01, DCSN-02, DCSN-03, DCSN-04
- `.planning/REQUIREMENTS.md` §Meeting Prep — PREP-01, PREP-02, PREP-03, PREP-04
- `.planning/REQUIREMENTS.md` §Artifacts — ARTF-01, ARTF-02, ARTF-03, ARTF-04

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **5 skill files**: All Phase 3 skills already exist as full prompt implementations — created in Phase 1 Plan 05
- **5 templates**: PRD, decision record, RICE scorecard, stakeholder update, weekly summary — all use `{variable}` substitution with HTML comment guides
- **Engin agent**: 7 capabilities already defined including RICE, decision tracking, meeting prep, and briefs
- **PostToolUse hook**: Auto-triggers Astro after note writes — skills can rely on organized data

### Established Patterns
- Skills are pure Claude prompts — the skill body IS the implementation (no code stubs)
- Completion messages always suggest logical next step (BRND-04)
- Language auto-detection — respond in user's language
- Imperative delegation: "Delegate to the Astro agent now" (not "consider running")
- Spatial vocabulary in terminal output only — not in frontmatter or file content

### Integration Points
- Skills read from `.orbit/notes/`, `.orbit/themes/`, `.orbit/decisions/log.md`, `.orbit/action-items/pending.md`
- Skills write to `.orbit/briefs/`, `.orbit/artifacts/`
- Engin's persistent memory accumulates context across sessions
- `/orbit-status` should reflect briefs and artifacts after generation

</code_context>

<specifics>
## Specific Ideas

- Overdue preview format: `⚠️ Drifting` section with bullet items showing item + days overdue
- Weekly uses `◎` symbol for velocity/trend metrics
- RICE scorecard uses asterisk `*` notation for gut-call overrides with footnote
- Contradiction format: both meetings cited with dates, arrow to suggested resolution
- Reversal format: distinct `↺ Reversal Detected` callout with "Confirm: was this intentional?"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-intelligence-skills*
*Context gathered: 2026-03-29*
