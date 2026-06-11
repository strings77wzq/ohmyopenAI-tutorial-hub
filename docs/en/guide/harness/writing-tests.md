# Writing Test Scenarios

The core of the Harness is "scenario-driven evaluation": input, expected outcome, and evaluators.

## A Minimal Test Scenario

```json
{
  "name": "Explain recursive function",
  "input": {
    "skill": "explain-code",
    "code": "function fib(n){return n<=1?n:fib(n-1)+fib(n-2)}"
  },
  "expected": {
    "contains": ["recursive", "Fibonacci"],
    "notContains": ["error"]
  },
  "evaluators": ["contains", "no-error"]
}
```

## Scenario Design Principles

1. **Single goal**: Each scenario verifies one core behavior
2. **Reproducible**: Fixed inputs, no implicit dependencies
3. **Interpretable**: Failures can be quickly diagnosed

## Coverage Strategy

- Happy Path
- Boundary inputs
- Error Path

## Suggested Directory Structure

```text
tests/
  scenarios/
    skills/
    openspec/
    harness/
```

## Next Steps

→ [Evaluators Guide](/guide/harness/evaluators)
