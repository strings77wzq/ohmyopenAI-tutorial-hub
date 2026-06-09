# Doc Site Config Specification

## Purpose

Define document site configuration to fix navigation path issues.

## MODIFIED Requirements

### Requirement: URL 处理配置
系统 SHALL 配置正确的 URL 处理方式，确保静态服务器可正确识别页面。

#### Scenario: Clean URLs 配置
- **WHEN** VitePress 配置 cleanUrls: true
- **THEN** 生成无扩展名 URL（如 /guide/commands）
- **BUT** GitHub Pages 静态服务器无法正确处理
- **THEREFORE** 需要禁用 cleanUrls 或添加 .html 后缀

#### Scenario: 侧边栏链接格式
- **WHEN** 侧边栏配置 link: '/guide/openspec/commands'
- **THEN** VitePress 生成对应 HTML 文件
- **AND** 链接应指向可访问的路径

---

# Doc Visual Design Specification

## Purpose

Define document visual design specifications including color scheme, animations, and layout styles.

## ADDED Requirements

### Requirement: 配色方案
系统 SHALL 使用专业技术文档的配色方案。

#### Scenario: 深色主题配色
- **WHEN** 用户访问文档网站
- **THEN** 页面使用深灰色背景（#1e1e20）
- **AND** 强调色使用绿色渐变（#10b981）
- **AND** 卡片使用稍浅灰色（#252528）

#### Scenario: 文字配色
- **WHEN** 显示文档内容
- **AND** 主标题使用白色（#ffffff）
- **AND** 次要文字使用浅灰色（#a1a1aa）
- **AND** 代码块使用深色背景

### Requirement: 动画效果
系统 SHALL 添加优雅的页面过渡动画。

#### Scenario: 页面加载动画
- **WHEN** 页面开始加载
- **THEN** 显示渐入动画（opacity 0 → 1, 0.3s ease）

#### Scenario: 悬停效果
- **WHEN** 鼠标悬停在卡片或按钮上
- **THEN** 显示轻微上浮和阴影增强效果

#### Scenario: 页面切换过渡
- **WHEN** 用户点击导航链接
- **THEN** 显示淡入淡出过渡效果

### Requirement: 首页布局优化
系统 SHALL 优化首页 hero 区域布局。

#### Scenario: Hero 区域
- **WHEN** 用户访问首页
- **THEN** 显示品牌名称和 tagline
- **AND** 显示精选功能卡片（使用网格布局）
- **AND** 添加背景装饰（渐变模糊效果）