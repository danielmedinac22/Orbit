# Phase 1: Foundation - Research

**Researched:** 2026-03-28
**Domain:** Claude Code skills, agents, hooks, install.sh, CLAUDE.md, markdown file authoring
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Install Experience**
- Merge strategy: install.sh adds Orbit files without touching existing .claude/ content. If an Orbit-specific file already exists, ask before overwriting.
- Separate step: install.sh only copies files. It does NOT auto-run /orbit-init. Prints "Run /orbit-init to set up your workspace." at the end.
- Distribution: Clone + install.sh. No curl one-liner for MVP.
- What gets installed: .claude/skills/*, .claude/agents/*, templates/, CLAUDE.md content (appended), .claude/settings.json hooks (merged).

**Init Flow**
- All at once: Claude asks one freeform prompt covering name, role, company, projects, goals, stakeholders. User responds naturally. Claude extracts and writes config.md.
- Language: Auto-detect user's language. If they write in Spanish, respond in Spanish. Multilingual from the start.
- Seed data: Include one sample note during init so /orbit-status shows something meaningful immediately and the user understands the note format.
- MCP detection: Report available MCPs (Granola, Atlassian, Slack) during init so user knows what's available for /orbit-ingest.

**Status Output**
- Branding level: Claude's discretion — calibrate spatial branding based on workspace content. More spatial when there's data, simpler when workspace is empty or sparse.
- Next step suggestions: Always suggest what to do next based on state. Empty workspace? "Run /orbit-ingest". No brief? "Run /orbit-brief". Overdue items? Highlight them.

**Repo Structure**
- Clean repo: orbit-pm/ contains ONLY what the user needs. Design docs (mvp/01-06) stay in parent /Orbit/ directory, excluded from published repo.
- No examples directory: The sample note from /orbit-init is sufficient. Keep repo minimal.
- License: MIT

### Claude's Discretion
- Exact install.sh implementation details (bash patterns, error handling)
- How to merge .claude/settings.json hooks with existing hooks
- Sample note content (realistic PM meeting scenario)
- Exact formatting of /orbit-status output (spatial calibration)
- CLAUDE.md phrasing and structure

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Repo has CLAUDE.md with project-level instructions that Claude Code loads automatically | CLAUDE.md placed at repo root is auto-loaded by Claude Code on session start. Content structure and rules defined in mvp/02-ARCHITECTURE.md. |
| FOUND-02 | install.sh copies skills, agents, and settings into user's project in one command | Bash install script merges .claude/skills/, .claude/agents/, templates/, settings.json hooks, and appends to CLAUDE.md. Merge logic must be idempotent and non-destructive. |
| FOUND-03 | /orbit-init creates .orbit/ directory structure | Skill uses Write tool to create all required .orbit/ subdirectories and seed files in one guided flow. Full directory spec in mvp/02-ARCHITECTURE.md. |
| FOUND-04 | /orbit-init asks for user info and writes config.md | Single freeform prompt, Claude extracts structured data and writes config.md with YAML frontmatter (name, role, company, projects, max_themes, language, brief_style) plus Goals and Key Stakeholders sections. |
| FOUND-05 | /orbit-init detects available MCP servers and reports them | Skill prompt instructs Claude to check for tool names matching "granola", "mcp__claude_ai_Atlassian__*", "mcp__claude_ai_Slack__*". Report detection results in completion message. |
| FOUND-06 | /orbit-status reads .orbit/ and displays formatted workspace overview | Read-only skill using Glob/Read/Grep. Counts notes, themes, action items, decisions, artifacts. Displays spatial-branded output using ◉, ★, ○ symbols. Suggests next action. |
</phase_requirements>

---

## Summary

Phase 1 creates the `orbit-pm/` repository from scratch — a no-code Claude Code plugin distributed as a git repo with an install script. Every deliverable is a markdown file: skills, agents, templates, CLAUDE.md, and README. The bash install script is the only "code" in the traditional sense, and it performs only file operations (copy, append, merge JSON).

The critical technical surface is the Claude Code extension model: skills live in `.claude/skills/<name>/SKILL.md` with YAML frontmatter, agents in `.claude/agents/<name>.md` with YAML frontmatter, and hooks in `.claude/settings.json`. All three are verified against official Claude Code documentation as of 2026-03-28. The `memory: project` frontmatter field for agents creates a `.claude/agent-memory/<name>/` directory used for cross-session persistence — this is what Astro and Engin use, though they are defined in Phase 2; their structural definitions are written in Phase 1.

The install.sh complexity is the main risk area: merging `.claude/settings.json` hooks without destroying the user's existing hook configuration requires parsing JSON in bash (via `python3 -c` or `node -e`) since `jq` is not universally available. The CLAUDE.md append strategy must be idempotent so re-running install doesn't duplicate the Orbit section. Both are solved patterns documented in the Architecture Patterns section below.

**Primary recommendation:** Build every file from the exact specifications in mvp/02-06 without deviation. These specs are authoritative. The planner should create one task per file group, not one task per individual file.

---

## Standard Stack

### Core
| Component | Version/Format | Purpose | Why Standard |
|-----------|---------------|---------|--------------|
| Claude Code Skills | SKILL.md format (2026) | User-invoked slash commands and auto-loaded knowledge | Official Claude Code extension mechanism for guided workflows |
| Claude Code Agents | .md with YAML frontmatter (2026) | Persistent specialized AI personas | Official mechanism for tool-restricted agents with cross-session memory |
| Claude Code Hooks | settings.json PostToolUse (2026) | Reactive automation on file events | Official mechanism for triggering agents after note writes |
| Bash | POSIX-compatible sh | install.sh — file copy and merge operations | Universal, no dependencies, runs on every Unix/macOS/Linux |
| YAML frontmatter | Standard YAML in markdown | Structured metadata in skills, agents, notes, config | Machine-readable, human-writable, Claude-readable |

### Supporting
| Component | Version/Format | Purpose | When to Use |
|-----------|---------------|---------|-------------|
| python3 -c | Built-in macOS/Linux | JSON merge in install.sh | When jq not guaranteed to be available |
| MIT License | Standard | Open source publishing | Always for public repos |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| python3 for JSON merge | jq | jq is faster/cleaner but not always installed; python3 is on every modern macOS/Linux |
| python3 for JSON merge | node -e | node may not be available on all machines; python3 more reliable |
| Bash install.sh | Makefile | Make not universally available; bash is universal |

**Installation (user flow):**
```bash
git clone https://github.com/orbit-pm/orbit-pm.git /tmp/orbit-pm
/tmp/orbit-pm/install.sh
```

No npm packages. No dependencies. Zero install beyond git and bash.

---

## Architecture Patterns

### Recommended Repo Structure

```
orbit-pm/
├── README.md
├── CLAUDE.md
├── LICENSE
├── install.sh
├── .claude/
│   ├── settings.json
│   ├── agents/
│   │   ├── astro.md
│   │   └── engin.md
│   └── skills/
│       ├── orbit-init/
│       │   └── SKILL.md
│       ├── orbit-ingest/
│       │   └── SKILL.md
│       ├── orbit-status/
│       │   └── SKILL.md
│       ├── orbit-brief/
│       │   └── SKILL.md
│       ├── orbit-priorities/
│       │   └── SKILL.md
│       ├── orbit-decisions/
│       │   └── SKILL.md
│       ├── orbit-prep/
│       │   └── SKILL.md
│       └── orbit-artifact/
│           └── SKILL.md
└── templates/
    ├── prd.md
    ├── decision-record.md
    ├── weekly-summary.md
    ├── stakeholder-update.md
    └── rice-scorecard.md
```

Note: The `examples/` directory mentioned in mvp/02-ARCHITECTURE.md is EXCLUDED per locked decision (no examples directory; sample note comes from /orbit-init).

---

### Pattern 1: Claude Code SKILL.md Format

**What:** YAML frontmatter + markdown body. Frontmatter tells Claude when and how to use the skill. Body contains the workflow instructions Claude follows.

**When to use:** Every `/orbit-*` command is a skill.

**Key frontmatter fields for Orbit skills:**
- `name` — matches directory name, becomes the `/slash-command`
- `description` — tells Claude when to auto-invoke; use specific trigger phrases
- `argument-hint` — hint shown during autocomplete (e.g., `[daily | weekly]`)
- `allowed-tools` — pre-approved tools, reduces permission prompts
- `disable-model-invocation: true` — for workflows with side effects (not needed for Orbit skills since all are user-invoked intentionally)

**Example — orbit-status:**
```yaml
---
name: orbit-status
description: Show Orbit workspace status — notes, themes, action items, decisions, artifacts. Use when the user asks for a workspace overview or runs /orbit-status.
argument-hint: ""
allowed-tools: [Read, Glob, Grep]
---

[Workflow instructions here]
```

**Example — orbit-init:**
```yaml
---
name: orbit-init
description: Initialize the Orbit PM workspace. Creates .orbit/ directory and user profile. Use when the user wants to set up Orbit in their project.
argument-hint: ""
---

[Workflow instructions here]
```

Note: `orbit-init` does NOT specify `allowed-tools` because it needs Write access to create directories and files.

---

### Pattern 2: Claude Code Agent Format (HIGH confidence — verified against official docs)

**What:** Markdown file with YAML frontmatter. `name` and `description` are required. Body is the system prompt.

**Key verified frontmatter fields:**
- `name` — unique identifier (lowercase, hyphens)
- `description` — when Claude should delegate to this agent
- `model` — `sonnet`, `opus`, `haiku`, `inherit`, or full model ID
- `memory` — `user`, `project`, or `local` for persistent cross-session memory
- `tools` — allowlist of tools
- `disallowedTools` — denylist (applied first if both specified)

**Memory scope for Orbit:**
- `memory: project` → creates `.claude/agent-memory/<name>/` in the project
- Shareable via git (team can benefit from accumulated patterns)
- Recommended for both Astro and Engin per mvp/02-ARCHITECTURE.md

**Example — astro.md:**
```yaml
---
name: astro
description: >
  Organization agent for the Orbit PM workspace. Reads notes, assigns themes,
  extracts action items, logs decisions, and rebuilds the knowledge index.
  Delegate to this agent after note ingestion or when reorganization is needed.
model: sonnet
memory: project
tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
disallowedTools:
  - Bash
  - Agent
  - WebSearch
  - WebFetch
---
```

**Example — engin.md:**
```yaml
---
name: engin
description: >
  Expert PM advisor for the Orbit workspace. Senior product management advisor
  who synthesizes knowledge across meetings, tracks decisions, identifies
  contradictions, and guides PM workflows including prioritization, meeting prep,
  and strategic synthesis. Delegate for any PM question or analysis.
model: inherit
memory: project
tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - WebSearch
disallowedTools:
  - Bash
---
```

---

### Pattern 3: settings.json Hooks for Auto-Astro

**What:** PostToolUse hooks fire after the Write tool completes. The hook command receives JSON on stdin with `tool_input.file_path`.

**Verified hook input schema:**
```json
{
  "session_id": "...",
  "cwd": "/path/to/project",
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "..."
  },
  "tool_response": {
    "filePath": "/path/to/file.txt",
    "success": true
  }
}
```

**Orbit's hook goal:** When any file is written to `.orbit/notes/`, prompt Claude to delegate to Astro for organization.

**Important design note:** The hook detection approach in mvp/02-ARCHITECTURE.md uses a bash command echoing TOOL_INPUT. However, the verified approach (from official docs) uses stdin. For Phase 1, the settings.json ships with the hook structure defined — the exact detection command can use stdin-based jq/python3 parsing. The Phase 2 implementation will refine the hook behavior.

**Phase 1 settings.json (structural definition for install.sh to merge):**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import sys, json; d=json.load(sys.stdin); p=d.get('tool_input',{}).get('file_path',''); exit(0 if '.orbit/notes/' not in p else 0)\" && echo 'Orbit: Note written. Consider running Astro to organize.' || true"
          }
        ]
      }
    ]
  }
}
```

Note: The hook in Phase 1 is minimal — it establishes the structure. Full Astro auto-delegation is a Phase 2 concern (ASTR-08).

---

### Pattern 4: install.sh Merge Strategy

**What:** Bash script that copies Orbit files into the user's existing project without destroying their existing `.claude/` configuration.

**Merge rules (per locked decisions):**
1. `.claude/skills/*` — copy each skill directory; ask before overwriting if Orbit skill exists
2. `.claude/agents/*` — copy each agent file; ask before overwriting
3. `.claude/settings.json` — deep merge hooks array (append Orbit hooks to existing)
4. `CLAUDE.md` — append Orbit section if not already present (idempotency check)
5. `templates/` — copy to project root as `templates/`

**Idempotency pattern for CLAUDE.md append:**
```bash
ORBIT_MARKER="# Orbit — Context Copilot for Product Managers"
if ! grep -qF "$ORBIT_MARKER" "$DEST_CLAUDE_MD" 2>/dev/null; then
    cat "$ORBIT_CLAUDE_MD" >> "$DEST_CLAUDE_MD"
    echo "Appended Orbit instructions to CLAUDE.md"
else
    echo "CLAUDE.md already contains Orbit instructions — skipping"
fi
```

**JSON merge pattern for settings.json (python3, no jq dependency):**
```bash
python3 -c "
import json, sys

with open('$DEST_SETTINGS') as f:
    existing = json.load(f)
with open('$ORBIT_SETTINGS') as f:
    orbit = json.load(f)

# Merge hooks arrays
existing.setdefault('hooks', {})
for event, hook_list in orbit.get('hooks', {}).items():
    existing['hooks'].setdefault(event, [])
    existing['hooks'][event].extend(hook_list)

with open('$DEST_SETTINGS', 'w') as f:
    json.dump(existing, f, indent=2)
"
```

**Overwrite prompt pattern:**
```bash
if [ -f "$DEST_FILE" ]; then
    read -r -p "Orbit file already exists: $DEST_FILE. Overwrite? [y/N] " response
    case "$response" in
        [yY][eE][sS]|[yY]) cp "$SRC_FILE" "$DEST_FILE" ;;
        *) echo "Skipping $DEST_FILE" ;;
    esac
else
    cp "$SRC_FILE" "$DEST_FILE"
fi
```

---

### Pattern 5: orbit-init Flow

**What:** Single conversational prompt → structured config.md + full .orbit/ directory tree + sample note.

**Init sequence:**
1. Ask one freeform question covering name/role/company/projects/goals/stakeholders
2. Extract data from response, auto-detect language
3. Write `.orbit/config.md` with YAML frontmatter + Goals + Key Stakeholders sections
4. Create all .orbit/ subdirectories and seed files
5. Detect MCP availability (Granola, Atlassian, Slack)
6. Write one sample note to `.orbit/notes/`
7. Report using branding message: `◉ Orbit station online.`

**MCP detection approach (verified pattern from mvp/05-SKILLS.md):**
```
Check which MCP tools are available:
- If tools matching "granola" or "mcp__*granola*" exist → Granola available
- If tools matching "mcp__claude_ai_Atlassian__*" exist → Jira/Confluence available
- If tools matching "mcp__claude_ai_Slack__*" exist → Slack available
```

Claude natively knows which tools are available to it in the current session. This detection happens inside the skill prompt — no bash or external checks needed.

**Sample note spec:** Realistic PM meeting (product standup or sprint review) with real-sounding decisions and action items. Must use full note frontmatter format with `themes: []` (empty, for Astro to fill). See mvp/02-ARCHITECTURE.md for the exact frontmatter schema.

---

### Pattern 6: orbit-status Display

**What:** Read-only survey of .orbit/ using Glob/Read/Grep. Display spatial-branded output.

**Data to collect:**
- Count files in `.orbit/notes/` (total + those from this week by date prefix)
- Count directories in `.orbit/themes/` (excluding `_suggested/`)
- Count directories in `.orbit/themes/_suggested/`
- Count pending items in `.orbit/action-items/pending.md`
- Count overdue items (past due date)
- Count rows in `.orbit/decisions/log.md`
- Count stalled (no follow-up) decisions
- Count files in `.orbit/artifacts/` and each theme's `artifacts/`
- Check for latest file in `.orbit/briefs/`

**Output structure (from mvp/06-BRANDING.md — exact template to follow):**
```
◉ Orbit Station
─────────────────
Signals:      N captured (N this week)
Constellations: N active, N suggested
Missions:     N active, N drifting
Coordinates:  N locked, N conflicting
Payloads:     N delivered
Last briefing: YYYY-MM-DD

Constellations:
  ★ Theme Name    — N signals, N active missions
  ○ Suggested     — detected in N signals

Next: [suggested action based on state]
```

**Empty workspace variant (simpler, less spatial):**
```
◉ Orbit Station
─────────────────
No signals yet.

Next: Run /orbit-ingest to capture your first notes.
```

---

### Anti-Patterns to Avoid

- **Adding `allowed-tools` to orbit-init:** Init needs Write to create directories — don't restrict it.
- **Using `context: fork` on any Phase 1 skills:** These skills run inline (no subagent), except future Phase 2+ skills that delegate to Engin.
- **Hardcoding absolute paths in install.sh:** Use `$(dirname "$0")` or `SCRIPT_DIR` relative paths.
- **Using `echo $TOOL_INPUT` in hooks:** TOOL_INPUT is not an env variable; hook data comes via stdin as JSON.
- **jq as a required dependency:** Not universally available; use python3 for JSON operations in install.sh.
- **Creating the `examples/` directory:** Per locked decision, this is excluded from the repo.
- **Using spatial terms in SKILL.md descriptions or YAML field names:** Branding applies to terminal output messages, not to machine-readable frontmatter or skill descriptions.
- **Spatial terms in error messages:** "No .orbit/ directory found" — not "Station offline". Errors must be clear.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| MCP detection | Custom discovery mechanism | Natural language in skill prompt ("check if tools matching granola exist") | Claude natively knows its available tools per session |
| JSON merge in install.sh | Custom JSON parser | python3 -c with json module | Python3 is universal; handles nested merge correctly |
| Slash command routing | Custom dispatcher | Claude Code skills mechanism (SKILL.md) | Built-in — directory name = command name |
| Agent delegation | Manual prompt engineering | Agent description field + Claude's auto-delegation | Claude uses description to decide when to delegate automatically |
| Cross-session memory | Custom state file | `memory: project` frontmatter in agent definition | Built-in Claude Code feature creates `.claude/agent-memory/` |
| Template versioning | Custom version tracker | Naming convention in orbit-artifact skill (Phase 3) | Not a Phase 1 concern |

**Key insight:** This entire phase produces markdown files that extend Claude Code's native capabilities. The "don't hand-roll" principle means: trust Claude Code's built-in mechanisms (skills, agents, hooks, memory) rather than trying to replicate them with bash scripts or custom logic.

---

## Common Pitfalls

### Pitfall 1: CLAUDE.md Duplication on Re-install
**What goes wrong:** Running install.sh twice appends the Orbit section twice, breaking Claude's instructions.
**Why it happens:** Simple `cat >> CLAUDE.md` without checking for existing content.
**How to avoid:** Check for a unique marker string (`# Orbit — Context Copilot for Product Managers`) before appending. If found, skip.
**Warning signs:** CLAUDE.md grows on each install; duplicate section headers.

### Pitfall 2: settings.json Hooks Duplication
**What goes wrong:** Running install.sh twice adds Orbit's PostToolUse hook twice, causing double-execution.
**Why it happens:** JSON merge appends without checking for existing identical hooks.
**How to avoid:** Before appending each hook, check if an identical command string already exists in the target hooks array. Python3 `json` module makes this easy.
**Warning signs:** Hooks array grows on each install.

### Pitfall 3: install.sh Fails Silently on Missing .claude/
**What goes wrong:** User runs install.sh in a project that has no `.claude/` directory yet. Script exits or errors non-gracefully.
**Why it happens:** `cp` to non-existent directory, or conditional checks fail.
**How to avoid:** Use `mkdir -p "$DEST/.claude/skills"` etc. before copying. Always create destination dirs.
**Warning signs:** "No such file or directory" errors on first install.

### Pitfall 4: orbit-init Creates Duplicate .orbit/ Structure
**What goes wrong:** User runs /orbit-init twice. Second run overwrites config.md and sample note.
**Why it happens:** Skill has no idempotency check.
**How to avoid:** Check if `.orbit/config.md` already exists at the start of the skill. If yes, ask user whether to re-initialize or skip.
**Warning signs:** User's configured data is reset silently.

### Pitfall 5: Skill Descriptions Too Generic
**What goes wrong:** Claude doesn't auto-invoke the skill when appropriate, or invokes it when not wanted.
**Why it happens:** Description field is vague (e.g., "manages workspace") vs. specific trigger phrases.
**How to avoid:** Front-load the key use case. Include phrases users would naturally say. Keep descriptions under 250 characters (truncated in skill listing).
**Warning signs:** User types `/orbit-status` and Claude doesn't recognize it; or Claude randomly shows workspace status during unrelated work.

### Pitfall 6: Hook Reads TOOL_INPUT as Env Variable
**What goes wrong:** Hook command uses `$TOOL_INPUT` as a shell variable, gets empty string.
**Why it happens:** Confusion between env variables and stdin JSON.
**How to avoid:** Hook commands receive data on stdin as JSON. Read stdin, parse with python3 or jq.
**Warning signs:** Hook appears to run but never triggers Astro; grep finds empty string.

### Pitfall 7: Agent Memory Not Created
**What goes wrong:** Astro or Engin don't accumulate cross-session knowledge.
**Why it happens:** `memory: project` specified but user's project doesn't have `.claude/agent-memory/` in `.gitignore` causing confusion, or the field is omitted from frontmatter.
**How to avoid:** Ensure `memory: project` is in both agent files. Consider adding `.claude/agent-memory/` to the project's suggested `.gitignore` or noting it in README — or intentionally keeping it committed for team sharing (project scope is designed to be shareable).
**Warning signs:** Agents don't reference past patterns; no `.claude/agent-memory/astro/` directory appears.

---

## Code Examples

Verified patterns from official sources and design docs.

### SKILL.md for orbit-status (verified frontmatter format)
```yaml
---
name: orbit-status
description: Show Orbit workspace status — notes, themes, action items, decisions, artifacts. Use when the user asks for workspace overview, status, or how many notes they have.
argument-hint: ""
allowed-tools: [Read, Glob, Grep]
---

Check if `.orbit/` exists. If not, respond: "No Orbit workspace found. Run /orbit-init to set up your workspace."

[... workflow instructions ...]
```

### Agent frontmatter (verified against official sub-agents docs)
```yaml
---
name: astro
description: >
  Organization agent for the Orbit PM workspace. Reads notes, assigns themes,
  extracts action items, logs decisions, and rebuilds the knowledge index.
  Delegate to this agent after note ingestion or when reorganization is needed.
model: sonnet
memory: project
tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
disallowedTools:
  - Bash
  - Agent
  - WebSearch
  - WebFetch
---
```

### config.md format (from mvp/02-ARCHITECTURE.md)
```markdown
---
name: Daniel
role: Senior Product Manager
company: Acme Corp
projects: [Mobile App v2, API Redesign, Data Platform]
max_themes: 5
language: auto
brief_style: concise
---

## Goals
- Ship mobile v2 by Q2
- Reduce API latency by 40%

## Key Stakeholders
- Sarah Chen — VP Engineering
- Mike Torres — Head of Design
```

### Note frontmatter format (from mvp/02-ARCHITECTURE.md)
```markdown
---
title: Sprint Review
date: 2026-03-27
source: granola
participants: [Daniel, Maria, Carlos]
themes: []
decisions:
  - Switch to REST from GraphQL for MVP
questions:
  - Who owns the data migration?
action_items:
  - text: Draft API migration plan
    owner: Daniel
    due: 2026-04-01
    status: pending
---
```

### Decision log format (from mvp/02-ARCHITECTURE.md)
```markdown
# Decision Log

| Date | Decision | Source | Theme | Status |
|------|----------|--------|-------|--------|
| 2026-03-27 | Switch to REST from GraphQL for MVP | Sprint Review | api-redesign | confirmed |
```

### install.sh skeleton (Claude's discretion — patterns verified)
```bash
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="${1:-$(pwd)}"

# Ensure destination .claude directories exist
mkdir -p "$DEST/.claude/skills"
mkdir -p "$DEST/.claude/agents"

# Copy skills (ask before overwriting Orbit-specific files)
for skill_dir in "$SCRIPT_DIR/.claude/skills"/*/; do
    skill_name=$(basename "$skill_dir")
    dest_skill="$DEST/.claude/skills/$skill_name"
    if [ -d "$dest_skill" ]; then
        read -r -p "Skill '$skill_name' already exists. Overwrite? [y/N] " response
        case "$response" in
            [yY]*) cp -r "$skill_dir" "$DEST/.claude/skills/" ;;
            *) echo "Skipping skill: $skill_name" ;;
        esac
    else
        cp -r "$skill_dir" "$DEST/.claude/skills/"
    fi
done

# Copy agents (similar pattern)
# ...

# Merge settings.json hooks
# (python3 JSON merge pattern above)

# Append CLAUDE.md (idempotency check above)

# Copy templates/
cp -r "$SCRIPT_DIR/templates" "$DEST/"

echo ""
echo "Orbit installed successfully."
echo "Run /orbit-init to set up your workspace."
```

### orbit-init completion message (from mvp/06-BRANDING.md — exact spec)
```
◉ Orbit station online.

  Workspace: .orbit/
  Config:    .orbit/config.md
  Blueprints: 5 templates loaded

  Detected: Granola MCP, Slack MCP

  Next: /orbit-ingest to capture your first signals.
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|-----------------|--------------|--------|
| `.claude/commands/*.md` | `.claude/skills/<name>/SKILL.md` | 2025 | Skills are strictly better: support supporting files, frontmatter control, `disable-model-invocation`, `context: fork` — commands still work as aliases |
| No agent memory | `memory: project/user/local` frontmatter field | 2025-2026 | Agents accumulate cross-session knowledge in `.claude/agent-memory/<name>/` |
| Manual agent delegation | Agent `description` field for auto-delegation | 2025 | Claude auto-delegates based on task matching description; @-mention for explicit delegation |
| Task tool | Agent tool (renamed) | Claude Code v2.1.63 | `Task(...)` still works as alias — no migration needed |

**Deprecated/outdated:**
- `.claude/commands/` directory: Still works but skills are the recommended approach. Orbit uses skills.
- `TOOL_INPUT` as environment variable: Was never valid — always use stdin JSON for hook data.

---

## Open Questions

1. **Granola MCP tool name pattern**
   - What we know: mvp/05-SKILLS.md says check for `"granola"` or `"mcp__*granola*"` tool names
   - What's unclear: The exact tool name prefix used by the Granola MCP server in practice (verified that `granola` is configured in the machine's global settings.json as an MCP server, so tool names will follow its schema)
   - Recommendation: The machine's `.claude/settings.json` already has `"granola"` configured. The skill detection prompt should check for tool names containing "granola" — this covers the actual deployment. LOW risk.

2. **Hook command for Astro auto-delegation (Phase 1 scope only)**
   - What we know: Hook fires PostToolUse Write; tool_input.file_path contains the written path; Phase 1 only needs to establish the hook structure, not full Astro integration
   - What's unclear: The exact prompt Claude receives from a hook command that makes it delegate to Astro (Phase 2 concern)
   - Recommendation: Phase 1 ships a minimal hook that outputs a notification message. Full Astro auto-delegation is ASTR-08, a Phase 2 requirement.

3. **settings.json merge when no existing file**
   - What we know: User may have an existing settings.json (with permissions, mcpServers etc.) or may not
   - What's unclear: Whether to create a minimal settings.json or fail gracefully when no existing file
   - Recommendation: install.sh should handle both cases — if no settings.json exists, copy Orbit's version directly. If it exists, merge. Python3 json.load with exception handling covers the "file exists but is malformed" edge case.

---

## Validation Architecture

### Test Framework

nyquist_validation is enabled. However, this is a no-code markdown-only project. There is no test framework to install or configure.

| Property | Value |
|----------|-------|
| Framework | Manual validation only — no automated test runner |
| Config file | None |
| Quick run command | Manual: verify file existence and content spot-check |
| Full suite command | Manual: run install.sh in a temp directory, inspect results |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | CLAUDE.md exists at repo root with correct content | manual | `ls orbit-pm/CLAUDE.md && grep "Orbit" orbit-pm/CLAUDE.md` | ❌ Wave 0 |
| FOUND-02 | install.sh runs without error; copies all files | manual-shell | `bash /tmp/orbit-pm/install.sh /tmp/test-project && ls /tmp/test-project/.claude/skills/orbit-init/` | ❌ Wave 0 |
| FOUND-03 | /orbit-init creates full .orbit/ tree | manual-claude | Run `/orbit-init` in Claude Code session, verify `.orbit/` structure | manual-only |
| FOUND-04 | /orbit-init writes config.md with correct frontmatter | manual-claude | After init, `cat .orbit/config.md` and verify YAML fields present | manual-only |
| FOUND-05 | /orbit-init reports MCP availability | manual-claude | Run init and observe output for Granola/Atlassian/Slack detection | manual-only |
| FOUND-06 | /orbit-status displays formatted overview | manual-claude | After init with sample note, run `/orbit-status` and verify ◉ output | manual-only |

**Note on manual-only tests:** FOUND-03 through FOUND-06 require Claude Code runtime because the deliverables ARE the Claude prompts — they can't be tested without running them through Claude. The correct verification is: install the plugin, run each skill in a Claude Code session, observe output.

### Sampling Rate
- **Per task commit:** Manual file existence check (`ls` and `grep` spot-checks)
- **Per wave merge:** Full install.sh smoke test in a temp directory
- **Phase gate:** Full Claude Code runtime test of all 6 requirements before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `orbit-pm/` directory — does not exist yet, must be created in Wave 0 (Task 1)
- [ ] All files listed in the repo structure above — created across Phase 1 tasks
- [ ] No test framework to install — validation is manual + shell smoke tests

*(No test framework setup needed. All validation is either shell-scriptable existence checks or Claude runtime observation.)*

---

## Sources

### Primary (HIGH confidence)
- [Official Claude Code Sub-agents docs](https://code.claude.com/docs/en/sub-agents) — verified all agent frontmatter fields: name, description, model, memory (user/project/local), tools, disallowedTools, hooks, permissionMode, maxTurns, skills, mcpServers, isolation, effort, background, initialPrompt
- [Official Claude Code Skills docs](https://code.claude.com/docs/en/skills) — verified all skill frontmatter fields: name, description, argument-hint, allowed-tools, model, effort, context, agent, hooks, paths, disable-model-invocation, user-invocable, shell; verified $ARGUMENTS substitution
- [Official Claude Code Hooks docs](https://code.claude.com/docs/en/hooks) — verified PostToolUse input schema (stdin JSON with tool_input.file_path), no TOOL_INPUT env variable
- `mvp/02-ARCHITECTURE.md` — authoritative repo structure, .orbit/ layout, all file formats (note, config, decision log, theme metadata), agent frontmatter specs, hooks configuration intent, install.sh steps, CLAUDE.md content
- `mvp/05-SKILLS.md` — authoritative SKILL.md frontmatter for all 8 skills, flow descriptions for orbit-init and orbit-status, MCP detection approach
- `mvp/04-PROMPTS.md` — authoritative agent system prompts for Astro and Engin (complete prompts)
- `mvp/06-BRANDING.md` — authoritative vocabulary map, skill completion messages (exact strings), visual symbols (◉ ★ ○ ⚠️), agent voice examples
- `mvp/01-CONTEXT.md` — project framing, what Orbit is, MCP ecosystem

### Secondary (MEDIUM confidence)
- Existing `.claude/plugins/marketplaces/claude-plugins-official/plugins/example-plugin/skills/example-command/SKILL.md` — local verified example of `argument-hint` and `allowed-tools` in practice
- `/Users/equipo/.claude/settings.json` — verified real hooks configuration format (SessionStart, PostToolUse) in production use

### Tertiary (LOW confidence)
- None — all critical claims verified via official docs or local inspection

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against official Claude Code docs (2026)
- Architecture: HIGH — exact specifications exist in mvp/02-06 design docs
- Pitfalls: HIGH — install.sh merge patterns are well-understood; hook stdin behavior verified
- Skill/Agent format: HIGH — verified field-by-field against official sub-agents and skills documentation

**Research date:** 2026-03-28
**Valid until:** 2026-06-28 (stable — Claude Code extension model is well-established)
