# golem 案例模块

> 真实生产级 Go 项目，展示完整 Agent 系统架构

<a href="https://github.com/strings77wzq/golem" target="_blank" class="github-btn">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-.78-1.765-.645-.345-2.22-.555-2.22-.555-.585-.795-1.455-.795-1.455-1.095-1.635.105-.165.48-.165.72-.165.855 0 1.545.585 1.545 1.545 0 1.185-.015 2.235-.015 2.505 0 .345.255.63.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z"/></svg>
  查看 GitHub 仓库 →
</a>

## 为什么用 golem？

| 特点 | 说明 |
| --- | --- |
| 🏭 **真实项目** | 非玩具示例，是生产级可运行代码 |
| 🐹 **Go 实现** | 展示非 JS/Python 主流的 Go 方案 |
| 🏗️ **完整架构** | Agent Loop → Tool → RAG → MCP → Provider 全链路 |
| 📚 **教学友好** | 核心代码 150-200 行，易于理解 |

## 核心模块

<div class="path-grid" style="grid-template-columns: repeat(2, 1fr);">
  <a class="path-card" href="/ohmyopenAI-tutorial-hub/guide/golem-case/skills-core">
    <span>01</span>
    <strong>Skill 系统</strong>
    <p>可复用 Agent 能力单元的设计与实现</p>
  </a>
  <a class="path-card" href="/ohmyopenAI-tutorial-hub/guide/golem-case/rag-core">
    <span>02</span>
    <strong>RAG 流程</strong>
    <p>检索增强实现的完整流程</p>
  </a>
  <a class="path-card" href="/ohmyopenAI-tutorial-hub/guide/golem-case/mcp-core">
    <span>03</span>
    <strong>MCP 客户端</strong>
    <p>外部工具协议的连接与调用</p>
  </a>
  <a class="path-card" href="/ohmyopenAI-tutorial-hub/guide/golem-case/provider-core">
    <span>04</span>
    <strong>多 Provider</strong>
    <p>LLM 接口抽象与多模型适配</p>
  </a>
</div>

## 学习路径

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Skill系统  │  →  │  RAG流程   │  →  │ MCP客户端  │  →  │Provider适配│
│ 能力封装    │     │  检索增强  │     │ 外部工具   │     │  多模型    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

每个案例包含：架构图 + 精简代码 + 设计要点

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