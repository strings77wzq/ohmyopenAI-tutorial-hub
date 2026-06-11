# 学习地图

> 从 Prompt 到 Production Loop：7 个工程维度构成完整的 Agentic Engineering 技术演进路径。每个新技术的出现都是为了解决上一步的遗留问题。

## 技术发展历程

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  1. Prompt Engineering                                                     │
│  "如何写好提示词？"                                                         │
│         ↓ 解决了 Prompt 冗余复用问题                                             │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  2. Skills                                                                 │
│  "把 Prompt 封装成可复用能力模块"                                             │
│  📂 GitHub: https://github.com/code-yeongyu/oh-my-openagent                  │
│         ↓ 解决了上下文传递和状态管理问题                                        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  3. MCP (Model Context Protocol)                                           │
│  "标准化工具、资源和上下文的通信协议"                                          │
│         ↓ 解决了工具暴露和安全边界问题                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  4. OpenSpec                                                               │
│  "用规格文档固定需求和验收标准"                                                │
│  📂 GitHub: https://github.com/code-yeongyu/openspec                        │
│         ↓ 解决了人机协作需求对齐问题                                            │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  5. Context Engineering                                                     │
│  "在有限上下文窗口中精准分层注入信息"                                          │
│         ↓ 解决了长窗口迷失和上下文污染问题                                       │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  6. Harness Engineering                                                     │
│  "用场景、Mock、Evaluator 验证 AI 输出"                                      │
│         ↓ 解决质量保障问题                                                     │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  7. Loop Engineering                                                        │
│  "OODA 循环、退出机制、错误重试——让 Agent 稳定收敛"                            │
│         ↓ 解决无限循环、过早退出和目标漂移问题                                    │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  golem (真实生产项目)                                                        │
│  "完整 Agent 系统实现案例"                                                    │
│  📂 GitHub: https://github.com/strings77wzq/golem                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

## 学习路径

<div class="learning-map">
  <a href="/agent-engineering-hub/guide/quickstart"><strong>快速开始</strong><span>5 分钟建立第一个 Skill</span></a>
  <a href="/agent-engineering-hub/guide/skills/what-is-skill"><strong>Skills</strong><span>可复用能力模块</span></a>
  <a href="/agent-engineering-hub/guide/mcp/"><strong>MCP</strong><span>标准化上下文协议</span></a>
  <a href="/agent-engineering-hub/guide/openspec/concepts"><strong>OpenSpec</strong><span>规格驱动开发</span></a>
  <a href="/agent-engineering-hub/guide/context/"><strong>Context Engineering</strong><span>上下文窗口设计</span></a>
  <a href="/agent-engineering-hub/guide/harness/intro"><strong>Harness</strong><span>AI 输出质量验证</span></a>
  <a href="/agent-engineering-hub/guide/loop-engineering/"><strong>Loop Engineering</strong><span>闭环迭代控制</span></a>
  <a href="https://github.com/strings77wzq/golem" target="_blank"><strong>golem</strong><span>生产级实战 → GitHub</span></a>
</div>

## 推荐路径

### 初学者路径

1. [快速开始](/guide/quickstart) — 先跑通一个最小例子
2. [什么是 Skill](/guide/skills/what-is-skill) — 理解可复用能力
3. [MCP 入门](/guide/mcp/) — 理解 Agent 如何连接外部
4. [Harness 入门](/guide/harness/intro) — 用测试保护输出质量
5. [Loop Engineering](/guide/loop-engineering/) — 理解 Agent 如何稳定收敛
6. [golem 案例](/guide/golem-case/) — 看真实生产项目

### 工程实践路径

1. [Skill 实战](/guide/skills/practice) — 封装可复用能力
2. [构建 MCP Server](/guide/mcp/server) — 暴露工具和安全边界
3. [OpenSpec 工作流](/guide/openspec/workflow) — 规格驱动开发
4. [上下文工程](/guide/context/) — 上下文窗口设计
5. [评测与质量](/guide/evaluation/) — 验收标准变回归检查
6. [Loop Engineering](/guide/loop-engineering/) — 闭环控制与错误恢复
7. [部署与安全](/guide/deployment/) — 权限、密钥、沙箱

### 架构师路径

1. [上下文工程](/guide/context/) — 五层上下文模型
2. [工作流编排](/guide/agent-workflows/) — 串联完整系统
3. [Loop Engineering](/guide/loop-engineering/) — OODA Loop 与退出机制
4. [检索与知识](/guide/agent-workflows/retrieval) — RAG 知识注入
5. [golem 生产级代码](https://github.com/strings77wzq/golem) — 完整架构参考

## 模块学习标准

| 标准 | 含义 |
|------|------|
| 概念 | 解释要解决什么问题 |
| 操作 | 给出可执行步骤 |
| 练习 | 提供自检任务 |
| 排错 | 常见失败模式 |
| 下一步 | 指向后续章节 |

## 现在开始

从 [快速开始](/guide/quickstart) 进入，或直接查看 [golem 实战](https://github.com/strings77wzq/golem)。
