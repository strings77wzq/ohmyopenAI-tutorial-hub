---
title: 提示词设计模式
description: 掌握 Zero-shot、Few-shot、Chain-of-Thought、ReAct、Tree-of-Thought 和 Self-consistency 六种核心提示词设计模式
---

# 提示词设计模式

设计模式是经过验证的 Prompt 结构化方法。选择正确的模式，往往比调整措辞更能提升输出质量。

## 概览

| 模式 | 核心思路 | 适用场景 | Token 成本 |
| --- | --- | --- | --- |
| Zero-shot | 直接给指令，无示例 | 简单任务、快速原型 | 低 |
| Few-shot | 提供示例引导格式和风格 | 格式要求高、风格一致 | 中 |
| Chain-of-Thought | 引导模型逐步推理 | 逻辑推理、数学、复杂判断 | 中 |
| ReAct | 推理与行动交替执行 | 工具调用、多步骤任务 | 高 |
| Tree-of-Thought | 探索多条推理路径 | 创意生成、复杂决策 | 高 |
| Self-consistency | 多次推理取多数结果 | 需要高可靠性的判断 | 高 |

## 1. Zero-shot Prompting

只给指令和输入，不提供任何示例。依赖模型的预训练知识。

**适用**：任务简单明确（分类、翻译、摘要）、快速原型验证。

```text
请判断以下用户评论的情感是"正面"、"负面"还是"中性"：

评论：这个产品的包装很精美，但实际功能一般。

情感：
```

- ✅ 简单、Token 成本低、响应快。
- ❌ 输出格式不稳定、复杂任务效果差。

## 2. Few-shot Prompting

在 Prompt 中包含 2-5 个示例（input → output 对），引导模型模仿示例的格式和风格。

**适用**：输出格式有严格要求、需要特定风格、Zero-shot 效果不达标时。

```text
# Few-shot 情感分析

示例 1：
评论：服务态度很差，等了一个小时。
情感：负面

示例 2：
评论：性价比很高，推荐购买。
情感：正面

示例 3：
评论：还行吧，没什么特别的。
情感：中性

现在请分析：
评论：功能不错，但界面设计太丑了。
情感：
```

```text
# Few-shot 代码生成

示例 1：
需求：计算两个数的和
代码：
def add(a: int, b: int) -> int:
    return a + b

示例 2：
需求：判断字符串是否回文
代码：
def is_palindrome(s: str) -> bool:
    return s == s[::-1]

现在请实现：
需求：找出列表中第二大的数
代码：
```

- ✅ 输出格式稳定、可控性强。
- ❌ 示例占用 Token，超过 5 个边际收益递减。

## 3. Chain-of-Thought (CoT)

通过"让我们一步步思考"或提供带推理过程的示例，让模型显式展示中间步骤。

**适用**：数学计算、逻辑推理、多步骤决策、需要可解释性的场景。

```text
# CoT 数学推理
一个农场有 15 只鸡和 8 只羊。每只鸡每天下 1 个蛋，每只羊每天产 2 升奶。
农场主人每天卖掉所有鸡蛋（每个 2 元）和所有羊奶（每升 5 元）。
一周（7 天）的总收入是多少？

让我们一步步思考：
```

```text
# CoT 代码调试
以下代码运行结果不符合预期，请一步步分析问题：

def merge_sorted(a, b):
    result = []
    i, j = 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i])
            i += 1
        else:
            result.append(b[j])
            j += 1
    return result

# 测试：merge_sorted([1,3], [2,4]) 期望 [1,2,3,4]，实际 [1,3]

请逐步分析：
1. 跟踪每次循环的变量状态
2. 找出逻辑错误
3. 提供修复方案
```

- ✅ 推理准确率显著提升（GSM8K 基准 +20-40%）。
- ✅ 中间步骤可审计，便于调试。
- ❌ 输出变长，简单任务用 CoT 是过度设计。

## 4. ReAct (Reasoning + Acting)

模型按 `Thought → Action → Observation` 循环执行任务，推理后调用工具，再根据结果继续推理。

**适用**：需要调用外部工具、多步骤任务、构建 Agent 系统。

```text
你是一个助手，可以使用以下工具：
- search(query): 搜索互联网
- calculate(expression): 数学计算

问题：特斯拉 2023 年的营收比丰田高多少？

Thought 1: 我需要查找两家公司的营收数据。
Action 1: search("特斯拉 2023 年营收")
Observation 1: 特斯拉 2023 年营收为 967.7 亿美元。

Thought 2: 查找丰田的数据。
Action 2: search("丰田 2023 年营收")
Observation 2: 丰田 2023 年财年营收为 3750 亿美元。

Thought 3: 计算差值。
Action 3: calculate("3750 - 967.7")
Observation 3: 2782.3

最终答案：丰田 2023 年营收比特斯拉高约 2782.3 亿美元。
```

- ✅ 能处理需要外部信息的复杂任务，推理过程透明。
- ❌ Token 成本高，工具调用可能失败，实现复杂度高。

## 5. Tree-of-Thought (ToT)

模型生成多个可能的"下一步"，评估每个选项，剪枝差的路径，保留好的路径继续深入。

**适用**：创意写作、复杂问题求解（规划、策略）、需要全局最优的场景。

```text
你是一个创业顾问。用户想做一个"AI 管家"产品。

请用 Tree-of-Thought 方法分析：

第一步：生成 3 个不同的产品方向
  - 方向 A：...
  - 方向 B：...
  - 方向 C：...

第二步：评估每个方向（市场需求 1-10、技术难度 1-10、竞争程度 1-10）

第三步：选择最优方向，深入展开

第四步：对选定方向再生成 2 个子方案并评估
```

- ✅ 能找到更优解，避免陷入局部最优。
- ❌ Token 消耗是 CoT 的 3-5 倍，不适合简单任务。

## 6. Self-consistency

采样多个推理路径（通常 5-10 次），对最终答案进行投票，多数一致的结果更可靠。

**适用**：数学和逻辑推理（需要高准确性）、分类任务、无法用工具验证的判断。

```python
# Self-consistency 实现
def self_consistency(prompt, n_samples=5):
    answers = []
    for i in range(n_samples):
        response = llm.generate(
            prompt + "\n请一步一步思考，最后给出你的答案。",
            temperature=0.7
        )
        answer = extract_final_answer(response)
        answers.append(answer)
    return majority_vote(answers)

# 示例：5 次采样结果
# 第 1 次：42，第 2 次：42，第 3 次：38，第 4 次：42，第 5 次：40
# 最终答案：42（3/5 多数）
```

- ✅ 显著提升推理准确率（+10-25%），结果更稳定。
- ❌ 成本是单次推理的 N 倍，增加延迟。

## 模式组合

实际项目中，这些模式经常组合使用：

```text
# Few-shot + CoT 组合
System: 你是一个代码审查专家。

# Few-shot 示例
示例 1：
代码：def add(a,b): return a+b
分析：缺少类型注解，参数命名可读性差。
修复：def add(a: int, b: int) -> int: return a + b

# 要求 CoT 推理
请对以下代码进行审查，逐步分析每个潜在问题：
{{code}}
```

## 练习

1. **选择模式**：给定以下任务，选择最合适的模式并说明理由：
   - 将用户输入分类为 5 种预定义类别。
   - 根据 API 文档生成调用代码。
   - 判断一个数学证明是否正确。
   - 为产品设计 3 个不同的营销方案。

2. **组合设计**：为"代码审查"任务设计一个组合了 2-3 种模式的 Prompt。

## 下一步

掌握设计模式后，学习如何用结构化方法组织 Prompt：

→ [结构化提示词](/guide/prompt-engineering/structured)
