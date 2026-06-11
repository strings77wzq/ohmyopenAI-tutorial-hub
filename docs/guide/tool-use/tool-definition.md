---
title: 工具定义与描述
description: 掌握 JSON Schema 参数定义、description 编写最佳实践、命名规范和嵌套对象设计
---

# 工具定义与描述

工具定义是 Tool Use 的基础。定义写得好，模型调用准确率显著提升；定义模糊，模型要么不调用，要么传错参数。

## 工具定义的基本结构

每个工具需要三个核心部分：

```json
{
  "name": "search_web",
  "description": "在互联网上搜索信息，返回标题、摘要和链接",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "搜索关键词"
      },
      "max_results": {
        "type": "integer",
        "description": "最大返回条数，默认 5",
        "default": 5,
        "minimum": 1,
        "maximum": 20
      }
    },
    "required": ["query"]
  }
}
```

## JSON Schema 参数定义

### 基本类型

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer" },
    "score": { "type": "number" },
    "active": { "type": "boolean" },
    "tags": { "type": "array", "items": { "type": "string" } }
  }
}
```

### 约束条件

```json
{
  "type": "string",
  "description": "用户邮箱",
  "format": "email",
  "minLength": 5,
  "maxLength": 255
}
```

```json
{
  "type": "integer",
  "description": "分页页码",
  "minimum": 1,
  "maximum": 100
}
```

### 枚举值

当参数只有几个固定选项时，用 `enum` 限定：

```json
{
  "type": "string",
  "description": "排序方式",
  "enum": ["asc", "desc", "relevance"]
}
```

这样模型不会发明不存在的排序方式。

### 嵌套对象

复杂参数用嵌套 object 表达：

```json
{
  "type": "object",
  "description": "筛选条件",
  "properties": {
    "date_range": {
      "type": "object",
      "properties": {
        "start": { "type": "string", "format": "date" },
        "end": { "type": "string", "format": "date" }
      }
    },
    "categories": {
      "type": "array",
      "items": { "type": "string" }
    },
    "min_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 100
    }
  }
}
```

### required vs optional

```json
{
  "type": "object",
  "properties": {
    "query": { "type": "string", "description": "搜索词" },
    "language": { "type": "string", "description": "语言过滤，如 zh、en" },
    "safe_search": { "type": "boolean", "description": "是否开启安全搜索" }
  },
  "required": ["query"]
}
```

`required` 中的参数必须提供，其余可选。模型看到 `required` 会更可靠地传入必填参数。

## Description 编写最佳实践

Description 是模型理解工具用途的核心依据。

### ✅ 好的 description

```json
{
  "name": "read_file",
  "description": "读取指定路径的文件内容。支持文本文件，不支持二进制文件。路径必须是绝对路径或相对于项目根目录的路径。"
}
```

要点：
- 说清楚**做什么**（读取文件内容）
- 说清楚**限制**（不支持二进制文件）
- 说清楚**约束**（路径格式要求）

### ❌ 差的 description

```json
{
  "name": "read_file",
  "description": "读文件"
}
```

模型不知道支持什么格式、路径怎么写、有什么限制。

### Description 编写清单

| 维度 | 检查项 |
| --- | --- |
| 功能 | 是否说清楚工具做什么？ |
| 限制 | 是否说明不支持什么？ |
| 约束 | 参数有什么格式要求？ |
| 副作用 | 调用后会改变外部状态吗？ |
| 返回值 | 返回什么格式的数据？ |

## 参数命名规范

### 命名风格

```json
{
  "properties": {
    "user_id": { "type": "string" },      // ✅ snake_case
    "created_at": { "type": "string" },   // ✅ snake_case
    "max_retries": { "type": "integer" }  // ✅ snake_case
  }
}
```

统一使用 `snake_case`。不要混用 `camelCase`（userId）或 `kebab-case`（user-id）。

### 命名原则

```json
{
  "query": "搜索词",        // ✅ 简洁明确
  "search_query": "搜索词", // ❌ 和工具名重复
  "q": "搜索词",            // ❌ 太短，含义不明
  "the_search_query_string": "搜索词"  // ❌ 冗余
}
```

## 参数设计模式

### 模式 1：必填 + 可选覆盖

```json
{
  "name": "send_email",
  "parameters": {
    "type": "object",
    "properties": {
      "to": { "type": "string", "description": "收件人邮箱" },
      "subject": { "type": "string", "description": "邮件主题" },
      "body": { "type": "string", "description": "邮件正文" },
      "cc": { "type": "array", "items": { "type": "string" }, "description": "抄送列表" },
      "priority": { "type": "string", "enum": ["low", "normal", "high"], "default": "normal" }
    },
    "required": ["to", "subject", "body"]
  }
}
```

### 模式 2：互斥参数组

```json
{
  "name": "query_database",
  "parameters": {
    "type": "object",
    "properties": {
      "sql": { "type": "string", "description": "原生 SQL 查询" },
      "table": { "type": "string", "description": "要查询的表名" },
      "conditions": { "type": "object", "description": "查询条件" }
    },
    "description": "查询数据库。二选一：提供 sql 执行原生查询，或提供 table + conditions 进行条件查询。"
  }
}
```

### 模式 3：带默认值的可选参数

```json
{
  "name": "fetch_page",
  "parameters": {
    "type": "object",
    "properties": {
      "url": { "type": "string", "description": "目标 URL" },
      "timeout": { "type": "integer", "description": "超时时间（毫秒），默认 30000", "default": 30000 },
      "follow_redirects": { "type": "boolean", "description": "是否跟随重定向，默认 true", "default": true }
    },
    "required": ["url"]
  }
}
```

## 练习

为以下场景设计工具定义：

1. **文件搜索工具**：在项目中按文件名模式搜索文件。
2. **代码重构工具**：重命名一个函数，更新所有调用方。
3. **API 测试工具**：发送一个 HTTP 请求并返回响应。

要求：写出完整的 JSON Schema，包含 name、description 和 parameters。

<details>
<summary>参考答案（文件搜索）</summary>

```json
{
  "name": "search_files",
  "description": "按 glob 模式搜索项目中的文件。返回匹配的文件路径列表，按修改时间倒序排列。",
  "parameters": {
    "type": "object",
    "properties": {
      "pattern": {
        "type": "string",
        "description": "glob 模式，如 '**/*.ts' 或 'src/**/*.test.js'"
      },
      "root_dir": {
        "type": "string",
        "description": "搜索根目录，默认项目根目录"
      },
      "max_results": {
        "type": "integer",
        "description": "最大返回数量，默认 50",
        "default": 50,
        "minimum": 1,
        "maximum": 500
      }
    },
    "required": ["pattern"]
  }
}
```

</details>

## 常见错误

### 错误 1：缺少 description

```json
{
  "name": "query_db",
  "parameters": {
    "type": "object",
    "properties": {
      "q": { "type": "string" }
    }
  }
}
```

模型不知道这个工具干什么，大概率不调用或乱调用。

### 错误 2：参数过多

一个工具定义了 20 个参数，模型容易遗漏或填错。拆成多个工具。

### 错误 3：类型不明确

```json
{
  "data": { "type": "string", "description": "JSON 数据" }
}
```

如果数据确实是 JSON，用 `type: "object"` 而不是 string。

## 下一步

→ [工具选择与编排](/guide/tool-use/orchestration)
