# Phase 4: Documentation - Research

**Researched:** 2026-03-30
**Domain:** Technical README authoring — GitHub-first documentation for a Claude Code plugin
**Confidence:** HIGH

## Summary

Phase 4 is a single-file documentation phase: replace the current 10-line README.md placeholder with a complete, self-contained reference that lets a technical PM go from zero to a working Orbit workspace without reading any other file. All source material already exists in the repo — the task is synthesis and presentation, not discovery.

All canonical sources have been read in full: all 8 SKILL.md files, engin.md (with its explicit 7-capabilities enumeration), astro.md, install.sh, and the current README placeholder. The decisions in CONTEXT.md are highly specific — structure, tone, example style, Engin table format — leaving very little ambiguity for the planner. The only open authoring choices are exact section ordering within the document and granularity of example output snippets.

The implementation is pure markdown authoring. There is no code, no tests, no infrastructure. Nyquist validation applies only in concept: the "test" is a human review checklist verifying each success criterion is satisfied by the written content.

**Primary recommendation:** Write README.md as a single-task plan. Planner should define a single task: author README.md from scratch using the locked structure from CONTEXT.md, sourcing all descriptions and examples from the canonical SKILL.md and engin.md files already read during research.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**README Structure & Flow**
- D-01: Product-first pitch as hero — lead with what Orbit IS, what it does, and "Zero infrastructure" differentiator. NOT problem-first, NOT demo-first.
- D-02: Clarify source types accurately — meeting notes come from Granola; insights/issues from Jira; conversations from Slack. Don't say "meeting notes from Jira."
- D-03: Minimal install instructions — 3 steps max (clone, install, init). Reference Claude Code naturally since the audience is already using it. Granola MCP setup as separate optional section.
- D-04: Skills organized in two layers: first a workflow grouping ("Get started", "Daily workflow", "Deep analysis") showing HOW skills chain together, then a compact reference table with one-liner + example per skill.
- D-05: Brief one-liner scope statement: "No code. No infra. No SaaS. Just Claude Code skills and markdown." — no dedicated "What Orbit is NOT" section.

**Usage Examples Style**
- D-06: Markdown fenced code blocks for all examples (command + representative output snippet). No terminal screenshots.
- D-07: Realistic PM scenarios in examples — sprint reviews, stakeholder calls, product decisions. No generic placeholders.

**Engin Capabilities Showcase**
- D-08: Compact table format — one row per capability with "Ask about" column and "Example query" column. All 7 capabilities listed.
- D-09: Brief mention of Engin's personality: "cites sources, challenges assumptions, gives opinionated answers — not just summaries." Let PMs discover the full voice organically.

**Tone & Identity**
- D-10: Product-confident voice. Direct statements: "Orbit does X." No hedging, no "might" or "can help." Daniel's product-first energy without being personal/founder-voice.
- D-11: English only. Mention that Orbit auto-detects language at runtime ("Write in Spanish, get answers in Spanish").

### Claude's Discretion
- Exact section ordering within the README (as long as workflow grouping comes before reference table)
- Granola MCP setup instructions detail level
- How many lines of example output to show per skill
- Phrasing of the scope one-liner

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DOCS-01 | README.md with: what Orbit is, install instructions, quick start, Granola setup, skill reference | Install steps sourced from install.sh (3 actual steps: clone, `bash install.sh`, `/orbit-init`). Granola MCP setup requires a separate optional section. Skill reference sourced from all 8 SKILL.md files. |
| DOCS-02 | README shows real usage examples for each skill | Each SKILL.md contains argument hints, completion message formats, and output format examples — direct source for realistic fenced code blocks. 8 skills total. |
| DOCS-03 | README documents Engin's 7 capabilities with example queries | engin.md §"Your 7 Capabilities" is the authoritative source. All 7 capabilities are named, described, and trigger conditions documented. |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Markdown (GitHub Flavored) | — | README format | GitHub renders GFM natively; fenced code blocks, tables, and headers all render correctly |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Fenced code blocks | — | Skill examples with output | D-06 mandates this; GitHub renders with syntax highlighting |
| Markdown tables | — | Engin capabilities, skill reference | D-08 mandates table format for Engin; skill reference table is also appropriate |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Fenced code block examples | Collapsible `<details>` sections | Details/summary hides content; for a first-time reader everything should be visible |
| Markdown table for Engin | Numbered list per capability | Table is more scannable per D-08; list would require more vertical space |

**Installation:** None. This phase produces a single markdown file.

---

## Architecture Patterns

### README Section Structure

Based on locked decisions and synthesized content requirements:

```
README.md
├── Hero section            # D-01: product-first pitch, one-liner scope (D-05)
├── How it works            # 2-agent model (Astro + Engin), auto-hook
├── Install                 # D-03: 3 steps — clone, bash install.sh, /orbit-init
├── Skills — workflow view  # D-04 layer 1: "Get started", "Daily workflow", "Deep analysis"
├── Skills — reference      # D-04 layer 2: compact table with one-liner + example per skill
├── Ask Engin               # D-08: 7-capability table + D-09 personality note
├── Granola MCP setup       # D-03: optional section, separate from main install
└── Language note           # D-11: auto-detect mention
```

Note: exact ordering within this structure is Claude's discretion per CONTEXT.md, except workflow grouping must precede reference table.

### Workflow Grouping (D-04 layer 1)

The three workflow groups, with skill assignment:

| Group | Skills | Purpose shown |
|-------|--------|---------------|
| Get started | `/orbit-init`, `/orbit-ingest` | First-run sequence |
| Daily workflow | `/orbit-status`, `/orbit-brief` | Morning routine |
| Deep analysis | `/orbit-priorities`, `/orbit-decisions`, `/orbit-prep`, `/orbit-artifact` | Strategic work |

### Install Steps (sourced from install.sh)

The actual install.sh does exactly 3 things a user needs to run:

```bash
# Step 1: clone
git clone https://github.com/danieljmedina/orbit.git

# Step 2: install (run from your project root, not the Orbit repo)
bash /path/to/orbit/install.sh

# Step 3: init workspace
/orbit-init
```

install.sh copies agents, skills, settings, CLAUDE.md, and templates into the target directory. It does NOT run `/orbit-init` — that is an explicit design decision from STATE.md.

### Granola MCP Setup (optional section)

Granola MCP enables the highest-value ingestion path (`/orbit-ingest --granola`). Setup is an optional section per D-03. The detail level is Claude's discretion. What must be accurate:
- Granola is a macOS meeting notes app
- The MCP server is separate from the Granola app itself
- Once configured in Claude Code's MCP settings, `/orbit-ingest` detects it automatically (no config needed inside Orbit)

### Anti-Patterns to Avoid

- **Hedging language:** D-10 prohibits "might", "can help", "could". Write "Orbit does X."
- **Spatial vocabulary in prose:** Branding terms (signals, constellations, missions, coordinates) live in terminal output only — not in README prose. Confirmed in STATE.md and SKILL.md implementation notes.
- **Generic placeholders in examples:** D-07 requires realistic PM scenarios. No "your-project" or "topic-here" placeholders.
- **Inaccurate source descriptions:** D-02 — Granola = meeting notes, Jira = insights/issues, Slack = conversations. Do not conflate.
- **More than 3 install steps:** D-03 is explicit. Granola MCP setup is a separate section, not an install step.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Skill descriptions | Paraphrase from memory | Read from SKILL.md frontmatter `description:` field | SKILL.md descriptions are already one-liner accurate; paraphrasing risks inaccuracy |
| Engin capabilities list | Derive from behavior | Copy from engin.md §"Your 7 Capabilities" headings | engin.md is the source of truth per CONTEXT.md canonical refs |
| Install steps | Guess from project structure | Source from install.sh sections 1-7 | install.sh is the source of truth for what actually gets installed |
| Example output snippets | Invent | Derive from SKILL.md output format sections | Every SKILL.md has an explicit output format with realistic examples |

**Key insight:** Every content element needed for the README already exists in source files. This is a synthesis task, not a content-creation task.

---

## Engin's 7 Capabilities (sourced from engin.md)

This is the authoritative list per CONTEXT.md canonical refs. The planner/implementer MUST use these exact capability names and trigger conditions:

| # | Capability Name | Trigger Phrase | Example Query |
|---|----------------|---------------|---------------|
| 1 | Strategic Synthesis | "What should I focus on?" | "What should I focus on this week?" |
| 2 | Customer Insight Analysis | "Analyze customer feedback" | "What are customers saying about the API?" |
| 3 | RICE Prioritization | "Help me prioritize" | "Help me prioritize the Q2 backlog" |
| 4 | Decision Tracking | "What decisions are stalling?" | "What decisions are stalling on the launch?" |
| 5 | Meeting Preparation | "Prepare for my stakeholder meeting" | "Prepare for my sprint planning with Sarah and Mike" |
| 6 | Morning/Weekly Brief | implicit via /orbit-brief | "Give me a weekly brief" |
| 7 | Contradiction & Risk Detection | always active / proactive | "Are there any risks I'm missing?" |

---

## Skill Reference Data (sourced from SKILL.md files)

All 8 skills — one-liner descriptions, argument hints, and example invocations:

| Skill | One-liner (from SKILL.md description) | Argument hint | Example invocation |
|-------|--------------------------------------|--------------|-------------------|
| `/orbit-init` | Initialize the Orbit PM workspace. Creates .orbit/ directory and user profile. | `[--sample]` | `/orbit-init` |
| `/orbit-ingest` | Import notes into the Orbit workspace. MCP-first: detects Granola, Jira, Slack and offers them as sources. Fallback to file or paste. | `[file-path \| --granola \| --jira \| --slack]` | `/orbit-ingest --granola 7` |
| `/orbit-status` | Show Orbit workspace status — notes, themes, action items, decisions, artifacts. | — | `/orbit-status` |
| `/orbit-brief` | Generate morning brief or weekly summary. Synthesizes recent notes, action items, decisions, and open questions. | `[daily (default) \| weekly]` | `/orbit-brief weekly` |
| `/orbit-priorities` | Prioritize features and initiatives using RICE scoring. Pulls real evidence from meeting notes for each dimension. | `[theme-name \| 'all']` | `/orbit-priorities launch-readiness` |
| `/orbit-decisions` | Audit decisions across meetings. Find contradictions, stalled decisions, reversals, and unresolved questions. | `[review \| stalled \| contradictions]` | `/orbit-decisions stalled` |
| `/orbit-prep` | Prepare for an upcoming meeting. Gathers topic context, attendee action items, recent decisions, and generates talking points and suggested agenda. | `<meeting-topic> [--attendees 'name1, name2']` | `/orbit-prep "Q2 Planning" --attendees "Sarah, Mike"` |
| `/orbit-artifact` | Generate PM documents from templates using Orbit workspace context. Templates: prd, decision-record, weekly-summary, stakeholder-update, rice-scorecard. | `<template> [--theme <name>] [--title 'Title']` | `/orbit-artifact prd --theme launch-readiness` |

---

## Code Examples

These are verified output format patterns from official source files (SKILL.md), for use in README skill examples.

### /orbit-init completion output (from orbit-init/SKILL.md Step 7)
```
◉ Orbit station online.

  Workspace: .orbit/
  Config:    .orbit/config.md
  Blueprints: 5 templates loaded

  Detected: Granola MCP, Slack MCP

  Next: /orbit-ingest to capture your first signals.
```

### /orbit-ingest completion output (from orbit-ingest/SKILL.md §After Ingestion)
```
Signal scan complete — 4 meetings captured from Granola (last 7 days).

  .orbit/notes/2026-03-28-standup.md
  .orbit/notes/2026-03-27-sprint-review.md
  .orbit/notes/2026-03-26-stakeholder-sync.md
  .orbit/notes/2026-03-24-api-planning.md

Astro is organizing... ✓ [API Redesign], [Launch Readiness], [Security] logged.

Next: /orbit-brief for today's mission briefing.
```

### /orbit-status output (from orbit-status/SKILL.md Step 2)
```
◉ Orbit Station
─────────────────
Signals:        12 captured (4 this week)
Constellations:  3 active, 1 suggested
Missions:        8 active, 2 drifting
Coordinates:     6 locked, 1 conflicting
Payloads:        3 delivered
Last briefing:  2026-03-28

Constellations:
  ★ API Redesign      — 5 signals, 3 active missions
  ★ Launch Readiness  — 4 signals, 4 active missions
  ★ Security          — 3 signals, 1 active mission

Next: 2 missions drifting. Run /orbit-brief to review.
```

### /orbit-priorities completion (from orbit-priorities/SKILL.md §Completion Message)
```
Mission Priority Scan complete.

  Top priority: API v2 Migration (RICE: 216)
  Risk:         Security Audit — single point of failure
  Deprioritized: Mobile redesign (RICE: 22)

  Full scorecard: .orbit/artifacts/rice-scorecard-2026-03-28.md
```

### /orbit-decisions completion (from orbit-decisions/SKILL.md §Completion Message)
```
Coordinate Audit complete.

  ⚠️ 1 conflict found — REST vs GraphQL (contradicts 2026-03-14 decision)
  ↺ 0 reversals detected
  ⏸ 2 uncharted — security vendor, mobile Q2 target
  ✓ 3 stable coordinates

  Recommend: schedule a 15-min call to lock the 2 uncharted coordinates.
```

### /orbit-prep completion (from orbit-prep/SKILL.md §Completion Message)
```
Pre-Launch Check ready for Q2 Planning.

  Crew: 2 attendees briefed
  Agenda: 4 items
  Coordinates to lock: 2 decisions needed
```

### /orbit-artifact completion (from orbit-artifact/SKILL.md §Completion Message)
```
Payload delivered: PRD — API v2 Migration

  .orbit/artifacts/prd.md
  Sources: 8 signals, 6 missions, 4 coordinates

  Review and refine. Run /orbit-artifact prd --theme api-redesign
  again to generate v2 with updates.
```

---

## Common Pitfalls

### Pitfall 1: Spatial vocabulary bleeding into prose
**What goes wrong:** Words like "signals", "constellations", "missions", "coordinates" appear in README explanations rather than only in code block output examples.
**Why it happens:** The codebase is saturated with this vocabulary — it naturally leaks into descriptions.
**How to avoid:** Spatial terms are acceptable ONLY inside fenced code blocks that show terminal output. Use plain PM language in prose: "notes", "themes", "action items", "decisions".
**Warning signs:** Any sentence outside a code block using "signal", "constellation", "coordinate", "drifting", "payload", "mission".

### Pitfall 2: Engin capability count mismatch
**What goes wrong:** README lists 6 or 8 capabilities instead of 7.
**Why it happens:** Capability 7 ("Contradiction & Risk Detection") is described as "always active" and easy to overlook as a distinct capability vs. a behavior modifier.
**How to avoid:** Copy the exact 7 capability names from engin.md §"Your 7 Capabilities" in order. Verify count before finalizing.
**Warning signs:** Missing "Contradiction & Risk Detection" or conflating it with Decision Tracking.

### Pitfall 3: Install step count exceeding 3
**What goes wrong:** README lists 4+ install steps by including Granola setup, CLAUDE.md explanation, or `/orbit-status` verification inline.
**Why it happens:** It's tempting to be thorough in an install section.
**How to avoid:** Granola setup is a separate optional section (D-03). 3 steps only: clone → `bash install.sh` → `/orbit-init`.
**Warning signs:** Numbered list with items beyond 3 before the next section header.

### Pitfall 4: Example output that doesn't match actual SKILL.md format
**What goes wrong:** README examples look plausible but use different field labels, vocabulary, or structure than what Orbit actually outputs.
**Why it happens:** Authors approximate output from memory rather than deriving from SKILL.md output format sections.
**How to avoid:** All example output MUST be derived from the output format sections in SKILL.md files, not invented. Verified examples are in the Code Examples section above.
**Warning signs:** Example output missing spatial vocabulary in completion messages (e.g., "◉", "★", "⚠️" markers that actual skills use).

### Pitfall 5: Hedging language
**What goes wrong:** "Orbit can help you track decisions" instead of "Orbit tracks decisions".
**Why it happens:** Default writing instinct is cautious.
**How to avoid:** D-10 is a hard constraint. Before finalizing, scan for: "can", "might", "could", "help you", "allows you to", "enables". Replace all with direct statements.
**Warning signs:** Any occurrence of the words above in README prose.

---

## Runtime State Inventory

Step 2.5: SKIPPED. This is a greenfield documentation phase — no renaming, refactoring, or migration of runtime state. The only file being modified is README.md (replaced from a 10-line placeholder). No stored data, live service config, OS-registered state, secrets, or build artifacts are affected.

---

## Environment Availability

Step 2.6: SKIPPED. This phase produces a single markdown file. No external tools, services, CLIs, runtimes, or databases are required. The implementation tool is the Write tool.

---

## Validation Architecture

nyquist_validation is `true` in .planning/config.json. However, this phase produces a markdown documentation file — there is no test framework applicable. Validation is a human review checklist against the 3 success criteria.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual review (no automated test framework applicable) |
| Config file | none |
| Quick run command | Human review against checklist below |
| Full suite command | Human review against all 3 success criteria |

### Phase Requirements → Verification Map

| Req ID | Behavior | Test Type | Verification Method | Automated? |
|--------|----------|-----------|---------------------|------------|
| DOCS-01 | README has install instructions, what Orbit is, Granola setup, skill reference | Manual review | Open README.md, verify each section exists and install steps are 3 or fewer | No — content review |
| DOCS-02 | README shows real usage example for each of 8 skills | Manual review | Count fenced code block examples, verify all 8 `/orbit-*` skills are present | No — content review |
| DOCS-03 | README documents Engin's 7 capabilities with example queries | Manual review | Find Engin capabilities table, count rows (must be 7), verify example query column is populated | No — content review |

### Success Criteria Gate (from phase definition)

Before marking phase complete, verify ALL three are true:

1. **DOCS-01 pass:** A technical PM can follow the install section from zero to working Orbit in under 5 minutes, including the Granola MCP setup path (in its own optional section).
2. **DOCS-02 pass:** README contains at least one fenced code block example per skill — all 8 skills: `/orbit-init`, `/orbit-ingest`, `/orbit-status`, `/orbit-brief`, `/orbit-priorities`, `/orbit-decisions`, `/orbit-prep`, `/orbit-artifact`.
3. **DOCS-03 pass:** Engin capabilities table has exactly 7 rows, with "Ask about" column and "Example query" column populated for each.

### Wave 0 Gaps

None — no test infrastructure needed. Implementation is a single Write task.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| README.md placeholder (10 lines) | Full self-contained README | Phase 4 | Repo becomes publicly presentable |

**Current placeholder content:**
```
# Orbit
An open-source Claude Code plugin that makes Product Managers 100x productive.
...
*Full documentation coming in Phase 4. See install.sh for installation.*
```
This will be fully replaced.

---

## Open Questions

1. **Granola MCP setup detail level**
   - What we know: Granola MCP is a separate server from the Granola app; Claude Code must be configured to connect to it; once configured, `/orbit-ingest` detects it automatically.
   - What's unclear: The exact configuration steps (MCP server URL, config file path) depend on Granola's current MCP server release, which may have changed since training data. The planner/implementer should reference the Granola MCP documentation link or use a generic "add to your Claude Code MCP config" instruction that won't go stale.
   - Recommendation: Keep Granola MCP setup instructions at the "what to configure" level (point to official Granola docs) rather than exact step-by-step, so the README doesn't become stale when Granola updates their MCP server.

2. **GitHub repo URL for clone step**
   - What we know: install.sh references `"$SCRIPT_DIR"` (relative path); the README needs an absolute clone URL.
   - What's unclear: The public GitHub repo URL is not documented in any project file read.
   - Recommendation: Planner should use a placeholder `https://github.com/<owner>/orbit` and flag it for Daniel to fill in, or omit the full URL and say "clone this repository".

---

## Sources

### Primary (HIGH confidence)
- `/Users/danielmedina/Documents/Orbit/.claude/skills/orbit-init/SKILL.md` — full skill behavior, output format, completion messages
- `/Users/danielmedina/Documents/Orbit/.claude/skills/orbit-ingest/SKILL.md` — 5-source ingestion flow, output format
- `/Users/danielmedina/Documents/Orbit/.claude/skills/orbit-status/SKILL.md` — spatial output format, vocabulary mapping
- `/Users/danielmedina/Documents/Orbit/.claude/skills/orbit-brief/SKILL.md` — daily/weekly brief formats
- `/Users/danielmedina/Documents/Orbit/.claude/skills/orbit-priorities/SKILL.md` — RICE scoring output format
- `/Users/danielmedina/Documents/Orbit/.claude/skills/orbit-decisions/SKILL.md` — coordinate audit output format
- `/Users/danielmedina/Documents/Orbit/.claude/skills/orbit-prep/SKILL.md` — prep output format
- `/Users/danielmedina/Documents/Orbit/.claude/skills/orbit-artifact/SKILL.md` — artifact completion format
- `/Users/danielmedina/Documents/Orbit/.claude/agents/engin.md` — 7 capabilities (authoritative), communication rules
- `/Users/danielmedina/Documents/Orbit/.claude/agents/astro.md` — organization agent behavior
- `/Users/danielmedina/Documents/Orbit/install.sh` — actual 3-step install flow
- `/Users/danielmedina/Documents/Orbit/.planning/phases/04-documentation/04-CONTEXT.md` — all locked decisions (D-01 through D-11)

### Secondary (MEDIUM confidence)
- `/Users/danielmedina/Documents/Orbit/.planning/STATE.md` — spatial vocabulary constraints verified across phases
- `/Users/danielmedina/Documents/Orbit/.planning/REQUIREMENTS.md` — DOCS-01, DOCS-02, DOCS-03 definitions

---

## Metadata

**Confidence breakdown:**
- Content inventory (skills, Engin capabilities): HIGH — read directly from source files
- Install steps: HIGH — sourced from install.sh, matches 3-step constraint
- README structure: HIGH — locked decisions in CONTEXT.md are specific and complete
- Granola MCP setup detail: MEDIUM — exact config steps depend on Granola's current MCP release, not in project files
- GitHub repo URL: LOW — not found in any project file

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (stable domain — markdown documentation, no external dependencies)
