# Harness Introduction

Harness is testing infrastructure for AI outputs.

It helps with:

- repeatability
- quality evaluation
- lower testing cost with mocks

Harness Engineering is the quality system around AI workflows. It combines scenarios, fixtures, mock servers, evaluators, traces, regression suites, and failure triage so changes to prompts, tools, models, or code can be verified before release.

## Core pieces

| Piece | Purpose |
| --- | --- |
| Scenario | Defines input, expectation, and acceptance criteria |
| Fixture | Keeps stable inputs for regression runs |
| Mock server | Replays downstream success, failure, timeout, and empty data |
| Evaluator | Checks one quality standard and explains failures |
| Trace | Records context, tool calls, and model output |
| Failure triage | Separates prompt failures, tool failures, regressions, and flaky behavior |

## Harness architecture checklist

- Each scenario has input, expectation, and failure explanation.
- Mock servers cover success, failure, timeout, and empty data.
- Evaluators check one clear standard at a time.
- Fixtures cover normal, boundary, and adversarial inputs.
- Traces make context, tool calls, and model output inspectable.
- Regression suites run before publishing.

Next: [Writing Test Scenarios](/en/guide/harness/writing-tests) or [Evaluation and Quality](/en/guide/evaluation/).
