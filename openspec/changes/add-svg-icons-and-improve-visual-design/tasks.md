# 任务列表：添加 SVG 图标并改进视觉设计

## Phase 1: 准备图标资源

- [x] **Task 1**: 创建图标目录结构
  - 创建 `docs/.vitepress/theme/components/icons/`
  - 准备 SVG 图标文件

- [x] **Task 2**: 收集 Hero Icons
  - bolt.svg (快速开始)
  - code.svg (Skills)
  - document-text.svg (OpenSpec)
  - beaker.svg (Harness)
  - rocket.svg (实战项目)
  - check-circle.svg (成功)
  - x-circle.svg (错误)
  - arrow-right.svg (链接)

- [x] **Task 3**: 创建图标组件
  - 创建了 theme/index.ts
  - CSS 中定义了 icon 类

## Phase 2: 更新首页

- [x] **Task 4**: 更新首页 features 区域
  - 将 emoji 替换为内联 SVG 图标
  - 使用了 Hero Icons 风格的 SVG

- [x] **Task 5**: 更新首页按钮
  - 优化按钮文字，移除方括号标记

## Phase 3: 更新文档

- [x] **Task 6**: 更新 quickstart.md
  - 替换 ✅ 为 SVG check-circle 图标
  - 使用 status-success 样式类
  - 更新下一步链接的图标

- [ ] **Task 7**: 更新 skills/what-is-skill.md
  - 待后续迭代完成

- [ ] **Task 8**: 更新 skills/components.md
  - 待后续迭代完成

- [ ] **Task 9**: 更新其他文档中的 emoji
  - 待后续迭代完成

## Phase 4: 添加自定义 CSS

- [x] **Task 10**: 创建自定义样式文件
  - `docs/.vitepress/theme/custom.css`
  - 图标样式 (.icon, .icon-lg 等)
  - 卡片悬停效果 (.VPFeature:hover)
  - 状态标记 (.status-success)

- [x] **Task 11**: 注册全局组件
  - 创建 theme/index.ts 导入 CSS

## Phase 5: 验证和部署

- [x] **Task 12**: 本地构建测试
  - 运行 npm run docs:build ✓ 成功
  - 所有图标显示正常

- [x] **Task 13**: 提交和推送
  - 提交所有更改
  - 推送到 GitHub ✓
  - 验证部署

## 总结

已完成的改进：
1. ✅ 8 个 SVG 图标文件
2. ✅ 自定义 CSS 样式系统
3. ✅ 首页 features 内联 SVG
4. ✅ quickstart.md 状态图标
5. ✅ 卡片悬停效果
6. ✅ 构建测试通过
7. ✅ 已部署到 GitHub Pages

剩余任务（可在后续迭代中继续）：
- 更新 skills/what-is-skill.md
- 更新 skills/components.md
- 更新其他文档中的 emoji
