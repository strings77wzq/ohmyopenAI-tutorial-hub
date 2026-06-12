# MCP 入门

## 问题：Agent 如何连接外部世界

一个 Agent 如果只能读写自己的上下文窗口，它的能力就被锁死了。它不能查数据库、不能调 API、不能读本地文件、不能执行搜索。传统做法是把这些能力硬编码到 prompt 里——把数据库查询结果粘贴进 system prompt，把文件内容手动塞进对话。这种方式在 demo 里能跑，但有几个致命问题：

1. **不可发现**：Agent 不知道有哪些能力可用，每次都要人工告诉它。
2. **不可测试**：能力是散落在 prompt 拼接逻辑里的，没有统一的输入输出契约。
3. **不可治理**：权限、密钥、危险操作没有统一的边界，全靠开发者自觉。
4. **不可复用**：A 项目写的能力逻辑，B 项目要重写一遍。

MCP（Model Context Protocol）就是为了解决这些问题而设计的开放协议。

## MCP 是什么

MCP 是一个开放标准协议，定义了 Agent（客户端）和能力提供方（服务端）之间的通信方式。它的核心思想是：

> 把 Agent 需要的外部能力，通过标准化接口暴露出来，让 Agent 能自己发现、自己调用、自己处理错误。

简单说，MCP 就是 Agent 世界的 USB 协议——不管设备是什么，只要插上 USB 就能通信。不管能力是什么，只要实现 MCP 协议，Agent 就能用。

## 核心架构

MCP 采用客户端-服务端架构：

```
┌─────────────┐         ┌─────────────┐
│   Client     │◄───────►│   Server     │
│  (Agent)     │  传输层  │  (能力提供方) │
└─────────────┘         └─────────────┘
      │                       │
      ▼                       ▼
  宿主应用               外部系统/数据
```

### 角色定义

| 角色 | 职责 | 示例 |
| --- | --- | --- |
| **Client** | 发现并调用 Server 暴露的能力 | Agent 运行时、IDE 插件、聊天应用 |
| **Server** | 能力提供方，暴露 tools、resources 和 prompts | 文件系统服务、数据库服务、API 网关 |
| **Host** | 管理 Client 的宿主应用 | 桌面应用、Web 平台、CLI 工具 |

一个 Host 可以包含多个 Client，每个 Client 连接一个 Server。一个 Server 也可以同时服务多个 Client。

### 传输层

MCP 协议本身与传输层解耦，目前支持两种主要传输方式：

**stdio（标准输入/输出）**：Client 和 Server 在同一台机器上通过 stdin/stdout 通信。适合本地工具集成，比如 IDE 插件调用本地分析工具。

```
Agent 进程 ──stdin──► MCP Server 进程
Agent 进程 ◄──stdout── MCP Server 进程
```

**Streamable HTTP**：Client 和 Server 通过 HTTP 通信，Server 端使用 Server-Sent Events（SSE）推送流式数据。适合远程部署、多客户端共享的场景。

```
Agent ──HTTP POST──► MCP Server（远程）
Agent ◄──SSE Stream── MCP Server（远程）
```

### 能力协商

连接建立后，Client 和 Server 会交换各自支持的能力声明。这不是一次性握手，而是双向声明：

- Client 告诉 Server：「我能接收采样请求、我能处理资源变更通知」
- Server 告诉 Client：「我提供 3 个 tools、2 个 resources、1 个 prompt」

只有双方都声明支持的能力才会被启用。这意味着 Server 可以安全地暴露能力，不用担心 Client 不支持某个特性。

## 三大核心概念

MCP 定义了三种主要的能力类型：

### Tool（工具）

Tool 是可执行的动作。Agent 通过调用 Tool 来完成计算、查询、写入等操作。

```json
{
  "name": "search_docs",
  "description": "按关键词搜索文档",
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

Tool 的关键特征：
- **有副作用**：调用可能会改变外部状态（写数据库、发消息、调 API）。
- **Agent 主动调用**：Agent 根据任务需要决定何时调用哪个 Tool。
- **需要权限控制**：危险操作必须有确认机制。

### Resource（资源）

Resource 是可读取的数据。Agent 通过 Resource 获取上下文信息。

```
uri: file:///docs/readme.md
name: README 文件
mimeType: text/markdown
```

Resource 的关键特征：
- **只读**：读取 Resource 不应产生副作用。
- **有 URI 标识**：通过统一资源标识符定位。
- **可订阅**：支持实时变更通知。

### Prompt（提示模板）

Prompt 是可复用的任务模板，封装了如何使用 Tools 和 Resources 完成特定任务。

```json
{
  "name": "review_code",
  "description": "代码审查模板",
  "arguments": [
    { "name": "language", "description": "编程语言", "required": true },
    { "name": "focus", "description": "审查重点", "required": false }
  ]
}
```

## 一个完整示例

假设你要为一个文档站点构建 MCP Server，让 Agent 能搜索和读取文档：

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
  name: 'docs-server',
  version: '1.0.0'
});

// 注册一个 Tool：搜索文档
server.tool(
  'search_docs',
  '按关键词搜索文档页面',
  { query: { type: 'string' }, limit: { type: 'number', default: 5 } },
  async ({ query, limit }) => {
    const results = await searchDocuments(query, limit);
    return {
      content: [{ type: 'text', text: JSON.stringify(results) }]
    };
  }
);

// 注册一个 Resource：读取文档内容
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

// 启动服务
const transport = new StdioServerTransport();
await server.connect(transport);
```

这段代码做了一件事：把文档搜索和文档读取能力通过 MCP 协议暴露出来。任何支持 MCP 的 Agent 都能自动发现并调用这些能力。

## MCP 在 Agent 生态中的位置

```
用户请求
  │
  ▼
┌──────────────────────────────┐
│         Agent 运行时          │
│  ┌────────────────────────┐  │
│  │     推理引擎 (LLM)      │  │
│  └───────────┬────────────┘  │
│              │               │
│  ┌───────────▼────────────┐  │
│  │   MCP Client Layer     │  │
│  └───┬───────┬───────┬────┘  │
│      │       │       │       │
└──────┼───────┼───────┼───────┘
       │       │       │
  ┌────▼──┐ ┌──▼───┐ ┌─▼────┐
  │文件系统│ │数据库 │ │ API  │
  │Server │ │Server│ │Server│
  └───────┘ └──────┘ └──────┘
```

Agent 不直接和外部系统打交道，而是通过 MCP Client 发现和调用 MCP Server。这样做的好处：

- **解耦**：Agent 不需要知道外部系统的具体实现，只需要知道 MCP 接口。
- **安全**：权限控制在 Server 端执行，Agent 无法绕过。
- **可组合**：多个 Server 可以同时工作，Agent 自由组合能力。
- **可测试**：每个 Server 的接口都有明确的输入输出契约。

## 真实世界的 MCP 集成

MCP 已被主流 Agent 框架广泛采用：

| 项目 | MCP 使用方式 |
|------|-------------|
| [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) | s19 章节专门讲解 MCP Plugin：多传输层 + 通道路由 + 工具池组装 |
| [everything-claude-code](https://github.com/WorldFlowAI/everything-claude-code) | 内置 MCP 配置，一键连接外部工具 |
| Claude Code / Cursor / Codex | 原生 MCP 支持，工具通过标准协议暴露给 Agent |

## 设计 MCP 能力的五步法

1. **定义边界**：这个能力解决什么问题，不解决什么问题。
2. **设计接口**：输入字段、输出结构、错误类型，写成 JSON Schema。
3. **决定权限**：读取、写入、网络、命令执行，哪些允许，哪些需要确认。
4. **编写测试**：覆盖成功、失败、空数据、权限拒绝、超时。
5. **写文档**：何时使用、如何测试、如何回滚。

## 练习

设计一个 `search_docs` MCP Tool：

- 输入：`query`（必填）和 `limit`（可选，默认 5）。
- 输出：匹配标题、摘要、链接和置信度的数组。
- 验收：无结果时返回空数组和建议；查询为空时返回明确错误；结果数量不超过 limit。

## 相关资源

- [MCP 官方文档](https://modelcontextprotocol.io/) - 协议规范和 SDK
- [Awesome MCP Servers](https://github.com/topics/model-context-protocol) - 社区 MCP Server 集合
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - TypeScript 官方 SDK

下一步阅读 [核心概念](/guide/mcp/concepts)，深入了解 Tools、Resources 和 Prompts 的设计细节。
