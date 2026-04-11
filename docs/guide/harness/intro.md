# Harness 简介

> Harness Engineering：从"代码创作者"到"创造过程守护者"的工程哲学

## 什么是 Harness？

**Harness = "马与缰绳"**。它的使命是为强大但方向不定的"野马"（AI Agent）套上缰绳，通过约束、引导并纠正其行为，确保它能沿着预设轨道稳定、可靠地前行。

```
AI Agent (野马) + Harness (缰绳) = 千里马 (可靠系统)
```

## 为什么需要 Harness？

### Vibe Coding 的困境

当 AI 承担起代码编写等具体任务时，工程师的核心价值从"动手执行"转向"系统设计"。但仅靠 Prompt 这种"软约束"远远不够。

### R.E.S.T 模型

构建可靠 Agent 系统的四个核心目标：

| 维度 | 定义 | 关键要求 |
| --- | --- | --- |
| **R**eliability | 面对变化时持续稳定服务 | 失败可恢复、操作幂等、行为一致 |
| **E**fficiency | 资源使用的有效性 | Token 预算控制、低延迟、高吞吐 |
| **S**ecurity | 保护系统和数据 | 最小权限、沙盒执行、输入/输出过滤 |
| **T**raceability | 可追溯可审计 | 全链路追踪、决策可解释、状态可审计 |

## 核心循环

Agent 的运行机制可抽象为四阶段循环：

```
Observe (观察) → Think (思考) → Act (行动) → Feedback (反馈)
```

这本质上是一个 **REPL 容器**：Read → Eval → Print → Loop

## 六大设计原则

1. **为失败而设计** - 异常是常态，非个例
2. **契约优先** - 明确的机器可读契约
3. **默认安全** - 最小权限、零信任
4. **决策与执行分离** - 解耦提升灵活性
5. **万物皆可度量** - 可分析可优化
6. **数据驱动进化** - 从运行中学习

## Harness 的组成部分

### 1. 测试场景（Test Scenarios）

定义输入和期望输出：

```json
{
  "name": "代码解释测试",
  "input": "function add(a, b) { return a + b; }",
  "expectedOutput": "包含函数功能说明",
  "evaluator": "semantic-match"
}
```

### 2. Evaluators（评估器）

自动评估 AI 输出的质量：

| Evaluator | 用途 |
|-----------|------|
| `exact-match` | 完全匹配 |
| `contains` | 包含特定内容 |
| `semantic-match` | 语义相似度 |
| `json-valid` | JSON 格式验证 |
| `no-error` | 无错误输出 |

### 3. Mock Server（模拟服务器）

模拟 AI API 响应，用于测试：

```
真实 API：$$$ 每次调用
Mock Server：$0，快速、可重复
```

### 4. Fixtures（固定样本）

Fixtures 是稳定输入集合，用来保证每次回归检查都覆盖同一批关键案例。它适合保存代码片段、用户问题、工具返回值和错误样本。

### 5. Traces（执行轨迹）

Trace 记录一次 Agent 工作流里发生了什么：读了哪些上下文、调用了哪些工具、每一步输出什么。它是定位失败的证据，不应该只在问题发生后临时补。

### 6. Failure Triage（失败分诊）

失败分诊回答三个问题：

| 问题 | 判断方式 |
| --- | --- |
| 是 prompt 失败还是工具失败 | 对比 trace 和 tool 返回值 |
| 是新需求还是回归 | 对比 OpenSpec 验收标准 |
| 是模型波动还是确定性缺陷 | 重放 fixture 和 mock 响应 |

## 典型使用场景

### 场景 1：Skill 测试

确保 Skill 的输出质量：

```javascript
// 测试 explain-code Skill
const result = await runSkill('explain-code', {
  code: 'function fib(n) { return n <= 1 ? n : fib(n-1) + fib(n-2); }'
});

// 评估结果
expect(result).toContain('递归');
expect(result).toContain('斐波那契');
expect(result).not.toContain('错误');
```

### 场景 2：回归测试

代码变更后验证 AI 行为：

```bash
# 修改了 Skill 的 prompt
# 运行回归测试，确保没有破坏现有功能
npm test
```

### 场景 3：性能基准

评估不同模型的性能：

```javascript
// 测试 GPT-4 vs Claude 的代码解释质量
const gpt4Result = await testModel('gpt-4', testCases);
const claudeResult = await testModel('claude', testCases);

// 对比评分
compareResults(gpt4Result, claudeResult);
```

## 工作流程

```
┌─────────────────┐
│  定义测试场景    │
│  (Scenario)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  运行测试       │
│  (Run Test)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Evaluator 评估 │
│  (Evaluate)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  生成报告       │
│  (Report)       │
└─────────────────┘
```

## 示例：完整的测试流程

### 1. 定义测试

```javascript
// tests/explain-code.test.js
describe('explain-code Skill', () => {
  const testCases = [
    {
      name: '简单函数解释',
      input: 'function add(a, b) { return a + b; }',
      expected: {
        contains: ['函数', 'add', '参数'],
        notContains: ['错误', 'exception']
      }
    },
    {
      name: '递归函数解释',
      input: 'function fib(n) { return n <= 1 ? n : fib(n-1) + fib(n-2); }',
      expected: {
        contains: ['递归', '斐波那契'],
        semanticMatch: '解释递归调用过程'
      }
    }
  ];

  testCases.forEach(tc => {
    test(tc.name, async () => {
      const result = await runSkill('explain-code', { code: tc.input });
      
      // 使用 Evaluator 评估
      const evaluation = await evaluate(result, tc.expected);
      
      expect(evaluation.passed).toBe(true);
    });
  });
});
```

### 2. 运行测试

```bash
npm test
```

### 3. 查看结果

```
PASS  tests/explain-code.test.js
  explain-code Skill
    ✓ 简单函数解释 (145ms)
    ✓ 递归函数解释 (203ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

## Harness vs 单元测试

| | 单元测试 | Harness |
|---|---------|---------|
| **测试对象** | 代码逻辑 | AI 输出 |
| **确定性** | 确定性（给定输入必有固定输出） | 非确定性（输出有变化） |
| **验证方式** | 精确匹配 | 语义评估 |
| **Mock** | Mock 函数/依赖 | Mock AI API |

## Harness 架构检查清单

- 每个场景都有输入、预期和失败解释。
- Mock Server 能复现下游成功、失败、超时和空数据。
- Evaluator 只评估一个明确标准。
- Fixtures 覆盖正常、边界和恶意输入。
- Trace 能定位上下文、工具调用和模型输出的责任边界。
- 回归套件能在发布前运行。

## 下一步

学习如何编写测试场景：

→ [编写测试场景](/guide/harness/writing-tests)
