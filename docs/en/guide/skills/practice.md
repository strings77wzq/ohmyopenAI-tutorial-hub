# Practice: Code Review Skill

Walk through a complete case study to learn how to build a practical code review Skill from requirements to implementation.

## Requirements Analysis

### Scenario

As a team tech lead, you need to:
1. Review code submitted by team members
2. Ensure code quality and security
3. Provide actionable improvement suggestions
4. Standardize the team's code review criteria

### Pain Points

**Problems with manual reviews:**
- Time-consuming (30–60 minutes per PR)
- Inconsistent standards (different reviewers focus on different things)
- Easy to miss issues (human attention fatigues)
- Knowledge is hard to retain (review experience can't be reused)

**Problems with existing tools:**
- Static analysis tools only focus on syntax
- Can't adapt based on project context
- Output is hard to understand (too many false positives)

### Goal

Create a `review-code` Skill that can:
- Automatically analyze code and find potential issues
- Adjust review criteria based on project standards
- Provide specific, actionable improvement suggestions
- Support multiple languages and frameworks

## Designing the Skill

### Step 1: Define the Name and Description

```json
{
  "name": "review-code",
  "description": "Review code, checking for security vulnerabilities, performance issues, and best practices, providing specific fix suggestions"
}
```

### Step 2: Design the Prompt

Based on requirements, the Prompt needs to cover:
1. Security review
2. Performance review
3. Code quality
4. Best practices

```
Please review the following code:

```
{{code}}
```

Context information:
- Programming language: {{language}}
- Framework: {{framework}}
- Project type: {{projectType}}

Review from the following dimensions:

## 1. Security Review 🔒
Check for the following security issues:
- SQL injection
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Sensitive information leakage
- Insecure dependencies
- Access control issues

For each security issue:
- Issue description
- Risk level (🔴 High / 🟡 Medium / 🟢 Low)
- Fix suggestion (with code example)

## 2. Performance Review ⚡
Check for the following performance issues:
- Excessive time complexity
- Unnecessary computations
- Memory leaks
- Unreleased resources
- N+1 query problems
- Blocking operations

For each performance issue:
- Issue description
- Impact assessment
- Optimization suggestion (with code example)

## 3. Code Quality 📐
Check for the following code quality issues:
- Naming conventions
- Function length (warn if over 50 lines)
- Cyclomatic complexity (warn if over 10)
- Duplicate code
- Dead code
- Magic numbers

## 4. Best Practices ✅
Check for the following best practices:
- Error handling
- Logging
- Input validation
- Comment standards
- Test coverage
- Documentation completeness

## 5. Summary
- List of main issues
- Priority ranking
- Fix suggestion summary

Review principles:
- For obvious issues: must fix
- For potential issues: recommended to fix
- For improvement suggestions: optional
```

### Step 3: Design Examples

Example 1: Simple security issue

```json
{
  "input": "function getUser(id) {\n    const query = \"SELECT * FROM users WHERE id = \" + id;\n    return db.query(query);\n}",
  "output": "## 1. Security Review 🔒\n\n### 🔴 High: SQL Injection\n- **Location**: Line 2\n- **Issue**: Direct SQL string concatenation, creating SQL injection risk\n- **Risk**: Attacker can execute arbitrary SQL commands, potentially causing data breach or corruption\n- **Fix suggestion**:\n```javascript\nfunction getUser(id) {\n    const query = \"SELECT * FROM users WHERE id = ?\";\n    return db.query(query, [id]);\n}\n```\n\n## 2. Performance Review ⚡\n- No obvious performance issues\n\n## 3. Code Quality 📐\n- Function name is clear\n- Function length is appropriate (2 lines)\n\n## 4. Best Practices ✅\n- ⚠️ Missing error handling\n- Suggest adding try-catch block for database errors\n\n## 5. Summary\n- 🔴 Must fix: SQL injection\n- 🟡 Recommended: Add error handling"
}
```

Example 2: Performance issue

```json
{
  "input": "function findDuplicates(arr) {\n    const duplicates = [];\n    for (let i = 0; i < arr.length; i++) {\n        for (let j = i + 1; j < arr.length; j++) {\n        if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {\n                duplicates.push(arr[i]);\n            }\n        }\n    }\n    return duplicates;\n}",
  "output": "## 1. Security Review 🔒\n- No obvious security issues\n\n## 2. Performance Review ⚡\n\n### 🔴 Severe Performance Issue\n- **Time complexity**: O(n³)\n  - Nested loops: O(n²)\n  - includes check: O(n)\n  - Total: O(n³)\n- **Issue**: Will be very slow for large datasets\n- **Optimization suggestion**: Use Set for optimization\n```javascript\nfunction findDuplicates(arr) {\n    const seen = new Set();\n    const duplicates = new Set();\n    \n    for (const item of arr) {\n        if (seen.has(item)) {\n            duplicates.add(item);\n        } else {\n            seen.add(item);\n        }\n    }\n    \n    return Array.from(duplicates);\n}\n```\nOptimized time complexity: O(n)\n\n## 3. Code Quality 📐\n- Function name is clear\n- Variable naming is reasonable\n\n## 4. Best Practices ✅\n- ✅ Has return value\n- ⚠️ Missing input validation (check if arr is an array)\n\n## 5. Summary\n- 🔴 Must fix: Performance issue (O(n³) → O(n))"
}
```

## Complete Implementation

```json
{
  "name": "review-code",
  "description": "Review code, checking for security vulnerabilities, performance issues, and best practices, providing specific fix suggestions",
  "prompt": "Please review the following code:\n\n```\n{{code}}\n```\n\nContext information:\n- Programming language: {{language || 'Unknown'}}\n- Framework: {{framework || 'Unknown'}}\n- Project type: {{projectType || 'General'}}\n\nReview from the following dimensions:\n\n## 1. Security Review 🔒\nCheck for the following security issues:\n- SQL injection (direct SQL concatenation)\n- XSS (unescaped output)\n- CSRF (missing protection)\n- Sensitive information leakage (hardcoded keys, passwords)\n- Insecure dependencies (libraries with known vulnerabilities)\n- Access control issues (privilege escalation)\n\nFor each issue found:\n- Issue description\n- Risk level (🔴 High / 🟡 Medium / 🟢 Low)\n- Specific location\n- Fix suggestion (with code example)\n\n## 2. Performance Review ⚡\nCheck for the following performance issues:\n- Excessive time complexity (e.g., nested loops)\n- Excessive space complexity (e.g., high memory usage)\n- Unnecessary computations\n- Unreleased resources (files, connections, etc.)\n- N+1 query problems\n- Blocking operations\n\nFor each issue found:\n- Issue description\n- Complexity analysis (Big O notation)\n- Optimization suggestion (with code example)\n\n## 3. Code Quality 📐\nCheck for the following code quality issues:\n- Naming conventions (clear and consistent?)\n- Function length (suggest splitting if over 50 lines)\n- Cyclomatic complexity (suggest refactoring if over 10)\n- Duplicate code (DRY principle)\n- Dead code (unused variables/functions)\n- Magic numbers (should use constants)\n\n## 4. Best Practices ✅\nCheck for the following best practices:\n- Error handling (try-catch, error returns)\n- Logging (appropriate log levels)\n- Input validation (parameter checks)\n- Type safety (type annotations or checks)\n- Comment standards (necessary comments)\n- Test coverage (testability)\n\n## 5. Summary and Recommendations\n- List of main issues (sorted by priority)\n- Must-fix issues (🔴)\n- Recommended fixes (🟡)\n- Optional improvements (🟢)\n- Overall assessment\n\nReview principles:\n- 🔴 Must fix: Security vulnerabilities, severe performance issues, obvious errors\n- 🟡 Recommended: Code quality issues, missing best practices\n- 🟢 Optional: Style issues, minor optimizations",
  "examples": [
    {
      "input": "function getUser(id) {\n    const query = \"SELECT * FROM users WHERE id = \" + id;\n    return db.query(query);\n}",
      "output": "## 1. Security Review 🔒\n\n### 🔴 High: SQL Injection\n- **Location**: Line 2\n- **Issue**: Direct SQL string concatenation, creating SQL injection risk\n- **Risk**: Attacker can execute arbitrary SQL commands\n- **Fix**:\n```javascript\nfunction getUser(id) {\n    const query = \"SELECT * FROM users WHERE id = ?\";\n    return db.query(query, [id]);\n}\n```\n\n## 2. Performance Review ⚡\n- No obvious performance issues\n\n## 3. Code Quality 📐\n- ✅ Function name is clear\n- ✅ Function length is appropriate\n\n## 4. Best Practices ✅\n- ⚠️ Missing error handling\n- Suggest adding try-catch\n\n## 5. Summary and Recommendations\n- 🔴 Must fix: SQL injection (security vulnerability)\n- 🟡 Recommended: Add error handling"
    },
    {
      "input": "function findDuplicates(arr) {\n    const duplicates = [];\n    for (let i = 0; i < arr.length; i++) {\n        for (let j = i + 1; j < arr.length; j++) {\n            if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {\n                duplicates.push(arr[i]);\n            }\n        }\n    }\n    return duplicates;\n}",
      "output": "## 1. Security Review 🔒\n- ✅ No obvious security issues\n\n## 2. Performance Review ⚡\n\n### 🔴 Severe Performance Issue\n- **Time complexity**: O(n³)\n  - Nested loops: O(n²)\n  - includes check: O(n)\n- **Fix**: Use Set\n```javascript\nfunction findDuplicates(arr) {\n    const seen = new Set();\n    const duplicates = new Set();\n    for (const item of arr) {\n        if (seen.has(item)) duplicates.add(item);\n        else seen.add(item);\n    }\n    return Array.from(duplicates);\n}\n```\nOptimized: O(n)\n\n## 3. Code Quality 📐\n- ✅ Clear naming\n\n## 4. Best Practices ✅\n- ⚠️ Missing input validation\n\n## 5. Summary and Recommendations\n- 🔴 Must fix: Performance issue (O(n³) → O(n))"
    }
  ]
}
```

## Usage Examples

### How to Use

```
User: /review-code

function processPayment(userId, amount) {
    const user = db.query("SELECT * FROM users WHERE id = " + userId);
    if (user.balance >= amount) {
        db.query("UPDATE users SET balance = balance - " + amount + " WHERE id = " + userId);
        return { success: true };
    }
    return { success: false };
}

Language: JavaScript
Framework: Express

AI: ## 1. Security Review 🔒

### 🔴 High: SQL Injection (multiple)
- **Location**: Line 2, Line 4
- **Issue**: Multiple instances of direct SQL concatenation
- **Fix**: Use parameterized queries

### 🔴 High: Concurrency Issue
- **Issue**: No transaction handling, potential race condition
- **Fix**: Use database transactions

## 2. Performance Review ⚡
- No obvious performance issues

## 3. Code Quality 📐
- Function is somewhat long (8 lines)

## 4. Best Practices ✅
- Missing error handling
- Missing logging

## 5. Summary
- 🔴 Must fix: SQL injection, concurrency issues
- 🟡 Recommended: Add error handling, logging
```

## Effect Evaluation

### Before

- Review time per PR: 30–60 minutes
- Miss rate: ~20%
- Inconsistent standards

### After

- Initial review time: 5–10 minutes (AI-assisted)
- Miss rate: Reduced to 5%
- Consistent review standards

### Improvement Suggestions

Based on actual usage feedback, you can further optimize:

1. **Add project-specific rules**: Customize check items based on team standards
2. **Learn from historical data**: Optimize based on past review records
3. **Integrate with CI/CD**: Auto-review before commits

## Summary

Through this case study, we learned:

1. **Requirements Analysis**: Clearly define the problem the Skill solves
2. **Design Approach**: Design the Prompt structure based on requirements
3. **Example Writing**: Provide high-quality input/output examples
4. **Iterative Improvement**: Continuously improve based on actual usage

## Next Steps

Learn how to maintain and improve Skills:

→ [Best Practices and Common Pitfalls](/guide/skills/best-practices)
