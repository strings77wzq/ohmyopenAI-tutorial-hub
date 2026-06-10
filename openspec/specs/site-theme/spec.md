# site-theme Specification

## Purpose
TBD - created by archiving change design-tokens-extraction. Update Purpose after archive.
## Requirements
### Requirement: Design tokens are defined in dedicated files separated by semantic category

主题样式的设计 token（colors / typography / spacing / motion）SHALL 分离到 `docs/.vitepress/theme/tokens/` 目录下的 4 个独立 CSS 文件，且按相同的语义分类。组件样式 SHALL 通过 `var(--token-name)` 引用这些 token，不直接出现魔术值。

#### Scenario: Color tokens isolation

- **WHEN** 阅读 `docs/.vitepress/theme/tokens/colors.css`
- **THEN** 文件仅包含 `:root` 与 `.dark` 选择器，仅声明 `--vp-c-*`、`--hub-c-*`、`--hub-*-gradient`、`--hub-glow`、`--hub-shadow` 形式的颜色相关 token，无组件样式

#### Scenario: Typography tokens isolation

- **WHEN** 阅读 `docs/.vitepress/theme/tokens/typography.css`
- **THEN** 文件包含字体族 / 字号阶梯 / 字重 / 行高 / letter-spacing 形式的 token 定义，无具体选择器样式

#### Scenario: Spacing tokens isolation

- **WHEN** 阅读 `docs/.vitepress/theme/tokens/spacing.css`
- **THEN** 文件包含 padding/margin/gap/radius 数字与 layout 相关常量，无颜色或字体定义

#### Scenario: Motion tokens isolation

- **WHEN** 阅读 `docs/.vitepress/theme/tokens/motion.css`
- **THEN** 文件包含 transition duration/easing 变量与 `@media (prefers-reduced-motion: reduce)` 全局规则，无视觉外观定义

#### Scenario: Component CSS references tokens

- **WHEN** 检查 `docs/.vitepress/theme/custom.css`
- **THEN** 文件不应包含未经 `var(--*)` 包装的颜色值（除 `0`、`transparent`、`currentColor`）、未经 `var(--*)` 包装的字号字重、超过 4px 的硬编码 padding/margin

### Requirement: Token extraction preserves zero visual drift

主题 token 化重构 SHALL NOT 改变任何已发布页面的渲染结果。重构 PR 必须附带 before/after 视觉证据。

#### Scenario: Homepage and module-entry screenshots match

- **WHEN** 对比 token 拆分前后 dist/ 的 首页 / `/guide/` / `/guide/skills/what-is-skill` / `/guide/openspec/concepts` / `/guide/harness/intro` 截图
- **THEN** 像素差异 ≤ 5（仅 font hinting 抗锯齿浮动允许）

#### Scenario: Lighthouse performance does not regress

- **WHEN** 对比 token 拆分前后 `npm run docs:audit-lighthouse` 的 Performance 分数
- **THEN** 拆分后分数不低于基线 5 分以上

### Requirement: Single file size budget

主题相关 CSS 文件 SHALL 各自 ≤ 600 行，token 文件 SHALL 各自 ≤ 200 行。

#### Scenario: custom.css size limit

- **WHEN** 检查 `docs/.vitepress/theme/custom.css` 的行数
- **THEN** 行数 ≤ 600（重构前 636 行，token 抽出后下降到 ~577，与项目 hooks 的 800 行硬上限留出 ≥ 25% 余量）

#### Scenario: token file size limit

- **WHEN** 检查 `docs/.vitepress/theme/tokens/*.css` 任一文件的行数
- **THEN** 行数 ≤ 200

