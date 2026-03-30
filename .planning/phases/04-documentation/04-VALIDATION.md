---
phase: 4
slug: documentation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual review (no automated test framework — phase produces markdown only) |
| **Config file** | none |
| **Quick run command** | `grep -c '```' README.md` (count fenced code blocks as proxy) |
| **Full suite command** | Human review against 3 success criteria below |
| **Estimated runtime** | ~30 seconds (manual scan) |

---

## Sampling Rate

- **After every task commit:** Run `grep -c '```' README.md` to verify code blocks present
- **After every plan wave:** Full human review of README sections
- **Before `/gsd:verify-work`:** All 3 success criteria verified
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | DOCS-01, DOCS-02, DOCS-03 | manual | `grep -E '## Install\|## Skills\|## Ask Engin' README.md` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework needed — phase produces a single markdown file.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Install instructions completeness | DOCS-01 | Content quality requires human judgment | Verify README has exactly 3 install steps (clone, bash install.sh, /orbit-init) plus separate Granola MCP section |
| Real usage examples for 8 skills | DOCS-02 | Example realism requires human review | Count fenced code blocks with `/orbit-*` commands — must find all 8 skills represented |
| Engin 7 capabilities table | DOCS-03 | Table completeness requires human count | Find Engin table, count rows (must be 7), verify "Ask about" and "Example query" columns populated |
| No spatial vocabulary in prose | BRND constraint | Semantic check — grep can false-positive | Scan prose (outside code blocks) for "signal", "constellation", "coordinate", "drifting", "mission", "payload" |
| No hedging language | D-10 | Tone check requires human judgment | Scan for "can help", "might", "could", "allows you to", "enables" in prose |

---

## Validation Sign-Off

- [ ] All tasks have manual verify instructions
- [ ] Sampling continuity: manual review after each wave
- [ ] Wave 0 covers all MISSING references — N/A (no test infra needed)
- [ ] No watch-mode flags — N/A
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
