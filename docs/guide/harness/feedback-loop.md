# Harness 反馈循环

反馈循环是 Harness 四大护栏之一，确保 Agent 输出质量。

## 什么是反馈循环？

Agent 完成后，验证输出质量，不满意则循环修复。

## 三层验证

### 1. 自验证

Agent 自己检查输出：

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

用独立实例验证，降低关联风险：

```
Hephaestus 写代码 → 另一个 Hephaestus 验证
```

## 实际应用

一个典型的多层验证回路：

```markdown
## 验证回路设计

### 1. 自验证
- Agent 完成后自己检查

### 2. 交叉验证  
- 独立 Agent 架构审查

### 3. 独立验证
- 第三方验证者确认结果
```

## 行业实践

| 团队 | 反馈循环方式 |
|------|-------------|
| **OpenAI** | Agent Review Agent |
| **Anthropic** | 独立验证回路 |
| **LangChain** | 测试驱动 |