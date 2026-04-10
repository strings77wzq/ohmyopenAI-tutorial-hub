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

## 选择你的角色

<div class="role-cards">
  <a href="/guide/quickstart" class="role-card">
    <div class="role-icon">👨‍💻</div>
    <div class="role-title">Full-stack Developer</div>
    <div class="role-desc">想立即动手实践。快速上手 → 工具使用 → 实战项目。</div>
    <div class="role-link">开始开发之旅 →</div>
  </a>

  <a href="/guide/openspec/concepts" class="role-card">
    <div class="role-icon">🏗️</div>
    <div class="role-title">Architect</div>
    <div class="role-desc">想深入架构设计。OpenSpec 核心概念 → Harness 测试基础设施。</div>
    <div class="role-link">深入架构设计 →</div>
  </a>

  <a href="/guide/" class="role-card">
    <div class="role-icon">🎓</div>
    <div class="role-title">Student</div>
    <div class="role-desc">想了解完整概念。从基础入门 → 逐步深入 → 练习。</div>
    <div class="role-link">从零开始学习 →</div>
  </a>
</div>

## 为什么选择本教程？

- **⚡ 快速上手**：5 分钟就能运行第一个示例
- **🎯 实战导向**：通过真实项目学习，不只是理论
- **📖 循序渐进**：从操作到原理，符合学习曲线
- **🌏 中文友好**：专为中文开发者编写，降低学习门槛
- **🔓 开源免费**：基于 MIT 许可，自由学习和贡献
