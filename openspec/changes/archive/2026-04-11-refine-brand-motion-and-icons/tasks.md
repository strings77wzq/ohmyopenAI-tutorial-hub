## 1. Brand Naming And Copy

- [x] 1.1 Replace public-facing `AI 编程教程` metadata with `Agent Engineering Hub` and `智能体工程学习枢纽` where appropriate.
- [x] 1.2 Update VitePress title, description, OG title, OG description, footer, and locale metadata for the new brand hierarchy.
- [x] 1.3 Rewrite Chinese homepage hero copy so it sounds like a professional agent-engineering learning product.
- [x] 1.4 Rewrite English homepage hero copy to match the same brand positioning.
- [x] 1.5 Search generated/source content for outdated generic naming and update public-facing occurrences.

## 2. Logo, Favicon, And Asset Reliability

- [x] 2.1 Diagnose why the current hero logo can fail to display in local preview.
- [x] 2.2 Replace the generic checkmark logo with an agent-engineering mark that works at hero and nav sizes.
- [x] 2.3 Replace the favicon with a small-size version related to the main identity.
- [x] 2.4 Verify logo, favicon, and hero image paths in source config and generated HTML.
- [x] 2.5 Verify identity assets return 200 in local preview under `/ohmyopenAI-tutorial-hub/`.

## 3. Topic Icon System

- [x] 3.1 Define a lightweight local icon grammar for Skills, MCP, OpenSpec, Harness, Context, Workflow, Evaluation, Deployment, and Safety.
- [x] 3.2 Add local icon assets or inline VitePress-compatible markup without introducing a dependency.
- [x] 3.3 Update homepage feature cards and learning-map cards to use semantically appropriate icons.
- [x] 3.4 Ensure decorative icons are hidden from screen readers or paired with useful labels.
- [x] 3.5 Verify all referenced icon assets resolve in build output.

## 4. Motion And Interaction Polish

- [x] 4.1 Add refined hover and focus motion for cards, buttons, nav states, and learning paths.
- [x] 4.2 Add subtle state feedback for copy/check/practice affordances where present.
- [x] 4.3 Add `prefers-reduced-motion` rules that disable or shorten non-essential motion.
- [x] 4.4 Review CSS for layout-shifting animation and remove transforms or transitions that resize surrounding content.
- [x] 4.5 Check desktop and mobile viewports for text overflow, stable grid dimensions, and usable touch targets.

## 5. Professional Expression Pass

- [x] 5.1 Update homepage section headings and learning-map labels to use agent-engineering terminology consistently.
- [x] 5.2 Update alt text, trust signals, and quality-gate language to match the new brand tone.
- [x] 5.3 Ensure Chinese and English naming remain aligned without awkward literal translation.
- [x] 5.4 Confirm `Agent Engineering Hub` remains discoverable and understandable for beginner readers.

## 6. Verification

- [x] 6.1 Run `npm run docs:build`.
- [x] 6.2 Run `npm run docs:check-links -- --dist docs/.vitepress/dist`.
- [x] 6.3 Smoke-check local preview routes for homepage, Chinese entry, English entry, logo, favicon, and at least one icon-bearing learning page.
- [x] 6.4 Inspect generated HTML for updated title, OG metadata, image alt text, and absence of stale `AI 编程教程` branding.
- [x] 6.5 Review CSS for reduced-motion support, no negative letter spacing, no oversized card radius, and no decorative orb/bokeh background patterns.
- [x] 6.6 Record any remaining visual QA gaps before archiving.
