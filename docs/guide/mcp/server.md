# 构建 MCP Server

本章用一个完整的文档搜索 Server 说明从零构建 MCP Server 的全过程。代码基于 TypeScript SDK，但设计思路适用于任何语言的 SDK。

## 项目初始化

```bash
mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node
npx tsc --init --outDir dist --rootDir src --module nodenext --moduleResolution nodenext
```

目录结构：

```
my-mcp-server/
├── src/
│   ├── index.ts          入口：初始化和启动 Server
│   ├── tools.ts          Tool 定义
│   ├── resources.ts      Resource 定义
│   └── prompts.ts        Prompt 定义
├── package.json
└── tsconfig.json
```

## Step 1：创建 Server 实例

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

`McpServer` 是高层封装，处理协议握手、能力协商和消息路由。你只需要注册 Tools、Resources 和 Prompts，SDK 负责底层通信。

### 传输选择

| 传输方式 | 适用场景 | 优势 |
| --- | --- | --- |
| stdio | 本地工具、CLI 集成 | 简单、低延迟、进程隔离 |
| Streamable HTTP | 远程部署、多客户端 | 跨网络、可扩展、支持认证 |

本地开发用 stdio，生产部署用 HTTP。切换传输层只需改两行代码。

## Step 2：定义 Tool

Tool 是 Server 的核心能力。用 Zod 定义输入 Schema，SDK 自动转换为 JSON Schema 暴露给 Client。

```typescript
// src/tools.ts
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const SearchSchema = {
  query: z.string().min(1).max(200).describe('搜索关键词'),
  limit: z.number().min(1).max(50).default(5).describe('返回结果数量上限')
};

export function registerTools(server: McpServer) {
  // Tool 1：搜索文档
  server.tool(
    'search_docs',
    '按关键词搜索文档页面，返回匹配结果列表',
    SearchSchema,
    async ({ query, limit }) => {
      const results = await searchDocuments(query, limit);

      if (results.length === 0) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              results: [],
              suggestion: `未找到与「${query}」相关的文档，尝试使用更宽泛的关键词`
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

  // Tool 2：获取文档详情
  server.tool(
    'get_doc',
    '获取指定文档的完整内容',
    { path: z.string().describe('文档路径，如 /guide/mcp/index') },
    async ({ path }) => {
      const doc = await readDocument(path);

      if (!doc) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'not_found',
              message: `文档「${path}」不存在`
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

### 关键设计模式

**模式一：结构化错误返回**

```typescript
// ❌ 差：纯文本错误
return { content: [{ type: 'text', text: 'Error: not found' }], isError: true };

// ✅ 好：结构化错误，Agent 能解析并决定下一步
return {
  content: [{
    type: 'text',
    text: JSON.stringify({
      error: 'not_found',
      message: `文档「${path}」不存在`,
      suggestion: '使用 search_docs 工具查找可用文档'
    })
  }],
  isError: true
};
```

**模式二：空结果引导**

```typescript
if (results.length === 0) {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        results: [],
        suggestion: '未找到匹配结果，尝试使用不同的关键词'
      })
    }]
  };
}
```

**模式三：输入限制**

```typescript
// Zod 自动处理参数验证
const limit = z.number().min(1).max(50).default(5);

// 业务层也做一次防御
const actualLimit = Math.min(limit, 50);
```

## Step 3：定义 Resource

Resource 提供只读数据。使用 URI 模式匹配，支持静态和动态资源。

```typescript
// src/resources.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerResources(server: McpServer) {
  // 静态资源：文档列表
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

  // 动态资源：单个文档
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

### URI 设计原则

```
✅ 自描述：doc://readme        → 文档 readme
✅ 层级清晰：doc://guide/mcp/index → 文档层级路径
✅ 类型明确：db://users/123     → 用户 123 的记录

❌ 模糊：data://1              → 数据 1 是什么？
❌ 缺类型：readme.md           → 没有 scheme
```

## Step 4：定义 Prompt

Prompt 封装工作流模板，让 Agent 不用从零开始思考。

```typescript
// src/prompts.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerPrompts(server: McpServer) {
  server.prompt(
    'review_doc',
    '对文档进行结构化审查',
    {
      path: z.string().describe('文档路径'),
      focus: z.enum(['accuracy', 'completeness', 'clarity'])
        .default('clarity').describe('审查重点')
    },
    ({ path, focus }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `请对文档「${path}」进行${focus === 'accuracy' ? '准确性' :
              focus === 'completeness' ? '完整性' : '清晰度'}审查。
审查后请列出：
1. 发现的问题（按严重程度排序）
2. 每个问题的具体位置和修改建议
3. 总体评分（1-10）`
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

## Step 5：组装和启动

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

## Step 6：测试

### 手动测试

```bash
# 启动 Server
node dist/index.js

# 通过 stdin 发送 JSON-RPC 消息
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | node dist/index.js
```

### 自动化测试

```typescript
// test/server.test.ts
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

    const [clientTransport, serverTransport] = createInMemoryTransport();
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

### 验证清单

| 检查项 | 状态 |
| --- | --- |
| Tool 名称稳定且有意义 | □ |
| 每个 Tool 有输入输出 Schema | □ |
| 错误返回结构化，Agent 能解析 | □ |
| 空结果有引导建议 | □ |
| Resource URI 设计清晰 | □ |
| Prompt 返回完整的消息序列 | □ |
| 测试覆盖成功和失败场景 | □ |
| 日志不包含密钥或敏感数据 | □ |

## 下一步

阅读 [MCP 实战练习](/guide/mcp/practice)，完成一个完整的练习项目。
