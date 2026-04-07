# Harness 简介

理解 Harness 测试基础设施的核心概念和价值。

## 什么是 Harness？

Harness 是**测试基础设施**，专门用于评估 AI 生成内容的质量。

### 为什么需要 Harness？

**传统测试**：
- 测试代码是否按预期执行
- 验证输入输出是否正确

**AI 测试的特殊性**：
- AI 输出是**非确定性**的（同样的输入可能有不同的输出）
- 需要评估**语义正确性**（不仅仅是语法）
- 需要模拟各种场景（成本高）

### Harness 的核心价值

```
AI 生成内容 → Harness 评估 → 质量报告
                    ↑
            自动化的质量保障
```

1. **自动化评估**：无需人工检查每个输出
2. **一致性保障**：确保 AI 输出符合预期
3. **回归测试**：代码变更后自动验证
4. **成本控制**：使用 Mock 避免真实 API 调用

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

## 下一步

学习如何编写测试场景：

→ [编写测试场景](/guide/harness/writing-tests)
