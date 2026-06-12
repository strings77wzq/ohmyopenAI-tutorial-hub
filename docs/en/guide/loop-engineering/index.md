# Loop Engineering: Closed-Loop Iterative Control

A single prompt can solve only extremely limited problems. When you ask an Agent to "refactor a module" or "fix a production incident," it faces a process that requires multi-step reasoning, repeated verification, and continuous adjustment. **Loop Engineering is the disciplined design of this "plan → execute → reflect" closed loop, keeping the Agent stable, recoverable across iterations, and ultimately converging on the correct result.**

## Why Does an Agent Need Loops?

LLMs are inherently stateless. Every call is an independent function: tokens in, tokens out — no memory, no continuity. An Agent without loops is like an amnesiac worker — every time you speak to them, they've forgotten what they did before.

Loops provide two things that the LLM lacks on its own:

### 1. State

A loop maintains a cross-iteration "world model": what's been tried, what the results were, and what remains unresolved. Without a loop, the Agent forgets the outcome of its first attempt by the fifth iteration.

```
Without loop:
  Iter 1: "Try method A" → fail → (memory lost)
  Iter 2: "Try method A" → fail → (memory lost)
  Iter 3: "Try method A" → fail → ...

With loop:
  Iter 1: "Try method A" → fail → record("A failed: reason X")
  Iter 2: "Try method B" → fail → record("B failed: reason Y")
  Iter 3: "Try method C" → pass → record("C worked")
```

### 2. Convergence

An Agent without loops doesn't know when to stop. It might:
- Exit too early: give up at the first error, abandoning a fixable problem
- Never stop: repeatedly try the same approach, falling into an infinite loop
- Drift off target: after many iterations, deviate from the original intent, producing output unrelated to the requirement

Loops guarantee convergence through **exit mechanisms** (when to stop), **circuit breakers** (when to force a stop), and **goal anchoring** (revisiting the original goal every iteration).

## Three Fatal Problems

| Problem | Symptom | Consequence |
|---------|---------|-------------|
| **Infinite loop** | Agent retries the same strategy repeatedly, can't converge | Token explosion, task never completes |
| **Premature exit** | Gives up on the first error | Recoverable transient failures cause total failure |
| **Goal drift** | Deviates from original intent after many iterations | Output code is unrelated to requirements |

## Core Structure of the Closed Loop

A complete closed-loop iteration contains four phases, following the OODA model:

```
Plan ──▶ Execute ──▶ Reflect ──▶ Adapt
  ▲                                  │
  └──────────────────────────────────┘
```

More concretely, each iteration goes through:

```
┌─────────────────────────────────────────────────┐
│                ITERATION START                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. OBSERVE                                     │
│     Read return values from the previous step,  │
│     error logs, test output                     │
│                                                 │
│  2. ORIENT                                      │
│     Compare goal against current state,         │
│     assess progress                             │
│                                                 │
│  3. DECIDE                                      │
│     Choose next step: continue / switch /       │
│     escalate / stop                             │
│                                                 │
│  4. ACT                                         │
│     Execute tool calls: write files, run tests, │
│     search code                                 │
│                                                 │
│  EXIT CHECK                                     │
│     Task complete? Making progress?             │
│     Still within budget?                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Loop Engineering's Relationship to Other Dimensions

Loop Engineering is the "conductor" of all other dimensions — it decides when to invoke prompts, when to inject context, when to trigger harness verification, and when to stop and report results.

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

## Key Design Principles

When designing an Agent loop, several principles must be kept in mind:

**1. Every iteration must produce observable output.** An unobservable iteration cannot be evaluated for progress, nor can it trigger exit conditions.

**2. Exit conditions must be determined by external evidence, not the Agent's self-assessment.** "I think it's done" is unreliable — objective signals like test passes, build success, and link-check passes are required.

**3. Budget constraints must be hard limits.** Token budgets, time budgets, retry limits — these are not suggestions. When the limit is hit, the Agent must stop.

**4. On failure, context must be output.** When a circuit breaker trips or a timeout occurs, simply saying "it failed" is not enough. The output must include: what was attempted, why it failed, what has already been tried, and what the recommended next step is.

## Module Contents

| Chapter | Contents | Core Concepts |
|---------|----------|---------------|
| [OODA Loop & Exit Mechanisms](./ooda-loop) | Core loop model + three-stage exit judgment | OODA, L1/L2/L3 exits, goal drift |
| [Retry & Circuit Breaker](./retry-and-breaker) | Exponential backoff, error classification routing, circuit breaker design | Exponential backoff, circuit breaker, error classification |
| [Multi-Source Feedback](./multi-source-feedback) | Internal / external / human — three feedback channels | Feedback fusion, signal-to-noise ratio, escalation mechanisms |

## Next Steps

Start with [OODA Loop & Exit Mechanisms](./ooda-loop) to understand how an Agent observes, orients, decides, and acts, and how to design reliable exit conditions.
