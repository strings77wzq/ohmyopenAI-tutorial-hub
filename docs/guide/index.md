# 学习地图

> 为什么需要这些技术？这份教程按照真实技术演进顺序组织：每个新技术的出现都是为了解决上一步的遗留问题。

## 技术发展历程

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  Prompt Engineering                                                        │
│  "如何写好提示词？"                                                        │
│         ↓ 解决了 Prompt 冗余复用问题                                            │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  Skills (oh-my-openagent)                                                   │
│  "把提示词封装成可复用能力模块"                                              │
│  📂 GitHub: https://github.com/code-yeongyu/oh-my-openagent                 │
│         ↓ 解决了上下文传递和状态管理问题                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  MCP (Model Context Protocol)                                             │
│  "标准化工具、资源、上下文协议"                                              │
│         ↓ 解决了工具暴露和安全边界问题                                        │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  OpenSpec                                                                │
│  "用规格文档固定需求和验收标准"                                                │
│  📂 GitHub: https://github.com/code-yeongyu/openspec                       │
│         ↓ 解决了人机协作需求对齐问题                                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  Harness Engineering                                                     │
│  "用场景、Mock、Evaluator 验证 AI 输出"                                    │
│         ↓ 解决质量保障问题                                                   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  golem (真实生产项目)                                                      │
│  "完整 Agent 系统实现案例"                                                  │
│  📂 GitHub: https://github.com/strings77wzq/golem                       │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## 学习路径

<div class="learning-map">
  <a href="/guide/quickstart"><strong>快速开始</strong><span>5分钟建立第一个 Skill</span></a>
  <a href="https://github.com/code-yeongyu/oh-my-openagent" target="_blank"><strong>Skills</strong><span>沉淀可复用能力 → GitHub</span></a>
  <a href="/guide/mcp/"><strong>MCP</strong><span>标准化上下文协议</span></a>
  <a href="https://github.com/code-yeongyu/openspec" target="_blank"><strong>OpenSpec</strong><span>规格驱动开发 → GitHub</span></a>
  <a href="/guide/harness/intro"><strong>Harness</strong><span>AI 输出质量验证</span></a>
  <a href="https://github.com/strings77wzq/golem" target="_blank"><strong>golem</strong><span>生产级实战 → GitHub</span></a>
</div>

## 推荐���径

### 初学者路径

1. [快速开始](/guide/quickstart) - 先跑通一个最小例子
2. [什么是 Skill](/guide/skills/what-is-skill) - 理解可复用能力
3. [MCP 入门](/guide/mcp/) - 理解 Agent 如何连接外部
4. [Harness 入门](/guide/harness/intro) - 用测试保护输出质量
5. [golem 案例](/guide/golem-case/) - 看真实生产项目

### 工程实践路径

1. [Skill 实战](/guide/skills/practice) - 封装可复用能力
2. [构建 MCP Server](/guide/mcp/server) - 暴露工具和安全边界
3. [OpenSpec 工作流](/guide/openspec/workflow) - 规格驱动开发
4. [评测与质量](/guide/evaluation/) - 验收标准变回归检查
5. [部署与安全](/guide/deployment/) - 权限、密钥、沙箱

### 架构师路径

1. [上下文工程](/guide/context/) - 上下文窗口设计
2. [工作流编排](/guide/agent-workflows/) - 串联完整系统
3. [检索与知识](/guide/agent-workflows/retrieval) - RAG 知识注入
4. [golem 生产级代码](https://github.com/strings77wzq/golem) - 完整架构参考

## 模块学习标准

| 标准 | 含义 |
| --- | --- |
| 概念 | 解释要解决什么问题 |
| 操作 | 给出可执行步骤 |
| 练习 | 提供自检任务 |
| 排错 | 常见失败模式 |
| 下一步 | 指向后续章节 |

## 现在开始

从 [快速开始](/guide/quickstart) 进入，或直接查看 [golem 实战](https://github.com/strings77wzq/golem)。
