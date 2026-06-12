# MCP 核心概念

## 概念全景

MCP 协议定义了五种核心原语。理解每种原语的设计意图和适用场景，是构建高质量 MCP Server 的基础。

```
MCP 协议原语
├── Tool      可执行动作（有副作用）
├── Resource  可读数据（无副作用）
├── Prompt    可复用任务模板
├── Root      文件系统边界声明
└── Sampling  Server 向 Client 请求模型推理
```

## Tool：可执行动作

Tool 是 Agent 调用最频繁的原语。它代表一个有副作用的操作——调用后可能会改变外部状态。

### Tool 定义结构

```json
{
  "name": "create_ticket",
  "description": "创建工单，返回工单 ID",
  "inputSchema": {
    "type": "object",
    "properties": {
      "title": { "type": "string", "description": "工单标题" },
      "priority": {
        "type": "string",
        "enum": ["low", "medium", "high"],
        "default": "medium"
      },
      "description": { "type": "string", "description": "详细描述" }
    },
    "required": ["title"]
  }
}
```

### 设计要点

**命名一致性**：Tool 名称使用 `snake_case`，动词开头，清晰描述动作。

| 好的命名 | 差的命名 |
| --- | --- |
| `search_docs` | `docs` |
| `create_ticket` | `ticket_create_v2` |
| `send_email` | `email` |
| `get_user_info` | `doStuff` |

**输入 Schema**：使用 JSON Schema 定义每个参数的类型、约束和默认值。Agent 的 LLM 会根据 Schema 决定如何填充参数，所以 Schema 的描述质量直接影响调用准确率。

```json
{
  "query": {
    "type": "string",
    "description": "搜索关键词，支持布尔运算符 AND/OR",
    "minLength": 1,
    "maxLength": 200
  }
}
```

**副作用声明**：Tool 的 description 应明确说明是否有副作用，以及副作用的范围。

```
✅ "删除指定工单（不可恢复）"
❌ "删除工单"
✅ "发送 Slack 消息到 #alerts 频道"
❌ "发消息"
```

**错误处理**：Tool 返回的错误应该结构化，让 Agent 能理解并决定下一步。

```typescript
// 好的错误返回
return {
  content: [{
    type: 'text',
    text: JSON.stringify({
      error: 'permission_denied',
      message: '无权删除其他用户的工单',
      suggestion: '请联系工单创建者或管理员'
    })
  }],
  isError: true
};

// 差的错误返回
return {
  content: [{ type: 'text', text: 'Error: access denied' }],
  isError: true
};
```

### 流式返回

对于耗时较长的操作（生成报告、批量处理），Tool 支持流式返回中间结果：

```typescript
server.tool(
  'generate_report',
  '生成数据分析报告',
  { dataset: { type: 'string' } },
  async ({ dataset }, extra) => {
    // 中间进度通知
    extra.sendProgress({ percent: 30, message: '正在加载数据...' });

    const data = await loadData(dataset);
    extra.sendProgress({ percent: 60, message: '正在分析...' });

    const report = await analyze(data);
    extra.sendProgress({ percent: 100, message: '完成' });

    return {
      content: [{ type: 'text', text: report }]
    };
  }
);
```

## Resource：可读数据

Resource 代表 Agent 可以读取的上下文数据。与 Tool 不同，读取 Resource 不应产生副作用。

### URI 寻址

每个 Resource 通过 URI 唯一标识：

```
file:///docs/guide/mcp/index.md        文件资源
db://users/123                          数据库记录
postgres://mydb/public/users?limit=10   查询结果
```

URI scheme 决定了资源的类型和访问方式。自定义 scheme 需要在 description 中说明。

### 静态资源与动态资源

**静态资源**：编译时或启动时已知的资源，Agent 可以直接请求。

```typescript
// 静态资源列表
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

**动态资源**：运行时按 URI 模式匹配，适合大量或不确定的资源。

```typescript
// 动态资源模板
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

### 订阅机制

Resource 支持变更订阅。当底层数据变化时，Server 通知 Client 重新获取：

```
Client ──subscribe──► Server
Client ◄──notification── Server（资源已更新）
Client ──read──► Server（获取最新内容）
```

适用场景：
- 文件监控：编辑器打开的文件被外部修改
- 数据库变更：业务数据更新
- 配置热更新：运行时配置变化

### 设计原则

| 原则 | 说明 |
| --- | --- |
| 幂等性 | 多次读取同一 Resource 返回相同内容（不考虑时间变化） |
| 大小限制 | 单个 Resource 内容不应超过上下文窗口的合理比例 |
| 新鲜度标注 | 标明数据的更新时间，让 Agent 知道信息是否过期 |
| 错误透明 | 文件不存在、权限不足等错误要明确返回 |

## Prompt：任务模板

Prompt 是封装了「如何完成某类任务」的可复用模板。它不是简单的 system prompt，而是包含参数化输入、多步骤工作流和 Tool 组合策略的完整模板。

### Prompt 定义

```json
{
  "name": "code_review",
  "description": "对代码变更进行结构化审查",
  "arguments": [
    {
      "name": "language",
      "description": "编程语言",
      "required": true
    },
    {
      "name": "focus",
      "description": "审查重点：security / performance / readability",
      "required": false,
      "default": "readability"
    }
  ]
}
```

### Prompt 返回结构

Prompt 被调用后返回一组消息，Agent 可以直接使用：

```typescript
server.prompt(
  'code_review',
  '对代码变更进行结构化审查',
  {
    language: { type: 'string', description: '编程语言' },
    focus: { type: 'string', description: '审查重点', required: false }
  },
  ({ language, focus }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `请对以下 ${language} 代码变更进行${focus || '可读性'}审查。`
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

| 维度 | Prompt | Tool |
| --- | --- | --- |
| 目的 | 封装工作流模板 | 执行具体动作 |
| 返回 | 消息序列（指导 Agent 行为） | 数据结果 |
| 副作用 | 无 | 可能有 |
| 调用方 | 用户选择使用 | Agent 自主调用 |

### 适用场景

- **代码审查**：提供审查模板和检查清单
- **数据分析**：定义分析步骤和输出格式
- **文档生成**：模板化写作流程
- **调试流程**：系统化的排错步骤

## Root：文件系统边界

Root 声明了 Server 可以访问的文件系统范围。这是安全模型的重要组成部分。

```typescript
// 声明 Server 只能访问项目目录
server.setRoots([
  {
    uri: 'file:///home/user/myproject',
    name: '项目根目录'
  }
]);
```

Client 也可以动态变更 Root：

```
Client ──roots/updated──► Server
Server 重新评估可访问范围
```

## Sampling：反向模型调用

Sampling 允许 Server 请求 Client 进行模型推理。这是一种受控的反向调用——Server 不直接调用 LLM，而是通过 Client 间接请求。

```
Server ──sampling/createMessage──► Client
Client ──调用本地 LLM──►
Client ◄──模型输出── LLM
Client ──sampling 结果──► Server
```

使用场景：
- Server 需要 LLM 辅助完成部分任务（分类、摘要、判断）
- Server 不直接接触模型 API，保持安全边界

安全约束：
- Client 有权拒绝任何采样请求
- 采样请求必须经过用户确认
- Server 不能要求 Client 绕过安全策略

## 原语组合模式

在实际项目中，这三种原语通常组合使用：

```
用户请求：「帮我审查这个 PR」
  │
  ├─► Prompt：code_review（返回审查模板）
  │     └─► Resource：git://diff/current（获取代码变更）
  │     └─► Resource：git://file/{path}（获取完整文件）
  │
  ├─► Tool：comment_on_pr（添加审查评论）
  │
  └─► Tool：approve_pr（批准 PR）
```

这种组合模式让 Agent 能根据任务需要灵活调用不同原语，而不是把所有逻辑塞进一个巨大的 Tool。

## 下一步

继续阅读 [构建 MCP Server](/guide/mcp/server)，把这些概念落地为可运行的代码。
