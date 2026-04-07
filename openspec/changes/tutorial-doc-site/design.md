## Context

当前 claude-code-Go 项目已有 VitePress 文档基础设施，但以产品文档为主（API 参考、架构说明），缺少面向初学者的**教程型内容**。同时，Skills、OpenSpec、Harness 等 AI 编程范式缺乏系统性的中文教学资源。

**约束条件**：
- 需与现有 claude-code-Go 文档技术栈一致（VitePress），降低维护成本
- 需支持中英文双语（i18n）
- 需部署到 GitHub Pages
- 内容需降低初学者学习成本，不能仅停留在 README 层面

## Goals / Non-Goals

**Goals:**
- 构建完整的文档官网，包含导航、侧边栏、搜索、i18n 等基础设施
- 创建三大教程模块：Skills、OpenSpec、Harness
- 提供角色化学习路径（初学者 → 开发者 → 架构师）
- 提供可运行的实战示例项目
- 通过高质量文档推广 claude-code-Go 项目

**Non-Goals:**
- 不重新发明文档框架（复用 VitePress，不切换到 Docusaurus/Starlight）
- 不包含视频教程制作（仅文档，视频为后续扩展）
- 不修改 claude-code-Go 核心代码（纯文档项目）
- 不做实时交互功能（静态站点即可）

## Decisions

### 1. 文档框架选择：VitePress

**决策**：继续使用 VitePress，与 claude-code-Go 现有文档保持一致。

**理由**：
- 已有 VitePress 基础设施和团队经验
- 构建速度快，适合教程型内容
- 内置本地搜索（MiniSearch），无需 Algolia 配置
- 原生支持 i18n
- GitHub Pages 部署简单

**替代方案**：
- Docusaurus：功能更丰富但更重，需要 React 知识，构建慢
- Starlight：性能优秀但生态较小，Astro 学习成本高
- Nextra：适合 Next.js 生态，与现有 Go 项目不匹配

### 2. 项目结构：独立仓库 vs 扩展现有 docs/

**决策**：创建独立教学文档仓库（如 `ai-tutorial-hub`），通过链接和交叉引用与 claude-code-Go 关联。

**理由**：
- 独立仓库可专注教学内容，不受产品文档迭代影响
- 可作为独立开源项目运营，增强技术影响力
- 内容范围更广（不仅限于 claude-code-Go，涵盖整个 AI 编程生态）
- 降低协作冲突风险

**替代方案**：
- 扩展现有 docs/：维护简单但内容混杂，教程和产品文档目标受众不同

### 3. 教程内容组织：Diátaxis 框架

**决策**：采用 Diátaxis 框架组织内容，分为四类：
- **Tutorials（教程）**：学习导向，手把手教学
- **How-to Guides（指南）**：目标导向，解决具体问题
- **Reference（参考）**：信息导向，命令/配置参考
- **Explanation（解释）**：理解导向，概念和原理

**理由**：
- 业界标准文档框架，Starlight 等已内置支持
- 清晰区分不同类型内容的目标和写法
- 降低初学者认知负担（知道该看什么）

### 4. 学习路径设计：角色化导航

**决策**：首页提供角色化入口，类似 claude-code-Go 现有设计：
- 👨‍💻 **Full-stack Developer**：快速上手 → 工具使用 → 实战项目
- 🏗️ **Architect**：架构深入 → OpenSpec → Harness
- 🎓 **Student**：概念入门 → 逐步深入 → 练习

**理由**：
- 已有验证的模式（claude-code-Go 首页已使用）
- 不同背景用户需要不同学习曲线
- 降低初学者选择焦虑

### 5. 示例项目：多语言电商 MVP

**决策**：参考 OpenSpec-practise 模式，使用电商场景作为贯穿教程的实战项目，提供 Node.js 和 Python 两套实现。

**理由**：
- 电商场景熟悉度高，业务逻辑清晰
- 多语言实现展示 OpenSpec 规范驱动的优势
- 可复用 OpenSpec-practise 的示例代码基础

### 6. 主题定制：品牌一致性

**决策**：自定义 VitePress 主题，保持与 claude-code-Go 品牌一致性：
- 相同配色方案
- 相同 Logo 风格
- 自定义首页 Hero 区域
- 添加"Choose Your Role"卡片组件

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|---------|
| 内容维护成本高 | 模块化组织，每个教程独立维护；社区贡献 |
| 中英文翻译同步困难 | 以中文为主，英文为翻译版本；建立翻译检查流程 |
| 示例代码过时 | CI 自动化测试示例代码；版本号管理 |
| 与 claude-code-Go 文档重复 | 明确边界：本项目专注教学，产品文档留在原仓库 |
| 独立仓库增加运营负担 | 初期内容精简，验证可行性后再扩展 |
