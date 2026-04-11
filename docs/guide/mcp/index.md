# MCP 入门

MCP 是 Model Context Protocol 的缩写。它解决的问题是：当 Agent 需要访问工具、文件、数据库、搜索结果或业务系统时，不能只靠一段临时 prompt 拼接上下文，而要通过清晰的协议暴露能力、数据和安全边界。

## 你会学到什么

- MCP 的 client、server、tool、resource、prompt 分别承担什么职责。
- 如何把一个外部能力设计成可发现、可调用、可测试的接口。
- 如何用 Harness 验证 MCP 工具返回值和错误处理。
- 如何为权限、密钥和危险操作设置边界。

## 核心设计模型

| 角色 | 职责 |
| --- | --- |
| **Client** | Agent 或宿主应用，发现并调用 Server 暴露的能力 |
| **Server** | 能力提供方，暴露 tools、resources 和 prompts |
| **Tool** | 有副作用或计算逻辑的可调用动作 |
| **Resource** | 可读取的数据（文件、记录、文档片段） |
| **Prompt** | 可复用的任务说明或工作流模板 |

> 设计 MCP 时，按此模型明确每个组件的职责边界，确保协议清晰。

## 一个 MCP 能力的设计步骤

1. 写清楚任务边界：这个能力解决什么问题，不解决什么问题。
2. 定义输入和输出：字段、类型、错误码和示例。
3. 决定权限：读取、写入、网络、命令执行是否允许。
4. 写 Harness：覆盖成功、失败、空数据、权限拒绝和超时。
5. 写文档：说明何时使用、如何测试、如何回滚。

## 练习

设计一个 `search_docs` MCP tool：

- 输入：`query` 和可选的 `limit`。
- 输出：匹配标题、摘要、链接和置信度。
- 验收：无结果时返回空数组和建议下一步；查询为空时返回明确错误。

## 相关资源

- [MCP 官方文档](https://modelcontextprotocol.io/) - 官方协议规范
- [Awesome MCP Servers](https://github.com/topics/model-context-protocol) - 社区 MCP Server 集合

下一步阅读 [核心概念](/guide/mcp/concepts)。
