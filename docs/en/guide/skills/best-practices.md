# Best Practices and Common Pitfalls

Lessons learned from practice to help you write high-quality Skills.

## Best Practices

### 1. Prompt Design

#### ✅ Be Specific and Clear

```
// ✅ Good: Clear dimensions and format
Analyze from the following dimensions:
1. Function: What the code does
2. Flow: Execution steps
3. Issues: Potential bugs
4. Optimization: Improvement suggestions

Use Markdown format with ## headings for each dimension
```

```
// ❌ Bad: Vague and generic
Please analyze this code
```

#### ✅ Provide Context

```
// ✅ Good: Provide project context
Code:
{{code}}

Context:
- Language: {{language}}
- Framework: {{framework}}
- Project type: {{projectType}}
```

#### ✅ Set Constraints

```
// ✅ Good: Clear constraints
Requirements:
- Answer in English
- Code examples must be runnable
- Provide solutions when identifying issues

Prohibited:
- Do not modify functionality
- Do not remove comments
```

### 2. Writing Examples

#### ✅ Cover Different Scenarios

```json
{
  "examples": [
    {
      "input": "Simple code example",
      "output": "..."
    },
    {
      "input": "Complex code example",
      "output": "..."
    },
    {
      "input": "Edge case example",
      "output": "..."
    }
  ]
}
```

#### ✅ Demonstrate Expected Quality

```
// ✅ Good: Example shows perfect output
"output": "## 1. Overall Function\nThis is a...\n\n## 2. Execution Flow\n1. ...\n2. ...\n\n## 3. Key Variables\n- `x`: ...\n- `y`: ..."

// ❌ Bad: Example quality is low
"output": "This code is a function."
```

### 3. Variable Naming

#### ✅ Use Semantic Names

```
// ✅ Good: Clear semantics
{{code}}
{{language}}
{{complexityLevel}}
{{includeTests}}

// ❌ Bad: Abbreviated or vague
{{c}}
{{lang}}
{{level}}
{{tests}}
```

### 4. Skill Organization

#### ✅ Single Responsibility

```json
{
  "name": "explain-code",
  "description": "Explain how code works"
}
// Only explains, does nothing else

{
  "name": "optimize-code",
  "description": "Optimize code performance"
}
// Only optimizes, does nothing else
```

#### ✅ Compose Together

```
User: /explain-code
...

User: /optimize-code
...

// Instead of one Skill doing two things
```

### 5. Progressive Complexity

#### ✅ Start Simple

```
Step 1: Basic functionality
Step 2: Add error handling
Step 3: Add performance optimization
Step 4: Add advanced features
```

#### ✅ Provide Default Values

```
{{language || 'JavaScript'}}
{{complexity || 'medium'}}
{{includeComments || true}}
```

## Common Pitfalls

### Pitfall 1: Prompt Too Long

**Problem:** Prompt exceeds 2000 characters; the AI tends to miss information.

**Symptoms:**
- AI only executes part of the requirements
- Output is incomplete

**Solution:**
- Streamline the Prompt, keep core content
- Split complex Skills into multiple simpler Skills
- Use a parent Skill to coordinate child Skills

```
// ❌ Bad: Too long
Please review the code, including:
1. Security issues (10 sub-items)
2. Performance issues (10 sub-items)
3. Code quality (10 sub-items)
4. Best practices (10 sub-items)
5. Architecture design (10 sub-items)
...

// ✅ Good: Concise
Please review the code, focusing on:
1. Security issues (core 3–5 items)
2. Performance issues (core 3–5 items)
3. Code quality (core 3–5 items)
```

### Pitfall 2: Too Few Examples

**Problem:** No examples or low-quality examples.

**Symptoms:**
- AI output format is inconsistent
- Output quality is unstable

**Solution:**
- Provide at least 2–3 high-quality examples
- Cover different scenarios
- Show the desired perfect output

### Pitfall 3: Undefined Variables

**Problem:** Prompt uses variables that haven't been defined.

**Symptoms:**
- AI can't understand the task correctly
- Output contains literal `{{variable}}` text

**Solution:**
- Ensure all `{{variable}}` values are defined in the input
- Provide default values for variables
- List required variables at the top of the Prompt

### Pitfall 4: Contradictory Requirements

**Problem:** Prompt contains conflicting requirements.

**Symptoms:**
- AI is confused, output quality is poor
- Different invocations produce inconsistent results

**Solution:**
- Check Prompt logic consistency
- Avoid contradictory requirements
- Clarify priorities

```
// ❌ Bad: Contradictory
Please generate concise but detailed documentation
Please analyze quickly but thoroughly

// ✅ Good: Consistent
Please generate concise documentation (under 200 words)
Please perform a quick initial analysis (complete within 5 minutes)
```

### Pitfall 5: Over-Constraining

**Problem:** Too many constraints in the Prompt, limiting the AI's capabilities.

**Symptoms:**
- Output is rigid and inflexible
- Can't handle edge cases

**Solution:**
- Only constrain what's necessary
- Leave room for AI flexibility
- Demonstrate flexibility in examples

### Pitfall 6: Ignoring Error Handling

**Problem:** Skill doesn't account for error conditions.

**Symptoms:**
- Skill fails on abnormal input
- Output contains error messages

**Solution:**
- Add input validation in the Prompt
- Provide error handling guidelines
- Include error handling in examples

```
// ✅ Good: Includes error handling
If input is empty, return: "Error: Input cannot be empty"
If input format is wrong, return: "Error: Input format is incorrect, expected format is..."
```

### Pitfall 7: No Updates or Maintenance

**Problem:** Skill is created and never updated.

**Symptoms:**
- Skill becomes disconnected from project needs
- Output quality gradually declines

**Solution:**
- Regularly review and update Skills
- Improve based on usage feedback
- Establish Skill version management

## Checklist

When creating a Skill, verify the following:

### Basic Information
- [ ] Name uses kebab-case
- [ ] Description is concise and clear
- [ ] Description doesn't say "this Skill"

### Prompt Design
- [ ] Task is specific and clear
- [ ] Uses variable placeholders
- [ ] Provides project context
- [ ] Specifies output format
- [ ] Sets reasonable constraints
- [ ] Length is appropriate (< 2000 characters)

### Examples
- [ ] At least 2–3 examples
- [ ] Covers different scenarios
- [ ] Shows desired output quality
- [ ] Includes edge cases

### Error Handling
- [ ] Handles empty input
- [ ] Handles format errors
- [ ] Handles abnormal data
- [ ] Provides error messages

### Testing
- [ ] Tests simple input
- [ ] Tests complex input
- [ ] Tests edge cases
- [ ] Tests invalid input

## Version Management

### Skill Version Naming

```
explain-code-v1.json
explain-code-v2.json
explain-code-v2.1.json
```

### Changelog

```
## v1.0.0 (2026-01-15)
- Initial version
- Basic code explanation functionality

## v1.1.0 (2026-02-01)
- Added performance analysis dimension
- Optimized output format

## v2.0.0 (2026-03-01)
- Multi-language support
- Added security review
- **BREAKING**: Input format change
```

## Team Collaboration

### Sharing Skills

1. **Location**: Project repository's `.skills/` directory
2. **Naming convention**: `team-name-skill-name.json`
3. **Documentation**: Explain the Skill's purpose in the README

### Code Review

Skills should also be reviewed:

- Is the Prompt clear?
- Are the examples sufficient?
- Are there security vulnerabilities?
- Does it follow best practices?

## Performance Optimization

### Reducing Token Consumption

```
// ❌ Bad: Verbose
Please explain in detail how the following code works, including its overall function, execution flow, key variables and functions, potential issues, and improvement suggestions...

// ✅ Good: Concise
Explain the code:
1. Function: Main purpose
2. Flow: Execution steps
3. Issues: Potential bugs
4. Optimization: Improvement suggestions
```

### Caching Results

For repetitive tasks, consider caching Skill output:

```
Input: Same code snippet
Output: Return cached result directly
```

## Summary

| Aspect | Best Practice | Avoid |
|--------|--------------|-------|
| Prompt | Clear, concise, constrained | Too long, vague, contradictory |
| Examples | Multiple scenarios, high quality | Too few, low quality |
| Variables | Semantic, with defaults | Undefined, abbreviated |
| Maintenance | Regular updates, version control | One-time, unmaintained |

## Next Steps

Continue learning other core concepts:

→ [OpenSpec Core Concepts](/guide/openspec/concepts)
