---
layout: home

hero:
  name: "Agent Engineering Hub"
  text: "智能体工程学习枢纽"
  tagline: 面向工程团队的开源学习系统，贯通 Skills、MCP、OpenSpec、Harness、上下文工程、评测与安全发布。
  image:
    src: /logo.svg
    alt: Agent Engineering Hub 智能体工程学习枢纽标识
  actions:
    - theme: brand
      text: 开始学习
      link: /guide/quickstart
    - theme: alt
      text: 查看学习地图
      link: /guide/
    - theme: alt
      text: GitHub
      link: https://github.com/strings77wzq/agent-engineering-hub

features:
  - title: Skills
    details: 把重复工作沉淀成可调用、可测试、可演进的 AI 能力模块。
    link: /guide/skills/what-is-skill
  - title: MCP
    details: 用标准化上下文接口连接工具、资源和 Agent 工作流。
    link: /guide/mcp/
  - title: OpenSpec
    details: 在编码前锁定需求、场景和验收标准，减少人机协作偏差。
    link: /guide/openspec/concepts
  - title: Harness
    details: 用场景、Mock、Evaluator 和回归套件验证 AI 输出质量。
    link: /guide/harness/intro
---

<script setup>
import { withBase } from 'vitepress'
</script>

<section class="hub-section">
  <p class="eyebrow">Agent Engineering System</p>
  <h2>从可复用能力到可验证发布</h2>
  <p class="lead">先建立最小反馈循环，再把 Skills、MCP、OpenSpec、Harness、检索、评测和部署安全纳入同一条工程链路。每个模块都包含概念、步骤、练习、排错和下一步。</p>
  <div class="path-grid">
    <a class="path-card" href="/guide/quickstart">
      <img class="module-icon" :src="withBase('/icons/skills.svg')" alt="" aria-hidden="true">
      <span>01 / Feedback Loop</span>
      <strong>快速开始</strong>
      <p>5 分钟创建第一个 Skill，建立最小反馈循环。</p>
    </a>
    <a class="path-card" href="/guide/mcp/">
      <img class="module-icon" :src="withBase('/icons/mcp.svg')" alt="" aria-hidden="true">
      <span>02 / Context Protocol</span>
      <strong>MCP 与上下文</strong>
      <p>理解工具、资源、提示和上下文边界如何被 Agent 使用。</p>
    </a>
    <a class="path-card" href="/guide/harness/intro">
      <img class="module-icon" :src="withBase('/icons/harness.svg')" alt="" aria-hidden="true">
      <span>03 / Quality Harness</span>
      <strong>质量 Harness</strong>
      <p>用场景、Mock Server、Evaluator 和 trace 固化质量。</p>
    </a>
    <a class="path-card" href="/guide/evaluation/">
      <img class="module-icon" :src="withBase('/icons/evaluation.svg')" alt="" aria-hidden="true">
      <span>04 / Release Gate</span>
      <strong>评测与发布</strong>
      <p>把验收标准变成回归检查，安全地把教程和示例交付出去。</p>
    </a>
  </div>
</section>

<section class="hub-section split-section">
  <div>
    <p class="eyebrow">Open Source Readiness</p>
    <h2>让学习内容具备工程可信度</h2>
    <p>Agent Engineering Hub 不是零散笔记，而是一套可以被构建、检查、演示和持续贡献的学习系统：导航不 404，示例能运行，任务有验收标准，贡献者知道如何扩展内容。</p>
  </div>
  <div class="check-panel">
    <p>质量门禁</p>
    <ul>
      <li>本地构建必须通过</li>
      <li>内部链接检查必须为零断链</li>
      <li>中英文导航必须指向真实页面</li>
      <li>关键路径必须经过桌面和移动端检查</li>
    </ul>
  </div>
</section>
