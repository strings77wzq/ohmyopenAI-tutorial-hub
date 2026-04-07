# 任务列表：添加 SVG 图标并改进视觉设计

## Phase 1: 准备图标资源

- [ ] **Task 1**: 创建图标目录结构
  - 创建 `docs/.vitepress/theme/components/icons/`
  - 准备 SVG 图标文件

- [ ] **Task 2**: 收集 Hero Icons
  - bolt.svg (快速开始)
  - code.svg (Skills)
  - document-text.svg (OpenSpec)
  - beaker.svg (Harness)
  - rocket.svg (实战项目)
  - check-circle.svg (成功)
  - x-circle.svg (错误)
  - arrow-right.svg (链接)

- [ ] **Task 3**: 创建图标组件
  - 创建 `Icon.vue` 组件
  - 支持 size、color 属性
  - 支持 aria-label

## Phase 2: 更新首页

- [ ] **Task 4**: 更新首页 features 区域
  - 将 emoji 替换为 SVG 图标
  - 优化卡片布局
  - 添加悬停效果

- [ ] **Task 5**: 更新首页按钮
  - 添加图标到按钮
  - 优化按钮样式

## Phase 3: 更新文档

- [ ] **Task 6**: 更新 quickstart.md
  - 替换 ✅ 为 check-circle 图标
  - 优化步骤展示

- [ ] **Task 7**: 更新 skills/what-is-skill.md
  - 替换表格中的 emoji
  - 使用图标增强视觉效果

- [ ] **Task 8**: 更新 skills/components.md
  - 替换 ✅ ❌ 为图标

- [ ] **Task 9**: 更新其他文档中的 emoji
  - guide/index.md
  - openspec/commands.md
  - harness/intro.md

## Phase 4: 添加自定义 CSS

- [ ] **Task 10**: 创建自定义样式文件
  - `docs/.vitepress/theme/custom.css`
  - 图标样式
  - 卡片悬停效果
  - 动画效果

- [ ] **Task 11**: 注册全局组件
  - 在 theme/index.ts 中注册 Icon 组件

## Phase 5: 验证和部署

- [ ] **Task 12**: 本地构建测试
  - 运行 npm run docs:build
  - 检查所有图标显示正常
  - 检查响应式布局

- [ ] **Task 13**: 提交和推送
  - 提交所有更改
  - 推送到 GitHub
  - 验证部署
