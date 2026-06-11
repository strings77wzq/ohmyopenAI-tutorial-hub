---
title: Tool Selection & Orchestration
description: Master single-step calls, sequential chains, parallel execution, and conditional routing strategies for efficient agent task completion
---

# Tool Selection & Orchestration

Defining tools well is only the first step. An agent's core capability lies in **selecting the right tool** and **orchestrating the call order**.

## Single Tool Call

The simplest case: the user's intent is clear, and one tool can handle it.

```
User: "What time is it right now?"
Model decision: call get_current_time()
```

```json
{
  "tool": "get_current_time",
  "parameters": { "timezone": "Asia/Shanghai" }
}
```

The key to single-step calls is **accurate matching**. The model needs to select the most suitable tool from the available options.

### Criteria for Tool Selection

| Criterion | Description |
| --- | --- |
| Intent match | What does the user want to do? Which tool can accomplish it? |
| Parameter availability | Does the user provide enough information to fill in the parameters? |
| Side effect risk | Will calling this tool produce irreversible consequences? |
| Return value relevance | Can the tool's result answer the user's question? |

## Sequential Chain

When one tool's output is another tool's input, you need sequential execution.

```
User: "Analyze the test coverage of src/auth.ts"

Step 1: read_file(path: "src/auth.ts")  →  get code content
Step 2: find_tests(file: "auth.ts")     →  get list of test files
Step 3: run_coverage(tests: [...])      →  get coverage data
Step 4: Generate analysis report          →  reply to user
```

### Implementation Pattern

```javascript
// Pseudocode for a sequential chain
async function sequentialChain(userIntent) {
  // Step 1: Read the file
  const fileContent = await callTool("read_file", {
    path: "src/auth.ts"
  });

  // Step 2: Find related tests (depends on Step 1 result)
  const testFiles = await callTool("find_tests", {
    source_file: fileContent.file_path
  });

  // Step 3: Run coverage (depends on Step 2 result)
  const coverage = await callTool("run_coverage", {
    test_files: testFiles.paths
  });

  // Step 4: Generate report
  return generateReport(coverage);
}
```

### Considerations for Sequential Chains

1. **Plan ahead**: Design the full chain before executing the first step.
2. **Check intermediate state**: After each step, verify the result meets the input requirements for the next step.
3. **Handle chain interruption**: Know where to resume when a step fails.

## Parallel Execution

When multiple tool calls have no dependencies, parallel execution can significantly improve efficiency.

```
User: "Compare the GitHub star counts of React, Vue, and Svelte"

Parallel execution:
  → callTool("get_github_stats", { repo: "facebook/react" })
  → callTool("get_github_stats", { repo: "vuejs/core" })
  → callTool("get_github_stats", { repo: "sveltejs/svelte" })

All three execute simultaneously, then aggregate results for the reply
```

### Parallel vs Sequential Decision

```
Are there data dependencies?
├── Yes → Sequential execution
└── No → Can they run in parallel?
    ├── Yes → Parallel execution (saves time)
    └── No → Sequential execution (e.g., shared resource conflicts)
```

### Implementation Pattern

```javascript
// Pseudocode for parallel execution
async function parallelExecution(repos) {
  // No dependencies between the three calls — run in parallel
  const results = await Promise.all(
    repos.map(repo =>
      callTool("get_github_stats", { repo })
    )
  );

  // Aggregate results
  return results.sort((a, b) => b.stars - a.stars);
}
```

## Conditional Routing

Dynamically select different tools based on context.

```
User input → Intent analysis → Routing decision
                                 │
            ┌────────────────────┼────────────────────┐
            ▼                    ▼                    ▼
        Query tasks          Action tasks         Analysis tasks
            │                    │                    │
        search_web           write_file          analyze_code
        query_db             send_email          generate_report
```

### Routing Strategies

#### Strategy 1: Based on Intent Keywords

```python
def route_tool(user_input):
    # Simple keyword-based routing
    if any(kw in user_input for kw in ["search", "find", "look up"]):
        return "search_web"
    elif any(kw in user_input for kw in ["write", "save", "create"]):
        return "write_file"
    elif any(kw in user_input for kw in ["analyze", "examine"]):
        return "analyze_code"
    else:
        return None  # Need to clarify user intent
```

#### Strategy 2: Based on Tool Description Matching

Let the model choose automatically based on tool descriptions. This is the default behavior of Function Calling.

#### Strategy 3: Based on Context Chain

```python
def route_with_context(history, current_input):
    last_tool = history[-1]["tool"] if history else None

    # Previous step was reading a file → may need to analyze content
    if last_tool == "read_file":
        return "analyze_code"

    # Previous step was searching → may need to drill deeper
    if last_tool == "search_web":
        return "query_database"

    # Default: let the model decide
    return None
```

## Orchestration Pattern Summary

| Pattern | Use Case | Complexity | Example |
| --- | --- | --- | --- |
| Single call | Clear intent, one tool handles it | Low | Check time, check weather |
| Sequential chain | Output is input for the next step | Medium | Read file → analyze → generate report |
| Parallel execution | Multiple independent tasks at once | Medium | Compare multiple data sources |
| Conditional routing | Different intents take different paths | High | Select different processing flows by type |
| Hybrid mode | Common in real projects | High | Routing + parallel + chain combinations |

## Hybrid Orchestration in Practice

A realistic orchestration scenario:

```
User: "Check all TypeScript files in the project for type errors. If there are errors, fix them automatically."

Routing: Intent includes "check" + "fix" → run check → conditionally execute fix

Step 1 (parallel):
  → lint_typescript(pattern: "src/**/*.ts")
  → lint_typescript(pattern: "tests/**/*.ts")

Step 2 (conditional):
  if (errors.length > 0):
    Step 3 (sequential chain):
      → parse_errors(errors) → get list of fixable errors
      → fix_errors(fixable_errors) → fix them one by one
      → verify_fixes() → verify the fixes
  else:
    Reply "No type errors found"

Step 4: Generate check report
```

## Exercises

Design orchestration plans for the following scenarios:

1. **Data dashboard**: Fetch data from 3 APIs, merge it, and generate charts.
2. **Code review**: Read a PR diff, analyze file by file, and summarize issues.
3. **Smart customer service**: Understand the user's question, query the knowledge base, and generate a response. If the knowledge base has no answer, transfer to a human agent.

<details>
<summary>Reference Answer (Data Dashboard)</summary>

```
Orchestration pattern: Parallel + Sequential

Step 1 (parallel):
  → callTool("fetch_api", { endpoint: "/api/sales" })
  → callTool("fetch_api", { endpoint: "/api/users" })
  → callTool("fetch_api", { endpoint: "/api/orders" })

Step 2 (sequential):
  → merge_data(sales, users, orders)
  → generate_chart(data, type: "dashboard")
  → return chart_url
```

</details>

## Common Pitfalls

### Pitfall 1: Over-orchestration

Turning a simple single-step call into a complex multi-step chain. When the user asks "what time is it," you don't need to look up the timezone first and then check the time.

### Pitfall 2: Ignoring Intermediate Results

In a sequential chain, if Step 2 returns empty results, you should terminate early rather than continuing to Step 3.

### Pitfall 3: Ignoring Errors During Parallel Execution

If one of three parallel calls fails, you should not wait for the other two to finish before reporting the error.

## Next Steps

→ [Error Handling & Retry](/guide/tool-use/error-handling)
