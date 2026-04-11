## Context

The project is a VitePress documentation site deployed as a GitHub Pages project site under `/ohmyopenAI-tutorial-hub/`. The local build succeeds with `vitepress build docs --outDir /tmp/ai-tutorial-hub-vp-build`, but inspection found real navigation risk: `docs/.vitepress/config.ts` links to `/en/reference/commands` and `/en/reference/faq` while those English pages do not exist, and the published `/ohmyopenAI-tutorial-hub/en/reference/faq` route returns 404. Existing content covers Skills, OpenSpec, and Harness basics, but the site still lacks a complete agent-engineering curriculum, release-grade link checks, and the visual polish expected from high-quality open-source learning docs.

The user wants the site to become strong enough to promote in open-source communities. Reference sites such as Hermes Agent show a useful direction: clear product identity, immediate install/configure actions, open-source trust signals, concise feature blocks, and a premium but readable visual system. This project should borrow those interaction principles without turning the docs into a marketing page or adding unnecessary frontend dependencies.

## Goals / Non-Goals

**Goals:**

- Eliminate known 404s and add repeatable link-health verification for local builds and published GitHub Pages routes.
- Make Chinese and English navigation complete and internally consistent.
- Expand the tutorial system into a broader agent-engineering curriculum: Skills, MCP, Harness Engineering, OpenSpec, context engineering, tool use, retrieval, evaluation, deployment, safety, and contribution workflows.
- Redesign the homepage and section landing pages so learners can start quickly, understand the full map, and move through progressive exercises.
- Improve visual quality with a distinctive open-source identity, restrained motion, accessible contrast, responsive layout, and elegant interactive affordances.
- Keep the stack simple: VitePress, Markdown, existing theme extension points, and local scripts where needed.

**Non-Goals:**

- Replacing VitePress with another framework.
- Adding analytics, backend services, accounts, comments, or dynamic server-side features.
- Creating exhaustive production docs for every third-party tool in the agent ecosystem in one pass.
- Guaranteeing all external websites remain reachable forever; external checks should report instability without blocking routine content edits unless configured as required.

## Decisions

### Decision: Add a repo-local link audit instead of relying only on VitePress build

VitePress builds the current site successfully even when config points to missing pages. A dedicated audit should parse Markdown links, VitePress nav/sidebar links, HTML `href` values embedded in docs, generated output routes, and known GitHub Pages URL forms.

Alternatives considered:

- Use only `vitepress build`: rejected because it did not catch the missing English reference pages.
- Add a heavyweight crawler dependency immediately: rejected because the repo currently has no custom tooling dependency and a small script can cover internal route checks.

### Decision: Treat URL strategy as a release contract

The site should support all first-party routes under the project prefix. The implementation can keep `cleanUrls: false` if needed for GitHub Pages, but all nav, sidebars, homepage cards, and inline docs must resolve to generated files and published routes. Direct checks should include both important extensionless paths and generated `.html` paths where relevant.

Alternatives considered:

- Convert all links manually to `.html`: rejected as a first decision because it hurts readability and may not be necessary for every route if GitHub Pages resolves extensionless paths.
- Enable `cleanUrls: true` blindly: rejected because existing comments indicate prior 404 constraints on GitHub Pages.

### Decision: Build content around learning tracks and capability modules

The content system should move from topic pages alone to guided tracks: quickstart, fundamentals, Skills, MCP, Harness, OpenSpec, agent workflows, evaluation, deployment/safety, examples, and contribution. Each module should have concepts, implementation steps, practice, troubleshooting, and next links.

Alternatives considered:

- Add only MCP pages: rejected because the user's goal is an open-source-quality learning site, and MCP alone would leave agent workflow, evaluation, and safety gaps.
- Write long reference pages without exercises: rejected because the site should help learners practice rather than only read.

### Decision: Use VitePress-native customization for the redesign

The visual overhaul should use Markdown home content, VitePress theme slots/components if necessary, and scoped CSS in the existing theme. This keeps the site maintainable and deployable through the existing build.

Alternatives considered:

- Introduce a separate React/Vue app shell: rejected because it increases maintenance and risks breaking documentation behavior.
- Copy a reference site's style directly: rejected because the site needs its own identity and must avoid copyright/design cloning.

### Decision: Make quality gates part of implementation tasks

The implementation should require build, link audit, route smoke checks, responsive review, accessibility smoke checks, and content coverage review before claiming completion.

Alternatives considered:

- Manual browser clicking only: rejected because it is not repeatable and will miss route regressions.

## Risks / Trade-offs

- [Risk] Expanding the curriculum too broadly could produce shallow content. -> Mitigation: define a required page template and minimum acceptance criteria for examples, exercises, and troubleshooting.
- [Risk] English/Chinese parity can double the content workload. -> Mitigation: prioritize navigation parity and key landing/reference pages first, then mark deeper translated pages as staged follow-ups when necessary.
- [Risk] Visual customization can fight VitePress defaults. -> Mitigation: prefer documented theme extension points, keep CSS small, and verify desktop/mobile screenshots.
- [Risk] External links can be flaky. -> Mitigation: separate required internal checks from advisory external checks.
- [Risk] Existing unarchived OpenSpec changes overlap with this work. -> Mitigation: implement this change as the umbrella quality pass and reconcile or archive superseded narrower changes before final archive.

## Migration Plan

1. Add or repair missing pages and navigation entries, starting with known English reference gaps.
2. Add an internal-link audit script and run it against Markdown/config/generated output.
3. Rework route strategy and GitHub Pages checks until representative published paths return 200.
4. Expand content modules and bilingual landing/reference coverage.
5. Redesign homepage, section indexes, and theme CSS using VitePress-native components.
6. Run build, link audit, route smoke checks, responsive visual QA, and content review.
7. Roll back by reverting the change branch if route or visual regressions appear; because this is a static docs site, no data migration is required.

## Open Questions

- Whether the English section should be full parity in this implementation or a curated English entry with complete navigation only for published pages.
- Whether to add screenshots/diagrams as static assets in this pass or defer richer illustrations until the core route/content quality is stable.
