# Evaluator 设计

## 概念

Evaluator 是把验收标准转化为可自动执行的检查的程序。好的 evaluator 不是"打分器"，而是"决策辅助工具"——它告诉你**具体的失败原因**，让你（或 Agent）知道该修什么。

## 为什么 Evaluator 设计很难？

大多数 evaluator 的失败不是因为逻辑错误，而是因为**验收标准本身不清晰**。如果你说不清楚"好"是什么样的，你也写不出能判断"好"的代码。

## Evaluator 设计五原则

### 原则 1：单标准

一个 evaluator 只评估一个明确的标准。如果一个 evaluator 同时检查"格式正确"和"内容准确"，失败时你无法知道是格式问题还是内容问题。

```
✗ 坏 evaluator: "检查文档质量"
   → 失败。原因不明。

✓ 好 evaluator: "检查所有内部链接返回 200"
   → 失败。3 个链接返回 404: /guide/old-page, ...
```

### 原则 2：失败必须有原因

Evaluator 的输出格式：

```
{
  "criterion": "所有内部链接返回 2xx",
  "status": "FAIL",
  "failures": [
    {
      "file": "docs/guide/skills/index.md",
      "line": 47,
      "link": "/guide/old-reference",
      "status_code": 404,
      "suggestion": "页面不存在。可能的正确路径: /guide/skills/reference"
    }
  ]
}
```

不是：

```
{
  "score": 0.7,
  "status": "FAIL"
}
```

### 原则 3：处理边界输入

好的 evaluator 不会在边界输入上崩溃：

| 边界输入 | 期望行为 |
|----------|----------|
| 空文件 | 报告"无链接可检查"，不报错 |
| 纯英文页面 | 正常检查（不因缺少中文而失败） |
| 非常大的文件（>500 行） | 正常处理，不超时 |
| 只有外部链接的页面 | 跳过内部链接检查 |
| 链接中包含特殊字符 | 正确解析，不崩溃 |

### 原则 4：与人工验收标准对齐

Evaluator 的通过条件应该和人的判断一致：

```
人工验收标准: "所有侧边栏链接都能到达正确的页面"
Evaluator 实现: 遍历 sidebar config → 逐个 HEAD → 检查 2xx
→ 对齐 ✓
```

不一致的情况：

```
人工验收标准: "页面内容准确且更新到最新"
Evaluator 实现: 检查 lastUpdated 字段非空
→ 不对齐 ✗（lastUpdated 非空 ≠ 内容准确）
```

### 原则 5：跨模型和 Prompt 变更稳定

好的 evaluator 不应该因为 Agent 换了模型或 prompt 调整了措辞就失效。规则式 evaluator（解析输出结构、检查链接状态）比 LLM-as-judge 更稳定。

```
稳定（规则式）:
  node scripts/check-doc-links.mjs
  → 解析 HTML/markdown，提取链接，HEAD 请求验证状态码
  → 不受 Agent 模型影响

不稳定（LLM-as-judge）:
  "请用 1-10 分评估这个页面的质量"
  → 模型换了 → 分数分布变了 → 阈值失效
```

## Evaluator 校准

如果你的 evaluator 使用 LLM 评判（LLM-as-judge），需要校准：

```
Golden Set: 10 个已知"好"的页面 + 10 个已知"差"的页面

Evaluator 在 Golden Set 上运行:
  - 对"好"页面的通过率: 应 ≥ 95%（不应误报）
  - 对"差"页面的检出率: 应 ≥ 90%（不应漏报）

如果通过率太低:
  → 阈值太严格，调高一点

如果检出率太低:
  → 阈值太宽松，或 evaluator 标准不对，调低或重写
```

## 示例：设计一个"检查页面是否有练习部分"的 Evaluator

```
验收标准: 每个教程页必须包含"练习"章节

Evaluator 实现:
  1. 读取页面的 markdown 源
  2. 查找 ## 练习 或 ## Exercise 标题
  3. 如果找到 → 检查标题下是否有 ≥ 50 字符的非标题内容
  4. 如果有 ≥ 50 字符 → PASS
  5. 如果标题不存在或内容不足 → FAIL

边界输入:
  - 非教程页面（如 examples/） → 跳过（不在检查范围内）
  - 页面语言是英文 → 同时匹配 ## Exercise 和 ## 练习

输出:
  {
    "criterion": "每个教程页包含练习章节",
    "status": "FAIL",
    "file": "docs/guide/context/compression.md",
    "reason": "存在 ## 练习 标题，但内容仅 12 字符（< 50）",
    "suggestion": "练习章节至少需要一个完整的问题陈述或操作任务"
  }
```

## 练习

为一个"检查每个新页面是否有 next-step 链接"的 requirement 设计 evaluator：

1. evaluator 的输入是什么？
2. 怎么判断"有 next-step 链接"？（具体匹配规则）
3. 哪些页面应该被跳过？（非教程页、首页等）
4. 边界输入有哪些？怎么处理？

## 排错

| 症状 | 可能原因 | 修复 |
|------|----------|------|
| Evaluator 对明显正确的输出报 FAIL | 规则太严格或没处理合法的变体格式 | 检查边界输入，放宽匹配规则 |
| Evaluator 对明显错误的输出报 PASS | 规则太宽松或没覆盖这种错误类型 | 增加新的检查条件 |
| Evaluator 在 CI 中通过但人工审查发现问题 | 验收标准和 evaluator 实现不对齐 | 重读人工验收标准，重写 evaluator |
| LLM-as-judge 在新模型下完全失效 | 新模型的评分分布和旧模型不同 | 在新模型上重新校准 golden set |

## 下一步

单个 evaluator 做好后，接下来看[回归套件](./regression-suite)——如何把多个 evaluator 组织成可维护的测试套件。
