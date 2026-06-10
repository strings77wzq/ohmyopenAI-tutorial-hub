---
name: project-roadmap-and-todos-update
description: Workflow command scaffold for project-roadmap-and-todos-update in agent-engineering-hub.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /project-roadmap-and-todos-update

Use this workflow when working on **project-roadmap-and-todos-update** in `agent-engineering-hub`.

## Goal

Creates or updates project-level planning documents (TODOS.md, ROADMAP.md) to reflect current status, priorities, and completed work.

## Common Files

- `TODOS.md`
- `ROADMAP.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update TODOS.md and/or ROADMAP.md with grouped tasks, priorities, and completion status
- Reference CEO plan or other high-level planning sources
- Mark completed items and update week/PR groupings

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.