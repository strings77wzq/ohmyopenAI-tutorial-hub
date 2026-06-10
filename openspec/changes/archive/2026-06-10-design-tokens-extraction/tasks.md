# Tasks

## 1. 准备基线截图（防止 visual drift）

- [ ] 1.1 在 main / 当前 dist 上跑 `npm run docs:build`
- [ ] 1.2 用 puppeteer 或手动截图首页 / `/guide/` / `/guide/skills/what-is-skill` / `/guide/openspec/concepts` / `/guide/harness/intro` 五个页面，存到 `.lighthouse/before-tokens-*.png`
- [ ] 1.3 （可选）跑 `npm run docs:audit-lighthouse` 留下 perf baseline

## 2. 拆分 token 文件

- [ ] 2.1 新建 `docs/.vitepress/theme/tokens/colors.css`，从 custom.css 提取 `:root { --vp-c-*, --hub-c-*, --hub-*-gradient, --hub-glow, --hub-shadow }` + `.dark { ... }`
- [ ] 2.2 新建 `tokens/typography.css`，提取所有 font-* / letter-spacing / line-height（当前主要在 `.VPHero .name`、`.VPNavBar .title`、`.VPFeature .title`、`.hub-section h2` 等选择器里，需要先抽出为变量）
- [ ] 2.3 新建 `tokens/spacing.css`，提取 padding/margin/gap 数字 + `--hub-radius` + section/grid layout 数字
- [ ] 2.4 新建 `tokens/motion.css`，提取 transition duration/easing + `@media (prefers-reduced-motion)` 块

## 3. 改写主 custom.css

- [ ] 3.1 在 `custom.css` 顶部 `@import './tokens/colors.css';` 等四个 import（确认 VitePress 加载顺序支持 @import）
- [ ] 3.2 把原有魔术值替换为 `var(--token-name)`
- [ ] 3.3 验证 `custom.css` ≤ 400 行
- [ ] 3.4 验证每个 tokens/*.css ≤ 200 行

## 4. 验证零漂移

- [ ] 4.1 `npm run docs:build` 零错误零警告
- [ ] 4.2 `npm test` 通过
- [ ] 4.3 重新截图 5 个页面到 `.lighthouse/after-tokens-*.png`
- [ ] 4.4 二进制对比 before/after（允许 ≤ 5 像素差异，font hinting 抗锯齿可能微调）
- [ ] 4.5 （可选）`npm run docs:audit-lighthouse` 性能分数不低于 baseline 5 分以上

## 5. 文档与提交

- [ ] 5.1 在 README "Quality Gates" 段落或 ROADMAP 标注 PR 4 完成
- [ ] 5.2 提交：`refactor(theme): 把 custom.css 拆分为 4 个语义化 token 文件`
- [ ] 5.3 PR description 必须包含 before/after 截图证明零像素漂移
- [ ] 5.4 在 TODOS.md 勾选 PR 4 并把 PR 5 移到 in-progress
