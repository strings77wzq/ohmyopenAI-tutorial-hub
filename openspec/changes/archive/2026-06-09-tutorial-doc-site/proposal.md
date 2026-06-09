## Why

当前 AI 编程领域涌现出 Skills、OpenSpec、Harness 等先进的开发范式，但缺乏系统性的中文教学文档。现有教程要么停留在 README 层面，要么过于碎片化，初学者学习成本高。本项目旨在构建一个**文档官网**（而非单一 README），以教程驱动的方式系统教学这些 AI 架构知识，同时推广 `claude-code-Go` 项目，增强个人技术影响力。

## What Changes

- 新建一个独立的教学文档站点（基于 VitePress，与 claude-code-Go 现有文档技术栈一致）
- 创建三大核心教程模块：Skills 教程、OpenSpec 教程、Harness 教程
- 设计角色化学习路径（初学者 → 开发者 → 架构师）
- 提供可运行的实战示例项目（多语言实现）
- 内置中英文双语支持（i18n）
- 添加交互式组件：代码 Playground、命令参考表、最佳实践检查清单

## Capabilities

### New Capabilities
- `tutorial-site`: 完整的文档官网基础设施（VitePress 配置、主题定制、导航结构、搜索、i18n）
- `skills-tutorial`: Skills 系统教学模块（概念入门、创建 Skill、高级模式、实战案例）
- `openspec-tutorial`: OpenSpec 规范驱动开发教学模块（核心概念、工作流、实战案例、最佳实践）
- `harness-tutorial`: Harness 测试基础设施教学模块（概念介绍、编写测试、Evaluators、Mock Server）
- `example-projects`: 配套实战示例项目（电商场景 MVP，多语言实现）
- `learning-paths`: 角色化学习路径系统（初学者路径、开发者路径、架构师路径）

### Modified Capabilities
<!-- 无现有能力需要修改 -->

## Impact

- 新增独立文档仓库（或扩展现有 claude-code-Go 的 docs/ 目录）
- 需要 VitePress 配置更新（导航、侧边栏、主题增强）
- 新增示例代码目录（examples/）
- 新增 GitHub Actions 部署流程（GitHub Pages）
- 影响：提升 claude-code-Go 项目的可见度和采用率，建立技术影响力
