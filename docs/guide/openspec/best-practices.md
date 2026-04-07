# OpenSpec 最佳实践与常见错误

## 最佳实践

### 1) 变更名要窄且清晰

- ✅ `add-order-checkout`
- ❌ `optimize-system`

名称越具体，评审与追踪越轻松。

### 2) Proposal 两分钟可读完

至少回答四件事：

1. 为什么做（Why）
2. 做什么（What）
3. 不做什么（Non-Goals）
4. 风险是什么（Risks）

### 3) Specs 写“场景”，不要写“感受”

- ✅ Given/When/Then
- ❌ “页面更友好”“体验更好”

场景可测试，才能稳定实现。

### 4) Tasks 要小而有序

每个任务最好 30~90 分钟可完成；后置任务依赖前置任务明确可见。

### 5) apply 前先审规范

`/opsx:ff` 生成很快，但一定先人工审 proposal/specs/design/tasks，再 `/opsx:apply`。

### 6) 计划与编码分会话

长会话会污染上下文。规划稳定后开新会话执行，输出质量更高。

### 7) 完成即归档

`/opsx:archive` 保持 `changes/` 目录“只放进行中变更”。

## 常见错误

### 错误 1：一条变更塞太多功能

症状：任务爆炸、评审困难、返工频繁。

修复：拆成多个 change，按业务流拆分。

### 错误 2：设计写成实现细节

症状：design.md 充满代码片段，但缺少取舍理由。

修复：design 写“为什么这样做”，代码细节放实现阶段。

### 错误 3：Spec 与代码不同步

症状：代码做了但文档没更新，后续 AI 继续按旧规范执行。

修复：每次变更后执行 verify + 同步 specs。

### 错误 4：任务没有验收标准

症状：任务“看起来完成”但无法验证。

修复：每个任务加可验证输出（文件/API/测试结果）。

## 实操检查清单

- [ ] proposal 有 Why / What / Non-Goals / Risks
- [ ] specs 每个 requirement 至少一个 scenario
- [ ] tasks 顺序与依赖清晰
- [ ] apply 前人工审查完成
- [ ] verify 通过后再 archive
