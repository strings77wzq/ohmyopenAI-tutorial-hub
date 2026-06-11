# OMO Workflow Module

This module provides a deep dive into the workflows and architecture of Oh-My-OpenAgent (OMO).

## Module Contents

### Architecture Design

- [Orchestrator Design](/guide/omo/architecture/orchestrator) — How the Sisyphus main orchestrator works
- [Agent Classification and Capabilities](/guide/omo/architecture/agents) — Detailed guide to 11 specialized agents
- [Category Routing System](/guide/omo/architecture/category) — Automatic routing to the best model by domain

### Workflow Breakdown

- [Intent Classification](/guide/omo/workflow/intent) — How to distinguish simple queries from complex tasks
- [Task Delegation](/guide/omo/workflow/delegation) — Serial, parallel, and hybrid modes
- [Verification Loop](/guide/omo/workflow/verification) — Self-verification, cross-verification, and independent verification

## Core Concepts

### Orchestration Layer → Agent Layer → Tool Layer

```
User Request
     ↓
[Intent Gate] — Intent classification
     ↓
[Sisyphus] — Main orchestrator
     ├─→ [Prometheus] — Strategic planning
     ├─→ [Hephaestus] — Execution engine
     ├─→ [Atlas] — Todo orchestration
     ├─→ [Oracle] — Architecture consultation
     ├─→ [Librarian] — Documentation search
     └─→ [Explore] — Code exploration
```

### Work Modes

| Mode | Command | Description |
|------|------|------|
| **Ultrawork** | `ulw` | One-click full-speed execution |
| **Prometheus** | Tab key | Interview-style planning |
