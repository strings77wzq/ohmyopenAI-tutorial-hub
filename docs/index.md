---
layout: home

hero:
  name: "AI 编程教程"
  text: ""
  tagline: 系统学习 Skills、OpenSpec、Harness 等 AI 编程范式
  image:
    src: /ohmyopenAI-tutorial-hub/logo.svg
    alt: AI 编程教程
  actions:
    - theme: brand
      text: 🚀 5 分钟快速开始
      link: /guide/quickstart
    - theme: alt
      text: 📚 完整教程
      link: /guide/
    - theme: alt
      text: GitHub
      link: https://github.com/strings77wzq/ohmyopenAI-tutorial-hub

features:
  - icon: ⚡
    title: 快速上手
    details: 无需复杂配置，5 分钟内创建并运行你的第一个 AI Skill
    link: /guide/quickstart
  - icon: 🧠
    title: Skills
    details: 学习如何创建可复用的 AI 技能，通过结构化的 prompt 和示例提升开发效率
    link: /guide/skills/what-is-skill
  - icon: 📋
    title: OpenSpec
    details: 掌握规范驱动开发，在编码前定义规范，确保人与 AI 对需求达成一致
    link: /guide/openspec/concepts
  - icon: 🧪
    title: Harness
    details: 构建测试基础设施，使用 Evaluators 和 Mock Server 确保 AI 输出质量
    link: /guide/harness/intro
---

## 立即开始

### 方式一：快速体验（推荐）

复制下面的代码，创建你的第一个 Skill：

```json
{
  "name": "hello-ai",
  "description": "简单的问候 Skill",
  "prompt": "用友好的语气回复用户的问候",
  "examples": [
    {"input": "你好", "output": "你好！很高兴见到你。我是你的 AI 助手。"}
  ]
}
```

保存到 `.skills/hello-ai.json`，然后在 AI 助手输入 `/hello-ai 你好` 即可体验。

→ [查看完整快速开始指南](/guide/quickstart)

### 方式二：系统学习

根据你的背景选择学习路径：

| 如果你... | 推荐路径 |
|-----------|----------|
| 想立即动手实践 | [快速开始 →](/guide/quickstart) → [创建第一个 Skill →](/guide/skills/first-skill) |
| 想了解完整概念 | [教程概览 →](/guide/) → [Skills 基础 →](/guide/skills/what-is-skill) |
| 想深入架构设计 | [OpenSpec 核心概念 →](/guide/openspec/concepts) → [工作流 →](/guide/openspec/workflow) |

## 为什么选择本教程？

- **⚡ 快速上手**：5 分钟就能运行第一个示例
- **🎯 实战导向**：通过真实项目学习，不只是理论
- **📖 循序渐进**：从操作到原理，符合学习曲线
- **🌏 中文友好**：专为中文开发者编写，降低学习门槛
- **🔓 开源免费**：基于 MIT 许可，自由学习和贡献

<style>
.role-selection {
  margin-top: 2rem;
}

.role-selection h3 {
  margin-top: 1.5rem;
  color: var(--vp-c-brand-1);
}

.role-selection a {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}
</style>
