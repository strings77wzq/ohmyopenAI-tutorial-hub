## 1. 项目初始化与基础设施

- [x] 1.1 创建新项目仓库 `ai-tutorial-hub`（或 `claude-code-go-tutorials`）
- [x] 1.2 初始化 VitePress 项目：安装 `vitepress` 依赖
- [x] 1.3 配置 `docs/.vitepress/config.ts`：站点标题、描述、导航栏、侧边栏
- [x] 1.4 配置 VitePress i18n：设置中文为默认语言，英文为可选
- [x] 1.5 创建基础目录结构：`docs/guide/`、`docs/reference/`、`docs/examples/`
- [x] 1.6 配置 GitHub Actions 自动部署到 GitHub Pages
- [x] 1.7 配置本地搜索（MiniSearch）

## 2. 首页与主题定制

- [x] 2.1 设计首页 Hero 区域：项目标题、核心价值、快速开始按钮
- [x] 2.2 实现角色化入口组件：Full-stack Developer / Architect / Student 卡片
- [x] 2.3 创建自定义主题样式：配色方案与 claude-code-Go 保持一致
- [x] 2.4 配置多语言首页（中文/英文）
- [x] 2.5 添加 Logo 和 Favicon
- [x] 2.6 配置侧边栏导航结构（三大教程模块）

## 3. Skills 教程模块

- [x] 3.1 创建 Skills 模块首页：`docs/guide/skills/index.md`
- [x] 3.2 编写"什么是 Skill"概念入门章节
- [x] 3.3 编写"创建你的第一个 Skill"手把手教学
- [x] 3.4 编写"Skill 的核心组件"章节（name, description, prompt, examples）
- [x] 3.5 编写"高级模式"章节（条件判断、变量、工具调用）
- [x] 3.6 编写"实战案例"：代码审查 Skill 完整示例
- [x] 3.7 编写"最佳实践与常见陷阱"章节

## 4. OpenSpec 教程模块

- [x] 4.1 创建 OpenSpec 模块首页：`docs/guide/openspec/index.md`
- [x] 4.2 编写"核心概念"章节（SDD 介绍、OpenSpec 哲学）
- [x] 4.3 创建命令参考表：/opsx:propose, /opsx:apply, /opsx:archive 等
- [x] 4.4 编写"完整工作流"教学章节
- [x] 4.5 编写"编写高质量 Spec"技巧
- [x] 4.6 编写"实战案例"：基于电商场景的 OpenSpec 规范驱动开发
- [x] 4.7 编写"最佳实践与常见错误"章节

## 5. Harness 教程模块

- [x] 5.1 创建 Harness 模块首页：`docs/guide/harness/index.md`
- [x] 5.2 编写"测试基础设施概念"入门
- [x] 5.3 编写"编写测试场景"教学章节
- [x] 5.4 编写"Evaluators 使用指南"
- [x] 5.5 编写"Mock Server 使用说明"
- [x] 5.6 编写完整实战案例：从场景到执行
- [x] 5.7 编写"测试最佳实践"章节

## 6. 实战示例项目

- [x] 6.1 创建 `examples/ecommerce-mini-nodejs/` 目录
- [x] 6.2 创建 `examples/ecommerce-mini-python/` 目录
- [x] 6.3 编写电商规范文件（openspec/changes/）
- [x] 6.4 实现 Node.js 版电商 MVP（商品、购物车、订单）
- [x] 6.5 实现 Python 版电商 MVP（商品、购物车、订单）
- [x] 6.6 为示例项目编写单元测试和集成测试
- [x] 6.7 编写示例项目 README 和快速开始指南

## 7. 参考文档与资源

- [x] 7.1 创建"快速开始"指南（5分钟上手）
- [x] 7.2 创建"命令参考"文档
- [x] 7.3 创建"常见问题解答（FAQ）"
- [x] 7.4 创建"故障排除"文档
- [x] 7.5 创建"贡献指南"
- [x] 7.6 添加代码 Playground（可选）

## 8. 英文翻译与国际化

- [x] 8.1 翻译首页为英文（`docs/en/index.md`）
- [x] 8.2 翻译 Skills 教程核心章节
- [x] 8.3 翻译 OpenSpec 教程核心章节
- [x] 8.4 翻译 Harness 教程核心章节
- [x] 8.5 配置语言切换器
- [x] 8.6 测试多语言切换功能

## 9. 部署与发布

- [x] 9.1 验证本地构建：`npx vitepress build docs`
- [ ] 9.2 验证 GitHub Actions 自动部署
- [ ] 9.3 配置自定义域名（可选）
- [ ] 9.4 添加站点统计（可选）
- [x] 9.5 编写项目 README
- [ ] 9.6 在 GitHub 发布首个版本

## 10. 推广与迭代

- [ ] 10.1 在 claude-code-Go 文档中添加新教程站点的链接
- [ ] 10.2 编写介绍博客/文章
- [ ] 10.3 在社区（Discord、Twitter 等）分享项目
- [ ] 10.4 收集用户反馈并迭代改进
- [ ] 10.5 添加更多实战示例（如 CLI 工具、AI Agent 等场景）
