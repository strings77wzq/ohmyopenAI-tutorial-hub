# What is a Skill?

A Skill is a **reusable AI instruction template** that defines how an AI assistant completes a specific task.

## Core Concepts

### Definition of a Skill

A Skill is a structured set of instructions that includes:

1. **What** — described through `name` and `description`
2. **How** — detailed in the `prompt` with execution steps
3. **Examples** — shown through `examples` that demonstrate input and output

### What a Skill Is NOT

| ❌ A Skill is not | ✅ A Skill is |
|-------------------|--------------|
| A specific code snippet | A general-purpose execution template |
| A one-time instruction | A reusable playbook |
| A configuration file | A smart template containing logic |

## Why Do You Need Skills?

### Scenario 1: Code Review

**Without a Skill:**
```
You: Help me review this code
AI: OK, this code looks fine...
(you have to explain review criteria every time)
```

**With a Skill:**
```
You: /review-code (triggers the Skill)
AI: [Automatically reviews based on predefined criteria]
  ✓ Code style check
  ✓ Security vulnerability scan
  ✓ Performance optimization suggestions
  ✓ Readability assessment
```

### Scenario 2: Documentation Generation

**Without a Skill:**
```
You: Write docs for this function
AI: The function takes parameters x and y...
(inconsistent format, unstable quality)
```

**With a Skill:**
```
You: /generate-docs (triggers the Skill)
AI: [Automatically generates standardized documentation]
## Function Name
**Parameters**:
- `x` (number): ...
- `y` (string): ...

**Returns**: ...

**Example**: ...
```

## Skill vs. Tool

| | Skill | Tool |
|---|-------|------|
| **Purpose** | Guides AI on how to think | Lets AI perform actions |
| **Input** | Natural language instructions | Structured data |
| **Output** | Text / suggestions / analysis | File modifications / API calls |
| **Examples** | Code review, documentation generation | Read, Write, Edit |

**Analogy:**
- **Skill** = A coach's tactical instruction (tells you how to play)
- **Tool** = A player's feet (actually kick the ball)

## Components of a Skill

A complete Skill contains four core components:

```json
{
  "name": "skill-name",           // Identifier
  "description": "description",   // Function summary
  "prompt": "detailed instructions...",  // Execution logic
  "examples": [                   // Examples
    {"input": "...", "output": "..."}
  ]
}
```

### 1. Name

- Use kebab-case (hyphen-separated)
- Should be concise and self-explanatory
- Examples: `explain-code`, `review-pr`, `write-tests`

### 2. Description

- A single sentence explaining the Skill's function
- Helps users (and AI) understand when to use it
- Example: "Explain how code works, including logic flow and key variables"

### 3. Prompt

- The most critical part
- Describes in detail what the AI should do
- Can include variables like `{{code}}`

### 4. Examples

- Show input and expected output
- Help the AI understand the desired format and quality
- Typically include 2–3 representative examples

## Real-World Examples

### Example 1: Code Explanation Skill

```json
{
  "name": "explain-code",
  "description": "Explain how code works, including logic flow, key variables, and potential issues",
  "prompt": "Please explain the following code in detail:\n\n{{code}}\n\nAnalyze from the following perspectives:\n1. Overall function: What does this code do?\n2. Execution flow: How does the code execute step by step?\n3. Key variables: Important variables and their roles\n4. Potential issues: Possible bugs or areas for improvement\n5. Best practices: Whether it follows coding standards",
  "examples": [
    {
      "input": "function factorial(n) {\n    if (n === 0) return 1;\n    return n * factorial(n - 1);\n}",
      "output": "## Overall Function\nThis is a recursive function that calculates factorials...\n\n## Execution Flow\n1. Check if n is 0...\n\n## Key Variables\n- `n`: The input number...\n\n## Potential Issues\n- Does not handle negative input...\n\n## Best Practices\n- ✅ Uses recursion for clean code..."
    }
  ]
}
```

### Example 2: PR Review Skill

```json
{
  "name": "review-pr",
  "description": "Review a Pull Request, checking code quality, security issues, and best practices",
  "prompt": "Please review the following PR code changes:\n\n{{diff}}\n\nEvaluate from the following dimensions:\n1. Code quality: readability, naming conventions, complexity\n2. Security: potential security vulnerabilities\n3. Performance: obvious performance issues\n4. Tests: sufficient test coverage\n5. Documentation: necessary comments and docs\n\nProvide specific suggestions and code examples for each issue.",
  "examples": [
    {
      "input": "diff --git a/src/auth.js b/src/auth.js...",
      "output": "## Review Results\n\n### 🔴 Critical Issues\n1. **Plaintext password storage** (line 15)\n   - Issue: Password is stored in plaintext...\n   - Suggestion: Use bcrypt or similar for hashing...\n\n### 🟡 Suggested Improvements\n..."
    }
  ]
}
```

## Advantages of Skills

### 1. Consistency

All users get the same quality of output, regardless of AI randomness.

### 2. Reusability

Write it once, and the entire team can use it.

### 3. Maintainability

When adjustments are needed, just modify the Skill definition — no need to rewrite all prompts.

### 4. Shareability

Skills use a standard format and can be shared and reused across the community.

## Common Misconceptions

### ❌ Misconception 1: More complex Skills are better

**Reality:** Concise, clear Skills work better. Overly complex instructions confuse the AI.

### ❌ Misconception 2: One Skill should do everything

**Reality:** Keep Skills focused on a single responsibility. Break complex tasks into multiple Skills used together.

### ❌ Misconception 3: Examples aren't needed

**Reality:** Examples are key to helping the AI understand expected output, especially for formatting requirements.

## Next Steps

Now that you understand the concept of Skills, learn how to create your first Skill:

→ [Create Your First Skill](/guide/skills/first-skill)
