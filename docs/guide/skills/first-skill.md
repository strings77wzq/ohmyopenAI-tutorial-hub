# 创建你的第一个 Skill

本教程将手把手教你创建一个实用的代码解释 Skill。

## 目标

创建一个 `explain-code` Skill，能够：
- 分析任意代码片段
- 解释代码的功能和工作原理
- 指出潜在问题和改进建议

## 步骤 1：创建 Skill 文件

在你的项目根目录下创建 `.skills/` 文件夹：

```bash
mkdir -p .skills
```

然后创建 `explain-code.json` 文件：

```bash
touch .skills/explain-code.json
```

## 步骤 2：编写基础结构

打开 `explain-code.json`，添加基础结构：

```json
{
  "name": "explain-code",
  "description": "解释代码的工作原理",
  "prompt": "",
  "examples": []
}
```

## 步骤 3：设计 Prompt

Prompt 是 Skill 的核心。好的 Prompt 应该：
- 明确说明任务
- 指定输出格式
- 提供评估维度

编写详细的 Prompt：

```json
{
  "name": "explain-code",
  "description": "解释代码的工作原理，包括逻辑流程、关键变量和潜在问题",
  "prompt": "请详细解释以下代码的工作原理：\n\n```\n{{code}}\n```\n\n请从以下几个角度分析（使用中文回答）：\n\n## 1. 整体功能\n简要说明这段代码的主要作用。\n\n## 2. 执行流程\n逐步解释代码的执行过程。\n\n## 3. 关键变量和函数\n列出重要的变量和函数，说明其作用。\n\n## 4. 潜在问题\n指出可能存在的 bug、性能问题或边界情况。\n\n## 5. 改进建议\n提供具体的优化建议（如果有）。",
  "examples": []
}
```

**关键点**：
- 使用 `{{code}}` 作为变量占位符
- 明确指定输出格式（Markdown 标题）
- 分维度要求分析

## 步骤 4：添加示例

示例帮助 AI 理解期望的输出质量。添加 2-3 个典型示例：

```json
{
  "name": "explain-code",
  "description": "解释代码的工作原理，包括逻辑流程、关键变量和潜在问题",
  "prompt": "请详细解释以下代码的工作原理：\n\n```\n{{code}}\n```\n\n请从以下几个角度分析（使用中文回答）：\n\n## 1. 整体功能\n简要说明这段代码的主要作用。\n\n## 2. 执行流程\n逐步解释代码的执行过程。\n\n## 3. 关键变量和函数\n列出重要的变量和函数，说明其作用。\n\n## 4. 潜在问题\n指出可能存在的 bug、性能问题或边界情况。\n\n## 5. 改进建议\n提供具体的优化建议（如果有）。",
  "examples": [
    {
      "input": "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)",
      "output": "## 1. 整体功能\n这是一个计算阶乘的递归函数。阶乘是指从 1 乘到 n 的积（n!）。\n\n## 2. 执行流程\n1. 检查 n 是否为 0，如果是则返回 1（0! = 1）\n2. 否则，返回 n 乘以 factorial(n-1)\n3. 递归调用直到 n 为 0\n\n## 3. 关键变量和函数\n- `n`: 输入参数，要计算阶乘的数字\n- `factorial()`: 递归函数，计算阶乘\n\n## 4. 潜在问题\n- **没有处理负数输入**：如果传入负数会导致无限递归\n- **没有类型检查**：应该确保 n 是整数\n- **递归深度限制**：对于很大的 n 可能会导致栈溢出\n\n## 5. 改进建议\n```python\ndef factorial(n):\n    if not isinstance(n, int):\n        raise TypeError(\"n must be an integer\")\n    if n < 0:\n        raise ValueError(\"n must be non-negative\")\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)\n```"
    },
    {
      "input": "const sum = arr => arr.reduce((a, b) => a + b, 0);",
      "output": "## 1. 整体功能\n这是一个计算数组元素总和的箭头函数。\n\n## 2. 执行流程\n1. 接收一个数组 `arr` 作为参数\n2. 使用 `reduce` 方法遍历数组\n3. 将每个元素累加到累加器 `a`\n4. 初始值为 0\n5. 返回最终总和\n\n## 3. 关键变量和函数\n- `arr`: 输入数组\n- `reduce`: 数组方法，用于归约操作\n- `a`: 累加器，存储中间结果\n- `b`: 当前元素\n\n## 4. 潜在问题\n- **没有空数组检查**：空数组返回 0，符合预期，但需确认是否业务需求\n- **没有类型检查**：如果传入非数组会报错\n- **NaN 处理**：如果数组包含 NaN，结果会是 NaN\n\n## 5. 改进建议\n```javascript\nconst sum = arr => {\n    if (!Array.isArray(arr)) {\n        throw new TypeError('Expected an array');\n    }\n    return arr.reduce((a, b) => {\n        if (typeof b !== 'number' || isNaN(b)) {\n            throw new Error('Array must contain only numbers');\n        }\n        return a + b;\n    }, 0);\n};\n```"
    }
  ]
}
```

## 步骤 5：测试 Skill

保存文件后，在支持 Skills 的 AI 工具中测试：

```
用户: /explain-code

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

AI: ## 1. 整体功能
这是一个递归实现的斐波那契数列函数...

## 2. 执行流程
...

## 3. 关键变量和函数
...

## 4. 潜在问题
...

## 5. 改进建议
...
```

## 完整代码

最终的 `explain-code.json`：

```json
{
  "name": "explain-code",
  "description": "解释代码的工作原理，包括逻辑流程、关键变量和潜在问题",
  "prompt": "请详细解释以下代码的工作原理：\n\n```\n{{code}}\n```\n\n请从以下几个角度分析（使用中文回答）：\n\n## 1. 整体功能\n简要说明这段代码的主要作用。\n\n## 2. 执行流程\n逐步解释代码的执行过程。\n\n## 3. 关键变量和函数\n列出重要的变量和函数，说明其作用。\n\n## 4. 潜在问题\n指出可能存在的 bug、性能问题或边界情况。\n\n## 5. 改进建议\n提供具体的优化建议（如果有）。",
  "examples": [
    {
      "input": "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)",
      "output": "## 1. 整体功能\n这是一个计算阶乘的递归函数..."
    },
    {
      "input": "const sum = arr => arr.reduce((a, b) => a + b, 0);",
      "output": "## 1. 整体功能\n这是一个计算数组元素总和的箭头函数..."
    }
  ]
}
```

## 常见问题和解决方案

### 问题 1：AI 输出格式不一致

**原因**：Prompt 中格式要求不够明确

**解决**：明确指定输出格式，如使用 Markdown 标题

### 问题 2：AI 遗漏某些分析维度

**原因**：Prompt 中没有明确要求每个维度都必须输出

**解决**：在 Prompt 中强调"必须包含以下所有维度"

### 问题 3：示例不够好

**原因**：示例太简单或不够典型

**解决**：添加不同复杂度、不同语言的真实代码示例

## 练习

现在尝试修改 Skill，增加新的分析维度：

1. **时间复杂度分析** - 分析算法的时间复杂度
2. **空间复杂度分析** - 分析内存使用情况
3. **适用场景** - 说明这段代码适合在什么场景使用

将修改后的 Skill 保存并测试！

## 下一步

你已经成功创建了第一个 Skill！接下来学习更多关于 Skill 的知识：

→ [Skill 核心组件详解](/guide/skills/components)
