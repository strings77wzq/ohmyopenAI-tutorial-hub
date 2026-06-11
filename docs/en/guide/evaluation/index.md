# Evaluation and Quality

The goal of evaluation is not to assign an abstract score to AI output, but to determine whether it meets publishable acceptance criteria.

## Evaluation Levels

| Level | Question | Common Evidence |
| --- | --- | --- |
| Unit Check | Does a single input produce the correct output? | Fixture, snapshot, assertion |
| Scenario Check | Is a complete workflow end-to-end? | Harness scenario, trace |
| Regression Check | Has existing behavior been broken? | Test suite, link audit |
| Release Check | Is it ready for public release? | Build, accessibility, content review |

## Evaluator Design

A good evaluator should:

- Assess exactly one clear criterion.
- Explain the reason for failure, not just a score.
- Handle edge-case inputs.
- Align with human acceptance criteria.
- Remain stable across model or prompt changes.

## Documentation Site Quality Gates

Publishing documentation in this project requires at minimum:

```bash
npm run docs:build
npm run docs:check-links
```

Manual checks are also needed:

- Whether the homepage hero section is clear.
- Whether there is horizontal overflow on mobile.
- Whether the Chinese and English navigation are both complete.
- Whether new pages include concepts, steps, exercises, troubleshooting, and next steps.

## Exercise

Write five acceptance criteria for a PR that adds a new MCP tutorial page, then convert two of them into automated checks.

Next: read [Deployment and Security](/guide/deployment/).
