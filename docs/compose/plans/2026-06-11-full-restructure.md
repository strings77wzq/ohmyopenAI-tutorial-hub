# Agent Engineering Hub 全面重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 Prompt Engineering 和 Tool Use 两个模块（共 12 个中文页面 + 12 个英文页面），更新导航结构和首页学习地图，使文档覆盖完整的 Agent 工程知识体系。

**Architecture:** 在现有 VitePress 文档站基础上，新增两个模块目录（`docs/guide/prompt-engineering/` 和 `docs/guide/tool-use/`），每个模块 6 个子页。更新 `config.ts` 侧边栏导航，重构首页学习地图为三层架构。所有新页面遵循现有设计 token 体系（warm clay 风格）。

**Tech Stack:** VitePress, Markdown, TypeScript (config), CSS (tokens)

**Spec:** `docs/compose/specs/2026-06-11-full-restructure-design.md`

---

## 文件结构

### 新建文件（24 个内容页）

```
docs/guide/prompt-engineering/
  index.md              — 什么是 Prompt Engineering
  design-patterns.md    — 提示词设计模式
  structured.md         — 结构化提示词
  debugging.md          — 调试与迭代
  practice.md           — 实战：构建 Prompt 库
  best-practices.md     — 最佳实践与反模式

docs/guide/tool-use/
  index.md              — 什么是 Tool Use
  tool-definition.md    — 工具定义与描述
  orchestration.md      — 工具选择与编排
  error-handling.md     — 错误处理与重试
  practice.md           — 实战：构建工具集
  safety.md             — 安全边界与权限控制

docs/en/guide/prompt-engineering/
  index.md              — What is Prompt Engineering
  design-patterns.md    — Prompt Design Patterns
  structured.md         — Structured Prompts
  debugging.md          — Debugging & Iteration
  practice.md           — Practice: Build a Prompt Library
  best-practices.md     — Best Practices & Anti-patterns

docs/en/guide/tool-use/
  index.md              — What is Tool Use
  tool-definition.md    — Tool Definition & Description
  orchestration.md      — Tool Selection & Orchestration
  error-handling.md     — Error Handling & Retries
  practice.md           — Practice: Build a Tool Suite
  safety.md             — Safety Boundaries & Permissions
```

### 修改文件

- `docs/.vitepress/config.ts` — 侧边栏导航重构
- `docs/guide/index.md` — 首页学习地图更新
- `docs/en/guide/index.md` — 英文首页学习地图更新

---

## Task 1: Prompt Engineering 中文模块

**Covers:** [S3] Prompt Engineering 模块

**Files:**
- Create: `docs/guide/prompt-engineering/index.md`
- Create: `docs/guide/prompt-engineering/design-patterns.md`
- Create: `docs/guide/prompt-engineering/structured.md`
- Create: `docs/guide/prompt-engineering/debugging.md`
- Create: `docs/guide/prompt-engineering/practice.md`
- Create: `docs/guide/prompt-engineering/best-practices.md`

- [ ] **Step 1: Create index.md — 什么是 Prompt Engineering**

```markdown
---
title: 什么是 Prompt Engineering
description: 从"写提示词"到"工程化设计"的演进
---

# 什么是 Prompt Engineering

> 从"写提示词"到"工程化设计"——系统化地构建、测试、优化与 LLM 的通信方式。

## 这个模块解决什么问题？

（内容：解释 Prompt Engineering 的定义、为什么需要工程化方法、与传统提示词写作的区别）

## 核心概念

（内容：Prompt 的组成要素、LLM 的工作原理简述、token 与上下文窗口）

## 从手工到工程化

（内容：手工调试的局限、版本管理的必要性、测试驱动的提示词设计）

## 学习路径

本模块包含以下章节：

1. [提示词设计模式](/guide/prompt-engineering/design-patterns) — 6 种核心设计模式
2. [结构化提示词](/guide/prompt-engineering/structured) — XML/JSON Schema 方法
3. [调试与迭代](/guide/prompt-engineering/debugging) — A/B 测试与版本管理
4. [实战：构建 Prompt 库](/guide/prompt-engineering/practice) — 从零构建可复用系统
5. [最佳实践](/guide/prompt-engineering/best-practices) — 行业经验与反模式

## 下一步

→ [提示词设计模式](/guide/prompt-engineering/design-patterns)
```

Write this file with full content (150-200 lines). Each section should have real educational content, not placeholders.

- [ ] **Step 2: Create design-patterns.md — 提示词设计模式**

Write full content covering: Zero-shot, Few-shot, Chain-of-Thought, ReAct, Tree-of-Thought, Self-consistency. Each pattern with definition, when to use, example, and tradeoffs. (200-250 lines)

- [ ] **Step 3: Create structured.md — 结构化提示词**

Write full content covering: XML tags for structure, JSON Schema for output, role/system/user message design, output constraints and formatting. (200-250 lines)

- [ ] **Step 4: Create debugging.md — 调试与迭代**

Write full content covering: Common failure modes, A/B testing prompts, version control for prompts, automated evaluation, regression testing. (150-200 lines)

- [ ] **Step 5: Create practice.md — 实战：构建 Prompt 库**

Write full content with a complete hands-on exercise: build a categorized, versioned, reusable prompt library from scratch. (200-250 lines)

- [ ] **Step 6: Create best-practices.md — 最佳实践与反模式**

Write full content covering: Anti-patterns (vagueness, over-specification, role confusion), cost optimization, latency considerations, model-specific tips. (150-200 lines)

- [ ] **Step 7: Verify links**

Run: `npm run docs:check-links 2>&1`
Expected: passed

- [ ] **Step 8: Commit**

```bash
git add docs/guide/prompt-engineering/
git commit -m "feat: add Prompt Engineering module (6 ZH pages)"
```

---

## Task 2: Tool Use 中文模块

**Covers:** [S3] Tool Use 模块

**Files:**
- Create: `docs/guide/tool-use/index.md`
- Create: `docs/guide/tool-use/tool-definition.md`
- Create: `docs/guide/tool-use/orchestration.md`
- Create: `docs/guide/tool-use/error-handling.md`
- Create: `docs/guide/tool-use/practice.md`
- Create: `docs/guide/tool-use/safety.md`

- [ ] **Step 1: Create index.md — 什么是 Tool Use**

```markdown
---
title: 什么是 Tool Use
description: Agent 如何从"只会说话"到"能做事"
---

# 什么是 Tool Use

> 让 LLM 从"只能生成文本"进化为"能调用外部工具完成任务"。

## 这个模块解决什么问题？

（内容：LLM 的能力边界、Tool Use 的定义、与 Function Calling 的关系）

## 核心概念

（内容：工具发现、工具调用、结果解析、多步工具链）

## Tool Use 的演进

（内容：从插件系统到标准化协议、MCP 的角色、未来方向）

## 学习路径

1. [工具定义与描述](/guide/tool-use/tool-definition) — JSON Schema 与参数设计
2. [工具选择与编排](/guide/tool-use/orchestration) — 单工具/链式/并行调用
3. [错误处理与重试](/guide/tool-use/error-handling) — 失败恢复与降级
4. [实战：构建工具集](/guide/tool-use/practice) — 完整工具集案例
5. [安全边界](/guide/tool-use/safety) — 沙箱与权限控制

## 下一步

→ [工具定义与描述](/guide/tool-use/tool-definition)
```

Write this file with full content (150-200 lines).

- [ ] **Step 2: Create tool-definition.md — 工具定义与描述**

Write full content covering: JSON Schema for tool parameters, description writing best practices, parameter naming, required vs optional, nested objects, enums. (200-250 lines)

- [ ] **Step 3: Create orchestration.md — 工具选择与编排**

Write full content covering: Single tool calls, sequential chains, parallel execution, conditional tool selection, tool routing strategies. (200-250 lines)

- [ ] **Step 4: Create error-handling.md — 错误处理与重试**

Write full content covering: Common tool failures, retry strategies, timeout handling, graceful degradation, fallback tools, error reporting to LLM. (150-200 lines)

- [ ] **Step 5: Create practice.md — 实战：构建工具集**

Write full content with a complete hands-on exercise: build a tool suite with file operations, API calls, and data queries. (200-250 lines)

- [ ] **Step 6: Create safety.md — 安全边界与权限控制**

Write full content covering: Sandboxing strategies, permission models, dangerous operation guards, rate limiting, audit logging. (150-200 lines)

- [ ] **Step 7: Verify links**

Run: `npm run docs:check-links 2>&1`
Expected: passed

- [ ] **Step 8: Commit**

```bash
git add docs/guide/tool-use/
git commit -m "feat: add Tool Use module (6 ZH pages)"
```

---

## Task 3: Prompt Engineering 英文模块

**Covers:** [S3] Prompt Engineering EN translation

**Files:**
- Create: `docs/en/guide/prompt-engineering/` (6 files)

- [ ] **Step 1-6: Translate all 6 pages**

For each page in `docs/guide/prompt-engineering/`, read the Chinese source and write a complete English translation to `docs/en/guide/prompt-engineering/`. Preserve frontmatter (translate title), heading structure, code examples (translate comments), and links.

Pages: index.md, design-patterns.md, structured.md, debugging.md, practice.md, best-practices.md

- [ ] **Step 7: Verify links**

Run: `npm run docs:check-links 2>&1`

- [ ] **Step 8: Commit**

```bash
git add docs/en/guide/prompt-engineering/
git commit -m "feat: add Prompt Engineering module (6 EN pages)"
```

---

## Task 4: Tool Use 英文模块

**Covers:** [S3] Tool Use EN translation

**Files:**
- Create: `docs/en/guide/tool-use/` (6 files)

- [ ] **Step 1-6: Translate all 6 pages**

For each page in `docs/guide/tool-use/`, read the Chinese source and write a complete English translation to `docs/en/guide/tool-use/`. Preserve frontmatter, heading structure, code examples, and links.

Pages: index.md, tool-definition.md, orchestration.md, error-handling.md, practice.md, safety.md

- [ ] **Step 7: Verify links**

Run: `npm run docs:check-links 2>&1`

- [ ] **Step 8: Commit**

```bash
git add docs/en/guide/tool-use/
git commit -m "feat: add Tool Use module (6 EN pages)"
```

---

## Task 5: 更新导航结构

**Covers:** [S5] 导航结构

**Files:**
- Modify: `docs/.vitepress/config.ts`

- [ ] **Step 1: 更新 zhGuideSidebar**

Add two new sections to `zhGuideSidebar`:

```typescript
{
  text: '基础层 Foundation',
  collapsed: false,
  items: [
    { text: 'Prompt Engineering', link: '/guide/prompt-engineering/' },
    { text: '提示词设计模式', link: '/guide/prompt-engineering/design-patterns' },
    { text: '结构化提示词', link: '/guide/prompt-engineering/structured' },
    { text: '调试与迭代', link: '/guide/prompt-engineering/debugging' },
    { text: '实战：构建 Prompt 库', link: '/guide/prompt-engineering/practice' },
    { text: '最佳实践', link: '/guide/prompt-engineering/best-practices' },
  ],
},
{
  text: 'Tool Use',
  collapsed: false,
  items: [
    { text: '什么是 Tool Use', link: '/guide/tool-use/' },
    { text: '工具定义与描述', link: '/guide/tool-use/tool-definition' },
    { text: '工具选择与编排', link: '/guide/tool-use/orchestration' },
    { text: '错误处理与重试', link: '/guide/tool-use/error-handling' },
    { text: '实战：构建工具集', link: '/guide/tool-use/practice' },
    { text: '安全边界', link: '/guide/tool-use/safety' },
  ],
},
```

Insert these as the first two sections after "开始".

- [ ] **Step 2: 更新 enGuideSidebar**

Add corresponding English sections:

```typescript
{
  text: 'Foundation',
  collapsed: false,
  items: [
    { text: 'Prompt Engineering', link: '/en/guide/prompt-engineering/' },
    { text: 'Design Patterns', link: '/en/guide/prompt-engineering/design-patterns' },
    { text: 'Structured Prompts', link: '/en/guide/prompt-engineering/structured' },
    { text: 'Debugging & Iteration', link: '/en/guide/prompt-engineering/debugging' },
    { text: 'Practice', link: '/en/guide/prompt-engineering/practice' },
    { text: 'Best Practices', link: '/en/guide/prompt-engineering/best-practices' },
  ],
},
{
  text: 'Tool Use',
  collapsed: false,
  items: [
    { text: 'What is Tool Use', link: '/en/guide/tool-use/' },
    { text: 'Tool Definition', link: '/en/guide/tool-use/tool-definition' },
    { text: 'Orchestration', link: '/en/guide/tool-use/orchestration' },
    { text: 'Error Handling', link: '/en/guide/tool-use/error-handling' },
    { text: 'Practice', link: '/en/guide/tool-use/practice' },
    { text: 'Safety', link: '/en/guide/tool-use/safety' },
  ],
},
```

Insert as the first two sections after "Get Started".

- [ ] **Step 3: Verify routes**

Run: `npm run docs:check-routes 2>&1`
Expected: passed

- [ ] **Step 4: Verify build**

Run: `npm run docs:build 2>&1`
Expected: build complete, zero errors

- [ ] **Step 5: Commit**

```bash
git add docs/.vitepress/config.ts
git commit -m "feat: update sidebar navigation with Prompt Engineering and Tool Use modules"
```

---

## Task 6: 更新首页学习地图

**Covers:** [S4] 首页更新

**Files:**
- Modify: `docs/guide/index.md`
- Modify: `docs/en/guide/index.md`

- [ ] **Step 1: 更新 ZH 首页学习地图**

Replace the learning-map div and recommended paths with the new three-layer architecture:

```markdown
## 学习路径

### 🔧 基础层 Foundation

<div class="learning-map">
  <a href="/guide/prompt-engineering/"><strong>Prompt Engineering</strong><span>系统化提示词设计</span></a>
  <a href="/guide/tool-use/"><strong>Tool Use</strong><span>Agent 工具调用</span></a>
  <a href="/guide/context/"><strong>Context Engineering</strong><span>上下文窗口设计</span></a>
</div>

### 🏗️ 构建层 Build

<div class="learning-map">
  <a href="/guide/skills/what-is-skill"><strong>Skills</strong><span>可复用能力模块</span></a>
  <a href="/guide/mcp/"><strong>MCP</strong><span>标准化通信协议</span></a>
  <a href="/guide/openspec/concepts"><strong>OpenSpec</strong><span>规格驱动开发</span></a>
</div>

### ✅ 质量层 Quality

<div class="learning-map">
  <a href="/guide/harness/intro"><strong>Harness</strong><span>AI 输出质量验证</span></a>
  <a href="/guide/evaluation/"><strong>Evaluation</strong><span>评测与回归</span></a>
  <a href="/guide/loop-engineering/"><strong>Loop Engineering</strong><span>闭环迭代控制</span></a>
</div>

### 🚀 实战

<div class="learning-map">
  <a href="/guide/golem-case/"><strong>golem</strong><span>生产级实战案例</span></a>
  <a href="/guide/omo/"><strong>OMO</strong><span>多模型编排系统</span></a>
</div>
```

Also update the recommended paths (初学者/工程实践/架构师) to include the new modules.

- [ ] **Step 2: 更新 EN 首页学习地图**

Apply the same three-layer structure in English.

- [ ] **Step 3: Verify build**

Run: `npm run docs:build 2>&1`

- [ ] **Step 4: Commit**

```bash
git add docs/guide/index.md docs/en/guide/index.md
git commit -m "feat: update homepage learning map with three-layer architecture"
```

---

## Task 7: 最终验证

**Covers:** [S6] 全量验证

- [ ] **Step 1: Run all quality checks**

```bash
npm test 2>&1
```
Expected: all passed (links, routes, frontmatter, stale)

- [ ] **Step 2: Build**

```bash
npm run docs:build 2>&1
```
Expected: build complete, zero errors

- [ ] **Step 3: Verify page count**

```bash
find docs/guide docs/en/guide -name "*.md" | wc -l
```
Expected: ~170+ pages (was ~142, adding 24 new)

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final verification — all checks pass"
```
