# Retry & Circuit Breaker

## Concept

Every tool call an Agent makes can fail — API timeout, file not found, insufficient permissions, malformed input. Retry strategies determine "what to do after a failure"; circuit breakers determine "when to stop." Together, these two mechanisms prevent the Agent from wasting resources on unrecoverable errors.

Without retry strategies, the Agent gives up at the first transient failure, abandoning a problem that could have been fixed. Without circuit breakers, the Agent retries indefinitely on persistent failures, burning through tokens with zero progress.

## Why Do We Need Error Classification?

Not all errors should be retried. Treating "API rate limit" and "permission denied" with the same strategy leads the Agent to repeatedly hit a wall on truly unsolvable problems.

**Key principle: Recoverable errors can be retried; unrecoverable errors must stop immediately.** The test is "will retrying change the outcome?" — retrying a permission denial 100 times still results in denial.

## Error Classification & Routing

```
Tool call failed
    │
    ├── Recoverable errors (retry may change outcome)
    │   ├── Transient fault: network timeout, API rate limit
    │   │   → Exponential backoff retry, max 3 times
    │   ├── State error: parameter format wrong, file path wrong
    │   │   → Fix parameters then retry, max 2 times
    │   └── Logic error: compile failure, test failure
    │       → Analyze error message → fix → retry, max 3 times
    │
    └── Unrecoverable errors (retry won't change outcome)
        ├── Permission denied: no sudo, no API key
        │   → Stop immediately, do not retry
        ├── Resource not found: file / page / endpoint genuinely doesn't exist
        │   → Verify then retry once, stop if still failing
        └── Semantic error: model output doesn't match schema
            → Strengthen constraints then retry, max 2 times
```

| Error Type | Typical Trigger | Strategy | Max Retries |
|-----------|----------------|----------|-------------|
| **Network timeout** | API calls, file downloads | Exponential backoff retry | 3 |
| **API rate limit** | High-frequency API calls | Wait for Retry-After header, then retry | 3 |
| **Tool call format error** | Parameter type mismatch | Fix parameters then retry | 2 |
| **Compile/build error** | Syntax error, type error | Analyze error → fix → retry | 3 |
| **Model hallucination** | Output doesn't match schema | Request regeneration with stronger constraints | 2 |
| **Permission denied** | Write-protected directory, unauthorized API | **Stop immediately, do not retry** | 0 |
| **Resource not found** | Wrong file path, non-existent API endpoint | Verify path then retry once | 1 |

## Exponential Backoff

For recoverable transient errors, exponential backoff is the classic strategy. The core idea: wait 1 second after the first failure, 2 seconds after the second, 4 seconds after the third — giving the system time to recover.

```
Attempt 1: wait 1s   → fail (timeout)
Attempt 2: wait 2s   → fail (timeout)
Attempt 3: wait 4s   → fail (timeout)
Attempt 4: wait 8s   → fail → ESCALATE (exceeded max retries)
```

### Backoff Implementation Notes

**Base:** Initial wait time shouldn't be too small (≥ 1s recommended). Too short a wait hammers an overloaded service — it's still processing the previous request and you're sending another.

**Cap:** Maximum wait time should not exceed the task's overall timeout limit (≤ 30s recommended). If the backoff time is already approaching the task timeout, it's better to give up.

**Jitter:** Add a random factor (±20%) to the backoff time to avoid thundering herd when multiple Agents retry simultaneously.

```
base_wait = min(initial * (2 ^ attempt), max_wait)
actual_wait = base_wait * (0.8 + random() * 0.4)  // ±20% jitter
```

### When to Use Exponential Backoff

| Scenario | Applicable? | Reason |
|----------|------------|--------|
| API rate limit (429) | Yes | Service temporarily overloaded, waiting helps |
| Network timeout | Yes | May be transient network jitter, retry may succeed |
| Permission denied (403) | No | Permissions don't change by waiting |
| Server error (500) | Caution | If persistent, backoff just delays the inevitable |
| Parameter error (400) | No | Needs parameter fix, not waiting |

## Circuit Breaker

The circuit breaker is a classic pattern for preventing cascading failures. The core idea: when the failure count exceeds a threshold, stop retrying immediately and enter a "tripped" state.

```
        ┌──────────┐
        │  CLOSED  │ ← Normal state: requests pass through
        └────┬─────┘
             │ Consecutive failures ≥ N
             ▼
        ┌──────────┐
        │   OPEN   │ ← Tripped state: all requests immediately rejected
        └────┬─────┘
             │ After cooldown period
             ▼
        ┌──────────┐
        │ HALF-OPEN│ ← Probing state: allow a small number of requests through
        └────┬─────┘
      success │    failure
       ▼      │      ▼
    CLOSED    │   OPEN (reset cooldown)
```

### Circuit Breaker Trigger Conditions for Agent Scenarios

| Condition | Recommended Threshold | Behavior When Triggered |
|-----------|---------------------|------------------------|
| Same tool call fails consecutively | ≥ 3 times | Pause loop, report root cause |
| Same error type repeats within 5 iterations | ≥ 3 times | Force strategy switch |
| Token consumption rate abnormal (single iteration > 3× expected) | Trigger immediately | Output completed portion, wait for human decision |
| Build fails consecutively | ≥ 3 times | Pause, output error analysis report |

### Post-Trip Behavior

Tripping the circuit breaker isn't simply "stopping." After tripping, a structured report must be output:

```
Circuit breaker report should include:
1. What operation failed (specific tool call and parameters)
2. Why it failed (error type and error message)
3. What approaches have already been tried (tried strategies list)
4. Recommended next step (continue / switch approach / needs human intervention)
```

## Example: Complete Retry Flow for Fixing a Compilation Error

**Scenario 1: Recoverable error — compilation failure**

```
Agent modifies src/auth.ts
   → npm run build → FAIL (TypeError: undefined is not a function)

[Error classification] Compile/build error → retries allowed, max 3

Attempt 1: Analyze error → find that a non-existent function is called → grep to find correct function name
           → fix → npm run build → FAIL (different type error)

Attempt 2: Analyze new error → find missing type import → add import
           → fix → npm run build → PASS

[Circuit breaker] Not triggered (only 1 consecutive failure, below threshold)
```

**Scenario 2: Unrecoverable error — permission denied**

```
Agent tries to modify /etc/hosts (requires sudo)
   → Permission denied

[Error classification] Permission denied → no retries allowed → stop immediately

[Circuit breaker] Not triggered (this isn't "consecutive failure" — it's an unrecoverable error)
Agent should immediately report to user:
  - What permission is needed (sudo)
  - Why it's needed (modifying system files)
  - How user can do it manually (sudo vim /etc/hosts)
```

**Scenario 3: Circuit breaker trips — consecutive build failures**

```
Agent modifies src/parser.ts
   → npm run build → FAIL (SyntaxError)
   → fix → npm run build → FAIL (another SyntaxError)
   → fix → npm run build → FAIL (third SyntaxError)

[Circuit breaker] Tripped: 3 consecutive build failures

Output circuit breaker report:
  - Failed operation: npm run build
  - Root cause: Syntax errors in parser.ts may stem from misunderstanding language features
  - Tried: Fixed 3 different syntax errors
  - Recommendation: Needs human review of parser.ts changes, may need redesign
```

## Timeout Strategy

Timeouts complement the circuit breaker — they handle the case of "no explicit failure, but stuck":

| Timeout Type | Recommended Value | Behavior When Triggered |
|-------------|------------------|------------------------|
| Single tool call timeout | 30 seconds | Retry (if recoverable) or skip |
| Single iteration timeout | 5 minutes | Proceed to next iteration, record this one as incomplete |
| Whole task timeout | 30 minutes | Graceful degradation: output completed portion |
| User no-response timeout | 10 minutes | Apply default strategy or pause |

## Design Checklist

- [ ] All possible error types have explicit classification (recoverable vs. unrecoverable)
- [ ] Exponential backoff has a base (≥ 1s), cap (≤ 30s), and random jitter (±20%)
- [ ] Circuit breaker has clear trigger conditions (consecutive failures ≥ 3) and cooldown period
- [ ] Post-trip output includes root cause analysis, tried approaches, and recommended next step
- [ ] Unrecoverable errors stop immediately without pointless retries
- [ ] Timeout strategy covers single call, single iteration, and whole task levels
- [ ] All exit paths output structured reports (not just "it failed")

## Exercise

Design an error handling strategy for an Agent that calls the GitHub API to create a PR:

1. List at least 5 possible errors.
2. Classify each error and provide a retry strategy.
3. Under what circumstances should a circuit breaker be set?
4. What should the Agent output to the user after the circuit breaker trips?
5. How should "API rate limit exceeded" be handled — stop immediately or backoff and retry?

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Agent retries the same permission error repeatedly | Error classification missing "unrecoverable" category | Add PermissionDenied → 0 retries |
| Circuit breaker too sensitive, triggers on normal fluctuation | Consecutive failure threshold too low | Raise threshold to 5 |
| Circuit breaker too sluggish, wastes many tokens before triggering | Threshold too high or no token monitoring | Lower threshold to 3 or add token rate check |
| Retry after cooldown still fails | Root cause not fixed (e.g., expired API key) | Post-trip output should check whether root cause can be auto-fixed |
| Backoff time too long, user can't wait | Base or cap too large | Lower base to 1s, cap to 10s |

## Next Steps

Retry and circuit breaker handle "single operation failures" — move on to [Multi-Source Feedback](./multi-source-feedback) to understand how to pull signals from multiple channels so the Agent catches errors earlier.
