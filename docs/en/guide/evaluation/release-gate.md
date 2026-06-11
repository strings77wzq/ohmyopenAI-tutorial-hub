# Release Gate

## Concept

The release gate is the final checkpoint. It answers one question: **is this change ready to face real users?**

This is not a technical check — it's a product decision. A technical check can tell you "the build passed," but only a release gate can tell you "the user experience in this version won't be worse than the last one."

## Why Is a Separate Release Gate Needed?

Passing the regression suite ≠ ready to ship.

- The regression suite verifies "nothing existing was broken"
- The release gate verifies "new content meets quality standards"

A new page might pass all regression checks (no existing links broken), but it could be only 30 lines, have no exercise section, and lack a next-step link — not meeting module learning standards.

## Release Gate Checklist

### Automated Checks (all must pass)

```
[ ] npm run docs:build          Zero errors, zero warnings
[ ] npm test                    Full test suite passes
[ ] npm run docs:check-stale    No zombie openspec changes
[ ] Lighthouse Performance      ≥ 90
[ ] Lighthouse Accessibility    ≥ 95
[ ] Lighthouse Best Practices   ≥ 90
[ ] Lighthouse SEO               ≥ 90
[ ] LCP                         < 2.5s
[ ] CLS                         < 0.1
[ ] Build bundle size            ≤ 120% of last release
```

### Manual Checks (at least 2 people confirm)

```
[ ] Homepage hero section       Clearly conveys "what this site is and who it's for"
[ ] Mobile at 375px             No horizontal overflow, text readable, CTA clickable
[ ] Dark/light dual themes      Both look intentionally designed, not like a default template
[ ] New content quality         Every new page has at least: concept + steps + example + exercise + next steps
[ ] Chinese/English navigation  Both language sidebars correspond to the current language
[ ] Link discoverability        Are important new entries reachable from the homepage or other pages
[ ] Factual accuracy            Do code examples run? Are concept explanations correct?
[ ] Spelling and grammar        No Chinese typos, no English grammar errors
```

## Division of Labor: Automated vs. Manual Gates

```
Automated gates should cover:
  ✓ Objectively determinable criteria ("links return 200," "build warnings = 0")
  ✓ High-frequency repetitive checks (run on every PR)
  ✓ Checks humans easily miss (link audits across 100+ pages)

Manual gates should cover:
  ✓ Subjective aesthetic judgment ("does this design look like a default template?")
  ✓ Low-frequency, high-value decisions ("does this new module meet teaching quality standards?")
  ✓ Checks requiring human expertise (spelling, grammar, factual accuracy)
```

## Handling False Positives and False Negatives

Every gate can produce errors:

| Situation | Definition | Handling |
|-----------|-----------|----------|
| **False Positive** | Gate reports FAIL, but nothing is actually wrong | Adjust gate rules or add exemption conditions |
| **False Negative** | Gate reports PASS, but something is actually wrong | Add new check rules; don't rely on "humans will catch it next time" |

Example: A link checker reports a 404, but the link points to an external site where the target actually exists (the site's anti-bot protection returned a 403). → False Positive. Solution: Add a `data-ignore-check` attribute or domain whitelist for external links.

## Rollback Criteria

Not every gate failure should block a release. Define rollback trigger conditions:

```
Must rollback (block release):
  - Link audit finds > 0 new broken links
  - Build fails or new warnings > 0
  - Lighthouse a11y < 90 (dropped 5+ points from baseline)
  - Homepage CLS > 0.15 (severe layout shift)

Can release with known issues (document in TODOS):
  - Lighthouse Performance dropped from 95 to 92 (still within ≥ 90 threshold)
  - 1 new EN page marked as "needs polish" (doesn't affect Chinese users)
  - Non-critical page mobile typography needs tweaking (doesn't affect core learning flow)
```

## Example: Full Gate Process for Releasing "Context Engineering 4 Sub-pages"

```
Step 1: Automated gates
  npm run docs:build → PASS (6.8s, 106 pages, +4 pages)
  npm test → PASS (links 0 errors, routes ok, frontmatter ok)
  npm run docs:check-stale → PASS
  Lighthouse home → Perf 93, A11y 97, LCP 1.8s, CLS 0.02 → all ≥ thresholds

Step 2: Manual checks
  Homepage hero → No changes (only added sub-pages, didn't touch homepage)
  Mobile 375px → Code blocks on new pages don't overflow ✓
  Dark/light → New pages readable in both themes ✓
  New content quality → 4 pages, 80-200 lines each, all have concept+steps+example+exercise+next steps ✓
  Chinese/English navigation → Chinese sidebar updated (+4 entries), English sidebar not yet updated (marked WIP) → Acceptable
  Factual accuracy → Code examples correct at conceptual level (not executable code) ✓

Step 3: Decision
  All automated gates passed ✓
  All manual checks passed ✓
  English sidebar WIP status documented in TODOS.md

  → RELEASE: GO
  → Known issue: EN version missing Context Engineering sub-page translations (documented in TODOS.md Week 3)
```

## Exercise

Design a release gate process for a PR that "adds Loop Engineering retry-and-breaker.md (~180 lines)":

1. What should automated gates check?
2. Which existing gate results might this change affect?
3. If Lighthouse Performance drops from 93 to 88 (because the new page has a large ASCII diagram), should the release be blocked?
4. What should manual checks focus on?

## Troubleshooting

| Symptom | Possible Cause | Fix |
|---------|---------------|-----|
| All automated gates are green but users report bugs | False negative — no check exists for this category of problem | Analyze the reported bug, add a new automated check |
| Every release is blocked by the same manual check | Manual check criteria are too vague or too strict | Extract the quantifiable parts into automated checks |
| Gates are too loose, letting low-quality content through | Manual checks are skipped or performed carelessly | Break "new content quality" into multiple specific sub-items |

## Next Steps

Return to the [Evaluation and Quality Overview](./) to review the overall framework, or read about [Deployment and Security](/guide/deployment/) to learn about post-release observability and rollback.
