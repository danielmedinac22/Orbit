---
name: orbit-help
description: Show all Orbit commands grouped by workflow stage, with quick-start guide for new users.
---

You are showing the user a help guide for Orbit. Display the following exactly as written, then add contextual guidance based on workspace state.

---

## Step 1 — Display Help

Print this:

```
◉ Orbit — Context Copilot for Product Managers

  Start
    /orbit-init          Set up your workspace and PM profile
    /orbit-help          Show this guide

  Capture
    /orbit-ingest        Import notes from Granola, Jira, Slack, file, or paste

  Review
    /orbit-status        Workspace overview — notes, themes, action items, decisions
    /orbit-brief         Morning briefing or weekly summary

  Analyze
    /orbit-priorities    RICE scoring backed by evidence from your notes
    /orbit-decisions     Audit decisions — contradictions, stalls, reversals
    /orbit-prep          Prepare for a meeting with context and talking points
    /orbit-theme         Deep-dive into a theme — close items, resolve decisions

  Generate
    /orbit-artifact      PM documents — PRD, decision record, stakeholder update

  Maintenance
    /orbit-update        Check for and apply Orbit updates

  Ask
    Just ask Engin anything about your meetings, backlog, or decisions.
    Example: "What should I focus on this week?"

  ─────────────────

  First session?
    1. /orbit-init       → Create your workspace
    2. /orbit-ingest     → Import your first notes
    3. /orbit-status     → See what Orbit found
    4. /orbit-brief      → Get your first briefing
```

---

## Step 2 — Contextual Suggestion

After displaying the help, check the workspace state and add ONE suggestion:

- If `.orbit/` directory does not exist → "You haven't set up yet. Run `/orbit-init` to get started."
- If `.orbit/` exists but `.orbit/notes/` is empty or has no `.md` files → "Your workspace is ready but has no notes yet. Run `/orbit-ingest` to capture your first signals."
- If `.orbit/notes/` has notes → "You have notes captured. Try `/orbit-status` for an overview or `/orbit-brief` for today's briefing."

Use the Glob tool to check for `.orbit/notes/*.md` files. Do not read file contents — just check existence.
