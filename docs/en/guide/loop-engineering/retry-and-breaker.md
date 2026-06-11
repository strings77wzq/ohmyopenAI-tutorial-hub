# Retry & Circuit Breaker

## Concept

Every tool call the Agent makes can fail. Retry strategies determine "what to do after a failure"; circuit breakers determine "when to stop." Together, these two mechanisms prevent the Agent from wasting resources on unrecoverable errors.

## Why Do We Need Error Classification?

Not all errors should be retried. Treating "API rate limit" and "permission denied" with the same strategy leads the Agent to repeatedly hit a wall on truly unsolvable problems.

## Error Classification & Routing

| Error Type | Typical Trigger | Strategy | Max Retries |
|-----------|----------------|----------|-------------|
| **Network timeout** (TimeoutError) | API calls, file downloads | Exponential backoff retry | 3 |
| **API rate limit** (RateLimitError) | High-frequency API calls | Wait for Retry-After header, then retry | 3 |
| **Tool call format error** | Parameter type mismatch | Fix parameters, then retry | 2 |
| **Compile/build error** | Syntax error, type error | Analyze error → fix → retry | 3 |
| **Model hallucination** | Output doesn't match schema | Request regeneration with stronger constraints | 2 |
| **Permission denied** (PermissionDenied) | Write-protected directory, unauthorized API | **Stop immediately, do not retry** | 0 |
| **Resource not found** (NotFound) | Wrong file path, non-existent API endpoint | Verify path, then retry once | 1 |

Key principle: **Recoverable errors can be retried; unrecoverable errors must stop immediately.** The distinction is "will retrying change the outcome?" — retrying a permission denial 100 times still results in denial.

## Exponential Backoff

For recoverable transient errors, exponential backoff is the classic strategy:

```
Attempt 1: wait 1s   → fail (timeout)
Attempt 2: wait 2s   → fail (timeout)
Attempt 3: wait 4s   → fail (timeout)
Attempt 4: wait 8s   → fail → ESCALATE (exceeded max retries)
```

### Backoff Implementation Notes

- **Base**: Initial wait time shouldn't be too small (≥ 1s recommended) to avoid hammering an overloaded service.
- **Ceiling**: Maximum wait time should not exceed the task's overall timeout limit (≤ 30s recommended).
- **Jitter**: Add a random factor (±20%) to the backoff time to avoid thundering herd when multiple Agents retry simultaneously.

```
base_wait = min(initial * (2 ^ attempt), max_wait)
actual_wait = base_wait * (0.8 + random() * 0.4)  // ±20% jitter
```

## Circuit Breaker

The circuit breaker is a classic pattern for preventing cascading failures, equally applicable to Agent scenarios:

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

| Condition | Recommended Threshold |
|-----------|---------------------|
| Same tool call fails consecutively | ≥ 3 times |
| Same error type repeats within 5 iterations | ≥ 3 times |
| Token consumption rate abnormal (single iteration > 3× expected) | Trigger immediately |
| Build fails consecutively | ≥ 3 times |

Behavior after circuit breaker trips:
1. **Pause the loop**
2. **Output root cause analysis report**: what operation failed, why, what approaches were already tried
3. **Wait for human decision**: continue / try different approach / abandon

## Example: Complete Retry Flow for Fixing a Compilation Error

```
Agent modifies src/auth.ts
   → npm run build → FAIL (TypeError: undefined is not a function)

[Error classification] Compile/build error → retries allowed, max 3

Attempt 1: Analyze error → find that a non-existent function is called → grep to find correct function name
           → fix → npm run build → FAIL (different type error)

Attempt 2: Analyze new error → find missing type import → add import
           → fix → npm run build → PASS

[Circuit breaker] Not triggered (only 1 consecutive failure)
```

Contrast:

```
Agent modifies /etc/hosts (requires sudo)
   → Permission denied

[Error classification] Permission denied → no retries allowed → stop immediately

[Circuit breaker] Not triggered (this isn't "consecutive failure" — it's an unrecoverable error)
Agent should immediately report to the user: what permission is needed, why, and how the user can do it manually.
```

## Design Checklist

- [ ] All possible error types have explicit classification (recoverable vs. unrecoverable)
- [ ] Exponential backoff has a base, ceiling, and random jitter
- [ ] Circuit breaker has clear trigger conditions and cooldown period
- [ ] Post-trip output includes root cause analysis and tried approaches
- [ ] Unrecoverable errors stop immediately without pointless retries

## Exercise

Design an error handling strategy for an Agent that calls the GitHub API to create a PR:

1. List at least 5 possible errors.
2. Classify each error and provide a retry strategy.
3. Under what circumstances should a circuit breaker be set?
4. What should the Agent output to the user after the circuit breaker trips?

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Agent retries the same permission error repeatedly | Error classification missing "unrecoverable" category | Add PermissionDenied → 0 retries |
| Circuit breaker too sensitive, triggers on normal fluctuation | Consecutive failure threshold too low | Raise threshold to 5 |
| Circuit breaker too sluggish, wastes many tokens before triggering | Threshold too high or no token monitoring | Lower threshold to 3 or add token rate check |
| Retry after cooldown still fails | Root cause not fixed (e.g., expired API key) | Post-trip output should check whether the root cause can be auto-fixed |

## Next Steps

Retry and circuit breaker handle "single operation failures" — move on to [Multi-Source Feedback](./multi-source-feedback) to understand how to pull signals from multiple channels so the Agent catches errors earlier.
