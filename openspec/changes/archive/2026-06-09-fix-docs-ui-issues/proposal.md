## Why

当前网站存在多个UI/UX问题需要修复：
1. URL路径配置错误导致资源引用重复（如 `/ohmyopenAI-tutorial-hub/ohmyopenAI-tutorial-hub/logo.svg`）
2. 导航栏语言切换显示重复和混乱
3. 部分文字配色不符合页面主题（如"Agent Engineering System"使用红色，与品牌绿色不搭配）
4. 首屏功能引导不够清晰
5. "质量门禁"部分内容像AI生成的注释，未清理干净，不专业

这些问题影响用户体验和网站专业形象，需要统一修复。

## What Changes

### P0 - 立即修复
1. **修复URL路径重复** - 调整 `repoBase` 配置
2. **修复图标/图片路径引用** - 确保正确定位资源

### P1 - 重要
3. **简化导航语言切换** - 移除重复的语言选项
4. **修复字体配色** - 将"eyebrow"类文字从红色改为品牌青色
5. **增强首屏引导** - 优化按钮和层级结构
6. **重写"质量门禁"板块** - 删除AI注释风格，改为专业文案

### P2 - 改进
7. **优化徽章样式** - 使用品牌色替代当前配色

## Impact

- 修改文件：
  - `docs/.vitepress/config.ts` - 基础路径配置
  - `docs/.vitepress/theme/custom.css` - 配色和样式
  - `docs/index.md` - 首页优化
  - `docs/en/index.md` - 英文首页