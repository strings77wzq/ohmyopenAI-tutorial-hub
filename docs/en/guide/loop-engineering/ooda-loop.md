# OODA Loop & Exit Mechanisms

## Concept

The OODA Loop is a decision-making model from military strategist John Boyd: **Observe → Orient → Decide → Act**. Every Agent iteration naturally follows this cycle — gathering information from the environment, analyzing the current state, choosing the next action, and executing it.

But "naturally follows" doesn't mean "well-designed." Without a structured OODA, the Agent is "flying blind": it doesn't know what happened in the previous step, doesn't know what it should be doing now, and doesn't know when it should stop.

## Why Does the Agent Need OODA?

LLMs are stateless. Every call is an independent function with no memory, no continuity. OODA provides four explicit steps for each iteration, solving three core problems:

| Problem | How OODA Solves It |
|---------|--------------------|
| "What happened in the previous step?" | Observe: explicitly collect all outputs from the previous step |
| "What should I do now?" | Orient + Decide: select the optimal action based on current state |
| "When should I stop?" | Orient: evaluate whether it's still necessary to continue every iteration |

Without OODA, Agent iterations are like flying without an instrument panel — it might be circling in place, already off-course, or still flying on empty fuel.

## Detailed Breakdown of the Four Phases

### Observe

**Core question: "What is actually happening right now?"**

Observe is not "a quick glance" — it's systematically collecting every signal from the previous step:

```
What Observe collects:
├── Tool call return values (success / failure / partial success)
├── Error logs and stack traces
├── Test output (pass / fail / skip)
├── Build status (success / failure / warnings)
├── File content changes (diff)
└── External system state (API responses, database state)
```

**Key pitfall:** The Agent may only look at information it explicitly requested, ignoring "unexpected signals." For example, fixing one bug but introducing another — if you only check the test for the original bug, you'll miss the regression.

**Design points:**
- At the start of every iteration, force-read all relevant output, not just tool return values
- Record the results of the previous Observe, so the Orient phase can make comparisons
- For long tasks, maintain an "observation history" to prevent the Agent from forgetting early discoveries

### Orient

**Core question: "How far am I from the goal? Was the previous assumption correct?"**

Orient is the most critical phase of OODA — it transforms raw observations into meaningful judgments:

```
Orient's three sub-steps:
1. Compare: current state vs. target state
   → "Test pass rate went from 3/10 to 6/10" (making progress)
   → "Test pass rate went from 3/10 to 2/10" (regressed)

2. Attribute: why did this change happen?
   → "Because I fixed the type error in the login module"
   → "Because refactoring introduced a new circular dependency"

3. Predict: at the current rate, how many more iterations?
   → "At +3 tests per iteration, 2 more iterations needed"
   → "If regression continues, need to switch strategy"
```

**Orient's judgment directly drives exit decisions:**

| Orient Conclusion | Exit Action |
|-------------------|-------------|
| Task complete (all goals achieved) | → L1 exit (success) |
| No progress for 2 consecutive iterations | → Switch strategy or escalate |
| Budget nearly exhausted | → Prepare for L3 exit |
| Task scope exceeds expectations | → Pause, wait for user confirmation |

### Decide

**Core question: "What do I do next?"**

Based on Orient's judgment, Decide selects from multiple options:

```
Decide's option space:
├── Continue current strategy (if Orient shows progress)
├── Switch strategy (if Orient shows no progress)
├── Roll back to previous checkpoint (if regression was introduced)
├── Ask the user (if at a decision boundary)
├── Escalate / report (if beyond capability)
└── Declare complete (if Orient shows goal achieved + external verification passed)
```

**Key principle:** Decide must maintain a "tried strategies" list to avoid cycling on the same strategy.

```
Tried strategies record:
Iter 1: Try sed batch replacement → fixed 60/100
Iter 2: Try individual analysis → fixed 35/100
Iter 3: Remaining 5 need new pages → create new pages

✅ Every iteration uses a different strategy
❌ Repeatedly running sed on the same file (no strategy change)
```

### Act

**Core question: "What specific tool call do I execute?"**

The Act phase translates Decide's decision into concrete tool calls. This is the only phase in OODA that "changes the world."

**Act design points:**
- Execute one atomic operation at a time (one tool call), not multiple file changes at once
- Every operation must have observable results (return value, test output)
- Immediately enter the next Observe after the operation completes

## Three-Stage Exit Mechanism

Every iteration must pass through three layers of exit judgment — this is the core mechanism that prevents infinite loops and premature exits:

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

### L1: Is the Task Complete?

This is the highest-priority check. But the definition of "complete" must be explicit and cannot rely solely on the Agent's self-assessment:

| Task Type | Completion Standard | Verification Method |
|-----------|-------------------|---------------------|
| Writing code | All tests pass + build succeeds | Run `npm test` + `npm run build` |
| Bug fix | Reproduction steps no longer trigger the bug | Run reproduction script + regression tests |
| Documentation update | Link check passes + spell check passes | Run link-checker + spell-checker |
| Deployment | Health check returns 200 + smoke test passes | curl health endpoint + run smoke test |

**Key principle: L1 cannot rely on the Agent saying "I think it's done." There must be external evidence (test results, build logs, check output).**

### L2: Is There Progress?

Progress requires quantitative metrics, not subjective feelings:

| Progress Metric | Signal Example | Judgment |
|-----------------|---------------|----------|
| Test pass rate | 3/10 → 6/10 | Making progress |
| Broken link count | 15 → 8 | Making progress |
| Build status | failed → passing | Making progress |
| Diff size | +200 lines → +50 lines | Making progress (changes converging) |
| Test pass rate | 6/10 → 6/10 | No progress |
| Error count | 3 → 3 | No progress |

**Key rule: If there's no progress across all metrics for 2 consecutive iterations, the Agent must switch strategies rather than continue trying the same approach.**

### L3: Still Within Budget?

Budgets are hard constraints, not suggestions:

| Budget Type | Recommended Limit | Behavior When Triggered |
|-------------|------------------|------------------------|
| Token budget | Single task ≤ 100K tokens | Output completed portion + reason for incompletion |
| Time budget | Single task ≤ 30 minutes | Output completed portion + suggestion for continuation |
| Retry budget | Same operation ≤ 3 consecutive failures | Output root cause analysis + suggest alternatives |
| Iteration budget | Single task ≤ 20 iterations | Output progress summary + remaining work estimate |

**L3-triggered exit should be "graceful degradation" — output what's been completed, why it's incomplete, and what the recommended next steps are.** Not simply "timed out."

## Goal Drift

Goal drift is the most insidious problem in loops — the Agent gradually deviates from its original intent after many iterations:

```
Original goal: "Fix the password reset bug on the login page"

Iteration 5: "The password reset email template needs optimization"
Iteration 8: "The email template's CSS needs responsive adaptation"
Iteration 12: "Responsive adaptation requires refactoring the entire layout component"

Result: Agent is refactoring the layout, and the password reset bug was never fixed
```

### Causes of Goal Drift

1. **Context window fills with intermediate artifacts:** The Agent's attention is drawn to recent operations, forgetting the original goal
2. **Orient only looks at local progress:** Every iteration shows "progress" (CSS improved), but the overall goal isn't advancing
3. **No "goal anchoring" mechanism:** Nowhere to record the original goal, nowhere to check for deviation

### Preventing Goal Drift

```
Every iteration's Orient phase must:
1. Re-read the original goal (extracted from the task description)
2. Compare current work vs. original goal
3. If deviated → roll back to tasks directly related to the original goal
4. Record deviation history to prevent future drift
```

**Design points:**
- At task start, extract and save a "goal anchor" (short description of the original requirement)
- Every iteration's Orient phase must check: does current work directly serve the goal anchor?
- If the Agent discovers the work needed exceeds the original goal scope, it must pause and ask the user

## Example: Fixing Broken Links on the Docs Site

```
Original goal: Fix 100 broken links

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
  O: L1 check → all links return 2xx
  L1: Task complete → EXIT (success)
```

**Notice what happened in the Orient phase of each iteration:**
1. Read link-checker output (Observe)
2. Compare with previous result (40 vs. 100) (Orient)
3. Analyze the type of remaining errors (Orient)
4. Select the optimal strategy (Decide)

## Exercise

Design an OODA loop for an Agent that auto-generates API documentation:

1. What outputs should the Observe phase check?
2. What is the core comparison in the Orient phase?
3. What signals would cause the Agent to choose "ask the user" instead of "keep going" in the Decide phase?
4. How should L1's "task complete" standard be defined?
5. How would you prevent goal drift (e.g., the Agent starts optimizing the documentation's CSS instead of generating content)?

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Agent loops on the same operation repeatedly | Orient phase doesn't detect "no progress" | Strengthen L2 quantitative metrics, force strategy switch after 2 consecutive no-progress iterations |
| Agent exits too early | L1 conditions too loose (Agent decides for itself) | Introduce external verification (test results, build logs) |
| Agent bounces between multiple strategies | Decide phase doesn't record tried approaches | Maintain a "tried strategies" list to avoid repetition |
| Token consumption far exceeds expectations | L3 budget check triggers too late | Predict token consumption at the start of each iteration and warn early |
| Agent did a lot of work but drifted off target | Goal drift — Orient didn't check the goal anchor | Force Orient to re-read the original goal and compare every iteration |

## Next Steps

With the loop model and exit mechanisms understood, move on to [Retry & Circuit Breaker](./retry-and-breaker) — when a single operation fails, how to decide whether to retry or give up.
