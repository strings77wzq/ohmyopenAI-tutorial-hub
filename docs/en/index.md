---
layout: home

hero:
  name: "AI Agent Tutorial"
  text: "Agent Engineering · Systematic Learning"
  tagline: "From concepts to practice, tools to architecture. Complete learning path: OMO workflow + golem case study + Harness engineering."
  image:
    src: /logo.svg
    alt: AI Agent Tutorial identity mark
  actions:
    - theme: brand
      text: Quick Start
      link: /en/guide/quickstart
    - theme: alt
      text: Learning Map
      link: /en/guide/
    - theme: alt
      text: GitHub
      link: https://github.com/strings77wzq/agent-engineering-hub

features:
  - title: OMO Workflow
    details: "Oh-My-OpenAgent multi-model orchestration. GitHub: github.com/code-yeongyu/oh-my-openagent"
    link: https://github.com/code-yeongyu/oh-my-openagent
  - title: golem Case Study
    details: "Production-grade Go project. GitHub: github.com/strings77wzq/golem | Community: skills.sh"
    link: https://github.com/strings77wzq/golem
  - title: MCP
    details: "Model Context Protocol. Official: modelcontextprotocol.io | Community ecosystem"
    link: https://modelcontextprotocol.io
  - title: Harness
    details: "AI output quality assurance. R.E.S.T model, six design principles."
    link: /en/guide/harness/intro
  - title: Skills Ecosystem
    details: "Discover AI Skills: skills.sh - Community-driven AI capability library"
    link: https://skills.sh
  - title: OpenSpec
    details: "Spec-Driven Development (SDD) - Three-phase docs: spec/tasks/checklist"
    link: /en/guide/openspec/concepts
---

<script setup>
import { withBase } from 'vitepress'
</script>

<section class="hub-section">
  <p class="eyebrow">Agent Engineering System</p>
  <h2>From reusable capability to verified release</h2>
  <p class="lead">Start with a tight feedback loop, then bring Skills, MCP, OpenSpec, Harnesses, retrieval, evaluation, and deployment safety into one engineering chain. Each module includes concepts, steps, practice, troubleshooting, and next links.</p>
  <div class="path-grid">
    <a class="path-card" href="/en/guide/quickstart">
      <img class="module-icon" :src="withBase('/icons/skills.svg')" alt="" aria-hidden="true">
      <span>01 / Feedback Loop</span>
      <strong>Quick Start</strong>
      <p>Create your first Skill and establish a tight feedback loop.</p>
    </a>
    <a class="path-card" href="/en/guide/mcp/">
      <img class="module-icon" :src="withBase('/icons/mcp.svg')" alt="" aria-hidden="true">
      <span>02 / Context Protocol</span>
      <strong>MCP and Context</strong>
      <p>Learn how tools, resources, prompts, and boundaries reach an agent.</p>
    </a>
    <a class="path-card" href="/en/guide/harness/intro">
      <img class="module-icon" :src="withBase('/icons/harness.svg')" alt="" aria-hidden="true">
      <span>03 / Quality Harness</span>
      <strong>Quality Harness</strong>
      <p>Use scenarios, mock servers, evaluators, and traces to protect quality.</p>
    </a>
    <a class="path-card" href="/en/guide/evaluation/">
      <img class="module-icon" :src="withBase('/icons/evaluation.svg')" alt="" aria-hidden="true">
      <span>04 / Release Gate</span>
      <strong>Evaluation and Release</strong>
      <p>Turn acceptance criteria into regression checks and release gates.</p>
    </a>
  </div>
</section>

<section class="hub-section split-section">
  <div>
    <p class="eyebrow">Open Source Readiness</p>
    <h2>Learning content with engineering credibility</h2>
    <p>AI Agent Tutorial is a rigorously quality-controlled learning system. Every document is verified through build checks, link audits, and multi-device testing.</p>
  </div>
  <div class="check-panel">
    <p>Quality Standards</p>
    <ul>
      <li>Local build verified</li>
      <li>Zero broken links</li>
      <li>Bilingual navigation complete</li>
      <li>Responsive design tested</li>
    </ul>
  </div>
</section>

<section class="hub-section">
  <p class="eyebrow">What's New</p>
  <h2>Latest Updates</h2>
  <div class="changelog-grid">
    <div class="changelog-item">
      <span class="version">v1.0.0</span>
      <span class="date">2026-04-11</span>
      <h3>OMO Workflow Module Released</h3>
      <ul>
        <li>New OMO workflow and architecture (8 articles)</li>
        <li>New golem case study module (5 articles)</li>
        <li>Harness engineering deep dive (feedback loop + entropy)</li>
        <li>Sidebar navigation updated</li>
      </ul>
    </div>
    <div class="changelog-item">
      <span class="version">v0.9.0</span>
      <span class="date">2026-03</span>
      <h3>Initial Release</h3>
      <ul>
        <li>Skills tutorial module</li>
        <li>MCP tutorial module</li>
        <li>OpenSpec tutorial module</li>
        <li>Harness engineering basics</li>
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
