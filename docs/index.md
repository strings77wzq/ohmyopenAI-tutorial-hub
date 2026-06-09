---
layout: home
title: Agent Engineering Hub — 智能体工程学习枢纽
---

hero:
  name: "Agent Engineering"
  text: "系统化智能体工程"
  tagline: 从 Prompt Engineering 到 Loop Engineering，覆盖 Agentic 开发的完整技术栈。Skills · MCP · OpenSpec · Harness · Context · Loop 七大维度的结构化学习路径。
  image:
    src: /logo.svg
    alt: Agent Engineering Hub
  actions:
    - theme: brand
      text: 开始学习
      link: /guide/
    - theme: alt
      text: 快速开始
      link: /guide/quickstart
    - theme: alt
      text: GitHub
      link: https://github.com/strings77wzq/agent-engineering-hub

features:
  - title: Skills
    details: 将 Prompt 封装为可复用、可测试、可演进的 AI 能力模块。学习如何设计、实现和发布一个生产级 Skill。
    link: /guide/skills/what-is-skill
  - title: MCP (Model Context Protocol)
    details: 标准化 Agent 与外部工具的通信协议。构建 MCP Server，定义 tools、resources、prompts 的安全边界。
    link: /guide/mcp/
  - title: OpenSpec
    details: 规格驱动开发 (SDD)。在编码前通过 proposal + design + tasks 锁定需求、场景和验收标准。
    link: /guide/openspec/concepts
  - title: Context Engineering
    details: 在有限的上下文窗口中精准分层注入信息。目标、项目知识、工作状态、外部知识、操作证据五层模型。
    link: /guide/context/
  - title: Harness Engineering
    details: AI 输出质量保障。R.E.S.T 模型、六大设计原则、场景测试、Mock Server、Evaluator 和回归套件。
    link: /guide/harness/intro
  - title: Loop Engineering
    details: Agent 的"规划—执行—反思"循环机制。OODA Loop、三阶段退出、指数退避重试、熔断器和多源反馈。
    link: /guide/loop-engineering/
---

<script setup>
import { withBase } from 'vitepress'
</script>

<section class="hub-section">
  <p class="eyebrow">Learning Pathway</p>
  <h2>七步工程链路：从 Prompt 到 Production Loop</h2>
  <p class="lead">每个维度解决上一层的遗留问题，形成一条完整的 Agentic Engineering 技术演进路径。按顺序学习效果最佳。</p>
  <div class="path-grid">
    <a class="path-card" :href="withBase('/guide/skills/')">
      <img class="module-icon" :src="withBase('/icons/skills.svg')" alt="" aria-hidden="true">
      <span>01 / Prompt → Skill</span>
      <strong>Skills</strong>
      <p>从手写 Prompt 到可复用能力模块，建立最小反馈循环。</p>
    </a>
    <a class="path-card" :href="withBase('/guide/mcp/')">
      <img class="module-icon" :src="withBase('/icons/mcp.svg')" alt="" aria-hidden="true">
      <span>02 / Protocol</span>
      <strong>MCP</strong>
      <p>标准化上下文协议，让 Agent 安全地连接外部工具和数据源。</p>
    </a>
    <a class="path-card" :href="withBase('/guide/openspec/concepts')">
      <img class="module-icon" :src="withBase('/icons/openspec.svg')" alt="" aria-hidden="true">
      <span>03 / Spec-Driven</span>
      <strong>OpenSpec</strong>
      <p>用规格文档锁定需求，消除人机协作中的意图偏差。</p>
    </a>
    <a class="path-card" :href="withBase('/guide/harness/intro')">
      <img class="module-icon" :src="withBase('/icons/harness.svg')" alt="" aria-hidden="true">
      <span>04 / Quality Gate</span>
      <strong>Harness</strong>
      <p>用测试、Mock、Evaluator 和回归套件验证 AI 输出质量。</p>
    </a>
    <a class="path-card" :href="withBase('/guide/context/')">
      <img class="module-icon" :src="withBase('/icons/context.svg')" alt="" aria-hidden="true">
      <span>05 / Window Mgmt</span>
      <strong>Context Engineering</strong>
      <p>五层上下文模型：精准注入，解决长窗口迷失问题。</p>
    </a>
    <a class="path-card" :href="withBase('/guide/evaluation/')">
      <img class="module-icon" :src="withBase('/icons/evaluation.svg')" alt="" aria-hidden="true">
      <span>06 / Release Gate</span>
      <strong>Evaluation & Release</strong>
      <p>把验收标准转化为可自动执行的回归检查和安全发布门禁。</p>
    </a>
    <a class="path-card" :href="withBase('/guide/loop-engineering/')">
      <img class="module-icon" :src="withBase('/icons/workflow.svg')" alt="" aria-hidden="true">
      <span>07 / Feedback Loop</span>
      <strong>Loop Engineering</strong>
      <p>OODA 循环、指数退避、熔断器——让 Agent 稳定收敛而非失控循环。</p>
    </a>
  </div>
</section>

<section class="hub-section split-section">
  <div>
    <p class="eyebrow">Production Ready</p>
    <h2>不只是教程——是工程实践</h2>
    <p class="lead">每个模块包含概念、操作步骤、练习、排错指南和下一步指引。所有文档经过构建验证、链接审计和多端适配，确保学习体验流畅可靠。</p>
  </div>
  <div class="check-panel">
    <p>Quality Gates</p>
    <ul>
      <li>VitePress 构建验证：零错误通过</li>
      <li>链接审计：100+ 页面零断链</li>
      <li>路由验证：侧边栏链接全部可达</li>
      <li>前言检查：所有页面有结构化标题</li>
      <li>OpenSpec 闭环：变更全部归档</li>
      <li>中英文双语：完整导航覆盖</li>
    </ul>
  </div>
</section>

<section class="hub-section">
  <p class="eyebrow">Production Case Study</p>
  <h2>golem — 真实生产级 Agent 系统</h2>
  <p class="lead">golem 是一个用 Go 实现的生产级 Agent 系统，完整展示了 Skills、RAG、MCP 客户端和多 Provider 架构的工程实践。阅读源码是最好的学习方式。</p>
  <div class="path-grid">
    <a class="path-card" href="https://github.com/strings77wzq/golem" target="_blank">
      <span>Go Production</span>
      <strong>golem 源码</strong>
      <p>完整的 Go Agent 系统实现，包含 MCP 客户端、RAG 系统、多 Provider 支持。</p>
    </a>
    <a class="path-card" :href="withBase('/guide/golem-case/')">
      <span>Case Study</span>
      <strong>架构解读</strong>
      <p>深入分析 golem 的 Skill 系统、RAG 管道、MCP 集成和多 Provider 路由。</p>
    </a>
    <a class="path-card" href="https://github.com/code-yeongyu/oh-my-openagent" target="_blank">
      <span>OMO Framework</span>
      <strong>oh-my-openagent</strong>
      <p>多模型编排系统，11 大 Agent 分类，Category 路由和验证回路。</p>
    </a>
    <a class="path-card" :href="withBase('/guide/omo/')">
      <span>Architecture</span>
      <strong>OMO 架构设计</strong>
      <p>主编排器、Agent 分类体系、意图路由和任务分发机制详解。</p>
    </a>
  </div>
</section>

<style scoped>
.hub-section {
  max-width: 1152px;
  margin: 0 auto;
  padding: 56px 24px;
}

.hub-section + .hub-section {
  border-top: 1px solid var(--vp-c-divider);
}

.hub-section h2 {
  margin: 0 0 16px;
  border-top: 0;
  padding-top: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.lead {
  max-width: 720px;
  color: var(--vp-c-text-2);
  font-size: 17px;
  line-height: 1.75;
  margin: 0 0 32px;
}

.path-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.path-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.path-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 30px -12px var(--vp-c-brand-soft);
  transform: translateY(-2px);
}

.path-card > span:first-of-type {
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.path-card strong {
  font-size: 17px;
  font-weight: 700;
}

.path-card p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
}

.module-icon {
  width: 36px;
  height: 36px;
  padding: 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.split-section {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 32px;
  align-items: start;
}

.check-panel {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 24px;
  background: var(--vp-c-bg-soft);
}

.check-panel p {
  margin: 0 0 14px;
  font-weight: 700;
  font-size: 15px;
}

.check-panel ul {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.check-panel li {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.check-panel li::marker {
  color: var(--vp-c-brand-1);
}

@media (max-width: 960px) {
  .path-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .split-section { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .hub-section { padding: 40px 16px; }
  .hub-section h2 { font-size: 26px; }
  .path-grid { grid-template-columns: 1fr; }
}
</style>
