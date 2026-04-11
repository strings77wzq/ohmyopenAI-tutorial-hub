## MODIFIED Requirements

### Requirement: Asset path compatibility
Site-level asset URLs SHALL include repository prefix or VitePress-resolved paths so that favicon, stylesheet, logo, hero image, and local icon assets resolve correctly in project-site deployment and local preview.

#### Scenario: Head assets resolve
- **WHEN** browser loads favicon and custom stylesheet
- **THEN** both resources are fetched successfully under `/ohmyopenAI-tutorial-hub/` prefix

#### Scenario: Homepage hero image resolves
- **WHEN** homepage renders hero image
- **THEN** logo path resolves successfully under project-site prefix

#### Scenario: Local preview identity assets resolve
- **WHEN** local preview runs at `http://localhost:4174/ohmyopenAI-tutorial-hub/`
- **THEN** favicon, nav logo, homepage hero image, and topic icons return successful HTTP responses

## ADDED Requirements

### Requirement: Brand metadata consistency
VitePress configuration SHALL expose the professional brand name and description consistently across title, description, Open Graph metadata, footer, and locale-visible copy.

#### Scenario: Config metadata is loaded
- **WHEN** `docs/.vitepress/config.ts` is inspected
- **THEN** public metadata uses `Agent Engineering Hub` or the approved bilingual descriptor instead of `AI 编程教程`

#### Scenario: Built HTML is inspected
- **WHEN** generated homepage HTML is inspected
- **THEN** title and social metadata match the approved brand identity
