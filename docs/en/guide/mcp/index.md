# MCP Introduction

MCP stands for Model Context Protocol. It solves a practical agent problem: when an agent needs tools, files, databases, search results, or business systems, context should not be assembled through one-off prompt text. Capabilities, data, and safety boundaries should be exposed through a clear protocol.

## What you will learn

- What client, server, tool, resource, and prompt mean in MCP.
- How to design an external capability as a discoverable, callable, testable interface.
- How to validate MCP tool responses and errors with a Harness.
- How to define boundaries for permissions, secrets, and dangerous operations.

## Minimal mental model

| Role | Purpose |
| --- | --- |
| Client | The agent or host app that discovers and calls server capabilities |
| Server | The capability provider exposing tools, resources, and prompts |
| Tool | A callable action with computation or side effects |
| Resource | Readable data such as files, records, or document fragments |
| Prompt | A reusable task instruction or workflow template |

## Design steps

1. Define the task boundary.
2. Define inputs and outputs.
3. Decide permissions.
4. Write Harness scenarios.
5. Document usage, testing, and rollback.

## Practice

Design a `search_docs` MCP tool:

- Input: `query` and optional `limit`.
- Output: matching title, summary, URL, and confidence.
- Acceptance: empty results include a next step; empty query returns a clear error.

Next: [Core Concepts](/en/guide/mcp/concepts).
