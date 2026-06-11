---
title: Tool Definition & Description
description: Master JSON Schema parameter definitions, description writing best practices, naming conventions, and nested object design
---

# Tool Definition & Description

Tool definitions are the foundation of Tool Use. A well-written definition significantly improves model call accuracy; a vague definition leads the model to either not call the tool at all or pass incorrect parameters.

## Basic Structure of a Tool Definition

Every tool needs three core parts:

```json
{
  "name": "search_web",
  "description": "Search the internet for information; returns titles, summaries, and links",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search keywords"
      },
      "max_results": {
        "type": "integer",
        "description": "Maximum number of results to return, default 5",
        "default": 5,
        "minimum": 1,
        "maximum": 20
      }
    },
    "required": ["query"]
  }
}
```

## JSON Schema Parameter Definitions

### Basic Types

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer" },
    "score": { "type": "number" },
    "active": { "type": "boolean" },
    "tags": { "type": "array", "items": { "type": "string" } }
  }
}
```

### Constraints

```json
{
  "type": "string",
  "description": "User email address",
  "format": "email",
  "minLength": 5,
  "maxLength": 255
}
```

```json
{
  "type": "integer",
  "description": "Page number",
  "minimum": 1,
  "maximum": 100
}
```

### Enumerated Values

When a parameter only accepts a few fixed options, use `enum` to restrict it:

```json
{
  "type": "string",
  "description": "Sort order",
  "enum": ["asc", "desc", "relevance"]
}
```

This prevents the model from inventing sort orders that don't exist.

### Nested Objects

Use nested objects to express complex parameters:

```json
{
  "type": "object",
  "description": "Filter criteria",
  "properties": {
    "date_range": {
      "type": "object",
      "properties": {
        "start": { "type": "string", "format": "date" },
        "end": { "type": "string", "format": "date" }
      }
    },
    "categories": {
      "type": "array",
      "items": { "type": "string" }
    },
    "min_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 100
    }
  }
}
```

### Required vs Optional

```json
{
  "type": "object",
  "properties": {
    "query": { "type": "string", "description": "Search terms" },
    "language": { "type": "string", "description": "Language filter, e.g. zh, en" },
    "safe_search": { "type": "boolean", "description": "Whether to enable safe search" }
  },
  "required": ["query"]
}
```

Parameters listed in `required` must be provided; the rest are optional. The model will more reliably pass required parameters when it sees `required`.

## Description Writing Best Practices

The description is the core basis for the model to understand a tool's purpose.

### ✅ Good Description

```json
{
  "name": "read_file",
  "description": "Read the contents of a file at the specified path. Supports text files, not binary files. The path must be an absolute path or relative to the project root directory."
}
```

Key points:
- Clearly states **what it does** (reads file contents)
- Clearly states **limitations** (does not support binary files)
- Clearly states **constraints** (path format requirements)

### ❌ Bad Description

```json
{
  "name": "read_file",
  "description": "Reads a file"
}
```

The model has no idea what formats are supported, how to write the path, or what restrictions apply.

### Description Writing Checklist

| Dimension | Check Item |
| --- | --- |
| Functionality | Does it clearly state what the tool does? |
| Limitations | Does it explain what is not supported? |
| Constraints | What format requirements do parameters have? |
| Side effects | Does calling this tool change external state? |
| Return value | What format of data does it return? |

## Parameter Naming Conventions

### Naming Style

```json
{
  "properties": {
    "user_id": { "type": "string" },      // ✅ snake_case
    "created_at": { "type": "string" },   // ✅ snake_case
    "max_retries": { "type": "integer" }  // ✅ snake_case
  }
}
```

Use `snake_case` consistently. Do not mix in `camelCase` (userId) or `kebab-case` (user-id).

### Naming Principles

```json
{
  "query": "search terms",              // ✅ concise and clear
  "search_query": "search terms",       // ❌ duplicates the tool name
  "q": "search terms",                  // ❌ too short, ambiguous
  "the_search_query_string": "search terms"  // ❌ redundant
}
```

## Parameter Design Patterns

### Pattern 1: Required + Optional Overrides

```json
{
  "name": "send_email",
  "parameters": {
    "type": "object",
    "properties": {
      "to": { "type": "string", "description": "Recipient email address" },
      "subject": { "type": "string", "description": "Email subject" },
      "body": { "type": "string", "description": "Email body" },
      "cc": { "type": "array", "items": { "type": "string" }, "description": "CC list" },
      "priority": { "type": "string", "enum": ["low", "normal", "high"], "default": "normal" }
    },
    "required": ["to", "subject", "body"]
  }
}
```

### Pattern 2: Mutually Exclusive Parameter Groups

```json
{
  "name": "query_database",
  "parameters": {
    "type": "object",
    "properties": {
      "sql": { "type": "string", "description": "Raw SQL query" },
      "table": { "type": "string", "description": "Table name to query" },
      "conditions": { "type": "object", "description": "Query conditions" }
    },
    "description": "Query the database. Choose one: provide sql to execute a raw query, or provide table + conditions for a conditional query."
  }
}
```

### Pattern 3: Optional Parameters with Defaults

```json
{
  "name": "fetch_page",
  "parameters": {
    "type": "object",
    "properties": {
      "url": { "type": "string", "description": "Target URL" },
      "timeout": { "type": "integer", "description": "Timeout in milliseconds, default 30000", "default": 30000 },
      "follow_redirects": { "type": "boolean", "description": "Whether to follow redirects, default true", "default": true }
    },
    "required": ["url"]
  }
}
```

## Exercises

Design tool definitions for the following scenarios:

1. **File search tool**: Search for files by name pattern in a project.
2. **Code refactoring tool**: Rename a function and update all call sites.
3. **API testing tool**: Send an HTTP request and return the response.

Requirement: Write complete JSON Schema including name, description, and parameters.

<details>
<summary>Reference Answer (File Search)</summary>

```json
{
  "name": "search_files",
  "description": "Search for files in the project using a glob pattern. Returns a list of matching file paths sorted by modification time in descending order.",
  "parameters": {
    "type": "object",
    "properties": {
      "pattern": {
        "type": "string",
        "description": "Glob pattern, e.g. '**/*.ts' or 'src/**/*.test.js'"
      },
      "root_dir": {
        "type": "string",
        "description": "Root directory for the search, defaults to project root"
      },
      "max_results": {
        "type": "integer",
        "description": "Maximum number of results, default 50",
        "default": 50,
        "minimum": 1,
        "maximum": 500
      }
    },
    "required": ["pattern"]
  }
}
```

</details>

## Common Mistakes

### Mistake 1: Missing Description

```json
{
  "name": "query_db",
  "parameters": {
    "type": "object",
    "properties": {
      "q": { "type": "string" }
    }
  }
}
```

The model doesn't know what this tool does — it will likely not call it or call it incorrectly.

### Mistake 2: Too Many Parameters

A tool with 20 parameters is likely to cause the model to miss or fill in wrong values. Split it into multiple tools.

### Mistake 3: Ambiguous Types

```json
{
  "data": { "type": "string", "description": "JSON data" }
}
```

If the data is indeed JSON, use `type: "object"` instead of string.

## Next Steps

→ [Tool Selection & Orchestration](/guide/tool-use/orchestration)
