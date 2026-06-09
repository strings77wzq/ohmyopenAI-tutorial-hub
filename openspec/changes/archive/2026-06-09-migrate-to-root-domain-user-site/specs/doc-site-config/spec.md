## ADDED Requirements

### Requirement: Root base configuration
VitePress configuration SHALL use root base for publishing.

#### Scenario: Base value
- **WHEN** docs site config is loaded
- **THEN** `base` is set to `'/'`

### Requirement: Asset path normalization
All site-level asset references SHALL remove the old project prefix and resolve from root.

#### Scenario: Config-level assets
- **WHEN** favicon, stylesheet, and logo paths are read from site config
- **THEN** paths are root-based (e.g., `/favicon.svg`, `/custom.css`, `/logo.svg`)

#### Scenario: Homepage hero assets
- **WHEN** homepage hero image paths are read from docs index files
- **THEN** image source uses root-based path `/logo.svg`

### Requirement: Link compatibility after migration
Primary internal links SHALL remain valid after switching to root base.

#### Scenario: Homepage CTA links
- **WHEN** user clicks quickstart and guide CTA links from homepage
- **THEN** target pages open successfully under root-domain routes
