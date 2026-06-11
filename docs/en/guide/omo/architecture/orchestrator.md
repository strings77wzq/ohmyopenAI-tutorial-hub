# Orchestrator Design

Sisyphus is OMO's main orchestrator, responsible for: decomposing tasks, delegating to sub-agents, collecting results, and verifying completion.

## Core Responsibilities

```
1. Receive user request
2. Assess complexity → Intent classification
3. Task decomposition → Generate subtask list
4. Delegate to specialized agents
5. Collect results → Aggregate
6. Verify completion → Or iterate to fix
```

## Task Decomposition Strategies

| Complexity | Strategy | Example |
|--------|------|------|
| **Simple** | Handle directly | Single file change |
| **Medium** | Sequential execution | A → B → C |
| **Complex** | Parallel + aggregation | A,B,C in parallel → D aggregates |

## Result Verification

Sisyphus doesn't just delegate tasks — it also verifies results:
- **Self-verification**: Agent checks its own result upon completion
- **Cross-verification**: Another agent reviews the result
- **Independent verification**: Use Hephaestus to verify Hephaestus

## Comparison with Single-Agent Systems

| | Single Agent (Claude Code) | Sisyphus (OMO) |
|---|---|---|
| Task handling | Single-threaded | Multi-agent parallel |
| Context | Window exhaustion | Division of labor keeps context lean |
| Verification | Manual checks | Automated verification loops |
| Extensibility | Limited to a single model | Multi-model collaboration |
