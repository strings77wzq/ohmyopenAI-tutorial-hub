## Context

The previous implementation made the site functional and link-healthy, but the user reported that the local preview at `http://localhost:4174/ohmyopenAI-tutorial-hub/` still lacks a premium feel. Concrete issues observed in the code include:

- `docs/.vitepress/config.ts` still uses `AI 编程教程` for the site title, OG title, and copyright.
- Homepages use `AI Agent 工程教程`, which is more specific but still reads like a course title rather than a memorable project identity.
- `docs/logo.svg` is a generic circle/checkmark/network mark, which does not strongly communicate agent engineering, protocols, evaluation, or open-source learning.
- `docs/favicon.svg` is a simple green checkmark, which can be mistaken for a generic task/status icon.
- The hero image is referenced through an absolute project-prefixed path and should be verified in both local preview and generated output because the user reports it can fail to display.
- Current CSS has basic hover polish, but does not yet provide a coherent icon/motion design language.

## Goals / Non-Goals

**Goals:**

- Establish a professional brand identity: recommended public brand `Agent Engineering Hub`, Chinese descriptor `智能体工程学习枢纽`, and consistent metadata.
- Fix logo/favicon/hero asset rendering across local preview, build output, and GitHub Pages project-site URLs.
- Replace the generic checkmark identity with a mark that suggests agents, protocols, context, evaluation, and learning systems.
- Create a reusable icon grammar for topic cards and learning paths.
- Add tasteful motion that supports comprehension and perceived quality without becoming decorative noise.
- Preserve accessibility, reduced-motion preferences, mobile stability, and VitePress maintainability.

**Non-Goals:**

- Replacing VitePress or introducing a full custom frontend app.
- Adding external animation libraries, icon packages, or runtime dependencies.
- Creating a complete corporate brand book beyond the assets and rules needed for this site.
- Copying another project's visual identity.

## Decisions

### Decision: Use a bilingual brand hierarchy

The site should use `Agent Engineering Hub` as the concise project name and `智能体工程学习枢纽` as the Chinese descriptor. This avoids the casual feel of `AI 编程教程` while still being clear to Chinese learners.

Alternatives considered:

- Keep `AI 编程教程`: rejected because it is too broad and undersells the agent-engineering focus.
- Use only a Chinese name: rejected because the project wants open-source credibility and bilingual reach.
- Use a highly abstract codename: rejected because discoverability and learning clarity matter more than mystique.

### Decision: Keep assets local and VitePress-native

Logo, favicon, and topic icons should live in the repo and use stable paths that work under the configured base path. Implementation should prefer simple SVG/CSS assets already compatible with VitePress, but they must be purpose-built rather than placeholder checkmarks.

Alternatives considered:

- Use an external CDN icon set: rejected because it adds availability and licensing risk.
- Add a package dependency for icons: rejected because a small local icon system is enough for this static site.

### Decision: Motion should be functional, not decorative

Motion should clarify state changes: hover, focus, active path, copy feedback, section reveal, and topic-card affordance. It should not rely on large background blobs, constant loops, or viewport-scaled typography.

Alternatives considered:

- Add continuous hero animation: rejected because it can distract from reading and creates accessibility risk.
- Keep completely static UI: rejected because subtle response and state transitions are part of the requested polish.

### Decision: Verification must include asset rendering

Because the user explicitly reported the logo failing to display, verification should include checking the generated HTML references, built asset existence, and HTTP status for logo/favicon/hero image paths in local preview.

Alternatives considered:

- Rely on visual inspection only: rejected because the bug is asset-path-sensitive and needs repeatable checks.

## Risks / Trade-offs

- [Risk] A more professional name may feel less immediately understandable to beginners. -> Mitigation: pair the English brand with a clear Chinese descriptor and direct homepage subtitle.
- [Risk] Custom icons can drift stylistically over time. -> Mitigation: document stroke width, viewBox, color tokens, and semantic usage.
- [Risk] Motion can harm accessibility or performance. -> Mitigation: implement `prefers-reduced-motion`, avoid layout-changing animation, and keep transitions short.
- [Risk] SVG assets may render differently in nav, hero, and favicon contexts. -> Mitigation: test all three contexts and use simple shapes that scale cleanly.

## Migration Plan

1. Rename site metadata, homepage hero copy, OG metadata, footer, alt text, and key references.
2. Replace logo and favicon with a cohesive agent-engineering mark.
3. Add a small local icon system for the main learning modules.
4. Update homepage and learning-map markup to use the icon system.
5. Refresh CSS motion and interaction states with reduced-motion support.
6. Build, run link audit, check local preview asset URLs, and inspect generated pages for brand consistency.
