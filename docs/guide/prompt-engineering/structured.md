---
title: 结构化提示词
description: 学习用 XML 标签、JSON Schema、角色设计和输出约束来组织 Prompt，提升输出的可控性和一致性
---

# 结构化提示词

结构化提示词的核心思想：**用清晰的结构代替冗长的描述**。当 Prompt 有明确的层次和分隔时，模型更容易理解意图并产生一致的输出。

## 为什么需要结构化

```text
# ❌ 非结构化
请帮我审查这段代码，检查有没有安全问题，然后看看性能方面有没有可以优化的地方，
另外也看看代码风格是不是符合规范，如果有问题请给出修改建议...

# ✅ 结构化
<task>代码审查</task>
<code>{{code}}</code>
<checklist>
1. 安全性：SQL 注入、XSS、密钥泄露
2. 性能：N+1 查询、不必要的循环
3. 风格：命名规范、代码复杂度
</checklist>
<output_format>
对每个维度给出：问题描述、严重程度（高/中/低）、修复建议。
最后给出整体评分（1-10）。
</output_format>
```

## 方法 1：XML 标签分隔

XML 标签是最常用的结构化方法，几乎所有主流模型都支持。

```text
<role>你是一位资深的 Python 后端工程师，专注于性能优化。</role>

<context>
项目使用 FastAPI + SQLAlchemy，数据库为 PostgreSQL。
用户反馈列表接口响应时间超过 3 秒。
</context>

<task>
分析以下接口代码，找出性能瓶颈并给出优化方案。
</task>

<code>{{code}}</code>

<output>
使用 Markdown 格式，按优先级排列问题，每个问题包含：
1. 问题描述  2. 影响程度  3. 修复代码
</output>
```

### 嵌套标签

```text
<requirements>
  <language>Python 3.11+</language>
  <framework>FastAPI</framework>
  <style>
    - 遵循 PEP 8
    - 使用 type hints
    - 函数不超过 30 行
  </style>
  <forbidden>
    - 不使用 global 变量
    - 不使用 except: (裸异常)
  </forbidden>
</requirements>
```

### 标签命名建议

| 场景 | 推荐标签 | 说明 |
| --- | --- | --- |
| 模型身份 | `<role>`, `<persona>` | 定义模型角色 |
| 背景信息 | `<context>`, `<background>` | 提供项目或领域知识 |
| 任务描述 | `<task>`, `<instruction>` | 明确要做什么 |
| 输入数据 | `<input>`, `<code>`, `<data>` | 待处理的内容 |
| 输出要求 | `<output>`, `<format>` | 约定返回结构 |
| 约束 | `<constraints>`, `<rules>` | 限制条件 |

## 方法 2：JSON Schema 约束输出

当输出需要被程序解析时，用 JSON Schema 精确定义输出结构。

```text
请分析用户反馈并返回 JSON 格式的结果。

输出格式：
{
  "sentiment": "positive" | "negative" | "neutral",
  "confidence": 0.0-1.0,
  "topics": ["topic1", "topic2"],
  "summary": "一句话摘要",
  "action_items": [
    {
      "priority": "high" | "medium" | "low",
      "description": "具体行动项",
      "owner": "负责团队"
    }
  ]
}

用户反馈：
{{feedback}}
```

### Schema 验证器

```typescript
// schema-validator.ts — 验证 LLM 输出是否符合 Schema
import { z } from 'zod'

const ReviewResultSchema = z.object({
  issues: z.array(z.object({
    file: z.string(),
    line: z.number(),
    severity: z.enum(['high', 'medium', 'low']),
    description: z.string(),
    fix: z.string().optional(),
  })),
  score: z.number().min(1).max(10),
  summary: z.string().max(200),
})

function parseAndValidate(rawOutput: string) {
  const jsonMatch = rawOutput.match(/```json\s*([\s\S]*?)```/)
  if (!jsonMatch) throw new Error('No JSON block found')
  const parsed = JSON.parse(jsonMatch[1])
  return ReviewResultSchema.parse(parsed)
}
```

## 方法 3：角色与消息设计

```typescript
const messages = [
  {
    role: 'system',
    content: `你是一位代码审查专家。你的审查风格：
- 直接指出问题，不说废话
- 每个问题给出修复代码
- 按严重程度排序，不超过 5 个主要问题`
  },
  {
    role: 'user',
    content: `请审查以下 PR 的代码变更：

\`\`\`diff
${diff}
\`\`\`

关注点：安全性、性能、可维护性。`
  }
]
```

### 角色设计原则

```text
# ✅ 好的角色定义：具体、有限制、有方向
<role>
你是一位有 10 年经验的 Python 后端工程师。
专长是 FastAPI 和 PostgreSQL 性能优化。
审查代码时关注：安全漏洞、性能瓶颈、代码质量。
回复风格：简洁直接，用代码示例说明。
</role>

# ❌ 不好的角色定义：模糊、无限制
<role>你是一个超级厉害的全能程序员，请以最专业的方式帮我审查代码。</role>
```

## 方法 4：输出约束

```text
<constraints>
- 回复不超过 200 字
- 代码示例不超过 20 行
- 每个问题用一句话描述
</constraints>

<output_format>
## 问题 1: [标题]
**严重程度**: 高/中/低
**位置**: 文件名:行号
**描述**: 问题说明
**修复**:
\`\`\`python
# 修复后的代码
\`\`\`
</output_format>

<forbidden>
- 不要修改功能逻辑
- 不要删除现有注释
- 不要添加新的依赖
</forbidden>
```

## 组合模板

```text
<system>
<role>你是一位资深的全栈工程师，负责代码审查。</role>
<tone>直接、专业、有建设性。</tone>
</system>

<context>
项目：{{project_name}}
技术栈：{{tech_stack}}
</context>

<task>审查以下代码变更，重点关注安全性、性能和可维护性。</task>

<code>{{diff}}</code>

<output_format>
对每个问题：标题、严重程度（🔴高/🟡中/🟢低）、位置、描述、修复代码。
最后给出整体评分（1-10）和一句话总结。
</output_format>

<constraints>
- 最多 5 个问题，每个不超过 3 句话
- 修复代码必须可直接运行
</constraints>
```

## 练习

1. **XML 标签重写**：将以下 Prompt 改写为 XML 结构：
   ```text
   帮我把这段文字翻译成英文，要保持专业语气，不要翻译专有名词，输出为 JSON 格式包含 original 和 translated 两个字段。
   ```

2. **Schema 设计**：为"会议纪要提取"设计 JSON Schema，包含：参与者、议题列表、决策事项、待办事项。

3. **角色设计**：为"技术文档写作助手"设计 System Prompt，要求面向非技术人员、使用类比解释概念。

## 下一步

结构化让 Prompt 更清晰，但还需要系统性的调试方法：

→ [提示词调试与迭代](/guide/prompt-engineering/debugging)
