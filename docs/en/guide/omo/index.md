# OMO Workflow

Oh-My-OpenAgent (OMO) is a multi-model orchestration system. This module covers its architecture and workflow design.

## Module Content

### Architecture

- Orchestrator — Sisyphus, the main orchestrator
- Agent Categories — 11 specialized agents
- Category Routing — Domain-based routing to the best model

### Workflow

- Intent Classification — Distinguishing simple queries from complex tasks
- Task Delegation — Serial, parallel, and hybrid patterns
- Verification Loop — Self-verification, cross-verification, independent verification

> **Language note**: Detailed OMO sub-pages are currently available in [Chinese (简体中文)](/guide/omo/). English translations are planned — track progress in [TODOS.md](https://github.com/strings77wzq/agent-engineering-hub/blob/main/TODOS.md).

## Core Concepts

### Orchestration Layer → Agent Layer → Tool Layer

```
User Request
     ↓
[Intent Gate] — classify intent
     ↓
[Sisyphus] — main orchestrator
     ├─→ [Prometheus] — strategic planning
     ├─→ [Hephaestus] — execution engine
     ├─→ [Atlas] — todo orchestration
     ├─→ [Oracle] — architecture consulting
     ├─→ [Librarian] — documentation search
     └─→ [Explore] — code exploration
```

### Work Modes

| Mode | Command | Description |
|------|---------|-------------|
| **Ultrawork** | `ulw` | Full-force autonomous execution |
| **Prometheus** | Tab key | Interview-style planning |

## Next Step

Read about [golem Case Study](/guide/golem-case/) for a real production Agent system, or see the [full OMO docs in Chinese](/guide/omo/).
