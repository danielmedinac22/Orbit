# Phase 4: Documentation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-30
**Phase:** 04-documentation
**Areas discussed:** README structure & flow, Usage examples style, Engin capabilities showcase, Tone & identity

---

## README Structure & Flow

### Hero Section

| Option | Description | Selected |
|--------|-------------|----------|
| Problem-first hook | Lead with PM pain point, then what Orbit is | |
| Product-first pitch | Lead with what Orbit IS and does, confidence-forward | ✓ |
| Demo-first wow | Lead with terminal screenshot/gif | |

**User's choice:** Product-first pitch
**Notes:** User noted that source types should be accurate — "meeting notes" don't come from Jira. Should say "meeting notes, insights, and conversations from Granola, Jira, and Slack."

### Install Instructions

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal steps | Clone + one command + init, Granola as optional section | ✓ |
| Guided walkthrough | Step-by-step with explanations at each stage | |

**User's choice:** Minimal steps
**Notes:** User noted the audience is already using Claude Code — speak to them naturally, reference Claude Code directly in install instructions.

### Skill Reference Depth

| Option | Description | Selected |
|--------|-------------|----------|
| One-liner per skill + example | Compact table/list, scannable | ✓ |
| Grouped by workflow | Skills organized by PM moment, more narrative | |
| Expanded cards per skill | Full subsection per skill, comprehensive | |

**User's choice:** One-liner per skill + example, BUT placed after a workflow grouping section
**Notes:** User wants both — first the workflow grouping ("Get started", "Daily workflow", "Deep analysis") showing how skills chain, then the compact reference table.

---

## Usage Examples Style

### Presentation Format

| Option | Description | Selected |
|--------|-------------|----------|
| Markdown code blocks | Fenced code blocks with command + output snippet | ✓ |
| Real terminal screenshots | Actual screenshots of Claude Code | |
| Input + output pairs | Conversation-style flow | |

**User's choice:** Markdown code blocks
**Notes:** None

### Example Data

| Option | Description | Selected |
|--------|-------------|----------|
| Realistic scenarios | Believable PM scenarios — sprint reviews, stakeholder calls | ✓ |
| Generic placeholders | <topic>, <meeting name> style | |

**User's choice:** Realistic scenarios
**Notes:** None

---

## Engin Capabilities Showcase

### Presentation Format

| Option | Description | Selected |
|--------|-------------|----------|
| Capability list + example query each | Table with one row per capability | ✓ |
| Grouped by PM moment | Organized by when you'd use Engin | |
| Full sections per capability | Heading + description + example per capability | |

**User's choice:** Capability list + example query each
**Notes:** None

### Personality Explanation

| Option | Description | Selected |
|--------|-------------|----------|
| Brief mention | One line about citing sources and challenging assumptions | ✓ |
| Show don't tell | Include example response demonstrating voice | |
| Skip personality | Just list capabilities | |

**User's choice:** Brief mention
**Notes:** None

---

## Tone & Identity

### Voice

| Option | Description | Selected |
|--------|-------------|----------|
| Product-confident | Direct statements, no hedging, Daniel's product energy | ✓ |
| Developer-neutral | Standard open-source README tone | |
| Builder-personal | Daniel's personal founder voice | |

**User's choice:** Product-confident
**Notes:** None

### Language

| Option | Description | Selected |
|--------|-------------|----------|
| English only | Full English, mention runtime auto-detection | ✓ |
| Bilingual tagline | English + one Spanish quote | |
| Full bilingual README | Side-by-side EN/ES | |

**User's choice:** English only
**Notes:** None

### Scope Statement

| Option | Description | Selected |
|--------|-------------|----------|
| Brief one-liner | "No code. No infra. No SaaS." | ✓ |
| Dedicated section | Explicit "What Orbit is NOT" | |
| Skip it | Let description speak for itself | |

**User's choice:** Brief one-liner
**Notes:** None

---

## Claude's Discretion

- Exact section ordering within README (workflow grouping before reference table)
- Granola MCP setup detail level
- Lines of example output per skill
- Scope one-liner exact phrasing

## Deferred Ideas

None — discussion stayed within phase scope
