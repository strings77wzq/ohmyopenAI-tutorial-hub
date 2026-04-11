## Why

当前的文档项目缺乏对 Oh-My-OpenAgent (OMO) 工作流和架构的系统性讲解，也没有用真实项目（golem）作为案例来深入演示核心模块。这导致学习者只能看到概念堆叠，无法理解如何设计一个真正的多 Agent 系统。

## What Changes

- 新增 OMO 工作流模块（/guide/omo/），包含架构设计和工作流拆解
- 新增 golem 真实案例模块（/guide/golem-case/），用精简代码讲解核心模块
- 深化现有 Harness 模块，新增反馈循环和熵管理内容

## Capabilities

### New Capabilities

- `omo-workflow`: OMO 多模型 Agent 编排系统的工作流拆解
- `omo-architecture`: OMO 主编排器和 Agent 分类设计
- `golem-case-study`: 用 golem 项目作为真实教学案例

### Modified Capabilities

- `harness-quality`: 深化 Harness 四大护栏（增加 Agent 审 Agent、熵管理）

## Impact

- 文档结构：新增 /guide/omo/ 和 /guide/golem-case/ 两个顶级模块
- 内容深度：从概念讲解升级到真实项目解剖
- 差异化：展示 OMO 独有的工作流（对比 golutra）