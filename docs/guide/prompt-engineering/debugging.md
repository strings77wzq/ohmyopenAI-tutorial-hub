---
title: 提示词调试与迭代
description: 建立 Prompt 的调试流程：定位常见失败模式、A/B 测试、版本控制和自动化评测
---

# 提示词调试与迭代

Prompt 调试不是"改改措辞试试看"，而是系统性地定位问题、验证假设、记录变更的过程。

## 常见失败模式

### 1. 输出格式不符

模型返回纯文本而非期望的结构化格式。

**修复**：明确指定输出格式，用 Few-shot 示例展示期望结构。

```text
请分析代码，按以下格式返回 JSON：
{
  "issues": [{"severity": "high", "description": "..."}],
  "score": 7
}
```

### 2. 幻觉（Hallucination）

模型生成不存在的 API、虚构的数据或错误的事实。

**修复**：在 Prompt 中提供上下文并限制模型只使用给定信息。

```text
<context>
以下是项目的 API 文档：{{api_docs}}
</context>
<task>
只使用上述文档中定义的 API。
如果没有相关 API，请明确说明"文档中未找到"。
不要猜测或虚构 API 名称。
</task>
```

### 3. 指令被忽略

模型没有执行 Prompt 中的某个要求。

**修复**：将重要指令放在 Prompt 的**开头和结尾**（首因/近因效应），用 `<important>` 标签强调，减少总指令数量。

### 4. 输出冗长或过短

**修复**：用 `<constraints>` 标签明确长度限制。

### 5. 角色与任务矛盾

**修复**：确保角色定义与任务匹配，或在 Task 部分覆盖角色设定。

## A/B 测试方法

### 基本流程

```text
1. 定义基线（Prompt A）
2. 修改一个变量（Prompt B）
3. 用相同输入测试两个版本（至少 10 次）
4. 比较输出质量
5. 保留更好的版本
```

### 变量控制原则

每次只修改一个变量：

| 变量类型 | 示例变更 | 影响维度 |
| --- | --- | --- |
| 结构 | 加入 XML 标签 | 输出格式 |
| 角色 | 改变角色描述 | 输出风格 |
| 约束 | 增加长度限制 | 输出长度 |
| 示例 | 添加/修改 Few-shot | 输出质量 |
| 模型 | 切换 GPT-4o → Claude | 整体能力 |

## 版本控制

### 文件命名约定

```text
prompts/
  code-review/
    v1.0.md              ← 初始版本
    v1.1.md              ← 小改动（修格式）
    v2.0.md              ← 大改动（换模式）
    v1.0.test.yaml       ← 对应的测试用例
    CHANGELOG.md         ← 变更记录
```

### 变更日志格式

```markdown
## v2.0 (2026-06-10)
- 从 Zero-shot 切换到 Few-shot + CoT 模式
- 输出格式从纯文本改为 JSON
- **影响**：格式合规率从 60% 提升到 95%

## v1.0 (2026-06-01)
- 初始版本
```

## 自动化评测

### 评测用例设计

```yaml
# code-review/v2.0.test.yaml
test_name: Code Review Prompt v2.0 评测
model: gpt-4o
temperature: 0

test_cases:
  - name: 安全漏洞检测
    input: |
      def get_user(id):
          query = f"SELECT * FROM users WHERE id = {id}"
          return db.execute(query)
    validators:
      - type: contains
        value: "SQL"
      - type: json_valid
        schema: review-output-schema.json

  - name: 输出格式验证
    input: "def add(a,b): return a+b"
    validators:
      - type: json_valid
        schema: review-output-schema.json
```

### 评测脚本

```typescript
import fs from 'node:fs'
import yaml from 'yaml'

async function evalPrompt(promptPath: string, testPath: string) {
  const prompt = fs.readFileSync(promptPath, 'utf8')
  const testFile = yaml.parse(fs.readFileSync(testPath, 'utf8'))
  let passed = 0, total = 0

  for (const tc of testFile.test_cases) {
    total++
    const output = await callLLM(prompt, tc.input)
    if (validate(output, tc.validators)) passed++
  }

  console.log(`通过率: ${(passed / total * 100).toFixed(1)}%`)
}
```

### 评测指标

| 指标 | 目标值 |
| --- | --- |
| 格式合规率 | > 95% |
| 任务完成率 | > 90% |
| 平均延迟 | < 5s |

## 调试检查清单

当 Prompt 输出不理想时，按此顺序排查：

1. **格式问题？** → 检查是否指定了输出格式，是否用 Few-shot 示例。
2. **内容缺失？** → 检查指令是否放在开头/结尾，是否被中间内容淹没。
3. **幻觉问题？** → 检查是否提供了足够的上下文，是否要求引用来源。
4. **不稳定？** → 检查是否使用了 Self-consistency，是否降低了 temperature。
5. **太长/太短？** → 检查是否有明确的长度约束。
6. **角色冲突？** → 检查角色定义是否与任务匹配。

## 练习

1. 给定一个输出格式不稳定的 Prompt，使用本节方法诊断并修复。
2. 为你的 Prompt 库中的一个 Prompt 编写 3 个测试用例。
3. 设计一个简单的 A/B 测试，比较 Zero-shot 和 Few-shot 在同一任务上的表现。

## 下一步

掌握了调试方法后，动手构建一个完整的 Prompt 库：

→ [实战：构建 Prompt 库](/guide/prompt-engineering/practice)
