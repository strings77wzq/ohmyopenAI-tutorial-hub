# 快速开始

本指南将帮助你在 5 分钟内快速上手 AI 编程的核心概念。

## 前置条件

- 基本的编程知识（任何语言）
- 对 AI 编程助手有初步了解（如 Claude Code、Cursor 等）
- 已安装 Node.js 18+（如学习 OpenSpec）

## 1. 理解核心概念

在开始之前，让我们快速了解三个核心概念：

### Skill 是什么？

Skill 是**可复用的 AI 指令模板**。它告诉 AI 助手如何完成特定任务，包含：

- **name**: Skill 的名称
- **description**: 功能描述
- **prompt**: 详细的执行指令
- **examples**: 示例输入输出

**一句话总结**：Skill = 给 AI 的标准化工作手册

### OpenSpec 是什么？

OpenSpec 是**规范驱动开发（Spec-Driven Development）**框架。核心思想：

> 在写代码之前，先写规范。确保人和 AI 对需求达成一致。

**工作流程**：
1. `/opsx:propose` - 创建提案
2. `/opsx:apply` - 应用规范，AI 实现代码
3. `/opsx:archive` - 归档完成

### Harness 是什么？

Harness 是**测试基础设施**，用于评估 AI 输出质量：

- **测试场景**：定义输入和期望输出
- **Evaluators**：自动化评估 AI 输出
- **Mock Server**：无需真实 API 调用的测试环境

## 2. 创建你的第一个 Skill

创建一个简单的代码解释 Skill：

```json
{
  "name": "explain-code",
  "description": "解释代码的工作原理",
  "prompt": "请详细解释以下代码的工作原理，包括：\n1. 代码的整体功能\n2. 关键变量和函数\n3. 执行流程\n4. 可能的优化建议\n\n代码：\n{{code}}",
  "examples": [
    {
      "input": "def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)",
      "output": "这是一个递归实现的斐波那契数列函数..."
    }
  ]
}
```

将文件保存为 `explain-code.json`，放在项目的 `.skills/` 目录下。

## 3. 体验 OpenSpec 工作流

安装 OpenSpec CLI：

```bash
npm install -g @fission-ai/openspec@latest
```

初始化项目：

```bash
cd your-project
openspec init
```

创建第一个变更：

```bash
/opsx:propose "添加用户登录功能"
```

AI 会生成：
- `proposal.md` - 提案说明
- `design.md` - 技术设计
- `specs/` - 详细需求
- `tasks.md` - 实现任务

查看并确认后，让 AI 实现：

```bash
/opsx:apply
```

## 4. 下一步

恭喜！你已经了解了 AI 编程的三大核心范式。接下来：

- 📖 深入学习 [Skills 教程](/guide/skills/what-is-skill)
- 📋 掌握 [OpenSpec 规范驱动开发](/guide/openspec/concepts)
- 🧪 了解 [Harness 测试基础设施](/guide/harness/intro)
- 🚀 动手实践 [示例项目](/examples/)

## 常见问题

**Q: 我需要先学习哪个？**

A: 建议顺序：Skill → OpenSpec → Harness。Skill 是基础，OpenSpec 是工作流，Harness 是质量保障。

**Q: 这些工具依赖特定 AI 吗？**

A: 不依赖。Skill 是通用格式，OpenSpec 和 Harness 也与具体 AI 工具解耦。你可以在任何支持这些格式的工具中使用。

**Q: 学习曲线陡峭吗？**

A: 入门很简单！5 分钟可以创建第一个 Skill。深入需要实践，但每一步都有明确的学习路径。
