# Context Layering Model

## Concept

The first principle of context engineering: **it's not about "cramming all information into the window," but "putting the right information into the right layer at the right time."**

The five-layer context model divides an Agent's context window into five layers by priority and source, each with different injection strategies and refresh cadences.

## Why Do We Need Layering?

Unlayered context becomes "information soup" — the Agent can't distinguish goals from references from historical noise. Layering solves three core problems:

1. **Priority confusion**: The Agent doesn't know whether to read the task description first or the project architecture.
2. **Stale information**: Error logs from the last iteration are still in the window, but the Agent thinks they're current.
3. **Token waste**: Every iteration re-injects all information, even though most of it hasn't changed.

## The Five-Layer Model in Detail

```
┌─────────────────────────────────────────────────────────┐
│ L1 Goal Layer                                            │
│ User task, acceptance criteria, constraints              │
│ Writer: User / OpenSpec                                  │
│ Refresh: Immutable for the duration of the task          │
│ Priority: Highest — all decisions must align with this   │
├─────────────────────────────────────────────────────────┤
│ L2 Project Knowledge Layer                               │
│ Architecture docs, coding conventions, tech stack,       │
│ dependencies, project memory                             │
│ Writer: Developer / README / AGENTS.md / project memory  │
│ Refresh: On-demand; cache unchanged parts                │
│ Priority: High — all implementations must match project  │
│           conventions                                    │
├─────────────────────────────────────────────────────────┤
│ L3 Working State Layer                                   │
│ Current assumptions, completed steps, failed outputs,    │
│ list of approaches tried                                 │
│ Writer: Agent itself / notepad / trace                   │
│ Refresh: Updated after each iteration                    │
│ Priority: Medium — guides next decisions but never       │
│           overrides the goal                             │
├─────────────────────────────────────────────────────────┤
│ L4 External Knowledge Layer                              │
│ API docs, search results, library source, best-practice  │
│ references                                               │
│ Writer: MCP Resource / retrieval system                  │
│ Refresh: Queried on demand; results cached until task    │
│          ends                                            │
│ Priority: Medium — supplements implementation when L2    │
│           doesn't cover it                               │
├─────────────────────────────────────────────────────────┤
│ L5 Operational Evidence Layer                            │
│ Test results, build logs, screenshots, Lighthouse reports│
│ Writer: Harness / toolchain                              │
│ Refresh: Updated after each tool call                    │
│ Priority: Low — verification info, should not drive      │
│           decisions                                      │
└─────────────────────────────────────────────────────────┘
```

## Priority Rules Between Layers

When two layers conflict:

```
L1 > L2 > L3 > L4 > L5
```

Example: L5 (test failure) says "the code has a bug," but L1 (goal) says "must ship today" → The Agent should not postpone the release on its own; it should report the conflict and ask the user.

Another example: L4 (search results) gives advice that contradicts L2 (project conventions) → The Agent should follow project conventions first.

## Layer Design Principles

### Goal Layer: Non-negotiable

Any modification to the goal layer must be confirmed by the user. The Agent must not silently relax acceptance criteria because "it's easier to implement this way."

### Project Knowledge Layer: Summaries First

Don't inject every project file into the window. For read-only references:
- Inject a structural summary first (directory tree, module index)
- The Agent reads specific files with tools when needed
- Cache summaries of frequently accessed files into the working state layer

### Working State Layer: Keep Only the Latest

After each iteration:
- Update "completed steps"
- Update "current assumptions" (if validated or disproven)
- Remove resolved failure outputs
- Append new "approaches tried"

### Operational Evidence Layer: Conclusions Only

Don't inject full test output or build logs. Only inject:
- Pass/fail summary
- Specific line numbers and error messages for failures
- Comparison with the previous run

## Example: Context Package for Fixing Docs Site 404s

```
[L1 Goal Layer] — Immutable
- Task: Fix all internal links returning 404 in docs/
- Acceptance criteria: link-checker output shows 0 errors
- Constraints: Do not change URL structure on any page

[L2 Project Knowledge Layer] — Cached
- Project structure: VitePress 1.6.4, base=/agent-engineering-hub/
- Link conventions: Internal links use /guide/... format, no .md suffix
- Known patterns: Previously 3 instances of 404s caused by misspelled paths

[L3 Working State Layer] — Updated each iteration
- Current hypothesis: Most 404s are path typos
- Completed: Ran link-checker once, output showed 12 broken links
- Tried: Nothing yet

[L4 External Knowledge Layer] — On demand
- (None — fixing links doesn't need external APIs)

[L5 Operational Evidence Layer] — Latest
- link-checker output: 12 errors, see link-checker-output.json
```

## Exercise

Design a five-layer context package for a task to "add a new MCP tutorial page":

1. What should L1 goal layer contain? How do you quantify the acceptance criteria?
2. Which files should L2 project knowledge layer cache?
3. How would L3 working state layer change during the task?
4. What roles do L4 and L5 play in this specific task?

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Agent repeatedly reads the same file | L2 doesn't cache summaries of read files | Write a summary to L3 after reading |
| Agent ignores important acceptance criteria | L1 is buried by noise from lower layers | Place L1 at the top of the window with separator markers |
| Agent makes decisions based on stale info | L3 wasn't updated between iterations | Force-refresh L3 at the end of each iteration |
| Context window overflows | All five layers growing with no compression strategy | Keep only summaries for L4/L5; see [Compression & Summarization](./compression) |

## Next Steps

With the five-layer model understood, move on to [Injection Strategy](./injection-strategy) — how to put information into the Agent's context window in the right order and at the right granularity.
