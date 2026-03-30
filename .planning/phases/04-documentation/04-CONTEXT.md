# Phase 4: Documentation - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

README.md that makes Orbit self-explaining and publishable on GitHub. A technical PM landing on the repo knows what it does, how to install it, how to use every skill, and what to ask Engin — without reading any other file.

</domain>

<decisions>
## Implementation Decisions

### README Structure & Flow
- **D-01:** Product-first pitch as hero — lead with what Orbit IS, what it does, and "Zero infrastructure" differentiator. NOT problem-first, NOT demo-first.
- **D-02:** Clarify source types accurately — meeting notes come from Granola; insights/issues from Jira; conversations from Slack. Don't say "meeting notes from Jira."
- **D-03:** Minimal install instructions — 3 steps max (clone, install, init). Reference Claude Code naturally since the audience is already using it. Granola MCP setup as separate optional section.
- **D-04:** Skills organized in two layers: first a workflow grouping ("Get started", "Daily workflow", "Deep analysis") showing HOW skills chain together, then a compact reference table with one-liner + example per skill.
- **D-05:** Brief one-liner scope statement: "No code. No infra. No SaaS. Just Claude Code skills and markdown." — no dedicated "What Orbit is NOT" section.

### Usage Examples Style
- **D-06:** Markdown fenced code blocks for all examples (command + representative output snippet). No terminal screenshots.
- **D-07:** Realistic PM scenarios in examples — sprint reviews, stakeholder calls, product decisions. No generic placeholders.

### Engin Capabilities Showcase
- **D-08:** Compact table format — one row per capability with "Ask about" column and "Example query" column. All 7 capabilities listed.
- **D-09:** Brief mention of Engin's personality: "cites sources, challenges assumptions, gives opinionated answers — not just summaries." Let PMs discover the full voice organically.

### Tone & Identity
- **D-10:** Product-confident voice. Direct statements: "Orbit does X." No hedging, no "might" or "can help." Daniel's product-first energy without being personal/founder-voice.
- **D-11:** English only. Mention that Orbit auto-detects language at runtime ("Write in Spanish, get answers in Spanish").

### Claude's Discretion
- Exact section ordering within the README (as long as workflow grouping comes before reference table)
- Granola MCP setup instructions detail level
- How many lines of example output to show per skill
- Phrasing of the scope one-liner

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing README
- `README.md` — Current 10-line placeholder to be replaced

### Skill definitions (source of truth for descriptions and behavior)
- `.claude/skills/orbit-init/SKILL.md` — Workspace initialization flow
- `.claude/skills/orbit-ingest/SKILL.md` — 5-source ingestion flow with MCP detection
- `.claude/skills/orbit-status/SKILL.md` — Workspace overview with spatial formatting
- `.claude/skills/orbit-brief/SKILL.md` — Daily/weekly briefing with overdue-first ordering
- `.claude/skills/orbit-priorities/SKILL.md` — RICE scoring with evidence and challenge
- `.claude/skills/orbit-decisions/SKILL.md` — Decision audit: stalled, contradictions, reversals
- `.claude/skills/orbit-prep/SKILL.md` — Meeting preparation with attendee context
- `.claude/skills/orbit-artifact/SKILL.md` — Template-based artifact generation with versioning

### Agent definitions (Engin's 7 capabilities)
- `.claude/agents/engin.md` — Full capability list, advisor voice, communication rules
- `.claude/agents/astro.md` — Organization agent (mentioned in "how it works" context)

### Templates (artifact examples)
- `templates/prd.md` — PRD template
- `templates/decision-record.md` — Decision record template
- `templates/rice-scorecard.md` — RICE scorecard template
- `templates/stakeholder-update.md` — Stakeholder update template
- `templates/weekly-summary.md` — Weekly summary template

### Install
- `install.sh` — One-command installer (source of truth for install steps)
- `CLAUDE.md` — Project-level instructions that Claude Code loads automatically

### Requirements
- `.planning/REQUIREMENTS.md` §Documentation — DOCS-01, DOCS-02, DOCS-03

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **README.md**: 10-line placeholder — will be fully replaced
- **8 skill SKILL.md files**: Each contains full behavior description that can be summarized for README
- **engin.md**: 7 capabilities section is the source of truth for the Engin table
- **install.sh**: Existing installer — README install steps should match its actual usage

### Established Patterns
- Spatial branding vocabulary: signals, constellations, missions, coordinates, drifting — used in terminal output only, NOT in README prose
- Skill names follow `/orbit-*` convention
- BRND-04: Every skill completion suggests next step (relevant for workflow grouping)

### Integration Points
- README is the entry point for the GitHub repo — no other documentation files
- install.sh is referenced from README install section
- Granola MCP setup is an optional enhancement path

</code_context>

<specifics>
## Specific Ideas

- Hero pitch: "An open-source Claude Code plugin that makes Product Managers 100x productive."
- Source accuracy: "meeting notes, insights, and conversations from Granola, Jira, and Slack"
- Install speaks to Claude Code users naturally — they know the tool, reference it directly
- Workflow grouping: "Get started" → "Daily workflow" → "Deep analysis"
- Engin intro line: "cites sources, challenges your assumptions, and gives opinionated answers — not just summaries"
- Scope one-liner: "No code to write. No infrastructure to deploy. No SaaS subscription. Just Claude Code skills and markdown."
- Language note: "Orbit responds in your language. Write in Spanish, get answers in Spanish."

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-documentation*
*Context gathered: 2026-03-30*
