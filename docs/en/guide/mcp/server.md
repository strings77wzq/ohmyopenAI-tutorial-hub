# Build an MCP Server

This chapter walks through building a complete documentation search server from scratch. The code uses the TypeScript SDK, but the design approach applies to any language's SDK.

## Project Initialization

```bash
mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node
npx tsc --init --outDir dist --rootDir src --module nodenext --moduleResolution nodenext
```

Directory structure:

```
my-mcp-server/
├── src/
│   ├── index.ts          Entry: initialize and start server
│   ├── tools.ts          Tool definitions
│   ├── resources.ts      Resource definitions
│   └── prompts.ts        Prompt definitions
├── package.json
└── tsconfig.json
```

## Step 1: Create the Server Instance

```typescript
// src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
  name: 'docs-server',
  version: '1.0.0'
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

`McpServer` is a high-level wrapper that handles protocol handshake, capability negotiation, and message routing. You just register tools, resources, and prompts — the SDK handles the rest.

### Transport Selection

| Transport | Use Case | Advantage |
| --- | --- | --- |
| stdio | Local tools, CLI integration | Simple, low latency, process isolation |
| Streamable HTTP | Remote deployment, multi-client | Cross-network, scalable, supports auth |

Use stdio for local development, HTTP for production. Switching transport requires changing only two lines of code.

## Step 2: Define Tools

Tools are the server's core capabilities. Use Zod to define input schemas; the SDK automatically converts them to JSON Schema for the client.

```typescript
// src/tools.ts
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const SearchSchema = {
  query: z.string().min(1).max(200).describe('Search keywords'),
  limit: z.number().min(1).max(50).default(5).describe('Maximum number of results')
};

export function registerTools(server: McpServer) {
  // Tool 1: Search documents
  server.tool(
    'search_docs',
    'Search documentation pages by keyword, returns matching results',
    SearchSchema,
    async ({ query, limit }) => {
      const results = await searchDocuments(query, limit);

      if (results.length === 0) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              results: [],
              suggestion: `No docs found for "${query}". Try broader keywords.`
            })
          }]
        };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            results: results.map(r => ({
              title: r.title,
              url: r.url,
              summary: r.summary,
              score: r.score
            })),
            total: results.length
          })
        }]
      };
    }
  );

  // Tool 2: Get document details
  server.tool(
    'get_doc',
    'Get the full content of a specific document',
    { path: z.string().describe('Document path, e.g. /guide/mcp/index') },
    async ({ path }) => {
      const doc = await readDocument(path);

      if (!doc) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'not_found',
              message: `Document "${path}" not found`
            })
          }],
          isError: true
        };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            title: doc.title,
            content: doc.content,
            lastModified: doc.lastModified
          })
        }]
      };
    }
  );
}
```

### Key Design Patterns

**Pattern 1: Structured Error Returns**

```typescript
// ❌ Bad: plain text error
return { content: [{ type: 'text', text: 'Error: not found' }], isError: true };

// ✅ Good: structured error the agent can parse and act on
return {
  content: [{
    type: 'text',
    text: JSON.stringify({
      error: 'not_found',
      message: `Document "${path}" not found`,
      suggestion: 'Use search_docs to find available documents'
    })
  }],
  isError: true
};
```

**Pattern 2: Empty Result Guidance**

```typescript
if (results.length === 0) {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        results: [],
        suggestion: 'No matching results. Try different keywords.'
      })
    }]
  };
}
```

**Pattern 3: Input Bounding**

```typescript
// Zod handles parameter validation automatically
const limit = z.number().min(1).max(50).default(5);

// Business layer adds defensive check
const actualLimit = Math.min(limit, 50);
```

## Step 3: Define Resources

Resources provide read-only data. Use URI pattern matching to support static and dynamic resources.

```typescript
// src/resources.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerResources(server: McpServer) {
  // Static resource: document list
  server.resource(
    'doc_list',
    'docs://list',
    async (uri) => {
      const docs = await listDocuments();
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(docs.map(d => ({
            path: d.path,
            title: d.title,
            lastModified: d.lastModified
          })))
        }]
      };
    }
  );

  // Dynamic resource: single document
  server.resource(
    'doc',
    'doc://{path+}',
    async (uri, { path }) => {
      const content = await readDocument(path);

      if (!content) {
        throw new Error(`Document not found: ${path}`);
      }

      return {
        contents: [{
          uri: uri.href,
          mimeType: 'text/markdown',
          text: content.content
        }]
      };
    }
  );
}
```

### URI Design Principles

```
✅ Self-descriptive: doc://readme          → document "readme"
✅ Clear hierarchy: doc://guide/mcp/index  → document hierarchy path
✅ Explicit type:   db://users/123         → user record 123

❌ Ambiguous:  data://1               → what is data 1?
❌ No scheme:  readme.md               → no scheme
```

## Step 4: Define Prompts

Prompts package workflow templates so agents don't have to think from scratch.

```typescript
// src/prompts.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerPrompts(server: McpServer) {
  server.prompt(
    'review_doc',
    'Perform structured review of a document',
    {
      path: z.string().describe('Document path'),
      focus: z.enum(['accuracy', 'completeness', 'clarity'])
        .default('clarity').describe('Review focus area')
    },
    ({ path, focus }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Please review document "${path}" for ${focus === 'accuracy' ? 'accuracy' :
              focus === 'completeness' ? 'completeness' : 'clarity'}.
After review, list:
1. Issues found (sorted by severity)
2. Specific location and fix suggestion for each issue
3. Overall score (1-10)`
          }
        },
        {
          role: 'user',
          content: {
            type: 'resource',
            resource: { uri: `doc://${path}`, mimeType: 'text/markdown' }
          }
        }
      ]
    })
  );
}
```

## Step 5: Assemble and Launch

```typescript
// src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools.js';
import { registerResources } from './resources.js';
import { registerPrompts } from './prompts.js';

const server = new McpServer({
  name: 'docs-server',
  version: '1.0.0'
});

registerTools(server);
registerResources(server);
registerPrompts(server);

const transport = new StdioServerTransport();
await server.connect(transport);

console.error('Docs MCP Server started');
```

## Step 6: Test

### Manual Testing

```bash
# Start the server
node dist/index.js

# Send JSON-RPC messages via stdin
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | node dist/index.js
```

### Automated Testing

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

describe('docs-server', () => {
  let client: Client;
  let server: McpServer;

  beforeEach(async () => {
    server = new McpServer({ name: 'test', version: '1.0.0' });
    registerTools(server);
    registerResources(server);
    registerPrompts(server);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    client = new Client({ name: 'test', version: '1.0.0' });

    await server.connect(serverTransport);
    await client.connect(clientTransport);
  });

  it('should search documents', async () => {
    const result = await client.callTool({
      name: 'search_docs',
      arguments: { query: 'MCP' }
    });

    expect(result.content[0].text).toContain('results');
  });

  it('should handle empty query', async () => {
    const result = await client.callTool({
      name: 'search_docs',
      arguments: { query: '' }
    });

    expect(result.isError).toBe(true);
  });

  it('should return not found for invalid path', async () => {
    const result = await client.callTool({
      name: 'get_doc',
      arguments: { path: '/nonexistent' }
    });

    expect(result.isError).toBe(true);
  });
});
```

### Verification Checklist

| Check | Status |
| --- | --- |
| Tool names are stable and meaningful | □ |
| Every tool has input/output schema | □ |
| Errors are structured and parseable by agent | □ |
| Empty results include guidance | □ |
| Resource URIs are well-designed | □ |
| Prompts return complete message sequences | □ |
| Tests cover success and failure paths | □ |
| Logs never contain secrets or sensitive data | □ |

## Next

Continue to [MCP Practice Exercise](/en/guide/mcp/practice) — complete a hands-on project.
