# Harness Best Practices

## 1. Keep Scenarios Small and Focused

Each scenario should verify only one capability. Avoid "one failure cascades everywhere."

## 2. Combine Evaluators

Don't rely on a single evaluator. The recommended combination is `contains + no-error + json-valid`.

## 3. Mock First

Use Mocks for daily regression runs; reserve real APIs for smoke tests only.

## 4. Track Metrics

At minimum, track three things:

- Pass rate
- Average latency
- Top 3 regression failure causes

## 5. Make Failures Diagnosable

Every failure should preserve: input, model output, evaluator details, and environment information.

## Common Mistakes

- Scenarios written too broadly, making it impossible to pinpoint issues
- Only looking at pass rate without examining failure distribution
- Evaluator thresholds set too high or too low
