## Context

当前教程文档已包含 Skills、MCP、OpenSpec、Harness 四大模块，但：
1. 缺少对 Oh-My-OpenAgent (OMO) 工作流的系统讲解
2. 案例都是虚构的电商示例，没有用真实项目（如 golem）深入解剖
3. Harness 模块基础内容已完善，但缺少四大护栏的深化内容

目标用户是希望学习如何构建多 Agent 系统、深入理解 OMO 工作流和 Harness 工程的中高级开发者。

## Goals / Non-Goals

**Goals:**
- 新增 /guide/omo/ 模块，包含架构设计和工作流拆解（7篇）
- 新增 /guide/golem-case/ 模块，用真实项目案例讲解核心模块（4篇）
- 深化 /guide/harness/ 模块，增加 Agent 审 Agent 和熵管理（2篇）

**Non-Goals:**
- 不包含 golutra 项目作为教学（只是灵感参考）
- Agent 详解不绑定特定模型（如 GPT-5.4）
- 不重建已有的 Harness 基础内容

## Decisions

1. **OMO 模块结构**：分为架构设计（orchestrator、agents、category）和工作流拆解（intent、delegation、verification）两个子板块

2. **golem 案例精简原则**：每个模块只展示核心 150-200 行代码，突出设计模式而非完整实现

3. **模型无关性**：Agent 详解只推荐模型类型（如推理型、执行型），不绑定特定提供商

## Risks / Trade-offs

- [Risk] 代码精简后可能丢失上下文 → [Mitigation] 配合架构图和设计思路讲解
- [Risk] OMO 快速迭代导致文档过时 → [Mitigation] 强调核心概念而非细节配置