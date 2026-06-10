---
name: content-module-expansion
description: Workflow command scaffold for content-module-expansion in agent-engineering-hub.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /content-module-expansion

Use this workflow when working on **content-module-expansion** in `agent-engineering-hub`.

## Goal

Adds new documentation modules or subpages, updates sidebars for navigation, and ensures content completeness and navigation consistency.

## Common Files

- `docs/guide/*/*.md`
- `docs/.vitepress/config.ts`
- `docs/en/guide/*/*.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create new .md files for each subpage under docs/guide/<module>/
- Update docs/.vitepress/config.ts to reflect new sidebar structure and navigation
- If applicable, create or update English versions under docs/en/guide/<module>/
- Run tests to validate links, routes, and frontmatter
- Build docs to ensure no warnings or errors

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.