# doc-site-config

## Requirements

### Requirement: Base path consistency for project site
VitePress configuration SHALL use a repository-prefixed base path for deployment.

#### Scenario: Base value matches repository path
- **WHEN** site config is loaded
- **THEN** `base` is set to `/ohmyopenAI-tutorial-hub/`

### Requirement: Asset path compatibility
Site-level asset URLs SHALL include repository prefix so that favicon, stylesheet, and logo resolve correctly in project-site deployment.

#### Scenario: Head assets resolve
- **WHEN** browser loads favicon and custom stylesheet
- **THEN** both resources are fetched successfully under `/ohmyopenAI-tutorial-hub/` prefix

#### Scenario: Homepage hero image resolves
- **WHEN** homepage renders hero image
- **THEN** logo path resolves successfully under project-site prefix

### Requirement: Build artifact hygiene
Build output SHALL NOT be tracked in version control.

#### Scenario: Dist folder tracking
- **WHEN** developer runs `git status`
- **THEN** `docs/.vitepress/dist` changes do not appear as tracked modifications
