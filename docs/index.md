---
layout: home

hero:
  name: "AI Agent 教程"
  text: "智能体工程 · 系统化学习"
  tagline: "从概念到实战，从工具到架构。OMO 工作流 + golem 真实案例 + Harness 工程化的完整学习路径。"
  image:
    src: /logo.svg
    alt: AI Agent 教程标识
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quickstart
    - theme: alt
      text: 学习地图
      link: /guide/
    - theme: alt
      text: GitHub
      link: https://github.com/strings77wzq/ohmyopenAI-tutorial-hub

features:
  - title: OMO 工作流
    details: "Oh-My-OpenAgent 多模型编排系统。GitHub: github.com/code-yeongyu/oh-my-openagent"
    link: https://github.com/code-yeongyu/oh-my-openagent
  - title: golem 案例
    details: "生产级 Go 项目实战。GitHub: github.com/strings77wzq/golem | 社区: skills.sh"
    link: https://github.com/strings77wzq/golem
  - title: MCP
    details: "Model Context Protocol 标准化协议。官方: modelcontextprotocol.io | 社区生态"
    link: https://modelcontextprotocol.io
  - title: Harness
    details: "AI 输出质量保障。R.E.S.T模型、六大设计原则。参考: mp.weixin.qq.com"
    link: /guide/harness/intro
  - title: Skills 生态
    details: "发现 AI Skills: skills.sh - 社区驱动的 AI 能力库"
    link: https://skills.sh
  - title: OpenSpec
    details: "规格驱动开发 SDD - 三阶段文档：spec/tasks/checklist"
    link: /guide/openspec/concepts
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
    <p>AI Agent 教程不是零散笔记，而是一套经过严格质量把控的学习系统。每个文档都经过构建验证、链接检查和多端测试，确保学习体验流畅可靠。</p>
  </div>
  <div class="check-panel">
    <p>质量标准</p>
    <ul>
      <li>本地构建验证通过</li>
      <li>内部链接零断链</li>
      <li>中英文导航完整</li>
      <li>多端响应式适配</li>
    </ul>
  </div>
</section>

<section class="hub-section">
  <p class="eyebrow">What's New</p>
  <h2>最新更新</h2>
  <div class="changelog-grid">
    <div class="changelog-item">
      <span class="version">v1.0.0</span>
      <span class="date">2026-04-11</span>
      <h3>OMO 工作流模块正式发布</h3>
      <ul>
        <li>新增 OMO 工作流和架构设计（8 篇）</li>
        <li>新增 golem 真实案例模块（5 篇）</li>
        <li>深化 Harness 工程（反馈循环 + 熵管理）</li>
        <li>更新侧边栏导航</li>
      </ul>
    </div>
    <div class="changelog-item">
      <span class="version">v0.9.0</span>
      <span class="date">2026-03</span>
      <h3>初始版本</h3>
      <ul>
        <li>Skills 教程模块</li>
        <li>MCP 教程模块</li>
        <li>OpenSpec 教程模块</li>
        <li>Harness 工程入门</li>
      </ul>
    </div>
  </div>
</section>

<style scoped>
.changelog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.changelog-item {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.changelog-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px -16px var(--vp-c-brand);
  border-color: var(--vp-c-brand-1);
}

.dark .changelog-item:hover {
  box-shadow: 0 12px 32px -16px rgba(15, 159, 143, 0.3);
}

.changelog-item .version {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
}

.changelog-item .date {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  margin-left: 0.75rem;
  vertical-align: middle;
}

.changelog-item h3 {
  margin: 1rem 0 0.5rem;
  font-size: 1.125rem;
}

.changelog-item ul {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--vp-c-text-2);
}

.changelog-item li {
  margin: 0.25rem 0;
}

@media (max-width: 640px) {
  .changelog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
