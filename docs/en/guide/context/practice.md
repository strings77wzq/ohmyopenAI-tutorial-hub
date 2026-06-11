# Practical Case Study: Fixing Broken Links on the Docs Site

## Task Overview

The task is "fix all internal links returning 404 on the Agent Engineering Hub docs site." We'll design a complete context package for this task, showing how the five-layer model, injection strategy, and compression plan work together.

## Task Analysis

Before writing the context package, let's analyze the task characteristics:

| Dimension | Analysis |
|-----------|----------|
| Task type | Fix-type (bug fix, not new feature) |
| Scope | May touch multiple .md files under docs/ |
| Acceptance criteria | Quantifiable (link-checker output shows 0 errors) |
| Recoverability | High (git revert can undo any change) |
| External knowledge needed | Low (fixing links doesn't require API docs) |
| Project knowledge needed | Medium (need to understand VitePress link conventions and project structure) |

## Complete Context Package Design

```
═══════════════════════════════════════════════════════════
[L1] GOAL — Immutable
═══════════════════════════════════════════════════════════

Task: Fix all internal links in docs/ returning HTTP 404
Acceptance criteria:
  [ ] npm run docs:check-links outputs "0 errors" or equivalent pass flag
  [ ] No page URL structure changed (existing routes defined in docs/.vitepress/config.ts)
  [ ] No pages deleted
  [ ] Non-link content text not modified
Constraints:
  - Scope: docs/ directory only
  - Off-limits: openspec/, scripts/, .github/
  - If a link points to a page that genuinely doesn't exist and shouldn't exist → ask the user, don't decide to delete on your own

═══════════════════════════════════════════════════════════
[L2] PROJECT KNOWLEDGE — Cached
═══════════════════════════════════════════════════════════

Project: Agent Engineering Hub (ai-tutorial-hub)
Framework: VitePress 1.6.4, base="/agent-engineering-hub/"
Link conventions:
  - Internal pages: /guide/skills/what-is-skill (no .md suffix)
  - Home page: / or /index
  - English pages: /en/guide/...
  - External links: Full https:// URL
Common causes of broken links:
  1. Misspelled paths (60%+)
  2. Pages moved but references not updated
  3. Leftover .md suffixes (earlier pages referenced as xxx.md)
File structure summary:
  docs/guide/{skills,mcp,openspec,harness,context,loop-engineering,...}/
  docs/en/guide/{skills,mcp,openspec,harness,...}/
  Sidebar routes: docs/.vitepress/config.ts → guideSidebar / enGuideSidebar

═══════════════════════════════════════════════════════════
[L3] WORKING STATE — Initial (updated after each iteration)
═══════════════════════════════════════════════════════════

Current phase: Diagnosis
Approaches tried: (none)
Current hypothesis: (to be established after link-checker output)
Steps completed: (none)

═══════════════════════════════════════════════════════════
[L4] EXTERNAL KNOWLEDGE — On demand
═══════════════════════════════════════════════════════════

(No pre-loading needed. VitePress link format is already covered in L2.)

═══════════════════════════════════════════════════════════
[L5] OPERATIONAL EVIDENCE — Triggered
═══════════════════════════════════════════════════════════

Pending: npm run docs:check-links output (Agent runs proactively in first step)
```

## Agent Execution Walkthrough

### Iteration 1 — Diagnosis

```
Agent runs: npm run docs:check-links
→ [L5 injection] links (102 source files): 7 errors

Error summary:
  1. /guide/skills/best-practice → 404 (should be best-practices)
  2. /guide/mcp/concept → 404 (should be concepts)
  3. /guide/openspec/spec → 404 (page doesn't exist)
  4. /en/guide/harness/introduction → 404 (should be intro)
  5. /guide/omo/arch → 404 (should be architecture)
  6. /guide/context/layer → 404 (page doesn't exist)
  7. /guide/loop → 404 (should be /guide/loop-engineering/)

[L3 update]
Current phase: Fixing
Current hypothesis: #1, #2, #4, #5, #7 are typos (5); #3, #6 are missing pages (2)
Approaches tried: None
```

### Iteration 2 — Batch-fix typos

```
Agent: Uses sed to batch-replace 5 misspelled links
  s|/guide/skills/best-practice|/guide/skills/best-practices|g
  s|/guide/mcp/concept|/guide/mcp/concepts|g
  s|/en/guide/harness/introduction|/en/guide/harness/intro|g
  s|/guide/omo/arch|/guide/omo/architecture|g
  s|/guide/loop|/guide/loop-engineering/|g

→ npm run docs:check-links
→ [L5 injection] links (102 source files): 2 errors

Error summary:
  3. /guide/openspec/spec → 404 (page doesn't exist)
  6. /guide/context/layer → 404 (page doesn't exist)

[L3 update]
Current phase: Needs decision
Completed steps: Batch-fixed 5 typos
Approaches tried: sed batch replacement → effective (5/7 fixed)
Remaining issues: 2 links point to non-existent pages
```

### Iteration 3 — Decision

```
Agent analysis:
  /guide/openspec/spec → openspec/ has concepts.md, commands.md, workflow.md...
                          but no spec.md. Closest semantic match: writing-specs.md
  /guide/context/layer → context/ is a single-page module (only index.md).
                           No separate layer.md. Closest semantic match: the
                           "Context Layering" section in index.md

Agent pauses and asks the user:
  "2 broken links point to non-existent pages. My recommendations:
   1. /guide/openspec/spec → change to /guide/openspec/writing-specs
   2. /guide/context/layer → change to /guide/context/ (point to context engineering home)
   Do you agree? Or would you prefer to create new pages for these links?"
```

This pause is exactly the "human feedback" channel trigger from multi-source feedback: the Agent has reached a decision boundary where it cannot judge on its own "which existing page should a non-existent link map to."

### Iteration 4 — Completed after user confirmation

```
User: "Approach 1 and 2 both look good"

Agent applies changes → npm run docs:check-links
→ [L5 injection] links (102 source files): 0 errors → PASS

L1 acceptance criteria check:
  [✓] link-checker output shows 0 errors
  [✓] URL structure unchanged
  [✓] No pages deleted
  [✓] Non-link content not modified

→ Task complete
```

## What This Case Study Demonstrates

1. **L5 triggered injection**: The Agent proactively ran link-checker, and the output flowed into the operational evidence layer automatically.
2. **L3 rolling updates**: The working state layer updated current hypothesis and progress after each iteration.
3. **L1 immutability**: The Agent never modified the acceptance criteria.
4. **Human feedback boundary**: The Agent paused to ask the user when it couldn't judge the mapping relationship, rather than making an arbitrary decision.
5. **Compression not triggered**: This task had low token consumption and didn't need compression.

## Exercise

Using the same framework, design a context package and simulate the execution for a task to "add 3 sub-pages to the Context Engineering module":

1. Write the complete five-layer context package.
2. Simulate at least 3 iterations, noting changes to L3 and L5 after each.
3. Under what circumstances would the Agent pause and ask the user?
4. If this task were interrupted (user closed the terminal), what should L3 contain when resuming?

## Next Steps

Return to the [Context Engineering Overview](./) to pick the next module, or read [Injection Strategy](./injection-strategy) for more technical details.
