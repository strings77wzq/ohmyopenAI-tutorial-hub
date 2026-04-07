# AI 编程教程

系统学习 Skills、OpenSpec、Harness 等 AI 编程范式

## 🎯 学习目标

本教程旨在帮助开发者系统掌握现代 AI 编程的核心范式：

- **Skills**: 创建可复用的 AI 技能，提升开发效率
- **OpenSpec**: 规范驱动开发，确保人与 AI 对需求达成一致
- **Harness**: 测试基础设施，确保 AI 输出质量

## 🚀 快速开始

### 选择你的角色

<div class="role-cards">

#### 👨‍💻 Full-stack Developer
快速上手 → 工具使用 → 实战项目

[开始开发之旅](./guide/quickstart.html)

#### 🏗️ Architect
架构深入 → OpenSpec → Harness

[深入架构设计](./guide/openspec/concepts.html)

#### 🎓 Student
概念入门 → 逐步深入 → 练习

[从零开始学习](./guide/)

</div>

## 📚 教程模块

### Skills 教程

学习如何创建和使用 AI Skills：

1. [什么是 Skill](./guide/skills/what-is-skill.md) - 理解 Skill 的核心概念
2. [创建你的第一个 Skill](./guide/skills/first-skill.md) - 手把手教学
3. [Skill 核心组件](./guide/skills/components.md) - name、description、prompt、examples
4. [高级模式](./guide/skills/advanced.md) - 条件判断、变量、工具调用
5. [实战案例](./guide/skills/practice.md) - 代码审查 Skill 完整示例

### OpenSpec 教程

掌握规范驱动开发的完整工作流：

1. [核心概念](./guide/openspec/concepts.md) - SDD 介绍、OpenSpec 哲学
2. [命令参考](./guide/openspec/commands.md) - `/opsx:` 命令完整列表
3. [完整工作流](./guide/openspec/workflow.md) - propose → apply → archive
4. [编写高质量 Spec](./guide/openspec/writing-specs.md) - 技巧与模式
5. [实战案例](./guide/openspec/practice.md) - 电商场景规范驱动开发

### Harness 教程

构建 AI 编程的测试基础设施：

1. [测试基础设施](./guide/harness/intro.md) - Harness 核心概念
2. [编写测试场景](./guide/harness/writing-tests.md) - 测试用例设计
3. [Evaluators](./guide/harness/evaluators.md) - 输出质量评估
4. [Mock Server](./guide/harness/mock-server.md) - 无成本测试
5. [实战案例](./guide/harness/practice.md) - 完整测试工作流

## 🏗️ 示例项目

- [电商 MVP (Node.js)](./examples/ecommerce-nodejs.md)
- [电商 MVP (Python)](./examples/ecommerce-python.md)

## 🤝 贡献

欢迎贡献！请查看[贡献指南](./contributing.md)。

## 📄 许可

[MIT](./LICENSE)

## OpenSpec 项目隔离说明

本项目使用**项目内本地 OpenSpec**：

```text
ai-tutorial-hub/
  openspec/
    config.yaml
    changes/
    specs/
```

请在项目目录内执行 OpenSpec 命令：

```bash
cd ai-tutorial-hub
openspec list --json
openspec status --change tutorial-doc-site
```

这样当 `~/md` 下有多个项目时，每个项目的规范互不影响。

