# site-theme

## MODIFIED Requirements

### Requirement: Brand color is a single warm accent

主题 SHALL 使用单一暖色 accent（warm clay 系），不再混用 teal + red + yellow 三个强调色。所有需要强调的元素（CTA、链接 hover、active state、focus ring、品牌标识）SHALL 共享同一 accent token。

#### Scenario: Single accent in light theme

- **WHEN** 检查 `:root` 中的颜色 token
- **THEN** `--vp-c-brand-1` 应为 warm clay 系 hex（推荐 `#CC785C`），不应存在 `--hub-c-accent` 或 `--hub-c-warn` 变量

#### Scenario: Single accent in dark theme

- **WHEN** 检查 `.dark` 中的颜色 token
- **THEN** `--vp-c-brand-1` 应为同系列更亮的暖色（推荐 `#E89A7E`），与 light theme 同语义

#### Scenario: Color contrast meets WCAG AA

- **WHEN** 用 axe-core 检查首页与正文页的所有文本/背景对比
- **THEN** 正文 contrast ratio ≥ 4.5:1，大字 ≥ 3:1（WCAG AA）；accent 上文字 ≥ 4.5:1

### Requirement: Typography pairing for display vs body

主题 SHALL 区分 display 字体（用于 hero / H1 / H2 等强调标题）与 body 字体（用于正文）。SHALL 同时为英文和中文提供字体，且通过 `font-display: swap` 避免 FOIT。

#### Scenario: Display font token defined

- **WHEN** 检查 `tokens/typography.css`
- **THEN** 定义有 `--font-display` 与 `--font-body` 两个独立字体族 token

#### Scenario: Display type scale defined

- **WHEN** 检查 `tokens/typography.css`
- **THEN** 定义有 `--text-display-xl`、`--text-display-lg`、`--text-display-md` 三档 clamp 响应式字号

#### Scenario: Web font loads without layout shift

- **WHEN** 首页加载并测量 CLS
- **THEN** CLS < 0.1（web font 切换不应造成跳变）

### Requirement: Visual decoration is minimal

主题 SHALL NOT 包含装饰性的色块、彩条、彩色短线等无功能的视觉元素。Hover / focus 状态可以变颜色 / 边框，不应包含位移 / 多层阴影 / 装饰条。

#### Scenario: No gradient overlay on hero

- **WHEN** 检查 `custom.css` 中的 `.VPHero` 相关规则
- **THEN** 不存在 `::before` 或 `::after` 伪元素绘制渐变背景

#### Scenario: No decorative top bar on feature cards

- **WHEN** 检查 `.VPFeature` 相关规则
- **THEN** 不存在 `::before` 绘制顶部彩条 或 `::after` 绘制右下角彩色短线

#### Scenario: No horizontal divider above H2

- **WHEN** 检查 `.vp-doc h2` 规则
- **THEN** 不存在 `border-top` 属性，h2 间靠空白分隔

### Requirement: Section padding follows whitespace-driven rhythm

主题 SHALL 使用 ≥ 80px 的 section vertical padding（clamp 响应式），不再使用 32px 紧凑布局。

#### Scenario: Section padding minimum

- **WHEN** 检查 `tokens/spacing.css` 中的 `--space-section`
- **THEN** 值为 `clamp(5rem, ..., ...)` 或绝对值 ≥ 80px

### Requirement: Hero is single-focus

首页 hero 区 SHALL 至多包含 2 个 CTA 按钮（一个主、一个副）。SHALL NOT 包含 3 个或更多 hero actions。

#### Scenario: Hero CTA count

- **WHEN** 检查 `docs/index.md` 的 frontmatter `hero.actions`
- **THEN** actions 数组长度 ≤ 2

### Requirement: Path grid focuses on top entries

首页路径图 SHALL 包含 ≤ 4 个最重要的入口模块。完整 7+ 模块路径 SHALL 在 `/guide/` 学习地图页展示。

#### Scenario: Homepage path grid cell count

- **WHEN** 检查首页 `.path-grid` 子项数
- **THEN** 数量 ≤ 4
