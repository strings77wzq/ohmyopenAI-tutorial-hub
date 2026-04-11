---
layout: home

hero:
  name: "Agent Engineering Hub"
  text: "A field guide for production-grade agent systems"
  tagline: An open-source learning system for Skills, MCP, OpenSpec, Harnesses, context engineering, evaluation, and safe release workflows.
  image:
    src: /logo.svg
    alt: Agent Engineering Hub identity mark
  actions:
    - theme: brand
      text: Start Learning
      link: /en/guide/quickstart
    - theme: alt
      text: View Learning Map
      link: /en/guide/
    - theme: alt
      text: GitHub
      link: https://github.com/strings77wzq/ohmyopenAI-tutorial-hub

features:
  - title: Skills
    details: Package repeated work into reusable, testable, evolvable AI capabilities.
    link: /en/guide/skills/what-is-skill
  - title: MCP
    details: Connect tools, resources, and agent workflows through a standard context interface.
    link: /en/guide/mcp/
  - title: OpenSpec
    details: Lock requirements, scenarios, and acceptance criteria before implementation.
    link: /en/guide/openspec/concepts
  - title: Harness
    details: Validate AI output with scenarios, mocks, evaluators, and regression suites.
    link: /en/guide/harness/intro
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
    <p>Agent Engineering Hub is not a loose note collection. It is a learning system that can be built, checked, demonstrated, and extended: no broken navigation, runnable examples, reviewable tasks, and clear contribution paths.</p>
  </div>
  <div class="check-panel">
    <p>Quality gates</p>
    <ul>
      <li>Local build passes</li>
      <li>Internal link audit has zero failures</li>
      <li>Chinese and English navigation points to real pages</li>
      <li>Desktop and mobile paths are reviewed</li>
    </ul>
  </div>
</section>
