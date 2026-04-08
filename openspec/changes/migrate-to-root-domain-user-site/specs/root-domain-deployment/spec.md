## ADDED Requirements

### Requirement: Root domain routing
The site SHALL be reachable at `https://strings77wzq.github.io/` and all primary docs routes SHALL resolve without repository prefix.

#### Scenario: Quickstart route on root domain
- **WHEN** user visits `https://strings77wzq.github.io/guide/quickstart`
- **THEN** quickstart page is rendered successfully

#### Scenario: OpenSpec command route on root domain
- **WHEN** user visits `https://strings77wzq.github.io/guide/openspec/commands`
- **THEN** commands page is rendered successfully

### Requirement: User Site repository contract
Deployment SHALL use a GitHub Pages User Site repository named exactly `<owner>.github.io`.

#### Scenario: Repository naming
- **WHEN** deployment target repository is configured
- **THEN** repository name is `strings77wzq.github.io`

#### Scenario: Pages URL mapping
- **WHEN** GitHub Pages is enabled for the User Site repository
- **THEN** published URL root is `https://strings77wzq.github.io/`
