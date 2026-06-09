## ADDED Requirements

### Requirement: 文档站点必须基于 VitePress 构建
项目必须使用 VitePress 作为静态站点生成器，配置完整的 `docs/.vitepress/config.ts`，包含站点标题、描述、导航栏、侧边栏、主题配置。

#### Scenario: 基础构建验证
- **WHEN** 运行 `npx vitepress build docs`
- **THEN** 输出 `docs/.vitepress/dist/` 目录，包含完整的静态 HTML 文件

### Requirement: 站点必须支持中英文双语（i18n）
配置 VitePress i18n，默认语言为中文（`zh`），可选英文（`en`），通过语言切换器切换。

#### Scenario: 语言切换
- **WHEN** 用户点击导航栏语言切换器
- **THEN** 站点切换到对应语言版本，URL 路径包含语言前缀（如 `/en/` 或 `/zh/`）

### Requirement: 站点必须部署到 GitHub Pages
配置 GitHub Actions 工作流，推送 main 分支时自动构建并部署到 GitHub Pages。

#### Scenario: 自动部署
- **WHEN** 代码推送到 main 分支
- **THEN** GitHub Actions 触发构建，部署到 GitHub Pages，站点可访问

### Requirement: 站点必须包含内置搜索功能
启用 VitePress 本地搜索（MiniSearch），用户可通过搜索框查找文档内容。

#### Scenario: 内容搜索
- **WHEN** 用户在搜索框输入关键词
- **THEN** 显示匹配的文档页面列表，支持键盘导航

### Requirement: 首页必须包含 Hero 区域和角色化入口
首页设计包含：项目介绍、核心价值主张、快速开始按钮、角色化学习路径卡片。

#### Scenario: 首页展示
- **WHEN** 用户访问站点根路径
- **THEN** 显示 Hero 区域（标题、描述、CTA 按钮）和角色化入口卡片

### Requirement: 导航结构必须包含三大教程模块
侧边栏必须组织为：Skills 教程、OpenSpec 教程、Harness 教程三大模块，每个模块包含子章节。

#### Scenario: 导航浏览
- **WHEN** 用户查看侧边栏
- **THEN** 显示三大教程模块及其子章节，支持展开/折叠
