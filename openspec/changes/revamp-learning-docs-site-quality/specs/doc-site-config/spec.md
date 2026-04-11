## ADDED Requirements

### Requirement: Navigation target completeness
VitePress navigation and sidebar configuration SHALL only expose first-party links that resolve to existing documentation pages or intentional cross-language fallbacks.

#### Scenario: Sidebar includes English reference items
- **WHEN** the English reference sidebar is configured
- **THEN** every sidebar item points to an existing `docs/en/reference/` page or a clearly intentional shared reference route

#### Scenario: Navigation audit reads config
- **WHEN** the internal-link audit runs
- **THEN** it checks first-party links declared in `docs/.vitepress/config.ts`

## MODIFIED Requirements

### Requirement: Base path consistency for project site
VitePress configuration SHALL use a repository-prefixed base path for deployment and all site-owned absolute assets or links SHALL remain compatible with that prefix.

#### Scenario: Base value matches repository path
- **WHEN** site config is loaded
- **THEN** `base` is set to `/ohmyopenAI-tutorial-hub/`

#### Scenario: First-party route is generated under project prefix
- **WHEN** the documentation site is built for GitHub Pages
- **THEN** first-party routes resolve correctly when served below `/ohmyopenAI-tutorial-hub/`

### Requirement: Asset path compatibility
Site-level asset URLs SHALL include repository prefix or VitePress-resolved paths so that favicon, stylesheet, logo, and visual assets resolve correctly in project-site deployment.

#### Scenario: Head assets resolve
- **WHEN** browser loads favicon and custom stylesheet
- **THEN** both resources are fetched successfully under `/ohmyopenAI-tutorial-hub/` prefix

#### Scenario: Homepage hero image resolves
- **WHEN** homepage renders hero image
- **THEN** logo path resolves successfully under project-site prefix

#### Scenario: Added visual assets resolve
- **WHEN** redesign assets are added for homepage, diagrams, icons, or learning cards
- **THEN** each asset is referenced through a path that works in local preview and GitHub Pages deployment

### Requirement: Build artifact hygiene
Build output SHALL NOT be tracked in version control and generated verification output SHALL stay outside source-controlled documentation unless intentionally committed.

#### Scenario: Dist folder tracking
- **WHEN** developer runs `git status`
- **THEN** `docs/.vitepress/dist` changes do not appear as tracked modifications

#### Scenario: Temporary verification build
- **WHEN** verification builds the site for audits
- **THEN** temporary output can be written outside the docs source tree without polluting tracked files
