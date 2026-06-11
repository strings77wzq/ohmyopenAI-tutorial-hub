---
title: What Is Tool Use
description: Understand the core concepts, evolution, and learning path of Tool Use — the methodology for enabling large language models to call external tools
---

# What Is Tool Use

Large language models (LLMs) can generate fluent text, but they cannot directly read or write files, call APIs, or query databases. Tool Use solves this gap — giving models "hands and legs" to interact with the outside world through structured tool calls.

## What This Module Solves

When building agents, you will encounter scenarios like these:

- The user says "check today's weather for me," but the model cannot fetch real-time data directly.
- The user says "turn the data in this CSV into a chart," but the model cannot execute Python scripts.
- The user says "create an issue on Jira for me," but the model cannot call REST APIs.

**Tool Use** teaches the model to:
1. Identify which tool is needed to fulfill the user's intent.
2. Call the tool with the correct parameters.
3. Parse the tool's response and generate a reply.

## Core Concepts

The Tool Use workflow consists of four key stages:

### 1. Tool Discovery

Before the conversation begins, the system tells the model "here are the tools you have available." Each tool includes a name, description, and parameter definitions. The model uses this information to decide when to invoke a tool.

```
Available tools:
- search_web: Search the internet for information
  Parameters: query (string, required), max_results (integer, optional)
- read_file: Read a local file
  Parameters: path (string, required)
```

### 2. Tool Calling

The model generates a structured call request based on user intent, instead of answering directly.

```json
{
  "tool": "search_web",
  "parameters": {
    "query": "2024 AI Agent development trends",
    "max_results": 5
  }
}
```

### 3. Result Parsing

After the tool executes and returns results, the model needs to understand the results and incorporate them into its reply.

```json
{
  "status": "success",
  "results": [
    {"title": "AI Agent 2024 Trends Report", "snippet": "..."},
    {"title": "Agent Framework Comparison Analysis", "snippet": "..."}
  ]
}
```

### 4. Multi-step Tool Chains

Complex tasks usually require multiple tool calls. The model decides after each step whether to continue calling more tools.

```
User: "Analyze the code quality of src/main.py"

Step 1 → read_file(path: "src/main.py")     # Read the file
Step 2 → analyze_code(content: "...")         # Analyze the code
Step 3 → search_best_practices(topic: "...")  # Look up best practices
Step 4 → Synthesize results, generate report   # Final reply
```

## Evolution of Tool Use

| Stage | Approach | Characteristics |
| --- | --- | --- |
| Early days | Prompt stitching | Manually injecting tool results into prompts; error-prone |
| Function Calling | Structured calls by OpenAI | Standardized tool definitions and call formats |
| MCP | Model Context Protocol | Cross-model, cross-platform tool discovery protocol |
| Agent frameworks | Autonomous orchestration | Model decides call order, retry strategy, and error recovery on its own |

Key turning point: from "humans telling the model what to call" to "the model deciding what to call on its own."

## Learning Path

```
Tool Definition & Description ──→ Tool Selection & Orchestration ──→ Error Handling & Retry
       │                                                              │
       ▼                                                              ▼
  Security Boundaries & Access Control  ←──────────────  Practice: Building a Tool Set
```

| Page | Content | Who It's For |
| --- | --- | --- |
| [Tool Definition & Description](/guide/tool-use/tool-definition) | How to write good JSON Schema for tools | Everyone |
| [Tool Selection & Orchestration](/guide/tool-use/orchestration) | Single-step, multi-step, and parallel call strategies | Developers building agents |
| [Error Handling & Retry](/guide/tool-use/error-handling) | Failure recovery and graceful degradation | Teams needing production-grade reliability |
| [Practice: Building a Tool Set](/guide/tool-use/practice) | Build a complete tool set from scratch | Hands-on learners |
| [Security Boundaries & Access Control](/guide/tool-use/safety) | Sandboxing, permissions, and audit logging | Teams deploying to production |

## Exercises

Think through the following scenarios and determine how many tool calls each requires:

1. The user asks: "Is the weather suitable for outdoor exercise in Beijing today?"
2. The user says: "Find all TODO markers in this project and sort them by priority."
3. The user says: "Write me a Python script that reads data.csv and creates a bar chart."

<details>
<summary>Reference Answers</summary>

1. At least 2 steps: check weather → synthesize judgment. Possibly 3 steps: check weather + check exercise recommendations.
2. At least 2 steps: search for TODOs → sort and organize.
3. At least 2 steps: read file → generate code. Possibly 3 steps: read + analyze data structure + generate script.

</details>

## Next Steps

→ [Tool Definition & Description](/guide/tool-use/tool-definition)
