## ADDED Requirements

### Requirement: Internal link audit
The documentation project SHALL provide a repeatable audit that detects broken first-party links before release.

#### Scenario: Missing Markdown target is reported
- **WHEN** a Markdown page, VitePress nav item, sidebar item, or embedded HTML anchor points to a first-party route with no corresponding source page or generated output
- **THEN** the audit reports the source file, line, and missing route

#### Scenario: Existing page target passes
- **WHEN** a first-party link points to an existing page under `docs/`
- **THEN** the audit treats extensionless, trailing-slash, and `.html` route forms according to the configured VitePress URL strategy

### Requirement: Published route smoke checks
The documentation project SHALL define a release smoke check for representative GitHub Pages routes under `/ohmyopenAI-tutorial-hub/`.

#### Scenario: Key published routes return success
- **WHEN** the smoke check requests the homepage, Chinese entry, English entry, quickstart, reference, examples, and major guide routes
- **THEN** each route returns a successful HTTP status and serves documentation HTML rather than the GitHub Pages 404 page

#### Scenario: Known missing English reference pages are fixed
- **WHEN** a user opens `/ohmyopenAI-tutorial-hub/en/reference/commands` or `/ohmyopenAI-tutorial-hub/en/reference/faq`
- **THEN** the site renders the corresponding English reference page successfully

### Requirement: Broken-link regression gate
The documentation project SHALL fail quality verification when required first-party links are broken.

#### Scenario: Required internal link is broken
- **WHEN** verification runs before publication
- **THEN** any broken required first-party link causes the verification to fail with actionable output

#### Scenario: External link is unstable
- **WHEN** an external reference cannot be reached during advisory checking
- **THEN** the verification records the unstable external URL separately from required first-party failures

### Requirement: Friendly 404 recovery
The documentation site SHALL provide a useful 404 page for users who reach a missing route.

#### Scenario: User lands on missing route
- **WHEN** a user opens a non-existent documentation route
- **THEN** the 404 page offers search, homepage, guide, reference, examples, and GitHub issue links
