---
title: 工具选择与编排
description: 掌握单步调用、顺序链、并行执行、条件路由等工具编排策略，让 Agent 高效完成复杂任务
---

# 工具选择与编排

定义好工具只是第一步。Agent 的核心能力在于**选择正确的工具**并**编排调用顺序**。

## 单步工具调用（Single Tool Call）

最简单的情况：用户意图明确，一个工具就能解决。

```
用户: "现在几点了？"
模型决策: 调用 get_current_time()
```

```json
{
  "tool": "get_current_time",
  "parameters": { "timezone": "Asia/Shanghai" }
}
```

单步调用的关键是**准确匹配**。模型需要从可用工具中选出最合适的那一个。

### 工具选择的判断依据

| 判断维度 | 说明 |
| --- | --- |
| 意图匹配 | 用户想做什么？哪个工具能完成？ |
| 参数可用性 | 用户提供的信息够不够填参数？ |
| 副作用风险 | 调用后会不会产生不可逆的后果？ |
| 返回值相关性 | 工具返回的结果能回答用户的问题吗？ |

## 顺序链（Sequential Chain）

当一个工具的输出是另一个工具的输入时，需要顺序执行。

```
用户: "分析 src/auth.ts 的测试覆盖率"

步骤 1: read_file(path: "src/auth.ts")  →  得到代码内容
步骤 2: find_tests(file: "auth.ts")     →  得到测试文件列表
步骤 3: run_coverage(tests: [...])      →  得到覆盖率数据
步骤 4: 生成分析报告                      →  回复用户
```

### 实现模式

```javascript
// 顺序链的伪代码实现
async function sequentialChain(userIntent) {
  // 步骤 1: 读取文件
  const fileContent = await callTool("read_file", {
    path: "src/auth.ts"
  });

  // 步骤 2: 查找相关测试（依赖步骤 1 的结果）
  const testFiles = await callTool("find_tests", {
    source_file: fileContent.file_path
  });

  // 步骤 3: 运行覆盖率（依赖步骤 2 的结果）
  const coverage = await callTool("run_coverage", {
    test_files: testFiles.paths
  });

  // 步骤 4: 生成报告
  return generateReport(coverage);
}
```

### 顺序链的注意事项

1. **提前规划**：在第一步执行前就规划好完整链路。
2. **中间状态检查**：每步之后检查结果是否满足下一步的输入要求。
3. **链路中断处理**：某步失败时，知道从哪里恢复。

## 并行执行（Parallel Execution）

当多个工具调用之间没有依赖关系时，并行执行能显著提升效率。

```
用户: "比较 React、Vue 和 Svelte 的 GitHub star 数"

并行执行:
  → callTool("get_github_stats", { repo: "facebook/react" })
  → callTool("get_github_stats", { repo: "vuejs/core" })
  → callTool("get_github_stats", { repo: "sveltejs/svelte" })

三者同时执行，汇总结果后回复
```

### 并行 vs 顺序的判断

```
是否存在数据依赖？
├── 是 → 顺序执行
└── 否 → 是否可以并行？
    ├── 是 → 并行执行（节省时间）
    └── 否 → 顺序执行（如：共享资源冲突）
```

### 实现模式

```javascript
// 并行执行的伪代码实现
async function parallelExecution(repos) {
  // 三个调用之间无依赖，并行执行
  const results = await Promise.all(
    repos.map(repo =>
      callTool("get_github_stats", { repo })
    )
  );

  // 汇总结果
  return results.sort((a, b) => b.stars - a.stars);
}
```

## 条件路由（Conditional Routing）

根据上下文动态选择不同的工具。

```
用户输入 → 意图分析 → 路由决策
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
        查询类任务    操作类任务    分析类任务
            │             │             │
        search_web    write_file   analyze_code
        query_db      send_email   generate_report
```

### 路由策略

#### 策略 1：基于意图关键词

```python
def route_tool(user_input):
    # 简单的关键词路由
    if any(kw in user_input for kw in ["搜索", "查找", "search"]):
        return "search_web"
    elif any(kw in user_input for kw in ["写入", "保存", "write"]):
        return "write_file"
    elif any(kw in user_input for kw in ["分析", "analyze"]):
        return "analyze_code"
    else:
        return None  # 需要澄清用户意图
```

#### 策略 2：基于工具描述匹配

让模型根据工具的 description 自动选择。这是 Function Calling 的默认行为。

#### 策略 3：基于上下文链

```python
def route_with_context(history, current_input):
    last_tool = history[-1]["tool"] if history else None

    # 上一步是读文件 → 可能需要分析内容
    if last_tool == "read_file":
        return "analyze_code"

    # 上一步是搜索 → 可能需要深入查询
    if last_tool == "search_web":
        return "query_database"

    # 默认：让模型自主选择
    return None
```

## 编排模式汇总

| 模式 | 适用场景 | 复杂度 | 示例 |
| --- | --- | --- | --- |
| 单步调用 | 意图明确，一个工具搞定 | 低 | 查时间、查天气 |
| 顺序链 | 输出是下一步的输入 | 中 | 读文件 → 分析 → 生成报告 |
| 并行执行 | 多个独立任务同时做 | 中 | 对比多个数据源 |
| 条件路由 | 不同意图走不同路径 | 高 | 根据类型选择不同处理流程 |
| 混合模式 | 实际项目中常见 | 高 | 路由 + 并行 + 链式组合 |

## 混合编排实战

一个真实的编排场景：

```
用户: "检查项目中所有 TypeScript 文件的类型错误，如果有错误，自动修复"

路由: 意图包含"检查" + "修复" → 运行检查 → 条件执行修复

步骤 1（并行）:
  → lint_typescript(pattern: "src/**/*.ts")
  → lint_typescript(pattern: "tests/**/*.ts")

步骤 2（条件判断）:
  if (errors.length > 0):
    步骤 3（顺序链）:
      → parse_errors(errors) → 得到可修复的错误列表
      → fix_errors(fixable_errors) → 逐个修复
      → verify_fixes() → 验证修复结果
  else:
    回复"无类型错误"

步骤 4: 生成检查报告
```

## 练习

为以下场景设计编排方案：

1. **数据看板**：从 3 个 API 获取数据，合并后生成图表。
2. **代码审查**：读取 PR diff，逐文件分析，汇总问题。
3. **智能客服**：理解用户问题，查询知识库，生成回答。如果知识库没有答案，转人工。

<details>
<summary>参考答案（数据看板）</summary>

```
编排模式: 并行 + 顺序

步骤 1（并行）:
  → callTool("fetch_api", { endpoint: "/api/sales" })
  → callTool("fetch_api", { endpoint: "/api/users" })
  → callTool("fetch_api", { endpoint: "/api/orders" })

步骤 2（顺序）:
  → merge_data(sales, users, orders)
  → generate_chart(data, type: "dashboard")
  → return chart_url
```

</details>

## 常见陷阱

### 陷阱 1：过度编排

把简单的单步调用搞成复杂的多步链。用户问"现在几点"，不需要先查时区再查时间。

### 陷阱 2：忽略中间结果

顺序链中，如果步骤 2 返回空结果，应该提前终止而不是继续执行步骤 3。

### 陷阱 3：并行时忽略错误

三个并行调用中有一个失败了，不应该等其他两个完成再报错。

## 下一步

→ [错误处理与重试](/guide/tool-use/error-handling)
