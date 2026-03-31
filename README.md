# Orbit

An open-source Claude Code plugin that makes Product Managers 100x productive.

No code to write. No infrastructure to deploy. No SaaS subscription. Just Claude Code skills and markdown.

Orbit imports your meeting notes from Granola, insights and issues from Jira, and conversations from Slack. It auto-organizes them into themes, tracks decisions, extracts action items, and puts two specialized AI agents at your disposal — all running inside Claude Code, in your own repo, with your data staying local.

---

## How It Works

Orbit runs two agents:

- **Astro** auto-organizes notes after every ingest. It assigns themes, extracts action items, logs decisions, and rebuilds the workspace index — no manual step required.
- **Engin** is your expert PM advisor. It synthesizes knowledge across all your meetings, challenges assumptions, and answers PM questions with cited sources.

The workflow is seamless: ingest a note, and Astro organizes it immediately via a post-write hook. Then ask Engin anything.

---

## Install

1. Clone this repository:
   ```bash
   git clone https://github.com/danielmedinac22/Orbit.git
   ```

2. From your project directory, run the installer:
   ```bash
   bash /path/to/orbit/install.sh
   ```
   The installer copies skills, agents, settings, CLAUDE.md, and templates into your project.

3. Initialize your workspace:
   ```
   /orbit-init
   ```

---

## Skills

### Get started

**`/orbit-init`** — Set up your Orbit workspace. Creates the `.orbit/` directory structure and your PM profile. Run this once when starting in a new project.

**`/orbit-ingest`** — Import notes into your workspace. Detects Granola, Jira, and Slack MCPs automatically and offers them as sources. Falls back to file import or paste when no MCPs are available.

### Daily workflow

**`/orbit-status`** — See a full overview of your workspace: notes captured, active themes, pending action items, decision log, and generated artifacts.

**`/orbit-brief`** — Get your morning briefing or weekly summary. Overdue action items appear first. Open questions and stalled decisions surface prominently.

### Deep analysis

**`/orbit-priorities`** — Score features and initiatives with RICE. Every score is backed by evidence pulled from your actual meeting notes — not gut feel.

**`/orbit-decisions`** — Audit all decisions across meetings. Surfaces contradictions, reversals, and decisions that stalled without follow-up action.

**`/orbit-prep`** — Prepare for any meeting. Gathers topic context, attendee-specific action items, recent decisions, and generates a talking-points list and agenda.

**`/orbit-artifact`** — Generate PM documents from templates: PRD, Decision Record, RICE Scorecard, Stakeholder Update, Weekly Summary. Context is drawn from your workspace automatically.

---

## Skills Reference

| Skill | What it does | Example |
|-------|-------------|---------|
| `/orbit-init` | Initialize the Orbit PM workspace. Creates `.orbit/` directory and user profile. | `/orbit-init` |
| `/orbit-ingest` | Import notes into the Orbit workspace. MCP-first: detects Granola, Jira, Slack and offers them as sources. Fallback to file or paste. | `/orbit-ingest --granola 7` |
| `/orbit-status` | Show Orbit workspace status — notes, themes, action items, decisions, artifacts. | `/orbit-status` |
| `/orbit-brief` | Generate morning brief or weekly summary. Synthesizes recent notes, action items, decisions, and open questions. | `/orbit-brief weekly` |
| `/orbit-priorities` | Prioritize features and initiatives using RICE scoring. Pulls real evidence from meeting notes for each dimension. | `/orbit-priorities launch-readiness` |
| `/orbit-decisions` | Audit decisions across meetings. Find contradictions, stalled decisions, reversals, and unresolved questions. | `/orbit-decisions stalled` |
| `/orbit-prep` | Prepare for an upcoming meeting. Gathers topic context, attendee action items, recent decisions, and generates talking points and suggested agenda. | `/orbit-prep "Q2 Planning" --attendees "Sarah, Mike"` |
| `/orbit-artifact` | Generate PM documents from templates using Orbit workspace context. Templates: prd, decision-record, weekly-summary, stakeholder-update, rice-scorecard. | `/orbit-artifact prd --theme api-redesign` |

### `/orbit-init`

```
/orbit-init

◉ Orbit station online.

  Workspace: .orbit/
  Config:    .orbit/config.md
  Blueprints: 5 templates loaded

  Detected: Granola MCP, Slack MCP

  Next: /orbit-ingest to capture your first signals.
```

### `/orbit-ingest`

```
/orbit-ingest --granola 7

Signal scan complete — 4 meetings captured from Granola (last 7 days).

  .orbit/notes/2026-03-28-standup.md
  .orbit/notes/2026-03-27-sprint-review.md
  .orbit/notes/2026-03-26-stakeholder-sync.md
  .orbit/notes/2026-03-24-api-planning.md

Astro is organizing... ✓ [API Redesign], [Launch Readiness], [Security] logged.

Next: /orbit-brief for today's mission briefing.
```

### `/orbit-status`

```
/orbit-status

◉ Orbit Station
─────────────────
Signals:        12 captured (4 this week)
Constellations:  3 active, 1 suggested
Missions:        8 active, 2 drifting
Coordinates:     6 locked, 1 conflicting
Payloads:        3 delivered
Last briefing:  2026-03-28

Constellations:
  ★ API Redesign      — 5 signals, 3 active missions
  ★ Launch Readiness  — 4 signals, 4 active missions
  ★ Security          — 3 signals, 1 active mission

Next: 2 missions drifting. Run /orbit-brief to review.
```

### `/orbit-brief`

```
/orbit-brief weekly

Weekly brief complete.

  Period: 2026-03-24 — 2026-03-28
  Themes covered: 3
  Decisions made: 4
  Action items: 6 completed, 3 overdue, 2 new

  Saved: .orbit/briefs/week-2026-03-28.md
```

### `/orbit-priorities`

```
/orbit-priorities launch-readiness

Mission Priority Scan complete.

  Top priority: API v2 Migration (RICE: 216)
  Risk:         Security Audit — single point of failure
  Deprioritized: Mobile redesign (RICE: 22)

  Full scorecard: .orbit/artifacts/rice-scorecard-2026-03-28.md
```

### `/orbit-decisions`

```
/orbit-decisions stalled

Coordinate Audit complete.

  ⚠️ 1 conflict found — REST vs GraphQL (contradicts 2026-03-14 decision)
  ↺ 0 reversals detected
  ⏸ 2 uncharted — security vendor, mobile Q2 target
  ✓ 3 stable coordinates

  Recommend: schedule a 15-min call to lock the 2 uncharted coordinates.
```

### `/orbit-prep`

```
/orbit-prep "Q2 Planning" --attendees "Sarah, Mike"

Pre-Launch Check ready for Q2 Planning.

  Crew: 2 attendees briefed
  Agenda: 4 items
  Coordinates to lock: 2 decisions needed
```

### `/orbit-artifact`

```
/orbit-artifact prd --theme api-redesign

Payload delivered: PRD — API v2 Migration

  .orbit/artifacts/prd.md
  Sources: 8 signals, 6 missions, 4 coordinates

  Review and refine. Run /orbit-artifact prd --theme api-redesign
  again to generate v2 with updates.
```

---

## Ask Engin

Engin is your expert PM advisor inside Orbit. It cites sources, challenges your assumptions, and gives opinionated answers — not just summaries. Ask it anything about your meetings, backlog, or decisions.

| Capability | Ask about | Example query |
|------------|-----------|---------------|
| Strategic Synthesis | What to focus on | "What should I focus on this week?" |
| Customer Insight Analysis | Customer feedback patterns | "What are customers saying about the API?" |
| RICE Prioritization | Feature prioritization | "Help me prioritize the Q2 backlog" |
| Decision Tracking | Stalled or conflicting decisions | "What decisions are stalling on the launch?" |
| Meeting Preparation | Upcoming meeting context | "Prepare for my sprint planning with Sarah and Mike" |
| Morning/Weekly Brief | Daily or weekly summary | "Give me a weekly brief" |
| Contradiction & Risk Detection | Hidden risks and conflicts | "Are there any risks I'm missing?" |

---

## Granola MCP Setup (optional)

Granola is a macOS meeting notes app that records and transcribes meetings. The Granola MCP server connects it to Claude Code, giving `/orbit-ingest` direct access to your meeting transcripts.

Once the MCP is configured in Claude Code's MCP settings, `/orbit-ingest` detects Granola automatically — no additional Orbit configuration needed.

For setup instructions, see the [official Granola MCP documentation](https://www.granola.ai).

---

## Language

Orbit responds in your language. Write in Spanish, get answers in Spanish.

---

## License

MIT
