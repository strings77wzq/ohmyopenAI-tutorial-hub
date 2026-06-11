# OMO Architecture Overview

Oh-My-OpenAgent (OMO) is a multi-model agent orchestration system. Its core philosophy: **humans steer, agents execute**.

## Three-Layer Architecture

```
┌─────────────────────────────────────────┐
│           Orchestration Layer            │
│    Sisyphus — Intelligent task           │
│    decomposition and delegation          │
├─────────────────────────────────────────┤
│             Agent Layer                  │
│  Specialized agent pool: execution,      │
│  planning, exploration, consultation     │
├─────────────────────────────────────────┤
│             Tool Layer                   │
│   MCP Servers / Skills / External        │
│   tool integrations                      │
└─────────────────────────────────────────┘
```

## Core Components

| Component | Responsibility | Key Concept |
|------|------|--------|
| **Intent Gate** | Intent classification | Simple vs. complex |
| **Sisyphus** | Main orchestrator | Task decomposition |
| **Category** | Domain routing | Frontend/backend/visual |
| **Skills** | Capability encapsulation | Reusable |

## Model Agnosticism

OMO does not bind to any specific model. Core principles:
- **Reasoning tasks** → Use stronger reasoning models
- **Execution tasks** → Use efficient execution models
- **Cost-sensitive** → Use lightweight models

This is fundamentally different from a single agent (e.g., pure Claude Code):
- Single agent: One person does everything → Context window exhausted
- OMO: Team collaboration → Clear division of labor → Parallel execution
