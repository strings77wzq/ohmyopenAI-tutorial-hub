# Evaluators

Evaluators are the referees of a Harness. Test scenarios define "what to test"; evaluators define "how to judge" — they automatically determine whether an AI's output meets quality standards.

## Why Automated Evaluation

You might wonder: why not just have a human review the output?

The answer is **scalability** and **consistency**. An Agent system may produce thousands of outputs per day. Human review is neither economical nor reliable at that scale. Automated evaluators provide:

- **Consistency**: Same output, same judgment — unaffected by reviewer mood, fatigue, or standard drift
- **Speed**: Millisecond-level judgments, supporting real-time regression testing
- **Traceability**: Every judgment has clear rules and rationale
- **Iterability**: Evaluation standards can be versioned, tested, and improved just like code

## Built-In Evaluators

### `contains` — Content Containment Check

Verifies that output contains specified keywords or phrases. The most basic evaluator, suitable for tutorials and explanation outputs.

```json
{
  "evaluator": "contains",
  "params": {
    "must_include": ["recursion", "Fibonacci", "function"],
    "must_exclude": ["error", "exception", "undefined"]
  }
}
```

**Use cases**: Code explanation, documentation generation, tutorial output
**Notes**: Keyword selection requires experience — too few causes missed detections, too many causes false positives

### `exact-match` — Exact Match

Verifies that output matches the expected value exactly. Only suitable for deterministic output.

```json
{
  "evaluator": "exact-match",
  "params": {
    "expected": "Hello, World!",
    "case_sensitive": true,
    "trim_whitespace": true
  }
}
```

**Use cases**: Fixed-format output, status codes, ID generation
**Notes**: Use cautiously for AI output — probabilistic systems rarely produce identical output

### `json-valid` — JSON Format Validation

Verifies that output is valid JSON. Suitable for tool calls, API responses, and other structured output.

```json
{
  "evaluator": "json-valid",
  "params": {
    "strict": true,
    "allow_comments": false
  }
}
```

**Use cases**: Tool call results, API responses, configuration file generation
**Advanced usage**: Combine with `schema-valid` to validate JSON structure

### `schema-valid` — Schema Structure Validation

Verifies that output conforms to a predefined JSON Schema. Stricter than `json-valid` — it checks not just format but also structure and types.

```json
{
  "evaluator": "schema-valid",
  "params": {
    "schema": {
      "type": "object",
      "required": ["explanation", "complexity"],
      "properties": {
        "explanation": { "type": "string", "minLength": 50 },
        "complexity": { "type": "string", "enum": ["O(1)", "O(log n)", "O(n)", "O(n²)"] }
      }
    }
  }
}
```

**Use cases**: Structured data output, scenarios requiring type and constraint validation

### `no-error` — No Error Check

Verifies that output doesn't contain error indicators. Serves as the baseline check for all scenarios.

```json
{
  "evaluator": "no-error",
  "params": {
    "error_indicators": ["error", "Error", "error", "exception", "undefined", "null", "NaN", "Traceback"]
  }
}
```

**Use cases**: Baseline check for all scenarios — regardless of how other evaluators are configured, `no-error` should always run

### `semantic-match` — Semantic Similarity

Verifies that output is semantically close to expected content. Uses vector embeddings to calculate similarity, allowing different wording with consistent meaning.

```json
{
  "evaluator": "semantic-match",
  "params": {
    "expected": "This function takes two parameters and returns their sum",
    "threshold": 0.8,
    "model": "text-embedding-3-small"
  }
}
```

**Use cases**: Natural language answers, summaries, translations
**Notes**: Thresholds need tuning per scenario — 0.75 for lenient scenarios, 0.9 for strict scenarios

### `language-check` — Language Check

Verifies that output uses the specified language.

```json
{
  "evaluator": "language-check",
  "params": {
    "expected_language": "zh-CN",
    "min_ratio": 0.7
  }
}
```

**Use cases**: Multilingual Agents, scenarios requiring Chinese output

### `custom` — Custom Evaluator

When built-in evaluators can't meet your needs, use custom functions for precise evaluation logic.

```python
def custom_evaluator(output: str, expected: dict) -> dict:
    """Custom evaluator: check if code explanation includes complexity analysis"""
    has_complexity = "O(" in output
    has_explanation = len(output) > 100
    has_structure = "##" in output or "1." in output

    return {
        "passed": has_complexity and has_explanation and has_structure,
        "score": sum([has_complexity, has_explanation, has_structure]) / 3,
        "details": {
            "has_complexity": has_complexity,
            "has_explanation": has_explanation,
            "has_structure": has_structure
        }
    }
```

## Evaluator Combination Strategies

A single evaluator is prone to false judgments. It's recommended to combine multiple evaluators for cross-validation across different dimensions:

### Basic Combination (Recommended for All Scenarios)

```json
{
  "evaluators": ["contains", "no-error"]
}
```

`contains` checks content quality; `no-error` checks basic stability. These two evaluators should appear in nearly every scenario.

### Content Quality Combination

```json
{
  "evaluators": ["contains", "no-error", "language-check"],
  "params": {
    "contains": {
      "must_include": ["function", "parameter", "return value"],
      "must_exclude": ["error"]
    },
    "language-check": {
      "expected_language": "zh-CN",
      "min_ratio": 0.8
    }
  }
}
```

### Structured Output Combination

```json
{
  "evaluators": ["json-valid", "schema-valid", "no-error"],
  "params": {
    "schema-valid": {
      "schema": { "type": "object", "required": ["result", "status"] }
    }
  }
}
```

### Strict Quality Combination

```json
{
  "evaluators": ["contains", "semantic-match", "no-error", "language-check"],
  "params": {
    "semantic-match": { "threshold": 0.85 },
    "contains": { "min_keywords": 3 }
  }
}
```

## Threshold Tuning

Thresholds are the "passing line" for evaluators. Too low causes quality shortfalls; too high causes excessive false positives.

### Tuning Principles

1. **Start lenient**: Use a lower threshold (0.7) for new scenarios to ensure baseline passes
2. **Tighten gradually**: As scenarios stabilize, gradually increase thresholds to 0.8–0.9
3. **Set per scenario**: Different output types need different thresholds
4. **Adjust based on data**: Look at actual pass/fail distributions, not gut feeling

### Threshold Reference

| Evaluator | Recommended Threshold | Notes |
|-----------|----------------------|-------|
| `semantic-match` | 0.75–0.85 | Semantic matching — too high causes false positives |
| `contains` | 2–5 keywords | Too many causes false positives; too few causes missed detections |
| `schema-valid` | Strict mode | Schema validation should be binary (pass/fail) |

## Failure Diagnosis Workflow

When an evaluator reports failure, diagnose using this process:

```
Evaluator reports failure
    │
    ▼
Check evaluation details (details field)
    │
    ├── Missing keywords → Prompt may not be explicit enough → Adjust prompt
    │
    ├── Contains error words → Model capability may be insufficient → Switch model or add fallback
    │
    ├── Semantic mismatch → Expected definition may be unreasonable → Adjust expectations or threshold
    │
    └── Format error → May be an output parsing issue → Fix parsing logic
```

### Diagnosis Checklist

When a failure occurs, check these questions:

1. **Is it a prompt issue?** — Is the expected output pattern explicitly guided in the prompt?
2. **Is it an evaluator issue?** — Are thresholds reasonable? Are keywords accurate?
3. **Is it a model issue?** — Run the same scenario with a different model; what's the result?
4. **Is it a data issue?** — Does the input contain noise that causes output deviation?

## Evaluator Evolution

Evaluators aren't static. As the Agent system evolves, evaluators should improve alongside it:

```
V1: contains + no-error (basic checks)
    ↓ Discovered format issues
V2: + json-valid (format checks)
    ↓ Discovered semantic issues
V3: + semantic-match (semantic checks)
    ↓ Discovered language issues
V4: + language-check (language checks)
    ↓ Discovered special requirements
V5: + custom (custom checks)
```

Every evaluator change should:
1. Have a clear trigger (production failure, new requirement, raised standard)
2. Have regression verification (new evaluator doesn't break already-passing scenarios)
3. Have documentation (why this evaluator was added, how the threshold was determined)

## Next Steps

Evaluators solve the "how to judge" problem. But when running tests frequently, calling the real API every time is too expensive. Next, learn how to use a Mock Server to isolate external dependencies.

→ [Mock Server](/en/guide/harness/mock-server)
