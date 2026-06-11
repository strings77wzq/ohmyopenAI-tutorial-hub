# Evaluator Design

## Concept

An evaluator is a program that converts acceptance criteria into automatically executable checks. A good evaluator is not a "scorer" but a "decision-support tool" — it tells you **the specific reason for failure** so you (or the Agent) know what to fix.

## Why Is Evaluator Design Hard?

Most evaluator failures are not due to logic errors, but because **the acceptance criteria themselves are unclear**. If you can't articulate what "good" looks like, you can't write code that judges "good."

## Five Principles of Evaluator Design

### Principle 1: Single Criterion

One evaluator assesses exactly one clear criterion. If an evaluator checks both "format is correct" and "content is accurate" at the same time, a failure won't tell you whether it's a format issue or a content issue.

```
✗ Bad evaluator: "Check documentation quality"
   → Fail. Reason unknown.

✓ Good evaluator: "Check that all internal links return 200"
   → Fail. 3 links returned 404: /guide/old-page, ...
```

### Principle 2: Failures Must Have Reasons

Evaluator output format:

```json
{
  "criterion": "All internal links return 2xx",
  "status": "FAIL",
  "failures": [
    {
      "file": "docs/guide/skills/index.md",
      "line": 47,
      "link": "/guide/old-reference",
      "status_code": 404,
      "suggestion": "Page does not exist. Possible correct path: /guide/skills/reference"
    }
  ]
}
```

Not:

```json
{
  "score": 0.7,
  "status": "FAIL"
}
```

### Principle 3: Handle Edge-Case Inputs

A good evaluator won't crash on edge-case inputs:

| Edge Input | Expected Behavior |
|------------|-------------------|
| Empty file | Report "no links to check," don't error |
| Pure English page | Check normally (don't fail for missing Chinese) |
| Very large file (>500 lines) | Process normally, don't time out |
| Page with only external links | Skip internal link checks |
| Links with special characters | Parse correctly, don't crash |

### Principle 4: Align with Human Acceptance Criteria

The evaluator's pass conditions should match human judgment:

```
Human acceptance criterion: "All sidebar links lead to the correct pages"
Evaluator implementation: Traverse sidebar config → HEAD request each → check for 2xx
→ Aligned ✓
```

Misaligned example:

```
Human acceptance criterion: "Page content is accurate and up to date"
Evaluator implementation: Check that lastUpdated field is non-empty
→ Not aligned ✗ (lastUpdated non-empty ≠ content is accurate)
```

### Principle 5: Stable Across Model and Prompt Changes

A good evaluator should not break just because the Agent switches models or the prompt is reworded. Rule-based evaluators (parsing output structure, checking link status) are more stable than LLM-as-judge approaches.

```
Stable (rule-based):
  node scripts/check-doc-links.mjs
  → Parses HTML/markdown, extracts links, HEAD requests to verify status codes
  → Unaffected by Agent model changes

Unstable (LLM-as-judge):
  "Please rate this page's quality on a scale of 1-10"
  → Model changes → score distribution shifts → thresholds become invalid
```

## Evaluator Calibration

If your evaluator uses LLM judgment (LLM-as-judge), calibration is needed:

```
Golden Set: 10 known "good" pages + 10 known "bad" pages

Evaluator runs on the Golden Set:
  - Pass rate for "good" pages: should be ≥ 95% (should not false-positive)
  - Detection rate for "bad" pages: should be ≥ 90% (should not false-negative)

If pass rate is too low:
  → Threshold is too strict — raise it slightly

If detection rate is too low:
  → Threshold is too loose, or evaluator criteria are wrong — lower it or rewrite
```

## Example: Designing an Evaluator for "Check Whether a Page Has an Exercise Section"

```
Acceptance criterion: Every tutorial page must contain an "Exercise" section

Evaluator implementation:
  1. Read the page's markdown source
  2. Look for ## Exercise or ## 练习 headings
  3. If found → check whether there are ≥ 50 characters of non-heading content below it
  4. If ≥ 50 characters → PASS
  5. If heading doesn't exist or content is insufficient → FAIL

Edge inputs:
  - Non-tutorial pages (e.g., examples/) → skip (not in scope)
  - Page language is English → match both ## Exercise and ## 练习

Output:
  {
    "criterion": "Every tutorial page contains an exercise section",
    "status": "FAIL",
    "file": "docs/guide/context/compression.md",
    "reason": "## 练习 heading exists but content is only 12 characters (< 50)",
    "suggestion": "Exercise section needs at least a complete problem statement or hands-on task"
  }
```

## Exercise

Design an evaluator for the requirement "check whether every new page has a next-step link":

1. What is the evaluator's input?
2. How do you determine "has a next-step link"? (Specific matching rules)
3. Which pages should be skipped? (Non-tutorial pages, homepage, etc.)
4. What are the edge inputs? How should they be handled?

## Troubleshooting

| Symptom | Possible Cause | Fix |
|---------|---------------|-----|
| Evaluator reports FAIL on obviously correct output | Rules too strict or legitimate variant formats not handled | Check edge inputs, relax matching rules |
| Evaluator reports PASS on obviously incorrect output | Rules too loose or error type not covered | Add new check conditions |
| Evaluator passes in CI but manual review finds issues | Acceptance criteria and evaluator implementation are misaligned | Re-read the human acceptance criteria, rewrite the evaluator |
| LLM-as-judge completely fails on a new model | New model's score distribution differs from the old model | Re-calibrate the golden set on the new model |

## Next Steps

Once individual evaluators are working, read about the [Regression Suite](./regression-suite) — how to organize multiple evaluators into a maintainable test suite.
