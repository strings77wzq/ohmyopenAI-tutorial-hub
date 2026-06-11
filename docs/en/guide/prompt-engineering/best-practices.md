---
title: Best Practices and Anti-Patterns
description: Identify common anti-patterns, and master cost optimization, latency control, and model-specific best practices
---

# Best Practices and Anti-Patterns

## Anti-Patterns

### Vague Instructions

```text
# ❌ Anti-pattern
Please help me optimize this code.

# ✅ Correct approach
Please optimize the performance of the following Python code, focusing on:
1. Reducing database query count (currently has N+1 problem)
2. Adding a caching layer
3. Maintaining API compatibility
Constraints: Do not change function signatures, do not introduce new dependencies.
```

**Principle**: Be specific, verifiable, and constrained.

### Over-Constraining

```text
# ❌ Anti-pattern
Please write a function, must use a for loop not map, variable names must be x and y...

# ✅ Correct approach
Please write a Python function that extracts even numbers from a list and sums them.
Requirements: Use functional programming style, include type annotations.
```

**Principle**: Only constrain aspects that actually impact the task outcome.

### Role-Task Conflict

```text
# ❌ Anti-pattern
System: You are a friendly customer service representative, always positive and upbeat.
User: Please review this code for security vulnerabilities, don't hide any issues.

# ✅ Correct approach
System: You are a security audit expert focused on identifying potential risks.
```

**Principle**: Role definition should align with the nature of the task.

### Information Overload

```text
# ❌ Anti-pattern
[2000-word project documentation pasted directly]
Please help me see if there are any issues.

# ✅ Correct approach
Project background: FastAPI REST API handling user authentication.
Current issue: Login endpoint is slow (>3s response time).
Relevant code: [Only paste the 50 lines of the authentication module]
```

**Principle**: Provide information directly relevant to the task; everything else is optional context.

### Implicit Assumptions

```text
# ❌ Anti-pattern
Convert this code to async.

# ✅ Correct approach
Convert the following synchronous database query code to an async version:
- Use async/await syntax
- Maintain transaction consistency
- Ensure error handling remains unchanged
```

**Principle**: Make all assumptions and constraints explicit.

## Cost Optimization

### Reduce Token Consumption

```text
# ❌ High-cost version (~500 tokens)
You are a very professional, highly experienced, senior software engineer specializing in backend development...

# ✅ Low-cost version (~100 tokens)
<role>Backend engineer</role>
<task>Review code security</task>
```

| Strategy | Method | Savings |
| --- | --- | --- |
| Streamline System Prompt | Remove redundant descriptions | 20-40% |
| Avoid repeating context | Use variable references instead of pasting repeatedly | 30-60% |
| Load context on demand | Only provide information needed for the current step | 40-70% |
| Choose the right model | Use smaller models for simple tasks | 5-10x cost reduction |

### Tiered Model Strategy

```typescript
function selectModel(task: string): string {
  const complexity = assessComplexity(task)
  if (complexity === 'simple') return 'gpt-4o-mini'  // Classification, format conversion
  if (complexity === 'medium') return 'gpt-4o'        // Code review, summarization
  return 'o1'                                          // Math reasoning, complex planning
}
```

## Latency Optimization

### Parallel Calls

```text
// ❌ Sequential: total latency = 3s + 2s + 4s = 9s
const review = await callLLM(reviewPrompt)
const summary = await callLLM(summaryPrompt)

// ✅ Parallel: total latency = max(3s, 2s) = 3s
const [review, summary] = await Promise.all([
  callLLM(reviewPrompt),
  callLLM(summaryPrompt),
])
```

### Streaming Output + Streamlined Prompts

```typescript
// Use streaming for user-experience-sensitive scenarios
const stream = await client.chat.completions.create({
  model: 'gpt-4o', messages, stream: true,
})
```

Goal: Keep the System Prompt under 200 tokens to reduce time-to-first-token latency.

## Model-Specific Tips

| Model | Tip | Best For |
| --- | --- | --- |
| GPT-4o | Good JSON output support; use `response_format` to enforce JSON | Code generation, data analysis |
| Claude | Best XML tag support; use `<thinking>` to guide reasoning | Code review, complex analysis |
| Open-source models | Small context window; keep prompts concise; Few-shot is very effective | Classification, local deployment |

## Checklist

- [ ] Role definition matches the task
- [ ] Instructions placed at the beginning or end
- [ ] Output format explicitly specified
- [ ] No vague or contradictory requirements
- [ ] System Prompt kept under 200 tokens
- [ ] Version number and changelog exist
- [ ] Accompanying test cases exist

## Module Summary

| Topic | Key Takeaway |
| --- | --- |
| [Design Patterns](/guide/prompt-engineering/design-patterns) | Choosing the right pattern matters more than tweaking wording |
| [Structured Prompts](/guide/prompt-engineering/structured) | Use structure instead of verbose descriptions; constrain output with Schema |
| [Debugging](/guide/prompt-engineering/debugging) | Systematic diagnosis, version management, automated evaluation |
| [Prompt Library](/guide/prompt-engineering/practice) | Categorized, versioned, reusable, testable |
| Best Practices | Avoid anti-patterns, optimize cost and latency, adapt to model characteristics |

## Further Reading

- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)
- [OpenAI Prompt Engineering Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)
- [Google Gemini Prompt Design](https://ai.google.dev/docs/prompt_best_practices)
