# Harness Best Practices

These guidelines come from real-world experience building Agent systems in production. Following them helps you avoid common pitfalls and build a sustainably evolvable Harness.

## 1. Keep Scenarios Small and Focused

**Principle**: Each scenario verifies one core behavior. Avoid "one failure brings down everything."

```json
// ❌ Bad: one scenario verifying too many things
{
  "name": "comprehensive code analysis test",
  "expected": {
    "contains": ["function description", "parameter description", "complexity analysis", "improvement suggestions", "test cases"]
  }
}

// ✅ Good: split into independent scenarios
{ "name": "code function explanation", "expected": { "contains": ["function description"] } }
{ "name": "parameter description", "expected": { "contains": ["parameter description"] } }
{ "name": "complexity analysis", "expected": { "contains": ["complexity"] } }
```

**Why it matters**:
- Faster problem location: failures point directly to specific capabilities
- Smaller fix impact: changing one scenario won't break other tests
- Clearer results: pass rates accurately reflect each capability's status

## 2. Combine Evaluators

**Principle**: Don't use a single evaluator alone. The `contains + no-error + json-valid` combination is recommended.

```
┌─────────────────────────────────────────┐
│           Evaluator Combination Strategy │
├─────────────────────────────────────────┤
│  Base layer: no-error (required for all) │
│  Content layer: contains (keyword check) │
│  Format layer: json-valid or schema-valid │
│  Semantic layer: semantic-match (high quality) │
│  Language layer: language-check (multilingual) │
└─────────────────────────────────────────┘
```

**Why `contains` alone isn't enough**:
- `contains` checks "did it say the right thing" but not "did it say something wrong"
- An output may contain all keywords but also include large amounts of error information
- `no-error` is the lowest-cost quality assurance — never skip it

## 3. Mock First, Real Verification as Backup

**Principle**: Use Mocks for daily regression; real API only for smoke testing.

```
CI/CD Pipeline Layers:

┌─────────────────────────────────────┐
│  Layer 1: Mock Regression (100%)     │
│  - Runtime: <1 minute               │
│  - Cost: $0                         │
│  - Frequency: every commit          │
├─────────────────────────────────────┤
│  Layer 2: Real API Smoke (10%)       │
│  - Runtime: ~5 minutes              │
│  - Cost: ~$0.50/run                 │
│  - Frequency: every merge to main   │
├─────────────────────────────────────┤
│  Layer 3: Real API Full (100%)       │
│  - Runtime: ~30 minutes             │
│  - Cost: ~$5/run                    │
│  - Frequency: weekly or pre-release │
└─────────────────────────────────────┘
```

**Why this layering works**:
- Layer 1 ensures basic functionality doesn't regress (fast feedback)
- Layer 2 ensures Mocks match real behavior (prevents stale Mocks)
- Layer 3 ensures full quality (release confidence)

## 4. Track Metrics

**Principle**: At minimum, track three core metrics — pass rate, average latency, and top 3 regression failure reasons.

### Pass Rate Tracking

```
Date        Total  Passed  Pass Rate  Change
2024-01-10  100    95      95.0%      -
2024-01-11  100    93      93.0%      ↓ 2.0%
2024-01-12  102    98      96.1%      ↑ 3.1%
2024-01-13  102    97      95.1%      ↓ 1.0%
```

### Latency Tracking

```
Scenario Type         P50     P90     P99     Target
Simple function       0.8s    1.2s    2.0s    <2s
Recursive function    1.1s    1.8s    3.0s    <3s
Long code             2.5s    4.0s    8.0s    <5s
```

### Failure Cause Analysis

```
Top 3 failure reasons (this week):
1. Missing keyword "complexity" - 15 failures - Suggestion: explicitly request in prompt
2. Timeout (>30s) - 8 failures - Suggestion: optimize long code truncation logic
3. Mixed language (Chinese/English) - 5 failures - Suggestion: emphasize Chinese output in prompt
```

## 5. Make Failures Diagnosable

**Principle**: Every failure preserves full context — input, model output, evaluator details, and environment information.

### Failure Record Template

```json
{
  "failure_id": "20240115-143000-explain-code",
  "timestamp": "2024-01-15T14:30:00Z",
  "scenario": "explain recursive function",
  "input": {
    "skill": "explain-code",
    "code": "function fib(n){return n<=1?n:fib(n-1)+fib(n-2)}"
  },
  "output": "This is a recursive function...",
  "evaluators": {
    "contains": {
      "passed": false,
      "missing": ["recursion", "Fibonacci"],
      "found": ["recursive", "function"]
    },
    "no-error": { "passed": true },
    "language-check": {
      "passed": false,
      "detected": "en",
      "expected": "zh-CN"
    }
  },
  "environment": {
    "model": "gpt-4",
    "mock": true,
    "harness_version": "1.2.0"
  }
}
```

### Diagnosis Decision Tree

```
Evaluator reports failure
    │
    ▼
Check details field
    │
    ├── Missing keywords → Did the prompt explicitly guide these?
    │       ├── Yes → Model capability insufficient, consider switching models
    │       └── No → Adjust prompt, make requirements explicit
    │
    ├── Language error → Did the prompt specify output language?
    │       ├── Yes → Model didn't follow instructions, consider adding language-check evaluator
    │       └── No → Add language requirements to the prompt
    │
    ├── Format error → Is the output parsing logic correct?
    │       ├── Yes → Mock data inconsistent with real behavior, update Mock
    │       └── No → Fix parsing logic
    │
    └── Timeout → Is the code too long?
            ├── Yes → Implement code truncation or chunked processing
            └── No → Check network and API latency
```

## 6. Scenarios Are Documentation

**Principle**: Good test scenarios are themselves the best documentation — they precisely describe what the Agent should do.

```json
{
  "name": "recursive function explanation must cover recursive call process",
  "description": "When the user inputs a recursive function, the Agent should:\n1. Identify it as a recursive function\n2. Explain the recursive call process\n3. Describe the base case and recursive case\n4. Analyze time complexity",
  "input": {
    "skill": "explain-code",
    "code": "function factorial(n) { return n <= 1 ? 1 : n * factorial(n-1); }"
  },
  "expected": {
    "contains": ["recursion", "factorial", "base case", "call process"],
    "evaluators": ["contains", "no-error"]
  }
}
```

This scenario simultaneously answers three questions:
1. **Requirements**: What should a recursive function explanation contain
2. **Verification**: How to confirm the Agent did it right
3. **Example**: What the concrete input/output looks like

## 7. Build Incrementally

**Principle**: Don't try to build a perfect Harness at once. Start with the minimum viable set and expand gradually.

```
Phase 1: Minimum Viable (1-2 days)
├── 5 core scenarios
├── contains + no-error evaluators
├── Basic Mock configuration
└── Simple reports

Phase 2: Basic Coverage (1 week)
├── 20+ scenarios covering happy/boundary/error paths
├── Add json-valid, language-check
├── Complete Mock data
└── CI/CD integration

Phase 3: Production Ready (2-4 weeks)
├── 50+ scenarios for comprehensive coverage
├── Custom evaluators
├── Real API smoke tests
├── Metric tracking and trend analysis
└── Feedback loop integration
```

## Common Mistakes

### Mistake 1: Scenarios Too Vague

```json
// ❌ Too vague: can't pinpoint specific issues
{ "name": "code analysis test", "expected": { "contains": ["analysis result"] } }

// ✅ Specific: failure points directly to the problem
{ "name": "bubble sort explanation must include time complexity O(n²)", "expected": { "contains": ["O(n²)", "time complexity"] } }
```

### Mistake 2: Only Looking at Pass Rate

A 95% pass rate doesn't mean there are no problems. If all 5 failures are concentrated in one capability, that capability has a serious defect.

**Correct approach**: Analyze pass rates by capability dimension, not just the overall number.

### Mistake 3: Unreasonable Evaluator Thresholds

Too high (>0.95): excessive false positives, team exhausted dealing with them
Too low (<0.6): misses real quality issues

**Correct approach**: Start at 0.75 and adjust based on actual pass/fail distributions.

### Mistake 4: Mock Data Not Updated for Too Long

If Mock data hasn't been verified against the real API for over a month, it's likely stale.

**Correct approach**: Run a full test with the real API monthly, comparing Mock and real results.

### Mistake 5: Ignoring Failed Scenarios

Only fixing code after test failures without converting failures into new test scenarios.

**Correct approach**: Every production failure should become a new test scenario, ensuring the same problem doesn't happen again.

## Next Steps

The Harness isn't a static checking tool — it needs continuous feedback and improvement. Next, learn how to design feedback loops.

→ [Feedback Loop](/en/guide/harness/feedback-loop)
