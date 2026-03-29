---
phase: 01-foundation
verified: 2026-03-29T12:43:37Z
status: passed
score: 5/5 must-haves verified
re_verification: false
gaps: []
human_verification:
  - test: "Run /orbit-init in a project where Claude Code is active"
    expected: "Claude asks one freeform question, writes .orbit/config.md, creates full .orbit/ tree, writes sample note with themes:[], detects MCPs, and prints '◉ Orbit station online.'"
    why_human: "Skill execution requires an active Claude Code session; cannot verify the runtime prompt flow programmatically"
  - test: "Run /orbit-status after orbit-init completes"
    expected: "Displays '◉ Orbit Station' header with Signals/Constellations/Missions/Coordinates/Payloads counts and a Next: suggestion"
    why_human: "Skill output formatting and spatial vocabulary correctness requires live Claude Code execution"
---

# Phase 1: Foundation Verification Report

**Phase Goal:** A PM can install Orbit in one command and end up with a configured workspace they can inspect
**Verified:** 2026-03-29T12:43:37Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (from ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Running `bash install.sh` copies all skills, agents, and settings into the user's project with no additional steps | VERIFIED | Live smoke test confirmed: all 8 skills, 2 agents, settings.json, CLAUDE.md, and 5 templates installed to /tmp directory in one command; output ended with "Orbit installed successfully. Run /orbit-init to set up your workspace." |
| 2 | CLAUDE.md exists at repo root and Claude Code loads project-level instructions automatically on session start | VERIFIED | `orbit-pm/CLAUDE.md` exists (23 lines) with exact marker `# Orbit — Context Copilot for Product Managers`, all 7 Rules, directory map, and 8 skill references. File is at repo root — Claude Code auto-loads it on session start. |
| 3 | Running `/orbit-init` asks for name, role, company, projects, goals, and stakeholders, then writes `config.md` and creates the full `.orbit/` directory tree | VERIFIED | `orbit-init/SKILL.md` (236 lines) contains: single freeform question covering all 6 fields, `config.md` write with YAML frontmatter (name/role/company/projects/max_themes/language) plus Goals and Key Stakeholders sections, full `.orbit/` tree creation with seeded `decisions/log.md`, `action-items/pending.md`, and `index.md` |
| 4 | Running `/orbit-init` reports which MCP servers (Granola, Atlassian, Slack) are available in the current environment | VERIFIED | `orbit-init/SKILL.md` contains detection logic for `granola`/`mcp__*granola*`, `mcp__claude_ai_Atlassian__*`, and `mcp__claude_ai_Slack__*` tool patterns; completion message adapts "Detected:" line based on results |
| 5 | Running `/orbit-status` displays a formatted overview showing notes count, themes, pending actions, decisions, artifacts, and last brief date | VERIFIED | `orbit-status/SKILL.md` (156 lines) implements: existence check, data collection across 5 categories (notes/themes/actions/decisions/artifacts), full spatial output with `◉ Orbit Station` header, `Signals`/`Constellations`/`Missions`/`Coordinates`/`Payloads` vocabulary, `★`/`○` symbols for themes, and contextual `Next:` suggestions |

**Score:** 5/5 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `orbit-pm/CLAUDE.md` | Project-level instructions for Claude Code | VERIFIED | Exists, 23 lines, contains idempotency marker, 7 rules, `.orbit/` directory map, 8 skill references |
| `orbit-pm/LICENSE` | MIT license | VERIFIED | Exists, contains "MIT License" text |
| `orbit-pm/.claude/settings.json` | PostToolUse hook structure | VERIFIED | Exists, valid JSON, PostToolUse hook with Write matcher watching `.orbit/notes/` writes |
| `orbit-pm/README.md` | Placeholder README | VERIFIED | Exists with branding-compliant opening from spec |
| `orbit-pm/.claude/agents/astro.md` | Astro organization agent | VERIFIED | 96 lines, correct YAML frontmatter (name: astro, model: sonnet, memory: project, tools, disallowedTools including WebFetch), full system prompt with Theme Assignment section and Rules |
| `orbit-pm/.claude/agents/engin.md` | Engin PM advisor agent | VERIFIED | 139 lines, correct YAML frontmatter (name: engin, model: inherit, memory: project, WebSearch in tools, only Bash disallowed), full system prompt with 7 Capabilities and "Always cite sources" rule |
| `orbit-pm/templates/prd.md` | PRD template | VERIFIED | Exists, `template: prd` frontmatter, realistic sections |
| `orbit-pm/templates/decision-record.md` | Decision Record template | VERIFIED | Exists, `template: decision-record` frontmatter |
| `orbit-pm/templates/weekly-summary.md` | Weekly Summary template | VERIFIED | Exists, `template: weekly-summary` frontmatter |
| `orbit-pm/templates/stakeholder-update.md` | Stakeholder Update template | VERIFIED | Exists, `template: stakeholder-update` frontmatter |
| `orbit-pm/templates/rice-scorecard.md` | RICE Scorecard template | VERIFIED | Exists, `template: rice-scorecard` frontmatter, scoring guide and Challenge section present |
| `orbit-pm/.claude/skills/orbit-init/SKILL.md` | orbit-init skill | VERIFIED | 236 lines, name:orbit-init, no allowed-tools (correct), config.md creation, full .orbit/ tree, MCP detection (Granola/Atlassian/Slack), "◉ Orbit station online." completion message, idempotency check |
| `orbit-pm/.claude/skills/orbit-status/SKILL.md` | orbit-status skill | VERIFIED | 156 lines, name:orbit-status, allowed-tools:[Read,Glob,Grep], full spatial output format, drifting vocabulary, plain error message |
| `orbit-pm/.claude/skills/orbit-ingest/SKILL.md` | orbit-ingest skill | VERIFIED | Exists, name:orbit-ingest, themes:[] in note output, "Signal scan complete" branding |
| `orbit-pm/.claude/skills/orbit-brief/SKILL.md` | orbit-brief skill | VERIFIED | Exists, name:orbit-brief, Mission Briefing format, Drifting section, writes to `.orbit/briefs/` |
| `orbit-pm/.claude/skills/orbit-priorities/SKILL.md` | orbit-priorities skill | VERIFIED | Exists, name:orbit-priorities, Mission Priority Scan branding, writes rice-scorecard |
| `orbit-pm/.claude/skills/orbit-decisions/SKILL.md` | orbit-decisions skill | VERIFIED | Exists, name:orbit-decisions, Coordinate Audit format, Uncharted/Stable sections |
| `orbit-pm/.claude/skills/orbit-prep/SKILL.md` | orbit-prep skill | VERIFIED | Exists, name:orbit-prep, Pre-Launch Check format, Crew section |
| `orbit-pm/.claude/skills/orbit-artifact/SKILL.md` | orbit-artifact skill | VERIFIED | Exists, name:orbit-artifact, Payload delivered branding, versioning (v2/v3), template list |
| `orbit-pm/install.sh` | One-command installer | VERIFIED | Exists, executable, shebang+set -euo pipefail, SCRIPT_DIR (no hardcoded paths), mkdir -p for .claude/, ask-before-overwrite with [y/N] prompts, python3 JSON merge, CLAUDE.md idempotency marker+skip message, hooks deduplication, "Run /orbit-init" success message, valid bash syntax |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `install.sh` | `.claude/skills/*` | `cp -r` each skill directory | VERIFIED | grep confirmed `.claude/skills` in install.sh; live test showed all 8 skills installed under named subdirectories |
| `install.sh` | `.claude/agents/*.md` | `cp` each agent file | VERIFIED | grep confirmed `.claude/agents` in install.sh; live test showed astro.md and engin.md installed |
| `install.sh` | `.claude/settings.json` | python3 JSON merge with hook deduplication | VERIFIED | `new_commands` deduplication logic present; live idempotency test confirmed PostToolUse hook count stayed at 1 after second run |
| `install.sh` | `CLAUDE.md` | grep idempotency check then cat append | VERIFIED | marker `# Orbit — Context Copilot for Product Managers` present in install.sh; live test confirmed count=1 after second run |
| `install.sh` | `templates/` | cp -r templates directory | VERIFIED | `templates` reference in install.sh; live test confirmed `templates/prd.md` installed |
| `orbit-init/SKILL.md` | `.orbit/config.md` | Write tool — creates config.md from freeform response | VERIFIED | `config.md` referenced throughout skill body; YAML frontmatter format (name/role/company/projects/max_themes) and Goals/Stakeholders sections specified |
| `orbit-init/SKILL.md` | `.orbit/notes/` | Write tool — creates sample note with themes:[] | VERIFIED | `themes: []` pattern in skill body; sample note frontmatter with title/date/source/participants/decisions/questions/action_items specified |
| `orbit-status/SKILL.md` | `.orbit/` directory | Glob/Read/Grep tools — reads all state files | VERIFIED | `allowed-tools: [Read, Glob, Grep]` in frontmatter; data collection steps for notes/themes/actions/decisions/artifacts all reference `.orbit/` paths |
| `CLAUDE.md` | Claude Code session | Auto-loaded at session start from repo root | VERIFIED | File is at `orbit-pm/CLAUDE.md` (repo root); marker line is the idempotency contract used by install.sh; this is the standard Claude Code CLAUDE.md auto-load mechanism |

---

### Requirements Coverage

| Requirement | Source Plan(s) | Description | Status | Evidence |
|-------------|---------------|-------------|--------|----------|
| FOUND-01 | 01-01, 01-02 | Repo has CLAUDE.md with project-level instructions that Claude Code loads automatically | SATISFIED | `orbit-pm/CLAUDE.md` exists with all 7 rules, directory map, skills list, and idempotency marker. Agents (astro.md, engin.md) support the CLAUDE.md delegation rules. |
| FOUND-02 | 01-05, 01-06 | `install.sh` copies skills, agents, and settings into user's project in one command | SATISFIED | `install.sh` is executable, copies all 8 skills + 2 agents + settings.json + CLAUDE.md section + 5 templates; live smoke test passed end-to-end |
| FOUND-03 | 01-03, 01-04 | `/orbit-init` creates `.orbit/` directory structure with config, notes, themes, action-items, decisions, briefs, artifacts, templates, index | SATISFIED | `orbit-init/SKILL.md` documents creation of all 9 directories/files including seeded `pending.md`, `log.md`, `index.md`, and `.gitkeep` files for empty directories |
| FOUND-04 | 01-04 | `/orbit-init` asks user for name, role, company, projects, goals, stakeholders and writes `config.md` | SATISFIED | Single freeform question in orbit-init covers all 6 fields; config.md YAML frontmatter format with Goals and Key Stakeholders sections specified in skill body |
| FOUND-05 | 01-04 | `/orbit-init` detects available MCP servers (Granola, Atlassian, Slack) and reports them | SATISFIED | MCP detection logic in orbit-init for all 3 providers (tool pattern matching); completion message adapts "Detected:" line based on results |
| FOUND-06 | 01-04 | `/orbit-status` reads `.orbit/` and displays formatted workspace overview | SATISFIED | orbit-status has allowed-tools:[Read,Glob,Grep], collects notes/themes/actions/decisions/artifacts counts, full spatial output with all 5 categories |

**Orphaned requirements:** None. All 6 FOUND IDs are mapped to at least one plan. No Phase 1 requirements in REQUIREMENTS.md are unaccounted for.

**Note on plan claims:** Plan 01-02 (agents) claims FOUND-01. This is accurate — the agent description fields (`Delegate to this agent after note ingestion`, `Delegate for any PM question or analysis`) directly support the CLAUDE.md delegation rules defined in FOUND-01.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `orbit-artifact/SKILL.md` | 71 | `"placeholder"` in instructional text | Info | Not a stub — this is a rule instructing Claude *never* to use placeholder text. The skill itself is substantive. |
| `orbit-init/SKILL.md` | 102 | `"placeholder files"` in instructional text | Info | Refers to `.gitkeep` files to establish empty directories. Correct behavior, not a stub. |
| `ROADMAP.md` progress table | — | Shows "5/6 | In Progress" and all plan checkboxes are `[ ]` | Warning | Docs-only discrepancy. All 6 plans have complete SUMMARY.md files and all artifacts verified in codebase. ROADMAP was not updated after plan 06 completion. Does not affect functionality. |

No blocker anti-patterns found.

---

### Human Verification Required

#### 1. orbit-init End-to-End Execution

**Test:** Open a project in Claude Code. Run `/orbit-init`. Respond to the single freeform question with real PM context (name, role, company, etc.).
**Expected:** Claude writes `.orbit/config.md` with YAML frontmatter matching the response, creates the full `.orbit/` directory tree, writes a sample sprint review note with `themes: []`, detects available MCPs, and prints `◉ Orbit station online.` with a workspace summary.
**Why human:** Skill execution requires an active Claude Code session with tool access. The single-question interaction and language auto-detection cannot be verified programmatically.

#### 2. orbit-status Output Quality

**Test:** After running `/orbit-init`, run `/orbit-status`.
**Expected:** Displays `◉ Orbit Station` with a separator line, then Signals/Constellations/Missions/Coordinates/Payloads counts populated from the sample note, at least one `★ Theme Name` line (or "No signals yet" variant for empty workspace), and a contextual `Next:` suggestion.
**Why human:** Spatial output formatting, symbol rendering (◉ ★ ○), and contextual logic of the Next: suggestion require visual inspection in a live Claude Code session.

#### 3. Install in a Project That Already Has CLAUDE.md and settings.json

**Test:** Run `bash install.sh` in a project that already has a non-Orbit CLAUDE.md and a settings.json with existing hooks. Run it again immediately after.
**Expected:** First run appends Orbit section to CLAUDE.md without clobbering existing content; merges hooks without overwriting existing hooks; prompts before overwriting agent/skill files. Second run prints "already contains Orbit instructions — skipping" and produces no duplicates.
**Why human:** The interaction with pre-existing project configuration involves edge cases (varied JSON structures, multi-section CLAUDE.md files) that are hard to simulate exhaustively in isolation.

---

### Gaps Summary

No gaps. All 5 success criteria from ROADMAP.md are verified against the actual codebase. All 6 requirement IDs (FOUND-01 through FOUND-06) are satisfied with implementation evidence. The install.sh smoke test passed both fresh install and idempotency runs programmatically. The only outstanding items are 3 human verification tests that require a live Claude Code session to confirm runtime behavior.

The one documentation discrepancy — ROADMAP.md showing "5/6 | In Progress" with unchecked plan boxes — reflects a docs update that was not completed after plan 06 shipped. This has no functional impact.

---

_Verified: 2026-03-29T12:43:37Z_
_Verifier: Claude (gsd-verifier)_
