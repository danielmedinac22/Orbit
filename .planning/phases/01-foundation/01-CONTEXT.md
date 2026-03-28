# Phase 1: Foundation - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Create the `orbit-pm/` repo structure with install.sh, CLAUDE.md, `/orbit-init` skill, and `/orbit-status` skill. After this phase, a PM can clone the repo, run install.sh in their project, run `/orbit-init` to set up a workspace, and run `/orbit-status` to see it.

</domain>

<decisions>
## Implementation Decisions

### Install Experience
- **Merge strategy:** install.sh adds Orbit files without touching existing .claude/ content. If an Orbit-specific file already exists, ask before overwriting.
- **Separate step:** install.sh only copies files. It does NOT auto-run /orbit-init. Prints "Run /orbit-init to set up your workspace." at the end.
- **Distribution:** Clone + install.sh. No curl one-liner for MVP.
- **What gets installed:** .claude/skills/*, .claude/agents/*, templates/, CLAUDE.md content (appended), .claude/settings.json hooks (merged).

### Init Flow
- **All at once:** Claude asks one freeform prompt covering name, role, company, projects, goals, stakeholders. User responds naturally. Claude extracts and writes config.md.
- **Language:** Auto-detect user's language. If they write in Spanish, respond in Spanish. Multilingual from the start.
- **Seed data:** Include one sample note during init so /orbit-status shows something meaningful immediately and the user understands the note format.
- **MCP detection:** Report available MCPs (Granola, Atlassian, Slack) during init so user knows what's available for /orbit-ingest.

### Status Output
- **Branding level:** Claude's discretion — calibrate spatial branding based on workspace content. More spatial when there's data, simpler when workspace is empty or sparse.
- **Next step suggestions:** Always suggest what to do next based on state. Empty workspace? "Run /orbit-ingest". No brief? "Run /orbit-brief". Overdue items? Highlight them.

### Repo Structure
- **Clean repo:** orbit-pm/ contains ONLY what the user needs. Design docs (mvp/01-06) stay in parent /Orbit/ directory, excluded from published repo.
- **No examples directory:** The sample note from /orbit-init is sufficient. Keep repo minimal.
- **License:** MIT

### Claude's Discretion
- Exact install.sh implementation details (bash patterns, error handling)
- How to merge .claude/settings.json hooks with existing hooks
- Sample note content (realistic PM meeting scenario)
- Exact formatting of /orbit-status output (spatial calibration)
- CLAUDE.md phrasing and structure

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Architecture & Structure
- `mvp/02-ARCHITECTURE.md` — Defines the complete repo structure, .orbit/ directory layout, file formats (note frontmatter, config, theme metadata), agent frontmatter definitions, hooks configuration pattern
- `mvp/05-SKILLS.md` — Defines SKILL.md frontmatter format for orbit-init and orbit-status, flow descriptions, MCP detection approach

### Prompts & Agent Definitions
- `mvp/04-PROMPTS.md` — Astro and Engin agent definitions with frontmatter (model, memory, tools, disallowedTools). Phase 1 only needs the structural definitions, not full prompts.

### Branding
- `mvp/06-BRANDING.md` — Vocabulary map (signals, constellations, missions, coordinates), agent voices, skill output message templates, visual identity (◉, ★, ○, ⚠️), README tone guide

### Project Context
- `mvp/01-CONTEXT.md` — What Orbit is, 100x PM framing, MCP ecosystem, open-source roadmap

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project. orbit-pm/ directory doesn't exist yet.

### Established Patterns
- Claude Code skills: `.claude/skills/<name>/SKILL.md` with YAML frontmatter (name, description, argument-hint, allowed-tools)
- Claude Code agents: `.claude/agents/<name>.md` with YAML frontmatter (name, description, model, memory, tools, disallowedTools)
- Claude Code hooks: `.claude/settings.json` with `hooks.PostToolUse` array

### Integration Points
- The install target is the user's existing project with its own .claude/ directory
- CLAUDE.md content is appended (not replaced) to preserve user's existing project instructions

</code_context>

<specifics>
## Specific Ideas

- "Este espacio es para PMs que quieren construir sistemas reales." — Daniel's voice should be felt in the README
- Sample note should be realistic: a product standup or sprint review with real-sounding decisions and action items
- The `◉ Orbit station online.` message from 06-BRANDING.md should appear on successful init

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-28*
