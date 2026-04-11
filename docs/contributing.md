# 贡献指南

感谢你对 Agent Engineering Hub 的关注。这个项目欢迎文档、示例、翻译、排错记录和质量工具改进。

## 本地开发

```bash
git clone https://github.com/strings77wzq/agent-engineering-hub.git
cd agent-engineering-hub
npm install
npm run docs:dev
```

提交前运行：

```bash
npm run docs:build
npm run docs:check-links
```

如果你修改了示例项目，也要运行对应示例的测试。

## 内容模板

新增教程页时，请至少包含：

| 模块 | 要求 |
| --- | --- |
| 目标 | 说明读者学完能完成什么 |
| 概念 | 解释关键术语和问题背景 |
| 步骤 | 给出可执行命令、配置或流程 |
| 练习 | 提供可自检的任务 |
| 排错 | 列出常见失败和定位方式 |
| 下一步 | 指向后续章节或示例 |

## 文件结构

```text
docs/
├── guide/
│   ├── skills/
│   ├── mcp/
│   ├── openspec/
│   ├── harness/
│   ├── context/
│   ├── agent-workflows/
│   ├── evaluation/
│   └── deployment/
├── reference/
├── examples/
└── en/
```

## 链接和路由规范

- 官方导航和侧边栏必须指向真实页面。
- 中文页面优先链接中文路径。
- 英文页面优先链接 `/en/` 路径。
- 缺少翻译时，可以链接共享页面，但要确保页面存在。
- 新增页面后运行 `npm run docs:check-links`。

## 写作标准

- 先给操作路径，再补充背景。
- 使用短段落和清晰标题。
- 代码块必须标注语言。
- 示例必须说明预期结果。
- 不把外部命令描述成一定安全，必须写清前提和影响。
- 技术术语首次出现时给出解释。

## Pull Request 检查清单

- [ ] 文档构建通过。
- [ ] 内部链接检查通过。
- [ ] 新教程包含目标、概念、步骤、练习、排错、下一步。
- [ ] 中英文导航没有断链。
- [ ] 示例项目说明运行命令和质量检查。
- [ ] 视觉或交互变更经过桌面和移动端检查。

## 报告问题

提交 Issue 时请包含：

- 问题页面 URL。
- 你看到的错误或 404。
- 复现步骤。
- 期望行为。
- 如果是命令失败，请贴出关键错误输出。

## 许可证

本项目基于 MIT 许可发布。贡献即表示你同意以同一许可发布你的贡献。
