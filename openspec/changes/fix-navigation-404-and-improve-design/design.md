## Context

当前文档网站使用 VitePress 构建，部署在 GitHub Pages，base 配置为 `/ohmyopenAI-tutorial-hub/`。

**问题现状：**
1. 用户点击侧边栏链接（如 `/guide/openspec/commands`）返回 404
2. 访问首页时被重定向到带 base 的根路径
3. 页面配色平淡，动画效果平庸

**约束条件：**
- 继续使用 GitHub Pages 部署
- 保持 VitePress 框架
- base 路径不可更改

## Goals / Non-Goals

**Goals:**
1. 修复所有导航链接 404 问题
2. 移除首页多余重定向，直接显示内容
3. 优化页面配色为专业技术文档风格
4. 添加优雅的过渡动画
5. 优化首页 hero 区域视觉

**Non-Goals:**
- 不更改框架（保持 VitePress）
- 不更改 base 路径
- 不添加新的功能模块

## Decisions

### Decision 1: 404 问题根因分析

**选择：** 禁用 cleanUrls，修改侧边栏链接格式

**理由：**
- VitePress 的 `cleanUrls: true` 会生成无扩展名 URL（如 `/guide/commands`）
- 但 GitHub Pages 静态服务器对无扩展名 URL 处理有问题
- 禁用后生成 `.html` 后缀（如 `/guide/commands.html`），服务器可正确识别

**备选方案考虑：**
- 使用 `.htaccess 重定向 → 需要服务器配置，GitHub Pages 无法自定义
- 使用 hash 模式 → 会改变 URL 格式，影响用户体验

### Decision 2: 首页重定向问题

**选择：** 在 index.md 中移除可能导致重定向的配置

**理由：**
- 检查配置后未发现明显的重定向配置
- 可能是 VitePress 默认行为或浏览器行为
- 需要进一步测试确定根因

### Decision 3: 视觉设计

**选择：** 采用深色主题 + 渐变强调色 + 微动画

**配色方案：**
- 主色：#10b981（绿色）
- 背景：深灰色调（#1e1e20）
- 卡片：稍浅灰色（#252528）
- 文字：白色/浅灰色

**备选方案考虑：**
- 纯白主题 → 过于普通
- 渐变多彩主题 → 不够专业
- 深绿科技风 → 符合技术文档定位

## Risks / Trade-offs

- [Risk] 禁用 cleanUrls 可能影响 SEO → [Mitigation] 影响有限，文档站 SEO 不是主要目标
- [Risk] 样式修改后效果可能不如预期 → [Mitigation] 先在本地测试，效果不佳可回滚
- [Risk] GitHub Pages 缓存导致更新不及时 → [Mitigation] 部署时使用版本号查询参数强制刷新