# Workflow Orchestration

A stable agent workflow does not ask a model to solve everything in one pass. It breaks intent, context, tools, and verification into recoverable steps.

## Basic loop

1. Clarify the goal, scope, and acceptance criteria.
2. Read local project context and official docs.
3. Plan small verifiable tasks.
4. Make focused changes that follow project conventions.
5. Verify with builds, tests, link checks, or visual review.
6. Record state, evidence, and remaining risk.

## How the modules connect

| Module | Workflow role |
| --- | --- |
| Skills | Package repeatable operations |
| MCP | Provide tools, resources, and external context |
| OpenSpec | Record requirements, design, and tasks |
| Harness | Validate behavior, failure modes, and regressions |
| Evaluation | Decide whether release criteria are met |

## Orchestration checklist

- Every step has input and output.
- Tool calls have permission boundaries.
- Failures can recover or roll back.
- Critical behavior has Harness or build evidence.
- Final reports include evidence, not only completion claims.

Next: [Retrieval and Knowledge](/en/guide/agent-workflows/retrieval).
