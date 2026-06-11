---
title: Prompt Design Patterns
description: "Master six core prompt design patterns: Zero-shot, Few-shot, Chain-of-Thought, ReAct, Tree-of-Thought, and Self-consistency"
---

# Prompt Design Patterns

Design patterns are proven approaches to structuring prompts. Choosing the right pattern often improves output quality more than tweaking wording.

## Overview

| Pattern | Core Idea | Use Cases | Token Cost |
| --- | --- | --- | --- |
| Zero-shot | Give instructions directly, no examples | Simple tasks, quick prototyping | Low |
| Few-shot | Provide examples to guide format and style | Strict format requirements, style consistency | Medium |
| Chain-of-Thought | Guide the model to reason step by step | Logical reasoning, math, complex judgments | Medium |
| ReAct | Alternate between reasoning and acting | Tool calls, multi-step tasks | High |
| Tree-of-Thought | Explore multiple reasoning paths | Creative generation, complex decisions | High |
| Self-consistency | Sample multiple reasoning paths, vote on result | High-reliability judgments | High |

## 1. Zero-shot Prompting

Provide only instructions and input with no examples. Relies on the model's pre-trained knowledge.

**Best for**: Simple, well-defined tasks (classification, translation, summarization) and quick prototype validation.

```text
Please classify the sentiment of the following user review as "positive", "negative", or "neutral":

Review: The product packaging is beautiful, but the actual functionality is mediocre.

Sentiment:
```

- ✅ Simple, low token cost, fast response.
- ❌ Unstable output format, poor performance on complex tasks.

## 2. Few-shot Prompting

Include 2-5 examples (input → output pairs) in the prompt to guide the model in mimicking the example format and style.

**Best for**: Strict output format requirements, specific style needs, or when Zero-shot doesn't meet quality standards.

```text
# Few-shot sentiment analysis

Example 1:
Review: Service attitude was terrible, waited for an hour.
Sentiment: negative

Example 2:
Review: Great value for money, highly recommend.
Sentiment: positive

Example 3:
Review: It's okay, nothing special.
Sentiment: neutral

Now analyze:
Review: Features are good, but the UI design is ugly.
Sentiment:
```

```text
# Few-shot code generation

Example 1:
Requirement: Calculate the sum of two numbers
Code:
def add(a: int, b: int) -> int:
    return a + b

Example 2:
Requirement: Check if a string is a palindrome
Code:
def is_palindrome(s: str) -> bool:
    return s == s[::-1]

Now implement:
Requirement: Find the second largest number in a list
Code:
```

- ✅ Stable output format, high controllability.
- ❌ Examples consume tokens; diminishing returns beyond 5 examples.

## 3. Chain-of-Thought (CoT)

Prompt the model to explicitly show intermediate steps using "let's think step by step" or by providing examples that include the reasoning process.

**Best for**: Math calculations, logical reasoning, multi-step decisions, and scenarios requiring explainability.

```text
# CoT math reasoning
A farm has 15 chickens and 8 sheep. Each chicken lays 1 egg per day, and each sheep produces 2 liters of milk per day. The farm owner sells all eggs (2 yuan each) and all milk (5 yuan per liter) daily. What is the total revenue for one week (7 days)?

Let's think step by step:
```

```text
# CoT code debugging
The following code doesn't produce the expected result. Please analyze the problem step by step:

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

# Test: merge_sorted([1,3], [2,4]) expects [1,2,3,4], gets [1,3]

Please analyze step by step:
1. Track variable state at each loop iteration
2. Identify the logic error
3. Provide a fix
```

- ✅ Significant improvement in reasoning accuracy (GSM8K benchmark +20-40%).
- ✅ Intermediate steps are auditable, making debugging easier.
- ❌ Longer outputs; using CoT for simple tasks is over-engineering.

## 4. ReAct (Reasoning + Acting)

The model executes tasks in a `Thought → Action → Observation` loop: reason first, then call a tool, then continue reasoning based on the result.

**Best for**: Tasks requiring external tools, multi-step tasks, and building Agent systems.

```text
You are an assistant with access to the following tools:
- search(query): Search the internet
- calculate(expression): Perform math calculations

Question: How much more revenue did Tesla have than Toyota in 2023?

Thought 1: I need to look up revenue data for both companies.
Action 1: search("Tesla 2023 revenue")
Observation 1: Tesla's 2023 revenue was $96.77 billion.

Thought 2: Now look up Toyota's data.
Action 2: search("Toyota 2023 revenue")
Observation 2: Toyota's fiscal year 2023 revenue was $375 billion.

Thought 3: Calculate the difference.
Action 3: calculate("3750 - 967.7")
Observation 3: 2782.3

Final answer: Toyota's 2023 revenue was approximately $278.23 billion higher than Tesla's.
```

- ✅ Can handle complex tasks requiring external information; reasoning process is transparent.
- ❌ High token cost, tool calls can fail, high implementation complexity.

## 5. Tree-of-Thought (ToT)

The model generates multiple possible "next steps," evaluates each option, prunes weak paths, and continues exploring promising ones.

**Best for**: Creative writing, complex problem-solving (planning, strategy), and scenarios requiring globally optimal solutions.

```text
You are a startup advisor. The user wants to build an "AI Butler" product.

Please analyze using the Tree-of-Thought method:

Step 1: Generate 3 different product directions
  - Direction A: ...
  - Direction B: ...
  - Direction C: ...

Step 2: Evaluate each direction (market demand 1-10, technical difficulty 1-10, competition level 1-10)

Step 3: Select the best direction and expand in depth

Step 4: Generate 2 sub-plans for the selected direction and evaluate them
```

- ✅ Can find better solutions and avoid getting stuck in local optima.
- ❌ Token consumption is 3-5x that of CoT; not suitable for simple tasks.

## 6. Self-consistency

Sample multiple reasoning paths (typically 5-10 times) and vote on the final answer — the majority result is more reliable.

**Best for**: Math and logical reasoning (where high accuracy is needed), classification tasks, and judgments that can't be verified with tools.

```python
# Self-consistency implementation
def self_consistency(prompt, n_samples=5):
    answers = []
    for i in range(n_samples):
        response = llm.generate(
            prompt + "\nThink step by step, then give your final answer.",
            temperature=0.7
        )
        answer = extract_final_answer(response)
        answers.append(answer)
    return majority_vote(answers)

# Example: 5 sampling results
# Run 1: 42, Run 2: 42, Run 3: 38, Run 4: 42, Run 5: 40
# Final answer: 42 (3/5 majority)
```

- ✅ Significant improvement in reasoning accuracy (+10-25%), more stable results.
- ❌ Cost is N times that of single-pass reasoning; increases latency.

## Combining Patterns

In practice, these patterns are often combined:

```text
# Few-shot + CoT combination
System: You are a code review expert.

# Few-shot examples
Example 1:
Code: def add(a,b): return a+b
Analysis: Missing type annotations, poor parameter naming readability.
Fix: def add(a: int, b: int) -> int: return a + b

# Request CoT reasoning
Please review the following code, analyzing each potential issue step by step:
{{code}}
```

## Exercises

1. **Choose a pattern**: Given the following tasks, select the most appropriate pattern and explain why:
   - Classify user input into 5 predefined categories.
   - Generate API call code from documentation.
   - Determine whether a math proof is correct.
   - Design 3 different marketing strategies for a product.

2. **Combination design**: Design a prompt for a "code review" task that combines 2-3 patterns.

## Next Steps

After mastering design patterns, learn how to organize prompts using structured methods:

→ [Structured Prompts](/guide/prompt-engineering/structured)
