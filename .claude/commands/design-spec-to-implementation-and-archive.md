---
name: design-spec-to-implementation-and-archive
description: Workflow command scaffold for design-spec-to-implementation-and-archive in agent-engineering-hub.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /design-spec-to-implementation-and-archive

Use this workflow when working on **design-spec-to-implementation-and-archive** in `agent-engineering-hub`.

## Goal

Introduces a new design or refactor via spec/proposal/tasks, implements the change, then archives the spec after completion.

## Common Files

- `openspec/changes/*/design.md`
- `openspec/changes/*/proposal.md`
- `openspec/changes/*/tasks.md`
- `openspec/changes/*/specs/*/spec.md`
- `openspec/changes/archive/*`
- `openspec/specs/*`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Draft spec, proposal, and tasks under openspec/changes/<change-name>/
- Implement changes in code or theme files (e.g., CSS refactor, color/typography/spacing/motion tokens, homepage redesign)
- Validate changes via tests and build
- Archive completed spec/proposal/tasks to openspec/changes/archive/
- Update openspec/specs/ as needed

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.