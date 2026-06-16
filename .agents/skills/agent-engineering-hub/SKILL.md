```markdown
# agent-engineering-hub Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches you the core development patterns, coding conventions, and collaborative workflows used in the `agent-engineering-hub` repository. The project is written in TypeScript and centers on modular documentation, design-driven development, and clear project planning. You'll learn how to expand documentation, implement and archive design changes, and maintain project roadmaps using established conventions and commands.

## Coding Conventions

- **File Naming:**  
  Use camelCase for file names.  
  _Example:_  
  ```
  agentConfig.ts
  sidebarLinks.ts
  ```

- **Import Style:**  
  Use relative imports.  
  _Example:_  
  ```typescript
  import agentConfig from './agentConfig'
  import { getSidebarLinks } from '../utils/sidebarLinks'
  ```

- **Export Style:**  
  Use default exports.  
  _Example:_  
  ```typescript
  const agentConfig = { /* ... */ }
  export default agentConfig
  ```

- **Commit Messages:**  
  Follow [Conventional Commits](https://www.conventionalcommits.org/) with these prefixes:  
  - `fix:`
  - `docs:`
  - `feat:`
  - `chore:`
  - `spec:`
  - `refactor:`
  
  _Example:_  
  ```
  feat: add sidebar navigation for new module
  ```

## Workflows

### Content Module Expansion
**Trigger:** When you want to add new learning modules or expand existing ones in the documentation  
**Command:** `/add-module-content`

1. Create new `.md` files for each subpage under `docs/guide/<module>/`.
2. Update `docs/.vitepress/config.ts` to reflect the new sidebar structure and navigation.
3. If applicable, create or update English versions under `docs/en/guide/<module>/`.
4. Run tests to validate links, routes, and frontmatter.
5. Build docs to ensure no warnings or errors.

_Example:_
```bash
# Add a new module
mkdir -p docs/guide/agents
touch docs/guide/agents/overview.md

# Update sidebar in docs/.vitepress/config.ts
# (edit the sidebar array to include the new module)

# Build and test
npm run docs:build
npm run test
```

### Design Spec to Implementation and Archive
**Trigger:** When you want to make a significant design or theme change that requires planning, implementation, and documentation  
**Command:** `/new-design-spec`

1. Draft spec, proposal, and tasks under `openspec/changes/<change-name>/`.
   - `design.md`, `proposal.md`, `tasks.md`
2. Implement changes in code or theme files (e.g., CSS refactor, color/typography/spacing/motion tokens, homepage redesign).
   - Edit files like `docs/.vitepress/theme/custom.css` or `docs/.vitepress/theme/tokens/*.css`
3. Validate changes via tests and build.
4. Archive completed spec/proposal/tasks to `openspec/changes/archive/`.
5. Update `openspec/specs/` as needed.

_Example:_
```bash
# Create a new spec
mkdir -p openspec/changes/color-refresh
touch openspec/changes/color-refresh/design.md
touch openspec/changes/color-refresh/proposal.md
touch openspec/changes/color-refresh/tasks.md

# Implement and test
vim docs/.vitepress/theme/tokens/colors.css
npm run test
npm run docs:build

# Archive after completion
mv openspec/changes/color-refresh openspec/changes/archive/
```

### Project Roadmap and TODOs Update
**Trigger:** When you want to clarify project status, next steps, or document completed/planned work for visibility  
**Command:** `/update-todos`

1. Create or update `TODOS.md` and/or `ROADMAP.md` with grouped tasks, priorities, and completion status.
2. Reference CEO plan or other high-level planning sources as needed.
3. Mark completed items and update week/PR groupings.

_Example:_
```markdown
# TODOS.md

## Week 24
- [x] Add sidebar navigation
- [ ] Refactor theme tokens

# ROADMAP.md

- Q2: Complete documentation for all modules
- Q3: Redesign homepage and navigation
```

## Testing Patterns

- **Test File Naming:**  
  Test files use the `*.test.*` pattern.  
  _Example:_  
  ```
  agentConfig.test.ts
  sidebarLinks.test.ts
  ```

- **Test Framework:**  
  No framework detected, but standard TypeScript/Jest patterns are likely.

- **Typical Test Structure:**  
  _Example:_  
  ```typescript
  import agentConfig from './agentConfig'

  describe('agentConfig', () => {
    it('should have a valid default export', () => {
      expect(agentConfig).toBeDefined()
    })
  })
  ```

## Commands

| Command             | Purpose                                                        |
|---------------------|----------------------------------------------------------------|
| /add-module-content | Add or expand documentation modules and update navigation       |
| /new-design-spec    | Start a new design/refactor spec and track its implementation  |
| /update-todos       | Update project TODOs and roadmap documents                     |
```
