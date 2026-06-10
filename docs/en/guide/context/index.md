# Context Engineering

Context Engineering addresses one core question: **within a limited context window, what should the Agent see, ignore, remember, and verify — and how do you prove these choices didn't compromise task quality?**

## Why Context Engineering?

An Agent's context window is both its workspace and its bottleneck. Fill it with noise and the Agent loses focus. Fill it with only the goal and the Agent lacks the knowledge to execute. Context Engineering is the discipline of making these tradeoffs explicit, measurable, and repeatable.

## The Five-Layer Model

| Layer | Content | Maintained By | Refresh |
|-------|---------|---------------|---------|
| **L1 Goal** | User task, acceptance criteria, constraints, invariants | User / OpenSpec | Stable for task duration |
| **L2 Project Knowledge** | Architecture, conventions, tech stack, dependencies | README, AGENTS.md, project memory | Load on demand, cache unchanged parts |
| **L3 Working State** | Current hypotheses, completed steps, failure outputs, tried approaches | Agent / notepad / trace | Updated after every iteration |
| **L4 External Knowledge** | API docs, search results, library source, best practices | MCP resource / retrieval system | Query on demand, cache for task duration |
| **L5 Operational Evidence** | Test results, build logs, screenshots, Lighthouse reports | Harness / toolchain | Updated after every tool call |

Layer priority: **L1 > L2 > L3 > L4 > L5**. When layers conflict, the higher layer wins.

## Module Content

| Chapter | Content |
|---------|---------|
| [Layering Model](/guide/context/layering) | Deep dive into the five-layer architecture, priority rules, and design principles |
| [Injection Strategy](/guide/context/injection-strategy) | Progressive disclosure, pre-injection vs lazy injection, token budget allocation |
| [Compression](/guide/context/compression) | Extractive vs abstractive vs structural compression; when NOT to compress |
| [Practice](/guide/context/practice) | Full worked example: designing a context pack for fixing docs site 404s |

> **Language note**: Detailed sub-pages are currently in [Chinese (简体中文)](/guide/context/). English translations are planned.

## Practice Exercise

Design a context pack for an Agent task "add a new MCP tutorial page":

1. L1 Goal: what goes in the acceptance criteria?
2. L2 Project Knowledge: which files should be cached?
3. L3 Working State: how does it change during the task?
4. What role do L4 and L5 play in this task?

## Next Step

Start with the [Layering Model](/guide/context/layering) (Chinese) to understand how the five-layer architecture works.
