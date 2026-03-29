---
name: orbit-priorities
description: >
  Prioritize features and initiatives using RICE scoring.
  Pulls real evidence from meeting notes for each dimension.
argument-hint: "[theme-name | 'all']"
---

Prioritize features and initiatives using RICE scoring, pulling real evidence from meeting notes for each dimension. Delegates analysis to Engin.

## Parse Arguments

- No argument or "all" → analyze all themes
- Theme name (e.g., "launch-readiness") → analyze only that theme

## Context Assembly

1. Read `.orbit/config.md` — user goals, stakeholder context, active quarter
2. Read `.orbit/index.md` — workspace overview, theme list
3. If theme specified: read notes in `.orbit/themes/<theme>/` and its action items
4. If "all" or no argument: read notes across all themes and `.orbit/action-items/pending.md`
5. Read `.orbit/decisions/log.md` — decision context for scoring Confidence

## RICE Analysis Flow

1. Identify candidate features/initiatives/decisions that need prioritization
   - Source from: action items marked high-priority, recurring topics in notes, open decisions, themes with heavy discussion

2. For each candidate, score RICE dimensions using meeting evidence:
   - **Reach (R)**: How many meetings/notes mention this? How many people discuss it? Score 1-10
   - **Impact (I)**: What stakeholder emphasis? Urgency signals? Blocker status? Score 1-10
   - **Confidence (C)**: Real data vs assumption? How many independent sources confirm it? Score 1-10
   - **Effort (E)**: Complexity signals from technical discussions? Dependencies mentioned? Score in "person-weeks" (higher effort = lower score)
   - **RICE Score**: (R × I × C) / E

3. Cite specific evidence for each dimension: meeting name and date

4. Generate ranked scorecard table

5. Write analysis challenging any contradictions between meeting evidence and PM assumptions

## Output Format

```markdown
# Mission Priority Scan — YYYY-MM-DD
## Constellation: [Theme Name] (or "All Constellations")

Running RICE analysis against N signals and N active missions...

| # | Initiative | R | I | C | E | Score | Evidence |
|---|-----------|---|---|---|---|-------|----------|
| 1 | [name] | 8 | 9 | 9 | 3 | 216 | [meeting, date]; [meeting, date] |
| 2 | [name] | 6 | 10 | 7 | 2 | 210 | [meeting, date] |
| 3 | [name] | 5 | 7 | 5 | 8 | 22 | [meeting, date] |

## Analysis

[Top priority explanation with evidence reasoning]
[Second priority explanation]
[Any risks or dependencies between items]

## Challenge

[Direct, opinionated statement challenging any PM assumptions contradicted by meeting evidence]
Examples:
- "You've discussed X in N meetings but pushed its timeline twice. Is this really a priority or should it be formally descoped?"
- "Security audit scores high-urgency but it's been assigned to one person with no backup. This is a single point of failure."
```

### Scoring rules:
- All scores based on actual meeting evidence — never invent or assume
- If insufficient data to score a dimension confidently, note it explicitly and use conservative estimate
- Evidence column: cite "Meeting title (date)" for each claim
- Challenge section: direct and opinionated, in Engin's voice — point out what the data says vs what the PM might be assuming

## Write Scorecard

Write the full scorecard to `.orbit/artifacts/rice-scorecard-YYYY-MM-DD.md`

If a scorecard exists for today, overwrite it (only one scorecard per day).

## Completion Message

After writing the scorecard, report:

```
Mission Priority Scan complete.

  Top priority: [initiative name] (RICE: [score])
  Risk:         [second item or risk identified]
  Deprioritized: [lowest scoring item if relevant]

  Full scorecard: .orbit/artifacts/rice-scorecard-YYYY-MM-DD.md
```

Then suggest next step:
- "Run /orbit-decisions to audit any stalled decisions affecting your top priorities."
- Or: "Run /orbit-artifact rice-scorecard to export this as a stakeholder document."

## Error Handling

- If `.orbit/` does not exist: "Run /orbit-init first to set up your workspace."
- If no notes exist: "No notes found. Run /orbit-ingest to bring in meeting notes before running priorities."
- If theme specified but not found: "Theme '[name]' not found. Run /orbit-status to see active themes."
- If insufficient data to score (fewer than 2 notes): note this in the output and proceed with available evidence.
