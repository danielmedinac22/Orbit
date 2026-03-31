# Milestones

## v1.0 MVP (Shipped: 2026-03-31)

**Phases completed:** 4 phases, 12 plans, 22 tasks

**Key accomplishments:**

- orbit-pm/ repository scaffold with CLAUDE.md idempotency marker, MIT license, PostToolUse hook structure in settings.json, and directory extensions for agents, skills, and templates
- Astro (sonnet, project memory, file-only) and Engin (inherit model, project memory, WebSearch) agent definitions with complete system prompts from authoritative spec
- 5 PM artifact templates (PRD, Decision Record, Weekly Summary, Stakeholder Update, RICE Scorecard) with YAML frontmatter, HTML comment guidance, and {placeholder} variables for /orbit-artifact consumption
- Two core Claude Code skills: orbit-init creates the full .orbit/ workspace with onboarding flow and MCP detection; orbit-status displays a spatial read-only snapshot with ◉/★/○ symbols and contextual next-action suggestions.
- Six complete SKILL.md files covering the full Orbit PM workflow: MCP-first note ingestion, daily/weekly briefing, RICE prioritization, decision auditing, meeting prep, and artifact generation — all with spatial branding and functional workflow bodies
- One-command bash installer that merges orbit-pm files into any project — idempotent, non-destructive, and safe to re-run
- PostToolUse hook upgraded from weak placeholder to imperative Astro delegation directive, with navigator voice (signals/constellations/star chart) added to Astro's completion report format
- Full requirements audit of orbit-ingest, astro.md, engin.md, and orbit-status — all INGS/ASTR/ENGN/BRND requirements satisfied with one BRND-02 vocabulary patch to engin.md
- Surgical patches to orbit-brief (D-01 stalled decisions in Drifting) and orbit-decisions (D-08 distinct Reversal Detected callout) — all 7 BREF and DCSN requirements now pass
- orbit-priorities SKILL.md patched with PM score override section (asterisk notation + gut-call labeling) and rice-scorecard template updated with matching Overrides table per locked decision D-05
- orbit-prep and orbit-artifact skill files plus 4 remaining templates verified against all 8 PREP and ARTF requirements — zero gaps found, zero patches applied
- Complete README.md: hero pitch, 3-step install, 8-skill workflow guide with fenced code examples, and 7-capability Engin table — Orbit v1.0 is publishable on GitHub

---
