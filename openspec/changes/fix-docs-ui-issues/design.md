## Context

当前网站有UI/UX问题需要修复。主要涉及CSS配色调整和首页内容优化。

## Decisions

### 1. URL路径重复
- **问题**: `repoBase = '/ohmyopenAI-tutorial-hub/'` 导致路径变为 `/ohmyopenAI-tutorial-hub/ohmyopenAI-tutorial-hub/...`
- **方案**: 检查VitePress的base配置，可能需要调整为 `/` 或保持现状（取决于GitHub Pages配置）

### 2. 配色问题
- **当前**: "eyebrow"类文字使用红色 `var(--hub-c-accent): #d64f45`
- **修改**: 改为品牌青色 `var(--vp-c-brand-1): #0f9f8f`
- **位置**: custom.css 中的 `.eyebrow` 和 `.badge` 样式

### 3. 导航简化
- **问题**: 语言切换菜单重复显示
- **方案**: 简化config.ts中的nav配置

### 4. 首页内容优化
- **问题**: "质量门禁"部分像AI注释
- **方案**: 重写为专业化描述

## Implementation Files

1. `docs/.vitepress/config.ts` - 导航配置
2. `docs/.vitepress/theme/custom.css` - 样式调整
3. `docs/index.md` - 首页内容
4. `docs/en/index.md` - 英文首页