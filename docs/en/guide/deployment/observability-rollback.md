# Observability and Rollback

## Concept

A release is not an endpoint — it's the starting line for observability. After deploying to production, you need to know two things: **is the system still working?** and **if it's not, how do we get back to the last known-good state?**

## Why Is Observability Especially Important for Agent Projects?

Traditional application observability focuses on "is the server alive? is response time normal?" Agent projects have additional observability dimensions:

- **Output quality**: Did the build pass (observable)? Are links broken (observable)? Is content accurate (requires human review)?
- **Agent behavior**: Is the Agent consuming abnormally many tokens in a loop? Has the tool call success rate dropped?
- **Knowledge decay**: Are external APIs referenced in documentation still valid? Does example code still run on the latest version?

## Three Layers of Observability

```
┌─────────────────────────────────────────────────────────┐
│ L1: Build-Level Observability                            │
│ Signals: Build success/failure, build time, warning count│
│ Tools: CI logs, build artifact hashes                   │
│ Alerts: Build failure, build time > 2× baseline         │
├─────────────────────────────────────────────────────────┤
│ L2: Runtime-Level Observability                          │
│ Signals: Page reachability, link status, performance     │
│           metrics                                       │
│ Tools: Lighthouse, link-checker, uptime monitor          │
│ Alerts: Broken links > 0, LCP > 3s, a11y < 90          │
├─────────────────────────────────────────────────────────┤
│ L3: Experience-Level Observability                       │
│ Signals: User feedback, mobile screenshots, content      │
│           accuracy                                      │
│ Tools: Issue tracker, periodic manual review             │
│ Alerts: User reports critical page broken, content       │
│         factual errors                                  │
└─────────────────────────────────────────────────────────┘
```

## Key Metrics

| Metric | Current Baseline | Alert Threshold | Check Frequency |
|--------|-----------------|----------------|-----------------|
| Build pass rate | 100% | < 100% | Every push |
| Link health | 0 broken links | > 0 | Every PR |
| Build time | ~6.3s | > 15s | Every build |
| LCP | To be measured | > 2.5s | Every release |
| CLS | To be measured | > 0.1 | Every release |
| a11y score | To be measured | < 90 | Every release |
| Total page count | Current count | Decrease > 3 | Every build |

These baselines need to be established first in `.lighthouse/baseline.json` (see `npm run docs:audit-lighthouse`), then compared before each release.

## Rollback Design

### When Is Rollback Necessary?

```
Must rollback:
  - Homepage inaccessible (404 or blank screen)
  - Build critically failed (dist/ is empty)
  - Sensitive content accidentally exposed
  - Critical pages (/guide/, /guide/quickstart) have broken links

Can forward-fix instead:
  - Content error on a single sub-page
  - Style issue on a non-critical page (e.g., missing table border in dark mode)
  - Minor Lighthouse score drop (still within thresholds)
```

### Rollback Strategy

For a Git-based documentation site, the rollback strategy is straightforward:

```
Strategy A: Git Revert (most common, recommended)

  1. git revert <bad-commit>      # Create a reverse commit
  2. git push                      # Push the revert commit
  3. GitHub Pages auto-redeploys   # Wait for deployment to finish
  4. Verify homepage accessible + link-checker passes

Strategy B: Redeploy from Last Release

  1. git checkout v1.2.3           # The last tagged release
  2. npm run docs:build && deploy  # Overwrite with old version
  3. Verify                        # Confirm recovery

Strategy C: Toggle Feature Off (if using Feature Flags)

  (Documentation sites usually don't need Feature Flags — direct revert is simpler)
```

For this project, Strategy A (git revert) is the best fit — documentation sites have no database migrations or API compatibility concerns, so a revert literally means "go back to the previous version."

## Smoke Test: The First Check After Release

After every deployment, immediately run 3 smoke tests:

```bash
# Smoke Test 1: Homepage reachable
curl -s https://strings77wzq.github.io/agent-engineering-hub/ | head -5
# Expected: contains <title>Agent Engineering Hub</title>

# Smoke Test 2: Learning Map reachable
curl -s https://strings77wzq.github.io/agent-engineering-hub/guide/ | head -5
# Expected: contains "Learning Map" text

# Smoke Test 3: link-checker passes
npm run docs:check-links
# Expected: 0 errors
```

## Example: Post-Deploy Issue Found — Full Response Workflow

```
14:00 Deploy new version (4 new Loop Engineering sub-pages + homepage redesign)
14:05 Smoke Test 1 passes (homepage reachable)
14:05 Smoke Test 2 passes (Learning Map reachable)
14:05 Smoke Test 3 running...
14:06 Smoke Test 3 complete: 0 errors
14:10 User reports: "Mobile homepage CTA button is truncated"

14:11 Analysis:
  - Severity: Medium (affects mobile UX but doesn't block core functionality)
  - Root cause: New section padding clamp calculates too large at 375px
  - Fix: Adjust the clamp lower bound for the spacing token

14:15 Decision: Forward-fix (don't revert)
  - Problem scope is small (one pixel-level issue on mobile only)
  - Other features working (desktop, links, build all OK)
  - Revert would lose the 4 shipped sub-pages and design improvements

14:20 Fix: Adjust --space-section-padding-mobile → PR → review → merge
14:25 Deploy fix
14:30 Verify: Mobile 375px screenshot, CTA fully visible
```

## Exercise

The documentation site just deployed a major version with 20 new pages + homepage redesign. After deployment you discover:

1. Lighthouse Performance dropped from 93 to 82
2. 3 users report mobile sidebar can't expand
3. link-checker outputs 0 errors
4. But the homepage has a table in dark mode with borders too dark to see

For each issue, determine: should you rollback, or forward-fix?

## Troubleshooting

| Symptom | Possible Cause | Fix |
|---------|---------------|-----|
| Homepage shows blank screen after deploy | JS bundle failed to load (wrong path or corrupted file) | Immediately revert, check base path config |
| link-checker passes in CI but fails after deploy | Deployed base URL differs from local | Use the actual deployed URL for smoke tests |
| Deploy succeeds but users see the old version | CDN cache / GitHub Pages deployment delay | Wait 5 minutes or force-refresh CDN |

## Next Steps

Return to the [Deployment and Security Overview](./) to review the overall framework, or read about [Evaluation and Quality](/guide/evaluation/) to learn how to turn observability data into release gates.
