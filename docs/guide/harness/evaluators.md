# Evaluators 评估器

评估器是 Harness 的裁判。测试场景定义了"测什么"，评估器定义了"怎么判"——它自动判定 AI 的输出是否满足质量标准。

## 为什么需要自动评估

你可能想：为什么不直接让人类看输出？

答案是**规模化**和**一致性**。一个 Agent 系统每天可能产生数千条输出，人类审查既不经济也不可靠。自动评估器提供：

- **一致性**：同样的输出，同样的判定——不受审查者情绪、疲劳、标准漂移影响
- **速度**：毫秒级判定，支持实时回归测试
- **可追溯**：每次判定都有明确的规则和依据
- **可迭代**：评估标准可以像代码一样版本化、测试、改进

## 内置评估器

### `contains` — 内容包含检查

验证输出是否包含指定的关键词或短语。最基本的评估器，适用于教程、解释类输出。

```json
{
  "evaluator": "contains",
  "params": {
    "must_include": ["递归", "斐波那契", "函数"],
    "must_exclude": ["报错", "异常", "undefined"]
  }
}
```

**适用场景**：代码解释、文档生成、教程输出
**注意事项**：关键词选择需要经验——太少会导致漏检，太多会导致误判

### `exact-match` — 精确匹配

验证输出与期望值完全一致。只适用于确定性输出。

```json
{
  "evaluator": "exact-match",
  "params": {
    "expected": "Hello, World!",
    "case_sensitive": true,
    "trim_whitespace": true
  }
}
```

**适用场景**：固定格式输出、状态码、ID 生成
**注意事项**：对 AI 输出慎用——概率系统很少产生完全相同的输出

### `json-valid` — JSON 格式验证

验证输出是否为合法的 JSON。适用于工具调用、API 响应等结构化输出。

```json
{
  "evaluator": "json-valid",
  "params": {
    "strict": true,
    "allow_comments": false
  }
}
```

**适用场景**：工具调用结果、API 响应、配置文件生成
**进阶用法**：结合 `schema-valid` 验证 JSON 结构

### `schema-valid` — Schema 结构验证

验证输出是否符合预定义的 JSON Schema。比 `json-valid` 更严格，不仅检查格式，还检查结构和类型。

```json
{
  "evaluator": "schema-valid",
  "params": {
    "schema": {
      "type": "object",
      "required": ["explanation", "complexity"],
      "properties": {
        "explanation": { "type": "string", "minLength": 50 },
        "complexity": { "type": "string", "enum": ["O(1)", "O(log n)", "O(n)", "O(n²)"] }
      }
    }
  }
}
```

**适用场景**：结构化数据输出、需要类型和约束验证的场景

### `no-error` — 无错误检查

验证输出中不包含错误指示词。作为所有场景的基线检查。

```json
{
  "evaluator": "no-error",
  "params": {
    "error_indicators": ["error", "Error", "错误", "异常", "undefined", "null", "NaN", "Traceback"]
  }
}
```

**适用场景**：所有场景的基线检查——无论其他评估器怎么配置，都应该同时运行 `no-error`

### `semantic-match` — 语义相似度

验证输出与期望内容在语义上是否接近。使用向量嵌入计算相似度，允许措辞不同但含义一致。

```json
{
  "evaluator": "semantic-match",
  "params": {
    "expected": "这个函数接受两个参数并返回它们的和",
    "threshold": 0.8,
    "model": "text-embedding-3-small"
  }
}
```

**适用场景**：自然语言答案、摘要、翻译
**注意事项**：阈值需要根据场景调优——0.75 适合宽松场景，0.9 适合严格场景

### `language-check` — 语言检查

验证输出是否使用了指定的语言。

```json
{
  "evaluator": "language-check",
  "params": {
    "expected_language": "zh-CN",
    "min_ratio": 0.7
  }
}
```

**适用场景**：多语言 Agent、需要确保中文输出的场景

### `custom` — 自定义评估器

当内置评估器无法满足需求时，用自定义函数实现精确的评估逻辑。

```python
def custom_evaluator(output: str, expected: dict) -> dict:
    """自定义评估器：检查代码解释是否包含复杂度分析"""
    has_complexity = "O(" in output
    has_explanation = len(output) > 100
    has_structure = "##" in output or "1." in output

    return {
        "passed": has_complexity and has_explanation and has_structure,
        "score": sum([has_complexity, has_explanation, has_structure]) / 3,
        "details": {
            "has_complexity": has_complexity,
            "has_explanation": has_explanation,
            "has_structure": has_structure
        }
    }
```

## 评估器组合策略

单一评估器容易误判。推荐组合多个评估器，从不同维度交叉验证：

### 基础组合（推荐所有场景使用）

```json
{
  "evaluators": ["contains", "no-error"]
}
```

`contains` 检查内容质量，`no-error` 检查基本稳定性。这两个评估器应该出现在几乎所有场景中。

### 内容质量组合

```json
{
  "evaluators": ["contains", "no-error", "language-check"],
  "params": {
    "contains": {
      "must_include": ["函数", "参数", "返回值"],
      "must_exclude": ["报错"]
    },
    "language-check": {
      "expected_language": "zh-CN",
      "min_ratio": 0.8
    }
  }
}
```

### 结构化输出组合

```json
{
  "evaluators": ["json-valid", "schema-valid", "no-error"],
  "params": {
    "schema-valid": {
      "schema": { "type": "object", "required": ["result", "status"] }
    }
  }
}
```

### 严格质量组合

```json
{
  "evaluators": ["contains", "semantic-match", "no-error", "language-check"],
  "params": {
    "semantic-match": { "threshold": 0.85 },
    "contains": { "min_keywords": 3 }
  }
}
```

## 阈值调优

阈值是评估器的"及格线"。太低会导致质量不达标，太高会导致大量误判。

### 调优原则

1. **从宽松开始**：新场景先用较低阈值（0.7），确保基线通过
2. **逐步收紧**：随着场景稳定，逐步提高阈值到 0.8-0.9
3. **分场景设置**：不同类型的输出需要不同的阈值
4. **基于数据调整**：看实际的通过/失败分布，而不是凭感觉

### 阈值参考

| 评估器 | 推荐阈值 | 说明 |
|--------|---------|------|
| `semantic-match` | 0.75-0.85 | 语义匹配，太高会导致误判 |
| `contains` | 2-5 个关键词 | 太多会导致误判，太少会导致漏检 |
| `schema-valid` | 严格模式 | Schema 验证应该是二元的（通过/不通过） |

## 失败诊断流程

当评估器判定失败时，按以下流程诊断：

```
评估器报告失败
    │
    ▼
检查评估详情（details 字段）
    │
    ├── 缺少关键词 → 可能是 Prompt 不够明确 → 调整 Prompt
    │
    ├── 包含错误词 → 可能是模型能力不足 → 换模型或加 fallback
    │
    ├── 语义不匹配 → 可能是期望定义不合理 → 调整期望或阈值
    │
    └── 格式错误 → 可能是输出解析问题 → 修复解析逻辑
```

### 诊断清单

失败时检查以下问题：

1. **是 Prompt 的问题吗？** — 期望的输出模式是否在 Prompt 中被明确引导？
2. **是评估器的问题吗？** — 阈值是否合理？关键词是否准确？
3. **是模型的问题吗？** — 换一个模型跑同样的场景，结果如何？
4. **是数据的问题吗？** — 输入是否包含导致输出偏差的噪声？

## 评估器的演进

评估器不是一成不变的。随着 Agent 系统的演进，评估器也应该跟着改进：

```
V1: contains + no-error（基础检查）
    ↓ 发现格式问题
V2: + json-valid（格式检查）
    ↓ 发现语义问题
V3: + semantic-match（语义检查）
    ↓ 发现语言问题
V4: + language-check（语言检查）
    ↓ 发现特殊需求
V5: + custom（自定义检查）
```

每次评估器的变更都应该：
1. 有明确的触发原因（生产失败、新需求、标准提升）
2. 有回归验证（新评估器不会破坏已通过的场景）
3. 有文档记录（为什么加这个评估器、阈值怎么定的）

## 下一步

评估器解决了"怎么判"的问题。但在频繁运行测试时，每次都调用真实 API 成本太高。接下来学习如何用 Mock Server 隔离外部依赖。

→ [Mock Server 模拟服务](/guide/harness/mock-server)
