# golem Case Study

> A real production-grade Go Agent system with complete architecture

<a href="https://github.com/strings77wzq/golem" target="_blank" class="github-btn">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-.78-1.765-.645-.345-2.22-.555-2.22-.555-.585-.795-1.455-.795-1.455-1.095-1.635.105-.165.48-.165.72-.165.855 0 1.545.585 1.545 1.545 0 1.185-.015 2.235-.015 2.505 0 .345.255.63.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z"/></svg>
  View on GitHub →
</a>

## Why golem?

| Feature | Description |
|---------|-------------|
| Real Production | Not a toy example; production-grade, runnable code |
| Go Implementation | Demonstrates non-JS/Python Agent architecture in Go |
| Complete Architecture | Agent Loop → Tool → RAG → MCP → Provider |
| Teaching-Friendly | Core code ~150-200 lines, easy to understand |

## Core Modules

> **Language note**: Detailed golem case-study pages are currently available in [Chinese (简体中文)](/guide/golem-case/). English translations are planned — track progress in [TODOS.md](https://github.com/strings77wzq/agent-engineering-hub/blob/main/TODOS.md).

<div class="path-grid" style="grid-template-columns: repeat(2, 1fr);">
  <a class="path-card" href="/guide/golem-case/skills-core">
    <span>01</span>
    <strong>Skill System</strong>
    <p>Design and implementation of reusable Agent capability units</p>
  </a>
  <a class="path-card" href="/guide/golem-case/rag-core">
    <span>02</span>
    <strong>RAG Pipeline</strong>
    <p>Retrieval-Augmented Generation from ingestion to query</p>
  </a>
  <a class="path-card" href="/guide/golem-case/mcp-core">
    <span>03</span>
    <strong>MCP Client</strong>
    <p>Connecting and invoking external tool protocols</p>
  </a>
  <a class="path-card" href="/guide/golem-case/provider-core">
    <span>04</span>
    <strong>Multi-Provider</strong>
    <p>LLM interface abstraction and multi-model adaptation</p>
  </a>
</div>

## Learning Path

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Skill System│  →  │ RAG Pipeline│  →  │ MCP Client  │  →  │Provider     │
│  Capability  │     │  Retrieval  │     │  External   │     │Adaptation   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

Each case includes: architecture diagram + concise code + design notes.

## Next Step

Read the [Skill System](/guide/golem-case/skills-core) chapter in Chinese, or return to the [Learning Map](/en/guide/).

<style>
.github-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #24292e;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}
.github-btn:hover {
  background: #2f363d;
  transform: translateY(-1px);
}
</style>
