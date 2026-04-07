# Evaluators 使用指南

Evaluators 用于自动判断 AI 输出是否达标。

## 常用评估器

| Evaluator | 作用 | 典型场景 |
|---|---|---|
| `contains` | 包含关键内容 | 教程解释类输出 |
| `exact-match` | 精确匹配 | 固定格式输出 |
| `json-valid` | JSON 合法性 | 工具调用结果 |
| `no-error` | 不含错误词 | 稳定性检查 |
| `semantic-match` | 语义近似 | 自然语言答案 |

## 组合评估

推荐组合多个 evaluator，降低误判。

```json
{
  "evaluators": ["contains", "json-valid", "no-error"]
}
```

## 阈值建议

- `semantic-match`: 0.75~0.85
- `contains`: 关键关键词 2~5 个

## 失败诊断

先看“缺词”还是“格式”问题，再调整 prompt 或样例。

## 下一步

→ [Mock Server 使用说明](/guide/harness/mock-server)
