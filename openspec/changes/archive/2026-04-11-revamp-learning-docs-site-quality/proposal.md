## Why

The current documentation site is useful but not yet reliable or polished enough for open-source promotion: published navigation has real 404s, English/Chinese content parity is incomplete, the learning path is still narrow, and the homepage does not communicate a high-quality agent-engineering tutorial experience. This change turns the site into a link-healthy, richer, more modern learning hub for Skills, MCP, Harness Engineering, OpenSpec, and adjacent agent engineering topics.

## What Changes

- Fix all known and newly discovered 404s, starting with English reference links such as `/en/reference/faq` and `/en/reference/commands`, and add an automated internal-link audit so regressions fail before release.
- Rework the VitePress navigation, sidebar, language routing, base-path handling, and GitHub Pages URL expectations so all documented routes work under `/ohmyopenAI-tutorial-hub/`.
- Expand the content architecture beyond the current Skills/OpenSpec/Harness baseline to include MCP, context engineering, agent workflow patterns, evaluation, tool safety, retrieval, deployment, and community contribution paths.
- Redesign the homepage and key landing pages with a more premium open-source project feel inspired by modern agent product sites, while keeping the site documentation-first and readable.
- Add stronger interactive learning affordances: role-based paths, runnable examples, copyable command blocks, practice checklists, concept maps, and progressive exercises.
- Improve bilingual parity so English and Chinese sections do not expose missing pages or mismatched cross-links.
- Preserve the existing VitePress stack and avoid new runtime dependencies unless a later implementation task proves one is necessary.

## Capabilities

### New Capabilities

- `docs-link-health`: covers internal/external link validation, GitHub Pages route compatibility, 404 prevention, and release verification.
- `learning-content-system`: covers the expanded tutorial taxonomy, bilingual content parity, learning paths, examples, exercises, and contribution-ready documentation standards.
- `docs-experience-quality`: covers visual design, homepage information architecture, interaction quality, accessibility, responsiveness, and documentation UX polish.

### Modified Capabilities

- `doc-site-config`: strengthens requirements for VitePress navigation, sidebar coverage, asset paths, build output hygiene, and no-broken-link release behavior.
- `project-site-parity`: expands GitHub Pages project-site expectations from a few sample routes to full route parity across Chinese, English, reference, guide, and examples pages.

## Impact

- Affected code and content: `docs/.vitepress/config.ts`, `docs/.vitepress/theme/`, `docs/index.md`, `docs/zh/index.md`, `docs/en/index.md`, `docs/guide/**`, `docs/en/guide/**`, `docs/reference/**`, `docs/en/reference/**`, `docs/examples/**`, `docs/en/examples/**`, and supporting assets under `docs/public/`.
- Affected verification: `npm run docs:build`, a new or scripted internal-link audit, targeted published GitHub Pages route checks, responsive visual review, accessibility smoke checks, and content coverage review.
- Affected OpenSpec contracts: new specs for link health, content system, and experience quality; deltas for existing site configuration and project-site parity specs.
- No breaking API changes are expected because this is a static documentation site.
