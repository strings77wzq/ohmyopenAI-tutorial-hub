# MCP 实战练习

本章通过一个完整的练习项目，把前面学到的 Tool、Resource、Prompt 知识整合到一个真实可运行的 MCP Server 中。

## 练习目标

构建一个「知识库管理」MCP Server，提供以下能力：

- 搜索知识条目
- 读取知识条目详情
- 创建新条目
- 删除条目
- 结构化审查条目质量

## 第一部分：项目结构

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
│   ├── index.ts        入口
│   ├── tools.ts        4 个 Tool
│   ├── resources.ts    2 个 Resource
│   ├── prompts.ts      1 个 Prompt
│   └── store.ts        内存数据存储
├── test/
│   └── server.test.ts  测试用例
├── package.json
└── tsconfig.json
```

## 第二部分：数据存储层

先实现一个简单的内存存储，方便测试：

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

## 第三部分：实现 Tools

```typescript
// src/tools.ts
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { store } from './store.js';

export function registerTools(server: McpServer) {
  // Tool 1：搜索知识条目
  server.tool(
    'search_entries',
    '在知识库中搜索条目，支持标题、内容和标签匹配',
    {
      query: z.string().min(1).describe('搜索关键词'),
      limit: z.number().min(1).max(50).default(10).describe('返回数量上限')
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
              ? `未找到「${query}」相关条目，尝试其他关键词或创建新条目`
              : undefined
          })
        }]
      };
    }
  );

  // Tool 2：获取条目详情
  server.tool(
    'get_entry',
    '获取指定知识条目的完整内容',
    {
      id: z.string().describe('条目 ID')
    },
    async ({ id }) => {
      const entry = store.get(id);

      if (!entry) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'not_found',
              message: `条目 ${id} 不存在`,
              suggestion: '使用 search_entries 查看可用条目'
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

  // Tool 3：创建新条目
  server.tool(
    'create_entry',
    '在知识库中创建新条目',
    {
      title: z.string().min(1).max(200).describe('条目标题'),
      content: z.string().min(1).describe('条目内容'),
      tags: z.array(z.string()).default([]).describe('标签列表')
    },
    async ({ title, content, tags }) => {
      const entry = store.create({ title, content, tags });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            id: entry.id,
            title: entry.title,
            message: '条目创建成功'
          })
        }]
      };
    }
  );

  // Tool 4：删除条目
  server.tool(
    'delete_entry',
    '删除指定知识条目（不可恢复）',
    {
      id: z.string().describe('要删除的条目 ID')
    },
    async ({ id }) => {
      const entry = store.get(id);

      if (!entry) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'not_found',
              message: `条目 ${id} 不存在，无法删除`
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
            message: '条目已删除（不可恢复）'
          })
        }]
      };
    }
  );
}
```

### 设计要点回顾

注意每个 Tool 的错误处理：
- **空搜索**：返回空数组 + 建议，而不是错误
- **找不到条目**：返回 `error` + `suggestion`，让 Agent 知道下一步该做什么
- **删除操作**：明确标注「不可恢复」，删除前先查询确认存在

## 第四部分：实现 Resources

```typescript
// src/resources.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { store } from './store.js';

export function registerResources(server: McpServer) {
  // 资源 1：知识库概览
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

  // 资源 2：单个条目（动态 URI）
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

## 第五部分：实现 Prompts

```typescript
// src/prompts.ts
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerPrompts(server: McpServer) {
  server.prompt(
    'quality_review',
    '对知识库条目进行质量审查',
    {
      id: z.string().describe('条目 ID'),
      criteria: z.enum(['completeness', 'accuracy', 'clarity'])
        .default('completeness').describe('审查维度')
    },
    ({ id, criteria }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `请对知识库条目 ${id} 进行${criteria === 'completeness' ? '完整性' :
              criteria === 'accuracy' ? '准确性' : '清晰度'}审查。

审查标准：
1. 内容是否覆盖了该主题的关键要点
2. 是否有遗漏的重要信息
3. 表述是否清晰易懂
4. 是否需要补充示例或参考链接

输出格式：
- 评分（1-10）
- 发现的问题列表
- 改进建议`
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

## 第六部分：组装入口

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

## 第七部分：测试

```typescript
// test/server.test.ts
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
    // 重置存储
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
          title: 'MCP 入门',
          content: 'MCP 是 Model Context Protocol',
          tags: ['mcp', 'protocol']
        }
      });

      const result = await client.callTool({
        name: 'search_entries',
        arguments: { query: 'MCP' }
      });

      const data = JSON.parse(result.content[0].text);
      expect(data.results.length).toBe(1);
      expect(data.results[0].title).toBe('MCP 入门');
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
      expect(data.message).toContain('已删除');

      // 确认删除后找不到
      const getResult = await client.callTool({
        name: 'get_entry',
        arguments: { id: '1' }
      });
      expect(getResult.isError).toBe(true);
    });
  });
});
```

## 自检清单

完成练习后，检查以下问题：

1. **所有 Tool 都有结构化错误返回吗？** 不能只返回纯文本 "Error"。
2. **空搜索结果有引导建议吗？** Agent 需要知道下一步该做什么。
3. **删除操作标注了不可恢复吗？** 用户和 Agent 都需要知道后果。
4. **Resource URI 设计清晰吗？** `kb://entry/1` 比 `data://1` 好。
5. **Prompt 消息序列完整吗？** 包含指令 + 数据引用。
6. **测试覆盖了正常和异常路径吗？** 至少每个 Tool 一个成功 + 一个失败测试。
7. **返回内容大小合理吗？** 不会撑爆 Agent 的上下文窗口。

## 延伸挑战

1. **持久化存储**：把内存存储换成 SQLite 或 JSON 文件。
2. **分页搜索**：当结果很多时，支持 offset/limit 分页。
3. **版本控制**：编辑条目时保留历史版本，支持回滚。
4. **关联推荐**：搜索时返回相关条目推荐。
5. **接入 Agent 工作流**：把这个 Server 接入你的 Agent 框架，测试端到端效果。

## 下一步

阅读 [MCP 安全边界](/guide/mcp/safety)，学习如何为 MCP Server 设置安全防线。

## 完整代码示例

本模块的完整可运行 Go 代码：[`examples/go/mcp/`](https://github.com/strings77wzq/agent-engineering-hub/tree/main/examples/go/mcp)

```bash
cd examples/go/mcp
go run *.go
```
