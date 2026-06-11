---
title: 什么是 Prompt Engineering
description: 理解 Prompt Engineering 的核心概念、LLM 工作原理，以及从手工调试到工程化管理的演进路径
---

# 什么是 Prompt Engineering

Prompt Engineering 是**设计和优化输入给大语言模型（LLM）的指令**，使其稳定、可控地产生高质量输出的工程实践。它不是"写一句好话"，而是一套可测试、可版本化、可复用的方法论。

## 这个模块解决什么问题

在 Agent 工程中，Prompt 是连接人类意图和模型能力的桥梁。常见的痛点包括：

- **输出不稳定**：同样的输入，每次得到不同质量的结果。
- **格式失控**：模型返回的内容不符合下游系统的要求。
- **成本膨胀**：冗长的 Prompt 浪费 Token，增加延迟和费用。
- **难以迭代**：没有版本控制，改了一个 Prompt 导致另一个场景崩溃。

本模块从设计模式、结构化写法、调试方法、实战构建和最佳实践五个维度，系统性地解决这些问题。

## 核心概念

### 提示词组成要素

一个完整的 Prompt 通常包含以下要素：

| 要素 | 作用 | 示例 |
| --- | --- | --- |
| **指令（Instruction）** | 告诉模型要做什么 | "将以下文本翻译成英文" |
| **上下文（Context）** | 提供背景信息 | "你是一位资深 Python 开发者" |
| **输入数据（Input）** | 待处理的内容 | 代码片段、用户问题 |
| **输出格式（Format）** | 约定返回结构 | "以 JSON 格式返回" |
| **约束条件（Constraints）** | 限制行为边界 | "不超过 100 字" |

```text
┌─────────────────────────────────────────┐
│  System / Role  →  模型的身份和行为准则   │
│  Context        →  背景知识和项目信息     │
│  Instruction    →  具体任务描述           │
│  Input          →  用户提供的数据         │
│  Output Format  →  期望的返回结构         │
│  Constraints    →  长度、风格、安全限制    │
└─────────────────────────────────────────┘
```

### LLM 工作原理

理解 LLM 的工作方式有助于写出更好的 Prompt：

1. **Token 化**：输入被拆分为 Token（子词单元），不同模型的分词方式不同。
2. **概率预测**：模型根据上下文逐 Token 预测下一个最可能的 Token。
3. **温度（Temperature）**：控制输出的随机性，0 = 确定性最高，1 = 更多样。
4. **注意力机制**：模型关注输入中不同位置的关联性，位置越靠后权重越高。

关键启示：**指令放在开头或结尾效果最好**（首因效应和近因效应），中间的内容容易被"遗忘"。

### Token 与上下文窗口

上下文窗口（Context Window）是模型单次能处理的最大 Token 数：

| 模型 | 上下文窗口 | 适用场景 |
| --- | --- | --- |
| GPT-4o | 128K tokens | 长文档分析、多轮对话 |
| Claude 3.5 | 200K tokens | 大规模代码审查 |
| Gemini 1.5 | 1M tokens | 超长上下文任务 |
| 开源模型 | 4K-32K tokens | 成本敏感场景 |

**实践建议**：

- 留出 20% 的余量给输出，避免截断。
- 超长上下文不等于"全部塞进去"——信息密度比信息量更重要。
- 用 [上下文工程](/guide/context/) 的方法管理注入内容。

## 从手工到工程化

Prompt 的管理经历了三个阶段：

### 阶段 1：手工调试

```text
用户: 帮我写一个函数
AI: [输出质量不稳定]
用户: 不对，要这样写...
AI: [改了又改]
```

特点：无复用、无测试、纯靠直觉。

### 阶段 2：模板化

```text
system: 你是一位 Python 专家，遵循 PEP 8 规范
user: 请写一个函数：{{description}}
```

特点：有基础结构，但缺乏版本管理和自动化测试。

### 阶段 3：工程化

```text
prompts/
  code-review/
    v1.md          ← 版本控制
    v1.test.yaml   ← 自动化测试
    v1.eval.json   ← 评测结果
```

特点：版本化、可测试、可回滚、有评测基线。

| 维度 | 手工调试 | 模板化 | 工程化 |
| --- | --- | --- | --- |
| 复用性 | 低 | 中 | 高 |
| 可测试性 | 无 | 手动 | 自动化 |
| 版本控制 | 无 | 无 | Git 管理 |
| 质量稳定性 | 随机 | 一般 | 可量化 |

## 学习路径

本模块包含五个子主题，建议按顺序学习：

<div class="learning-path" style="margin: 24px 0; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider);">

### 学习路径

1. **[提示词设计模式](/guide/prompt-engineering/design-patterns)** — 掌握 Zero-shot、Few-shot、Chain-of-Thought 等核心模式，理解每种模式的适用场景和权衡。

2. **[结构化提示词](/guide/prompt-engineering/structured)** — 学习用 XML 标签、JSON Schema、角色设计等方法组织 Prompt，提升输出的可控性。

3. **[调试与迭代](/guide/prompt-engineering/debugging)** — 建立 Prompt 的调试流程：定位失败模式、A/B 测试、版本控制和自动化评测。

4. **[实战：构建 Prompt 库](/guide/prompt-engineering/practice)** — 动手构建一个分类、版本化、可复用的 Prompt 库，涵盖设计、测试和文档。

5. **[最佳实践与反模式](/guide/prompt-engineering/best-practices)** — 识别常见反模式（模糊、过度约束、角色混淆），掌握成本优化和延迟控制技巧。

</div>

## 适用人群

本模块适合：

- **Agent 开发者**：需要稳定、可控的 Prompt 来驱动 Agent 工作流。
- **API 集成工程师**：需要将 LLM 输出解析为结构化数据。
- **产品经理**：需要理解 Prompt 能力边界，设计 AI 功能。
- **技术团队负责人**：需要建立 Prompt 的质量保障体系。

## 下一步

选择一条路径开始学习：

- 如果你是 Prompt Engineering 新手，从 [提示词设计模式](/guide/prompt-engineering/design-patterns) 开始。
- 如果你已经有经验，直接跳到 [实战：构建 Prompt 库](/guide/prompt-engineering/practice)。
- 如果你遇到输出质量问题，先看 [调试与迭代](/guide/prompt-engineering/debugging)。
