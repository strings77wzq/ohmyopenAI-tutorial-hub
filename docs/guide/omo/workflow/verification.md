# 验证回路

验证回路确保 Agent 输出的质量，是 Harness 工程的核心实践。

## 三层验证

### 1. 自验证

Agent 完成后自己检查：

```typescript
// Agent 执行完成后
const result = await agent.execute(task);
// 自检查
if (!validate(result)) {
  await agent.fix();
}
```

### 2. 交叉验证

另一个 Agent 审核结果：

```typescript
// 让 Oracle 验证 Hephaestus 的代码
@oracle 审查这个设计的架构合理性
```

### 3. 独立验证

用独立验证回路确保确定性：

```
Hephaestus 写代码 → Hephaestus 验证代码
// 但不同实例，降低关联性
```

## 验证什么？

| 维度 | 检查项 |
|------|--------|
| **功能** | 输出满足需求 |
| **语法** | 代码无错误 |
| **规范** | 符合 AGENTS.md |
| **测试** | 验收测试通过 |

## 失败处理

验证失败时的策略：
1. 自动重试（有限次）
2. 回退到人类审核
3. 记录问题待后续处理