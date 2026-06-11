# Agent Classification and Capabilities

OMO provides 11 specialized agents, each with clear responsibilities and recommended model types.

## Agent List

| Agent | Recommended Model Type | Responsibility | Typical Scenario |
|------|-------------|------|---------|
| **Sisyphus** | Reasoning | Main orchestrator | Complex task coordination |
| **Hephaestus** | Execution | Code implementation | Writing code, fixing bugs |
| **Prometheus** | Reasoning | Planner | Interview-style requirement clarification |
| **Atlas** | Balanced | Todo orchestration | Task breakdown and execution |
| **Oracle** | Reasoning | Architecture consultation | Complex decision-making advice |
| **Librarian** | Search | Documentation search | Finding reference materials |
| **Explore** | Search | Code exploration | Rapid code location |
| **Metis** | Reasoning | Planning consultation | Early-stage planning analysis |
| **Momus** | Fast | Plan review | Quality gatekeeping |
| **Visual** | Vision | UI/UX | Frontend development |
| **General** | Balanced | General tasks | Fallback handling |

## Model Selection Principles

**No binding to specific models** — only recommended model characteristics:

| Task Type | Recommended Model Traits |
|----------|-------------|
| Architecture design | Strong reasoning, long context |
| Code execution | Efficient, accurate |
| Quick search | Low latency, low cost |
| Visual design | Strong image understanding |

## Agent Collaboration Patterns

### Serial Mode
```
Sisyphus → Prometheus → Hephaestus → Verification
```

### Parallel Mode
```
Sisyphus → ┬─→ Agent A
           ├─→ Agent B
           └─→ Agent C → Aggregation
```

### Hybrid Mode
```
Sisyphus → Strategic planning → Parallel execution → Verification → Iteration
```
