# golem 真实案例模块

本模块用 golem 项目的核心模块作为真实教学案例，展示多 Agent 系统的设计模式。

## 模块内容

- [Skill 系统解剖](/guide/golem-case/skills-core) — 可复用 Agent 能力单元
- [RAG 流程解剖](/guide/golem-case/rag-core) — 检索增强实现
- [MCP 客户端解剖](/guide/golem-case/mcp-core) — 外部工具协议连接
- [多 Provider 适配解剖](/guide/golem-case/provider-core) — LLM 接口抽象

## 为什么用 golem？

1. **真实项目**：不是玩具示例，是生产级代码
2. **Go 实现**：展示非 JS/Python 主流的 Go 语言方案
3. **完整架构**：包含 Agent loop、Tool、RAG、MCP、Provider 全链路
4. **教学友好**：代码可精简到 150-200 行讲核心模式

## 学习路径

```
1. 先看 Skill 系统 → 理解 Agent 能力封装
2. 再看 RAG 流程 → 理解检索增强
3. 然后 MCP 客户端 → 理解外部工具连接
4. 最后 Provider → 理解多模型适配
```

每个案例都有：
- 架构图
- 精简代码（~150-200行）
- 设计要点讲解