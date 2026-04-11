# OMO 工作流模块

本模块深入讲解 Oh-My-OpenAgent (OMO) 的工作流和架构设计。

## 模块内容

### 架构设计

- [主编排器设计](/guide/omo/architecture/orchestrator) — Sisyphus 主编排器的工作原理
- [Agent 分类与能力](/guide/omo/architecture/agents) — 11 大专用 Agent 详解
- [Category 路由系统](/guide/omo/architecture/category) — 按领域自动路由到最佳模型

### 工作流拆解

- [意图分类](/guide/omo/workflow/intent) — 如何区分简单查询和复杂任务
- [任务分发](/guide/omo/workflow/delegation) — 串行、并行、混合三种模式
- [验证回路](/guide/omo/workflow/verification) — 自验证、交叉验证、独立验证

## 核心概念

### 编排层 → Agent 层 → 工具层

```
User Request
     ↓
[Intent Gate] — 意图分类
     ↓
[Sisyphus] — 主编排器
     ├─→ [Prometheus] — 战略规划
     ├─→ [Hephaestus] — 执行引擎
     ├─→ [Atlas] — Todo 编排
     ├─→ [Oracle] — 架构咨询
     ├─→ [Librarian] — 文档搜索
     └─→ [Explore] — 代码探索
```

### 工作模式

| 模式 | 命令 | 说明 |
|------|------|------|
| **Ultrawork** | `ulw` | 一键全力推进 |
| **Prometheus** | Tab 键 | 采访式规划 |