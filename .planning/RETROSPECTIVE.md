# Retrospective

Living retrospective across milestones. Each section captures what worked, what didn't, and lessons for the next cycle.

---

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-31
**Phases:** 4 | **Plans:** 12 | **Tasks:** 22
**Timeline:** 3 days (2026-03-28 → 2026-03-31)
**Files:** 66 files, ~11,700 lines

### What Was Built
- One-command installer + workspace initialization with MCP detection
- 2 specialized agents: Astro (auto-organization) and Engin (expert PM advisor with 7 capabilities)
- 8 guided skills covering the full PM workflow: ingest → organize → brief → prioritize → audit → prep → generate
- 5 artifact templates (PRD, Decision Record, Weekly Summary, Stakeholder Update, RICE Scorecard)
- Complete README making the product self-explaining on GitHub

### What Worked
- **Design-first approach:** 6 detailed design docs (mvp/01-06) before any implementation eliminated ambiguity
- **Phase boundaries were natural:** Each phase delivered a testable increment (install → ingest → intelligence → docs)
- **discuss-phase captured real decisions:** D-01 through D-11 for Phase 4 prevented all the usual README antipatterns
- **Verification caught real issues:** Phase 3 verification found gaps in orbit-brief (stalled decisions) and orbit-decisions (reversal callout) that required patches
- **Single-task plans for docs:** Phase 4 as one plan was the right granularity for a synthesis task

### What Was Inefficient
- **Phase 2 plans were too broad:** 2 plans covering 22 requirements each — harder to verify than smaller, focused plans
- **Research for Phase 4 was borderline unnecessary:** All content already existed in source files. Skip-research would have been fine.

### Patterns Established
- Spatial vocabulary stays inside fenced code blocks only — never in prose
- Product-confident voice: "Orbit does X." No hedging.
- Source types matter: Granola = meeting notes, Jira = insights/issues, Slack = conversations
- Every skill completion suggests the next logical step

### Key Lessons
- **Pure-markdown products are viable:** No code, no infrastructure, no build step — just skills, agents, and templates
- **Hooks make agents seamless:** PostToolUse hook auto-triggering Astro is the key UX win
- **README is product:** For a Claude Code plugin, the README IS the documentation — there's nothing else

### Cost Observations
- Model mix: opus for planning, sonnet for research/execution/verification
- Sessions: ~8 across 4 phases
- Notable: Phase 4 (docs) was fastest — single plan, pure synthesis

---

## Cross-Milestone Trends

| Metric | v1.0 |
|--------|------|
| Phases | 4 |
| Plans | 12 |
| Tasks | 22 |
| Timeline | 3 days |
| Verification pass rate | 100% (all phases passed) |
| Gap closure phases | 0 |
