## ADDED Requirements

### Requirement: Professional bilingual brand
The documentation site SHALL use a professional bilingual brand identity instead of the generic `AI 编程教程` label.

#### Scenario: Chinese homepage brand renders
- **WHEN** a Chinese user opens the homepage
- **THEN** the primary brand reads as `Agent Engineering Hub` with `智能体工程学习枢纽` or an equivalent professional Chinese descriptor nearby

#### Scenario: English homepage brand renders
- **WHEN** an English user opens the homepage
- **THEN** the primary brand reads as `Agent Engineering Hub` with copy that explains agent-engineering learning scope

### Requirement: Metadata consistency
The site SHALL use consistent brand language across VitePress metadata and visible page copy.

#### Scenario: Site metadata is generated
- **WHEN** the site is built
- **THEN** title, description, OG title, OG description, footer, homepage hero, and meaningful image alt text use the same brand hierarchy

#### Scenario: Deprecated generic name is checked
- **WHEN** brand verification runs
- **THEN** `AI 编程教程` is not present in public-facing metadata or homepage hero copy

### Requirement: Professional product voice
The homepage and key entry pages SHALL describe the project as an agent-engineering learning system rather than a casual AI coding tutorial.

#### Scenario: User scans homepage
- **WHEN** a user reads the first screen and learning map
- **THEN** the copy clearly communicates Skills, MCP, OpenSpec, Harness, context, evaluation, and deployment as one engineering discipline

#### Scenario: User evaluates open-source credibility
- **WHEN** a user reviews homepage trust signals
- **THEN** the site exposes GitHub, license, learning scope, and quality gates with concise professional wording
