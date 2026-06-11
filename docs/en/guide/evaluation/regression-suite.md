# Regression Suite

## Concept

A regression suite is a collection of evaluators whose goal is to answer one question: **did this change break any existing functionality?**

A single evaluator verifies one criterion; a regression suite verifies a system. The value of a suite is not "how many tests it has" but "whether every run produces a clear go/no-go conclusion."

## Why Do We Need a Regression Suite?

When an Agent modifies code, its context window can only see the files it's currently editing. It doesn't know whether its changes broke links in another module, introduced dead routes in the sidebar, or blew the build time from 6s to 45s.

The regression suite is the Agent's "external memory" — after every change, it answers the question both the Agent and the user want to know: "Is everything still working?"

## Suite Organization

```
Regression Suite
├── Fast Gate (≤ 30s)       ← Must pass before every commit
│   ├── Link check
│   ├── Route check
│   └── Frontmatter check
│
├── Standard Gate (≤ 5min)  ← Must pass before every PR
│   ├── npm run docs:build
│   ├── npm test (links + routes + frontmatter)
│   └── docs:check-stale
│
└── Full Gate (≤ 15min)     ← Must pass before release
    ├── Lighthouse (perf + a11y)
    ├── Chinese/English navigation completeness
    ├── Mobile manual screenshots
    └── Dark mode manual screenshots
```

### Why Separate into Layers?

- **Fast Gate** should be triggered automatically after every Agent `write_file`. It must be fast enough not to interrupt the Agent's workflow (< 30s).
- **Standard Gate** only needs to run once before submitting a PR. Running it too often wastes CI time.
- **Full Gate** only needs to run before release. It includes manual steps (manual screenshots) and cannot be fully automated.

## Golden Dataset Management

A regression suite needs fixed test data (Golden Set) to ensure consistency:

```
project/
├── tests/
│   ├── fixtures/
│   │   ├── valid-links.md         ← Page with all links known to be valid
│   │   ├── broken-links.md        ← Page with 3 known broken links
│   │   └── missing-frontmatter.md ← Page known to be missing frontmatter
│   └── golden/
│       ├── expected-routes.json   ← Expected sidebar route snapshot
│       └── expected-build-meta.json ← Expected build metadata (page count, build time range)
```

Golden Dataset maintenance rules:

- **Add**: Add when a new legitimate variant is discovered (e.g., "link with emoji," "cross-language reference")
- **Update**: Update when project structure changes (e.g., a new module means snapshots need updating)
- **Delete**: Delete when a fixture no longer covers any actual scenario

## Detecting Drift

The core value of a regression suite is detecting "when things got worse":

```
Comparison dimensions:
  ├── Link health:       broken link count (expected: 0, alert: >0)
  ├── Build time:        seconds (expected: 6-8s, alert: >15s)
  ├── Page count:        number of pages (expected: steady growth, alert: sudden decrease)
  ├── File size:         max CSS/JS bundle (expected: stable, alert: >20% increase)
  └── Build warnings:    warning count (expected: 0, alert: >0)
```

Drift doesn't necessarily mean regression — it could be normal project growth. The key to distinguishing the two is **rate of change**:

```
Normal: Page count goes from 100 → 103 (3 new pages, consistent with PR description)
Regression: Page count goes from 100 → 97 (3 pages are missing!)
```

## CI Integration

The regression suite must be integrated into CI — it can't rely on the "Agent remembering to run it":

```yaml
# .github/workflows/quality.yml
name: Quality Gates
on: [pull_request]

jobs:
  fast-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test  # link + route + frontmatter

  standard-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run docs:build
      - run: npm run docs:check-stale
```

## Example: The Actual Regression Suite for This Project (agent-engineering-hub)

```bash
# Fast Gate (npm test)
npm run docs:check-links        # AST-parse all .md files, verify links
npm run docs:check-routes       # Compare sidebar config against actual files
npm run docs:check-frontmatter  # Check all pages have structured headings

# Standard Gate
npm run docs:build              # VitePress full build
npm run docs:check-stale        # Check for unarchived zombie openspec changes

# Full Gate (requires lighthouse dependencies)
npm run docs:audit-lighthouse   # Lighthouse audit of 5 key pages
# + Manual: mobile screenshots × Chinese/English × dark/light
```

## Exercise

Design a new regression check for this documentation site: "All pages referenced in the sidebar also exist in the English version (at least an index.md or equivalent page)":

1. Which gate tier should this check belong to?
2. What is the implementation logic? (What to traverse, what to compare)
3. Which pages should be exempted? (Chinese-only announcements, WIP pages)
4. What information should the failure output include?

## Troubleshooting

| Symptom | Possible Cause | Fix |
|---------|---------------|-----|
| Regression suite fails every PR, but nothing is actually wrong | Golden Dataset is outdated | Update fixtures and snapshots |
| Regression suite gives different results locally vs. CI | Environment differences (Node version, filesystem case sensitivity) | Pin Node version in CI, check path case sensitivity |
| Agent never triggers the regression suite | Suite not integrated into Agent's workflow | Add "run npm test after every change" rule in prompt/system message |

## Next Steps

The regression suite verifies "did we break existing functionality" — now read about the [Release Gate](./release-gate) to verify "are we ready to ship to real users."
