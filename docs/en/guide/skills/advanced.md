# Advanced Skill Patterns

Master advanced Skill techniques to build more powerful and flexible AI skills.

## 1. Conditional Logic

### Scenario

Handle different inputs with different processing approaches based on their characteristics.

### Implementation

Use conditional statements in the Prompt:

```json
{
  "name": "smart-analyze",
  "description": "Intelligently analyze code, selecting analysis depth based on complexity",
  "prompt": "Please analyze the following code:\n\n```\n{{code}}\n```\n\nFirst, assess code complexity:\n- Simple (< 10 lines): Basic analysis\n- Medium (10–50 lines): Standard analysis\n- Complex (> 50 lines): Deep analysis\n\nThen perform the corresponding analysis:\n\n{{#if complexity === 'simple'}}\n## Basic Analysis\n1. Function overview\n2. Inputs and outputs\n{{/if}}\n\n{{#if complexity === 'medium'}}\n## Standard Analysis\n1. Function overview\n2. Execution flow\n3. Key variables\n4. Potential issues\n{{/if}}\n\n{{#if complexity === 'complex'}}\n## Deep Analysis\n1. Architecture design\n2. Execution flow (detailed)\n3. Data flow\n4. Dependencies\n5. Performance analysis\n6. Security review\n7. Refactoring suggestions\n{{/if}}",
  "examples": []
}
```

### Real-World Application

```json
{
  "name": "adaptive-review",
  "description": "Adapt review depth based on PR size",
  "prompt": "Please review the following PR:\n\n{{diff}}\n\nChange statistics:\n- Files changed: {{fileCount}}\n- Lines added: {{additions}}\n- Lines deleted: {{deletions}}\n\nSelect review depth based on change size:\n\nIf fileCount <= 3 and additions + deletions <= 50:\n- Perform a quick review\n- Focus on: security issues, obvious bugs\n\nIf fileCount <= 10 and additions + deletions <= 200:\n- Perform a standard review\n- Focus on: code quality, performance, security, testing\n\nOtherwise:\n- Perform a deep review\n- Focus on: architecture design, code quality, performance, security, testing, documentation\n- Suggest reviewing in batches"
}
```

## 2. Using Variables

### Basic Variables

Use `{{variableName}}` to insert dynamic content:

```json
{
  "name": "generate-docs",
  "description": "Generate API documentation",
  "prompt": "Please generate documentation for the following {{language}} function:\n\n```{{language}}\n{{code}}\n```\n\nRequirements:\n- Use {{documentationStyle}} style\n- Language: {{outputLanguage}}\n- Include examples: {{includeExamples}}"
}
```

### Variable Types

| Type | Example | Use Case |
|------|---------|----------|
| String | `{{language}}` | Language, framework name |
| Number | `{{lineCount}}` | Statistics |
| Boolean | `{{includeExamples}}` | Toggle options |
| Code block | `{{code}}` | Code content |

### Default Values

Provide default values for variables:

```json
{
  "prompt": "Please generate {{language || 'JavaScript'}} documentation"
}
```

If `language` is not provided, it defaults to `'JavaScript'`.

### Variable Validation

Add validation logic in the Prompt:

```json
{
  "name": "validate-and-analyze",
  "description": "Validate input before analysis",
  "prompt": "Please analyze the following input:\n\n{{input}}\n\nFirst, validate the input:\n{{#if !input}}\nError: Input cannot be empty\nStop execution\n{{/if}}\n\n{{#if input.length > 10000}}\nWarning: Input is too long ({{input.length}} characters), only analyzing the first 5000 characters\n{{/if}}\n\nThen proceed with analysis:\n..."
}
```

## 3. Tool Call Chains

### Scenario

After a Skill triggers, the AI needs to execute a series of tool calls.

### Implementation

```json
{
  "name": "refactor-code",
  "description": "Refactor code and create tests",
  "prompt": "Please refactor the following code:\n\n```\n{{code}}\n```\n\nSteps:\n1. Use Glob to find related files\n2. Use Read to load file contents\n3. Analyze the code and propose a refactoring plan\n4. Use Edit to execute the refactoring\n5. Use Write to create test files\n6. Use Bash to run tests\n\nRefactoring principles:\n- Maintain functionality\n- Improve readability\n- Reduce complexity\n- Add necessary comments"
}
```

### Tool Call Patterns

#### Pattern 1: Sequential Execution

```
Read → Analyze → Edit → Test
```

#### Pattern 2: Parallel Execution

```
       → Analyze →
Read →              → Edit
       → Lint →
```

#### Pattern 3: Conditional Execution

```
Read → Analyze →
  ├─ If needed → Edit
  └─ If safe → Write
```

## 4. Skill Composition

### Scenario

Multiple Skills work together to complete a complex task.

### Implementation Approaches

#### Approach 1: Chained Calls

```
/generate-code → /review-code → /write-tests
```

#### Approach 2: Parent Skill Calls Child Skills

Create a parent Skill that coordinates multiple child Skills:

```json
{
  "name": "full-code-review",
  "description": "Complete code review workflow",
  "prompt": "Please execute the full code review workflow:\n\nStep 1: Static Analysis\nInvoke /analyze-static\n\nStep 2: Code Review\nInvoke /review-code\n\nStep 3: Security Check\nInvoke /check-security\n\nStep 4: Generate Report\nSummarize the above results into a review report"
}
```

#### Approach 3: Composed Skills

Combine multiple Skills into a workflow:

```json
{
  "name": "feature-development",
  "description": "Complete feature development workflow",
  "prompt": "Please assist with new feature development:\n\nPhase 1: Requirements Analysis (/analyze-requirements)\n- Understand requirements\n- Identify risks\n- Estimate effort\n\nPhase 2: Technical Design (/design-solution)\n- Architecture design\n- Interface definition\n- Data model\n\nPhase 3: Code Implementation (/generate-code)\n- Implement core logic\n- Add error handling\n- Write comments\n\nPhase 4: Code Review (/review-code)\n- Self-review\n- Fix issues\n\nPhase 5: Testing (/write-tests)\n- Unit tests\n- Integration tests\n\nPhase 6: Documentation (/generate-docs)\n- API documentation\n- Usage guide"
}
```

## 5. Context Management

### Scenario

The Skill needs to access project context information.

### Implementation

```json
{
  "name": "project-aware-review",
  "description": "Code review based on project context",
  "prompt": "Please review the following code, considering the project context:\n\nCode:\n```\n{{code}}\n```\n\nProject information:\n- Language: {{project.language}}\n- Framework: {{project.framework}}\n- Style guide: {{project.styleGuide}}\n- Architecture pattern: {{project.architecture}}\n\nReview criteria:\n1. Follows project coding standards\n2. Adheres to architecture design principles\n3. Consistent with existing code style\n4. Uses project-recommended libraries and patterns"
}
```

### Dynamic Context Loading

```json
{
  "name": "smart-test-writer",
  "description": "Generate tests based on the project's test framework",
  "prompt": "Please generate tests for the following function:\n\n```\n{{code}}\n```\n\nFirst, detect the test framework:\n- If jest.config.js exists → use Jest\n- If vitest.config.ts exists → use Vitest\n- If pytest.ini exists → use Pytest\n\nThen generate the corresponding test code"
}
```

## 6. Error Handling and Recovery

### Scenario

Errors may occur during Skill execution.

### Implementation

```json
{
  "name": "robust-refactor",
  "description": "Robust refactoring Skill with error handling",
  "prompt": "Please refactor the following code:\n\n```\n{{code}}\n```\n\nExecution steps:\n\n1. **Backup**\n   Use Write to create a .backup file\n\n2. **Refactor**\n   Attempt the refactoring\n   If it fails:\n   - Log the error\n   - Restore from backup\n   - Provide manual refactoring suggestions\n\n3. **Verify**\n   Run tests to verify the refactoring\n   If tests fail:\n   - Analyze the failure reason\n   - Fix or roll back\n   - Report results\n\n4. **Cleanup**\n   Delete the backup after success"
}
```

## 7. Advanced Examples

### Example 1: Smart Code Generator

```json
{
  "name": "smart-code-generator",
  "description": "Generate code based on requirements, automatically selecting the best implementation",
  "prompt": "Please generate code based on the following requirements:\n\nRequirements: {{requirements}}\n\nContext:\n- Programming language: {{language}}\n- Project type: {{projectType}}\n- Performance requirements: {{performanceRequirements}}\n- Compatibility requirements: {{compatibilityRequirements}}\n\nExecution flow:\n\n1. **Requirements Analysis**\n   - Identify core functionality\n   - Identify edge cases\n   - Estimate complexity\n\n2. **Technology Selection**\n   - Choose appropriate data structures\n   - Choose appropriate algorithms\n   - Choose appropriate libraries/frameworks\n\n3. **Code Generation**\n   - Implement core logic\n   - Add error handling\n   - Add logging\n   - Add performance optimizations\n\n4. **Code Optimization**\n   - Simplify complex logic\n   - Improve readability\n   - Follow best practices\n\n5. **Generate Tests**\n   - Normal case tests\n   - Edge case tests\n   - Error case tests\n\n6. **Generate Documentation**\n   - Function documentation\n   - Usage examples\n   - Important notes\n\nOutput format:\n```{{language}}\n[generated code]\n```\n\n## Design Notes\n[Explain why this implementation approach was chosen]\n\n## Complexity Analysis\n- Time complexity: O(?)\n- Space complexity: O(?)\n\n## Test Cases\n```{{language}}\n[test code]\n```",
  "examples": []
}
```

### Example 2: Adaptive Learning Assistant

```json
{
  "name": "adaptive-tutor",
  "description": "Adapt explanation depth based on user skill level",
  "prompt": "Please explain the following concept: {{concept}}\n\nUser level: {{userLevel}}\n\n{{#if userLevel === 'beginner'}}\nUse simple language, avoid jargon\nUse analogies to aid understanding\nProvide basic examples\n{{/if}}\n\n{{#if userLevel === 'intermediate'}}\nUse standard terminology\nProvide technical details\nShow practical application scenarios\n{{/if}}\n\n{{#if userLevel === 'advanced'}}\nDive into underlying principles\nDiscuss design tradeoffs\nProvide performance analysis\nReference related research\n{{/if}}",
  "examples": []
}
```

## Summary

| Advanced Pattern | Use Case | Key Technique |
|-----------------|----------|--------------|
| Conditional Logic | Different inputs, different handling | if/else logic |
| Variables | Dynamic content insertion | `{{variable}}` |
| Tool Call Chains | Complex workflows | Step-by-step decomposition |
| Skill Composition | Collaborative large tasks | Parent Skill + Child Skills |
| Context Management | Project awareness | Dynamic detection |
| Error Handling | Robust execution | try/catch patterns |

## Next Steps

Learn how to apply these advanced patterns in real projects:

→ [Practice: Code Review Skill](/guide/skills/practice)
