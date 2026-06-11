---
title: Prompt Debugging and Iteration
description: "Build a debugging workflow for prompts: identify common failure modes, A/B testing, version control, and automated evaluation"
---

# Prompt Debugging and Iteration

Prompt debugging isn't about "tweaking wording and seeing what happens" — it's a systematic process of identifying problems, validating hypotheses, and recording changes.

## Common Failure Modes

### 1. Output Format Mismatch

The model returns plain text instead of the expected structured format.

**Fix**: Explicitly specify the output format and use Few-shot examples to demonstrate the expected structure.

```text
Please analyze the code and return JSON in the following format:
{
  "issues": [{"severity": "high", "description": "..."}],
  "score": 7
}
```

### 2. Hallucination

The model generates non-existent APIs, fabricated data, or incorrect facts.

**Fix**: Provide context in the prompt and restrict the model to only use the given information.

```text
<context>
Here is the project's API documentation: {{api_docs}}
</context>
<task>
Only use APIs defined in the documentation above.
If no relevant API exists, explicitly state "Not found in documentation."
Do not guess or fabricate API names.
</task>
```

### 3. Instructions Ignored

The model fails to execute a specific requirement in the prompt.

**Fix**: Place important instructions at the **beginning and end** of the prompt (primacy/recency effect), use `<important>` tags for emphasis, and reduce the total number of instructions.

### 4. Output Too Verbose or Too Short

**Fix**: Use `<constraints>` tags to specify length limits explicitly.

### 5. Role-Task Conflict

**Fix**: Ensure the role definition matches the task, or override the role in the Task section.

## A/B Testing Methodology

### Basic Workflow

```text
1. Define a baseline (Prompt A)
2. Change one variable (Prompt B)
3. Test both versions with the same input (at least 10 runs)
4. Compare output quality
5. Keep the better version
```

### Variable Control Principles

Change only one variable at a time:

| Variable Type | Example Change | Impact Dimension |
| --- | --- | --- |
| Structure | Add XML tags | Output format |
| Role | Change role description | Output style |
| Constraints | Add length limits | Output length |
| Examples | Add/modify Few-shot | Output quality |
| Model | Switch GPT-4o → Claude | Overall capability |

## Version Control

### File Naming Convention

```text
prompts/
  code-review/
    v1.0.md              ← initial version
    v1.1.md              ← minor change (format fix)
    v2.0.md              ← major change (pattern switch)
    v1.0.test.yaml       ← corresponding test cases
    CHANGELOG.md         ← change log
```

### Changelog Format

```markdown
## v2.0 (2026-06-10)
- Switched from Zero-shot to Few-shot + CoT pattern
- Changed output format from plain text to JSON
- **Impact**: Format compliance rate improved from 60% to 95%

## v1.0 (2026-06-01)
- Initial version
```

## Automated Evaluation

### Evaluation Test Case Design

```yaml
# code-review/v2.0.test.yaml
test_name: Code Review Prompt v2.0 Evaluation
model: gpt-4o
temperature: 0

test_cases:
  - name: SQL injection detection
    input: |
      def get_user(id):
          query = f"SELECT * FROM users WHERE id = {id}"
          return db.execute(query)
    validators:
      - type: contains
        value: "SQL"
      - type: json_valid
        schema: review-output-schema.json

  - name: Output format validation
    input: "def add(a,b): return a+b"
    validators:
      - type: json_valid
        schema: review-output-schema.json
```

### Evaluation Script

```typescript
import fs from 'node:fs'
import yaml from 'yaml'

async function evalPrompt(promptPath: string, testPath: string) {
  const prompt = fs.readFileSync(promptPath, 'utf8')
  const testFile = yaml.parse(fs.readFileSync(testPath, 'utf8'))
  let passed = 0, total = 0

  for (const tc of testFile.test_cases) {
    total++
    const output = await callLLM(prompt, tc.input)
    if (validate(output, tc.validators)) passed++
  }

  console.log(`Pass rate: ${(passed / total * 100).toFixed(1)}%`)
}
```

### Evaluation Metrics

| Metric | Target |
| --- | --- |
| Format compliance rate | > 95% |
| Task completion rate | > 90% |
| Average latency | < 5s |

## Debugging Checklist

When prompt output is unsatisfactory, troubleshoot in this order:

1. **Format issues?** → Check whether output format is specified and Few-shot examples are provided.
2. **Missing content?** → Check whether instructions are placed at the beginning/end and aren't buried in the middle.
3. **Hallucination?** → Check whether sufficient context is provided and source citation is required.
4. **Instability?** → Check whether Self-consistency is used and temperature is lowered.
5. **Too long/short?** → Check whether explicit length constraints exist.
6. **Role conflict?** → Check whether role definition matches the task.

## Exercises

1. Given a prompt with unstable output format, use the methods in this section to diagnose and fix it.
2. Write 3 test cases for one prompt in your prompt library.
3. Design a simple A/B test comparing Zero-shot vs Few-shot on the same task.

## Next Steps

After mastering debugging methods, build a complete prompt library:

→ [Hands-On: Building a Prompt Library](/guide/prompt-engineering/practice)
