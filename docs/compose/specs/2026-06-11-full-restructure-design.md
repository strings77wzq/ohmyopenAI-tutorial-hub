# Agent Engineering Hub — 全面重构设计规格

> 目标：打造一个开源优秀的 Agent 工程学习文档，覆盖 Prompt Engineering → Tool Use → Skills → MCP → Context → Harness → Loop 七大主题，辅助学习成为顶级 Agent 工程师。

## [S1] 问题

当前文档站存在以下问题：
1. **内容缺失**：Prompt Engineering 和 Tool Use 没有独立模块
2. **知识架构不清**：模块之间缺乏明确的层级关系和演进逻辑
3. **内容深度不均**：部分模块内容充实（Skills 397 行），部分偏薄（MCP 33-57 行）
4. **设计一致性**：虽然已实现 Anthropic 风格 token 系统，但部分页面布局和交互模式不统一

## [S2] 解决方案

### 三层知识架构

```
🔧 基础层 Foundation
   Prompt Engineering → Tool Use → Context Engineering
        ↓ 构建在基础之上
🏗️ 构建层 Build
   Skills → MCP → OpenSpec
        ↓ 保障质量
✅ 质量层 Quality
   Harness Engineering → Evaluation → Loop Engineering
```

### 模块清单（9 个核心模块 + 2 个辅助）

| 层级 | 模块 | 子页数 | 状态 |
|------|------|--------|------|
| 基础层 | Prompt Engineering | 6 | 🆕 全新 |
| 基础层 | Tool Use | 6 | 🆕 全新 |
| 基础层 | Context Engineering | 5 | 📝 重构 |
| 构建层 | Skills | 6 | ✅ 已有 |
| 构建层 | MCP | 5 | 📝 扩充 |
| 构建层 | OpenSpec | 6 | ✅ 已有 |
| 质量层 | Harness Engineering | 6 | 📝 重构 |
| 质量层 | Evaluation | 5 | ✅ 已有 |
| 质量层 | Loop Engineering | 4 | ✅ 已有 |
| 辅助 | golem Case Study | 5 | ✅ 已有 |
| 辅助 | OMO Workflow | 8 | ✅ 已有 |

### 每个模块的标准结构

每个模块包含 4-6 个子页，遵循统一结构：

1. **概念页**（index.md）— 这个技术解决什么问题？为什么需要它？
2. **核心组件** — 拆解关键概念，每个给出定义 + 示例
3. **实战练习** — 动手做：从零构建一个完整案例
4. **高级模式** — 进阶技巧、常见陷阱、性能优化
5. **排错指南** — 常见失败模式 + 解决方案
6. **最佳实践** — 行业经验总结 + 检查清单

## [S3] 新增模块设计

### Prompt Engineering（6 页）

| 页面 | 内容 | 目标行数 |
|------|------|----------|
| index.md | 什么是 Prompt Engineering：从"写提示词"到"工程化设计" | 150-200 |
| design-patterns.md | 提示词设计模式：Zero-shot / Few-shot / CoT / ReAct / Tree-of-Thought | 200-250 |
| structured.md | 结构化提示词：XML/JSON Schema、角色定义、输出约束 | 200-250 |
| debugging.md | 提示词调试与迭代：A/B 测试、版本管理、效果评估 | 150-200 |
| practice.md | 实战：构建一个可复用的 Prompt 库 | 200-250 |
| best-practices.md | 最佳实践与反模式：常见陷阱、性能优化、成本控制 | 150-200 |

### Tool Use（6 页）

| 页面 | 内容 | 目标行数 |
|------|------|----------|
| index.md | 什么是 Tool Use：Agent 如何从"只会说话"到"能做事" | 150-200 |
| tool-definition.md | 工具定义与描述：JSON Schema、参数设计、描述最佳实践 | 200-250 |
| orchestration.md | 工具选择与编排：单工具调用、链式调用、并行调用 | 200-250 |
| error-handling.md | 错误处理与重试：工具失败恢复、超时处理、降级策略 | 150-200 |
| practice.md | 实战：构建一个工具集（文件操作 + API 调用 + 数据查询） | 200-250 |
| safety.md | 安全边界与权限控制：沙箱、权限模型、危险操作防护 | 150-200 |

## [S4] 视觉设计规格

### 设计 Token（已实现，保持不变）

- **色彩**：Brand #C07A5E (warm clay), Background #FBFAF6 (warm paper), Text #1A1817 (near-black)
- **字体**：Display Geist, Body Inter, Mono JetBrains Mono
- **间距**：Section 80-144px, Card 20px, Grid gap 14px
- **圆角**：Default 8px, Pill 6px, Card 12px

### 页面布局规范

每个教程页面遵循统一布局：

```
┌─────────────────────────────────────────┐
│  Category Label (小字，品牌色)            │
│  Page Title (大标题，display font)       │
│  Lead paragraph (概述，body font)        │
├─────────────────────────────────────────┤
│  Content sections                        │
│  - H2 sections with breathing room       │
│  - Code blocks with language badges      │
│  - Tables with soft backgrounds          │
│  - Blockquotes for key insights          │
├─────────────────────────────────────────┤
│  Practice section (动手做)               │
│  Troubleshooting (排错)                  │
│  Next steps (下一步)                     │
└─────────────────────────────────────────┘
```

### 设计原则

1. **呼吸感**：大量留白，section 间距 80-144px
2. **层次清晰**：H1 display font → H2 24px bold → H3 18px semibold
3. **温暖色调**：暖纸色背景 + 暖 clay 品牌色，避免冷色
4. **代码友好**：代码块有语言标签、柔和背景、适当圆角
5. **无装饰**：移除渐变、阴影、动画等装饰性元素
6. **可访问性**：WCAG AA 对比度、focus-visible、reduced-motion

## [S5] 导航结构

### 侧边栏（ZH）

```
开始
  学习地图
  快速开始

基础层 Foundation
  Prompt Engineering
    什么是 Prompt Engineering
    提示词设计模式
    结构化提示词
    调试与迭代
    实战：构建 Prompt 库
    最佳实践
  Tool Use
    什么是 Tool Use
    工具定义与描述
    工具选择与编排
    错误处理与重试
    实战：构建工具集
    安全边界
  Context Engineering
    概述
    上下文分层模型
    注入策略
    压缩与摘要
    实战案例

构建层 Build
  Skills
    ...
  MCP
    ...
  OpenSpec
    ...

质量层 Quality
  Harness Engineering
    ...
  Evaluation
    ...
  Loop Engineering
    ...

实战案例
  golem Case Study
  OMO Workflow
```

### 首页学习路径

更新首页学习地图，反映三层架构：
- 基础层：3 个入口卡片
- 构建层：3 个入口卡片
- 质量层：3 个入口卡片
- 实战：golem + OMO 入口

## [S6] 实施范围

### 必做（本次重构）

1. 创建 Prompt Engineering 模块（6 页 ZH + 6 页 EN）
2. 创建 Tool Use 模块（6 页 ZH + 6 页 EN）
3. 更新导航结构（config.ts sidebar）
4. 更新首页学习地图（guide/index.md）
5. 更新英文首页（en/guide/index.md）

### 可选（后续迭代）

1. 深化现有偏薄模块（MCP、Harness、OMO）
2. 补充 golem 代码锚点
3. 添加交互式练习
4. 添加进度追踪
