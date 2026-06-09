---
layout: home
title: Agent Engineering Hub
---

hero:
  name: "Agent Engineering"
  text: "Systematic Agentic Engineering"
  tagline: From Prompt Engineering to Loop Engineering, covering the complete Agentic development stack. A structured learning path across seven dimensions: Skills · MCP · OpenSpec · Harness · Context · Loop.
  image:
    src: /logo.svg
    alt: Agent Engineering Hub
  actions:
    - theme: brand
      text: Start Learning
      link: /en/guide/
    - theme: alt
      text: Quick Start
      link: /en/guide/quickstart
    - theme: alt
      text: GitHub
      link: https://github.com/strings77wzq/agent-engineering-hub

features:
  - title: Skills
    details: Encapsulate Prompts into reusable, testable, evolvable AI capability modules. Learn to design, implement, and publish a production-grade Skill.
    link: /en/guide/skills/what-is-skill
  - title: MCP (Model Context Protocol)
    details: Standardized communication protocol between Agents and external tools. Build MCP Servers with well-defined tools, resources, and safety boundaries.
    link: /en/guide/mcp/
  - title: OpenSpec
    details: Spec-Driven Development (SDD). Lock in requirements, scenarios, and acceptance criteria before writing code through proposal + design + tasks.
    link: /en/guide/openspec/concepts
  - title: Context Engineering
    details: Precise layered information injection within limited context windows. Five-layer model: goals, project knowledge, work state, external knowledge, operational evidence.
    link: /en/guide/context/
  - title: Harness Engineering
    details: AI output quality assurance. R.E.S.T model, six design principles, scenario testing, Mock Server, Evaluators, and regression suites.
    link: /en/guide/harness/intro
  - title: Loop Engineering
    details: Agent "plan—execute—reflect" cycle mechanisms. OODA Loop, three-layer exit, exponential backoff retry, circuit breakers, and multi-source feedback.
    link: /en/guide/loop-engineering/
---

<script setup>
import { withBase } from 'vitepress'
</script>

<section class="hub-section">
  <p class="eyebrow">Learning Pathway</p>
  <h2>Seven Steps: From Prompt to Production Loop</h2>
  <p class="lead">Each dimension solves the limitations of the previous one, forming a complete Agentic Engineering evolution path. Sequential learning yields the best results.</p>
  <div class="path-grid">
    <a class="path-card" :href="withBase('/en/guide/skills/what-is-skill')">
      <img class="module-icon" :src="withBase('/icons/skills.svg')" alt="" aria-hidden="true">
      <span>01 / Prompt → Skill</span>
      <strong>Skills</strong>
      <p>From ad-hoc prompts to reusable capability modules. Build your first feedback loop.</p>
    </a>
    <a class="path-card" :href="withBase('/en/guide/mcp/')">
      <img class="module-icon" :src="withBase('/icons/mcp.svg')" alt="" aria-hidden="true">
      <span>02 / Protocol</span>
      <strong>MCP</strong>
      <p>Standardized context protocol for safely connecting Agents to external tools and data.</p>
    </a>
    <a class="path-card" :href="withBase('/en/guide/openspec/concepts')">
      <img class="module-icon" :src="withBase('/icons/openspec.svg')" alt="" aria-hidden="true">
      <span>03 / Spec-Driven</span>
      <strong>OpenSpec</strong>
      <p>Lock requirements in specification documents. Eliminate intent drift in human-AI collaboration.</p>
    </a>
    <a class="path-card" :href="withBase('/en/guide/harness/intro')">
      <img class="module-icon" :src="withBase('/icons/harness.svg')" alt="" aria-hidden="true">
      <span>04 / Quality Gate</span>
      <strong>Harness</strong>
      <p>Validate AI output quality with tests, mocks, evaluators, and regression suites.</p>
    </a>
    <a class="path-card" :href="withBase('/en/guide/context/')">
      <img class="module-icon" :src="withBase('/icons/context.svg')" alt="" aria-hidden="true">
      <span>05 / Window Mgmt</span>
      <strong>Context Engineering</strong>
      <p>Five-layer context model: precise injection that solves the lost-in-the-middle problem.</p>
    </a>
    <a class="path-card" :href="withBase('/en/guide/evaluation/')">
      <img class="module-icon" :src="withBase('/icons/evaluation.svg')" alt="" aria-hidden="true">
      <span>06 / Release Gate</span>
      <strong>Evaluation & Release</strong>
      <p>Turn acceptance criteria into automated regression checks and safe release gates.</p>
    </a>
    <a class="path-card" :href="withBase('/en/guide/loop-engineering/')">
      <img class="module-icon" :src="withBase('/icons/workflow.svg')" alt="" aria-hidden="true">
      <span>07 / Feedback Loop</span>
      <strong>Loop Engineering</strong>
      <p>OODA cycles, exponential backoff, circuit breakers — converge reliably, never spiral.</p>
    </a>
  </div>
</section>

<section class="hub-section split-section">
  <div>
    <p class="eyebrow">Production Ready</p>
    <h2>Not Just Tutorials — Engineering Practice</h2>
    <p class="lead">Every module includes concepts, step-by-step instructions, exercises, troubleshooting guides, and next-step pointers. All documentation passes build verification, link auditing, and multi-device adaptation.</p>
  </div>
  <div class="check-panel">
    <p>Quality Gates</p>
    <ul>
      <li>VitePress build: zero errors</li>
      <li>Link audit: 100+ pages, zero broken links</li>
      <li>Route validation: all sidebar links reachable</li>
      <li>Frontmatter check: all pages have structured titles</li>
      <li>OpenSpec lifecycle: all changes archived</li>
      <li>Bilingual: complete CN/EN navigation</li>
    </ul>
  </div>
</section>

<section class="hub-section">
  <p class="eyebrow">Production Case Study</p>
  <h2>golem — Real-World Production Agent System</h2>
  <p class="lead">golem is a production-grade Agent system implemented in Go, demonstrating Skills, RAG, MCP client, and multi-Provider architecture. Reading the source code is the best way to learn.</p>
  <div class="path-grid">
    <a class="path-card" href="https://github.com/strings77wzq/golem" target="_blank">
      <span>Go Production</span>
      <strong>golem Source</strong>
      <p>Complete Go Agent system with MCP client, RAG pipeline, and multi-Provider support.</p>
    </a>
    <a class="path-card" :href="withBase('/guide/golem-case/')">
      <span>Case Study</span>
      <strong>Architecture Deep Dive</strong>
      <p>In-depth analysis of golem's Skill system, RAG pipeline, MCP integration, and Provider routing.</p>
    </a>
    <a class="path-card" href="https://github.com/code-yeongyu/oh-my-openagent" target="_blank">
      <span>OMO Framework</span>
      <strong>oh-my-openagent</strong>
      <p>Multi-model orchestration with 11 Agent categories, routing, and verification loops.</p>
    </a>
    <a class="path-card" :href="withBase('/guide/omo/')">
      <span>Architecture</span>
      <strong>OMO Architecture</strong>
      <p>Orchestrator design, Agent taxonomy, intent routing, and task delegation mechanisms.</p>
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
