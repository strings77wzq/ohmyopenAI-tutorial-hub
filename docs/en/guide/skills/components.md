# Skill Core Components

A complete Skill consists of four core components, each with its own purpose and best practices.

## Component Overview

```json
{
  "name": "skill-name",
  "description": "One-sentence description of the Skill's function",
  "prompt": "Detailed execution instructions...",
  "examples": [
    {
      "input": "Example input",
      "output": "Expected output"
    }
  ]
}
```

## 1. Name

### Purpose
- Unique identifier for the Skill
- Users invoke the Skill by name
- Used in logs and analytics for tracking

### Naming Conventions

#### ✅ Good naming
```json
{
  "name": "explain-code"
}
```

#### ❌ Bad naming
```json
{
  "name": "explainCode"      // Don't use camelCase
}
```

```json
{
  "name": "explain_code"     // Don't use underscores
}
```

```json
{
  "name": "ec"               // Don't use abbreviations
}
```

### Naming Rules

1. **kebab-case**: lowercase letters, hyphen-separated
2. **Concise and clear**: self-explanatory at a glance
3. **Verb-first**: indicates an action, e.g. `explain-`, `review-`, `generate-`
4. **Avoid abbreviations**: unless they are industry-standard

### Naming Examples

| Skill Function | Good Name | Bad Name |
|---------------|-----------|----------|
| Explain code | `explain-code` | `code-explanation` |
| Review PR | `review-pr` | `pr-review` |
| Write unit tests | `write-tests` | `unit-test-writer` |
| Generate docs | `generate-docs` | `doc-generator` |

## 2. Description

### Purpose
- Explains what the Skill does
- Helps users understand when to use it
- Displayed in the Skill listing

### Description Guidelines

#### ✅ Good description
```json
{
  "description": "Explain how code works, including logic flow, key variables, and potential issues"
}
```

#### ❌ Bad description
```json
{
  "description": "Explain code"  // Too vague, adds no value
}
```

```json
{
  "description": "This Skill can help you explain how code works"  // Redundant; don't say "This Skill"
}
```

### Description Rules

1. **One sentence**: no more than 100 characters
2. **Specific and clear**: state exactly what it does, not generic language
3. **Include value**: what the user gets out of it
4. **Don't say "this Skill"**: describe the function directly

### Description Template

```
[action] + [object] + [value]

Examples:
- Explain how code works, discovering potential issues
- Review a PR, checking for security vulnerabilities and performance problems
- Generate function documentation, including parameter and return value descriptions
```

## 3. Prompt

### Purpose
- The most critical component
- Tells the AI exactly what to do
- Determines the quality of the output

### Prompt Structure

```
[Context] + [Task description] + [Format requirements] + [Evaluation dimensions]
```

### Example Prompt

```
Please explain the following code in detail:

```
{{code}}
```

Analyze from the following perspectives (answer in English):

## 1. Overall Function
Briefly describe the main purpose of this code.

## 2. Execution Flow
Explain the code's execution process step by step.

## 3. Key Variables and Functions
List important variables and functions, explaining their roles.

## 4. Potential Issues
Point out possible bugs, performance issues, or edge cases.

## 5. Improvement Suggestions
Provide specific optimization suggestions (if any).
```

### Prompt Best Practices

#### 1. Use Variable Placeholders

```
// ✅ Good: use variables
{{code}}
{{language}}
{{complexity}}

// ❌ Bad: hardcoded
the following Python code
```

#### 2. Specify Output Format Clearly

```
// ✅ Good: clear format
Please use Markdown format with the following sections:
## 1. Function Description
## 2. Execution Flow
## 3. Key Variables

// ❌ Bad: vague requirements
Please analyze the code
```

#### 3. Provide Evaluation Dimensions

```
// ✅ Good: multiple dimensions
Analyze from the following dimensions:
1. Functional correctness
2. Code readability
3. Performance optimization
4. Security considerations

// ❌ Bad: single dimension
Please analyze the code
```

#### 4. Set Constraints

```
// ✅ Good: explicit constraints
- Answer in English
- Code examples must be runnable
- Provide solutions when identifying issues

// ❌ Bad: no constraints
Please analyze the code
```

### Prompt Templates

#### Analysis Skill Template

```
Please analyze the following content:

```
{{content}}
```

Analyze from the following dimensions:
1. [Dimension 1]: [Description]
2. [Dimension 2]: [Description]
3. [Dimension 3]: [Description]

Format requirements:
- Answer in [language]
- Use Markdown format
- Every dimension must have content (can be "No obvious issues")
```

#### Generation Skill Template

```
Please generate [content type] based on the following requirements:

Requirements:
{{requirements}}

Constraints:
- [Constraint 1]
- [Constraint 2]
- [Constraint 3]

Output format:
```
[Format example]
```
```

## 4. Examples

### Purpose
- Show input and expected output
- Help the AI understand the desired quality and format
- Provide references for edge cases

### Example Structure

```json
{
  "examples": [
    {
      "input": "Example input",
      "output": "Expected output"
    }
  ]
}
```

### Example Rules

#### 1. Quantity
- At least 1, recommended 2–3
- Cover different scenarios

#### 2. Quality
- Output should represent your ideal result
- Proper format, complete content

#### 3. Variety
- Include simple cases
- Include complex cases
- Include edge cases

### Example

```json
{
  "examples": [
    {
      "input": "def add(a, b):\n    return a + b",
      "output": "## 1. Overall Function\nThis is a simple addition function...\n\n## 2. Execution Flow\n..."
    },
    {
      "input": "async function fetchData(url) {\n    const response = await fetch(url);\n    return response.json();\n}",
      "output": "## 1. Overall Function\nThis is an asynchronous data fetching function...\n\n## 2. Execution Flow\n..."
    }
  ]
}
```

## Complete Example

### Code Review Skill

```json
{
  "name": "review-code",
  "description": "Review code, checking for security vulnerabilities, performance issues, and best practices",
  "prompt": "Please review the following code:\n\n```\n{{code}}\n```\n\nEvaluate from the following dimensions:\n\n## 1. Security Issues 🔒\n- SQL injection, XSS, and other security vulnerabilities\n- Sensitive information leakage\n- Access control issues\n\n## 2. Performance Issues ⚡\n- Obvious performance bottlenecks\n- Unnecessary computations\n- Memory leak risks\n\n## 3. Code Quality 📐\n- Clear naming conventions\n- Functions that are too long\n- Duplicate code\n\n## 4. Best Practices ✅\n- Adherence to language conventions\n- Proper error handling\n- Necessary comments\n\nFor each issue found, provide:\n- Issue description\n- Risk level (High / Medium / Low)\n- Fix suggestion (with code example)",
  "examples": [
    {
      "input": "function getUser(id) {\n    const query = \"SELECT * FROM users WHERE id = \" + id;\n    return db.query(query);\n}",
      "output": "## 1. Security Issues 🔒\n\n### 🔴 High: SQL Injection\n- **Issue**: Direct string concatenation in SQL query, creating SQL injection risk\n- **Risk**: An attacker can execute arbitrary SQL commands\n- **Fix**:\n```javascript\nfunction getUser(id) {\n    const query = \"SELECT * FROM users WHERE id = ?\";\n    return db.query(query, [id]);\n}\n```\n\n## 2. Performance Issues ⚡\n- No obvious performance issues\n\n## 3. Code Quality 📐\n- No obvious quality issues\n\n## 4. Best Practices ✅\n- Missing error handling\n- Suggest using parameterized queries"
    }
  ]
}
```

## Common Mistakes

### Mistake 1: Prompt Too Short

```json
{
  "prompt": "Explain this code"
}
```

**Problem:** The AI doesn't know what specifically to explain.

**Solution:** Specify dimensions, format, and constraints clearly.

### Mistake 2: Too Few Examples

```json
{
  "examples": []
}
```

**Problem:** The AI doesn't know the expected output quality.

**Solution:** Provide at least 1–2 high-quality examples.

### Mistake 3: Name and Description Don't Match

```json
{
  "name": "explain-code",
  "description": "Generate code documentation"
}
```

**Problem:** Name and description are inconsistent, confusing users.

**Solution:** Ensure the name and description describe the same function.

## Summary

| Component | Key Points |
|-----------|-----------|
| Name | kebab-case, verb-first, avoid abbreviations |
| Description | One sentence, specific and clear, don't say "this Skill" |
| Prompt | Use variables, specify format, provide dimensions, set constraints |
| Examples | 2–3 examples, cover different scenarios, show desired quality |

## Next Steps

Learn how to combine these components to create complex Skills:

→ [Advanced Patterns](/guide/skills/advanced)
