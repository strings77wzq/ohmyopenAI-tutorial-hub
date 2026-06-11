# Agent Workflow Orchestration

A stable Agent workflow is not about "letting the model solve everything in one shot" — it's about breaking intent, context, tools, and verification into resumable steps.

## Core Loop

1. **Define the goal**: Write down user intent, scope, and acceptance criteria.
2. **Read context**: Prioritize local project files and official documentation.
3. **Make a plan**: Break work into small, verifiable tasks.
4. **Execute changes**: Keep diffs small; follow project conventions.
5. **Verify results**: Build, test, check links, visual inspection.
6. **Record status**: Update the task checklist and note remaining risks.

## How the Tutorial Modules Connect

| Module | Role in the Workflow |
| --- | --- |
| Skills | Encapsulate repeatable operations |
| MCP | Provide tools, resources, and external context |
| OpenSpec | Record requirements, designs, and tasks |
| Harness | Validate behavior, failure modes, and regressions |
| Evaluation | Decide whether release criteria are met |

## Orchestration Checklist

- Every step has a clear input and output.
- Tool calls have permission boundaries.
- Failures can be recovered or rolled back.
- Key behaviors have Harness or build verification.
- Final reports include evidence — not just "done."

Next: [Retrieval and Knowledge](/guide/agent-workflows/retrieval).
