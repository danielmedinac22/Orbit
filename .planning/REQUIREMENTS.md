# Requirements: Orbit

**Defined:** 2026-03-28
**Core Value:** A PM imports meetings, gets them auto-organized, and uses that context to make better decisions faster — via briefs, prioritization, decision audits, meeting prep, and artifact generation.

## v1 Requirements

### Foundation

- [x] **FOUND-01**: Repo has CLAUDE.md with project-level instructions that Claude Code loads automatically
- [x] **FOUND-02**: `install.sh` copies skills, agents, and settings into user's project in one command
- [x] **FOUND-03**: `/orbit-init` creates `.orbit/` directory structure with config, notes, themes, action-items, decisions, briefs, artifacts, templates, index
- [x] **FOUND-04**: `/orbit-init` asks user for name, role, company, projects, goals, stakeholders and writes `config.md`
- [x] **FOUND-05**: `/orbit-init` detects available MCP servers (Granola, Atlassian, Slack) and reports them
- [x] **FOUND-06**: `/orbit-status` reads `.orbit/` and displays formatted workspace overview (notes count, themes, actions, decisions, artifacts, last brief)

### Ingestion

- [ ] **INGS-01**: `/orbit-ingest` presents guided flow asking user where to bring notes from (based on detected MCPs + manual options)
- [ ] **INGS-02**: Granola MCP path: user specifies date range, Claude fetches meetings and writes standard notes to `.orbit/notes/`
- [ ] **INGS-03**: File path: user provides file, Claude reads and generates structured note with summary, key points, decisions, action items, participants
- [ ] **INGS-04**: Paste path: user pastes content in conversation, Claude generates structured note
- [ ] **INGS-05**: Jira MCP path: user specifies project/JQL, Claude fetches issues and writes as notes
- [ ] **INGS-06**: Slack MCP path: user specifies channel/thread, Claude fetches digest and writes as note
- [ ] **INGS-07**: All notes follow standard format: YAML frontmatter (title, date, source, participants, themes, decisions, questions, action_items) + markdown body

### Organization (Astro Agent)

- [ ] **ASTR-01**: Astro agent defined in `.claude/agents/astro.md` with model: sonnet, memory: project, restricted tools
- [ ] **ASTR-02**: Astro reads unorganized notes (themes: [] in frontmatter) and assigns themes semantically (synonyms, translations, abbreviations)
- [ ] **ASTR-03**: Astro extracts action items from notes and writes to `.orbit/themes/<theme>/action-items.md` (deduplicating)
- [ ] **ASTR-04**: Astro suggests new themes in `.orbit/themes/_suggested/` when content doesn't fit existing themes
- [ ] **ASTR-05**: Astro updates `.orbit/action-items/pending.md` (global view across themes)
- [ ] **ASTR-06**: Astro logs decisions from note frontmatter to `.orbit/decisions/log.md`
- [ ] **ASTR-07**: Astro rebuilds `.orbit/index.md` (knowledge index with theme overview, cross-theme patterns, counts)
- [ ] **ASTR-08**: Hook in `.claude/settings.json` auto-triggers Astro after a note is written to `.orbit/notes/`

### Synthesis (Engin Agent)

- [ ] **ENGN-01**: Engin agent defined in `.claude/agents/engin.md` with memory: project, inherit model, WebSearch access
- [ ] **ENGN-02**: Engin answers PM questions with cited sources: "(from Meeting Title, YYYY-MM-DD)"
- [ ] **ENGN-03**: Engin distinguishes decisions (confirmed) from discussions (open) from inference (analysis)
- [ ] **ENGN-04**: Engin's persistent memory accumulates context across sessions (stakeholder dynamics, PM preferences, workspace patterns)

### Briefs

- [ ] **BREF-01**: `/orbit-brief` generates daily briefing: overdue items first, key updates by theme, pending actions, open questions
- [ ] **BREF-02**: `/orbit-brief weekly` generates weekly summary: theme progress, decision velocity, action burndown
- [ ] **BREF-03**: Briefs written to `.orbit/briefs/YYYY-MM-DD.md` AND displayed in conversation

### Prioritization

- [ ] **PRIO-01**: `/orbit-priorities` identifies candidate features/initiatives from notes and themes
- [ ] **PRIO-02**: Scores each candidate using RICE dimensions with evidence from meetings (Reach, Impact, Confidence, Effort)
- [ ] **PRIO-03**: Generates ranked scorecard artifact at `.orbit/artifacts/rice-scorecard-YYYY-MM-DD.md`
- [ ] **PRIO-04**: Challenges PM when data contradicts assumptions ("You rated X high but it hasn't come up in 3 weeks")

### Decision Tracking

- [ ] **DCSN-01**: `/orbit-decisions` reviews full decision log from `.orbit/decisions/log.md`
- [ ] **DCSN-02**: Detects stalled decisions: confirmed but no action items followed within 7 days
- [ ] **DCSN-03**: Detects contradictions: conflicting decisions across different meetings
- [ ] **DCSN-04**: Suggests resolution actions ("Schedule a 15-min call to lock these coordinates")

### Meeting Prep

- [ ] **PREP-01**: `/orbit-prep <topic>` gathers context relevant to meeting topic from notes and themes
- [ ] **PREP-02**: For named attendees, pulls their action items, recent mentions, open questions
- [ ] **PREP-03**: Generates suggested agenda, talking points, risk areas, and decisions needed
- [ ] **PREP-04**: Optionally writes to `.orbit/briefs/prep-YYYY-MM-DD-topic.md`

### Artifacts

- [ ] **ARTF-01**: `/orbit-artifact <template>` reads template from `.orbit/templates/` and generates document
- [ ] **ARTF-02**: Gathers context from notes, action items, decisions for specified theme (or all themes)
- [ ] **ARTF-03**: Handles versioning: detects existing artifact, creates -v2, -v3
- [ ] **ARTF-04**: 5 built-in templates: PRD, Decision Record, Weekly Summary, Stakeholder Update, RICE Scorecard

### Branding

- [ ] **BRND-01**: Astro messages use navigator voice: "Signal scan complete. 4 signals → 3 constellations. Star chart updated."
- [ ] **BRND-02**: Engin messages use advisor voice: direct, opinionated, uses "drifting" for overdue, "coordinates" for decisions
- [ ] **BRND-03**: `/orbit-status` uses spatial formatting: ◉ Orbit Station, ★ for themes, missions for action items
- [ ] **BRND-04**: All skill completion messages suggest the logical next step

### Documentation

- [ ] **DOCS-01**: README.md with: what Orbit is, install instructions, quick start, Granola setup, skill reference
- [ ] **DOCS-02**: README shows real usage examples for each skill
- [ ] **DOCS-03**: README documents Engin's 7 capabilities with example queries

## v2 Requirements

### Multi-Platform
- **PLAT-01**: Codex CLI adapter
- **PLAT-02**: Gemini CLI adapter
- **PLAT-03**: Cursor rules adapter

### Automation
- **AUTO-01**: Desktop scheduled task for daily brief at configured time
- **AUTO-02**: Stale decision alerts via `/loop` pattern
- **AUTO-03**: Weekly summary auto-generation

### Advanced Ingestion
- **INGS-08**: Google Calendar MCP integration
- **INGS-09**: Notion MCP integration
- **INGS-10**: Linear MCP integration
- **INGS-11**: PostHog MCP integration for analytics context

### Community
- **COMM-01**: Community template library (contributed by users)
- **COMM-02**: Contributing guide for template and prompt contributions

## Out of Scope

| Feature | Reason |
|---------|--------|
| TypeScript CLI / npm package | Zero-code constraint — pure prompts and markdown |
| Web UI / dashboard | Terminal-first, file-based approach |
| Database / vector DB | Claude Code context window replaces search |
| HTML/PDF export | Post-MVP, low priority vs core flow |
| Real-time sync | Files + git are the sync mechanism |
| User authentication | Local files, no auth needed |
| Custom template creation command | Users create .md files directly |
| Rocket emojis / cartoon branding | Sleek space station aesthetic, not cartoon |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 - Foundation | Complete |
| FOUND-02 | Phase 1 - Foundation | Complete |
| FOUND-03 | Phase 1 - Foundation | Complete |
| FOUND-04 | Phase 1 - Foundation | Complete |
| FOUND-05 | Phase 1 - Foundation | Complete |
| FOUND-06 | Phase 1 - Foundation | Complete |
| INGS-01 | Phase 2 - Ingestion + Agents | Pending |
| INGS-02 | Phase 2 - Ingestion + Agents | Pending |
| INGS-03 | Phase 2 - Ingestion + Agents | Pending |
| INGS-04 | Phase 2 - Ingestion + Agents | Pending |
| INGS-05 | Phase 2 - Ingestion + Agents | Pending |
| INGS-06 | Phase 2 - Ingestion + Agents | Pending |
| INGS-07 | Phase 2 - Ingestion + Agents | Pending |
| ASTR-01 | Phase 2 - Ingestion + Agents | Pending |
| ASTR-02 | Phase 2 - Ingestion + Agents | Pending |
| ASTR-03 | Phase 2 - Ingestion + Agents | Pending |
| ASTR-04 | Phase 2 - Ingestion + Agents | Pending |
| ASTR-05 | Phase 2 - Ingestion + Agents | Pending |
| ASTR-06 | Phase 2 - Ingestion + Agents | Pending |
| ASTR-07 | Phase 2 - Ingestion + Agents | Pending |
| ASTR-08 | Phase 2 - Ingestion + Agents | Pending |
| ENGN-01 | Phase 2 - Ingestion + Agents | Pending |
| ENGN-02 | Phase 2 - Ingestion + Agents | Pending |
| ENGN-03 | Phase 2 - Ingestion + Agents | Pending |
| ENGN-04 | Phase 2 - Ingestion + Agents | Pending |
| BRND-01 | Phase 2 - Ingestion + Agents | Pending |
| BRND-02 | Phase 2 - Ingestion + Agents | Pending |
| BRND-03 | Phase 2 - Ingestion + Agents | Pending |
| BRND-04 | Phase 2 - Ingestion + Agents | Pending |
| BREF-01 | Phase 3 - Intelligence Skills | Pending |
| BREF-02 | Phase 3 - Intelligence Skills | Pending |
| BREF-03 | Phase 3 - Intelligence Skills | Pending |
| PRIO-01 | Phase 3 - Intelligence Skills | Pending |
| PRIO-02 | Phase 3 - Intelligence Skills | Pending |
| PRIO-03 | Phase 3 - Intelligence Skills | Pending |
| PRIO-04 | Phase 3 - Intelligence Skills | Pending |
| DCSN-01 | Phase 3 - Intelligence Skills | Pending |
| DCSN-02 | Phase 3 - Intelligence Skills | Pending |
| DCSN-03 | Phase 3 - Intelligence Skills | Pending |
| DCSN-04 | Phase 3 - Intelligence Skills | Pending |
| PREP-01 | Phase 3 - Intelligence Skills | Pending |
| PREP-02 | Phase 3 - Intelligence Skills | Pending |
| PREP-03 | Phase 3 - Intelligence Skills | Pending |
| PREP-04 | Phase 3 - Intelligence Skills | Pending |
| ARTF-01 | Phase 3 - Intelligence Skills | Pending |
| ARTF-02 | Phase 3 - Intelligence Skills | Pending |
| ARTF-03 | Phase 3 - Intelligence Skills | Pending |
| ARTF-04 | Phase 3 - Intelligence Skills | Pending |
| DOCS-01 | Phase 4 - Documentation | Pending |
| DOCS-02 | Phase 4 - Documentation | Pending |
| DOCS-03 | Phase 4 - Documentation | Pending |

**Coverage:**
- v1 requirements: 47 total
- Mapped to phases: 47
- Unmapped: 0

---
*Requirements defined: 2026-03-28*
*Last updated: 2026-03-28 after roadmap creation*
