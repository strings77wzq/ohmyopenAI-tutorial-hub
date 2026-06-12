# MCP Practice Exercise

This chapter walks through a complete hands-on project, integrating tools, resources, and prompts learned previously into a runnable MCP server.

## Exercise Goal

Build a "Knowledge Base Management" MCP server with these capabilities:

- Search knowledge entries
- Read entry details
- Create new entries
- Delete entries
- Structured quality review of entries

## Part 1: Project Structure

```bash
mkdir knowledge-base-mcp && cd knowledge-base-mcp
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node vitest
npx tsc --init --outDir dist --rootDir src --module nodenext --moduleResolution nodenext
```

```
knowledge-base-mcp/
├── src/
│   ├── index.ts        Entry point
│   ├── tools.ts        4 tools
│   ├── resources.ts    2 resources
│   ├── prompts.ts      1 prompt
│   └── store.ts        In-memory data store
├── test/
│   └── server.test.ts  Test cases
├── package.json
└── tsconfig.json
```

## Part 2: Data Store Layer

Implement a simple in-memory store for easy testing:

```typescript
// src/store.ts
export interface Entry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

class KnowledgeStore {
  private entries: Map<string, Entry> = new Map();
  private nextId = 1;

  search(query: string, limit = 10): Entry[] {
    const q = query.toLowerCase();
    return Array.from(this.entries.values())
      .filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q))
      )
      .slice(0, limit);
  }

  get(id: string): Entry | undefined {
    return this.entries.get(id);
  }

  list(): Entry[] {
    return Array.from(this.entries.values());
  }

  create(data: { title: string; content: string; tags: string[] }): Entry {
    const id = String(this.nextId++);
    const now = new Date().toISOString();
    const entry: Entry = {
      id, ...data, createdAt: now, updatedAt: now
    };
    this.entries.set(id, entry);
    return entry;
  }

  delete(id: string): boolean {
    return this.entries.delete(id);
  }
}

export const store = new KnowledgeStore();
```

## Part 3: Implement Tools

```typescript
// src/tools.ts
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { store } from './store.js';

export function registerTools(server: McpServer) {
  // Tool 1: Search knowledge entries
  server.tool(
    'search_entries',
    'Search entries by title, content, or tags',
    {
      query: z.string().min(1).describe('Search keywords'),
      limit: z.number().min(1).max(50).default(10).describe('Maximum results')
    },
    async ({ query, limit }) => {
      const results = store.search(query, limit);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            results: results.map(e => ({
              id: e.id,
              title: e.title,
              tags: e.tags,
              excerpt: e.content.slice(0, 100) + (e.content.length > 100 ? '...' : '')
            })),
            total: results.length,
            suggestion: results.length === 0
              ? `No entries found for "${query}". Try different keywords or create a new entry.`
              : undefined
          })
        }]
      };
    }
  );

  // Tool 2: Get entry details
  server.tool(
    'get_entry',
    'Get the full content of a specific knowledge entry',
    {
      id: z.string().describe('Entry ID')
    },
    async ({ id }) => {
      const entry = store.get(id);

      if (!entry) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'not_found',
              message: `Entry ${id} not found`,
              suggestion: 'Use search_entries to see available entries'
            })
          }],
          isError: true
        };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            id: entry.id,
            title: entry.title,
            content: entry.content,
            tags: entry.tags,
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt
          })
        }]
      };
    }
  );

  // Tool 3: Create new entry
  server.tool(
    'create_entry',
    'Create a new knowledge entry',
    {
      title: z.string().min(1).max(200).describe('Entry title'),
      content: z.string().min(1).describe('Entry content'),
      tags: z.array(z.string()).default([]).describe('Tag list')
    },
    async ({ title, content, tags }) => {
      const entry = store.create({ title, content, tags });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            id: entry.id,
            title: entry.title,
            message: 'Entry created successfully'
          })
        }]
      };
    }
  );

  // Tool 4: Delete entry
  server.tool(
    'delete_entry',
    'Delete a knowledge entry (irreversible)',
    {
      id: z.string().describe('Entry ID to delete')
    },
    async ({ id }) => {
      const entry = store.get(id);

      if (!entry) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'not_found',
              message: `Entry ${id} not found, cannot delete`
            })
          }],
          isError: true
        };
      }

      const deleted = store.delete(id);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            id,
            title: entry.title,
            message: 'Entry deleted (irreversible)'
          })
        }]
      };
    }
  );
}
```

### Design Points Review

Notice the error handling in each tool:
- **Empty search**: Returns empty array + suggestion, not an error
- **Missing entry**: Returns `error` + `suggestion` so the agent knows what to do next
- **Delete operation**: Explicitly marked "irreversible"; queries first to confirm existence

## Part 4: Implement Resources

```typescript
// src/resources.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { store } from './store.js';

export function registerResources(server: McpServer) {
  // Resource 1: Knowledge base overview
  server.resource(
    'knowledge_overview',
    'kb://overview',
    async (uri) => {
      const entries = store.list();
      const tagCounts: Record<string, number> = {};

      for (const entry of entries) {
        for (const tag of entry.tags) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      }

      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({
            totalEntries: entries.length,
            tagDistribution: tagCounts,
            lastUpdated: entries.length > 0
              ? entries.sort((a, b) =>
                  b.updatedAt.localeCompare(a.updatedAt))[0].updatedAt
              : null
          })
        }]
      };
    }
  );

  // Resource 2: Single entry (dynamic URI)
  server.resource(
    'entry',
    'kb://entry/{id}',
    async (uri, { id }) => {
      const entry = store.get(id);

      if (!entry) {
        throw new Error(`Entry not found: ${id}`);
      }

      return {
        contents: [{
          uri: uri.href,
          mimeType: 'text/markdown',
          text: `# ${entry.title}\n\n${entry.content}\n\n---\nTags: ${entry.tags.join(', ')}`
        }]
      };
    }
  );
}
```

## Part 5: Implement Prompts

```typescript
// src/prompts.ts
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerPrompts(server: McpServer) {
  server.prompt(
    'quality_review',
    'Perform quality review of a knowledge entry',
    {
      id: z.string().describe('Entry ID'),
      criteria: z.enum(['completeness', 'accuracy', 'clarity'])
        .default('completeness').describe('Review dimension')
    },
    ({ id, criteria }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Review knowledge entry ${id} for ${criteria === 'completeness' ? 'completeness' :
              criteria === 'accuracy' ? 'accuracy' : 'clarity'}.

Review criteria:
1. Does the content cover key points of the topic?
2. Is any important information missing?
3. Is the writing clear and easy to understand?
4. Should examples or reference links be added?

Output format:
- Score (1-10)
- List of issues found
- Improvement suggestions`
          }
        },
        {
          role: 'user',
          content: {
            type: 'resource',
            resource: { uri: `kb://entry/${id}`, mimeType: 'text/markdown' }
          }
        }
      ]
    })
  );
}
```

## Part 6: Assemble Entry Point

```typescript
// src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools.js';
import { registerResources } from './resources.js';
import { registerPrompts } from './prompts.js';

const server = new McpServer({
  name: 'knowledge-base',
  version: '1.0.0'
});

registerTools(server);
registerResources(server);
registerPrompts(server);

const transport = new StdioServerTransport();
await server.connect(transport);
```

## Part 7: Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from '../src/tools.js';
import { registerResources } from '../src/resources.js';
import { registerPrompts } from '../src/prompts.js';
import { store } from '../src/store.js';

describe('knowledge-base MCP server', () => {
  let client: Client;
  let server: McpServer;

  beforeEach(async () => {
    // Reset store
    (store as any).entries = new Map();
    (store as any).nextId = 1;

    server = new McpServer({ name: 'test', version: '1.0.0' });
    registerTools(server);
    registerResources(server);
    registerPrompts(server);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    client = new Client({ name: 'test', version: '1.0.0' });

    await server.connect(serverTransport);
    await client.connect(clientTransport);
  });

  describe('search_entries', () => {
    it('should return empty results with suggestion', async () => {
      const result = await client.callTool({
        name: 'search_entries',
        arguments: { query: 'nonexistent' }
      });

      const data = JSON.parse(result.content[0].text);
      expect(data.results).toEqual([]);
      expect(data.suggestion).toBeDefined();
    });

    it('should find matching entries', async () => {
      await client.callTool({
        name: 'create_entry',
        arguments: {
          title: 'MCP Introduction',
          content: 'MCP stands for Model Context Protocol',
          tags: ['mcp', 'protocol']
        }
      });

      const result = await client.callTool({
        name: 'search_entries',
        arguments: { query: 'MCP' }
      });

      const data = JSON.parse(result.content[0].text);
      expect(data.results.length).toBe(1);
      expect(data.results[0].title).toBe('MCP Introduction');
    });
  });

  describe('get_entry', () => {
    it('should return not_found for invalid id', async () => {
      const result = await client.callTool({
        name: 'get_entry',
        arguments: { id: '999' }
      });

      expect(result.isError).toBe(true);
      const data = JSON.parse(result.content[0].text);
      expect(data.error).toBe('not_found');
    });
  });

  describe('delete_entry', () => {
    it('should delete existing entry', async () => {
      await client.callTool({
        name: 'create_entry',
        arguments: {
          title: 'To Delete',
          content: 'This will be deleted',
          tags: []
        }
      });

      const result = await client.callTool({
        name: 'delete_entry',
        arguments: { id: '1' }
      });

      const data = JSON.parse(result.content[0].text);
      expect(data.message).toContain('deleted');

      // Confirm it's gone
      const getResult = await client.callTool({
        name: 'get_entry',
        arguments: { id: '1' }
      });
      expect(getResult.isError).toBe(true);
    });
  });
});
```

## Self-Check

After completing the exercise, verify:

1. **All tools have structured error returns?** No plain text "Error" allowed.
2. **Empty search results include guidance?** The agent needs to know what to do next.
3. **Delete operations are marked irreversible?** Both user and agent need to know the consequences.
4. **Resource URIs are well-designed?** `kb://entry/1` is better than `data://1`.
5. **Prompt message sequences are complete?** Include instructions + data references.
6. **Tests cover normal and error paths?** At least one success + one failure test per tool.
7. **Response content size is reasonable?** Won't blow up the agent's context window.

## Extension Challenges

1. **Persistent storage**: Replace in-memory store with SQLite or JSON files.
2. **Paginated search**: Support offset/limit pagination when results are large.
3. **Version control**: Preserve edit history, support rollback.
4. **Related recommendations**: Return related entries in search results.
5. **Agent workflow integration**: Connect this server to your agent framework for end-to-end testing.

## Next

Continue to [MCP Security Model](/en/guide/mcp/safety) — learn how to set up security defenses for MCP servers.
