---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Shell smoke tests (bash) |
| **Config file** | none — no test framework needed for markdown/skill files |
| **Quick run command** | `bash -c 'test -f orbit-pm/.claude/skills/orbit-init/SKILL.md && echo PASS'` |
| **Full suite command** | `bash orbit-pm/tests/smoke-test.sh` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Check file exists + has expected content via grep
- **After every plan wave:** Run full smoke test script
- **Before `/gsd:verify-work`:** Full smoke test must pass
- **Max feedback latency:** 2 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | FOUND-01 | file check | `grep -q 'Orbit' orbit-pm/CLAUDE.md` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | FOUND-02 | file check | `test -f orbit-pm/install.sh && test -x orbit-pm/install.sh` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | FOUND-03 | content check | `grep -q 'orbit-init' orbit-pm/.claude/skills/orbit-init/SKILL.md` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | FOUND-04 | content check | `grep -q 'config.md' orbit-pm/.claude/skills/orbit-init/SKILL.md` | ❌ W0 | ⬜ pending |
| 01-02-03 | 02 | 1 | FOUND-05 | content check | `grep -q 'MCP\|Granola\|Atlassian\|Slack' orbit-pm/.claude/skills/orbit-init/SKILL.md` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 1 | FOUND-06 | content check | `grep -q 'orbit-status' orbit-pm/.claude/skills/orbit-status/SKILL.md` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `orbit-pm/` directory exists as repo root
- [ ] `.claude/skills/` directory structure created
- [ ] `.claude/agents/` directory structure created

*No test framework to install — all validations are file/content checks.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `/orbit-init` interactive flow | FOUND-04 | Requires Claude Code runtime + user interaction | Run `/orbit-init` in Claude Code, verify it asks for user context and creates .orbit/ |
| MCP detection reports available servers | FOUND-05 | Requires Claude Code runtime with MCPs connected | Run `/orbit-init` with Granola MCP installed, verify it reports detection |
| `/orbit-status` formatted output | FOUND-06 | Output formatting requires Claude Code runtime | Run `/orbit-status` after init, verify spatial formatting and next-step suggestions |

---

## Validation Sign-Off

- [ ] All tasks have file/content check verification
- [ ] Sampling continuity: every task produces a checkable file
- [ ] Wave 0 covers all directory structure prerequisites
- [ ] No watch-mode flags
- [ ] Feedback latency < 2s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
