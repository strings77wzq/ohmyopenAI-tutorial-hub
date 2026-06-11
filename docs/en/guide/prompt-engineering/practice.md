---
title: "Hands-On: Building a Prompt Library"
description: Build a categorized, versioned, reusable prompt library covering design, testing, and documentation
---

# Hands-On: Building a Prompt Library

This section brings together design patterns, structured methods, and debugging techniques into a maintainable prompt library through a complete hands-on project.

## Directory Structure

```text
prompt-library/
├── README.md                    ← Usage instructions
├── schemas/                     ← Output JSON Schemas
│   └── review-result.schema.json
├── code-review/
│   ├── v1.0.md
│   ├── v1.0.test.yaml
│   └── CHANGELOG.md
├── text-summary/
│   ├── v1.0.md
│   ├── v1.0.test.yaml
│   └── CHANGELOG.md
└── src/
    ├── loader.ts               ← Prompt loader
    ├── runner.ts               ← Executor
    └── evaluator.ts            ← Evaluator
```

## Step 1: Design Prompt Templates

### Code Review Prompt

```text
<!-- code-review/v1.0.md -->
<system>
<role>You are a senior full-stack engineer specializing in code quality and security review.</role>
<tone>Direct, professional, constructive. Acknowledge strengths first, then point out issues.</tone>
</system>

<context>
Project type: {{project_type}}
Tech stack: {{tech_stack}}
Coding standards: {{coding_standards}}
</context>

<task>Review the following code changes, listing issues by severity.</task>

<code>{{diff}}</code>

<output_format>
Return in JSON format:
{
  "issues": [{
    "file": "File path",
    "line": Line number,
    "severity": "high" | "medium" | "low",
    "category": "security" | "performance" | "style" | "logic",
    "description": "Issue description",
    "fix": "Fix suggestion (with code example)"
  }],
  "score": 1-10,
  "summary": "One-sentence summary"
}
</output_format>

<constraints>
- Return at most 5 issues
- Only report real issues, not style preferences
- Scoring: 10 = perfect, 7 = acceptable, 5 = needs changes
</constraints>
```

### Text Summary Prompt

```text
<role>You are a professional technical documentation editor.</role>
<task>Compress the following text into a structured summary.</task>
<input>{{text}}</input>
<output_format>
{
  "title": "Summary title (no more than 10 characters)",
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "summary": "Complete summary within 200 words"
}
</output_format>
<constraints>Summary no more than 200 words. Preserve key data. Do not add information not in the original text.</constraints>
```

## Step 2: Write Test Cases

```yaml
# code-review/v1.0.test.yaml
test_name: Code Review v1.0 Evaluation
model: gpt-4o
temperature: 0
runs_per_test: 3

test_cases:
  - name: SQL injection detection
    input: |
      def get_user(user_id):
          query = f"SELECT * FROM users WHERE id = {user_id}"
          return db.execute(query)
    validators:
      - type: json_valid
        schema: ../schemas/review-result.schema.json
      - type: field_contains
        field: "issues[*].category"
        value: "security"

  - name: Output format validation
    input: "def add(a, b): return a + b"
    validators:
      - type: json_valid
        schema: ../schemas/review-result.schema.json

  - name: High-quality code
    input: |
      def hash_password(password: str, salt: Optional[bytes] = None) -> tuple[bytes, bytes]:
          if salt is None:
              salt = hashlib.token_bytes(16)
          hashed = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100_000)
          return hashed, salt
    validators:
      - type: min_score
        value: 7
```

## Step 3: Implement the Loader

```typescript
// src/loader.ts — Prompt loading and template substitution
import fs from 'node:fs'
import path from 'node:path'

function loadPrompt(name: string, version: string) {
  const baseDir = path.join(process.cwd(), 'prompt-library', name)
  const templatePath = path.join(baseDir, `${version}.md`)
  const template = fs.readFileSync(templatePath, 'utf8')
  return { name, version, template }
}

function renderPrompt(template: string, vars: Record<string, string>): string {
  let rendered = template
  for (const [key, value] of Object.entries(vars)) {
    rendered = rendered.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
  }
  return rendered
}
```

## Step 4: Implement the Executor

```typescript
// src/runner.ts — Prompt execution and result parsing
import OpenAI from 'openai'
import { loadPrompt, renderPrompt } from './loader'

const client = new OpenAI()

async function runPrompt(
  promptName: string,
  version: string,
  variables: Record<string, string>,
  options: { model?: string; temperature?: number } = {}
) {
  const config = loadPrompt(promptName, version)
  const rendered = renderPrompt(config.template, variables)

  const start = Date.now()
  const response = await client.chat.completions.create({
    model: options.model ?? 'gpt-4o',
    temperature: options.temperature ?? 0,
    messages: [{ role: 'user', content: rendered }],
  })

  const output = response.choices[0].message.content ?? ''
  let parsed: object | undefined
  try {
    const jsonMatch = output.match(/```json\s*([\s\S]*?)```/)
    parsed = JSON.parse(jsonMatch ? jsonMatch[1] : output)
  } catch { /* Parse failed */ }

  return {
    output,
    parsed,
    tokens: { input: response.usage?.prompt_tokens ?? 0, output: response.usage?.completion_tokens ?? 0 },
    latency: Date.now() - start,
  }
}
```

## Step 5: Run Evaluation

```bash
npx tsx src/evaluator.ts --prompt code-review --version v1.0

# Output report
# ┌─────────────────┬────────┬─────────┐
# │ Test            │ Status │ Time    │
# ├─────────────────┼────────┼─────────┤
# │ SQL injection   │ ✅     │ 1.2s    │
# │ Format check    │ ✅     │ 0.8s    │
# │ High-quality    │ ❌     │ 1.1s    │
# └─────────────────┴────────┴─────────┘
# Pass rate: 67% (2/3)
```

## Exercises

1. **Extend the library**: Add a "translation" prompt supporting Chinese-English and Chinese-Japanese language pairs.
2. **Add tests**: Write 3 test cases for the `text-summary` prompt.
3. **Version iteration**: Discover a flaw in the `code-review` prompt, create a v1.1 version, and record the changes.

## FAQ

**Too many variables?** Split into optional and required variables, providing defaults for optional ones:

```typescript
const defaultVars = { project_type: 'general', coding_standards: 'general best practices' }
const rendered = renderPrompt(template, { ...defaultVars, ...userVars })
```

**Different models need different prompts?** Maintain separate versions per model, or add model-specific adaptation instructions in the prompt.

## Next Steps

Finally, review the overarching best practices and common anti-patterns:

→ [Best Practices and Anti-Patterns](/guide/prompt-engineering/best-practices)
