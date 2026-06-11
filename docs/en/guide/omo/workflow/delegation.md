# Task Delegation

OMO supports three task delegation modes: serial, parallel, and hybrid.

## Delegation Modes

### 1. Serial Mode

Tasks have strict dependencies and must be executed sequentially:

```
A → B → C → Result
```

Use cases: Data flow processing, step-by-step construction

### 2. Parallel Mode

Tasks are independent of each other and can be executed simultaneously:

```
A
B  → Merge results
C
```

Use cases: Multi-file inspection, batch modifications

### 3. Hybrid Mode

Strategic planning + parallel execution + verification:

```
Planning → A,B execute → Verification → (Iteration)
```

Use cases: Complex feature implementation

## Background Execution

Parallel tasks run in the background without blocking the main session:

```typescript
task(subagent_type="explore", run_in_background=true, ...)
// Continue with other work; results are retrieved via background_output
```

## Result Merging

After parallel tasks complete, results are automatically aggregated:
- Successful results are merged directly into context
- Failed results trigger retries or escalation
