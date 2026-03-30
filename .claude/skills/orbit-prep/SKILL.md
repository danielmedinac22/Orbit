---
name: orbit-prep
description: >
  Prepare for an upcoming meeting. Gathers topic context, attendee action items,
  recent decisions, and generates talking points and suggested agenda.
argument-hint: "<meeting-topic> [--attendees 'name1, name2']"
---

Prepare for an upcoming meeting by gathering topic context, attendee action items, recent decisions, and generating talking points and a suggested agenda. Delegates research to Engin.

## Parse Arguments

- Meeting topic is required (first argument, may be quoted)
- `--attendees 'name1, name2'` is optional

Examples:
- `/orbit-prep "Stakeholder Review"` → prep for stakeholder review with known context
- `/orbit-prep "Sprint Planning" --attendees "Sarah, Mike"` → prep with attendee-specific context

If no meeting topic is provided, ask: "What meeting are you preparing for?"

## Context Assembly

1. Read `.orbit/config.md` — stakeholder list, user role, current quarter goals
2. Read `.orbit/index.md` — workspace overview
3. Read `.orbit/decisions/log.md` — recent decisions relevant to the meeting topic
4. Read `.orbit/action-items/pending.md` — pending items across all themes

## Topic Research

1. Identify relevant themes for the meeting topic:
   - Match topic keywords against theme directory names in `.orbit/themes/`
   - Read notes and action items for each matching theme

2. Gather cross-theme context:
   - Recent decisions related to the topic (last 30 days)
   - Open questions connected to the topic
   - Overdue action items in relevant themes

## Attendee Research

For each named attendee (from `--attendees` or from `.orbit/config.md` stakeholders):

1. Search note frontmatter `participants:` fields for their name
2. Gather:
   - Their recent action items (status: pending, overdue?)
   - What they said or raised in recent meetings (last 14 days)
   - Open questions they raised but haven't been answered
   - Their stance on key decisions related to the meeting topic
3. Infer likely questions or concerns based on their recent activity

If no attendees specified and none found in config, generate prep without attendee-specific section.

## Output Format

```markdown
# Pre-Launch Check — [Meeting Topic]

## Crew
### [Attendee Name] ([Role if known])
- Last seen in: [Meeting name] ([date]), [Meeting name] ([date])
- Their open items: [list or "None assigned"]
- Likely questions: [what they'll probably ask based on meeting history]
- Recent stance: [their position on key topics]

### [Attendee Name] ([Role if known])
...

## Suggested Agenda
1. [Topic] — [why this matters, estimated time]
2. [Topic] — [why this matters, estimated time]
3. [Topic] — [decision needed or update to share]

## Talking Points
- [Lead with good news / progress]
- [Flag the risk that needs acknowledgment]
- [Proposed resolution or owner for open item]

## Coordinates to Lock
- [ ] [Decision that must be made in this meeting] — [why now, who decides]
- [ ] [Decision] — [context]

---
*Prep from N notes across N themes*
```

### Section rules:
- **"Crew"**: one section per attendee with their context; omit if no attendees identified
- **"Suggested Agenda"**: ordered by priority — urgent/time-sensitive first, FYIs last
- **"Talking Points"**: actionable framing, not just facts — what to say and how
- **"Coordinates to Lock"**: decisions that should be resolved IN this meeting (not "discussed" — resolved)
- Cite source notes and dates for all factual claims

## Save Prep

After generating the prep brief, ask the user:

"Save this prep to `.orbit/briefs/prep-YYYY-MM-DD-[topic-slug].md`? [y/N]"

If user confirms: write the full prep to that path.

## Completion Message

After generating (and optionally saving):

```
Pre-Launch Check ready for [Meeting Topic].

  Crew: N attendees briefed
  Agenda: N items
  Coordinates to lock: N decisions needed

  [If saved:] Saved to .orbit/briefs/prep-YYYY-MM-DD-[topic].md
```

Suggest next step:
- If decisions are needed in the meeting: "Run /orbit-decisions to review the full decision log before the call."
- Default: "Run /orbit-artifact decision-record after the meeting to capture what you decided."

## Error Handling

- If `.orbit/` does not exist: "Run /orbit-init first to set up your workspace."
- If no notes exist: "No notes found. Run /orbit-ingest to bring in meeting context before prepping."
- If attendee not found in any notes: note in their Crew section "No prior meetings found for [name] in your workspace."
- If topic matches no themes: generate prep from general workspace context and note "No themes match '[topic]' — showing general workspace context."
