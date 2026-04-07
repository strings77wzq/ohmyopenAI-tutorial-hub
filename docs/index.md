---
layout: home

hero:
  name: "AI 编程教程"
  text: ""
  tagline: 系统学习 Skills、OpenSpec、Harness 等 AI 编程范式
  image:
    src: /logo.svg
    alt: AI 编程教程
  actions:
    - theme: brand
      text: "[开始] 5 分钟快速体验"
      link: /guide/quickstart
    - theme: alt
      text: "[教程] 完整学习路径"
      link: /guide/
    - theme: alt
      text: GitHub
      link: https://github.com/strings77wzq/ohmyopenAI-tutorial-hub

features:
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:32px;height:32px;color:var(--vp-c-brand-1)"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>'
    title: "5 分钟快速开始"
    details: 无需复杂配置，创建并运行你的第一个 AI Skill
    link: /guide/quickstart
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:32px;height:32px;color:var(--vp-c-brand-1)"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>'
    title: "Skills 技能系统"
    details: 创建可复用的 AI 技能，通过结构化 prompt 提升开发效率
    link: /guide/skills/what-is-skill
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:32px;height:32px;color:var(--vp-c-brand-1)"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>'
    title: "OpenSpec 规范驱动"
    details: 编码前定义规范，确保人与 AI 对需求达成一致
    link: /guide/openspec/concepts
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:32px;height:32px;color:var(--vp-c-brand-1)"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>'
    title: "Harness 测试保障"
    details: 构建测试基础设施，确保 AI 输出质量
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

- **[快速上手]**：5 分钟就能运行第一个示例
- **[实战导向]**：通过真实项目学习，不只是理论
- **[循序渐进]**：从操作到原理，符合学习曲线
- **[中文友好]**：专为中文开发者编写，降低学习门槛
- **[开源免费]**：基于 MIT 许可，自由学习和贡献

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
