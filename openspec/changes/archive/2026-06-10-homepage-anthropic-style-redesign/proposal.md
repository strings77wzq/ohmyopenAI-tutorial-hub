# Homepage Anthropic-Style Redesign

## Why

当前文档站使用 VitePress 默认主题 + teal `#0f9f8f` 冷色 + 多层 hover 动效 + 装饰性彩条 / 红线 + 7 cell 路径网格 + 3 个 hero CTA，整体观感像 SaaS 落地页，不像学习产品。`/plan-ceo-review` 2026-06-10 的发现：

- 主色（teal）+ accent（红）+ warn（黄）三色互相打架
- `vp-doc h2 { border-top }` 给每个二级标题加横线 — 与 anthropic.com 那种纯留白分隔的现代审美直接冲突
- `VPHero::before` 渐变背景 / `VPFeature::after` 红色短线 / `VPFeature::before` 顶部彩条 — Web Design Quality rule 明令禁止的「装饰特效堆砌」
- 字体是 system default，无 typography pairing 战略 — anthropic.com 的灵魂就是字体

参考 anthropic.com 的设计语言：印刷品级 typography + 暖色极简 + 留白驱动 + 单 CTA hero。

## What Changes

依赖 `design-tokens-extraction` change 先落地（它把 token 抽出来了，本 change 才能干净地改 token 值）。

视觉决策（这才是本 change 的真正内容）：

- **色板替换**：`--vp-c-brand-1` teal `#0f9f8f` → warm clay `#CC785C`；删除 `--hub-c-accent`（红 `#d64f45`）和 `--hub-c-warn`（黄 `#b88212`），统一一个 accent
- **暖白底**：`--vp-c-bg` 纯白 `#ffffff` → 暖白 `#FAFAF7`；近黑 `--vp-c-text-1` `#1a1d1c` → `#181818`
- **Typography pairing**：引入 Geist 或 Inter（display）+ 中文 Source Han Serif（H1）+ Source Han Sans（body）；定义 `--text-display-xl/lg/md` 阶梯
- **砍装饰**：
  - 删除 `VPHero::before` 渐变背景
  - 删除 `VPFeature::after` 红色短线
  - 删除 `VPFeature::before` 顶部彩条
  - 删除 `vp-doc h2 { border-top }`，改为纯留白分隔
  - 保留 `:focus-visible` outline（可访问性必需）
- **留白翻倍**：`--space-section` 32px → 80-120px（clamp 响应式）
- **Hero 简化**：保留 1 个主 CTA + 1 个副 CTA（移除第 3 个），移除 hero image drop-shadow 过度效果
- **首页 7 cell 路径图**：降为 3-4 大块（最重要的入口），其余移到 `/guide/` 学习地图页

## Capabilities

### Modified Capabilities

- `site-theme`: 配色从冷色 teal 切换到暖色 clay 单 accent；引入 display + body 字体 pairing；移除装饰性视觉效果；调整 hero 信息密度

## Verification

- `npm run docs:build` 通过零错误零警告
- `npm test` 通过
- `npm run docs:audit-lighthouse`：
  - Performance ≥ 90（字体引入不应造成回归）
  - Accessibility ≥ 95（色对比比之前更强）
  - LCP < 2.5s（hero 字体可能影响，必须 preload）
  - CLS < 0.1（font-display: swap 期间不应跳）
- 中英文 hero 都至少在桌面 / 平板 / 手机三档手动 review 截图
- 至少 2 个用户主观确认（含本人）：「不像默认 VitePress 模板了」
- 暗色 / 亮色双主题都看起来 intentional（rules/web/design-quality.md 检查项）

## Impact

- 影响：`docs/.vitepress/theme/tokens/colors.css`、`tokens/typography.css`、`tokens/spacing.css`、`docs/.vitepress/theme/custom.css`、`docs/index.md`（hero & path-grid 简化）、`docs/.vitepress/config.ts`（hero actions + 字体 preload head）
- 不影响：任何 markdown 内容、scripts/、openspec/、examples/
- Rollback：单 PR revert 即可，零数据风险
- 前置依赖：`design-tokens-extraction` 必须先合入
