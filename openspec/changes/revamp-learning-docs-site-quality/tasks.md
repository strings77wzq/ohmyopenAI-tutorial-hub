## 1. Baseline Audit And Safety Net

- [x] 1.1 Run a local VitePress build to a temporary output directory and record build status.
- [x] 1.2 Audit `docs/.vitepress/config.ts`, Markdown links, embedded HTML anchors, and generated output for broken first-party routes.
- [x] 1.3 Confirm currently published GitHub Pages status for homepage, Chinese entry, English entry, quickstart, examples, reference, and known failing English reference routes.
- [x] 1.4 Add a repeatable internal-link audit script that reports file, line, and route for missing first-party links.
- [x] 1.5 Add a package script for the link audit without introducing new dependencies.

## 2. Navigation, Route, And 404 Fixes

- [x] 2.1 Add or repair missing English reference pages for `/en/reference/commands` and `/en/reference/faq`.
- [x] 2.2 Review every nav and sidebar entry in `docs/.vitepress/config.ts` and remove, fix, or intentionally mark any unresolved target.
- [x] 2.3 Normalize inline cross-links in Chinese and English docs so language-specific pages do not accidentally route learners to the wrong locale unless intended.
- [x] 2.4 Verify repository-prefixed asset paths for favicon, logo, stylesheet, and any newly added visual assets.
- [x] 2.5 Improve the 404 page experience with links to search, homepage, guide, reference, examples, and issue reporting.

## 3. Content Architecture Expansion

- [x] 3.1 Create a revised curriculum map covering Skills, MCP, Harness Engineering, OpenSpec, context engineering, tool use, retrieval, evaluation, deployment, safety, examples, and contribution.
- [x] 3.2 Add an MCP guide section with introduction, core concepts, server/client/tool/resource model, minimal practice, testing, and safety boundaries.
- [x] 3.3 Expand Harness Engineering docs into scenario design, mock servers, evaluators, fixtures, traces, regression workflows, and failure triage.
- [x] 3.4 Add agent workflow and context engineering pages that connect Skills, MCP, Harness, and OpenSpec into practical development loops.
- [x] 3.5 Add evaluation and quality pages covering test cases, judge design, regression suites, acceptance criteria, and release gates.
- [x] 3.6 Add deployment and tool-safety pages covering permissions, secrets, sandboxing, observability, and rollback considerations.
- [x] 3.7 Update example project pages so each includes setup commands, expected behavior, skills taught, checks, and extension ideas.
- [x] 3.8 Update contribution docs with local setup, writing standards, tutorial template, link audit command, and review checklist.

## 4. Bilingual Parity

- [x] 4.1 Create or update English landing pages for all official English navigation groups.
- [x] 4.2 Create or update Chinese landing pages for all official Chinese navigation groups.
- [x] 4.3 Add clear cross-language fallbacks only where full translation is intentionally deferred.
- [x] 4.4 Run the link audit against both locales and fix all required first-party failures.

## 5. Visual And Interaction Redesign

- [x] 5.1 Redesign the homepage first screen with project identity, primary learning action, GitHub trust path, and visible next-section learning map.
- [x] 5.2 Add polished section index layouts for major learning tracks without turning documentation pages into decorative landing pages.
- [x] 5.3 Refresh theme CSS for typography, spacing, cards, callouts, code blocks, tables, and next-step blocks.
- [x] 5.4 Add appropriate visual assets, icons, diagrams, or screenshots that support learning and resolve correctly under the GitHub Pages base path.
- [x] 5.5 Improve lightweight interactions such as copyable commands, practice checklists, progress cues, and next-step navigation.
- [x] 5.6 Check desktop and mobile layouts for text overflow, layout shift, focus visibility, and touch-target usability.

## 6. Verification And Release Readiness

- [x] 6.1 Run the local documentation build successfully.
- [x] 6.2 Run the internal-link audit successfully with zero required first-party failures.
- [x] 6.3 Run representative published-route smoke checks after deployment or preview publication.
- [x] 6.4 Review accessibility basics: heading hierarchy, alt text, focus visibility, keyboard navigation, and contrast.
- [x] 6.5 Review content completeness against the curriculum map and ensure every major track has concept, practice, troubleshooting, and next-step coverage.
- [x] 6.6 Check `git status` to confirm generated build output is not tracked.
- [x] 6.7 Document remaining deferred content or translation gaps before archiving the OpenSpec change.
