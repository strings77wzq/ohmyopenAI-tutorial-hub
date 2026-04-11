# Agent Engineering Hub 🤖

> 智能体工程学习系统：从概念到实战，从工具到架构

## 技术发展历程

```
Prompt Engineering                    Skills (oh-my-openagent)
       ↓                                  ↓
 解决Prompt冗余问题              可复用能力模块
       ↓                                  ↓
MCP (Model Context Protocol)     OpenSpec (Spec-Driven)
       ↓                                  ↓
标准化上下文协议                规格驱动开发
       ↓                                  ↓
Harness Engineering            golem (生产级实战)
       ↓
AI输出质量保障
```

## 核心模块

| 模块 | 内容 | GitHub |
|------|------|-------|
| **OMO工作流** | 多模型编排系统，11大Agent | [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) |
| **golem案例** | 生产级Go Agent项目 | [golem](https://github.com/strings77wzq/golem) |
| **Skills** | 可复用AI能力模块 | [skills.sh](https://skills.sh) |
| **MCP** | 标准化上下文协议 | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| **OpenSpec** | 规格驱动开发SDD | [openspec](https://github.com/code-yeongyu/openspec) |
| **Harness** | AI输出质量保障 | R.E.S.T模型 |

## 快速开始

### 学习路径
- [快速开始](./docs/guide/quickstart.md) - 5分钟建立第一个Skill
- [学习地图](./docs/guide/) - 完整技术演进路径
- [OMO工作流](./docs/guide/omo/) - 多模型编排系统
- [golem案例](./docs/guide/golem-case/) - 生产级实战

## 为什么学习这个？

1. **体系化**：从Prompt到生产级Agent系统的完整路径
2. **实战导向**：基于golem真实生产项目教学
3. **质量保障**：Harness工程确保AI输出可靠

## 相关链接

- 🌐 **在线教程**: https://strings77wzq.github.io/agent-engineering-hub/
- 📚 **OMO工作流**: https://github.com/code-yeongyu/oh-my-openagent
- 💻 **golem项目**: https://github.com/strings77wzq/golem
- 🛠️ **Skills社区**: https://skills.sh
- 📖 **MCP协议**: https://modelcontextprotocol.io

## 快速开始

### 选择你的角色

<div class="role-cards">

#### Full-stack Developer
快速上手 → 工具使用 → 实战项目

[开始开发之旅](./guide/quickstart.html)

#### Architect
架构深入 → OpenSpec → Harness

[深入架构设计](./guide/openspec/concepts.html)

#### Student
概念入门 → 逐步深入 → 练习

[从零开始学习](./guide/)

</div>

## 教程模块

### Skills 教程

学习如何创建和使用 AI Skills：

1. [什么是 Skill](./guide/skills/what-is-skill.md) - 理解 Skill 的核心概念
2. [创建你的第一个 Skill](./guide/skills/first-skill.md) - 手把手教学
3. [Skill 核心组件](./guide/skills/components.md) - name、description、prompt、examples
4. [高级模式](./guide/skills/advanced.md) - 条件判断、变量、工具调用
5. [实战案例](./guide/skills/practice.md) - 代码审查 Skill 完整示例

### OpenSpec 教程

掌握规范驱动开发的完整工作流：

1. [核心概念](./guide/openspec/concepts.md) - SDD 介绍、OpenSpec 哲学
2. [命令参考](./guide/openspec/commands.md) - `/opsx:` 命令完整列表
3. [完整工作流](./guide/openspec/workflow.md) - propose → apply → archive
4. [编写高质量 Spec](./guide/openspec/writing-specs.md) - 技巧与模式
5. [实战案例](./guide/openspec/practice.md) - 电商场景规范驱动开发

### MCP 教程

学习如何把工具、资源和上下文以标准协议暴露给 Agent：

1. [MCP 入门](./guide/mcp/index.md) - 理解协议角色和能力边界
2. [核心概念](./guide/mcp/concepts.md) - tools、resources、prompts
3. [构建 MCP Server](./guide/mcp/server.md) - 设计可测试接口
4. [实战练习](./guide/mcp/practice.md) - 设计文档搜索 tool
5. [安全边界](./guide/mcp/safety.md) - 权限、密钥和危险操作

### Harness 教程

构建智能体工程的质量基础设施：

1. [测试基础设施](./guide/harness/intro.md) - Harness 核心概念
2. [编写测试场景](./guide/harness/writing-tests.md) - 测试用例设计
3. [Evaluators](./guide/harness/evaluators.md) - 输出质量评估
4. [Mock Server](./guide/harness/mock-server.md) - 无成本测试
5. [实战案例](./guide/harness/practice.md) - 完整测试工作流

## 示例项目

- [电商 MVP (Node.js)](./examples/ecommerce-nodejs.md)
- [电商 MVP (Python)](./examples/ecommerce-python.md)

## 贡献

欢迎贡献！请查看[贡献指南](./contributing.md)。

## 许可

[MIT](./LICENSE)

## OpenSpec 项目隔离说明

本项目使用**项目内本地 OpenSpec**：

```text
ai-tutorial-hub/
  openspec/
    config.yaml
    changes/
    specs/
```

请在项目目录内执行 OpenSpec 命令：

```bash
cd ai-tutorial-hub
openspec list --json
openspec status --change tutorial-doc-site
```

这样当 `~/md` 下有多个项目时，每个项目的规范互不影响。
