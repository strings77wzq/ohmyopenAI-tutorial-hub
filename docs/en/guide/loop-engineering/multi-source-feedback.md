# Multi-Source Feedback

## Concept

Relying solely on the Agent's own judgment to evaluate "how am I doing?" is unreliable — it's like letting a student grade their own paper. Agents have systematic biases: confirmation bias (tendency to see evidence supporting their own conclusions), blind spots (inability to detect errors they don't know exist), and scope limitation (only seeing information within the context window).

The core idea of multi-source feedback is: **have the Agent cross-validate its progress by pulling signals from at least three independent channels.** Only when multiple independent sources point to the same conclusion can the Agent be confident that "I actually got this right."

## Why Isn't Single-Channel Feedback Enough?

```
Agent writes some code
   → Agent itself thinks "this looks good"
   → Reality: the code has 3 bugs, test coverage is 40%
```

The Agent's self-assessment has systematic biases:

| Bias Type | Manifestation | Consequence |
|-----------|--------------|-------------|
| **Confirmation bias** | Tends to see evidence supporting its own conclusions | Agent thinks "it's fixed" but it actually isn't |
| **Blind spots** | Can't detect errors it doesn't know about | Doesn't realize a function name is misspelled (because Agent believes the spelling is correct) |
| **Scope limitation** | Only sees information within the context window | Fixed file A but broke file B |
| **Recency bias** | Most recent operations have the greatest influence | Forgets problems introduced earlier |

## Three Feedback Channels

```
                          ┌─────────────┐
                          │    Agent    │
                          └──────┬──────┘
                                 │
            ┌────────────────────┼────────────────────┐
            ▼                    ▼                    ▼
   ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
   │   Internal     │   │   External     │   │   Human        │
   │   Feedback     │   │   Feedback     │   │   Feedback     │
   │ Agent ↔ Tools  │   │ Agent ↔ Harness│   │ Agent ↔ User   │
   └───────┬────────┘   └───────┬────────┘   └───────┬────────┘
           │                    │                    │
           ▼                    ▼                    ▼
   ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
   │ Tool return    │   │ Tests/builds/  │   │ Approval/      │
   │ values         │   │ audits         │   │ rejection/     │
   │ File contents  │   │ Evaluator score│   │ modification   │
   │ Error messages │   │ Static analysis│   │ Direction      │
   │                │   │ results        │   │ judgment       │
   └────────────────┘   └────────────────┘   └────────────────┘
```

### Channel 1: Internal Feedback (Agent ↔ Tools)

Every tool call is an implicit feedback signal. This is the fastest, cheapest channel — no additional infrastructure needed:

```
Agent calls read_file("src/auth.ts")
  → Returns 200 lines of code   ← Success: file exists, continue analysis
  → Returns FileNotFound        ← Failure: wrong path, fix and retry
  → Returns PermissionDenied    ← Failure: insufficient permissions, stop immediately
```

**Limitation of internal feedback:** The Agent can only see information it explicitly requested. It doesn't know links are broken unless it actively calls link-checker. It doesn't know tests are failing unless it actively runs tests.

**Design points:**
- At the start of every iteration's Observe phase, force-read all relevant output, not just tool return values
- Record the result of every tool call (success / failure / partial success) for Orient phase trend analysis
- For critical operations (after modifying files), force-run verification tools (tests, build, lint)

### Channel 2: External Feedback (Agent ↔ Harness)

The Harness provides structured, automated quality feedback. Its core value: **it provides information the Agent cannot produce on its own.**

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

**Types of external feedback:**

| Feedback Type | Information | Applicable Scenario |
|--------------|-------------|-------------------|
| Test results | Pass/fail/skip, coverage | After code changes |
| Build status | Success/failure, warnings | After code changes |
| Static analysis | Lint errors, type errors | After code changes |
| Link check | Broken link count and location | After documentation changes |
| Performance metrics | Page load time, bundle size | After frontend changes |
| Security audit | Vulnerability count, dependency risk | After dependency changes |

**Key principle: External feedback must be triggered after every critical operation, not only at task end.** Discovering problems only when the task is done leads to massive rework costs.

### Channel 3: Human Feedback (Agent ↔ User)

When the Agent reaches a decision boundary, it must hand control back to the user. Human feedback is the slowest but most reliable channel.

**Scenarios where the Agent MUST pause and ask the user:**

| Scenario | Reason |
|----------|--------|
| Multiple viable approaches and Agent can't judge which is better | Needs human preference judgment |
| Decisions involving security or permissions | Deleting files, modifying APIs, accessing sensitive data |
| Still failing after 3 consecutive retries | May have hit a problem the Agent can't solve |
| Task scope exceeds original instructions | "Fixing this bug requires refactoring 3 files" |
| Decisions requiring domain knowledge | Business logic, design preferences, brand guidelines |

**Scenarios where the Agent should NOT ask the user:**

| Scenario | Reason |
|----------|--------|
| Purely mechanical operations | Formatting code, updating links |
| Decisions with clear existing specifications | Following the project's lint rules |
| Agent is 100% confident and the operation is reversible | Anything recorded in git can be reverted |
| Repetitive operations | Pattern already confirmed once |

## Feedback Fusion: From Three Channels to a Decision

The signals from three channels need to be fused into a unified decision. The fusion principle: **independent signals validate each other; conflicting signals trigger escalation.**

**Scenario 1: All three channels agree — act directly**

```
Internal feedback: "link-checker output shows 3 broken links"
    +
External feedback: "npm run build passed, so it's not a config issue"
    +
Human feedback: (not needed — fixing broken links is mechanical)
    ↓
Decision: Agent analyzes the 3 broken links → fixes → re-runs link-checker → confirms pass
```

**Scenario 2: Conflicting signals — escalate to human**

```
Internal feedback: "all tests pass"
    +
External feedback: "Lighthouse performance dropped from 92 to 78"
    +
Human feedback: needs confirmation — new font caused LCP regression → user decides whether to accept
    ↓
Decision: Agent pauses, reports performance regression → waits for user to choose: accept / revert font
```

**Scenario 3: Missing signals — fill in the information**

```
Internal feedback: "code changes complete, syntax correct"
    +
External feedback: (missing — tests not run)
    +
Human feedback: (not needed)
    ↓
Decision: Agent must run tests first, obtain external feedback, then decide next step
```

## Signal-to-Noise Ratio: How to Make Feedback Useful

Not all feedback is equally important. The Agent needs to distinguish "signals" from "noise":

| Signal Type | Signal-to-Noise Ratio | How to Handle |
|------------|----------------------|---------------|
| Test failure | High | Focus immediately, analyze failure cause |
| Lint warning | Medium | Batch fix, don't block main flow |
| Build warning | Low | Record but don't address immediately |
| "Code looks good" | Very low | Ignore — this is the Agent's own feedback |

**Design points:**
- External feedback (tests, builds, audits) is weighted higher than internal feedback (tool return values)
- Internal feedback is weighted higher than the Agent's self-assessment
- When external and internal feedback conflict, external feedback takes precedence

## Example: Multi-Source Feedback in a Translation Task

Designing multi-source feedback for an Agent that auto-translates English documentation:

```
Iteration 1:
  O: Translated 5 chapters
  Internal feedback: Agent checks format consistency → pass
  External feedback: Check link validity → 3 broken links
  Decision: Fix broken links → proceed to iteration 2

Iteration 2:
  O: Broken links fixed
  Internal feedback: Agent checks terminology consistency → found 2 inconsistent terms
  External feedback: Check formatting → pass
  Decision: Unify terminology → proceed to iteration 3

Iteration 3:
  O: Terminology unified
  Internal feedback: Format + terminology → pass
  External feedback: Format + links → pass
  Human feedback: Needs human review of translation quality (lowest signal-to-noise ratio but most reliable channel)
  Decision: Submit for human review → wait for feedback
```

## Exercise

Design a multi-source feedback plan for an Agent that auto-generates API documentation:

1. **Internal feedback:** After documentation is generated, what can the Agent check on its own?
2. **External feedback:** What can the Harness automatically verify (format? links? terminology consistency?)
3. **Human feedback:** Under what circumstances should human review of documentation quality be required?
4. How should feedback from all three channels converge into a "ship or not" decision?
5. If internal feedback says "documentation quality looks good" but external feedback says "5 broken links," what should the Agent do?

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Agent retries repeatedly but gets the same external feedback each time | Feedback isn't being fed back into the Orient phase | Ensure each iteration compares feedback changes against the previous round |
| Human feedback channel overused | Agent asks when it shouldn't | Define explicit rules for "must ask" vs. "must not ask" boundaries |
| External feedback ignored | Agent only reads internal feedback (tool return values), skipping Harness output | Force-check all channels in the Decide stage |
| Agent doesn't escalate when signals conflict | Fusion rules missing, Agent selectively ignores conflicting signals | When internal and external feedback conflict, force pause and report |
| Too much feedback causes Agent indecision | Signal-to-noise ratio too low, Agent drowned in noise | Filter low-value feedback, focus only on test failures and critical warnings |

## Next Steps

Return to the [Loop Engineering Overview](./) to review the overall framework, or read [Context Engineering](/guide/context/) to learn how to precisely control the context window in each iteration.
