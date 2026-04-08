# OpenSpec 实战案例：Golem 项目

本章以 golem 项目为例，演示 OpenSpec 在真实生产项目中的完整应用。Golem 是一个纯 Go 实现的云原生 AI 助手框架，项目已集成 OpenSpec 工作流。

## 目标

- 通过真实项目学习 OpenSpec 完整工作流
- 展示如何从零开始规划一个功能
- 演示如何让 AI 按照规范稳定实现

## 项目背景

Golem 项目地址：https://github.com/strings77wzq/golem

**项目特点：**
- 纯 Go 实现，单二进制无依赖
- 支持 7 大 LLM 提供商
- 云原生部署（Docker/K8s/Helm）
- 内置 Skills 系统和 MCP 客户端

## 案例：添加 MCP 服务器管理功能

假设我们要为 Golem 添加 MCP 服务器管理功能。

### Step 1：探索问题

在确定具体实现之前，先使用 explore 命令分析需求：

```bash
/opsx:explore "MCP 服务器管理功能需要哪些核心能力"
```

AI 会分析：
- 什么是 MCP（Model Context Protocol）
- 现有项目中的 MCP 集成情况
- 需要管理哪些内容（服务器配置、连接状态、工具映射等）
- 可能的技术方案

### Step 2：提出变更

确认方案后，创建提案：

```bash
/opsx:propose "添加 MCP 服务器管理功能"
```

### AI 生成的文档结构

```
openspec/changes/add-mcp-server-management/
├── proposal.md
├── design.md
├── specs/
│   └── mcp-server/
│       └── spec.md
└── tasks.md
```

### 文档示例

#### proposal.md（节选）

```markdown
## Why

Golem 当前只支持通过命令行参数加载 MCP 服务器配置。用户希望在运行时动态管理 MCP 服务器，提升使用体验。

## What Changes

- 添加 MCP 服务器配置文件格式定义
- 实现 MCP 服务器的 CRUD 接口
- 添加热重载支持
- 集成到现有 CLI 和 TUI

## Capabilities

- `mcp-server-config`: MCP 服务器配置文件规范
- `mcp-server-api`: MCP 服务器管理 API 规范
```

#### design.md（节选）

```markdown
## Goals

1. 支持 YAML 格式的 MCP 服务器配置
2. 提供 HTTP API 管理 MCP 服务器
3. 支持配置热重载
4. 保持与现有系统的兼容性

## Decisions

### 配置格式选择

**选择：** YAML

**理由：**
- 用户更熟悉
- 支持注释
- 与现有配置文件风格一致

### API 设计

使用 RESTful 风格：
- GET /api/v1/mcp/servers - 列出所有服务器
- POST /api/v1/mcp/servers - 添加服务器
- PUT /api/v1/mcp/servers/:name - 更新服务器
- DELETE /api/v1/mcp/servers/:name - 删除服务器
```

#### specs/mcp-server/spec.md（节选）

```markdown
## ADDED Requirements

### Requirement: MCP 服务器配置格式
系统 SHALL 支持通过 YAML 文件配置 MCP 服务器。

#### Scenario: 配置文件格式
- **WHEN** 用户创建 `config/mcp-servers.yaml`
- **THEN** 系统能够解析并加载配置

### Requirement: MCP 服务器列表接口
系统 SHALL 提供 API 获取已配置的 MCP 服务器列表。

#### Scenario: 获取服务器列表
- **WHEN** 用户请求 GET /api/v1/mcp/servers
- **THEN** 返回 JSON 数组，包含服务器名称和状态
```

#### tasks.md（节选）

```markdown
## 1. 配置模块

- [ ] 1.1 创建 MCP 服务器配置结构体
- [ ] 1.2 实现 YAML 解析函数
- [ ] 1.3 添加配置验证逻辑

## 2. HTTP API

- [ ] 2.1 添加 MCP 服务器路由
- [ ] 2.2 实现 GET /servers 接口
- [ ] 2.3 实现 POST /servers 接口
- [ ] 2.4 实现 PUT /servers/:name 接口
- [ ] 2.5 实现 DELETE /servers/:name 接口

## 3. 集成

- [ ] 3.1 集成到 CLI 命令
- [ ] 3.2 集成到 TUI
- [ ] 3.3 添加配置热重载功能

## 4. 测试

- [ ] 4.1 编写单元测试
- [ ] 4.2 编写集成测试
```

### Step 3：实现

确认文档无误后，开始实现：

```bash
/opsx:apply
```

AI 会按照 tasks.md 逐项实现，并实时更新进度。

### Step 4：验证

实现完成后，验证是否符合规范：

```bash
/opsx:verify
```

验证要点：
- 所有需求是否覆盖
- 场景是否可复现
- 代码是否符合 design.md 的设计决策

### Step 5：归档

验证通过后，归档变更：

```bash
/opsx:archive
```

归档后，变更移至 `openspec/archive/`，生成 summary.md 记录实现摘要。

## 真实项目参考

Golem 项目已使用 OpenSpec 管理多个变更。你可以在以下目录查看真实案例：

```
golem/openspec/
├── changes/
│   ├── add-mcp-client/
│   ├── add-rag-pipeline/
│   └── optimize-agent-loop/
├── specs/
│   ├── agent/
│   ├── mcp/
│   └── providers/
└── archive/
```

每个变更都包含完整的 proposal.md、design.md、specs/ 和 tasks.md，是学习 OpenSpec 的最佳参考。

## 你将学到什么

- 如何把"想法"收敛成可执行规范
- 如何让 AI 稳定执行而不是"凭感觉写代码"
- 如何通过规范文档与 AI 达成共识
- 如何在真实生产项目中应用 OpenSpec

## 下一步

查看 Golem 项目的完整 OpenSpec 目录：

→ [Golem GitHub](https://github.com/strings77wzq/golem)

→ [核心概念](/guide/openspec/concepts)

→ [命令参考](/guide/openspec/commands)