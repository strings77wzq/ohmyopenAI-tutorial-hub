---
layout: page
title: Agent Engineering Hub
titleTemplate: false
---

<script setup>
import { withBase } from 'vitepress'
</script>

<div class="Home">

  <section class="Hero">
    <p class="Hero-eyebrow">Agent Engineering Hub</p>
    <h1 class="Hero-title">From Prompt to Production Loop<br>A systematic path through Agentic Engineering</h1>
    <p class="Hero-lead">Seven dimensions: Skills · MCP · OpenSpec · Harness · Context · Loop. Each solves the problems left by the previous — a complete technology evolution path for AI engineering.</p>
    <div class="Hero-actions">
      <a class="Hero-cta" :href="withBase('/en/guide/')">Start Learning</a>
      <a class="Hero-link" href="https://github.com/strings77wzq/agent-engineering-hub" target="_blank" rel="noopener">GitHub →</a>
    </div>
  </section>

  <section class="Modules">
    <h2 class="Modules-title">Learning Path</h2>
    <div class="Modules-grid">
      <a class="Module-item" :href="withBase('/en/guide/skills/what-is-skill')">
        <span class="Module-num">01</span>
        <div><strong class="Module-name">Skills</strong><span class="Module-desc">Reusable AI capability modules</span></div>
      </a>
      <a class="Module-item" :href="withBase('/en/guide/mcp/')">
        <span class="Module-num">02</span>
        <div><strong class="Module-name">MCP</strong><span class="Module-desc">Standard context protocol</span></div>
      </a>
      <a class="Module-item" :href="withBase('/en/guide/openspec/concepts')">
        <span class="Module-num">03</span>
        <div><strong class="Module-name">OpenSpec</strong><span class="Module-desc">Spec-driven development</span></div>
      </a>
      <a class="Module-item" :href="withBase('/en/guide/harness/intro')">
        <span class="Module-num">04</span>
        <div><strong class="Module-name">Harness</strong><span class="Module-desc">AI output quality gates</span></div>
      </a>
      <a class="Module-item" :href="withBase('/en/guide/context/')">
        <span class="Module-num">05</span>
        <div><strong class="Module-name">Context</strong><span class="Module-desc">Context window design</span></div>
      </a>
      <a class="Module-item" :href="withBase('/en/guide/loop-engineering/')">
        <span class="Module-num">06</span>
        <div><strong class="Module-name">Loop</strong><span class="Module-desc">Closed-loop iteration control</span></div>
      </a>
    </div>
    <p class="Modules-more">
      <a :href="withBase('/en/guide/')">Full Learning Map →</a>
      <span class="Modules-more-note">Including deployment, evaluation, workflows, OMO, golem and more</span>
    </p>
  </section>

  <section class="Case">
    <h2 class="Case-title">Case Study</h2>
    <div class="Case-grid">
      <a class="Case-card" href="https://github.com/strings77wzq/golem" target="_blank" rel="noopener">
        <span class="Case-label">Open Source</span>
        <strong class="Case-name">golem</strong>
        <p class="Case-desc">A production-grade Go Agent system. Skills · RAG · MCP client · Multi-provider. Core code ~150-200 lines, teaching-friendly.</p>
        <span class="Case-link">GitHub →</span>
      </a>
      <a class="Case-card" :href="withBase('/en/guide/golem-case/')">
        <span class="Case-label">Case Study</span>
        <strong class="Case-name">Architecture Deep Dive</strong>
        <p class="Case-desc">Analyze golem's Skill system design, RAG pipeline, MCP integration patterns, and multi-provider routing.</p>
        <span class="Case-link">Read Docs →</span>
      </a>
    </div>
  </section>

  <footer class="Foot">
    <p>
      <span>121 pages</span>
      <span>Zero dead links</span>
      <span>Zero build warnings</span>
      <span>CN / EN bilingual</span>
      <span>MIT licensed</span>
    </p>
  </footer>

</div>

<style>
/* ===== Homepage Minimal ===== */
.Home { max-width: 800px; margin: 0 auto; padding: 0 24px; background: linear-gradient(180deg, rgba(192,122,94,0.04) 0%, transparent 400px); }

.Hero { padding: 120px 0 80px; }
.Hero-eyebrow { margin: 0 0 16px; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--vp-c-brand-1); }
.Hero-title { margin: 0 0 24px; font-size: clamp(2.25rem, 1.5rem + 4vw, 3.75rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.03em; color: var(--vp-c-text-1); }
.Hero-lead { max-width: 600px; margin: 0 0 36px; font-size: 1.0625rem; line-height: 1.75; color: var(--vp-c-text-2); }
.Hero-actions { display: flex; align-items: center; gap: 20px; }
.Hero-cta { display: inline-flex; align-items: center; height: 42px; padding: 0 22px; border-radius: 6px; background: var(--vp-c-brand-1); color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; transition: background 0.15s; }
.Hero-cta:hover { background: var(--vp-c-brand-2); }
.Hero-link { font-size: 15px; font-weight: 500; color: var(--vp-c-text-2); text-decoration: none; transition: color 0.15s; }
.Hero-link:hover { color: var(--vp-c-text-1); }

.Modules { padding: 0 0 80px; border-top: 1px solid var(--vp-c-divider); padding-top: 64px; }
.Modules-title { margin: 0 0 32px; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.01em; }
.Modules-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin: 0; }
.Module-item { display: flex; align-items: flex-start; gap: 10px; padding: 14px 12px 14px 0; text-decoration: none !important; border-radius: 5px; transition: background 0.12s; }
.Module-item:hover { background: var(--vp-c-bg-soft); }
.Module-num { flex-shrink: 0; width: 24px; text-align: right; font-size: 11px; font-weight: 600; color: var(--vp-c-text-3); padding-top: 2px; font-variant-numeric: tabular-nums; }
.Module-name { display: block; font-size: 14px; font-weight: 650; color: var(--vp-c-text-1); line-height: 1.3; }
.Module-desc { display: block; font-size: 12px; color: var(--vp-c-text-3); line-height: 1.4; margin-top: 1px; }
.Modules-more { margin: 24px 0 0; display: flex; align-items: center; gap: 16px; }
.Modules-more a { font-size: 14px; font-weight: 600; color: var(--vp-c-brand-1); text-decoration: none; }
.Modules-more a:hover { text-decoration: underline; }
.Modules-more-note { font-size: 12px; color: var(--vp-c-text-3); }

.Case { padding: 0 0 80px; border-top: 1px solid var(--vp-c-divider); padding-top: 64px; }
.Case-title { margin: 0 0 28px; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.01em; }
.Case-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.Case-card { display: flex; flex-direction: column; padding: 28px; border: 1px solid var(--vp-c-divider); border-radius: 6px; text-decoration: none !important; transition: border-color 0.15s, background 0.15s; }
.Case-card:hover { border-color: var(--vp-c-brand-1); background: var(--vp-c-bg-soft); }
.Case-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--vp-c-text-3); margin-bottom: 10px; }
.Case-name { font-size: 1.125rem; font-weight: 700; color: var(--vp-c-text-1); margin-bottom: 10px; }
.Case-desc { margin: 0 0 16px; font-size: 14px; line-height: 1.65; color: var(--vp-c-text-2); flex: 1; }
.Case-link { font-size: 13px; font-weight: 600; color: var(--vp-c-brand-1); }

.Foot { padding: 40px 0 60px; border-top: 1px solid var(--vp-c-divider); }
.Foot p { display: flex; flex-wrap: wrap; gap: 24px; margin: 0; font-size: 13px; color: var(--vp-c-text-3); }

@media (max-width: 768px) { .Hero { padding: 80px 0 56px; } .Modules-grid { grid-template-columns: repeat(2, 1fr); } .Case-grid { grid-template-columns: 1fr; } }
@media (max-width: 480px) { .Hero { padding: 56px 0 40px; } .Hero-title { font-size: 1.75rem; } .Hero-actions { flex-direction: column; align-items: flex-start; } .Modules-grid { grid-template-columns: 1fr; } .Foot p { gap: 12px; } }
</style>
