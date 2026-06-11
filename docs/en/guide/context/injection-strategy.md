# Context Injection Strategy

## Concept

Context injection is not a "one-shot dump" — that's the Prompt Engineering approach. Context engineering uses **progressive disclosure**: start with a summary, expand when the Agent needs details; load high-frequency information first, pull low-frequency information on demand.

## Why Do We Need an Injection Strategy?

Injecting all 5 context layers into the window at once produces:
- The top 20% of the window gets high-frequency information the Agent can process effectively.
- The bottom 80% is low-frequency fragments where the Agent's attention density drops sharply ("lost in the middle" effect).
- Tokens are consumed repeatedly across iterations, even though most content is never used.

## Three Injection Modes

```
┌──────────────────────────────────────────────────────────┐
│ Mode A: Pre-injection                                     │
│ Before the Agent starts working, place the highest-       │
│ priority information into the window.                     │
│ Use for: L1 goal layer + L2 project knowledge summaries   │
│ Pros: Agent has the right direction from the start        │
│ Cons: Consumes initial window space                       │
├──────────────────────────────────────────────────────────┤
│ Mode B: Lazy Injection                                    │
│ Retrieved via tool calls when the Agent needs it,         │
│ like a lazily loaded module.                              │
│ Use for: L4 external knowledge (API docs, library source) │
│ Pros: Tokens only consumed when actually used             │
│ Cons: Agent must "know what it doesn't know" to query     │
├──────────────────────────────────────────────────────────┤
│ Mode C: Triggered Injection                               │
│ Automatically injects relevant information when specific   │
│ conditions are met (build failure, test failure).         │
│ Use for: L5 operational evidence layer                    │
│ Pros: Context automatically follows system state changes  │
│ Cons: Requires event listeners and conditional logic      │
└──────────────────────────────────────────────────────────┘
```

## Token Budget Allocation

Using a 100K-token context window as an example:

```
┌─────────────────────────────────────┐
│ L1 Goal Layer         5K  (5%)      │ ← Highest density: every word counts
│ L2 Project Knowledge  20K (20%)     │ ← Cache unchanged parts
│ L3 Working State      15K (15%)     │ ← Rotated each iteration
│ L4 External Knowledge 15K (15%)     │ ← Loaded on demand, released after use
│ L5 Operational Evidence 5K (5%)     │ ← Summaries only
│ Reserved (history etc.) 40K (40%)   │ ← Space for tool outputs and dialogue
└─────────────────────────────────────┘
```

This is not a fixed template — different task types need different allocations:

| Task Type | L1 | L2 | L3 | L4 | L5 | Reserved |
|-----------|----|----|----|----|----|---------|
| Bug fix | 10% | 10% | 15% | 5% | 20% | 40% |
| New feature | 10% | 25% | 10% | 15% | 5% | 35% |
| Code review | 5% | 15% | 5% | 5% | 20% | 50% |
| Documentation | 10% | 15% | 10% | 20% | 5% | 40% |

## Injection Order

Not all layers are injected simultaneously — injection order affects the Agent's attention distribution:

```
Step 1: L1 goal layer (injected first — Agent sees "what to do" first)
Step 2: L2 project knowledge summary (structure injected, not all files)
Step 3: L3 working state layer (if resuming, inject last session's progress)
Step 4: Agent starts working → pulls L4 on demand
Step 5: Tool call returns → L5 operational evidence flows in automatically
Step 6: After each iteration → L3 working state updates, replacing old version
```

## When to Use Full Text vs. Summary

| Content | Strategy | Reason |
|---------|----------|--------|
| Acceptance criteria | **Full text** | Cannot be compressed; Agent must understand precisely |
| Safety rules | **Full text** | Compression could miss critical constraints |
| Project architecture docs | Summary → full text on demand | Agent usually only needs to know "where" |
| API docs | Summary → full text on demand | Complete signatures only needed when actually calling |
| Test output | **Summary** | Only failure count and key error lines needed |
| Build logs | **Summary** | Only the first error needed, not the full stack trace |

## Example: Injection Plan for "Add a Deployment Documentation Page"

```
Phase 1: Pre-injection
  L1: "Add docs/guide/deployment/observability-rollback.md — concept + steps + exercise"
  L2: VitePress config summary + 5-line summary of existing deployment/index.md

Phase 2: Agent starts working
  Agent: "I need the full content of deployment/index.md and the structure template from existing pages"
  → Lazy injection: read both files

Phase 3: Agent finishes writing
  → Triggered injection: npm run docs:check-links output
  → Triggered injection: npm run docs:check-frontmatter output

Phase 4: Quality gates pass
  L3 update: "deployment/observability-rollback.md complete, all checks passed"
```

## Exercise

Design an injection strategy for a task to "refactor auth.ts (200 lines → split into 3 modules)":

1. What should the pre-injection phase contain?
2. Which files is the Agent most likely to request during lazy injection?
3. When would triggered injection occur, and what would it inject?
4. If the token budget is consumed by tool output, which layer should be compressed?

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Agent frequently reads the same type of file | Pre-injection didn't provide enough structural info | Add project structure summary to L2 |
| Agent misses details in acceptance criteria | L1 got pushed back by a large L2 text block | Place L1 first, separate with `[GOAL]` markers |
| Lazy injection leads Agent to make wrong assumptions | Agent doesn't know information is available to query | List "queryable information sources" in L2 |

## Next Steps

When token budgets get tight, you need to compress context — see [Compression & Summarization](./compression).
