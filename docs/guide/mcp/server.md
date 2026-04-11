# 构建 MCP Server

本章用一个文档搜索 server 说明设计流程。代码可以在任意 MCP SDK 中实现，但文档先关注接口形状和质量标准。

## 能力定义

目标：让 Agent 能搜索教程页面，并返回少量高质量候选链接。

```json
{
  "name": "search_docs",
  "description": "Search tutorial pages by keyword.",
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

## 返回值

```json
{
  "results": [
    {
      "title": "MCP 入门",
      "url": "/guide/mcp/",
      "summary": "解释 MCP 的职责边界和最小设计流程。",
      "score": 0.92
    }
  ]
}
```

## Harness 场景

| 场景 | 输入 | 期望 |
| --- | --- | --- |
| 正常搜索 | `{"query":"MCP"}` | 返回相关页面，数量不超过限制 |
| 空查询 | `{"query":""}` | 返回结构化错误 |
| 无结果 | `{"query":"unknown-term"}` | 返回空数组和下一步建议 |
| 过大 limit | `{"query":"Skill","limit":1000}` | 自动限制到最大值 |

## 实现检查清单

- Tool 名称稳定。
- 输入输出有 schema。
- 错误可被 Agent 解释。
- 日志不包含密钥。
- Harness 覆盖成功和失败。
- 文档包含示例请求和示例响应。

下一步阅读 [MCP 实战练习](/guide/mcp/practice)。
