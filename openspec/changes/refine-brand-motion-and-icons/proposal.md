## Why

The local site now works functionally, but the brand layer still feels generic: the product name `AI 编程教程` is not distinctive, the current logo is a placeholder-like checkmark graphic, the hero logo can fail to render in the local preview, and the motion/icon language does not yet communicate a polished agent-engineering project. This change upgrades the site from a working tutorial to a credible open-source learning product with a professional name, reliable identity assets, cohesive iconography, and restrained interaction polish.

## What Changes

- Rename the public-facing brand from the generic `AI 编程教程` to a more professional identity, with `Agent Engineering Hub` as the recommended English brand and `智能体工程学习枢纽` as the Chinese descriptor.
- Update VitePress title, description, OG metadata, footer, homepage hero copy, alt text, and navigation-facing product language so the naming is consistent across Chinese and English pages.
- Replace or refine the current logo/favicon/hero mark so it no longer reads as a generic checkmark badge and reliably renders in local preview, production build, and GitHub Pages project-site deployment.
- Add a cohesive icon system for Skills, MCP, OpenSpec, Harness, Context, Workflow, Evaluation, Deployment, and Safety, with consistent stroke, scale, color, and semantic fit.
- Add restrained, high-quality motion for homepage affordances, navigation states, learning cards, and copy/check interactions while respecting reduced-motion preferences and avoiding layout shift.
- Improve professional wording on the homepage and key landing pages so the site reads like an agent-engineering learning hub rather than a casual AI coding note collection.
- Add visual verification tasks for logo rendering, favicon rendering, icon consistency, motion behavior, responsive fit, and accessibility.

## Capabilities

### New Capabilities

- `brand-identity-system`: covers naming, positioning, metadata, bilingual terminology, homepage voice, and professional expression.
- `icon-asset-system`: covers logo, favicon, hero image, topic icons, asset path compatibility, and visual consistency.
- `motion-interaction-system`: covers tasteful animation, hover/focus states, reduced-motion behavior, layout stability, and performance constraints.

### Modified Capabilities

- `doc-site-config`: strengthens requirements for title/description/OG metadata and asset URL compatibility so brand assets render consistently under `/ohmyopenAI-tutorial-hub/`.

## Impact

- Affected files: `docs/.vitepress/config.ts`, `docs/index.md`, `docs/zh/index.md`, `docs/en/index.md`, `docs/.vitepress/theme/custom.css`, `docs/public/custom.css`, `docs/logo.svg`, `docs/favicon.svg`, and any new visual assets under `docs/public/`.
- Affected verification: local preview route checks, production build, internal link audit, generated HTML asset inspection, favicon/logo HTTP checks, responsive visual review, reduced-motion review, and accessibility smoke checks.
- No new dependencies are expected. Prefer VitePress-native Markdown, CSS, and local static assets.
- No public API or content-route breaking changes are expected.
