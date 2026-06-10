# ROADMAP

> 3-week roadmap from `/plan-ceo-review` 2026-06-10. Detailed work items in [TODOS.md](./TODOS.md).
> Full plan: `~/.gstack/projects/ai-tutorial-hub/ceo-plans/2026-06-10-full-quality-uplift.md`

## Mission

把 Agent Engineering Hub 从「内容大纲 + 默认主题」升级为：
- 一个**学习产品**（5 个空壳模块补完，模块间深度一致）
- 一个**设计意图清晰**的开源文档站（anthropic.com 风格：印刷品级 typography + 暖色极简 + 留白驱动）
- 一个**真正中英双语**的项目（19 页缺口补齐 + sidebar 路由 bug 修复）
- 一个**工程基础扎实**的开源参考（local search / Lighthouse 基线 / ROADMAP 透明化）

## Week 1 — Foundation (current)

**Branch**: `chore/week1-foundation`
**Posture**: 4-5 small PRs along change-kind boundaries. Each independently reviewable, revertible.

| PR | Scope | Spec? | Status |
|---|---|---|---|
| PR 1 | EN sidebar route bug (`config.ts`) | No (bug fix) | ✅ done |
| PR 2 | TODOS.md + ROADMAP.md + VitePress local search | No (ops) | ✅ done |
| PR 3 | Lighthouse + axe baseline audit | No (tooling) | 🚧 in progress |
| PR 4 | `design-tokens-extraction` (CSS refactor; zero pixel change) | **Yes** — openspec | 📋 pending |
| PR 5 | `homepage-anthropic-style-redesign` (warm clay + display type + kill effects) | **Yes** — openspec | 📋 pending |

**DoD**: build green, link/route/frontmatter checks pass, screenshot of homepage attached to PR 5, Lighthouse home Performance ≥ 90 / a11y ≥ 95.

## Week 2 — Content Depth (S1)

补完 5 个空壳模块至模块间一致的深度（每模块 4 子页）。

| Module | Current | Target |
|---|---|---|
| Loop Engineering | 1 page × 210 lines | 4 sub-pages |
| Context Engineering | 1 page × 32 lines | 4 sub-pages |
| Evaluation | 1 page × 44 lines | 4 sub-pages |
| Deployment & Safety | 1 page × 43 lines | 4 sub-pages |
| Agent Workflows | 2 pages × 71 lines | 5 sub-pages |

每子页必含：概念 + 操作步骤 + 完整示例 + 练习 + 排错 + 下一步链接。

**DoD**: 每模块 ≥ 4 子页；sidebar 完整反映；链接/前言检查通过；不同模块之间编排一致。

## Week 3 — i18n Parity + golem Cross-refs

- 补齐 EN 19 页缺口 + Week 2 新增的所有中文页同步翻译
- 修复完成后将 OMO / golem-case 章节加回 EN sidebar（以 `/en/` 前缀）
- golem-case 每章末尾加「真实代码位置：golem/src/...」锚点
- examples/ 增加 3 个 starter doc，链接外部可跑示例 repo

**DoD**: EN 与 ZH 页数差 ≤ 2；EN sidebar 所有 link 以 `/en/` 开头；examples 不再是孤儿。

## Beyond Week 3 — Deferred Bucket

见 TODOS.md 的 **Deferred** 段。优先级会随 Week 1-3 完成情况重排：
- S5 学习路径完成度反馈
- S8 站内 changelog
- S9 contributing 教程模板
- Astro Starlight 评估（仅当 VitePress 改不动 anthropic 风格）
- Visual regression（Playwright screenshot suite）
- 内容层 OpenSpec（让教学内容本身被 spec 管理）

## Quality Gates — 始终强制

每次 PR 必须通过：

```bash
npm test           # link + route + frontmatter checks
npm run docs:build # vitepress build, zero errors zero warnings
```

PR 4+5 还需要：
- Lighthouse home: Performance ≥ 90, Accessibility ≥ 95, LCP < 2.5s, CLS < 0.1
- 视觉差异截图（PR 4 必须证明零像素漂移；PR 5 展示新设计）

## How priorities shift

- **如果 Week 1 设计审过不了**：暂停 Week 2，迭代 PR 5 直到用户满意，再恢复 Week 2
- **如果 EN 翻译质量需要更多 human review**：Week 3 拆成 W3a (CC 批量翻译) + W3b (human review pass)
- **如果出现紧急 bug**：插队到 Week 1 同分支处理，标记在 TODOS 顶部
