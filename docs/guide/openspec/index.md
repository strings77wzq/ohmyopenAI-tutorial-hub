# OpenSpec 教程

> Spec-Driven Development (SDD)：规范驱动开发，解决 Vibe Coding 的上下文丢失问题

## 什么是 OpenSpec？

**Spec = 规范驱动开发**。在 AI 时代，代码生成能力已不是瓶颈，真正的挑战是让 AI 在长任务中始终对齐目标。

| 模式 | 适用场景 | 特点 |
| --- | --- | --- |
| **Vibe Coding** | 快速验证、简单改动 | 即时反应，容易上下文漂移 |
| **Plan** | 范围清晰的功能迭代 | 简短的实施计划，快速对齐 |
| **Spec** | 复杂系统级任务 | 三阶段文档：spec → tasks → checklist |

### 为什么需要 Spec？

Vibe Coding 的困境：
- **缺乏全局视野**：AI 只在局部上下文中改动
- **代码质量不稳定**：边界 case 容易被忽略
- **迭代与技术债**：缺少事先沉淀的实现计划
- **可追溯性差**：核心逻辑散落在对话记录里
- **上下文丢失**：长对话后 AI 开始"脑补"

**Spec 的核心价值**：提供一份可维护的实现计划，作为整个开发过程的"锚点"。

## 三阶段文档

1. **spec.md** - 项目范围：全局概览、北极星文档
2. **tasks.md** - 任务拆解：有顺序的实现计划
3. **checklist.md** - 验证清单：完整性核查

## 开始学习

- [核心概念](/guide/openspec/concepts) - 深入理解 Spec 模式
- [命令参考](/guide/openspec/commands) - /spec 和 /plan 命令
- [完整工作流](/guide/openspec/workflow) - 从提案到归档
- [编写规范](/guide/openspec/writing-specs) - 如何写好 spec
- [实战案例](/guide/openspec/practice) - 真实项目示例

## 相关资源

- [OpenSpec GitHub](https://github.com/code-yeongyu/openspec)
- [TRAE 官方文档](https://trae.ai)
