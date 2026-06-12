# Harness 简介

> Harness Engineering：从"代码创作者"到"创造过程守护者"的工程哲学

## 什么是 Harness

**Harness = 测试线束**，借自硬件工程术语。在电子工程中，线束（harness）是一组连接器和线缆，用于在测试环境中连接和控制被测设备。它的使命是：**为强大但不可预测的被测对象建立可控、可重复、可度量的测试环境**。

在 Agent 工程中，LLM 就是那个"强大但不可预测的被测对象"。Harness 是包围它的整套质量基础设施：

```
AI Agent (强大但不可预测) + Harness (质量基础设施) = 生产级系统 (可靠且可控)
```

更精确地说：

```
Agent = Harness + LLM
```

这个等式不是比喻，而是架构事实。LLM 提供智能——理解、推理、生成。Harness 提供可靠性——测试、验证、约束、监控。缺了任何一边，你得到的都不是一个完整的 Agent 系统。

## 为什么需要 Harness

### Vibe Coding 的困境

当你用 AI 写代码时，你会发现一个悖论：AI 能写出高质量的代码，但你无法保证它每次都能写出高质量的代码。同样的 Prompt，今天可能生成完美的实现，明天可能生成有微妙 bug 的版本。

这不是 AI 的缺陷，这是概率系统的本质特征。而传统的"写完就跑"工作流完全没有为这种非确定性做准备。

仅靠 Prompt 这种"软约束"远远不够。你需要：

- **硬验证**：不是"我觉得 AI 说得对"，而是"评估器确认 AI 的输出满足质量标准"
- **可重复性**：不是"这次效果不错"，而是"每次运行都产生可接受的结果"
- **可追溯性**：不是"不知道为什么失败了"，而是"能精确定位是哪个环节出了问题"

### 没有 Harness 会怎样

让我们看一个真实的失败场景：

```python
# 第一周：Prompt 写得不错，AI 输出很稳定
result = agent.run("解释这段代码的功能")
# 输出：准确的中文解释 ✅

# 第三周：Prompt 改了几次，加了新功能
result = agent.run("解释这段代码的功能")
# 输出：开始包含英文注释 ❌

# 第五周：模型提供商更新了模型
result = agent.run("解释这段代码的功能")
# 输出：格式完全变了，下游解析失败 ❌❌
```

没有 Harness，你甚至不知道什么时候出了问题。没有测试，没有评估，没有基线——你只是在"希望"AI 一直表现良好。

有了 Harness，每次 Prompt 变更、模型更新、功能迭代都会触发回归测试。失败会被自动捕获、分类、报告。你从"祈祷模式"切换到"工程模式"。

## R.E.S.T 模型：可靠 Agent 系统的四个维度

构建可靠的 Agent 系统需要在四个维度上同时达标：

| 维度 | 定义 | 关键要求 | Harness 如何支撑 |
|------|------|---------|----------------|
| **R**eliability（可靠性） | 面对变化时持续稳定服务 | 失败可恢复、操作幂等、行为一致 | 回归测试 + 一致性检查 |
| **E**fficiency（效率） | 资源使用的有效性 | Token 预算控制、低延迟、高吞吐 | 性能基准 + 成本监控 |
| **S**ecurity（安全性） | 保护系统和数据 | 最小权限、沙盒执行、输入/输出过滤 | 安全测试 + 恶意输入检测 |
| **T**raceability（可追溯性） | 可追溯可审计 | 全链路追踪、决策可解释、状态可审计 | 执行轨迹 + 决策日志 |

每个维度都不是可选的"锦上添花"，而是生产环境的硬性要求。Harness 是同时满足这四个维度的系统化手段。

## 核心循环：Observe → Think → Act → Feedback

Agent 的运行机制可以抽象为四阶段循环：

```
Observe (观察) ──▶ Think (思考) ──▶ Act (行动) ──▶ Feedback (反馈)
     ▲                                                  │
     └──────────────────────────────────────────────────┘
```

这本质上是一个 **REPL 容器**（Read-Eval-Print-Loop）：

1. **Observe（观察）**：Agent 接收输入——用户请求、系统状态、上下文信息
2. **Think（思考）**：LLM 进行推理——分析需求、规划步骤、选择策略
3. **Act（行动）**：Agent 执行操作——调用工具、生成代码、返回结果
4. **Feedback（反馈）**：Harness 验证输出——评估质量、检测异常、触发重试

关键洞察：**Feedback 阶段是 Harness 发挥作用的核心位置**。没有 Feedback，循环就是一个开环系统——你不知道输出质量如何，也无法自动改进。有了 Feedback，循环变成闭环系统——每一次迭代都在被监控、被评估、被优化。

## 六大设计原则

构建 Harness 系统时，遵循这六条原则：

### 1. 为失败而设计

异常不是偶发的个例，而是概率系统的常态。你的 Harness 必须能优雅地处理：模型超时、输出格式错误、评估器误判、依赖服务不可用。

```python
# 不好的做法：假设 AI 一定会成功
result = ai_call(prompt)
process(result)

# 好的做法：为每种失败准备应对策略
try:
    result = ai_call(prompt, timeout=30)
    if not evaluator.validate(result):
        result = fallback_strategy(prompt)
except AITimeoutError:
    result = cached_response(prompt)
except AIParseError:
    result = repair_output(raw_response)
```

### 2. 契约优先

明确的、机器可读的契约比自然语言需求更可靠。测试场景本身就是契约——它精确地定义了"什么输入应该产生什么质量的输出"。

```json
{
  "contract": {
    "input": "任意合法的 JavaScript 代码",
    "output_must_contain": ["功能说明", "参数描述"],
    "output_must_not_contain": ["报错", "undefined"],
    "max_latency_ms": 5000,
    "evaluator": "semantic-match",
    "threshold": 0.8
  }
}
```

### 3. 默认安全

最小权限原则：每个组件只能访问它完成工作所需的最小资源集。Mock Server 隔离外部依赖，沙盒执行隔离危险操作，输入过滤防止注入攻击。

### 4. 决策与执行分离

把"决定做什么"和"实际去做"分开。Agent 决定执行哪些步骤，Harness 验证这些步骤是否合理。这种分离让你能在不改变 Agent 逻辑的情况下调整验证策略。

### 5. 万物皆可度量

无法度量的东西无法改进。对每一次 Agent 执行，Harness 应该记录：输出质量评分、响应时间、Token 消耗、评估器判定结果。这些数据是持续改进的基础。

### 6. 数据驱动进化

Harness 不只是被动的检查工具，它应该主动驱动 Agent 的进化。评估失败的模式应该反馈到 Prompt 设计、测试场景补充、模型选择等决策中。

## Harness 的六大组成部分

### 1. 测试场景（Test Scenarios）

定义输入和期望输出的质量标准。一条场景就是一个可执行的契约：

```json
{
  "name": "代码解释测试",
  "input": "function add(a, b) { return a + b; }",
  "expectedOutput": "包含函数功能说明和参数描述",
  "evaluators": ["contains", "no-error"],
  "threshold": 0.8
}
```

### 2. Evaluators（评估器）

自动评估 AI 输出质量的工具。不同类型的输出需要不同的评估策略：

| Evaluator | 用途 | 适用场景 |
|-----------|------|---------|
| `exact-match` | 完全匹配 | 固定格式输出、ID 生成 |
| `contains` | 包含特定内容 | 教程、解释类输出 |
| `semantic-match` | 语义相似度 | 自然语言答案、摘要 |
| `json-valid` | JSON 格式验证 | API 响应、工具调用结果 |
| `no-error` | 无错误输出 | 所有场景的基线检查 |
| `schema-valid` | Schema 验证 | 结构化数据输出 |
| `custom` | 自定义逻辑 | 特殊业务规则 |

### 3. Mock Server（模拟服务器）

模拟 AI API 响应，实现可重复、零成本的测试：

```
真实 API：$$$ 每次调用都有成本，输出不确定
Mock Server：$0，快速、可重复、完全可控
```

### 4. Fixtures（固定样本）

稳定的输入集合，保证每次回归检查都覆盖同一批关键案例。包括：代码片段、用户问题、工具返回值、错误样本、边界条件。

### 5. Traces（执行轨迹）

记录 Agent 工作流中发生的每一件事：读了哪些上下文、调用了哪些工具、每一步的输入输出。Trace 是定位失败的根本证据——不是出问题后才去补，而是从一开始就设计好采集。

### 6. Failure Triage（失败分诊）

失败分诊回答三个关键问题：

| 问题 | 判断方式 | 为什么重要 |
|------|---------|-----------|
| 是 Prompt 失败还是工具失败 | 对比 Trace 和工具返回值 | 决定修复方向：改 Prompt 还是改工具 |
| 是新需求还是回归 | 对比验收标准和历史基线 | 决定处理优先级 |
| 是模型波动还是确定性缺陷 | 重放 Fixture 和 Mock 响应 | 决定是否需要修改 Harness |

## Harness vs 传统测试

理解两者的区别，才能设计出有效的 Harness：

| 维度 | 单元测试 | Harness |
|------|---------|---------|
| **测试对象** | 确定性代码逻辑 | 概率性 AI 输出 |
| **确定性** | 给定输入必有固定输出 | 输出有变化，需要容忍一定波动 |
| **验证方式** | 精确匹配（===） | 语义评估（≥ 阈值） |
| **Mock 对象** | Mock 函数/依赖返回值 | Mock 整个 AI API 响应 |
| **失败处理** | 测试失败 = 代码有 bug | 测试失败 = 需要分诊（波动 or 缺陷） |
| **基线管理** | 通过/失败二元 | 质量评分连续追踪 |

核心区别：**单元测试验证"代码做对了没有"，Harness 验证"AI 的输出够不够好"**。前者是二元判断，后者是连续度量。

## Harness 架构检查清单

在设计 Harness 系统时，确认以下清单：

- [ ] 每个测试场景都有明确的输入、预期输出和失败解释
- [ ] Mock Server 能复现下游成功、失败、超时和空数据
- [ ] 每个 Evaluator 只评估一个明确标准（单一职责）
- [ ] Fixtures 覆盖正常路径、边界输入和恶意输入
- [ ] Trace 能精确定位上下文、工具调用和模型输出的责任边界
- [ ] 回归测试套件能在每次变更后自动运行
- [ ] 失败报告包含足够的诊断信息（输入、输出、评估详情、环境）
- [ ] 关键指标（通过率、延迟、成本）有历史趋势追踪

## 典型使用场景

### 场景 1：Prompt 变更的回归验证

```python
# 修改了 Prompt 模板
prompt_template = "请用中文解释以下代码..."

# 运行回归测试
results = harness.run_regression()

# 确保没有破坏现有功能
assert results.pass_rate >= 0.95
assert results.no_regression("explain-code")
```

### 场景 2：模型升级的影响评估

```python
# 从 GPT-4 切换到 GPT-4o
harness.set_model("gpt-4o")

# 对比新旧模型在相同测试集上的表现
comparison = harness.compare(
    baseline="gpt-4",
    challenger="gpt-4o",
    test_suite="explain-code-full"
)

print(f"质量变化: {comparison.quality_delta}")
print(f"成本变化: {comparison.cost_delta}")
print(f"延迟变化: {comparison.latency_delta}")
```

### 场景 3：生产环境的持续监控

```python
# 每小时从生产日志中采样
samples = production_logger.sample(rate=0.01)

# 用 Evaluator 评估采样结果
for sample in samples:
    score = evaluator.evaluate(sample.output, sample.expected)
    metrics.record("production_quality", score)

# 低于阈值时告警
if metrics.avg("production_quality", window="1h") < 0.8:
    alert("Production quality dropping")
```

## 工作流程总览

```
┌─────────────────┐
│  定义测试场景    │  ← 明确输入和质量标准
│  (Scenario)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  运行测试       │  ← 用 Mock 或真实 API 执行
│  (Run Test)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Evaluator 评估 │  ← 自动判定输出质量
│  (Evaluate)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  失败分诊       │  ← 区分波动和缺陷
│  (Triage)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  反馈与迭代     │  ← 改进 Prompt、场景、评估器
│  (Feedback)     │
└─────────────────┘
```

这个流程不是一次性的，而是一个持续运行的循环。每次代码变更、Prompt 调整、模型更新都会重新走过这个流程。这就是 Harness 的核心价值：**把 AI 系统的迭代从"盲人摸象"变成"数据驱动"**。

## 下一步

理解了 Harness 的全貌之后，下一步是学习如何设计具体的测试场景。

→ [编写测试场景](/guide/harness/writing-tests)
