# Evaluators Guide

Evaluators are used to automatically judge whether AI output meets quality standards.

## Common Evaluators

| Evaluator | Purpose | Typical Use Case |
|-----------|---------|-----------------|
| `contains` | Checks for key content | Tutorial/explanation outputs |
| `exact-match` | Exact string matching | Fixed-format outputs |
| `json-valid` | JSON validity | Tool call results |
| `no-error` | No error keywords | Stability checks |
| `semantic-match` | Semantic similarity | Natural language answers |

## Combining Evaluators

It's recommended to combine multiple evaluators to reduce false positives.

```json
{
  "evaluators": ["contains", "json-valid", "no-error"]
}
```

## Threshold Recommendations

- `semantic-match`: 0.75–0.85
- `contains`: 2–5 key keywords

## Failure Diagnosis

First check whether it's a "missing word" issue or a "format" issue, then adjust the prompt or examples accordingly.

## Next Steps

→ [Mock Server Guide](/guide/harness/mock-server)
