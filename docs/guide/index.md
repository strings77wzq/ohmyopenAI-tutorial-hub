# 学习地图

这份教程按照真实 Agent 工程项目的顺序组织：先做出可运行的最小能力，再把需求、上下文、工具、评测和发布流程逐步纳入同一个质量闭环。

<div class="learning-map">
  <a href="/guide/quickstart"><strong>快速开始</strong><span>建立第一个 Skill 和本地反馈循环</span></a>
  <a href="/guide/skills/what-is-skill"><strong>Skills</strong><span>沉淀可复用能力和提示资产</span></a>
  <a href="/guide/mcp/"><strong>MCP</strong><span>把工具、资源和上下文交给 Agent</span></a>
  <a href="/guide/openspec/concepts"><strong>OpenSpec</strong><span>用规格固定需求和验收标准</span></a>
  <a href="/guide/harness/intro"><strong>Harness</strong><span>用场景、Mock 和 Evaluator 验证输出</span></a>
  <a href="/guide/evaluation/"><strong>评测与发布</strong><span>建立回归套件、质量门禁和安全发布流程</span></a>
</div>

## 推荐路径

### 初学者路径

1. [快速开始](/guide/quickstart) - 先跑通一个最小例子。
2. [什么是 Skill](/guide/skills/what-is-skill) - 理解可复用能力的边界。
3. [MCP 入门](/guide/mcp/) - 理解 Agent 如何连接外部上下文。
4. [OpenSpec 核心概念](/guide/openspec/concepts) - 在动手前写清楚目标。
5. [Harness 测试基础设施](/guide/harness/intro) - 用测试保护 AI 输出质量。

### 工程实践路径

1. [Skill 实战案例](/guide/skills/practice) - 把任务封装成可重复调用的能力。
2. [构建 MCP Server](/guide/mcp/server) - 暴露工具、资源和安全边界。
3. [完整工作流](/guide/openspec/workflow) - 从提案到实现再到归档。
4. [评测与质量](/guide/evaluation/) - 将验收标准变成回归检查。
5. [部署与安全](/guide/deployment/) - 处理权限、密钥、沙箱和回滚。

### 架构与维护路径

1. [上下文工程](/guide/context/) - 设计上下文窗口、记忆和信息优先级。
2. [工作流编排](/guide/agent-workflows/) - 串联 Skills、MCP、OpenSpec 和 Harness。
3. [检索与知识](/guide/agent-workflows/retrieval) - 将文档和代码库知识纳入 Agent。
4. [最佳实践](/guide/skills/best-practices) - 避免不可维护的提示和工具设计。
5. [贡献指南](/contributing) - 按同一质量标准扩展教程。

## 每个模块的学习标准

| 标准 | 含义 |
| --- | --- |
| 概念 | 解释要解决的问题和关键术语 |
| 操作 | 给出可执行步骤或最小配置 |
| 练习 | 提供一个可以提交或自检的任务 |
| 排错 | 列出常见失败模式和定位方式 |
| 下一步 | 指向后续章节或示例项目 |

## 现在开始

从 [快速开始](/guide/quickstart) 进入。如果你已经熟悉基础概念，可以直接跳到 [MCP 入门](/guide/mcp/) 或 [评测与质量](/guide/evaluation/)。
