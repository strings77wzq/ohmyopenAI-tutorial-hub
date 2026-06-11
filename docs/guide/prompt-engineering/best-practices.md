---
title: 最佳实践与反模式
description: 识别常见反模式，掌握成本优化、延迟控制和模型特定的最佳实践
---

# 最佳实践与反模式

## 反模式

### 模糊指令

```text
# ❌ 反模式
请帮我优化这段代码。

# ✅ 正确做法
请优化以下 Python 代码的性能，重点关注：
1. 减少数据库查询次数（当前有 N+1 问题）
2. 添加缓存层
3. 保持 API 兼容性
约束：不改变函数签名，不引入新依赖。
```

**原则**：具体、可验证、有约束。

### 过度约束

```text
# ❌ 反模式
请写一个函数，必须用 for 循环不能用 map，变量名必须用 x 和 y...

# ✅ 正确做法
请写一个 Python 函数，将列表中的偶数提取出来并求和。
要求：使用函数式编程风格，包含类型注解。
```

**原则**：只约束对任务结果有影响的方面。

### 角色与任务矛盾

```text
# ❌ 反模式
System: 你是一个友好的客服代表，总是积极正面。
User: 请审查这段代码的安全漏洞，不要隐瞒任何问题。

# ✅ 正确做法
System: 你是一位安全审计专家，专注于发现潜在风险。
```

**原则**：角色定义应与任务性质一致。

### 信息过载

```text
# ❌ 反模式
[2000 字的项目文档直接粘贴]
请帮我看看有什么问题。

# ✅ 正确做法
项目背景：FastAPI REST API，处理用户认证。
当前问题：登录接口响应慢（>3s）。
相关代码：[只贴认证模块的 50 行代码]
```

**原则**：提供与任务直接相关的信息，其余作为可选上下文。

### 隐含假设

```text
# ❌ 反模式
把这段代码改成异步的。

# ✅ 正确做法
将以下同步的数据库查询代码改为异步版本：
- 使用 async/await 语法
- 保持事务一致性
- 确保错误处理不变
```

**原则**：明确所有假设和约束条件。

## 成本优化

### 减少 Token 消耗

```text
# ❌ 高成本写法（~500 tokens）
你是一位非常专业的、经验丰富的、专注于后端开发的高级软件工程师...

# ✅ 低成本写法（~100 tokens）
<role>后端工程师</role>
<task>审查代码安全性</task>
```

| 策略 | 方法 | 节省比例 |
| --- | --- | --- |
| 精简 System Prompt | 去掉冗余描述 | 20-40% |
| 避免重复上下文 | 用变量引用代替重复粘贴 | 30-60% |
| 按需加载上下文 | 只提供当前步骤需要的信息 | 40-70% |
| 选择合适模型 | 简单任务用小模型 | 成本降 5-10x |

### 分级模型策略

```typescript
function selectModel(task: string): string {
  const complexity = assessComplexity(task)
  if (complexity === 'simple') return 'gpt-4o-mini'  // 分类、格式转换
  if (complexity === 'medium') return 'gpt-4o'        // 代码审查、摘要
  return 'o1'                                          // 数学推理、复杂规划
}
```

## 延迟优化

### 并行调用

```typescript
// ❌ 串行：总延迟 = 3s + 2s + 4s = 9s
const review = await callLLM(reviewPrompt)
const summary = await callLLM(summaryPrompt)

// ✅ 并行：总延迟 = max(3s, 2s) = 3s
const [review, summary] = await Promise.all([
  callLLM(reviewPrompt),
  callLLM(summaryPrompt),
])
```

### 流式输出 + 精简 Prompt

```typescript
// 对用户体验敏感的场景使用流式输出
const stream = await client.chat.completions.create({
  model: 'gpt-4o', messages, stream: true,
})
```

目标：控制 System Prompt 在 200 tokens 以内，减少首 Token 延迟。

## 模型特定技巧

| 模型 | 技巧 | 适合场景 |
| --- | --- | --- |
| GPT-4o | JSON 输出支持好，用 `response_format` 强制 JSON | 代码生成、数据分析 |
| Claude | XML 标签支持最好，用 `<thinking>` 引导推理 | 代码审查、复杂分析 |
| 开源模型 | 上下文窗口小，Prompt 要精简，Few-shot 效果明显 | 分类、本地部署 |

## 检查清单

- [ ] 角色定义与任务匹配
- [ ] 指令放在开头或结尾
- [ ] 输出格式明确指定
- [ ] 没有模糊或矛盾的要求
- [ ] System Prompt 控制在 200 tokens 以内
- [ ] 有版本号和变更记录
- [ ] 有配套的测试用例

## 模块总结

| 主题 | 核心要点 |
| --- | --- |
| [设计模式](/guide/prompt-engineering/design-patterns) | 选择正确的模式比调整措辞更重要 |
| [结构化](/guide/prompt-engineering/structured) | 用结构代替冗长描述，用 Schema 约束输出 |
| [调试](/guide/prompt-engineering/debugging) | 系统性诊断，版本化管理，自动化评测 |
| [Prompt 库](/guide/prompt-engineering/practice) | 分类、版本化、可复用、可测试 |
| 最佳实践 | 避免反模式，优化成本和延迟，适配模型特性 |

## 延伸阅读

- [Anthropic Prompt Engineering 指南](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)
- [OpenAI Prompt Engineering 最佳实践](https://platform.openai.com/docs/guides/prompt-engineering)
- [Google Gemini Prompt 设计](https://ai.google.dev/docs/prompt_best_practices)
