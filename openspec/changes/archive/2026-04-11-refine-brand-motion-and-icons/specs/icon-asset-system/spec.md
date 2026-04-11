## ADDED Requirements

### Requirement: Reliable identity assets
The site SHALL render logo, favicon, and hero identity assets reliably in local preview, production build, and GitHub Pages deployment.

#### Scenario: Local preview identity paths
- **WHEN** local preview serves the site under `/ohmyopenAI-tutorial-hub/`
- **THEN** favicon, nav logo, and homepage hero image return successful HTTP responses

#### Scenario: Generated output identity paths
- **WHEN** the VitePress build completes
- **THEN** generated HTML references identity assets through paths that exist in the built output

### Requirement: Agent-engineering mark
The logo and favicon SHALL communicate agent engineering more specifically than a generic checkmark or status badge.

#### Scenario: Logo is reviewed
- **WHEN** the logo is displayed at homepage hero size
- **THEN** it suggests connected agents, protocol/context flow, evaluation, or learning systems without relying on a checkmark as the central metaphor

#### Scenario: Favicon is reviewed
- **WHEN** the favicon is displayed at small size
- **THEN** it remains legible and visually related to the main logo

### Requirement: Topic icon grammar
The site SHALL provide a consistent icon grammar for core learning modules.

#### Scenario: Learning module icons render
- **WHEN** the homepage or learning map shows Skills, MCP, OpenSpec, Harness, Context, Workflow, Evaluation, Deployment, or Safety
- **THEN** each module uses a semantically appropriate icon with consistent stroke, scale, radius, and color treatment

#### Scenario: Icon assets are audited
- **WHEN** visual asset verification runs
- **THEN** every referenced local icon asset exists and resolves under the project base path

### Requirement: Accessible asset text
Meaningful identity images SHALL have useful alt text and decorative icons SHALL not create noisy screen-reader output.

#### Scenario: Hero logo is rendered
- **WHEN** the homepage hero image is present
- **THEN** its alt text describes the brand identity meaningfully

#### Scenario: Decorative topic icons are rendered
- **WHEN** module icons are decorative next to visible text labels
- **THEN** they are hidden from assistive technology or have appropriate accessible labels
