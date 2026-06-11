# Multi-Source Feedback

## Concept

Relying solely on the Agent's own judgment to evaluate "how am I doing?" is unreliable — it's like letting a student grade their own paper. The core idea of multi-source feedback is: **have the Agent cross-validate its progress by pulling signals from at least three independent channels.**

## Why Isn't Single-Channel Feedback Enough?

```
Agent writes some code
   → Agent itself thinks "this looks good"
   → Reality: the code has 3 bugs, test coverage is 40%
```

The Agent's self-assessment has systematic biases:
- **Confirmation bias**: Tends to see evidence that supports its own conclusions.
- **Blind spots**: The Agent can't detect errors it doesn't know about (it doesn't realize a function name is misspelled because it believes that spelling is correct).
- **Scope limitation**: The Agent can only see information within its context window.

## Three Feedback Channels

```
                          ┌─────────────┐
                          │    Agent    │
                          └──────┬──────┘
                                 │
             ┌───────────────────┼───────────────────┐
             ▼                   ▼                   ▼
    ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
    │ Internal       │  │ External       │  │ Human          │
    │ Feedback       │  │ Feedback       │  │ Feedback       │
    │ Agent ↔ Tools  │  │ Agent ↔ Harness│  │ Agent ↔ User   │
    └───────┬────────┘  └───────┬────────┘  └───────┬────────┘
            │                   │                   │
            ▼                   ▼                   ▼
    ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
    │ Tool return    │  │ Tests/builds/  │  │ Approval/      │
    │ values         │  │ audits         │  │ rejection/     │
    │ File contents  │  │ Evaluator score│  │ modification   │
    │ Error messages │  │ Lighthouse     │  │ Direction      │
    │                │  │ score          │  │ judgment       │
    └────────────────┘  └────────────────┘  └────────────────┘
```

### Channel 1: Internal Feedback (Agent ↔ Tools)

Every tool call is an implicit feedback signal:

```
Agent calls read_file("src/auth.ts")
  → Returns 200 lines of code   ← Success: file exists, continue analysis
  → Returns FileNotFound        ← Failure: wrong path, fix and retry
  → Returns PermissionDenied    ← Failure: insufficient permissions, stop immediately
```

Internal feedback is the fastest and cheapest channel — no additional infrastructure needed. But it's also the channel most prone to blind spots, because the Agent can only see information it explicitly requests.

### Channel 2: External Feedback (Agent ↔ Harness)

The Harness provides structured, automated quality feedback:

```
Agent modifies 5 pages on the docs site
  → Harness runs link-checker
    → 0 broken links ← pass, continue
    → 3 broken links ← fail, Agent analyzes and fixes

Agent submits a PR
  → Harness runs full gate checks
    → npm test     ← PASS
    → npm run build ← PASS
    → npm run lint  ← FAIL (2 missing frontmatter entries)
```

The core value of external feedback: **it provides information the Agent cannot produce on its own.** The Agent doesn't know links are broken unless the link-checker tells it.

### Channel 3: Human Feedback (Agent ↔ User)

When the Agent reaches a decision boundary, it must hand control back to the user:

**Scenarios where the Agent MUST pause and ask the user:**
- Multiple viable approaches and the Agent can't judge which is better
- Decisions involving security or permissions (deleting files, modifying APIs, accessing sensitive data)
- Still failing after 3 consecutive retries
- Task scope has expanded beyond original instructions (Agent discovers "fixing this bug requires refactoring 3 files")

**Scenarios where the Agent should NOT ask the user:**
- Purely mechanical operations (formatting code, updating links)
- Decisions with clear existing specifications (follow the project's lint rules)
- Agent is 100% confident and the operation is reversible (anything recorded in git can be reverted)

## Feedback Fusion: From Three Channels to a Decision

```
Internal feedback: "link-checker output shows 3 broken links"
    +
External feedback: "npm run build passed, so it's not a config issue"
    +
Human feedback: (not needed — fixing broken links is mechanical)
    ↓
Decision: Agent analyzes the 3 broken links → fixes → re-runs link-checker → confirms pass
```

```
Internal feedback: "all tests pass"
    +
External feedback: "Lighthouse performance dropped from 92 to 78"
    +
Human feedback: needs confirmation — new font caused LCP regression → user decides whether to accept
    ↓
Decision: Agent pauses, reports performance regression → waits for user to choose: accept / revert font
```

## Example: Multi-Source Feedback in Practice with Golem

Golem's verification loop is an engineering implementation of three-layer feedback:

```
                     ┌──────────────────┐
                     │ Intent Classification│
                     └────────┬─────────┘
                              │
                     ┌────────▼─────────┐
                     │ Task Dispatch     │
                     └────────┬─────────┘
                              │
                     ┌────────▼─────────┐
                     │ Agent Execution   │
                     └────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │ Self-      │  │ @oracle    │  │ Independent│
     │ verify     │  │ review     │  │ verify     │
     │ (internal) │  │ (human)    │  │ (external) │
     └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
           │               │               │
           └───────────────┼───────────────┘
                           ▼
                   ┌──────────────┐
                   │ Pass → commit│
                   │ Fail → loop  │
                   └──────────────┘
```

## Exercise

Design a multi-source feedback plan for an Agent that auto-translates English documentation:

1. **Internal feedback**: After translating, what can the Agent check on its own?
2. **External feedback**: What can the Harness automatically verify (format? links? terminology consistency?)
3. **Human feedback**: Under what circumstances should human review of translation quality be required?
4. How should feedback from all three channels converge into a "ship or not" decision?

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Agent retries repeatedly but gets the same external feedback each time | Feedback isn't being fed back into the Orient stage | Ensure each iteration compares feedback changes against the previous round |
| Human feedback channel overused | Agent asks when it shouldn't | Define explicit rules for "must ask" vs. "must not ask" boundaries |
| External feedback ignored | Agent only reads internal feedback (tool return values), skipping Harness output | Force-check all channels in the Decide stage |

## Next Steps

Return to the [Loop Engineering Overview](./) to review the overall framework, or read [Context Engineering](/guide/context/) to learn how to precisely control the context window in each iteration.
