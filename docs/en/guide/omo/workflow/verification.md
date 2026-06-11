# Verification Loop

The verification loop ensures the quality of agent output and is a core practice in Harness engineering.

## Three-Layer Verification

### 1. Self-Verification

The agent checks its own result upon completion:

```typescript
// After agent execution completes
const result = await agent.execute(task);
// Self-check
if (!validate(result)) {
  await agent.fix();
}
```

### 2. Cross-Verification

Another agent reviews the result:

```typescript
// Have Oracle verify Hephaestus's code
@oracle Review the architectural soundness of this design
```

### 3. Independent Verification

Use an independent verification loop to ensure determinism:

```
Hephaestus writes code → Hephaestus verifies code
// But different instances, reducing correlation
```

## What to Verify?

| Dimension | Check Items |
|------|--------|
| **Functionality** | Output meets requirements |
| **Syntax** | Code is error-free |
| **Conventions** | Complies with AGENTS.md |
| **Tests** | Acceptance tests pass |

## Failure Handling

Strategies when verification fails:
1. Automatic retry (limited attempts)
2. Fall back to human review
3. Log the issue for follow-up
