# Agent Workflow Orchestration

A stable Agent workflow is not "let the model solve everything in one shot." It's about decomposing intent, context, tools, and verification into recoverable steps.

## The Core Loop

1. **Clarify the Goal**: Write down user intent, scope, and acceptance criteria
2. **Read Context**: Prioritize local project files and official documentation
3. **Make a Plan**: Break into verifiable sub-tasks
4. **Execute Changes**: Keep diffs small, follow project conventions
5. **Verify**: Run checks, compare against acceptance criteria
6. **Recover or Complete**: Fix failures or report completion

## Module Content

| Chapter | Content |
|---------|---------|
| [Orchestration Patterns](/guide/agent-workflows/orchestration-patterns) | Sequential chains, fan-out/fan-in, DAGs, state machines. When to use each. Partial failure handling |
| [Error Recovery](/guide/agent-workflows/error-recovery) | Transient vs permanent vs ambiguous errors. Checkpoint & resume. Compensating actions. Dead letter queues |
| [Multi-Agent Coordination](/guide/agent-workflows/multi-agent) | Task decomposition along file boundaries. Shared state vs message passing vs orchestrator. Anti-patterns |
| [Retrieval & Knowledge](/guide/agent-workflows/retrieval) | RAG integration patterns for agent workflows |

> **Language note**: Detailed sub-pages are currently in [Chinese (简体中文)](/guide/agent-workflows/). English translations are planned.

## Orchestration Topology

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Clarify  │────▶│  Execute  │────▶│  Verify  │
│  Goal     │     │  Changes  │     │  Output  │
└──────────┘     └──────────┘     └─────┬────┘
                                        │
                                   ┌────┴────┐
                                   ▼         ▼
                                 PASS      FAIL
                                   │         │
                                   ▼         └──▶ Recover → Execute
                               Complete
```

## Practice

Design a workflow for "add 3 sub-pages to the Context Engineering module":

1. Which steps must be sequential?
2. Which steps can run in parallel?
3. What checkpoints should be saved for recovery?
4. What signals indicate the workflow should stop and ask for human input?

## Next Step

Start with [Orchestration Patterns](/guide/agent-workflows/orchestration-patterns) (Chinese) to understand the four core topologies.
