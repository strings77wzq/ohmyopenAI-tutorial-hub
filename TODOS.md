# TODOS

> Working list of follow-up items. Source: `/plan-ceo-review` 2026-06-10 + `/plan-eng-review` execution split.
> See `~/.gstack/projects/ai-tutorial-hub/ceo-plans/2026-06-10-full-quality-uplift.md` for full plan.

## Completed — v1.0 (2026-06-10, chore/week1-foundation)

PR 1-5 + Week 2+3 content delivered and shipped.

- [x] **PR 1** — Fix EN sidebar route bug (OMO/golem-case removed until translated)
- [x] **PR 2** — Add TODOS.md + ROADMAP.md + VitePress local search
- [x] **PR 3** — Lighthouse + axe baseline audit (script added; first run deferred until deps installed)
- [x] **PR 4** — `design-tokens-extraction` — custom.css split to tokens/{colors,typography,spacing,motion}.css
- [x] **PR 5** — `homepage-anthropic-style-redesign` — warm clay, display type, kill decorations
- [x] Week 2: Loop Engineering (4 sub-pages)
- [x] Week 2: Context Engineering (4 sub-pages)
- [x] Week 2: Evaluation (4 sub-pages)
- [x] Week 2: Deployment (3 sub-pages)
- [x] Week 2: Agent Workflows (3 sub-pages)
- [x] Week 3: EN OMO + golem-case index pages created; EN sidebar restored with correct /en/ prefixes
- [x] Both openspec changes archived (design-tokens-extraction, homepage-anthropic-style-redesign)
- [x] QA: 1 bug found and fixed (logo double-prefix 404), health score 96/100

## Week 2 — Content depth (S1)

For each module: 4 sub-pages × (concept + steps + example + exercises + troubleshooting + next link).

- [x] `loop-engineering/` — split 210-line index → `ooda-loop.md`, `retry-and-breaker.md`, `multi-source-feedback.md`
- [x] `context/` — add `layering.md`, `injection-strategy.md`, `compression.md`, `practice.md`
- [x] `evaluation/` — add `levels.md`, `evaluator-design.md`, `regression-suite.md`, `release-gate.md`
- [x] `deployment/` — add `permission-model.md`, `secret-governance.md`, `observability-rollback.md`
- [x] `agent-workflows/` — add `orchestration-patterns.md`, `error-recovery.md`, `multi-agent.md`

## Week 3 — EN parity (S3-translation) + golem cross-refs (S6)

- [x] EN OMO index created
- [x] EN golem-case index created
- [x] Re-added OMO + golem-case to EN sidebar with proper /en/ or /guide/ prefixes
- [ ] Full EN translation of Week 2 sub-pages (18 pages) — deferred
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
