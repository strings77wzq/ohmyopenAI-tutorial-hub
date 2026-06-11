# Agent Engineering Hub 🤖

> A systematic learning path for AI Agent engineering — from concepts to production.
>
> 智能体工程学习系统：从概念到实战，从工具到架构

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Docs](https://img.shields.io/badge/docs-121%20pages-brightgreen)](https://strings77wzq.github.io/agent-engineering-hub/)
[![Bilingual](https://img.shields.io/badge/CN%2FEN-bilingual-blue)](https://strings77wzq.github.io/agent-engineering-hub/en/)

## Technology Evolution

```
Prompt Engineering                    Skills (oh-my-openagent)
       ↓                                  ↓
 Solves prompt redundancy            Reusable capability modules
       ↓                                  ↓
MCP (Model Context Protocol)     OpenSpec (Spec-Driven)
       ↓                                  ↓
Standardized context protocol     Spec-driven development
       ↓                                  ↓
Harness Engineering            golem (production-grade)
       ↓
AI output quality assurance
```

## Core Modules

| Module | Description | GitHub |
|--------|-------------|--------|
| **OMO Workflow** | Multi-model orchestration, 11 agents | [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) |
| **golem** | Production-grade Go Agent system | [golem](https://github.com/strings77wzq/golem) |
| **Skills** | Reusable AI capability modules | [skills.sh](https://skills.sh) |
| **MCP** | Standardized context protocol | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| **OpenSpec** | Spec-driven development (SDD) | [openspec](https://github.com/code-yeongyu/openspec) |
| **Harness** | AI output quality assurance | R.E.S.T model |

## Quick Start

**[Online Tutorial](https://strings77wzq.github.io/agent-engineering-hub/)** · **[GitHub →](https://github.com/strings77wzq/agent-engineering-hub)**

### Choose Your Path

| Role | Path | Start → |
|------|------|---------|
| **Full-stack Developer** | Quick start → Tools → Projects | [Begin →](https://strings77wzq.github.io/agent-engineering-hub/guide/quickstart.html) |
| **Architect** | Deep dive → OpenSpec → Harness | [Explore →](https://strings77wzq.github.io/agent-engineering-hub/guide/openspec/concepts.html) |
| **Student** | Concepts → Progressive → Practice | [Learn →](https://strings77wzq.github.io/agent-engineering-hub/guide/) |

## Tutorial Modules

### Skills
Learn to create and use reusable AI capability modules.

1. [What is a Skill](https://strings77wzq.github.io/agent-engineering-hub/guide/skills/what-is-skill.html) — Core concepts
2. [Create Your First Skill](https://strings77wzq.github.io/agent-engineering-hub/guide/skills/first-skill.html) — Step-by-step guide
3. [Skill Components](https://strings77wzq.github.io/agent-engineering-hub/guide/skills/components.html) — name, description, prompt, examples
4. [Advanced Patterns](https://strings77wzq.github.io/agent-engineering-hub/guide/skills/advanced.html) — Conditionals, variables, tool calls
5. [Practice](https://strings77wzq.github.io/agent-engineering-hub/guide/skills/practice.html) — Code review Skill example

### MCP
Expose tools, resources, and context to agents via a standard protocol.

1. [MCP Introduction](https://strings77wzq.github.io/agent-engineering-hub/guide/mcp/) — Protocol roles and boundaries
2. [Core Concepts](https://strings77wzq.github.io/agent-engineering-hub/guide/mcp/concepts.html) — tools, resources, prompts
3. [Build an MCP Server](https://strings77wzq.github.io/agent-engineering-hub/guide/mcp/server.html) — Testable interface design
4. [Practice](https://strings77wzq.github.io/agent-engineering-hub/guide/mcp/practice.html) — Document search tool
5. [Safety Boundaries](https://strings77wzq.github.io/agent-engineering-hub/guide/mcp/safety.html) — Permissions, secrets, dangerous ops

### OpenSpec
Master the spec-driven development workflow.

1. [Core Concepts](https://strings77wzq.github.io/agent-engineering-hub/guide/openspec/concepts.html) — SDD intro, OpenSpec philosophy
2. [Commands](https://strings77wzq.github.io/agent-engineering-hub/guide/openspec/commands.html) — `/opsx:` command reference
3. [Workflow](https://strings77wzq.github.io/agent-engineering-hub/guide/openspec/workflow.html) — propose → apply → archive
4. [Writing Specs](https://strings77wzq.github.io/agent-engineering-hub/guide/openspec/writing-specs.html) — Tips and patterns
5. [Practice](https://strings77wzq.github.io/agent-engineering-hub/guide/openspec/practice.html) — E-commerce scenario

### Harness
Build quality infrastructure for AI engineering.

1. [Testing Infrastructure](https://strings77wzq.github.io/agent-engineering-hub/guide/harness/intro.html) — Harness core concepts
2. [Writing Tests](https://strings77wzq.github.io/agent-engineering-hub/guide/harness/writing-tests.html) — Test case design
3. [Evaluators](https://strings77wzq.github.io/agent-engineering-hub/guide/harness/evaluators.html) — Output quality evaluation
4. [Mock Server](https://strings77wzq.github.io/agent-engineering-hub/guide/harness/mock-server.html) — Zero-cost testing
5. [Practice](https://strings77wzq.github.io/agent-engineering-hub/guide/harness/practice.html) — Complete test workflow

## Why Learn This?

1. **Systematic** — Complete path from prompts to production-grade agent systems
2. **Hands-on** — Built around the real golem production project
3. **Quality-driven** — Harness engineering ensures reliable AI output

## Related Links

- 🌐 **Tutorial**: https://strings77wzq.github.io/agent-engineering-hub/
- 📚 **OMO Workflow**: https://github.com/code-yeongyu/oh-my-openagent
- 💻 **golem**: https://github.com/strings77wzq/golem
- 🛠️ **Skills**: https://skills.sh
- 📖 **MCP Protocol**: https://modelcontextprotocol.io

## Quality Gates

Every change passes automated checks:

| Check | Tool | Status |
|-------|------|--------|
| Link audit | `npm run docs:check-links` | ✅ 121 pages, zero dead links |
| Route validation | `npm run docs:check-routes` | ✅ All sidebar links reachable |
| Frontmatter | `npm run docs:check-frontmatter` | ✅ All pages have structured titles |
| Build | `npm run docs:build` | ✅ ~7s, zero warnings |
| Stale changes | `npm run docs:check-stale` | ✅ Zero active openspec changes |
| Search | VitePress local search | ✅ CN/EN bilingual |

```bash
npm test              # Run all automated checks
npm run docs:build    # Production build verification
npm run test:all      # Full checks + build
```

## Contributing

Contributions welcome! See [Contributing Guide](./contributing.md).

## License

[MIT](./LICENSE)
