# 快速开始

本指南将帮助你在 5 分钟内创建并运行你的第一个 AI Skill。

## 第一步：创建你的第一个 Skill（2 分钟）

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

**操作步骤**：
1. 在你的项目根目录创建 `.skills/` 文件夹
2. 将上面的代码保存为 `.skills/explain-code.json`
3. 在 AI 助手输入：`/explain-code` 并粘贴一段代码

**示例**：
```
你: /explain-code
   def add(a, b):
       return a + b

AI: 这是一个简单的加法函数...
   1. 整体功能：接收两个参数并返回它们的和
   2. 关键变量：a, b 是输入参数
   3. 执行流程：直接返回 a + b 的结果
   4. 优化建议：可以添加类型检查...
```

✅ **完成！** 你已经成功创建并使用了第一个 Skill。

---

## 第二步：体验 OpenSpec 工作流（3 分钟）

OpenSpec 是规范驱动开发框架，核心思想：**先写规范，再写代码**。

### 2.1 安装 OpenSpec CLI

```bash
npm install -g @fission-ai/openspec@latest
```

### 2.2 初始化项目

```bash
cd your-project
openspec init
```

### 2.3 创建变更

使用 `/opsx:propose（创建提案）` 命令：

```bash
/opsx:propose "添加用户登录功能"
```

AI 会自动生成：
- `proposal.md` - 提案说明（为什么做、做什么）
- `design.md` - 技术设计（怎么做）
- `specs/` - 详细需求规范
- `tasks.md` - 实现任务清单

### 2.4 应用规范

查看生成的文档，确认后执行：

```bash
/opsx:apply（应用规范）
```

AI 会根据规范自动实现代码。

### 2.5 归档变更

完成后执行：

```bash
/opsx:archive（归档变更）
```

保存完整的历史记录。

✅ **完成！** 你已经体验了完整的 OpenSpec 工作流。

---

## 延伸阅读：理解核心概念（可选）

如果你想知道刚才操作背后的原理，可以继续阅读：

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
1. `/opsx:propose（创建提案）` - 创建变更提案
2. `/opsx:apply（应用规范）` - AI 按规范实现代码
3. `/opsx:archive（归档变更）` - 保存完整历史

### Harness 是什么？

Harness 是**测试基础设施**，用于评估 AI 输出质量：

- **测试场景**：定义输入和期望输出
- **Evaluators（评估器）**：自动化评估 AI 输出
- **Mock Server（模拟服务器）**：无需真实 API 调用的测试环境

---

## 下一步

你已经掌握了 AI 编程的基础！接下来可以：

- 📖 深入学习 [Skills 教程](/guide/skills/what-is-skill) - 创建更复杂的 Skill
- 📋 掌握 [OpenSpec 规范驱动开发](/guide/openspec/concepts) - 理解完整工作流
- 🧪 了解 [Harness 测试基础设施](/guide/harness/intro) - 确保 AI 输出质量
- 🚀 动手实践 [示例项目](/examples/) - 电商 MVP 完整实战

## 常见问题

**Q: 我需要先学习哪个？**

A: 建议顺序：Skill → OpenSpec → Harness。Skill 是基础，OpenSpec 是工作流，Harness 是质量保障。

**Q: 这些工具依赖特定 AI 吗？**

A: 不依赖。Skill 是通用格式，OpenSpec 和 Harness 也与具体 AI 工具解耦。你可以在任何支持这些格式的工具中使用。

**Q: 学习曲线陡峭吗？**

A: 入门很简单！正如你刚才体验的，5 分钟就能创建第一个 Skill。深入需要实践，但每一步都有明确的学习路径。
