# Verification Notes

## Baseline

- Local build passed before implementation with `vitepress build docs --outDir /tmp/ai-tutorial-hub-vp-build`.
- Published route checks on 2026-04-11 showed the current live site returned 200 for homepage, `/zh/`, `/en/`, quickstart, examples, and Chinese reference, but returned 404 for `/ohmyopenAI-tutorial-hub/en/reference/commands` and `/ohmyopenAI-tutorial-hub/en/reference/faq`.

## Implemented Quality Gates

- Added `scripts/check-doc-links.mjs`.
- Added `npm run docs:check-links`.
- The audit checks Markdown links, embedded `href`/`src`, VitePress `link` entries, source pages, source assets, and optional generated output.

## Final Local Verification

- `npm run docs:build` passed.
- `npm run docs:check-links -- --dist /tmp/ai-tutorial-hub-vp-build` passed with zero broken first-party links.
- Default VitePress dist was rebuilt for preview; `docs/.vitepress/dist/` is gitignored.
- Local preview started at `http://localhost:4174/ohmyopenAI-tutorial-hub/`.
- Local preview route smoke checks returned 200 for:
  - `/ohmyopenAI-tutorial-hub/`
  - `/ohmyopenAI-tutorial-hub/zh/`
  - `/ohmyopenAI-tutorial-hub/en/`
  - `/ohmyopenAI-tutorial-hub/guide/mcp/`
  - `/ohmyopenAI-tutorial-hub/en/reference/faq.html`
  - `/ohmyopenAI-tutorial-hub/guide/evaluation/`

## Accessibility And Visual Review

- Generated key pages have one `<h1>` each.
- Homepages and guide pages include image output from the VitePress logo/hero rendering.
- CSS includes focus-visible states, responsive breakpoints for the learning map and cards, max-width constrained sections, and no detected large card radii, negative letter spacing, radial decorative backgrounds, purple accent leftovers, or bokeh/orb decoration.

## Remaining Deployment Note

The live GitHub Pages site will continue serving the previous build until the repository is deployed again. After deployment, rerun the published route smoke checks for the fixed English reference pages.
