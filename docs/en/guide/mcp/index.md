# MCP Introduction

## The Problem: How Agents Connect to the Outside World

An agent that can only read and write its own context window is severely limited. It cannot query databases, call APIs, read local files, or perform searches. The traditional approach is to hard-code these capabilities into prompts — pasting database query results into the system prompt, manually stuffing file contents into the conversation. This works for demos but has critical flaws:

1. **Not discoverable**: The agent doesn't know what capabilities are available; a human must tell it each time.
2. **Not testable**: Capabilities are scattered across prompt assembly logic with no unified input/output contract.
3. **Not governable**: Permissions, secrets, and dangerous operations have no unified boundary — it's all developer discipline.
4. **Not reusable**: Capability logic written for Project A must be rewritten for Project B.

MCP (Model Context Protocol) is an open standard protocol designed to solve these problems.

## What Is MCP

MCP is an open standard protocol that defines how agents (clients) and capability providers (servers) communicate. Its core idea:

> Expose external capabilities the agent needs through standardized interfaces, so the agent can discover them, call them, and handle errors autonomously.

Think of MCP as the USB protocol for the agent world — regardless of what the device is, plugging in USB enables communication. Regardless of what the capability is, implementing the MCP protocol makes it available to any agent.

## Core Architecture

MCP uses a client-server architecture:

```
┌─────────────┐         ┌─────────────┐
│   Client     │◄───────►│   Server     │
│  (Agent)     │ Transport│  (Provider)  │
└─────────────┘         └─────────────┘
      │                       │
      ▼                       ▼
  Host App              External Systems
```

### Role Definitions

| Role | Responsibility | Example |
| --- | --- | --- |
| **Client** | Discovers and calls server capabilities | Agent runtime, IDE plugin, chat app |
| **Server** | Exposes tools, resources, and prompts | File system service, database service, API gateway |
| **Host** | Manages the client application | Desktop app, web platform, CLI tool |

A host can contain multiple clients, each connected to a server. A server can also serve multiple clients simultaneously.

### Transport Layers

MCP is transport-agnostic. Two main transport methods are supported:

**stdio (Standard Input/Output)**: Client and server communicate via stdin/stdout on the same machine. Ideal for local tool integration — an IDE plugin calling a local analysis tool.

```
Agent process ──stdin──► MCP Server process
Agent process ◄──stdout── MCP Server process
```

**Streamable HTTP**: Client and server communicate over HTTP, with the server pushing streaming data via Server-Sent Events (SSE). Ideal for remote deployment and multi-client shared scenarios.

```
Agent ──HTTP POST──► MCP Server (remote)
Agent ◄──SSE Stream── MCP Server (remote)
```

### Capability Negotiation

After connection, client and server exchange capability declarations. This is a bilateral handshake:

- Client tells the server: "I can receive sampling requests, I can handle resource change notifications"
- Server tells the client: "I provide 3 tools, 2 resources, 1 prompt"

Only capabilities both sides declare support for are enabled. This means a server can safely expose capabilities without worrying about clients not supporting a feature.

## Three Core Concepts

MCP defines three main capability types:

### Tool

A tool is an executable action. The agent calls tools to perform computation, queries, writes, and more.

```json
{
  "name": "search_docs",
  "description": "Search documents by keyword",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" },
      "limit": { "type": "number", "default": 5 }
    },
    "required": ["query"]
  }
}
```

Key characteristics of tools:
- **Have side effects**: Calling a tool may change external state (write to a database, send a message, call an API).
- **Agent-initiated**: The agent decides when to call which tool based on task needs.
- **Require permission control**: Dangerous operations must have confirmation mechanisms.

### Resource

A resource is readable data. The agent uses resources to obtain context information.

```
uri: file:///docs/readme.md
name: README file
mimeType: text/markdown
```

Key characteristics of resources:
- **Read-only**: Reading a resource should not produce side effects.
- **URI-identified**: Located via Uniform Resource Identifiers.
- **Subscribable**: Support real-time change notifications.

### Prompt

A prompt is a reusable task template that encapsulates how to use tools and resources to complete specific tasks.

```json
{
  "name": "review_code",
  "description": "Code review template",
  "arguments": [
    { "name": "language", "description": "Programming language", "required": true },
    { "name": "focus", "description": "Review focus area", "required": false }
  ]
}
```

## A Complete Example

Suppose you want to build an MCP server for a documentation site, letting agents search and read docs:

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
  name: 'docs-server',
  version: '1.0.0'
});

// Register a tool: search documents
server.tool(
  'search_docs',
  'Search documentation pages by keyword',
  { query: { type: 'string' }, limit: { type: 'number', default: 5 } },
  async ({ query, limit }) => {
    const results = await searchDocuments(query, limit);
    return {
      content: [{ type: 'text', text: JSON.stringify(results) }]
    };
  }
);

// Register a resource: read document content
server.resource(
  'doc',
  'doc://{path}',
  async (uri, { path }) => {
    const content = await readDocument(path);
    return {
      contents: [{ uri: uri.href, mimeType: 'text/markdown', text: content }]
    };
  }
);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
```

This code does one thing: exposes document search and reading capabilities through the MCP protocol. Any MCP-compatible agent can automatically discover and call these capabilities.

## Where MCP Fits in the Agent Ecosystem

```
User Request
  │
  ▼
┌──────────────────────────────┐
│        Agent Runtime         │
│  ┌────────────────────────┐  │
│  │   Reasoning Engine     │  │
│  └───────────┬────────────┘  │
│              │               │
│  ┌───────────▼────────────┐  │
│  │   MCP Client Layer     │  │
│  └───┬───────┬───────┬────┘  │
│      │       │       │       │
└──────┼───────┼───────┼───────┘
       │       │       │
  ┌────▼──┐ ┌──▼───┐ ┌─▼────┐
  │  File │ │  DB  │ │ API  │
  │Server │ │Server│ │Server│
  └───────┘ └──────┘ └──────┘
```

The agent doesn't interact with external systems directly. Instead, it discovers and calls MCP servers through the MCP client. Benefits:

- **Decoupled**: The agent doesn't need to know external system specifics — only the MCP interface.
- **Secure**: Permission control is enforced on the server side; the agent cannot bypass it.
- **Composable**: Multiple servers work simultaneously; the agent freely combines capabilities.
- **Testable**: Each server's interface has a clear input/output contract.

## Five Steps to Design MCP Capabilities

1. **Define boundaries**: What problem does this capability solve, and what does it not?
2. **Design the interface**: Input fields, output structure, error types — write as JSON Schema.
3. **Decide permissions**: Reads, writes, network access, command execution — what's allowed, what needs confirmation.
4. **Write tests**: Cover success, failure, empty data, permission denial, and timeout.
5. **Write documentation**: When to use, how to test, how to roll back.

## Practice

Design a `search_docs` MCP tool:

- Input: `query` (required) and `limit` (optional, default 5).
- Output: Array with matching title, summary, URL, and confidence score.
- Acceptance: Empty results include a suggestion; empty query returns a clear error; result count never exceeds the limit.

## Resources

- [MCP Official Documentation](https://modelcontextprotocol.io/) — Protocol spec and SDKs
- [Awesome MCP Servers](https://github.com/topics/model-context-protocol) — Community MCP server collection
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) — Official TypeScript SDK

Next: [Core Concepts](/en/guide/mcp/concepts) — deep dive into tools, resources, and prompts.
