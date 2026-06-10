# Design Tokens Extraction — Design Notes

## Context

- VitePress 1.6.4 默认主题继承允许在 `docs/.vitepress/theme/custom.css` 注入任意 CSS
- 当前 `custom.css` = 636 行；项目 hooks 规则上限 800 行，下次设计迭代必越线
- CSS 原生 `@import` 在 vite 构建中会被打平到单个 chunk，无运行时多 HTTP 请求开销

## Why split into 4 token files (not 1, not 8)

| 方案 | 文件数 | 优点 | 缺点 |
|---|---|---|---|
| 单一 `tokens.css` | 1 | 最简单 | 仍是大文件，分类模糊，下次还要拆 |
| **分 4 类：colors / type / spacing / motion** | 4 | 与 design system 通用语义对齐；每类边界清晰；任一类可独立 fork 出主题 | 需要约定文件边界 |
| 按组件分（hero.css, feature.css, ...） | 8+ | 高内聚 | 跨组件共享变量难放置；token 与样式混杂 |

选 4 类。这是 design system 业界主流分法（参见 Tailwind、Radix、anthropic 自身的 design token 结构），并且每类 ≤ 200 行容易维护。

## What is a token vs what is a style rule

- **Token**（进 tokens/）：`:root { --foo: <值> }` 形式的变量定义
- **Style rule**（留 custom.css）：选择器 + 属性，只能用 `var(--foo)` 引用 token，不允许出现裸数字（颜色除非透明叠加用 `color-mix` 派生 / 间距除非 0）

灰色地带规则：
- `color-mix(...)` 计算颜色 → 留在使用处（custom.css），因为它依赖 token 而不是定义 token
- `clamp(...)` 响应式字号 → 进 typography.css（它是 token 的定义形式，不是消费）
- `@media (prefers-reduced-motion)` → 进 motion.css，因为它语义属于动效层

## Risk: cascade order changes leak pixels

`@import` 的 CSS rule 总是被插到引入它的样式表顶部、且按 @import 出现顺序。如果原来 `custom.css` 的某条规则依赖了「`:root` 在文件开头声明」这一隐式顺序，拆分后可能因为 @import 把 `:root` 推前/推后导致 specificity 顺序变化。

缓解：
1. 4 个 @import 全部放在 custom.css 文件最顶（vitepress 注入主样式表之后第一行）
2. 严格按 colors → typography → spacing → motion 顺序导入（与原文件中的声明顺序一致）
3. 拆后立即跑视觉 diff，不仅依赖 build 通过

## Why not switch to PostCSS / CSS-in-JS now

- 项目已稳定使用 vanilla CSS + VitePress 默认主题
- 引入 PostCSS / Stitches / vanilla-extract 是一张「innovation token」（Choose Boring Technology）— 应该花在能直接转化为用户价值的事上
- 当前问题（636 行单文件 + 重设计准备）用原生 CSS @import 完全解决
- 如果后续 PR 5/6 发现 token 数量爆炸（>50 个），再考虑 PostCSS-token-replacer 或类似工具

## Out of scope

- ❌ 不引入 design system 文档（Storybook、Style Dictionary）— 5 个内部 CSS 文件不够规模
- ❌ 不改 token 名称（保持 `--vp-c-brand-1` 等以与 VitePress 主题继承兼容）
- ❌ 不引入新颜色 / 字体 / 间距 — 那是 `homepage-anthropic-style-redesign` 的工作
- ❌ 不动 `docs/.vitepress/theme/index.ts`（DefaultTheme + './custom.css'）

## Open questions（决策点，需要在实施前确认）

无。本 change 是纯机械重构，无设计决策需要讨论。
