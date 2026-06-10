# Evaluation & Quality

The goal of evaluation is not to assign an abstract score to AI output — it's to determine whether the output meets **shippable acceptance criteria**.

## Why Structured Evaluation?

Single-dimension evaluation ("code quality score: 7/10") tells you nothing actionable. Four-layer evaluation gives you specific, fixable failure signals at every stage of the development workflow.

## The Four Evaluation Levels

```
┌─────────────────────────────────────────────────────────┐
│ L1 Unit Check — "Did this one input produce correct output?" │
│ Tools: fixtures, snapshots, assertions                    │
│ Frequency: after every tool call                           │
│ Feedback latency: seconds                                  │
├─────────────────────────────────────────────────────────┤
│ L2 Scenario Check — "Does a complete workflow work end-to-end?" │
│ Tools: Harness scenarios, traces, e2e tests               │
│ Frequency: after each sub-task                             │
│ Feedback latency: minutes                                  │
├─────────────────────────────────────────────────────────┤
│ L3 Regression Check — "Did this change break existing behavior?" │
│ Tools: test suites, link audits, snapshot diffs            │
│ Frequency: before each PR                                  │
│ Feedback latency: minutes to hours                         │
├─────────────────────────────────────────────────────────┤
│ L4 Release Gate — "Is this change ready for public release?" │
│ Tools: build verification, a11y audit, perf test, content review │
│ Frequency: before each release                             │
│ Feedback latency: minutes to hours                         │
└─────────────────────────────────────────────────────────┘
```

## Module Content

| Chapter | Content |
|---------|---------|
| [Evaluation Levels](/guide/evaluation/levels) | Deep dive into the four levels: what to check, with what tools, at what frequency |
| [Evaluator Design](/guide/evaluation/evaluator-design) | Five principles: single-criterion, failure reasons, boundary inputs, alignment, stability |
| [Regression Suite](/guide/evaluation/regression-suite) | Organizing evaluators into fast/standard/full gates; golden dataset management; drift detection |
| [Release Gate](/guide/evaluation/release-gate) | Turning evaluations into a go/no-go decision; automated vs manual gates; rollback criteria |

> **Language note**: Detailed sub-pages are currently in [Chinese (简体中文)](/guide/evaluation/). English translations are planned.

## Quality Gates for This Site

Every change to this documentation site must pass:

```bash
npm run docs:build         # VitePress build — zero errors, zero warnings
npm run docs:check-links   # AST-parsed link audit — 121+ pages, zero dead links
npm run docs:check-routes  # Sidebar route verification — all entries reachable
npm run docs:check-frontmatter  # All pages have structured titles
```

Plus manual checks: homepage clarity, mobile overflow, bilingual nav completeness, new page quality.

## Practice

For a PR "add a new MCP tutorial page", write 5 acceptance criteria and turn 2 of them into automated checks.

## Next Step

Start with [Evaluation Levels](/guide/evaluation/levels) (Chinese) to understand what each layer checks.
