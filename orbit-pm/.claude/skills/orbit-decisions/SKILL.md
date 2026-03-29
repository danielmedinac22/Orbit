---
name: orbit-decisions
description: >
  Audit decisions across meetings. Find contradictions, stalled decisions,
  reversals, and unresolved questions. Reviews .orbit/decisions/log.md.
argument-hint: "[review | stalled | contradictions]"
---

Audit decisions across meetings to find contradictions, stalled decisions, reversals, and unresolved questions. Delegates analysis to Engin.

## Parse Arguments

- No argument or "review" → full decision review with all issues surfaced
- "stalled" → focus on decisions confirmed but without follow-up action items within 7 days
- "contradictions" → focus on conflicting decisions on the same topic across different meetings

## Context Assembly

1. Read `.orbit/decisions/log.md` — the full decision trail
2. Read relevant notes in `.orbit/notes/` for context behind each decision
3. Read `.orbit/action-items/pending.md` — to cross-reference decision follow-through
4. Read `.orbit/config.md` — stakeholder context for understanding decision ownership

## Analysis by Mode

### "review" (default)

Full decision audit:
- List all decisions with current status (confirmed, stalled, reversed, open)
- Highlight any contradictions, stalls, or reversals found
- Show the full picture before diving into specifics

### "stalled"

Identify decisions confirmed but no follow-up action items created within 7 days:
- A decision is "stalled" when: it appears in `decisions/log.md` as "confirmed" but no corresponding action items exist in any theme's action-items.md
- Check the gap between decision date and today
- Note the meeting where it was decided and who was present

### "contradictions"

Identify conflicting decisions on the same topic:
- Two decisions on the same topic that cannot both be true
- Reversals: a later meeting overturned an earlier decision without explicit acknowledgment
- Scope creep: a decision was made that implicitly conflicts with timeline or resource decisions elsewhere

## Output Format

```markdown
# Coordinate Audit — YYYY-MM-DD

## ⚠️ Coordinate Conflicts
**[Conflict title]**
- [Date, Meeting]: "[decision text]"
- [Later date, Meeting]: "[conflicting decision text]"
→ [Why these conflict — what needs resolution]

## ⏸ Uncharted Coordinates
**[Decision topic]** — [issue raised date], [meeting]. No owner. No action items.
**[Decision topic]** — confirmed [date] but no follow-up action items after [N] days.

## ✓ Stable Coordinates
✓ [Decision] — confirmed [date], action items assigned. ([meeting])
✓ [Decision] — confirmed [date], closed. ([meeting])
```

### Section rules:
- **"⚠️ Coordinate Conflicts"**: explicit contradictions and unacknowledged reversals, cite both conflicting sources
- **"⏸ Uncharted Coordinates"**: stalled decisions — confirmed but no action items followed within 7 days, OR questions raised 3+ times without resolution
- **"✓ Stable Coordinates"**: healthy decisions — confirmed, action items created, no conflict
- If a section has no entries, omit it
- Every entry cites source meeting and date

## Resolution Suggestion

If issues are found, append after the audit:

```
Recommend: schedule a 15-min call to lock the N uncharted coordinates.
Key items to resolve: [list top 2-3 specific items needing a decision call]
```

## Completion Message

After displaying the audit:

```
Coordinate Audit complete.

  ⚠️ N conflict found — [brief description]
  ⏸ N uncharted — [brief description]
  ✓ N stable coordinates

  Recommend: schedule a 15-min call to lock the N uncharted coordinates.
```

Suggest next step:
- If contradictions or stalled items found: "Run /orbit-prep [meeting-topic] to prepare for a decision call."
- If clean audit: "Run /orbit-brief for today's mission briefing."

## Error Handling

- If `.orbit/` does not exist: "Run /orbit-init first to set up your workspace."
- If `decisions/log.md` doesn't exist or is empty: "No decisions tracked yet. Run /orbit-ingest to bring in meeting notes — decisions are logged automatically during ingestion."
- If no issues found in "stalled" or "contradictions" mode: "No [stalled decisions | contradictions] found. Your coordinates are clean."
