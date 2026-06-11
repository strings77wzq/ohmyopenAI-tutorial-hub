# Multi-Agent Coordination

## Concept

When a task requires modifying multiple independent modules simultaneously, having multiple Agents work in parallel can significantly reduce completion time. But parallelism introduces coordination problems: conflicts, deadlocks, and information asymmetry.

## Why Doesn't Multi-Agent Mean "3x Faster"?

Three Agents working simultaneously should ideally be 3x faster. In practice:

- **40% of the gains are eaten by coordination overhead**: Assigning tasks, merging results, and resolving conflicts all take time.
- **Conflicts cause rework**: Agent A and Agent B modified different parts of the same file → merge conflict.
- **Information asymmetry**: Agent A doesn't know what assumptions Agent B made → inconsistent output.

The benefit of multi-Agent depends on task **decomposability** — the more easily a task can be split into independent subtasks, the higher the parallel gain.

## Task Decomposition

### Good Decomposition vs Bad Decomposition

```
✗ Bad decomposition (shared dependency):
  Agent A: Modify config.ts sidebar section
  Agent B: Modify config.ts theme section
  → Both Agents modifying the same file → merge conflict

✓ Good decomposition (along module boundaries):
  Agent A: Write 4 files under docs/guide/context/
  Agent B: Write 4 files under docs/guide/evaluation/
  Agent C: Update config.ts sidebar (register all modules)
  → Zero file conflicts — only Agent C touches config.ts
```

### Decomposition Principles

1. **Split along file boundaries**: Each Agent's file set is disjoint from the others.
2. **Dependencies first**: Shared dependencies are completed by a dedicated Agent first (e.g., config.ts updates).
3. **Aggregation last**: Merging and verification are done by a dedicated Agent or a human.

## Coordination Patterns

### Pattern A: Shared State

All Agents share a single task state file.

```
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Agent A  │   │ Agent B  │   │ Agent C  │
└────┬─────┘   └────┬─────┘   └────┬─────┘
     │              │              │
     └──────────────┼──────────────┘
                    │ read/write
                    ▼
          ┌─────────────────┐
          │  tasks.json      │
          │  {               │
          │    "context/":   │
          │      "status":   │
          │      "complete", │
          │    "eval/":      │
          │      "status":   │
          │      "in_progress│
          │  }               │
          └─────────────────┘
```

**Pros**: Agents can see each other's progress.
**Cons**: The state file itself can become a bottleneck (two Agents writing simultaneously).

### Pattern B: Message Passing

Agents communicate via explicit messages without sharing files.

```
Agent A ──"context module done, 4 files ready"──▶ Agent C
Agent B ──"eval module done, 4 files ready"────▶ Agent C
Agent C: received 2 completion messages → begin merge and verification
```

**Pros**: No shared-state contention.
**Cons**: Agents need to know "who to send to."

### Pattern C: Orchestrator

A dedicated orchestration Agent handles task assignment and result aggregation.

```
              ┌──────────────┐
              │ Orchestrator │
              └──────┬───────┘
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Agent A │ │ Agent B │ │ Agent C │
   │ context │ │ eval    │ │ sidebar │
   └────┬────┘ └────┬────┘ └────┬────┘
        │          │          │
        └──────────┼──────────┘
                   ▼
              ┌──────────────┐
              │ Orchestrator │
              │ aggregate +  │
              │ verify       │
              └──────────────┘
```

**Pros**: Centralized control; easy to track progress and diagnose problems.
**Cons**: The Orchestrator is a single point of failure — if its logic is wrong, the entire flow is affected.

## Anti-Patterns: Common Multi-Agent Pitfalls

### Anti-Pattern 1: Agent Loop

```
Agent A modifies a file → Agent B detects "error" → Agent B reverts it
→ Agent A modifies again → Agent B "fixes" again → infinite loop
```

**Prevention**: Each Agent can only modify its assigned files. If an Agent finds a problem in "someone else's file," report it rather than modifying it directly.

### Anti-Pattern 2: Deadlock

```
Agent A is waiting for Agent B to complete Step 2
Agent B is waiting for Agent A to complete Step 1
→ Both waiting, never progressing
```

**Prevention**: Design dependencies as a DAG (directed acyclic graph); disallow circular dependencies.

### Anti-Pattern 3: Conflicting Edits

```
Agent A and Agent B both modify docs/index.md
→ git merge finds conflicts → neither Agent knows how to resolve them
```

**Prevention**: Follow Decomposition Principle 1 — split along file boundaries so only one Agent modifies index.md.

## Example: Completing Week 2 Content with 3 Agents

```
Orchestrator assigns:

Agent A (Loop Engineering):
  Files: docs/guide/loop-engineering/{ooda-loop,retry-and-breaker,multi-source-feedback}.md
  No file conflicts with other Agents ✓

Agent B (Context Engineering):
  Files: docs/guide/context/{layering,injection-strategy,compression,practice}.md
  No file conflicts with other Agents ✓

Agent C (sidebar):
  Files: docs/.vitepress/config.ts
  Action: Add entries for pages created by Agents A and B in zhGuideSidebar
  Waits: Starts only after Agents A and B complete (needs their file paths)

Execution order:
  Agents A and B start in parallel
  → Agent A completes → notifies Orchestrator → Orchestrator logs completion
  → Agent B completes → notifies Orchestrator → Orchestrator logs completion
  → Orchestrator starts Agent C → Agent C reads A and B's output → updates sidebar
  → Orchestrator runs verification: npm test && npm run docs:build
```

## Exercise

Design a multi-Agent coordination plan for "add 3 EN module translations + update homepage features" simultaneously:

1. How would you decompose the task to avoid file conflicts?
2. Which coordination pattern would you use? Why?
3. If translation Agent B fails (hasn't started yet), should Agent C (homepage update) wait?
4. Draw the Agent assignment and execution order.

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Two Agents keep undoing each other's changes | No clear file ownership boundaries | Strictly assign files by name; prohibit cross-boundary modifications |
| Orchestrator waiting for a signal that will never arrive | Agent crashed without notifying the Orchestrator | Add timeouts to the Orchestrator; mark as FAIL on timeout |
| All Agents complete but merged results are inconsistent | Agents worked with different assumptions (different naming conventions, file structures) | Standardize conventions before task assignment (templates, naming, quality criteria) |

## Next

Return to the [Agent Workflow Orchestration Overview](./) to choose the next module, or read [Loop Engineering](/guide/loop-engineering/) to learn about iterative control for individual Agents.
