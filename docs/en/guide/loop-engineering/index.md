# Loop Engineering

Loop Engineering addresses one core question: **How does an Agent stay stable, recoverable, and convergent within the "plan—execute—reflect" cycle?**

## Why Loop Engineering?

A single Prompt cannot solve complex engineering tasks. Agent work is fundamentally iterative:

```
Plan ──▶ Execute ──▶ Reflect ──▶ Adapt
  ▲                                  │
  └──────────────────────────────────┘
```

Without well-designed Loop mechanisms, Agents face three critical failure modes:

| Failure | Symptom | Consequence |
|---------|---------|-------------|
| **Infinite Loop** | Agent repeatedly tries the same strategy without converging | Token explosion, task never completes |
| **Premature Exit** | Agent gives up at the first error | Recoverable transient failures cause total failure |
| **Goal Drift** | Agent deviates from original intent over iterations | Output becomes unrelated to requirements |

## Core Loop Models

### OODA Loop (Observe—Orient—Decide—Act)

The Agent planning-execution loop maps to the classic OODA model:

```
Observe ──▶ Orient ──▶ Decide ──▶ Act
    ▲                               │
    └───────────────────────────────┘
```

- **Observe**: Read tool outputs, test results, error logs
- **Orient**: Compare current state to target state
- **Decide**: Choose next strategy (retry / alternative approach / ask user / exit)
- **Act**: Execute the chosen tool call

### Three-Layer Exit Mechanism

Every Agent iteration must pass through three layers of exit judgment:

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
│  └── NO  → different approach / escalate            │
│                                                     │
│  L3: WITHIN BUDGET?                                 │
│  ├── YES → continue                                 │
│  └── NO  → EXIT (graceful degradation)              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Error Retry Strategies

### Exponential Backoff

For recoverable errors like network timeouts and API rate limits:

```
Attempt 1: wait 1s  → fail
Attempt 2: wait 2s  → fail
Attempt 3: wait 4s  → fail
Attempt 4: wait 8s  → fail → ESCALATE
```

### Error Classification and Routing

| Error Type | Strategy | Max Retries |
|------------|----------|-------------|
| Network Timeout (TimeoutError) | Exponential backoff retry | 3 |
| API Rate Limit (RateLimitError) | Wait for Retry-After header | 3 |
| Tool Call Format Error | Fix parameters, retry | 2 |
| Compilation/Build Error | Analyze error → fix → retry | 3 |
| Permission Denied | **Stop immediately, no retry** | 0 |
| Model Hallucination (output doesn't match schema) | Request regeneration | 2 |

### Circuit Breaker

```
Consecutive failures > 3 → pause loop → output root cause analysis → wait for human decision
```

This prevents the Agent from wasting tokens and compute on unrecoverable errors.

## Feedback Loops

### Internal Feedback (Agent ↔ Tools)

Every tool call carries implicit feedback:

```
Agent calls read_file("auth.ts")
  → Returns file content      ← Success: continue analysis
  → Returns FileNotFound      ← Failure: fix path, retry
  → Returns PermissionDenied  ← Failure: exit immediately
```

### External Feedback (Agent ↔ Harness)

Harness provides structured quality feedback:

```
Agent modifies code
  → Harness runs test suite
    → All pass    ← Continue to next step
    → Some fail   ← Agent analyzes failures, fixes code
    → Build fails ← Agent checks compiler errors, fixes, retries
```

### Human Feedback (Agent ↔ User)

When the Agent cannot decide autonomously, the Loop must pause and request human input:

- Multiple viable approaches with unclear tradeoffs
- Safety confirmations needed (code deletion, API changes)
- Consecutive retry failures exceed threshold

## Implementation in Agent Frameworks

### OMO (Oh-My-OpenAgent)

OMO's verification loop is Loop Engineering in practice:

```
Intent Classification → Task Delegation → Agent Execution → Verification
                                                              │
                                                     ┌────────┘
                                                     ▼
                                              Self-verification
                                              Cross-verification (@oracle review)
                                              Independent verification
                                                     │
                                                     ▼
                                              Pass → Commit
                                              Fail → Loop and fix
```

### Claude Code / gstack

Engineers control Loop granularity through mechanisms like `/loop`, `ralph`, and `autopilot`:

- **ralph**: Self-referential loop until task completion, with verification reviewer
- **autopilot**: Fully autonomous execution from idea to working code
- **ultrawork**: Parallel execution engine for high-throughput task completion

## Relationship to Other Dimensions

```
                    ┌──────────────────┐
                    │  Prompt Engineering│ ← Defines input format per iteration
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│Context Eng.   │   │   Tool Use    │   │    Skills     │
│Precise context│   │ Atomic tool   │   │ Reusable      │
│injection      │   │ calls         │   │ capability    │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                  ┌──────────────────┐
                  │   MCP Protocol   │ ← Standardized external access
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │  Harness Eng.    │ ← Quality verification feedback
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Loop Engineering │ ← Closed-loop iteration control
                  └──────────────────┘
```

Loop Engineering is the "conductor" of all other dimensions — it decides when to invoke a Prompt, when to inject Context, when to trigger Harness verification, and when to stop and report results.

## Design Checklist

- [ ] Each loop iteration has explicit termination conditions
- [ ] Errors are classified by type, with different retry strategies per category
- [ ] A circuit breaker prevents infinite retries
- [ ] Feedback comes from multiple sources: tool output, Harness tests, user confirmation
- [ ] Loop state is traceable, with logs for each iteration
- [ ] Exit produces a structured report (success / partial / failure + reason)

## Practice

Design a Loop strategy for an Agent that "automatically fixes broken links on a documentation site":

1. What is the success criterion? (All links return 200? What else?)
2. After discovering a broken link, what operation sequence should the Agent perform?
3. When should the Agent stop and request human help?
4. How do you prevent the Agent from looping on the same link repeatedly?

## Next Steps

Read [Context Engineering](/en/guide/context/) to learn how to precisely control the context window within each loop iteration.
