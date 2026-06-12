# MCP Core Concepts

## Concept Overview

MCP defines five core primitives. Understanding the design intent and use case for each is the foundation of building high-quality MCP servers.

```
MCP Primitives
├── Tool      Executable action (has side effects)
├── Resource  Readable data (no side effects)
├── Prompt    Reusable task template
├── Root      Filesystem boundary declaration
└── Sampling  Server requests model inference from Client
```

## Tool: Executable Actions

Tools are the most frequently called primitive. They represent operations with side effects — calling them may change external state.

### Tool Definition Structure

```json
{
  "name": "create_ticket",
  "description": "Create a ticket, returns the ticket ID",
  "inputSchema": {
    "type": "object",
    "properties": {
      "title": { "type": "string", "description": "Ticket title" },
      "priority": {
        "type": "string",
        "enum": ["low", "medium", "high"],
        "default": "medium"
      },
      "description": { "type": "string", "description": "Detailed description" }
    },
    "required": ["title"]
  }
}
```

### Design Guidelines

**Naming consistency**: Use `snake_case` starting with a verb that clearly describes the action.

| Good Names | Bad Names |
| --- | --- |
| `search_docs` | `docs` |
| `create_ticket` | `ticket_create_v2` |
| `send_email` | `email` |
| `get_user_info` | `doStuff` |

**Input Schema**: Define each parameter's type, constraints, and defaults using JSON Schema. The agent's LLM uses the schema to decide how to fill parameters, so schema description quality directly affects call accuracy.

```json
{
  "query": {
    "type": "string",
    "description": "Search keywords, supports boolean operators AND/OR",
    "minLength": 1,
    "maxLength": 200
  }
}
```

**Side-effect declaration**: The tool's description should explicitly state whether side effects exist and their scope.

```
✅ "Delete the specified ticket (irreversible)"
❌ "Delete ticket"
✅ "Send Slack message to #alerts channel"
❌ "Send message"
```

**Error handling**: Tool errors should be structured so the agent can understand and decide next steps.

```typescript
// Good error return
return {
  content: [{
    type: 'text',
    text: JSON.stringify({
      error: 'permission_denied',
      message: 'Cannot delete tickets created by other users',
      suggestion: 'Please contact the ticket creator or an admin'
    })
  }],
  isError: true
};

// Bad error return
return {
  content: [{ type: 'text', text: 'Error: access denied' }],
  isError: true
};
```

### Streaming Responses

For long-running operations (report generation, batch processing), tools support streaming intermediate results:

```typescript
server.tool(
  'generate_report',
  'Generate a data analysis report',
  { dataset: { type: 'string' } },
  async ({ dataset }, extra) => {
    extra.sendProgress({ percent: 30, message: 'Loading data...' });

    const data = await loadData(dataset);
    extra.sendProgress({ percent: 60, message: 'Analyzing...' });

    const report = await analyze(data);
    extra.sendProgress({ percent: 100, message: 'Done' });

    return {
      content: [{ type: 'text', text: report }]
    };
  }
);
```

## Resource: Readable Data

Resources represent context data the agent can read. Unlike tools, reading a resource should not produce side effects.

### URI Addressing

Each resource is uniquely identified by a URI:

```
file:///docs/guide/mcp/index.md        File resource
db://users/123                          Database record
postgres://mydb/public/users?limit=10   Query results
```

The URI scheme determines the resource type and access method. Custom schemes need a description explaining their semantics.

### Static vs Dynamic Resources

**Static resources**: Known at compile or startup time; the agent can request them directly.

```typescript
server.resource(
  'readme',
  'file:///README.md',
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: 'text/markdown',
      text: await fs.readFile('README.md', 'utf-8')
    }]
  })
);
```

**Dynamic resources**: Matched at runtime by URI pattern; suitable for large or unpredictable sets of resources.

```typescript
server.resource(
  'doc',
  'doc://{path+}',
  async (uri, { path }) => {
    const content = await readDoc(path);
    return {
      contents: [{
        uri: uri.href,
        mimeType: 'text/markdown',
        text: content
      }]
    };
  }
);
```

### Subscription Mechanism

Resources support change subscriptions. When underlying data changes, the server notifies the client to re-fetch:

```
Client ──subscribe──► Server
Client ◄──notification── Server (resource updated)
Client ──read──► Server (fetch latest content)
```

Use cases:
- File monitoring: Editor file modified externally
- Database changes: Business data updated
- Config hot-reload: Runtime configuration changes

### Design Principles

| Principle | Description |
| --- | --- |
| Idempotent | Multiple reads of the same resource return identical content (ignoring time-based changes) |
| Size limits | Single resource content should not exceed a reasonable fraction of the context window |
| Freshness marking | Indicate when data was last updated so the agent knows if information is stale |
| Error transparency | File not found, insufficient permissions — errors must be explicitly returned |

## Prompt: Task Templates

Prompts are reusable templates that encapsulate "how to accomplish a class of tasks." They're not just system prompts — they contain parameterized inputs, multi-step workflows, and tool combination strategies.

### Prompt Definition

```json
{
  "name": "code_review",
  "description": "Perform structured review of code changes",
  "arguments": [
    {
      "name": "language",
      "description": "Programming language",
      "required": true
    },
    {
      "name": "focus",
      "description": "Review focus: security / performance / readability",
      "required": false,
      "default": "readability"
    }
  ]
}
```

### Prompt Return Structure

When called, a prompt returns a sequence of messages the agent can use directly:

```typescript
server.prompt(
  'code_review',
  'Perform structured review of code changes',
  {
    language: { type: 'string', description: 'Programming language' },
    focus: { type: 'string', description: 'Review focus', required: false }
  },
  ({ language, focus }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Please review the following ${language} code changes for ${focus || 'readability'}.`
        }
      },
      {
        role: 'user',
        content: {
          type: 'resource',
          resource: { uri: 'git://diff/current', mimeType: 'text/plain' }
        }
      }
    ]
  })
);
```

### Prompt vs Tool

| Dimension | Prompt | Tool |
| --- | --- | --- |
| Purpose | Encapsulate workflow templates | Execute specific actions |
| Returns | Message sequence (guides agent behavior) | Data results |
| Side effects | None | Possibly |
| Caller | User selects to use | Agent calls autonomously |

### Use Cases

- **Code review**: Provide review templates and checklists
- **Data analysis**: Define analysis steps and output formats
- **Documentation generation**: Template-driven writing workflows
- **Debugging flows**: Systematic troubleshooting steps

## Root: Filesystem Boundary

Roots declare the filesystem scope a server can access. This is a key part of the security model.

```typescript
server.setRoots([
  {
    uri: 'file:///home/user/myproject',
    name: 'Project root'
  }
]);
```

Clients can also dynamically update roots:

```
Client ──roots/updated──► Server
Server re-evaluates accessible scope
```

## Sampling: Reverse Model Invocation

Sampling allows the server to request model inference from the client. This is a controlled reverse call — the server doesn't call the LLM directly but requests it indirectly through the client.

```
Server ──sampling/createMessage──► Client
Client ──calls local LLM──►
Client ◄──model output── LLM
Client ──sampling result──► Server
```

Use cases:
- Server needs LLM assistance for part of a task (classification, summarization, judgment)
- Server doesn't directly access model APIs, maintaining security boundaries

Security constraints:
- Client may refuse any sampling request
- Sampling requests require user confirmation
- Server cannot ask the client to bypass security policies

## Composition Patterns

In practice, these primitives are usually combined:

```
User request: "Help me review this PR"
  │
  ├─► Prompt: code_review (returns review template)
  │     └─► Resource: git://diff/current (get code changes)
  │     └─► Resource: git://file/{path} (get full file)
  │
  ├─► Tool: comment_on_pr (add review comment)
  │
  └─► Tool: approve_pr (approve the PR)
```

This composition pattern lets agents flexibly call different primitives based on task needs, instead of cramming all logic into one giant tool.

## Next

Continue to [Build an MCP Server](/en/guide/mcp/server) — turn these concepts into runnable code.
