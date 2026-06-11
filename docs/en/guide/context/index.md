# Context Engineering

Context engineering focuses on a core question: within a finite context window, what should an Agent see, ignore, and remember — and how do we verify these choices don't compromise task quality?

## Context Layering

| Layer | Contents | Maintenance |
| --- | --- | --- |
| Goal | User task, acceptance criteria, constraints | OpenSpec or task list |
| Project Knowledge | Architecture, conventions, runtime | README, AGENTS, project memory |
| Working State | Current assumptions, completed steps, failed outputs | notepad, trace, task list |
| External Knowledge | Docs, APIs, search results | MCP resource or retrieval system |
| Operational Evidence | Tests, builds, logs, screenshots | Harness and verification reports |

## Design Principles

- Information closer to the task goal gets higher priority.
- Large blocks of context should be summarized before injection.
- Never pass secrets, personal data, or irrelevant logs to the model.
- Conclusions from each tool call must be traceable back to the task state.
- Critical assumptions must be backed by tests, documentation, or sources.

## Exercise

Design a context package for an Agent task to "fix 404s on the docs site":

1. What files must be included?
2. Which logs only need a summary?
3. Which external information needs to be re-verified?
4. What content should not enter the context?

Next, read [Workflow Orchestration](/guide/agent-workflows/).
