# Tasks

> **前置条件**：`design-tokens-extraction` change 必须已合入 main。本 change 只改 token 值与少量结构，不重新做 token 拆分。

## 1. 字体准备

- [ ] 1.1 决定字体来源：自托管 woff2 vs Google Fonts CDN（自托管更可控但部署复杂）
- [ ] 1.2 如自托管：把 woff2 文件放 `docs/public/fonts/`，子集化中文字体避免 5MB+ 体积
- [ ] 1.3 在 `docs/.vitepress/config.ts` 的 `head` 数组加 `<link rel="preload" as="font">` 仅 hero 字重
- [ ] 1.4 在 `tokens/typography.css` 加 `@font-face` 声明 + `font-display: swap`

## 2. 色板与背景

- [ ] 2.1 改 `tokens/colors.css` 中 `--vp-c-brand-1/2/3` 为 warm clay 系列（建议 `#CC785C / #B86848 / #9E5538`）
- [ ] 2.2 改 `--vp-c-bg` 为 `#FAFAF7`、`--vp-c-text-1` 为 `#181818`，调整 `--vp-c-text-2/3` 配合
- [ ] 2.3 删除 `--hub-c-accent` 和 `--hub-c-warn` 变量定义
- [ ] 2.4 grep `--hub-c-accent` 和 `--hub-c-warn` 的所有使用点，替换为 `--vp-c-brand-1` 或移除
- [ ] 2.5 同步暗色主题 `.dark` 配色（warm clay 在深色背景上换更亮的 `#E89A7E`）

## 3. Typography 阶梯

- [ ] 3.1 在 `tokens/typography.css` 加 `--text-display-xl/lg/md` clamp 阶梯
- [ ] 3.2 在 `tokens/typography.css` 定义 `--font-display` / `--font-body` / `--font-mono`
- [ ] 3.3 在 `custom.css` 把 `.VPHero .name` 用 `--text-display-xl + --font-display`
- [ ] 3.4 把 `.hub-section h2` 用 `--text-display-lg`

## 4. 砍装饰

- [ ] 4.1 删除 `custom.css` 中 `.VPHero::before` 的 `background: var(--hub-hero-gradient)` 整块
- [ ] 4.2 删除 `.VPFeature::before` 顶部彩条整块
- [ ] 4.3 删除 `.VPFeature::after` 红色短线整块
- [ ] 4.4 删除 `.vp-doc h2 { border-top, padding-top }` 规则
- [ ] 4.5 简化 `.VPFeature:hover` 仅保留 border-color 变化 + 微弱 box-shadow，移除 transform
- [ ] 4.6 简化 `.path-card:hover` 同上
- [ ] 4.7 保留所有 `:focus-visible` 规则（可访问性必需）

## 5. 留白翻倍

- [ ] 5.1 改 `tokens/spacing.css` 中 `--space-section` 从 32px 改为 `clamp(5rem, 4rem + 6vw, 9rem)`
- [ ] 5.2 验证 `.hub-section` 在不同视口下的呼吸感

## 6. Hero 与首页结构简化

- [ ] 6.1 改 `docs/index.md` 的 frontmatter `actions`：保留 brand「开始学习」+ alt「GitHub」，移除「快速开始」
- [ ] 6.2 把 `.path-grid` 7 cell 降为 4 cell（保留 Skills / MCP / Harness / Loop Engineering 四个最重要入口），其余移到 `/guide/` 学习地图
- [ ] 6.3 删除 `.VPHero .image-src` 的 `drop-shadow` 与 hover transform

## 7. 验证

- [ ] 7.1 `npm run docs:build` 零警告
- [ ] 7.2 `npm test` 通过
- [ ] 7.3 `npm run docs:audit-lighthouse`：Perf ≥ 90 / a11y ≥ 95 / LCP < 2.5s / CLS < 0.1
- [ ] 7.4 截图首页（桌面 1440 / 平板 768 / 手机 375）× 暗色亮色 = 6 张
- [ ] 7.5 截图 `/guide/skills/what-is-skill`（确认正文页排版良好）
- [ ] 7.6 grep 确认无残留：`grep -E '#0f9f8f|#d64f45|#b88212' docs/.vitepress/theme/`
- [ ] 7.7 中文字体在 hero 中正确渲染（不是 fallback 到 system serif）

## 8. PR 与文档

- [ ] 8.1 提交：`feat(theme): anthropic-style 首页重设计 (warm clay + display type)`
- [ ] 8.2 PR description 必须包含 before/after 截图 ≥ 2 张
- [ ] 8.3 在 README 「Quality Gates」段落写入 Lighthouse 实测数字
- [ ] 8.4 在 TODOS.md 勾选 PR 5
- [ ] 8.5 等用户视觉 review 后再 merge — 设计是 one-way door
