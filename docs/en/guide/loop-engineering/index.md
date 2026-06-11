# Loop Engineering

Loop Engineering focuses on a core question: **How does an Agent stay stable and recoverable within the "plan → execute → reflect" cycle, and ultimately converge on the correct result?**

## Why Do We Need Loop Engineering?

A single prompt can't solve complex engineering tasks. Agent work is inherently an iterative process:

```
Plan ──▶ Execute ──▶ Reflect ──▶ Adapt
  ▲                                  │
  └──────────────────────────────────┘
```

Without carefully designed loop mechanisms, the Agent faces three fatal problems:

| Problem | Symptom | Consequence |
|---------|---------|-------------|
| **Infinite loop** | Agent retries the same strategy repeatedly, can't converge | Token explosion, task never completes |
| **Premature exit** | Gives up on the first error | Recoverable transient failures cause total failure |
| **Goal drift** | Deviates from original intent after many iterations | Output code is unrelated to requirements |

## How Loop Engineering Relates to Other Dimensions

```
                    ┌──────────────────┐
                    │ Prompt Engineering│ ← Defines the input format for each iteration
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│Context Eng.   │   │   Tool Use    │   │    Skills     │
│Precise context│   │  Atomic tool  │   │  Reusable     │
│injection      │   │  calls        │   │  capability   │
│               │   │               │   │  modules      │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                  ┌──────────────────┐
                  │    MCP Protocol  │ ← Standardized external access
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │   Harness Eng.   │ ← Quality verification feedback
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Loop Engineering │ ← Closed-loop iteration control
                  └──────────────────┘
```

Loop Engineering is the "conductor" of all other dimensions — it decides when to invoke prompts, when to inject context, when to trigger harness verification, and when to stop and report results.

## Module Contents

| Chapter | Contents |
|---------|----------|
| [OODA Loop & Exit Mechanisms](./ooda-loop) | Core loop model + three-stage exit judgment |
| [Retry & Circuit Breaker](./retry-and-breaker) | Exponential backoff, error classification routing, circuit breaker design |
| [Multi-Source Feedback](./multi-source-feedback) | Internal / external / human — three feedback channels |

## Next Steps

Start with [OODA Loop & Exit Mechanisms](./ooda-loop) to understand how an Agent observes, orients, decides, and acts.
