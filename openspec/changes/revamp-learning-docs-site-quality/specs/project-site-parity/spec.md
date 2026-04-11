## ADDED Requirements

### Requirement: Full published route parity
The GitHub Pages project site SHALL publish every first-party route that official navigation, sidebars, homepage cards, and inline tutorial links expose.

#### Scenario: Official route list is checked
- **WHEN** the published route smoke check runs
- **THEN** it includes all official landing, guide, reference, example, Chinese, and English routes

#### Scenario: Navigation route is missing
- **WHEN** an official route returns the GitHub Pages 404 page
- **THEN** release verification fails and identifies the route

## MODIFIED Requirements

### Requirement: Project Site URL shape
The documentation site SHALL be served as a GitHub Pages Project Site with repository prefix in all official routes, including generated page routes and important extensionless entry routes.

#### Scenario: Quickstart path under project prefix
- **WHEN** user visits `https://strings77wzq.github.io/ohmyopenAI-tutorial-hub/guide/quickstart`
- **THEN** quickstart page is rendered successfully

#### Scenario: OpenSpec commands path under project prefix
- **WHEN** user visits `https://strings77wzq.github.io/ohmyopenAI-tutorial-hub/guide/openspec/commands`
- **THEN** commands page is rendered successfully

#### Scenario: English FAQ path under project prefix
- **WHEN** user visits `https://strings77wzq.github.io/ohmyopenAI-tutorial-hub/en/reference/faq`
- **THEN** English FAQ page is rendered successfully rather than the GitHub Pages 404 page

### Requirement: Language entry parity
The site SHALL provide language entry behavior aligned to the reference style, including explicit Chinese and English entry routes and no missing pages from language-specific navigation.

#### Scenario: Chinese entry route
- **WHEN** user opens `/ohmyopenAI-tutorial-hub/zh/`
- **THEN** Chinese documentation entry is reachable

#### Scenario: English entry route
- **WHEN** user opens `/ohmyopenAI-tutorial-hub/en/`
- **THEN** English documentation entry is reachable

#### Scenario: English navigation route
- **WHEN** user opens a route exposed from English navigation
- **THEN** the route is reachable in English or is marked as an intentional shared-language fallback
