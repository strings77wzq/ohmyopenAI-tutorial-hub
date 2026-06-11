---
title: 实战：构建 Prompt 库
description: 动手构建一个分类、版本化、可复用的 Prompt 库，涵盖设计、测试和文档
---

# 实战：构建 Prompt 库

本节通过一个完整的实战项目，将设计模式、结构化方法和调试技巧整合成一个可维护的 Prompt 库。

## 目录结构

```text
prompt-library/
├── README.md                    ← 使用说明
├── schemas/                     ← 输出 JSON Schema
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
    ├── loader.ts               ← Prompt 加载器
    ├── runner.ts               ← 执行器
    └── evaluator.ts            ← 评测器
```

## 步骤 1：设计 Prompt 模板

### 代码审查 Prompt

```text
<!-- code-review/v1.0.md -->
<system>
<role>你是一位资深的全栈工程师，专注于代码质量和安全审查。</role>
<tone>直接、专业、有建设性。先肯定优点，再指出问题。</tone>
</system>

<context>
项目类型：{{project_type}}
技术栈：{{tech_stack}}
编码规范：{{coding_standards}}
</context>

<task>审查以下代码变更，按严重程度排列问题。</task>

<code>{{diff}}</code>

<output_format>
返回 JSON 格式：
{
  "issues": [{
    "file": "文件路径",
    "line": 行号,
    "severity": "high" | "medium" | "low",
    "category": "security" | "performance" | "style" | "logic",
    "description": "问题描述",
    "fix": "修复建议（含代码示例）"
  }],
  "score": 1-10,
  "summary": "一句话总结"
}
</output_format>

<constraints>
- 最多返回 5 个问题
- 只报告真实问题，不报告风格偏好
- 评分标准：10 = 完美，7 = 可接受，5 = 需要修改
</constraints>
```

### 文本摘要 Prompt

```text
<role>你是一位专业的技术文档编辑。</role>
<task>将以下文本压缩为结构化摘要。</task>
<input>{{text}}</input>
<output_format>
{
  "title": "摘要标题（不超过 10 字）",
  "key_points": ["要点 1", "要点 2", "要点 3"],
  "summary": "200 字以内的完整摘要"
}
</output_format>
<constraints>摘要不超过 200 字，保留关键数据，不添加原文没有的信息。</constraints>
```

## 步骤 2：编写测试用例

```yaml
# code-review/v1.0.test.yaml
test_name: Code Review v1.0 评测
model: gpt-4o
temperature: 0
runs_per_test: 3

test_cases:
  - name: SQL 注入检测
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

  - name: 输出格式验证
    input: "def add(a, b): return a + b"
    validators:
      - type: json_valid
        schema: ../schemas/review-result.schema.json

  - name: 高质量代码
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

## 步骤 3：实现加载器

```typescript
// src/loader.ts — Prompt 加载与模板替换
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

## 步骤 4：实现执行器

```typescript
// src/runner.ts — Prompt 执行与结果解析
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
  } catch { /* 解析失败 */ }

  return {
    output,
    parsed,
    tokens: { input: response.usage?.prompt_tokens ?? 0, output: response.usage?.completion_tokens ?? 0 },
    latency: Date.now() - start,
  }
}
```

## 步骤 5：运行评测

```bash
npx tsx src/evaluator.ts --prompt code-review --version v1.0

# 输出报告
# ┌─────────────────┬────────┬─────────┐
# │ Test            │ Status │ Time    │
# ├─────────────────┼────────┼─────────┤
# │ SQL 注入检测    │ ✅     │ 1.2s    │
# │ 输出格式验证    │ ✅     │ 0.8s    │
# │ 高质量代码      │ ❌     │ 1.1s    │
# └─────────────────┴────────┴─────────┘
# 通过率: 67% (2/3)
```

## 练习

1. **扩展库**：为"翻译"场景添加一个 Prompt，包含中英、中日两种语言对。
2. **添加测试**：为 `text-summary` Prompt 编写 3 个测试用例。
3. **版本迭代**：发现 `code-review` Prompt 的一个缺陷，创建 v1.1 版本并记录变更。

## 常见问题

**变量太多怎么办？** 拆分为可选变量和必选变量，为可选变量提供默认值：

```typescript
const defaultVars = { project_type: '通用', coding_standards: '通用最佳实践' }
const rendered = renderPrompt(template, { ...defaultVars, ...userVars })
```

**不同模型需要不同 Prompt？** 为每个模型维护独立版本，或在 Prompt 中添加模型适配指令。

## 下一步

最后，了解全局的最佳实践和常见反模式：

→ [最佳实践与反模式](/guide/prompt-engineering/best-practices)
