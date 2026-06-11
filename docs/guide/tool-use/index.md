---
title: 什么是 Tool Use
description: 理解 Tool Use 的核心概念、演进历史和学习路径，掌握让大语言模型调用外部工具的方法论
---

# 什么是 Tool Use

大语言模型（LLM）能生成流畅的文本，但不能直接读写文件、调用 API、查询数据库。Tool Use 解决的就是这个断层——让模型"长出手脚"，通过结构化的工具调用与外部世界交互。

## 这个模块解决什么问题

当你构建 Agent 时，会遇到这些场景：

- 用户说"帮我查一下今天的天气"，模型无法直接获取实时数据。
- 用户说"把这个 CSV 里的数据画成图表"，模型无法执行 Python 脚本。
- 用户说"帮我在 Jira 上创建一个 issue"，模型无法调用 REST API。

**Tool Use** 就是让模型学会：
1. 识别用户意图需要调用哪个工具。
2. 用正确的参数调用工具。
3. 解析工具返回的结果并生成回复。

## 核心概念

Tool Use 的工作流程由四个关键环节组成：

### 1. 工具发现（Tool Discovery）

系统在对话开始前告诉模型"你有哪些可用工具"。每个工具包含名称、描述和参数定义。模型据此判断何时应该调用工具。

```
可用工具:
- search_web: 在互联网上搜索信息
  参数: query (string, 必填), max_results (integer, 可选)
- read_file: 读取本地文件
  参数: path (string, 必填)
```

### 2. 工具调用（Tool Calling）

模型根据用户意图生成一个结构化的调用请求，而不是直接回答问题。

```json
{
  "tool": "search_web",
  "parameters": {
    "query": "2024年 AI Agent 发展趋势",
    "max_results": 5
  }
}
```

### 3. 结果解析（Result Parsing）

工具执行完毕后返回结果，模型需要理解结果并整合到回复中。

```json
{
  "status": "success",
  "results": [
    {"title": "AI Agent 2024 趋势报告", "snippet": "..."},
    {"title": "Agent 框架对比分析", "snippet": "..."}
  ]
}
```

### 4. 多步工具链（Multi-step Tool Chain）

复杂任务通常需要多次工具调用。模型在每一步之后判断是否需要继续调用。

```
用户: "帮我分析 src/main.py 的代码质量"

步骤1 → read_file(path: "src/main.py")     # 读取文件
步骤2 → analyze_code(content: "...")         # 分析代码
步骤3 → search_best_practices(topic: "...")  # 查找最佳实践
步骤4 → 综合结果，生成报告                     # 最终回复
```

## Tool Use 的演进

| 阶段 | 方式 | 特点 |
| --- | --- | --- |
| 早期 | Prompt 拼接 | 手动在 prompt 中注入工具结果，容易出错 |
| Function Calling | OpenAI 推出的结构化调用 | 标准化的工具定义和调用格式 |
| MCP | Model Context Protocol | 跨模型、跨平台的工具发现协议 |
| Agent 框架 | 自主编排 | 模型自己决定调用顺序、重试策略和错误恢复 |

关键转折点：从"人告诉模型该调什么"到"模型自己决定调什么"。

## 学习路径

```
工具定义与描述 ──→ 工具选择与编排 ──→ 错误处理与重试
       │                                    │
       ▼                                    ▼
  安全边界与权限控制  ←────────────  实战：构建工具集
```

| 页面 | 内容 | 适合谁 |
| --- | --- | --- |
| [工具定义与描述](/guide/tool-use/tool-definition) | 如何写好工具的 JSON Schema | 所有人 |
| [工具选择与编排](/guide/tool-use/orchestration) | 单步、多步、并行调用策略 | 构建 Agent 的开发者 |
| [错误处理与重试](/guide/tool-use/error-handling) | 失败恢复和降级方案 | 需要生产级稳定性的团队 |
| [实战：构建工具集](/guide/tool-use/practice) | 从零构建完整工具集 | 想动手实践的人 |
| [安全边界与权限控制](/guide/tool-use/safety) | 沙箱、权限、审计 | 部署到生产环境的团队 |

## 练习

思考以下场景，判断每个需要几个工具调用：

1. 用户问："北京今天适合户外运动吗？"
2. 用户说："把这个项目的所有 TODO 标记找出来，按优先级排序"
3. 用户说："帮我写一个 Python 脚本，读取 data.csv 并画柱状图"

<details>
<summary>参考答案</summary>

1. 至少 2 步：查天气 → 综合判断。可能 3 步：查天气 + 查运动建议。
2. 至少 2 步：搜索 TODO → 排序整理。
3. 至少 2 步：读取文件 → 生成代码。可能 3 步：读取 + 分析数据结构 + 生成脚本。

</details>

## 下一步

→ [工具定义与描述](/guide/tool-use/tool-definition)
