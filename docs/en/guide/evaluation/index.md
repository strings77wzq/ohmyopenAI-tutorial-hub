# Evaluation and Quality

Evaluation should not produce an abstract score. It should decide whether the output meets release-ready acceptance criteria.

## Evaluation layers

| Layer | Question | Evidence |
| --- | --- | --- |
| Single case | Did one input produce the right output? | Fixture, snapshot, assertion |
| Scenario | Did a workflow complete? | Harness scenario, trace |
| Regression | Did old behavior break? | Test suite, link audit |
| Release | Is this ready for public users? | Build, accessibility, content review |

## Evaluator design

A good evaluator:

- Checks one clear standard.
- Explains failure reasons.
- Handles boundary input.
- Matches human acceptance criteria.
- Stays stable across model or prompt changes.

## Documentation quality gates

This project should run at least:

```bash
npm run docs:build
npm run docs:check-links
```

Manual checks:

- Homepage first screen is clear.
- Mobile layout does not overflow.
- Chinese and English navigation is complete.
- New pages include concepts, steps, practice, troubleshooting, and next links.

## Practice

Write 5 acceptance criteria for a new MCP tutorial page and turn 2 of them into automated checks.

Next: [Deployment and Safety](/en/guide/deployment/).
