# Phase 3: Intelligence Skills - Research

**Researched:** 2026-03-29
**Domain:** Claude skill prompt engineering — verify-and-refine existing skill files against 19 requirements
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Brief structure & priority**
- D-01: Daily brief leads with overdue items (drifting missions + stalled coordinates) before showing new signals — force attention on what's slipping
- D-02: When no items are overdue, skip the drifting section entirely — cleaner output, draws attention when it does appear
- D-03: Weekly brief is structurally different from daily: focuses on decision velocity (confirmed vs stalled), action burndown (completed/new/overdue), cross-theme patterns, and trend detection — not just a wider time window

**RICE challenge tone**
- D-04: Engin uses direct pushback when evidence contradicts PM ratings — advisor voice, not yes-man. Example: "You scored X high-impact but it hasn't appeared in any meeting for 3 weeks. Is this a gut call or did I miss a signal?"
- D-05: PM can override any RICE score. Engin labels overrides as "gut call" vs "evidence-based" in the scorecard so the distinction is visible (asterisk notation with footnote)

**Decision staleness rules**
- D-06: Stalled decision = confirmed but no action items followed within 7 days (one sprint cadence)
- D-07: Contradictions: flag with both source meetings cited, suggest scheduling a 15-min call to resolve ("lock coordinates")
- D-08: Reversals get a distinct callout from contradictions — a later meeting overturning an earlier decision without explicit acknowledgment is flagged separately so PM can confirm the reversal was intentional

### Claude's Discretion
- Meeting prep depth: how much context per attendee, how many themes to pull
- Artifact versioning UX: exact auto-increment behavior (v2, v3)
- Skill completion message wording (within BRND-04 constraint: always suggest next step)
- How many items to show before truncating in briefs
- Template fill behavior when data is missing

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BREF-01 | `/orbit-brief` generates daily briefing: overdue items first, key updates by theme, pending actions, open questions | SKILL.md exists with full flow — verify D-01/D-02 overdue-first rule is explicit |
| BREF-02 | `/orbit-brief weekly` generates weekly summary: theme progress, decision velocity, action burndown | SKILL.md weekly flow exists — verify D-03 structural difference is explicit (not just wider window) |
| BREF-03 | Briefs written to `.orbit/briefs/YYYY-MM-DD.md` AND displayed in conversation | SKILL.md step 6+7 present — verify both write and display are specified |
| PRIO-01 | `/orbit-priorities` identifies candidate features/initiatives from notes and themes | SKILL.md step 1 present — verify identification sources are explicit |
| PRIO-02 | Scores each candidate using RICE dimensions with evidence from meetings | SKILL.md RICE flow present — verify evidence citation per dimension is explicit |
| PRIO-03 | Generates ranked scorecard at `.orbit/artifacts/rice-scorecard-YYYY-MM-DD.md` | SKILL.md write step present — verify path matches requirement |
| PRIO-04 | Challenges PM when data contradicts assumptions | SKILL.md Challenge section present — verify D-04/D-05 asterisk notation for gut-call override |
| DCSN-01 | `/orbit-decisions` reviews full decision log from `.orbit/decisions/log.md` | SKILL.md reads log.md — present |
| DCSN-02 | Detects stalled decisions: confirmed but no action items within 7 days | SKILL.md "stalled" mode — verify D-06 7-day rule is explicit |
| DCSN-03 | Detects contradictions: conflicting decisions across different meetings | SKILL.md "contradictions" mode — verify D-08 reversal distinct from contradiction |
| DCSN-04 | Suggests resolution actions ("Schedule a 15-min call to lock these coordinates") | SKILL.md Resolution Suggestion section — verify D-07 exact "lock coordinates" language |
| PREP-01 | `/orbit-prep <topic>` gathers context relevant to meeting topic from notes and themes | SKILL.md Topic Research section — present |
| PREP-02 | For named attendees, pulls their action items, recent mentions, open questions | SKILL.md Attendee Research section — present |
| PREP-03 | Generates suggested agenda, talking points, risk areas, and decisions needed | SKILL.md output format — present, includes all four sections |
| PREP-04 | Optionally writes to `.orbit/briefs/prep-YYYY-MM-DD-topic.md` | SKILL.md "Save Prep" section — present, but currently prompts user (y/N confirm) |
| ARTF-01 | `/orbit-artifact <template>` reads template from `.orbit/templates/` and generates document | SKILL.md context assembly reads template — present |
| ARTF-02 | Gathers context from notes, action items, decisions for specified theme (or all themes) | SKILL.md context assembly present for both cases |
| ARTF-03 | Handles versioning: detects existing artifact, creates -v2, -v3 | SKILL.md versioning check section — present, auto-increments |
| ARTF-04 | 5 built-in templates: PRD, Decision Record, Weekly Summary, Stakeholder Update, RICE Scorecard | All 5 template files exist and are complete |
</phase_requirements>

---

## Summary

Phase 3 is a **verify-and-refine phase**, not a build-from-scratch phase. All five skill files (`orbit-brief`, `orbit-priorities`, `orbit-decisions`, `orbit-prep`, `orbit-artifact`) were created in Phase 1 Plan 05 as complete Claude prompt workflows. All five template files (prd, decision-record, rice-scorecard, stakeholder-update, weekly-summary) are also complete.

The work is to audit each skill against its requirements and the locked decisions from CONTEXT.md, then apply surgical edits where gaps are found. The pattern established in Phase 2 applies here: read the file, check against a systematic requirements checklist, patch minimally with Edit tool, never rewrite.

The main gaps to expect are in the nuance layer — the locked decisions (D-01 through D-08) add specific behavioral rules that the Phase 1 skill files may not encode precisely. For example: D-02 says skip the Drifting section entirely when no items are overdue (existing SKILL.md says "if a section has no entries, omit that section," which may be sufficient). D-05 says asterisk notation for gut-call overrides (not currently in orbit-priorities SKILL.md or the rice-scorecard template). D-08 says reversals get a distinct `↺ Reversal Detected` callout separate from contradictions (orbit-decisions SKILL.md currently treats reversals under "contradictions" without a distinct format).

**Primary recommendation:** Plan three tasks: (1) verify orbit-brief against BREF-01/02/03 + D-01/D-02/D-03, (2) verify orbit-priorities and orbit-decisions against PRIO + DCSN requirements + D-04/D-05/D-06/D-07/D-08, (3) verify orbit-prep and orbit-artifact against PREP + ARTF requirements. Apply minimal Edit patches only where gaps are found.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Claude SKILL.md format | Phase 1 established | Skill prompt with YAML frontmatter + markdown body | Project-wide pattern — all 8 skills use it |
| Claude AGENT.md format | Phase 1 established | Agent with `model:`, `memory:`, `tools:`, `disallowedTools:` | Established in Phase 2 for engin.md and astro.md |
| `.orbit/` file system | Phase 1 established | All skills read/write here | The data layer — notes, themes, decisions, briefs, artifacts |
| HTML comment instructions | Phase 1 decision (01-03) | Template sections use `<!-- Fill with: ... -->` to instruct Engin | Invisible in rendered output, keeps documents clean |
| `{variable}` substitution | Phase 1 established | Template variables: `{title}`, `{date}`, `{theme}`, etc. | Consistent across all 5 templates |

### No External Dependencies

This phase has no new libraries, packages, or external tools. Everything is pure markdown and Claude prompt engineering. The entire "stack" is:
- SKILL.md files in `orbit-pm/.claude/skills/<name>/`
- Template `.md` files in `orbit-pm/templates/`
- Agent files in `orbit-pm/.claude/agents/`

**Installation:** None required. All files already exist from Phase 1.

---

## Architecture Patterns

### Recommended Project Structure

All Phase 3 assets already exist:

```
orbit-pm/
├── .claude/
│   ├── skills/
│   │   ├── orbit-brief/SKILL.md       # BREF-01, BREF-02, BREF-03
│   │   ├── orbit-priorities/SKILL.md  # PRIO-01, PRIO-02, PRIO-03, PRIO-04
│   │   ├── orbit-decisions/SKILL.md   # DCSN-01, DCSN-02, DCSN-03, DCSN-04
│   │   ├── orbit-prep/SKILL.md        # PREP-01, PREP-02, PREP-03, PREP-04
│   │   └── orbit-artifact/SKILL.md    # ARTF-01, ARTF-02, ARTF-03, ARTF-04
│   └── agents/
│       ├── engin.md                   # Advisor agent (delegates from skills)
│       └── astro.md                   # Organization agent (unchanged)
└── templates/
    ├── prd.md                         # ARTF-04 template 1
    ├── decision-record.md             # ARTF-04 template 2
    ├── rice-scorecard.md              # ARTF-04 template 3
    ├── stakeholder-update.md          # ARTF-04 template 4
    └── weekly-summary.md              # ARTF-04 template 5
```

### Pattern 1: Skill as Complete Workflow Prompt

Skills are pure Claude natural language instructions — they ARE the implementation. The skill body describes:
1. Parse arguments
2. Assemble context (what to read first)
3. Execute analysis flow (the logic)
4. Output format (exact markdown structure)
5. Write output (file path)
6. Completion message (with next-step suggestion per BRND-04)
7. Error handling (what to say when data is missing)

```markdown
# Example skill section order (orbit-brief as reference)
## Parse Arguments
## Context Assembly
## [Daily/Weekly] Brief Flow
## [Daily/Weekly] Brief Output Format
## After Generating
## Error Handling
```

### Pattern 2: Verify-Then-Patch (Phase 2 established)

The execution pattern from Phase 2 applies:
1. Read the existing file completely
2. Check against each requirement systematically
3. If gap found: apply minimal Edit patch — add missing rule, example, or section
4. If file is complete: confirm and move on
5. Never rewrite a working file from scratch

### Pattern 3: Spatial Vocabulary Scope

Spatial vocabulary rules from Phase 1 (reinforced in Phase 2):
- Spatial terms (`drifting`, `coordinates`, `missions`, `signals`, `constellations`) appear in **terminal output sections and completion messages only**
- NOT in YAML frontmatter
- NOT in file content written to disk (briefs, artifacts)
- NOT in error messages
- The brief output format titles (`Mission Briefing`, `Coordinate Audit`, `Pre-Launch Check`) ARE spatial — they appear in the file written to disk, which is acceptable since they are document titles generated for PM consumption

### Anti-Patterns to Avoid

- **Rewriting complete files:** Phase 2 established that most Phase 1 files are already correct. Rewriting risks losing working content. Use Edit for surgical patches only.
- **Inventing new spatial vocabulary:** All spatial terms are locked from Phase 1 branding. Do not introduce new metaphors.
- **Changing output format structure:** The output format sections define exact markdown structure that PMs will rely on. Patches should ADD missing behavioral rules, not restructure output sections.
- **Breaking the "delegate to Engin" pattern:** Skills open with context assembly then delegate to Engin. Do not add Bash steps or external tool calls — skills are pure Claude prompt instructions.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Staleness detection | Custom date comparison logic | Natural language instruction in SKILL.md: "confirmed but no action items within 7 days" | Claude handles date arithmetic natively in context |
| Version auto-increment | Code to scan existing files | SKILL.md instruction: "check for v2.md, v3.md, use next available" | Claude reads the file system with Glob/Read tools |
| RICE scoring formula | Hardcoded calculation | Template comment `RICE Score = (R × I × C) / E` with score ranges in the Scoring Guide | Claude applies the formula with meeting evidence as input |
| Decision contradiction detection | Rule-based NLP | Engin's natural language analysis capability | Engin already has "always active" contradiction detection as Capability 7 |
| Template variable substitution | Code template engine | Claude reads the `{variable}` placeholders and fills them from assembled context | Claude is the template engine |

**Key insight:** This project's "stack" is Claude's own reasoning. The SKILL.md files instruct Claude what to do — they are the software. Adding code would contradict the zero-code constraint in REQUIREMENTS.md.

---

## Gap Analysis: Locked Decisions vs. Existing SKILL.md Files

This is the most important research finding — the delta between what D-01 through D-08 require and what the current SKILL.md files contain.

### orbit-brief gaps

**D-01** (overdue-first): Current SKILL.md says "Lead with urgency — the most critical items appear first" in Section rules. Also, the output format shows `⚠️ Drifting` as the first section. This is broadly correct. However, D-01 specifies "drifting missions + stalled coordinates" (both action items AND stalled decisions) in the Drifting section. The current SKILL.md shows only action items in the Drifting section example. **Gap: stalled decisions should also appear in Drifting.**

**D-02** (skip Drifting when empty): Current SKILL.md says "If a section has no entries, omit that section" — this covers D-02 implicitly. **No gap.**

**D-03** (weekly is structurally different): Current SKILL.md has a distinct weekly format with Decision Velocity, Theme Progress, Action Item Burndown, Cross-Theme Patterns, and Risks sections. This matches D-03's intent. **No gap.**

### orbit-priorities gaps

**D-04** (direct pushback, advisor voice): The current Challenge section says "Direct, opinionated statement challenging any PM assumptions contradicted by meeting evidence" with the exact example from D-04. **No gap.**

**D-05** (asterisk notation for gut-call overrides): The current SKILL.md has no mention of PM score overrides or asterisk notation. The rice-scorecard template also lacks an override/footnote mechanism. **Gap: both orbit-priorities SKILL.md and rice-scorecard template need override documentation behavior.**

### orbit-decisions gaps

**D-06** (7-day stall rule): The current SKILL.md says "confirmed but no corresponding action items exist in any theme's action-items.md" and "Check the gap between decision date and today." The 7-day threshold is mentioned in the "stalled" mode description ("confirmed but no follow-up action items created within 7 days"). **No gap — 7 days is explicit.**

**D-07** (suggest "lock coordinates" resolution): The current Resolution Suggestion section says "Recommend: schedule a 15-min call to lock the N uncharted coordinates." **No gap — exact language is present.**

**D-08** (reversals distinct from contradictions): The current SKILL.md mentions reversals under the "contradictions" mode: "Reversals: a later meeting overturned an earlier decision without explicit acknowledgment." However, the output format shows both under `⚠️ Coordinate Conflicts` — there is no distinct `↺ Reversal Detected` callout format. The CONTEXT.md `<specifics>` section explicitly defines this format. **Gap: add `↺ Reversal Detected` as a distinct output section separate from `⚠️ Coordinate Conflicts`.**

### orbit-prep gaps

PREP-01 through PREP-04 are fully covered by the existing SKILL.md. The "Save Prep" section addresses PREP-04 with a `[y/N]` user confirmation — the requirement says "optionally writes," which this satisfies. **No gaps.**

### orbit-artifact gaps

ARTF-01 through ARTF-04 are all present. The versioning check, 5 templates, context assembly, and write step all exist. **No gaps.**

---

## Common Pitfalls

### Pitfall 1: Patching the Wrong File

**What goes wrong:** The RICE scorecard template (`templates/rice-scorecard.md`) and the orbit-priorities skill (`skills/orbit-priorities/SKILL.md`) both describe RICE scoring. A patch for D-05 (gut-call override notation) could be applied to only one of them, leaving the other inconsistent.
**Why it happens:** Two files describe the same concept from different angles — the skill is the process, the template is the output format.
**How to avoid:** For D-05, patch both: (1) orbit-priorities SKILL.md to describe how Engin labels PM overrides in the Challenge section, (2) rice-scorecard template to show the asterisk notation in the Scorecard table and footnote format at the bottom.
**Warning signs:** A skill or template describes scoring but does not mention `*` or "gut call" or override behavior.

### Pitfall 2: Spatial Vocabulary Leaking Into File Content

**What goes wrong:** Using "drifting" or "coordinates" in the markdown body of a brief file (e.g., `Mission Briefing` title written to `.orbit/briefs/`).
**Why it happens:** The brief output format uses spatial section titles. The rule says spatial vocabulary is for terminal output only.
**How to avoid:** The output format section titles (`## ⚠️ Drifting`, `## Active Missions`, etc.) are written INTO the brief file — this is acceptable because these are document section headings for PM consumption, not system messages. The restriction is on skill YAML frontmatter descriptions and error messages, not output document content.
**Warning signs:** Checking whether `## Drifting` appearing in the generated `.orbit/briefs/YYYY-MM-DD.md` file violates the spatial rule — it does NOT, based on established patterns.

### Pitfall 3: Over-Specifying Truncation Rules

**What goes wrong:** Adding a hard truncation limit (e.g., "show max 10 items") to brief output, causing PMs to miss items when they have many overdue actions.
**Why it happens:** "How many items to show before truncating" is under Claude's Discretion.
**How to avoid:** Leave truncation as Claude's judgment — the skill can say "show the most critical items; if more than 10 are overdue, note the count and show the most overdue." Do not hard-code a number that constrains future PM use.
**Warning signs:** Adding `max:` or `limit:` rules to skill output format sections.

### Pitfall 4: Missing the "Display in Conversation" Requirement

**What goes wrong:** The skill writes the brief file but only displays a completion message, not the full brief content in conversation.
**Why it happens:** Skills write files as the primary output and completion messages as a summary. BREF-03 requires both the file write AND displaying the full brief content in conversation.
**How to avoid:** orbit-brief SKILL.md step 7 says "Display in conversation" — verify this instructs Claude to output the full brief content (not just a path reference) in the conversation.
**Warning signs:** The After Generating section says only "report the path" without "display the full brief."

### Pitfall 5: Reversal vs. Contradiction Conflation

**What goes wrong:** A later meeting that overturns an earlier decision gets filed under `⚠️ Coordinate Conflicts` instead of getting its own `↺ Reversal Detected` callout.
**Why it happens:** Both are cross-meeting inconsistencies. The distinction is: contradictions = two meetings both "in play," reversals = explicit temporal override (later decision supersedes earlier one, possibly unacknowledged).
**How to avoid:** D-08 is a locked decision. The output format must have three distinct sections: `⚠️ Coordinate Conflicts` (active contradictions), `↺ Reversal Detected` (temporal overrides needing confirmation), and `⏸ Uncharted Coordinates` (stalled).
**Warning signs:** orbit-decisions SKILL.md output format that lumps reversals and contradictions into one section.

---

## Code Examples

Verified patterns from existing files:

### Daily Brief Output Format (current, verified from orbit-brief SKILL.md)

```markdown
# Mission Briefing — YYYY-MM-DD

## ⚠️ Drifting
- **[Person]**: [action item] — [X] days overdue
- Coordinate needed: [open question] (open since [date])

## Signals from the last 48h
### [Theme Name]
- [Key update] ([source note title], [date])

## Active Missions
### [Theme Name]
- [ ] **[Person]**: [action item] — due [date]
- [ ] **[Person]**: [action item] — [OVERDUE]

## Open Coordinates
- [Unresolved question] ([source note], [date])

---
*From N notes across N themes*
```

### Decision Audit Output Format (current, with D-08 gap identified)

The current format has:
```markdown
## ⚠️ Coordinate Conflicts   (contradictions AND reversals — needs split)
## ⏸ Uncharted Coordinates   (stalled decisions)
## ✓ Stable Coordinates      (healthy decisions)
```

D-08 requires splitting Coordinate Conflicts into two sections:
```markdown
## ⚠️ Coordinate Conflicts       (active contradictions — two meetings, same topic, incompatible)
## ↺ Reversal Detected           (later meeting overturned earlier decision without acknowledgment)
## ⏸ Uncharted Coordinates       (confirmed but no follow-up within 7 days)
## ✓ Stable Coordinates          (confirmed, action items assigned, no conflict)
```

### RICE Override Notation (D-05 — missing, to be added)

The rice-scorecard template Scorecard table needs an asterisk column or footnote pattern:

```markdown
| # | Initiative | R | I | C | E | Score | Evidence |
|---|-----------|---|---|---|---|-------|----------|
| 1 | Feature A | 8 | 9 | 9 | 3 | 216   | Meeting X (2026-03-20) |
| 2 | Feature B*| 7 | 10| 5 | 2 | 175   | Override — PM gut call |

*\* PM override: score adjusted from evidence-based 4 to 10. Marked as gut call.*
```

The orbit-priorities SKILL.md Challenge section needs an instruction for how to handle when PM provides their own scores:

```
If PM provides their own scores or overrides Engin's evidence-based scores:
- Apply the override
- Mark the initiative with * in the scorecard
- Add a footnote: "* PM override: [dimension] adjusted from [evidence score] to [PM score]. Gut call."
- In the Challenge section, acknowledge the override: "You overrode the Confidence score for X — noted as gut call. Watch for signals that confirm or contradict."
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Build Phase 3 from scratch | Verify and refine Phase 1 files | Phase 3 context session (2026-03-29) | All 5 skills + 5 templates already exist — work is audit + patch |
| No override tracking | Gut-call asterisk notation (D-05) | Phase 3 context | Scorecard now distinguishes evidence-based from intuition-based scores |
| Reversals lumped with contradictions | Distinct `↺ Reversal Detected` callout (D-08) | Phase 3 context | PMs can distinguish "we disagree" from "we changed course" |

---

## Open Questions

1. **How much attendee context to include in orbit-prep (PREP-02)**
   - What we know: SKILL.md says "last 14 days" for attendee research, pulls action items + what they said + open questions + stance on decisions
   - What's unclear: No upper limit on number of attendees or depth of history — this is under Claude's Discretion
   - Recommendation: Default to last 14 days, last 5 mentions per attendee; note in SKILL.md that this is adjustable via conversation

2. **Exact artifact versioning path for theme-scoped artifacts (ARTF-03)**
   - What we know: SKILL.md defines `.orbit/themes/<theme>/artifacts/<template>.md` for themed artifacts and `.orbit/artifacts/<template>.md` for unscoped
   - What's unclear: The install.sh and orbit-init scripts create `.orbit/artifacts/` but not per-theme artifact subdirectories
   - Recommendation: Verify orbit-init creates `.orbit/themes/<theme>/artifacts/` or have orbit-artifact create the directory if needed; the SKILL.md already handles this via Write tool

3. **Whether the `⚠️ Drifting` section in daily brief should include stalled decisions (D-01)**
   - What we know: D-01 says "drifting missions + stalled coordinates" — both in Drifting section. Current SKILL.md only shows action items (missions) in Drifting.
   - What's unclear: The SKILL.md section rule for Drifting says "overdue action items (most overdue first) + stalled decisions needing a call" — this matches D-01. The output format example only shows action items, but the rule above it includes both.
   - Recommendation: The rule text covers D-01. Verify that the output format example also shows a stalled decision entry. If it only shows action items, add one example entry for a stalled coordinate.

---

## Environment Availability

Step 2.6: SKIPPED (no external dependencies — this phase is purely markdown and Claude prompt file edits, no external tools, CLIs, or services required)

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual verification via grep + content inspection (no automated test runner for prompt files) |
| Config file | none |
| Quick run command | `grep -q "[pattern]" orbit-pm/.claude/skills/[skill]/SKILL.md && echo PASS` |
| Full suite command | Run all per-skill grep checks (see Phase Requirements -> Test Map below) |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BREF-01 | Daily brief leads with Drifting section; includes both overdue actions and stalled decisions | smoke | `grep -q "Drifting" orbit-pm/.claude/skills/orbit-brief/SKILL.md` | ✅ |
| BREF-02 | Weekly brief has Decision Velocity, Action Burndown, Cross-Theme Patterns sections | smoke | `grep -q "Decision Velocity" orbit-pm/.claude/skills/orbit-brief/SKILL.md` | ✅ |
| BREF-03 | Brief written to file AND displayed in conversation | smoke | `grep -q "Display in conversation" orbit-pm/.claude/skills/orbit-brief/SKILL.md` | ✅ |
| PRIO-01 | Identifies candidates from notes, action items, themes | smoke | `grep -q "Identify candidate" orbit-pm/.claude/skills/orbit-priorities/SKILL.md` | ✅ |
| PRIO-02 | RICE dimensions scored with meeting evidence citations | smoke | `grep -q "Cite specific evidence" orbit-pm/.claude/skills/orbit-priorities/SKILL.md` | ✅ |
| PRIO-03 | Scorecard written to `.orbit/artifacts/rice-scorecard-YYYY-MM-DD.md` | smoke | `grep -q "rice-scorecard-" orbit-pm/.claude/skills/orbit-priorities/SKILL.md` | ✅ |
| PRIO-04 | Challenge section with D-05 gut-call asterisk notation | smoke | `grep -q "gut call" orbit-pm/.claude/skills/orbit-priorities/SKILL.md` | ❌ Wave 0 — needs patch |
| DCSN-01 | Reads `.orbit/decisions/log.md` | smoke | `grep -q "decisions/log.md" orbit-pm/.claude/skills/orbit-decisions/SKILL.md` | ✅ |
| DCSN-02 | 7-day stall detection | smoke | `grep -q "7 days" orbit-pm/.claude/skills/orbit-decisions/SKILL.md` | ✅ |
| DCSN-03 | Distinct `↺ Reversal Detected` callout separate from contradictions | smoke | `grep -q "Reversal Detected" orbit-pm/.claude/skills/orbit-decisions/SKILL.md` | ❌ Wave 0 — needs patch |
| DCSN-04 | "lock coordinates" resolution language | smoke | `grep -q "lock" orbit-pm/.claude/skills/orbit-decisions/SKILL.md` | ✅ |
| PREP-01 | Gathers topic context from notes and themes | smoke | `grep -q "Topic Research" orbit-pm/.claude/skills/orbit-prep/SKILL.md` | ✅ |
| PREP-02 | Attendee-specific context (action items, mentions, questions, stance) | smoke | `grep -q "Attendee Research" orbit-pm/.claude/skills/orbit-prep/SKILL.md` | ✅ |
| PREP-03 | Generates agenda, talking points, risk areas, decisions needed | smoke | `grep -q "Talking Points" orbit-pm/.claude/skills/orbit-prep/SKILL.md` | ✅ |
| PREP-04 | Optionally writes to `.orbit/briefs/prep-YYYY-MM-DD-topic.md` | smoke | `grep -q "prep-" orbit-pm/.claude/skills/orbit-prep/SKILL.md` | ✅ |
| ARTF-01 | Reads template from `.orbit/templates/` | smoke | `grep -q "\.orbit/templates/" orbit-pm/.claude/skills/orbit-artifact/SKILL.md` | ✅ |
| ARTF-02 | Gathers context per theme or across all themes | smoke | `grep -q "theme specified" orbit-pm/.claude/skills/orbit-artifact/SKILL.md` | ✅ |
| ARTF-03 | Versioning: creates -v2, -v3 for existing files | smoke | `grep -q "\-v2" orbit-pm/.claude/skills/orbit-artifact/SKILL.md` | ✅ |
| ARTF-04 | All 5 templates exist with correct content | smoke | `ls orbit-pm/templates/ \| wc -l` (should be 5) | ✅ |

### Sampling Rate

- **Per task commit:** Run the smoke grep for that task's requirements (e.g., after patching orbit-decisions, run DCSN-01 through DCSN-04 checks)
- **Per wave merge:** Run all 19 requirement grep checks above
- **Phase gate:** All 19 checks green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] PRIO-04 gut-call asterisk patch — `orbit-pm/.claude/skills/orbit-priorities/SKILL.md` needs override handling language
- [ ] DCSN-03 reversal section patch — `orbit-pm/.claude/skills/orbit-decisions/SKILL.md` needs distinct `↺ Reversal Detected` output section
- [ ] `orbit-pm/templates/rice-scorecard.md` — needs asterisk notation example in Scorecard table + footnote pattern for PM overrides

*(All existing test infrastructure via grep checks — no test runner needed for prompt files)*

---

## Sources

### Primary (HIGH confidence)
- Direct file inspection: `orbit-pm/.claude/skills/orbit-brief/SKILL.md` — full content read, all sections verified
- Direct file inspection: `orbit-pm/.claude/skills/orbit-priorities/SKILL.md` — full content read, all sections verified
- Direct file inspection: `orbit-pm/.claude/skills/orbit-decisions/SKILL.md` — full content read, D-08 gap confirmed
- Direct file inspection: `orbit-pm/.claude/skills/orbit-prep/SKILL.md` — full content read, no gaps found
- Direct file inspection: `orbit-pm/.claude/skills/orbit-artifact/SKILL.md` — full content read, no gaps found
- Direct file inspection: all 5 templates in `orbit-pm/templates/` — complete with HTML comment instructions
- Direct file inspection: `orbit-pm/.claude/agents/engin.md` — 7 capabilities, communication rules, memory section
- Direct file inspection: `.planning/phases/03-intelligence-skills/03-CONTEXT.md` — locked decisions D-01 through D-08

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — established Phase 2 verify-and-patch pattern, key decisions log
- `.planning/phases/02-ingestion-agents/02-02-PLAN.md` — Phase 2 plan structure as planning template reference
- `.planning/REQUIREMENTS.md` — all 19 Phase 3 requirement IDs with exact descriptions

### Tertiary (LOW confidence)
- None — all findings based on direct file inspection

---

## Metadata

**Confidence breakdown:**
- Skill file completeness: HIGH — all 5 files read in full, gaps identified by direct comparison to locked decisions
- Gap identification: HIGH — D-05 (asterisk notation) and D-08 (reversal callout) confirmed missing by direct grep evidence
- Template completeness: HIGH — all 5 template files exist and contain correct structure
- Patch scope estimate: HIGH — 3 files need patches (orbit-priorities SKILL.md, orbit-decisions SKILL.md, rice-scorecard template), 2 files may need minor verification (orbit-brief Drifting section stalled decisions example)

**Research date:** 2026-03-29
**Valid until:** Stable — all findings based on file content, not external dependencies. Valid until files are changed.
