# Error Recovery

## Concept

Any multi-step workflow can fail midway. Error recovery strategies define **how the workflow gracefully continues, rolls back, or degrades when a step fails — rather than crashing the entire task.**

## Why Is Error Recovery Different from Retrying?

Retrying (discussed in the Loop Engineering module) handles **single-operation failures**. Error recovery handles **workflow-level failures** — when step 3 fails, what happens to the outputs of steps 1 and 2?

## Error Classification (Workflow Level)

```
┌─────────────────────────────────────────────────────────┐
│ Transient Errors                                        │
│ Traits: Retry will likely succeed                       │
│ Examples: Network timeout, API rate limit, file lock    │
│ Strategy: Wait + retry (exponential backoff)            │
│ Impact: Step is delayed but prior outputs are safe      │
├─────────────────────────────────────────────────────────┤
│ Permanent Errors                                        │
│ Traits: Retry will never succeed                        │
│ Examples: Permission denied, file not found, invalid    │
│           API parameters                                │
│ Strategy: Stop current step; evaluate whether to roll   │
│           back completed steps                          │
│ Impact: May need to undo outputs from steps 1-2         │
├─────────────────────────────────────────────────────────┤
│ Ambiguous Errors                                        │
│ Traits: Uncertain whether retry will succeed            │
│ Examples: Build failure (could be transient dependency  │
│           download or a code bug)                       │
│ Strategy: Retry once; if it fails again → escalate to   │
│           human decision                                │
│ Impact: TBD                                             │
└─────────────────────────────────────────────────────────┘
```

## Three Recovery Strategies

### Strategy 1: Checkpoint & Resume

Save state after critical steps complete. If a later step fails, resume from the most recent checkpoint instead of starting over.

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Step 1   │───▶│ Step 2   │───▶│ Step 3   │
│ Create   │    │ Write    │    │ Verify   │
│ files    │    │ content  │    │ links    │
└──────────┘    └──────────┘    └──────────┘
     │               │               │
     ▼               ▼               ▼
  [CP 1]          [CP 2]          [CP 3]

If Step 3 fails:
  → Resume from CP 2 (files already written, content complete)
  → Re-run verification → fix → verify → done

  ✗ Don't resume from CP 1 (you'd lose Step 2's output)
  ✗ Don't start over from scratch
```

Checkpoint implementation:

```typescript
interface Checkpoint {
  step: string
  completedFiles: string[]     // Files successfully created/modified
  pendingTasks: string[]       // Tasks not yet executed
  state: Record<string, any>   // Arbitrary state data
  timestamp: number
}
```

### Strategy 2: Compensating Actions

When a step fails, execute a "reverse operation" to undo the effects of prior steps.

```
Step 1: git checkout -b feat/new-module        → branch created
Step 2: Create 4 new .md files                 → new files on branch
Step 3: npm run docs:build → FAIL (build failed)

Compensating actions:
  - git checkout main                          → back to main
  - git branch -D feat/new-module              → delete failed branch
  → System restored to pre-Step 1 state
```

Not every step needs or can have a compensating action. Read-only operations (checking links, reading files) have no side effects and need no compensation. Write operations with a controllable scope (creating a branch, creating files) can be compensated. Write operations that affect external systems (created a PR, pushed a commit) have more complex compensation — you may need to close the PR or force push.

### Strategy 3: Graceful Partial Completion

When some steps succeed and others fail, deliver what's done and flag what's incomplete.

```
Task: Fix 10 broken links

Step 1: Fix links #1-8 → all succeeded
Step 2: Fix link #9   → failed (target page doesn't exist and shouldn't be created)

Strategy 3 output:
  {
    "status": "PARTIAL",
    "completed": 8,      // #1-8 fixed and verified
    "failed": 1,          // #9 cannot be auto-fixed
    "remaining": 1,       // #10 not attempted (interrupted by Step 2 failure)
    "recommendation": "#9 points to a non-existent page — need human decision: create the page or update the reference"
  }
```

## Example: Workflow Failure Recovery Flow

Scenario: Agent is adding a new tutorial module (4 sub-pages).

```
[CP 1] Branch feat/add-context-pages created ✓

Step 2: Write 4 .md files
  - layering.md ✓
  - injection-strategy.md ✓
  - compression.md ✓
  - practice.md ✓

[CP 2] 4 files written, content complete ✓

Step 3: Update sidebar config → ✓

Step 4: npm run docs:build → FAIL
  Error: 3 dead links (incorrect link paths in sub-pages)

[Error classification] Build failure → Ambiguous (could be transient dependency issue or a code problem)
  Retry 1 time → npm run docs:build → still FAIL (same error)
  → Escalate to human decision

[Recovery strategy]
  Resume from CP 2: file content OK, sidebar config OK
  Agent analyzes build errors → fixes 3 dead links → retries build
  npm run docs:build → PASS

[CP 3] Build passed ✓
```

## Dead Letter Queue

For tasks that repeatedly fail, don't let them block the main workflow:

```
┌──────────────┐
│  Main        │
│  Workflow    │
│  Processing  │
│  10 tasks    │
└──────┬───────┘
       │ 9 succeeded, 1 repeatedly failed
       ▼
┌──────────────┐
│  Dead Letter │ ← Failed tasks moved here
│  Queue       │
│              │
│ task-47:     │
│ File: docs/en/guide/harness/entropy.md
│ Error: Lost 2 ASCII diagrams after translation
│ Retries: 3
│ Next action: Re-submit after human review
└──────────────┘
```

The value of a dead letter queue: **it doesn't block the main workflow, but doesn't discard failed tasks either.** It separates "temporarily unprocessable" tasks from both "completed" and "abandoned."

## Exercise

Design an error recovery plan for a "batch update frontmatter on 20 pages" workflow:

1. Which operations have side effects (need compensation)? Which don't?
2. After which steps should you set checkpoints?
3. If page 15 fails validation after being updated, how should the workflow recover?
4. When should a task go into the dead letter queue instead of being retried repeatedly?

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Recovery re-executed already-successful steps | Checkpoint didn't save progress correctly | Ensure checkpoints include a "completed task IDs" list |
| Compensating action itself failed | The state the compensation assumed no longer exists | Make compensating actions idempotent — same result on repeated execution |
| Dead letter queue piling up with many tasks | Retry threshold too high or no human processing pipeline | Lower retry count; add a periodic cleanup mechanism |

## Next

Error recovery handles step-level failures — next, see [Multi-Agent Coordination](./multi-agent) to handle conflicts and coordination when multiple Agents work simultaneously.
