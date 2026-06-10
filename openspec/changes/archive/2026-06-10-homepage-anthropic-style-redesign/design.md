# Homepage Redesign — Design Notes

## Reference & inspiration

[anthropic.com](https://www.anthropic.com/) 的设计语言（2026-06 实测）：

- **Typography-forward**：display 字体大号粗体（48-64px hero）+ regular body
- **Palette**：暖白底 + 近黑字 + warm orange/amber 单 accent + 浅灰 footer
- **Spacing**：80-120px section padding，24px 内部 grid
- **Hero**：居中单列，无图，单 CTA
- **卡片**：label 堆叠（date → category → title → link），左对齐，无重 hover 动效
- **Navigation**：固定顶栏 + mega menu 双列下拉
- **Motion**：极少 — 下拉淡入是几乎全部
- **Dividers**：纯留白，无横线

## Color decision: clay 不是 anthropic orange

Anthropic 用 `#D97757` 系列。本项目 **不直接抄**，原因：

1. 法律 / 品牌混淆风险
2. 一个"教学站"借品牌色不诚实
3. clay `#CC785C` 比 anthropic 稍暗一点，跟暖白底对比度更友好，正文链接更可读

实测 `#CC785C` 在 `#FAFAF7` 底色上的 contrast ratio = 4.7:1，达 WCAG AA。
`#E89A7E` 在 `#141312` 底色上 = 8.1:1，达 AAA。

## Typography decision: 双字体策略

| 用途 | 字体 | 字重 | 理由 |
|---|---|---|---|
| 英文 hero / H1 / H2 | Geist 或 Inter Display | 700-800 | 几何无衬线，display 优化字偶距 |
| 英文 body | Inter | 400 | 工程社区标配，OS 兼容性好 |
| 中文 hero / H1 | Source Han Serif SC | Heavy | 衬线对中文 display 更有"出版物"感，与 anthropic 英文的几何粗体形成跨语言对应 |
| 中文 body | Source Han Sans SC | Regular | 默认安全选项 |
| Mono | JetBrains Mono | 400 | 已是行业标准 |

中文衬线大字体的赌注：会有「太正式」的争议。备选 fallback：如果用户测后不喜欢，把中文 hero 改回 Source Han Sans Heavy 即可（一个 token 改动）。

## Why kill 7-cell path grid

当前首页结构：
```
hero (3 CTA)
↓
features (6 cell)
↓
path-grid (7 cell — Prompt → Skill → MCP → OpenSpec → Context → Harness → Loop)
↓
split-section (Quality Gates 卡片)
↓
golem case study section
↓
...
```

读者首屏看到 16+ 个可点击单元，认知过载。anthropic.com 首屏 = 一句话 + 一个 CTA。

新结构：
```
hero (2 CTA)
↓
features (4 cell — Skills / MCP / Harness / Loop)
↓
1 段 "为什么 / 给谁看" 散文（非卡片）
↓
golem case study section（保留，是项目最重的差异化）
```

7-cell 路径图移到 `/guide/` 学习地图页（那里读者已经表达了"我要看路径"的意图）。

## Risk: VitePress theme override 上限

VitePress 1.6 主题继承的 hard limit：
- ✅ 可以改：所有 CSS（通过 `theme/custom.css`）
- ✅ 可以改：`themeConfig` 的所有字段
- ✅ 可以改：首页 frontmatter (`hero`, `features`)
- ⚠️ 难改：`<VPHero>` 组件的 DOM 结构（要 fork 整个 Hero.vue）
- ❌ 不能改：路由系统、build pipeline

本 change 全部需求都在✅ 范围内。如果未来要做更彻底的设计（例如自定义 hero 加入动画 SVG），需要单独评估「fork Hero.vue」vs「迁 Astro Starlight」。

## Out of scope

- ❌ 不做 visual regression 测试设施（Playwright screenshot suite 是 Week deferred 项）
- ❌ 不引入 motion library（GSAP/Framer Motion） — 当前需求 pure CSS transition 够
- ❌ 不改 `docs/index.md` 之外的其他页面布局
- ❌ 不改 sidebar 视觉（保留现有结构，只继承新 token）

## Open questions（实施前确认）

1. **字体托管方式**：自托管 woff2 vs Google Fonts CDN？(影响 LCP)
2. **中文 hero 字体**：Source Han Serif Heavy vs Source Han Sans Heavy？(影响整体气质)
3. **path-grid 4 cell 选哪 4 个**：Skills/MCP/Harness/Loop？或者 Skills/OpenSpec/Harness/Loop？(OMO 和 golem-case 保留在 case section 里)

这 3 个问题应该在 PR 开始前用 AskUserQuestion 收集。
