# 编写测试场景（Scenarios）

Harness 的核心是“场景驱动评估”：输入、期望、评估器。

## 一个最小测试场景

```json
{
  "name": "解释递归函数",
  "input": {
    "skill": "explain-code",
    "code": "function fib(n){return n<=1?n:fib(n-1)+fib(n-2)}"
  },
  "expected": {
    "contains": ["递归", "斐波那契"],
    "notContains": ["报错"]
  },
  "evaluators": ["contains", "no-error"]
}
```

## 场景设计原则

1. **单一目标**：一条场景只验证一个核心行为
2. **可复现**：输入固定，避免隐式依赖
3. **可解释**：失败后能快速定位原因

## 覆盖策略

- 正常路径（Happy Path）
- 边界输入（Boundary）
- 异常输入（Error Path）

## 目录建议

```text
tests/
  scenarios/
    skills/
    openspec/
    harness/
```

## 下一步

→ [Evaluators 使用指南](/guide/harness/evaluators)
