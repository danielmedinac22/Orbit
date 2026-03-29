# Phase 2: Ingestion + Agents - Research

**Researched:** 2026-03-29
**Domain:** Claude Code skills (orbit-ingest), Claude Code agents (astro, engin), PostToolUse hooks (ASTR-08), note format YAML, MCP integration patterns, branding/voice
**Confidence:** HIGH

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INGS-01 | `/orbit-ingest` presents guided flow based on detected MCPs + manual options | skill already exists from Phase 1; this phase adds the full interactive flow body and verified MCP detection logic |
| INGS-02 | Granola MCP path: fetch by date range, write standard notes | Granola MCP tool patterns documented; note-writing format fully specified in mvp/02-ARCHITECTURE.md |
| INGS-03 | File path: read file, generate structured note | Note Creation Prompt in mvp/04-PROMPTS.md §3 is the exact implementation; uses Write tool |
| INGS-04 | Paste path: user pastes, Claude generates structured note | Same Note Creation Prompt; minor frontmatter variation (source: paste) |
| INGS-05 | Jira MCP path: fetch by project/JQL, write as notes | Atlassian MCP tool prefix pattern documented; structure mirrors Granola path |
| INGS-06 | Slack MCP path: fetch channel/thread, write as note | Slack MCP tool prefix pattern documented; structure mirrors Granola path |
| INGS-07 | All notes: valid YAML frontmatter (title, date, source, participants, themes, decisions, questions, action_items) + body | Canonical format in mvp/02-ARCHITECTURE.md; already implemented in Phase 1 SKILL.md |
| ASTR-01 | `astro.md` agent with model: sonnet, memory: project, restricted tools | agent file exists from Phase 1; this phase verifies the body/prompt is complete and triggers correctly |
| ASTR-02 | Astro assigns themes semantically (synonyms, translations, abbreviations) | system prompt already written in Phase 1; this phase ensures it runs via hook |
| ASTR-03 | Astro extracts action items to `.orbit/themes/<theme>/action-items.md` (deduplicating) | system prompt specifies deduplication logic; theme directory creation is Astro's responsibility |
| ASTR-04 | Astro suggests new themes in `.orbit/themes/_suggested/` | system prompt specifies _suggested/ directory; Astro creates subdirectories there |
| ASTR-05 | Astro updates `.orbit/action-items/pending.md` (global view) | system prompt specifies this step; file already seeded empty by orbit-init |
| ASTR-06 | Astro logs decisions to `.orbit/decisions/log.md` | system prompt specifies decision logging; file already seeded empty by orbit-init |
| ASTR-07 | Astro rebuilds `.orbit/index.md` | system prompt specifies index rebuild; file already seeded by orbit-init |
| ASTR-08 | Hook in settings.json auto-triggers Astro after note is written | This is the critical Phase 2 technical work: replace the Phase 1 placeholder hook with a real auto-delegation command |
| ENGN-01 | `engin.md` agent with memory: project, inherit model, WebSearch access | agent file exists from Phase 1; verify prompt is complete |
| ENGN-02 | Engin answers PM questions with cited sources | system prompt already specifies citation rules; this phase ensures Engin is invocable via natural questions |
| ENGN-03 | Engin distinguishes decisions/discussions/inference | system prompt already specifies fact-type labeling |
| ENGN-04 | Engin's persistent memory accumulates context across sessions | `memory: project` is set; this phase validates the memory pattern works as designed |
| BRND-01 | Astro uses navigator voice | system prompt and vocabulary map defined in mvp/06-BRANDING.md; needs verification against actual astro.md body |
| BRND-02 | Engin uses advisor voice | system prompt in Phase 1 engin.md matches mvp/04-PROMPTS.md spec |
| BRND-03 | `/orbit-status` uses spatial formatting (◉, ★, missions) | already fully implemented in Phase 1 orbit-status/SKILL.md |
| BRND-04 | All skill completion messages suggest logical next step | already implemented in orbit-ingest SKILL.md and orbit-init SKILL.md |
</phase_requirements>

---

## Summary

Phase 2 builds on a solid Phase 1 foundation: the `orbit-pm/` repo exists with all agent files (`astro.md`, `engin.md`), all skill SKILL.md files (including `orbit-ingest`), and a `settings.json` with a placeholder PostToolUse hook. The agents already have complete system prompts matching `mvp/04-PROMPTS.md`. The `orbit-ingest` SKILL.md already has complete flow instructions for all 5 source paths (Granola, Jira, Slack, File, Paste) with correct branding.

The central Phase 2 deliverable is **ASTR-08**: replacing the placeholder `settings.json` hook with a real auto-delegation command that triggers Astro after any note write. The current hook (Phase 1) prints a static message and always exits 0 — it never actually triggers Astro. Phase 2 must change this hook to prompt Claude to delegate to Astro. This is the "auto-organization" that makes the system work without manual steps.

The secondary work is **verification and gap-filling**: read through every Phase 1 file against the full requirements list and identify any gaps. Based on inspection, the agent system prompts and SKILL.md bodies appear complete against the design specs. The main gaps are: (1) the hook not doing real delegation, (2) Astro's completion message not using navigator voice (the current body ends with "report a structured summary" but doesn't specify the exact Astro voice format from `mvp/06-BRANDING.md`), and (3) the `orbit-ingest` completion message references "Astro is organizing..." but the actual hook currently cannot produce that result.

**Primary recommendation:** Phase 2 is primarily a hook upgrade plus branding verification pass. Write three targeted tasks: (1) upgrade the settings.json hook to auto-delegate to Astro, (2) verify and patch Astro's completion message to match navigator voice spec, (3) end-to-end smoke test of the full ingest → organize → status flow.

---

## Standard Stack

### Core
| Component | Version/Format | Purpose | Why Standard |
|-----------|---------------|---------|--------------|
| Claude Code PostToolUse hook | settings.json (2026) | Auto-trigger Astro after Write to `.orbit/notes/` | The only hook type that fires synchronously after tool completion |
| Claude Code Agents | `.claude/agents/*.md` (2026) | Astro (organizer) + Engin (advisor) — persistent memory | Built-in; both already defined in Phase 1 |
| Claude Code Skills | `.claude/skills/*/SKILL.md` (2026) | `orbit-ingest` — user-facing guided flow | Already implemented in Phase 1 |
| YAML frontmatter | standard YAML in markdown | Note metadata: title, date, source, participants, themes, decisions, questions, action_items | Machine-readable by Astro; all fields specified |

### Supporting
| Component | Version/Format | Purpose | When to Use |
|-----------|---------------|---------|-------------|
| Granola MCP | granola / mcp__*granola* pattern | Fetch meetings by date range | When user has Granola configured |
| Atlassian MCP | mcp__claude_ai_Atlassian__* pattern | Fetch Jira issues + comments | When user has Atlassian MCP configured |
| Slack MCP | mcp__claude_ai_Slack__* pattern | Fetch channel/thread digest | When user has Slack MCP configured |
| python3 | built-in macOS/Linux | Hook command's path-detection logic | Avoids jq dependency in hook commands |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| PostToolUse hook triggering Astro | Manual `/astro` command after ingest | Hook is automatic (no manual step); aligns with ASTR-08 requirement |
| python3 stdin parsing in hook | jq in hook | python3 is universally available; jq may not be installed |
| Hook echoes delegation prompt | Hook spawns a subprocess | Subprocess approach has complexity/portability risk; echo to stdout captured by Claude is simpler |

**No npm packages. No new dependencies. Zero-install beyond what Phase 1 established.**

---

## Architecture Patterns

### What Phase 1 Already Built (do NOT recreate)

```
orbit-pm/
├── .claude/
│   ├── settings.json          ← has placeholder hook — Phase 2 UPGRADES this
│   ├── agents/
│   │   ├── astro.md           ← complete system prompt — Phase 2 VERIFIES, may patch branding
│   │   └── engin.md           ← complete system prompt — Phase 2 VERIFIES
│   └── skills/
│       ├── orbit-init/SKILL.md     ← complete — no changes needed
│       ├── orbit-ingest/SKILL.md   ← complete flow — Phase 2 VERIFIES hook integration
│       ├── orbit-status/SKILL.md   ← complete — no changes needed
│       └── [other skills...]       ← Phase 3 concern
```

### Pattern 1: PostToolUse Hook for Auto-Astro (ASTR-08)

**What:** The hook fires after every Write tool call. The hook command reads stdin JSON to determine if the written file is in `.orbit/notes/`. If yes, it outputs a message that prompts Claude to delegate to Astro.

**Current placeholder (Phase 1 — does NOT trigger Astro):**
```json
{
  "type": "command",
  "command": "python3 -c \"import sys, json; d=json.load(sys.stdin); p=d.get('tool_input',{}).get('file_path',''); exit(0 if '.orbit/notes/' not in p else 0)\" && echo 'Orbit: Note written. Consider running Astro to organize.' || true"
}
```

**What this does wrong:** It detects a note write correctly but only echoes a suggestion. The `echo` output goes to the hook command's stdout — this output is captured by Claude Code and can be used to prompt behavior, but "Consider running Astro" is weak phrasing that will not reliably trigger Astro delegation.

**Phase 2 target (real delegation prompt):**
The hook command must output a clear directive that Claude Code surfaces as an instruction. The correct pattern based on how Claude Code hooks work: if a hook command exits 0 with stdout output, that output becomes a message Claude sees and acts on.

```json
{
  "type": "command",
  "command": "python3 -c \"import sys, json; d=json.load(sys.stdin); p=d.get('tool_input',{}).get('file_path',''); print('Orbit: Note written to .orbit/notes/. Delegate to the Astro agent now to assign themes, extract action items, log decisions, and rebuild the index.') if '.orbit/notes/' in p else None\" 2>/dev/null || true"
}
```

**Key design constraints (verified from Phase 1 research):**
- Hook receives data on **stdin as JSON** (not `$TOOL_INPUT` env variable — this was a pitfall in Phase 1 research)
- `tool_input.file_path` contains the full path of the written file
- Hook stdout is surfaced to Claude as context; strong directive language triggers agent delegation
- Hook must always exit 0 (the `|| true` guard) to avoid aborting the Claude Code session
- The hook fires on ALL Write tool calls, not just `.orbit/notes/` writes; the python3 check filters to only output the delegation prompt when appropriate

**Important note on hook behavior verification:** The exact mechanism by which hook stdout becomes a Claude prompt (versus a logged message) depends on Claude Code version behavior. The Phase 1 research verified that hook output is captured — but whether it auto-triggers agent delegation or requires explicit phrasing is not 100% confirmed without live testing. The planner should include a smoke test task.

### Pattern 2: Astro Navigator Voice (BRND-01)

**What:** Astro's completion output must use the exact vocabulary from `mvp/06-BRANDING.md`. The current `astro.md` body ends with "report a structured summary: notes processed, themes assigned, new suggestions, actions extracted" — this is functional but does NOT specify the spatial vocabulary.

**Required output format (from `mvp/06-BRANDING.md` — authoritative):**
```
Astro: Signal scan complete.
  4 signals processed → 3 constellations
  ● Launch Readiness    — 2 new signals, 3 missions extracted
  ● API Redesign        — 1 new signal, 1 mission extracted
  ● Data Platform       — 1 new signal
  Star chart updated.

  New constellation suggested:
  ○ Data Migration — detected in 2 signals. Confirm?
```

**What needs to change in `astro.md`:** The "Step 5: Memory Update / Report" section must be replaced with explicit formatting instructions that match the navigator voice spec. The current instruction to "report a structured summary" must be replaced with the exact format.

**Also needed:** Astro's "When no new notes" message:
```
Astro: All signals already charted. Nothing new to organize.
```

### Pattern 3: Full Ingest → Organize → Status Flow

**End-to-end sequence (what Phase 2 makes work automatically):**
```
User: /orbit-ingest
  → Skill detects MCPs, offers sources
  → User picks Granola, specifies 5 days
  → Skill calls Granola MCP → receives meeting data
  → Skill writes N notes to .orbit/notes/YYYY-MM-DD-title.md
  → [PostToolUse hook fires for each Write]
  → [Hook detects .orbit/notes/ path]
  → [Hook outputs delegation directive]
  → [Claude delegates to Astro]
  → Astro reads unorganized notes (themes: [])
  → Astro assigns themes, extracts action items, logs decisions, rebuilds index
  → Astro reports: "Signal scan complete. N signals → M constellations."
  → Skill reports: "Signal scan complete — N meetings captured..."
  → User runs /orbit-status → sees populated workspace
```

**Critical observation:** The hook fires once per Write call. If 4 notes are written, the hook fires 4 times. Astro should be invoked once (or handle multiple calls gracefully). The current `orbit-ingest` SKILL.md says the hook "auto-triggers Astro for each note" — this is correct behavior (Astro should process notes as they arrive), but Astro must handle the case where it is invoked multiple times and process only unorganized notes each time (notes with `themes: []`).

### Pattern 4: Engin Memory and Citation (ENGN-01 through ENGN-04)

**What already exists:** `engin.md` has a complete system prompt with 7 capabilities, citation rules, and memory instructions. The `memory: project` frontmatter is set.

**What memory: project creates:** A `.claude/agent-memory/engin/` directory in the project. Engin's "Memory" section in its prompt says to save accumulated insights after each significant interaction. This is the persistence mechanism.

**Verification needed:** The engin.md body's Memory section says to save things but does not specify HOW (which file, what format). Claude Code's `memory: project` creates a directory but the agent must use Write/Edit tools to write to files in that directory. The current Engin system prompt does not specify the path `.claude/agent-memory/engin/` — it just says "save to your memory." This should work because Claude Code manages the memory write path, but it's worth verifying.

**Citation pattern (already in engin.md, ENGN-02):**
```
"(from Sprint Review, 2026-03-27)"
"(Daniel mentioned in standup, 2026-03-28)"
```

**Fact-type labeling (ENGN-03, already in engin.md):**
- `decisions (confirmed)` — from note frontmatter `decisions:` field
- `discussions (open)` — from note body or questions field
- `inference (your analysis)` — Engin's own synthesis

### Anti-Patterns to Avoid

- **Hook using `$TOOL_INPUT` as env variable:** Verified pitfall from Phase 1. Hook data comes via stdin, not environment. The current placeholder correctly uses `sys.stdin`.
- **Hook exiting non-zero on `.orbit/notes/` detect:** Must always exit 0. Non-zero exit would block Claude Code. Use `|| true`.
- **Astro creating themes directory eagerly:** Astro should only create `.orbit/themes/<theme>/` when it confirms a theme (i.e., enough evidence to be non-suggested). New themes go to `_suggested/` first.
- **Astro modifying note body:** Only `themes:` in YAML frontmatter gets updated. Body content is sacred (from astro.md: "NEVER modify note content body").
- **Hook triggering Astro for non-notes writes:** The python3 guard must filter to `.orbit/notes/` path only. Brief writes, artifact writes must NOT trigger Astro.
- **Rebuilding orbit-ingest from scratch:** The Phase 1 SKILL.md already has all 5 source flows complete. Phase 2 only needs to verify it works end-to-end and update the hook.
- **Over-specifying Engin's memory format:** Engin's `memory: project` is handled by Claude Code infrastructure. Don't write custom memory management — trust the built-in mechanism.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Auto-delegate after note write | Custom delegation dispatch code | PostToolUse hook → Claude auto-delegates based on agent description | Built-in Claude Code mechanism; agents auto-receive from description matching |
| Astro theme deduplication | Custom dedup algorithm | Natural language instruction in Astro's system prompt ("Deduplicate: same task text + same owner") | Claude handles deduplication semantically; no code needed |
| MCP detection in orbit-ingest | Tool registry API call | Natural language in skill prompt ("Check if tools matching 'granola' exist") | Claude natively knows its available tools per session |
| Note file naming | Custom slug generator | Claude generates `YYYY-MM-DD-title.md` from meeting title | Good enough; consistent with pattern established in orbit-init sample note |
| Cross-session Engin memory | Custom state file | `memory: project` frontmatter | Built-in; creates `.claude/agent-memory/engin/` automatically |
| Granola data parsing | Custom parser | Granola MCP tools return structured data — shape it into note format | MCP handles data retrieval; Claude handles shaping |

**Key insight:** Phase 2 has almost no new "code" to write. The system prompts, skill bodies, and agent definitions were written in Phase 1. Phase 2 is primarily: (1) upgrade the hook to actually work, (2) verify branding matches spec, (3) verify end-to-end flow.

---

## Common Pitfalls

### Pitfall 1: Hook Output Not Triggering Astro Delegation
**What goes wrong:** Hook fires, outputs delegation message, but Claude does not actually invoke Astro. The note gets written but stays unorganized (`themes: []`).
**Why it happens:** Hook stdout goes to Claude Code's output stream, but if phrasing is too weak ("consider running Astro") Claude may treat it as informational, not directive.
**How to avoid:** Use imperative, unambiguous phrasing: "Delegate to the Astro agent now." Include the specific action: "to assign themes, extract action items, log decisions, and rebuild the index." This matches Astro's description field, triggering auto-delegation.
**Warning signs:** After `/orbit-ingest`, notes have `themes: []` in frontmatter; `.orbit/index.md` shows stale data; no Astro confirmation message appears.

### Pitfall 2: Hook Fires on Every Write, Not Just Notes
**What goes wrong:** User runs `/orbit-brief` which writes a brief to `.orbit/briefs/`. The hook fires, detects it is NOT in `.orbit/notes/`, but the python3 condition is wrong and triggers Astro anyway.
**Why it happens:** Off-by-one in the path check: `'.orbit/notes/' in p` must use the full path segment. A path like `.orbit/notes-archive/` would also match.
**How to avoid:** The check `'.orbit/notes/' in p` with the trailing slash is correct and specific. Verify with a test that writes to `.orbit/briefs/` and confirms the hook produces no output.
**Warning signs:** Astro is invoked after `/orbit-brief` runs; duplicate action items appear.

### Pitfall 3: Astro Creates Theme Directory Before User Confirms
**What goes wrong:** Astro creates `.orbit/themes/api-redesign/` immediately, bypassing the suggested workflow. User never sees the suggested theme; it becomes active without confirmation.
**Why it happens:** Astro's logic says "if content fits existing theme → assign, else suggest in `_suggested/`" but an implementation bug may create the theme directory directly.
**How to avoid:** Astro's system prompt is explicit: "Suggested themes need user confirmation before becoming active directories." The planner must verify this instruction is prominently placed in astro.md.
**Warning signs:** New themes appear as active directories immediately after first ingest; `_suggested/` is always empty.

### Pitfall 4: Astro Processes Already-Organized Notes
**What goes wrong:** Astro re-processes notes that already have themes assigned, potentially adding duplicate action items and decision log entries.
**Why it happens:** Astro checks `themes: []` in frontmatter to identify unorganized notes. If the YAML parser treats `themes: []` vs `themes: [api-redesign]` inconsistently, or if Astro's grep pattern is imprecise, it may re-process organized notes.
**How to avoid:** Astro's system prompt says "Read notes to process: those with `themes: []` in frontmatter." The Grep pattern for this is `themes: \[\]` — exact empty array syntax. Notes with any theme assigned will have `themes: [something]` or `themes:\n  - something`.
**Warning signs:** Decision log grows unboundedly; action items double on each Astro invocation.

### Pitfall 5: orbit-ingest Completion Message Claims Astro Organized When Hook Hasn't Fired
**What goes wrong:** The `orbit-ingest` SKILL.md completion message says "Astro is organizing... ✓ 3 constellations, 6 missions, 4 coordinates logged." But the hook fires asynchronously (or not at all), so the message is premature or incorrect.
**Why it happens:** The skill writes notes and immediately reports Astro's results — but Astro hasn't actually run yet.
**How to avoid:** The completion message should be forward-looking: "Astro will organize... [hook will trigger]" OR the skill should explicitly invoke Astro after writing all notes (not rely on the hook). The current SKILL.md says "the PostToolUse hook in `.claude/settings.json` triggers Astro" — the message is technically correct if the hook works. If the hook is unreliable, fallback is to add explicit Astro delegation in the skill body.
**Warning signs:** User sees "✓ 3 constellations" in the completion message but `/orbit-status` shows unorganized notes.

### Pitfall 6: Engin's Memory Not Persisting
**What goes wrong:** Engin's memory directive ("save to your memory") produces no actual files in `.claude/agent-memory/engin/`. Cross-session context is never accumulated.
**Why it happens:** `memory: project` creates the directory, but Engin must explicitly write files there. If Engin's Write tool calls don't target `.claude/agent-memory/engin/`, the memory section is a no-op.
**How to avoid:** The engin.md Memory section should ideally specify the memory file path and format. Claude Code's `memory: project` mechanism may handle this automatically (the agent's memory writes go to the memory directory). Verify with a live test session.
**Warning signs:** `.claude/agent-memory/engin/` is empty or absent after asking Engin a question.

---

## Code Examples

Verified patterns from Phase 1 research and design docs.

### Upgraded settings.json hook (ASTR-08)
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import sys, json; d=json.load(sys.stdin); p=d.get('tool_input',{}).get('file_path',''); print('Orbit: Note written to .orbit/notes/. Delegate to the Astro agent now to assign themes, extract action items, log decisions, and rebuild the index.') if '.orbit/notes/' in p else None\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

**Note:** install.sh must also be updated to ship this upgraded hook when users install Orbit fresh. The idempotency check in install.sh compares command strings — the new command string differs from the Phase 1 placeholder, so a re-install on an existing project will detect the change and add the new hook. **However**, this creates a duplicate — install.sh also needs a removal step for the old placeholder hook when upgrading. The planner should decide: (a) detect and replace old command string, or (b) accept that re-installers will have both hooks (the old one is benign — it exits 0 and only echoes). Option (b) is simpler and safe.

### Astro navigator voice (BRND-01) — addition to astro.md
```markdown
## Completion Report Format

When done processing, report using this exact navigator voice:

```
Astro: Signal scan complete.
  N signals processed → M constellations
  ● Theme Name    — N new signals, N missions extracted
  ● Theme Name    — N new signal
  Star chart updated.

  New constellation suggested:
  ○ Theme Name — detected in N signals. Confirm?
```

When no new notes to process:
```
Astro: All signals already charted. Nothing new to organize.
```

**Vocabulary:**
- Notes = signals
- Themes = constellations
- Action items = missions
- index.md = star chart
- `●` for active themes, `○` for suggested
```

### Unorganized note detection pattern for Astro
```
When scanning for unorganized notes, use Grep to find notes where the themes field is an empty array:
- Pattern: `themes: \[\]`
- Path: `.orbit/notes/*.md`
- Only process notes that match this pattern
```

### Note frontmatter — complete canonical format (INGS-07)
```yaml
---
title: Sprint Review — API v2 Migration
date: 2026-03-27
source: granola
participants: [Daniel, Maria, Carlos]
themes: []
decisions:
  - Switch to REST from GraphQL for MVP
  - Delay mobile app to Q2
questions:
  - Who owns the data migration?
action_items:
  - text: Draft API migration plan
    owner: Daniel
    due: 2026-04-01
    status: pending
  - text: Schedule security audit
    owner: Maria
    status: pending
---

## Summary
[2-3 sentence overview]

## Key Points
[Bullet points]

## Discussion Details
[Longer form, organized by topic]
```

Source: `mvp/02-ARCHITECTURE.md` — File Formats section

### Astro theme directory structure
```
.orbit/themes/
├── _suggested/
│   └── data-migration/         ← Astro creates here first
│       └── suggestion.md       ← Why suggested, which notes reference it
└── api-redesign/               ← Only after user confirms
    ├── theme.md                ← Theme metadata
    ├── action-items.md         ← Action items for this theme
    └── artifacts/              ← Generated artifacts (Phase 3)
```

### Decision log entry format
```markdown
| 2026-03-27 | Switch to REST from GraphQL for MVP | Sprint Review | api-redesign | confirmed |
```
Columns: Date | Decision | Source (note title) | Theme | Status

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|-----------------|--------------|--------|
| Phase 1 placeholder hook (echo only) | Phase 2 directive hook (triggers Astro delegation) | Phase 2 | Makes ingest → organize automatic |
| Manual Astro invocation | PostToolUse hook auto-delegation | Phase 2 | No manual step after ingest |
| Astro reports unstructured summary | Astro reports in navigator voice | Phase 2 | Consistent brand voice |

**Phase 1 established:**
- `astro.md` with complete organization system prompt (functional — needs branding patch)
- `engin.md` with complete 7-capability advisor prompt (complete — ready to use)
- `orbit-ingest/SKILL.md` with 5 source paths (complete — relies on hook for Astro trigger)
- `settings.json` with placeholder hook structure (incomplete — needs upgrade)
- `orbit-status/SKILL.md` with full spatial display (complete — no changes)

**Phase 2 only needs to:**
1. Upgrade `settings.json` hook to trigger Astro delegation
2. Update `astro.md` completion report section to use navigator voice
3. Update `install.sh` to ship the upgraded hook
4. Verify end-to-end flow (ingest → note write → hook fires → Astro runs → status shows organized workspace)

---

## Open Questions

1. **Hook output mechanism — does stdout auto-trigger agent delegation?**
   - What we know: Hook stdout is captured by Claude Code and surfaces as a message Claude sees. Phase 1 research confirmed hook data arrives via stdin. Official docs say hooks can "provide feedback to Claude."
   - What's unclear: Whether outputting "Delegate to the Astro agent now" is sufficient to trigger Astro, or whether Claude needs to see this in a specific context to act on it.
   - Recommendation: Treat as MEDIUM confidence. The planner should include a smoke test task that verifies Astro is actually invoked. If the hook-output approach fails, the fallback is to add an explicit `@astro` delegation call at the end of the orbit-ingest SKILL.md body (after writing all notes). This fallback is robust and does not depend on hook phrasing.

2. **Hook fires N times for N notes — Astro invoked N times**
   - What we know: The hook fires on every Write call. Writing 4 Granola meetings = 4 hook firings = up to 4 Astro invocations.
   - What's unclear: Whether Claude Code will batch these or invoke Astro 4 times sequentially. Multiple Astro invocations is not wrong (Astro skips already-organized notes) but is inefficient.
   - Recommendation: Accept N invocations for MVP. Astro handles idempotency via the `themes: []` check. If performance is a concern in Phase 3, add a "run once after all notes written" pattern in the skill body.

3. **install.sh and the hook upgrade — does re-install create duplicate hooks?**
   - What we know: install.sh uses command-string set-intersection to detect duplicates. The new hook command string differs from Phase 1.
   - What's unclear: Whether to (a) update install.sh to detect and replace the old hook or (b) accept that both hooks coexist on re-install.
   - Recommendation: Option (b) — both hooks coexist safely. The old hook is benign (always exits 0, only echoes if `.orbit/notes/` in path). No breaking behavior. Simplest path for Phase 2.

4. **Engin `memory: project` — does write path need to be specified?**
   - What we know: `memory: project` creates `.claude/agent-memory/engin/`. The agent can use Write/Edit to files in that path.
   - What's unclear: Whether Claude Code automatically routes Engin's memory writes to `.claude/agent-memory/engin/` or whether Engin must specify full paths.
   - Recommendation: The current engin.md says "save to your memory" which is intentionally vague — Claude Code's memory mechanism handles the routing. This is LOW risk. If memory is not persisting after Phase 2, add explicit path instructions to engin.md.

---

## Validation Architecture

nyquist_validation is enabled. This remains a no-code markdown-only project.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual validation only — no automated test runner |
| Config file | None |
| Quick run command | Manual: file existence and content spot-checks |
| Full suite command | Manual: full `/orbit-ingest` flow in a Claude Code session |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INGS-01 | `/orbit-ingest` presents source options based on MCPs | manual-claude | Run `/orbit-ingest` and observe offered sources | ✅ (SKILL.md exists) |
| INGS-02 | Granola path writes notes to `.orbit/notes/` | manual-claude | Run Granola ingest path; verify note files created with correct frontmatter | ✅ (SKILL.md exists) |
| INGS-03 | File path generates structured note | manual-claude | Run `/orbit-ingest meeting.txt`; verify note frontmatter fields | ✅ (SKILL.md exists) |
| INGS-04 | Paste path generates structured note | manual-claude | Paste content via guided flow; verify note created | ✅ (SKILL.md exists) |
| INGS-05 | Jira path writes notes | manual-claude | Run Jira ingest (requires Atlassian MCP); verify note files | ✅ (SKILL.md exists) |
| INGS-06 | Slack path writes note | manual-claude | Run Slack ingest (requires Slack MCP); verify note file | ✅ (SKILL.md exists) |
| INGS-07 | All notes have valid YAML frontmatter | shell-check | `python3 -c "import yaml; [yaml.safe_load(open(f).read().split('---')[1]) for f in glob('.orbit/notes/*.md')]"` | ❌ Wave 0 — test only exists after a note is written |
| ASTR-01 | astro.md has correct frontmatter (model: sonnet, memory: project, restricted tools) | shell | `grep -q "model: sonnet" orbit-pm/.claude/agents/astro.md && grep -q "memory: project" orbit-pm/.claude/agents/astro.md` | ✅ File exists |
| ASTR-02–07 | Astro organizes notes, extracts actions, logs decisions, rebuilds index | manual-claude | After ingest, check note `themes:` field, check `.orbit/themes/`, check `.orbit/decisions/log.md`, check `.orbit/index.md` | ✅ Agent exists |
| ASTR-08 | Hook auto-triggers Astro after note write | manual-claude | Write a note; observe if Astro is invoked automatically | ❌ Wave 0 — hook upgrade |
| ENGN-01 | engin.md has correct frontmatter (model: inherit, memory: project, WebSearch) | shell | `grep -q "model: inherit" orbit-pm/.claude/agents/engin.md && grep -q "WebSearch" orbit-pm/.claude/agents/engin.md` | ✅ File exists |
| ENGN-02–04 | Engin answers with citations, distinguishes fact types, persists memory | manual-claude | Ask Engin a PM question; verify citation format, verify `.claude/agent-memory/engin/` grows | ✅ Agent exists |
| BRND-01 | Astro uses navigator voice | shell | `grep -q "Signal scan complete" orbit-pm/.claude/agents/astro.md` | ❌ Wave 0 — branding patch |
| BRND-02 | Engin uses advisor voice | manual-claude | Observe Engin output for spatial terms (drifting, coordinates) | ✅ Agent exists |
| BRND-03 | `/orbit-status` uses spatial formatting | manual-claude | Run `/orbit-status`; verify ◉, ★, Missions, Coordinates in output | ✅ Already implemented in Phase 1 |
| BRND-04 | Skill completion messages suggest next step | shell | `grep -q "Next:" orbit-pm/.claude/skills/orbit-ingest/SKILL.md` | ✅ Already in SKILL.md |

### Sampling Rate
- **Per task commit:** `grep -q "Signal scan complete" orbit-pm/.claude/agents/astro.md && grep -q "'.orbit/notes/' in p" orbit-pm/.claude/settings.json && echo "PASS"`
- **Per wave merge:** Full install + ingest smoke test in Claude Code session
- **Phase gate:** Full ingest → organize → status flow verified before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `orbit-pm/.claude/settings.json` hook upgrade — covers ASTR-08
- [ ] `orbit-pm/.claude/agents/astro.md` branding patch — covers BRND-01
- [ ] (No new files to create — all gaps are modifications to existing Phase 1 files)

---

## Phase 2 Work Summary

Based on inspection of all Phase 1 deliverables against Phase 2 requirements, here is the precise work needed:

### Files to MODIFY (not recreate)

| File | Change | Requirements |
|------|--------|-------------|
| `orbit-pm/.claude/settings.json` | Replace placeholder hook command with real delegation directive | ASTR-08 |
| `orbit-pm/.claude/agents/astro.md` | Add navigator voice completion report format to body | BRND-01 |
| `orbit-pm/install.sh` | Updated settings.json will be shipped automatically (no change needed to install.sh logic) | ASTR-08 |

### Files to VERIFY (no change expected)

| File | Verify Against | Requirements |
|------|---------------|-------------|
| `orbit-pm/.claude/agents/astro.md` | Complete system prompt per mvp/04-PROMPTS.md | ASTR-01 through ASTR-07 |
| `orbit-pm/.claude/agents/engin.md` | Complete 7-capability prompt per mvp/04-PROMPTS.md | ENGN-01 through ENGN-04 |
| `orbit-pm/.claude/skills/orbit-ingest/SKILL.md` | 5 source paths, note format, completion message | INGS-01 through INGS-07 |
| `orbit-pm/.claude/skills/orbit-status/SKILL.md` | Spatial formatting (◉, ★, missions, coordinates) | BRND-03 |

### End-to-End Smoke Test

After modifications: full flow verification in Claude Code session — ingest → automatic organization → status display.

---

## Sources

### Primary (HIGH confidence)
- `/Users/equipo/Orbit/mvp/02-ARCHITECTURE.md` — canonical repo structure, .orbit/ layout, all file formats (note, config, theme metadata, decision log), agent definitions, hooks configuration intent, data flows
- `/Users/equipo/Orbit/mvp/04-PROMPTS.md` — authoritative Astro and Engin system prompts (complete), Note Creation Prompt, Artifact Generation Prompt
- `/Users/equipo/Orbit/mvp/05-SKILLS.md` — authoritative orbit-ingest flow (all 5 source paths), MCP detection approach, skill map
- `/Users/equipo/Orbit/mvp/06-BRANDING.md` — authoritative vocabulary map, agent voice examples (Astro navigator, Engin advisor), exact completion message templates
- `/Users/equipo/Orbit/orbit-pm/.claude/agents/astro.md` — Phase 1 delivered file; verified against mvp/04-PROMPTS.md
- `/Users/equipo/Orbit/orbit-pm/.claude/agents/engin.md` — Phase 1 delivered file; verified against mvp/04-PROMPTS.md
- `/Users/equipo/Orbit/orbit-pm/.claude/skills/orbit-ingest/SKILL.md` — Phase 1 delivered file; verified against mvp/05-SKILLS.md
- `/Users/equipo/Orbit/orbit-pm/.claude/settings.json` — current Phase 1 placeholder hook; Phase 2 upgrades this
- `/Users/equipo/Orbit/.planning/phases/01-foundation/01-RESEARCH.md` — Phase 1 verified patterns: hook stdin behavior, agent frontmatter fields, anti-patterns

### Secondary (MEDIUM confidence)
- Phase 1 `01-06-SUMMARY.md` — confirmed install.sh idempotency patterns (set intersection deduplication, `read || response=''` guard)
- Phase 1 `01-04-PLAN.md` and related summaries — confirmed agent and skill decisions (orbit-init has no allowed-tools restriction; orbit-status is Read-only)

### Tertiary (LOW confidence)
- Hook stdout → Claude delegation mechanism: documented in Claude Code docs as "hooks provide feedback to Claude" but exact triggering phrasing is not formally specified — needs live verification.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Phase 1 verified all Claude Code mechanisms; no new dependencies in Phase 2
- Architecture: HIGH — mvp/02-06 are authoritative specs; Phase 1 delivered files match them
- Pitfalls: HIGH — hook behavior pitfalls verified in Phase 1; Astro deduplication specified in system prompt
- Hook delegation mechanism: MEDIUM — stdout → delegation trigger not formally specified; needs live test

**Research date:** 2026-03-29
**Valid until:** 2026-06-29 (stable — Claude Code extension model well-established; Phase 2 changes are targeted)
