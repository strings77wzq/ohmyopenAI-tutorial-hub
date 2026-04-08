# OpenSpec Practice Case: Golem Project

This chapter demonstrates the complete application of OpenSpec in a real production project using the Golem project as an example. Golem is a pure Go implementation of a cloud-native AI assistant framework, and the project has integrated the OpenSpec workflow.

## Goals

- Learn the complete OpenSpec workflow through a real project
- Demonstrate how to plan a feature from scratch
- Show how to make AI implement stably according to specs

## Project Background

Golem Project URL: https://github.com/strings77wzq/golem

**Project Features:**
- Pure Go implementation, single binary without dependencies
- Supports 7 major LLM providers
- Cloud-native deployment (Docker/K8s/Helm)
- Built-in Skills system and MCP client

## Case: Add MCP Server Management Feature

Suppose we want to add MCP server management functionality to Golem.

### Step 1: Explore Problem

Before determining the specific implementation, use the explore command to analyze requirements:

```bash
/opsx:explore "What core capabilities are needed for MCP server management feature"
```

AI will analyze:
- What is MCP (Model Context Protocol)
- Current MCP integration in the project
- What needs to be managed (server configuration, connection status, tool mapping, etc.)
- Possible technical approaches

### Step 2: Create Proposal

After confirming the approach, create a proposal:

```bash
/opsx:propose "Add MCP server management feature"
```

### AI Generated Document Structure

```
openspec/changes/add-mcp-server-management/
├── proposal.md
├── design.md
├── specs/
│   └── mcp-server/
│       └── spec.md
└── tasks.md
```

### Document Examples

#### proposal.md (Excerpt)

```markdown
## Why

Golem currently only supports loading MCP server configuration via command line parameters. Users want to dynamically manage MCP servers at runtime to improve user experience.

## What Changes

- Add MCP server configuration file format definition
- Implement MCP server CRUD APIs
- Add hot reload support
- Integrate with existing CLI and TUI

## Capabilities

- `mcp-server-config`: MCP server configuration specification
- `mcp-server-api`: MCP server management API specification
```

#### design.md (Excerpt)

## Goals

1. Support YAML format for MCP server configuration
2. Provide HTTP API to manage MCP servers
3. Support configuration hot reload
4. Maintain compatibility with existing system

## Decisions

### Configuration Format Choice

**Choice:** YAML

**Reason:**
- More familiar to users
- Supports comments
- Consistent with existing configuration file style

### API Design

Use RESTful style:
- GET /api/v1/mcp/servers - List all servers
- POST /api/v1/mcp/servers - Add server
- PUT /api/v1/mcp/servers/:name - Update server
- DELETE /api/v1/mcp/servers/:name - Delete server
```

#### specs/mcp-server/spec.md (Excerpt)

```markdown
## ADDED Requirements

### Requirement: MCP Server Configuration Format
The system SHALL support configuring MCP servers via YAML files.

#### Scenario: Configuration file format
- **WHEN** User creates `config/mcp-servers.yaml`
- **THEN** System can parse and load the configuration

### Requirement: MCP Server List API
The system SHALL provide an API to get configured MCP server list.

#### Scenario: Get server list
- **WHEN** User requests GET /api/v1/mcp/servers
- **THEN** Returns JSON array containing server names and status
```

#### tasks.md (Excerpt)

```markdown
## 1. Configuration Module

- [ ] 1.1 Create MCP server configuration struct
- [ ] 1.2 Implement YAML parsing functions
- [ ] 1.3 Add configuration validation logic

## 2. HTTP API

- [ ] 2.1 Add MCP server routes
- [ ] 2.2 Implement GET /servers endpoint
- [ ] 2.3 Implement POST /servers endpoint
- [ ] 2.4 Implement PUT /servers/:name endpoint
- [ ] 2.5 Implement DELETE /servers/:name endpoint

## 3. Integration

- [ ] 3.1 Integrate with CLI commands
- [ ] 3.2 Integrate with TUI
- [ ] 3.3 Add configuration hot reload feature

## 4. Testing

- [ ] 4.1 Write unit tests
- [ ] 4.2 Write integration tests
```

### Step 3: Implementation

After confirming documents are correct, start implementation:

```bash
/opsx:apply
```

AI will implement each item in tasks.md one by one and update progress in real-time.

### Step 4: Verification

After implementation is complete, verify it matches specifications:

```bash
/opsx:verify

Verification points:
- Are all requirements covered?
- Are scenarios reproducible?
- Does code follow design.md decisions?
```

### Step 5: Archive

After verification passes, archive the change:

```bash
/opsx:archive
```

After archiving, the change moves to `openspec/archive/`, and summary.md is generated recording the implementation summary.

## Real Project Reference

The Golem project has used OpenSpec to manage multiple changes. You can view real cases in the following directory:

```
golem/openspec/
├── changes/
│   ├── add-mcp-client/
│   ├── add-rag-pipeline/
│   └── optimize-agent-loop/
├── specs/
│   ├── agent/
│   ├── mcp/
│   └── providers/
└── archive/
```

Each change contains complete proposal.md, design.md, specs/, and tasks.md - the best reference for learning OpenSpec.

## What You Will Learn

- How to converge "ideas" into executable specifications
- How to make AI execute stably instead of "writing code by feel"
- How to reach consensus with AI through specification documents
- How to apply OpenSpec in real production projects

## Next Steps

View the complete OpenSpec directory of the Golem project:

→ [Golem GitHub](https://github.com/strings77wzq/golem)

→ [Core Concepts](/en/guide/openspec/concepts)

→ [Command Reference](/en/guide/openspec/commands)