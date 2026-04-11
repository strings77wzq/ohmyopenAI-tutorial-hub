# 任务列表：改进文档 UX 并修复 Bug

## 高优先级任务

- [x] **Task 1**: 重构首页 (docs/index.md)
  - 添加醒目的"🚀 5 分钟快速开始"按钮
  - 简化角色选择区域
  - 在首页展示安装命令

- [x] **Task 2**: 重构快速开始页面 (docs/guide/quickstart.md)
  - 重新排序：先给操作指令，后讲原理
  - 首屏展示完整的 Skill 代码示例
  - 将概念解释移到页面底部

- [x] **Task 3**: 修复显示 Bug
  - [x] 修复 concepts.md 第 173-179 行代码块
  - [x] 修复 workflow.md 第 55-64 行格式问题

## 中优先级任务

- [x] **Task 4**: 术语标准化 - quickstart.md
  - 为 `/opsx:propose`、`/opsx:apply`、`/opsx:archive` 添加中文说明

- [x] **Task 5**: 术语标准化 - concepts.md
  - 为所有命令添加中文说明

- [x] **Task 6**: 术语标准化 - workflow.md
  - 为所有命令添加中文说明

## 验收任务

- [x] **Task 7**: 本地构建测试
  - 运行 `npm run docs:build`
  - 确认无错误和警告

- [x] **Task 8**: 提交和推送
  - 提交所有更改
  - 推送到 GitHub
  - 验证 GitHub Pages 部署
