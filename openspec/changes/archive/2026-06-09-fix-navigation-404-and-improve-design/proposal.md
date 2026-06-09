## Why

当前文档网站存在严重的导航问题：侧边栏链接全部返回 404，用户无法访问任何子页面。同时首页视觉设计简陋，配色平淡，动画效果平庸，严重影响用户体验和技术影响力展示。

## What Changes

- **根因分析并修复 404 问题**：检查 base 路径配置、cleanUrls 设置、侧边栏链接格式，确保所有导航链接可正常访问
- **优化首页重定向**：移除多余的 URL 跳转，直接显示首页内容而非重定向到根路径
- **提升视觉设计**：优化页面配色方案，使用更专业的技术文档配色，添加优雅的过渡动画
- **优化首页布局**：重新设计首页 hero 区域，提升视觉层次感和专业度

## Capabilities

### New Capabilities

- `doc-visual-design`: 文档视觉设计规范，定义配色方案、动画效果、布局样式

### Modified Capabilities

- `doc-site-config`: 文档站点配置规范，修复导航路径问题，优化 URL 处理

## Impact

- 修改 `docs/.vitepress/config.ts` - 修复 cleanUrls 和导航配置
- 修改 `docs/index.md` - 优化首页布局和视觉设计
- 修改 `docs/custom.css` - 添加动画效果和样式优化
- 可能需要调整 GitHub Pages 部署配置