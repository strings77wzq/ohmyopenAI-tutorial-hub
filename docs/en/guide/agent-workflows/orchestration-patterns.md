# Orchestration Patterns

## Concept

Orchestration determines how multiple Agent operations combine into a complete workflow. Different orchestration patterns suit different task structures and fault-tolerance needs.

## Why Do Orchestration Patterns Matter?

Individual Agent operations (read a file, write code, run a test) are simple on their own. The complexity lies in the **relationships between steps**: which step depends on which? Which can run in parallel? What happens when one step fails?

## Four Core Orchestration Patterns

### 1. Sequential Chain

The simplest pattern: A finishes, then B starts, then C starts.

```
┌───┐     ┌───┐     ┌───┐
│ A ├────▶│ B ├────▶│ C │
└───┘     └───┘     └───┘
```

Use when each step's output is the next step's input.

```
Example: Generate a documentation PR
  1. Read the spec file           → spec content
  2. Generate docs from spec      → .md files
  3. Verify doc links             → check results
  4. Create PR                    → PR URL
```

**Pros**: Simple, easy to understand and debug.
**Cons**: Total time = sum of all steps; any single failure blocks everything downstream.

### 2. Fan-out / Fan-in

Multiple independent tasks run in parallel, and results merge at a convergence point.

```
        ┌───┐
    ┌──▶│ B ├──┐
    │   └───┘  │
┌───┤          ├───▶ ┌───┐
│ A │          │     │ E │ (merge results)
└───┤   ┌───┐  │     └───┘
    │   │ C ├──┤
    ├──▶└───┘  │
    │   ┌───┐  │
    └──▶│ D ├──┘
        └───┘
```

Use when you have multiple independent subtasks whose results need to be aggregated.

```
Example: Check 3 quality dimensions of a docs site in parallel
  A: Trigger quality checks
  ├── B: link-checker    → 0 errors
  ├── C: route-checker   → all routes ok
  └── D: frontmatter     → all pages have titles
  E: Aggregate → PASS (3/3) or FAIL (with specific failures)
```

**Pros**: Total time = slowest subtask.
**Cons**: Merge logic must handle partial failures (B and C pass but D fails → overall PASS or FAIL?).

### 3. DAG (Directed Acyclic Graph)

Tasks have many-to-many dependencies, but no cycles.

```
        ┌───┐
    ┌──▶│ B ├──┐
    │   └───┘  │   ┌───┐
┌───┤          ├──▶│ D │
│ A │   ┌───┐  │   └───┘
└───┤   │ C ├──┘
    │   └───┘
    └──────────────▶ ┌───┐
                    │ E │
                    └───┘
```

Use when tasks have complex dependency relationships — multiple prerequisites must complete before subsequent steps can begin.

```
Example: Add a new tutorial module
  A: Create file structure
  ├── B: Write content       ─┐
  ├── C: Update sidebar       │
  │                           ├──▶ D: npm run docs:build
  └── E: Add EN translation  ─┘
                              (B, C, E must all complete before build)
```

**Pros**: Expresses real-world complex dependencies.
**Cons**: Orchestration logic is complex; debugging is harder.

### 4. State Machine

The Agent transitions between states, each with clear preconditions and exit conditions.

```
        ┌─────────┐
        │  DIAG   │ (diagnose)
        └────┬────┘
             │ issue located
             ▼
        ┌─────────┐
    ┌──▶│  FIX    │ (repair)
    │   └────┬────┘
    │        │ fix complete
    │        ▼
    │   ┌─────────┐
    │   │ VERIFY  │ (verify)
    │   └────┬────┘
    │        │
    │   ┌────┴────┐
    │   ▼         ▼
    │ PASS      FAIL
    │   │         │
    │   ▼         └──▶ back to FIX
    │  DONE
    └──(retry > 3 times → ESCALATE)
```

Use when each step's outcome determines the next state, and transitions may loop.

## Choosing an Orchestration Pattern

| Task Characteristics | Recommended Pattern |
|----------------------|---------------------|
| Strict sequential dependencies | Sequential chain |
| Multiple independent parallel subtasks | Fan-out / Fan-in |
| Complex multi-dimensional dependencies | DAG |
| Uncertain outcomes requiring mid-step decisions | State machine |
| Simple with a fixed path | Sequential chain (don't over-engineer) |

## Handling Partial Failures in Orchestration

```
Principle 1: Don't let non-critical task failures block the entire workflow.

Principle 2: But if a critical task fails, you must stop and report.

Principle 3: Partial success is a valid outcome.
         ("3 of 5 files fixed successfully; 2 need manual handling")
```

## Example: Orchestrating "Add 4 Context Engineering Sub-pages"

```
Phase 1: Create (sequential chain)
  1. Create 4 .md files
  2. Write content (following the structure template)
  3. Update sidebar config
  4. Verify: npm run docs:check-links

Phase 2: Parallel verification (fan-out / fan-in)
  ├── npm run docs:check-links
  ├── npm run docs:check-routes
  └── npm run docs:check-frontmatter

Phase 3: Build verification (sequential)
  5. npm run docs:build
  6. Check build output (page count, size, time)

Phase 4: Commit (sequential)
  7. If all verifications pass → git commit
  8. If any verification fails → report failure + fix → go back to Phase 1
```

## Exercise

Design an orchestration for "update EN translations across 5 doc modules simultaneously":

1. Which steps can run in parallel?
2. Which steps have dependencies?
3. If 4 module translations complete and 1 fails quality checks, is the overall task done?
4. Draw the orchestration topology.

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| One branch in a fan-out fails and all branches are abandoned | Merge logic doesn't handle partial failures | Change to "collect all results, mark each branch PASS/FAIL" |
| Circular dependency in a DAG | Task A waits for B, B waits for A | Re-analyze dependencies; break the cycle |
| State machine stuck in FIX→VERIFY→FIX loop | VERIFY criteria too strict or FIX isn't making progress | Add exit conditions (max loop count) |

## Next

Orchestration governs the relationships between steps — next, see [Error Recovery](./error-recovery) to handle failures within individual steps.
