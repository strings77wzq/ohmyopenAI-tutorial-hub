# OODA Loop & Exit Mechanisms

## Concept

The OODA Loop is a decision-making model from military strategist John Boyd: **Observe → Orient → Decide → Act**. Every Agent iteration naturally follows this cycle.

## Why Does the Agent Need OODA?

Without a structured loop, the Agent is essentially "flying blind" — it doesn't know what happened in the previous step or what it should be doing now. OODA provides four explicit steps for each iteration:

```
Observe ──▶ Orient ──▶ Decide ──▶ Act
   ▲                                │
   └────────────────────────────────┘
```

### What Each Step Means

- **Observe**: Read tool call return values, test output, error logs, file contents. The core question here is "What is actually happening right now?"
- **Orient**: Compare observations against the goal. Where is the gap? Was the previous assumption correct? How far is the current state from completion?
- **Decide**: Choose the next action. Options include: continue the current strategy, try a different approach, roll back to the last checkpoint, ask the user, or declare the task complete.
- **Act**: Execute the chosen tool call (write file, run test, search code, etc.).

## Three-Stage Exit Mechanism

Every Agent iteration must pass through three exit checks:

```
┌─────────────────────────────────────────────────────┐
│                   ITERATION START                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  L1: TASK COMPLETE?                                 │
│  ├── YES → verify output → EXIT (success)           │
│  └── NO  → continue                                 │
│                                                     │
│  L2: MAKING PROGRESS?                               │
│  ├── YES → continue next iteration                  │
│  └── NO  → try different approach / escalate        │
│                                                     │
│  L3: WITHIN BUDGET?                                 │
│  ├── YES → continue                                 │
│  └── NO  → EXIT (graceful degradation)              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### L1: Is the Task Complete?

This is the highest-priority check. But the definition of "complete" must be explicit:

| Task Type | Completion Standard |
|-----------|-------------------|
| Writing code | All tests pass + build succeeds + code review passes |
| Bug fix | Reproduction steps no longer trigger the bug + regression tests pass |
| Documentation update | Link check passes + spell check passes |
| Deployment | Health check returns 200 + critical-path smoke test passes |

Key principle: **L1 cannot rely solely on the Agent's self-assessment of "I think it's done."** There must be external evidence (test results, build logs, link check output).

### L2: Is There Progress?

Progress requires quantitative metrics, not subjective feelings:

| Progress Metric | Signal |
|----------------|--------|
| Test pass rate | Last time 3/10 → now 6/10 |
| Broken link count | Last time 15 → now 8 |
| Build status | Last time failed → now passing |
| Diff size | Last time +200 lines → now +50 lines |

If there's no progress across all metrics for 2 consecutive iterations, the Agent should switch strategies rather than continue trying the same approach.

### L3: Still Within Budget?

Budgets are hard constraints:

- **Token budget**: A single task's token consumption cannot exceed a preset limit
- **Time budget**: If CI times out or the user has left, the Agent shouldn't keep consuming resources
- **Retry budget**: Consecutive failures on the same operation cannot exceed a threshold

L3-triggered exit should be a "graceful degradation" — output what's been completed, the reason it's incomplete, and suggested next steps.

## Example: Fixing Broken Links on the Docs Site

An Agent fixing 100 broken links and its OODA loop:

```
Iteration 1:
  O: link-checker output shows 100 broken links
  O: Analysis finds 60 are path typos, 40 are non-existent pages
  D: Fix path typos first (batch — 20 at a time)
  A: sed batch replacement → commit → run link-checker

Iteration 2:
  O: link-checker output shows 40 broken links (60 fixed)
  O: All 40 are non-existent pages → need to create new pages or update references
  D: Analyze each target individually — create 5 new pages, update 35 references
  A: Create 5 pages + update 35 links → commit → run link-checker

Iteration 3:
  O: link-checker output shows 0 broken links
  L1: All links return 2xx → EXIT (success)
```

## Exercise

Design an OODA loop for an Agent that auto-generates API documentation:

1. What outputs should the Observe stage check?
2. What is the core comparison in the Orient stage?
3. What signals would cause the Agent to choose "ask the user" instead of "keep going" in the Decide stage?
4. How should L1 "task complete" be defined?

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Agent loops on the same operation repeatedly | Orient stage isn't detecting "no progress" | Strengthen L2 quantitative metrics |
| Agent exits too early | L1 conditions are too loose (Agent decides for itself) | Introduce external verification (test results, build logs) |
| Agent bounces between multiple strategies | Decide stage doesn't track tried approaches | Maintain a "tried strategies" list to avoid repetition |
| Token consumption far exceeds expectations | L3 budget check triggers too late | Predict token consumption at the start of each iteration and warn early |

## Next Steps

With the loop model understood, move on to [Retry & Circuit Breaker](./retry-and-breaker) — when a single operation fails, how do you decide whether to retry or give up.
