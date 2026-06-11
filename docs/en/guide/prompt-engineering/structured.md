---
title: Structured Prompts
description: Learn to organize prompts using XML tags, JSON Schema, role design, and output constraints for better controllability and consistency
---

# Structured Prompts

The core idea behind structured prompts: **use clear structure instead of verbose descriptions**. When a prompt has well-defined hierarchy and separation, the model can better understand the intent and produce consistent output.

## Why Structure Matters

```text
# ❌ Unstructured
Please review this code, check for security issues, then look at performance optimization opportunities, also verify the coding style follows standards, and if there are problems give me suggestions...

# ✅ Structured
<task>Code review</task>
<code>{{code}}</code>
<checklist>
1. Security: SQL injection, XSS, key leaks
2. Performance: N+1 queries, unnecessary loops
3. Style: naming conventions, code complexity
</checklist>
<output_format>
For each dimension: issue description, severity (high/medium/low), fix suggestion.
Then give an overall score (1-10).
</output_format>
```

## Method 1: XML Tag Separation

XML tags are the most widely used structuring method, supported by almost all major models.

```text
<role>You are a senior Python backend engineer specializing in performance optimization.</role>

<context>
The project uses FastAPI + SQLAlchemy with a PostgreSQL database.
Users report that the list endpoint has a response time exceeding 3 seconds.
</context>

<task>
Analyze the following endpoint code, identify performance bottlenecks, and provide optimization recommendations.
</task>

<code>{{code}}</code>

<output>
Use Markdown format, list issues by priority, each containing:
1. Issue description  2. Impact level  3. Fix code
</output>
```

### Nested Tags

```text
<requirements>
  <language>Python 3.11+</language>
  <framework>FastAPI</framework>
  <style>
    - Follow PEP 8
    - Use type hints
    - Functions no longer than 30 lines
  </style>
  <forbidden>
    - Do not use global variables
    - Do not use bare except: clauses
  </forbidden>
</requirements>
```

### Tag Naming Suggestions

| Scenario | Recommended Tags | Description |
| --- | --- | --- |
| Model identity | `<role>`, `<persona>` | Define the model's role |
| Background info | `<context>`, `<background>` | Provide project or domain knowledge |
| Task description | `<task>`, `<instruction>` | Clarify what to do |
| Input data | `<input>`, `<code>`, `<data>` | Content to process |
| Output requirements | `<output>`, `<format>` | Specify return structure |
| Constraints | `<constraints>`, `<rules>` | Limiting conditions |

## Method 2: JSON Schema Output Constraints

When output needs to be parsed programmatically, use JSON Schema to precisely define the output structure.

```text
Please analyze user feedback and return the result in JSON format.

Output format:
{
  "sentiment": "positive" | "negative" | "neutral",
  "confidence": 0.0-1.0,
  "topics": ["topic1", "topic2"],
  "summary": "One-sentence summary",
  "action_items": [
    {
      "priority": "high" | "medium" | "low",
      "description": "Specific action item",
      "owner": "Responsible team"
    }
  ]
}

User feedback:
{{feedback}}
```

### Schema Validator

```typescript
// schema-validator.ts — Validate LLM output against a schema
import { z } from 'zod'

const ReviewResultSchema = z.object({
  issues: z.array(z.object({
    file: z.string(),
    line: z.number(),
    severity: z.enum(['high', 'medium', 'low']),
    description: z.string(),
    fix: z.string().optional(),
  })),
  score: z.number().min(1).max(10),
  summary: z.string().max(200),
})

function parseAndValidate(rawOutput: string) {
  const jsonMatch = rawOutput.match(/```json\s*([\s\S]*?)```/)
  if (!jsonMatch) throw new Error('No JSON block found')
  const parsed = JSON.parse(jsonMatch[1])
  return ReviewResultSchema.parse(parsed)
}
```

## Method 3: Role and Message Design

```typescript
const messages = [
  {
    role: 'system',
    content: `You are a code review expert. Your review style:
- Point out issues directly, no fluff
- Provide fix code for each issue
- Sort by severity, no more than 5 major issues`
  },
  {
    role: 'user',
    content: `Please review the following PR code changes:

\`\`\`diff
${diff}
\`\`\`

Focus areas: security, performance, maintainability.`
  }
]
```

### Role Design Principles

```text
# ✅ Good role definition: specific, bounded, directional
<role>
You are a Python backend engineer with 10 years of experience.
Specializing in FastAPI and PostgreSQL performance optimization.
When reviewing code, focus on: security vulnerabilities, performance bottlenecks, code quality.
Reply style: concise and direct, with code examples.
</role>

# ❌ Bad role definition: vague, unconstrained
<role>You are an amazing all-around programmer, please review my code in the most professional way possible.</role>
```

## Method 4: Output Constraints

```text
<constraints>
- Reply no more than 200 words
- Code examples no more than 20 lines
- Describe each issue in one sentence
</constraints>

<output_format>
## Issue 1: [Title]
**Severity**: High/Medium/Low
**Location**: filename:line_number
**Description**: Issue explanation
**Fix**:
\`\`\`python
# Fixed code
\`\`\`
</output_format>

<forbidden>
- Do not modify functional logic
- Do not delete existing comments
- Do not add new dependencies
</forbidden>
```

## Combined Template

```text
<system>
<role>You are a senior full-stack engineer responsible for code review.</role>
<tone>Direct, professional, constructive.</tone>
</system>

<context>
Project: {{project_name}}
Tech stack: {{tech_stack}}
</context>

<task>Review the following code changes, focusing on security, performance, and maintainability.</task>

<code>{{diff}}</code>

<output_format>
For each issue: title, severity (🔴high/🟡medium/🟢low), location, description, fix code.
Then give an overall score (1-10) and a one-sentence summary.
</output_format>

<constraints>
- Maximum 5 issues, each no more than 3 sentences
- Fix code must be directly runnable
</constraints>
```

## Exercises

1. **XML tag rewrite**: Rewrite the following prompt using XML structure:
   ```text
   Help me translate this text to English, maintain a professional tone, don't translate proper nouns, output as JSON format with original and translated fields.
   ```

2. **Schema design**: Design a JSON Schema for "meeting minutes extraction" including: participants, agenda items, decisions, and action items.

3. **Role design**: Design a System Prompt for a "technical documentation writing assistant" that targets non-technical audiences and uses analogies to explain concepts.

## Next Steps

Structure makes prompts clearer, but you still need systematic debugging methods:

→ [Prompt Debugging and Iteration](/guide/prompt-engineering/debugging)
