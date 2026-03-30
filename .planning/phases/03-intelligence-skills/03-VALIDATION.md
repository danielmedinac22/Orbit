---
phase: 3
slug: intelligence-skills
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-29
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual verification via grep + content inspection (no automated test runner for prompt files) |
| **Config file** | none |
| **Quick run command** | `grep -q "[pattern]" orbit-pm/.claude/skills/[skill]/SKILL.md && echo PASS` |
| **Full suite command** | Run all 19 per-requirement grep checks (see Per-Task Verification Map) |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run the smoke grep for that task's requirements
- **After every plan wave:** Run all 19 requirement grep checks
- **Before `/gsd:verify-work`:** All 19 checks must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | BREF-01 | smoke | `grep -q "Drifting" orbit-pm/.claude/skills/orbit-brief/SKILL.md` | ✅ | ⬜ pending |
| 03-01-02 | 01 | 1 | BREF-02 | smoke | `grep -q "Decision Velocity" orbit-pm/.claude/skills/orbit-brief/SKILL.md` | ✅ | ⬜ pending |
| 03-01-03 | 01 | 1 | BREF-03 | smoke | `grep -q "Display in conversation" orbit-pm/.claude/skills/orbit-brief/SKILL.md` | ✅ | ⬜ pending |
| 03-02-01 | 02 | 1 | PRIO-01 | smoke | `grep -q "Identify candidate" orbit-pm/.claude/skills/orbit-priorities/SKILL.md` | ✅ | ⬜ pending |
| 03-02-02 | 02 | 1 | PRIO-02 | smoke | `grep -q "Cite specific evidence" orbit-pm/.claude/skills/orbit-priorities/SKILL.md` | ✅ | ⬜ pending |
| 03-02-03 | 02 | 1 | PRIO-03 | smoke | `grep -q "rice-scorecard-" orbit-pm/.claude/skills/orbit-priorities/SKILL.md` | ✅ | ⬜ pending |
| 03-02-04 | 02 | 1 | PRIO-04 | smoke | `grep -q "gut call" orbit-pm/.claude/skills/orbit-priorities/SKILL.md` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 1 | DCSN-01 | smoke | `grep -q "decisions/log.md" orbit-pm/.claude/skills/orbit-decisions/SKILL.md` | ✅ | ⬜ pending |
| 03-03-02 | 03 | 1 | DCSN-02 | smoke | `grep -q "7 days" orbit-pm/.claude/skills/orbit-decisions/SKILL.md` | ✅ | ⬜ pending |
| 03-03-03 | 03 | 1 | DCSN-03 | smoke | `grep -q "Reversal Detected" orbit-pm/.claude/skills/orbit-decisions/SKILL.md` | ❌ W0 | ⬜ pending |
| 03-03-04 | 03 | 1 | DCSN-04 | smoke | `grep -q "lock" orbit-pm/.claude/skills/orbit-decisions/SKILL.md` | ✅ | ⬜ pending |
| 03-04-01 | 04 | 1 | PREP-01 | smoke | `grep -q "Topic Research" orbit-pm/.claude/skills/orbit-prep/SKILL.md` | ✅ | ⬜ pending |
| 03-04-02 | 04 | 1 | PREP-02 | smoke | `grep -q "Attendee Research" orbit-pm/.claude/skills/orbit-prep/SKILL.md` | ✅ | ⬜ pending |
| 03-04-03 | 04 | 1 | PREP-03 | smoke | `grep -q "Talking Points" orbit-pm/.claude/skills/orbit-prep/SKILL.md` | ✅ | ⬜ pending |
| 03-04-04 | 04 | 1 | PREP-04 | smoke | `grep -q "prep-" orbit-pm/.claude/skills/orbit-prep/SKILL.md` | ✅ | ⬜ pending |
| 03-05-01 | 05 | 1 | ARTF-01 | smoke | `grep -q "\.orbit/templates/" orbit-pm/.claude/skills/orbit-artifact/SKILL.md` | ✅ | ⬜ pending |
| 03-05-02 | 05 | 1 | ARTF-02 | smoke | `grep -q "theme specified" orbit-pm/.claude/skills/orbit-artifact/SKILL.md` | ✅ | ⬜ pending |
| 03-05-03 | 05 | 1 | ARTF-03 | smoke | `grep -q "\-v2" orbit-pm/.claude/skills/orbit-artifact/SKILL.md` | ✅ | ⬜ pending |
| 03-05-04 | 05 | 1 | ARTF-04 | smoke | `ls orbit-pm/templates/ | wc -l` (should be 5) | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `orbit-pm/.claude/skills/orbit-priorities/SKILL.md` — PRIO-04 gut-call asterisk override notation patch
- [ ] `orbit-pm/.claude/skills/orbit-decisions/SKILL.md` — DCSN-03 distinct `↺ Reversal Detected` callout section
- [ ] `orbit-pm/templates/rice-scorecard.md` — asterisk notation example in Scorecard table + footnote pattern

*All patches are to existing files — no new test infrastructure needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Brief Drifting section includes stalled decisions alongside overdue actions | BREF-01 | Conditional output depends on runtime data | Read SKILL.md Drifting section, verify it references both overdue actions AND stalled decisions |
| Engin challenge tone matches D-04 voice | PRIO-02 | Tone is subjective — grep can verify keywords but not voice quality | Read challenge section in orbit-priorities SKILL.md, verify pushback language matches CONTEXT.md D-04 example |

*All other behaviors have automated grep verification.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
