# Evaluation Levels

## Concept

The goal of evaluation is not to "assign an abstract score to AI output," but to **determine whether it meets publishable acceptance criteria**. Different levels of evaluation answer different questions and correspond to different tools and evidence types.

## Why Do We Need Layers?

Single-layer evaluation has two fatal flaws:

1. **Granularity mismatch**: A single "code quality score" cannot tell you whether the problem is "wrong API signature" or "non-standard variable naming."
2. **Feedback delay**: If you only run a full evaluation at the end, the Agent may have wasted many iterations heading in the wrong direction.

The four-layer evaluation model gives the Agent appropriately scoped feedback after every operation.

## The Four-Layer Model

```
┌─────────────────────────────────────────────────────────┐
│ L1 Unit Check                                            │
│ Question: Did this one input produce the correct output? │
│ Tools: fixture, snapshot, assertion                      │
│ Frequency: after every tool call                         │
│ Feedback latency: seconds                                │
│ Example: "Did this API call return 200 or 404?"         │
├─────────────────────────────────────────────────────────┤
│ L2 Scenario Check                                        │
│ Question: Is a complete workflow correct end-to-end?     │
│ Tools: Harness scenario, trace, e2e test                │
│ Frequency: after each subtask completes                  │
│ Feedback latency: minutes                                │
│ Example: "Create PR → run CI → deploy preview →         │
│           link check — entire flow correct?"             │
├─────────────────────────────────────────────────────────┤
│ L3 Regression Check                                      │
│ Question: Has existing behavior been broken by this      │
│           change?                                        │
│ Tools: test suite, link audit, snapshot diff             │
│ Frequency: before every PR submission                    │
│ Feedback latency: minutes to hours                       │
│ Example: "Did the new page break links on existing       │
│           pages?"                                        │
├─────────────────────────────────────────────────────────┤
│ L4 Release Gate                                          │
│ Question: Is this change ready for public release?       │
│ Tools: build verification, accessibility audit,          │
│        performance test, content review                  │
│ Frequency: before each release                           │
│ Feedback latency: minutes to hours                       │
│ Example: "Lighthouse a11y ≥ 95? No mobile overflow?     │
│           Dark mode works correctly?"                    │
└─────────────────────────────────────────────────────────┘
```

## Detailed Design per Layer

### L1 Unit Check

This is the fastest, cheapest evaluation layer. After every tool call, the Agent should answer two questions:

```
1. Does the return value match the expected format? (structural check)
2. Is the return value within a reasonable range? (semantic check)
```

Example:

```
Agent call: write_file("src/auth.ts", content)
  L1 structural check: Was the file written successfully? (write_file returns success → PASS)
  L1 semantic check: Is the file length reasonable? (expected ~50 lines, actual 48 → PASS)
                     Is the file length reasonable? (expected ~50 lines, actual 3 → FAIL — likely truncated content)

Agent call: npm run docs:build
  L1 structural check: Did the command succeed? (exit code 0 → PASS)
  L1 semantic check: Is the build time abnormal? (usually 6s, actual 6.2s → PASS)
                     Is the build time abnormal? (usually 6s, actual 45s → FAIL — possible infinite loop or recursion)
```

### L2 Scenario Check

A scenario = a single user-perceivable complete workflow. Scenario checks verify not individual operations, but combinations of operations.

```
Scenario: "User adds a new MCP tutorial page"

Steps:
  1. Create docs/guide/mcp/new-page.md
  2. Register in the sidebar of docs/.vitepress/config.ts
  3. npm run docs:build

L2 checks:
  [ ] New page is accessible in the built dist/
  [ ] Sidebar contains the new entry
  [ ] Inter-page links (prev/next) are correct
  [ ] No new build warnings introduced
```

### L3 Regression Check

The core of regression checking is "before/after comparison":

```
Before PR:
  npm run docs:check-links → 0 errors
  npm run docs:build → 6.2s, 102 pages

After PR:
  npm run docs:check-links → 0 errors (no regression)
  npm run docs:build → 6.4s, 103 pages (1 new page — reasonable)

If after PR:
  npm run docs:check-links → 3 errors ← REGRESSION
  → Block merge until fixed
```

### L4 Release Gate

This is the final gate, checking "release readiness":

| Check Item | Tool | Threshold |
|------------|------|-----------|
| Build verification | `npm run docs:build` | Zero errors, zero warnings |
| Link audit | `npm run docs:check-links` | Zero broken links |
| Route verification | `npm run docs:check-routes` | All sidebar links reachable |
| Performance | Lighthouse | Performance ≥ 90 |
| Accessibility | axe-core / Lighthouse | Accessibility ≥ 95 |
| Mobile | Manual screenshot at 375px | No overflow, no truncation |
| Dark mode | Manual screenshot | All pages readable in dark mode |
| Content review | Manual | No factual errors, no typos |

## Example: Defining Four-Layer Checks for "Add a Loop Engineering Sub-page"

```
L1 Unit Check (after each write_file):
  [ ] File has ≥ 50 lines (not an empty page)
  [ ] Frontmatter exists (if applicable)

L2 Scenario Check (after all sub-pages are written):
  [ ] npm run docs:build passes
  [ ] The 3 new sub-pages appear in the build output
  [ ] Next-step links between sub-pages are reachable

L3 Regression Check (before commit):
  [ ] npm run docs:check-links → 0 errors
  [ ] npm run docs:check-routes → sidebar includes new sub-pages

L4 Release Gate (before merge):
  [ ] Each sub-page ≥ 80 lines (meets module learning standards)
  [ ] Sidebar config has collapsed: false (new content should not be collapsed by default)
```

## Exercise

Define four-layer checks for a PR that "modifies the sidebar structure in config.ts":

1. L1: What command should the Agent run after modifying config.ts to verify formatting correctness?
2. L2: What scenario check ensures the sidebar changes don't break existing navigation?
3. L3: Which existing pages might be affected by this change?
4. L4: If this PR is to be released, what additional checks are needed?

## Troubleshooting

| Symptom | Possible Cause | Fix |
|---------|---------------|-----|
| L1 passes but L2 fails | Individual operations are correct but combinations fail (e.g., sidebar registered but page path is wrong) | Ensure L2 covers end-to-end flows |
| L3 finds many regressions | PR scope is too broad, touching links in too many files | Split the PR into smaller changes |
| L4 fails on the same item every time | Gate thresholds are unreasonable or auto-fix tools are missing | Adjust thresholds or provide auto-fix scripts |

## Next Steps

Now that you understand evaluation levels, read about [Evaluator Design](./evaluator-design) — how to write good evaluators for each layer.
