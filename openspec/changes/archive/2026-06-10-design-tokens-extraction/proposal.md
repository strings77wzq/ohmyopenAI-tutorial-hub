# Design Tokens Extraction

## Why

当前 `docs/.vitepress/theme/custom.css` 是 636 行单文件，所有颜色、字体、间距、动效都用魔术值散落其中。下一步要做 anthropic.com 风格的视觉重设计（见 `homepage-anthropic-style-redesign` change），如果直接在这个文件里改，reviewer 会同时看到「mechanical token extraction」和「intentional design decisions」两类修改，无法区分。

按 Kent Beck 的「Make the change easy, then make the easy change」原则：先做纯结构重构（本 change），再做视觉决策（下一个 change）。

## What Changes

- 拆 `docs/.vitepress/theme/custom.css` 为：
  - `theme/tokens/colors.css` — 所有 `--vp-c-*`、`--hub-c-*`、`--hub-*-gradient` 颜色 token
  - `theme/tokens/typography.css` — 字体族、字号阶梯、字重、行高、letter-spacing
  - `theme/tokens/spacing.css` — section/block/card padding、radius、grid gap
  - `theme/tokens/motion.css` — duration、easing、reduced-motion 媒体查询
  - `theme/custom.css` — 只剩组件级选择器和 VitePress override，所有数值通过 `var(--*)` 引用
- 不改变任何渲染像素 — 拆分前后视觉应 100% 一致
- 不删除任何 token，不改变 token 名称（与现有 vitepress 主题继承关系保持）
- 不引入新的设计决策（暖色 / 字体 pairing 留给下一个 change）

## Capabilities

### Modified Capabilities

- `site-theme`: 重组主题文件结构，分离 design tokens 与样式规则；token 文件分类承载语义（color / type / space / motion），便于后续单独演进或主题切换

## Verification

- `npm run docs:build` 通过且零警告
- `npm test` 通过
- **关键**：对比 token 拆分前后的 dist/ 截图（首页 + 3 个模块入口），证明零像素漂移
- 单文件 ≤ 400 行（拆分目标）
- 可选：跑 `npm run docs:audit-lighthouse` 对比 PR 3 baseline，性能分数不退化

## Impact

- 影响：`docs/.vitepress/theme/custom.css`（变小），新建 `docs/.vitepress/theme/tokens/*.css`
- 影响范围：纯样式重构，不触及任何 markdown 内容、配置或脚本
- Rollback：单 commit revert 即可，零数据风险
- 后续依赖：`homepage-anthropic-style-redesign` 在此 change 落地后立即接续
