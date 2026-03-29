---
phase: 2
slug: ingestion-agents
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-29
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual validation only — no automated test runner (markdown-only project) |
| **Config file** | None |
| **Quick run command** | Shell: `grep -q` spot-checks on agent/skill files |
| **Full suite command** | Manual: full `/orbit-ingest` flow in a Claude Code session |
| **Estimated runtime** | ~30 seconds (shell checks), ~3 minutes (manual flow) |

---

## Sampling Rate

- **After every task commit:** Run shell spot-checks (`grep -q` on modified files)
- **After every plan wave:** Full install + ingest smoke test in Claude Code session
- **Before `/gsd:verify-work`:** Full ingest → organize → status flow verified
- **Max feedback latency:** 30 seconds (shell checks)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | ASTR-08 | shell | `grep -q "Delegate to" orbit-pm/.claude/settings.json` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | BRND-01 | shell | `grep -q "Signal scan complete" orbit-pm/.claude/agents/astro.md` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | ASTR-01 | shell | `grep -q "model: sonnet" orbit-pm/.claude/agents/astro.md && grep -q "memory: project" orbit-pm/.claude/agents/astro.md` | ✅ | ⬜ pending |
| 02-01-04 | 01 | 1 | ENGN-01 | shell | `grep -q "model: inherit" orbit-pm/.claude/agents/engin.md && grep -q "WebSearch" orbit-pm/.claude/agents/engin.md` | ✅ | ⬜ pending |
| 02-01-05 | 01 | 1 | INGS-01–07 | shell | `grep -q "Granola" orbit-pm/.claude/skills/orbit-ingest/SKILL.md && grep -q "Jira" orbit-pm/.claude/skills/orbit-ingest/SKILL.md` | ✅ | ⬜ pending |
| 02-01-06 | 01 | 1 | BRND-03 | shell | `grep -q "◉" orbit-pm/.claude/skills/orbit-status/SKILL.md` | ✅ | ⬜ pending |
| 02-01-07 | 01 | 1 | BRND-04 | shell | `grep -q "Next:" orbit-pm/.claude/skills/orbit-ingest/SKILL.md` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 2 | ALL | manual-claude | Full ingest → organize → status smoke test | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `orbit-pm/.claude/settings.json` hook upgrade — covers ASTR-08
- [ ] `orbit-pm/.claude/agents/astro.md` branding patch — covers BRND-01
- [ ] (No new files to create — all gaps are modifications to existing Phase 1 files)

*Wave 0 is embedded in Plan 01 tasks, not a separate wave.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `/orbit-ingest` guided flow | INGS-01–06 | Requires live Claude Code session with MCP detection | Run `/orbit-ingest` in Claude Code; verify source options appear and note is written |
| Astro auto-delegation | ASTR-08 | Hook stdout → Claude delegation cannot be unit tested | Write a note; observe if Astro runs automatically |
| Astro theme assignment | ASTR-02–07 | Requires Astro agent execution | After ingest, check `.orbit/themes/`, `.orbit/decisions/log.md`, `.orbit/index.md` |
| Engin cited answers | ENGN-02–04 | Requires Engin agent execution | Ask Engin a PM question; verify citation format and memory persistence |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
