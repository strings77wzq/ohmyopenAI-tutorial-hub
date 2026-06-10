---
layout: home
title: Agent Engineering Hub — 智能体工程学习枢纽
---

hero:
  name: "Agent Engineering"
  text: "系统化智能体工程"
  tagline: 从 Prompt Engineering 到 Loop Engineering。Skills · MCP · OpenSpec · Harness · Context · Loop — 完整的 Agentic 开发技术栈。
  image:
    src: /logo.svg
    alt: Agent Engineering Hub
  actions:
    - theme: brand
      text: 开始学习
      link: /guide/
    - theme: alt
      text: GitHub
      link: https://github.com/strings77wzq/agent-engineering-hub

features:
  - title: Skills
    details: 将 Prompt 封装为可复用、可测试、可演进的 AI 能力模块。
    link: /guide/skills/what-is-skill
  - title: MCP
    details: 标准化 Agent 与外部工具的通信协议。构建 Server，定义边界。
    link: /guide/mcp/
  - title: Harness
    details: R.E.S.T 模型、场景测试、Mock Server、Evaluator 与回归套件。
    link: /guide/harness/intro
  - title: Loop Engineering
    details: OODA Loop、三阶段退出、指数退避、熔断器与多源反馈。
    link: /guide/loop-engineering/
---

<script setup>
import { withBase } from 'vitepress'
</script>

<section class="hub-section">
  <p class="eyebrow">Learning Pathway</p>
  <h2>四个核心模块，按顺序学完</h2>
  <p class="lead">每个模块解决上一层的遗留问题，构成一条完整的 Agentic Engineering 演进路径。其余模块（OpenSpec、Context、Evaluation、Deployment）在 <a :href="withBase('/guide/')">学习地图</a> 中按主题展开。</p>
  <div class="path-grid">
    <a class="path-card" :href="withBase('/guide/skills/')">
      <img class="module-icon" :src="withBase('/icons/skills.svg')" alt="" aria-hidden="true">
      <span>01 · Prompt → Skill</span>
      <strong>Skills</strong>
      <p>从手写 Prompt 到可复用能力模块，建立最小反馈循环。</p>
    </a>
    <a class="path-card" :href="withBase('/guide/mcp/')">
      <img class="module-icon" :src="withBase('/icons/mcp.svg')" alt="" aria-hidden="true">
      <span>02 · Protocol</span>
      <strong>MCP</strong>
      <p>标准化上下文协议，让 Agent 安全地连接外部工具和数据源。</p>
    </a>
    <a class="path-card" :href="withBase('/guide/harness/intro')">
      <img class="module-icon" :src="withBase('/icons/harness.svg')" alt="" aria-hidden="true">
      <span>03 · Quality Gate</span>
      <strong>Harness</strong>
      <p>用测试、Mock、Evaluator 和回归套件验证 AI 输出质量。</p>
    </a>
    <a class="path-card" :href="withBase('/guide/loop-engineering/')">
      <img class="module-icon" :src="withBase('/icons/workflow.svg')" alt="" aria-hidden="true">
      <span>04 · Feedback Loop</span>
      <strong>Loop Engineering</strong>
      <p>OODA 循环、指数退避、熔断器——让 Agent 稳定收敛而非失控。</p>
    </a>
  </div>
</section>

<section class="hub-section">
  <p class="eyebrow">Production Case Study</p>
  <h2>golem — 真实生产级 Agent 系统</h2>
  <p class="lead">golem 是用 Go 实现的生产级 Agent 系统，完整展示 Skills、RAG、MCP 客户端和多 Provider 架构的工程实践。阅读源码是最好的学习方式。</p>
  <div class="path-grid">
    <a class="path-card" href="https://github.com/strings77wzq/golem" target="_blank" rel="noopener">
      <span>Go · Production</span>
      <strong>golem 源码</strong>
      <p>完整 Go Agent 系统：MCP 客户端、RAG 系统、多 Provider 支持。</p>
    </a>
    <a class="path-card" :href="withBase('/guide/golem-case/')">
      <span>Case Study</span>
      <strong>架构解读</strong>
      <p>深入分析 Skill 系统、RAG 管道、MCP 集成和多 Provider 路由。</p>
    </a>
    <a class="path-card" href="https://github.com/code-yeongyu/oh-my-openagent" target="_blank" rel="noopener">
      <span>OMO Framework</span>
      <strong>oh-my-openagent</strong>
      <p>多模型编排系统，11 大 Agent 分类，Category 路由与验证回路。</p>
    </a>
    <a class="path-card" :href="withBase('/guide/omo/')">
      <span>Architecture</span>
      <strong>OMO 架构</strong>
      <p>主编排器、Agent 分类、意图路由与任务分发机制详解。</p>
    </a>
  </div>
</section>

<section class="hub-section">
  <p class="eyebrow">Quality Gates</p>
  <h2>不只是教程——是工程实践</h2>
  <p class="lead">所有文档通过自动化质量门禁，零断链、零路由错误、构建无警告。这是文档站本身对自己提的要求。</p>
  <ul class="quality-list">
    <li><strong>构建</strong>VitePress build 零错误零警告</li>
    <li><strong>链接</strong>100+ 页面零断链（AST 解析）</li>
    <li><strong>路由</strong>侧边栏所有 link 可达</li>
    <li><strong>前言</strong>所有页面有结构化标题</li>
    <li><strong>OpenSpec</strong>变更完整归档，无僵尸 spec</li>
    <li><strong>i18n</strong>中英文导航分离，无错路由</li>
  </ul>
</section>

<style scoped>
.quality-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 32px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
  max-width: 720px;
}

.quality-list li {
  padding: 12px 0;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.5;
}

.quality-list li strong {
  display: inline-block;
  min-width: 88px;
  margin-right: 12px;
  color: var(--vp-c-text-1);
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

@media (max-width: 640px) {
  .quality-list {
    grid-template-columns: 1fr;
  }
}
</style>
