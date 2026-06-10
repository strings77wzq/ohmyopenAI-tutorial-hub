# TODOS

> Working list of follow-up items. Source: `/plan-ceo-review` 2026-06-10 + `/plan-eng-review` execution split.
> See `~/.gstack/projects/ai-tutorial-hub/ceo-plans/2026-06-10-full-quality-uplift.md` for full plan.

## In progress — Week 1 (chore/week1-foundation branch)

- [x] **PR 1** — Fix EN sidebar route bug (OMO/golem-case removed until translated)
- [x] **PR 2** — Add TODOS.md + ROADMAP.md + VitePress local search
- [ ] **PR 3** — Lighthouse + axe baseline audit (script + first run, write into README)
- [ ] **PR 4 (openspec)** — `design-tokens-extraction` — pure CSS refactor into `theme/tokens/{colors,typography,spacing,motion}.css`. Zero pixel change. Visual screenshot diff required.
- [ ] **PR 5 (openspec)** — `homepage-anthropic-style-redesign` — warm clay accent, typography pairing, kill decorative effects, simplify hero. Built on PR 4 tokens.

## Week 2 — Content depth (S1)

For each module: 4 sub-pages × (concept + steps + example + exercises + troubleshooting + next link).

- [ ] `loop-engineering/` — split 210-line index → `ooda-loop.md`, `retry-and-breaker.md`, `multi-source-feedback.md`
- [ ] `context/` — add `layering.md`, `injection-strategy.md`, `compression.md`, `practice.md`
- [ ] `evaluation/` — add `levels.md`, `evaluator-design.md`, `regression-suite.md`, `release-gate.md`
- [ ] `deployment/` — add `permission-model.md`, `secret-governance.md`, `observability-rollback.md`
- [ ] `agent-workflows/` — add `orchestration-patterns.md`, `error-recovery.md`, `multi-agent.md`

## Week 3 — EN parity (S3-translation) + golem cross-refs (S6)

- [ ] Translate 19 missing EN pages (golem-case 5, harness 3, omo 8, openspec/index, skills/index, plus all Week-2 new pages)
- [ ] Re-add OMO + golem-case to EN sidebar with `/en/` prefix once translated
- [ ] `golem-case/*` add real code anchors: "真实代码位置: golem/src/..."
- [ ] `examples/` add `mcp-server-starter.md`, `skill-pack-starter.md`, `harness-eval-suite.md`

## Deferred (post Week 3 — surfaced by CEO review)

- [ ] **S5** Learning path completion checkmarks + time estimates per step
- [ ] **S8** Site changelog + `RELEASES.md`
- [ ] **S9** Contributing tutorial-page template (derive from Week 2 result)
- [ ] Move `docs:check-stale` into `npm test` so CI enforces
- [ ] README + commit messages: add English versions (internationalize)
- [ ] Evaluate Astro Starlight as VitePress Plan B (only if anthropic-style hits VitePress theme limits)
- [ ] Visual regression: Playwright screenshot suite covering homepage + 3 main module entries
- [ ] Spec the tutorial **content** itself with OpenSpec (e.g. `skills-tutorial-content` spec)
- [ ] Hot-path code-doc cross-link generator: pull golem source headers into docs build

## Engineering hygiene (surfaced during eng review)

- [ ] Lighthouse baseline numbers → README "Quality Gates" replace anecdotal claims with measured values
- [ ] Remove stale `ohmyopenAI-tutorial-hub` references in archived openspec changes (or move archive out of grep scope)
- [ ] `docs/.vitepress/dist/` showed in grep — confirm `.gitignore` blocks it (currently does: `docs/.vitepress/dist/`)
- [ ] CSS budget: current `custom.css` = 636 lines, ceiling 800. PR 4 token split will resolve.

## How to use this file

- Check items here before saying "what's next?"
- New ideas go to **Deferred**; promote to a Week bucket when scheduled
- Done items stay checked for 1 release cycle then move to `archive/` or get deleted
