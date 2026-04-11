# Context Engineering

Context engineering answers one question: within a limited context window, what should the agent see, ignore, remember, and verify?

## Context layers

| Layer | Content | Maintained by |
| --- | --- | --- |
| Goal | User task, acceptance criteria, constraints | OpenSpec or task list |
| Project knowledge | Architecture, conventions, run commands | README, AGENTS, project memory |
| Working state | Assumptions, completed steps, failures | Notes, traces, task list |
| External knowledge | Docs, APIs, search results | MCP resource or retrieval |
| Evidence | Tests, builds, logs, screenshots | Harness and verification report |

## Principles

- Information closer to the task has higher priority.
- Summarize large context before injecting it.
- Keep secrets and irrelevant logs out of model context.
- Tool results should update working state.
- Important assumptions need sources, tests, or documentation.

## Practice

Design a context pack for an agent fixing documentation 404s:

1. Which files are mandatory?
2. Which logs only need summaries?
3. Which external facts need current verification?
4. What should never enter context?

Next: [Workflow Orchestration](/en/guide/agent-workflows/).
