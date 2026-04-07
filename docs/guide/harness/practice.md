# Harness 实战案例：从场景到报告

本案例演示如何为 `explain-code` Skill 建立一套可回归测试。

## Step 1：定义场景

```json
{
  "name": "解释排序算法",
  "input": {
    "skill": "explain-code",
    "code": "function bubbleSort(arr){...}"
  },
  "expected": {
    "contains": ["冒泡", "时间复杂度"],
    "notContains": ["未知错误"]
  },
  "evaluators": ["contains", "no-error"]
}
```

## Step 2：运行测试

```bash
pytest tests/scenarios/test_explain_code.py
```

## Step 3：查看报告

报告应包含：

- 总通过率
- 各场景失败原因
- 建议修复项

## Step 4：迭代优化

- 调整 prompt
- 增加 examples
- 复跑同一批场景，比较前后指标
