---
title: "Practice: Building a Tool Set"
description: Build a complete tool set from scratch covering file operations, API calls, and data queries — master the full tool design workflow
---

# Practice: Building a Tool Set

This section walks through a complete example, building a practical tool set from scratch covering three major scenarios: file operations, API calls, and data queries.

## Scenario Setup

You are building a **developer assistant agent** that needs to help developers with everyday tasks:

- Read and search project files
- Call the GitHub API to fetch repository information
- Query a database to get user data

## Step 1: Design the Tool Inventory

First, list out the tools you need:

| Tool Name | Function | Type |
| --- | --- | --- |
| `read_file` | Read file contents | File operation |
| `search_files` | Search files by pattern | File operation |
| `list_directory` | List directory contents | File operation |
| `github_repo_info` | Get basic repository info | API call |
| `github_search_code` | Search code in a repository | API call |
| `query_users` | Query user list | Data query |
| `get_user_detail` | Get user details | Data query |

## Step 2: Define Each Tool

### File Operation Tools

```json
{
  "name": "read_file",
  "description": "Read the contents of a file at the specified path. Returns the full text content. The path must be an absolute path or relative to the project root directory.",
  "parameters": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "File path, e.g. 'src/main.ts' or '/absolute/path/file.txt'"
      },
      "encoding": {
        "type": "string",
        "enum": ["utf-8", "base64"],
        "default": "utf-8",
        "description": "File encoding"
      },
      "max_lines": {
        "type": "integer",
        "description": "Maximum number of lines to return, default 1000",
        "default": 1000
      }
    },
    "required": ["path"]
  }
}
```

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
        "description": "Root directory for the search, defaults to project root",
        "default": "."
      },
      "max_results": {
        "type": "integer",
        "description": "Maximum number of results, default 50",
        "default": 50
      }
    },
    "required": ["pattern"]
  }
}
```

### API Call Tools

```json
{
  "name": "github_repo_info",
  "description": "Get basic information about a GitHub repository, including star count, fork count, language, and recent commits.",
  "parameters": {
    "type": "object",
    "properties": {
      "owner": {
        "type": "string",
        "description": "Repository owner, e.g. 'facebook'"
      },
      "repo": {
        "type": "string",
        "description": "Repository name, e.g. 'react'"
      }
    },
    "required": ["owner", "repo"]
  }
}
```

```json
{
  "name": "github_search_code",
  "description": "Search for code in a specified GitHub repository. Returns matching file paths and code snippets.",
  "parameters": {
    "type": "object",
    "properties": {
      "owner": { "type": "string", "description": "Repository owner" },
      "repo": { "type": "string", "description": "Repository name" },
      "query": { "type": "string", "description": "Search keywords" },
      "language": {
        "type": "string",
        "description": "Filter by programming language",
        "enum": ["typescript", "javascript", "python", "go", "rust", "java"]
      }
    },
    "required": ["owner", "repo", "query"]
  }
}
```

### Data Query Tools

```json
{
  "name": "query_users",
  "description": "Query user list with filtering by status and role. Returns paginated results.",
  "parameters": {
    "type": "object",
    "properties": {
      "status": {
        "type": "string",
        "enum": ["active", "inactive", "all"],
        "default": "all",
        "description": "Filter by user status"
      },
      "role": {
        "type": "string",
        "enum": ["admin", "editor", "viewer"],
        "description": "Filter by role"
      },
      "page": {
        "type": "integer",
        "default": 1,
        "description": "Page number"
      },
      "page_size": {
        "type": "integer",
        "default": 20,
        "description": "Items per page"
      }
    },
    "required": []
  }
}
```

## Step 3: Implement Tool Logic

### read_file Implementation

```python
import os

async def read_file(path: str, encoding: str = "utf-8", max_lines: int = 1000):
    # Security check: restrict path scope
    abs_path = os.path.abspath(path)
    if not abs_path.startswith(os.environ["PROJECT_ROOT"]):
        return {
            "status": "error",
            "error": {
                "code": "FORBIDDEN",
                "message": "Access to files outside the project directory is not allowed"
            }
        }

    # Check if file exists
    if not os.path.exists(abs_path):
        return {
            "status": "error",
            "error": {
                "code": "NOT_FOUND",
                "message": f"File does not exist: {path}"
            }
        }

    # Check file size
    file_size = os.path.getsize(abs_path)
    if file_size > 10 * 1024 * 1024:  # 10MB
        return {
            "status": "error",
            "error": {
                "code": "FILE_TOO_LARGE",
                "message": f"File too large: {file_size / 1024 / 1024:.1f}MB, max supported is 10MB"
            }
        }

    # Read file
    with open(abs_path, "r", encoding=encoding) as f:
        lines = []
        for i, line in enumerate(f):
            if i >= max_lines:
                break
            lines.append(line)

    return {
        "status": "success",
        "content": "".join(lines),
        "total_lines": len(lines),
        "truncated": len(lines) >= max_lines
    }
```

### search_files Implementation

```python
import glob
import os

async def search_files(pattern: str, root_dir: str = ".", max_results: int = 50):
    search_path = os.path.join(root_dir, pattern)
    matches = glob.glob(search_path, recursive=True)

    # Sort by modification time descending
    matches.sort(key=lambda f: os.path.getmtime(f), reverse=True)

    # Truncate
    truncated = len(matches) > max_results
    matches = matches[:max_results]

    return {
        "status": "success",
        "files": matches,
        "count": len(matches),
        "truncated": truncated
    }
```

## Step 4: Compose a Tool Chain

A typical multi-tool collaboration scenario:

```
User: "Look at how useState is implemented in the React repository"

Tool chain:
  1. github_search_code(
       owner: "facebook",
       repo: "react",
       query: "useState",
       language: "typescript"
     )
  → Found file: packages/react/src/ReactHooks.ts

  2. github_get_file_content(
       owner: "facebook",
       repo: "react",
       path: "packages/react/src/ReactHooks.ts"
     )
  → Get file contents

  3. Synthesize analysis, generate reply
```

### Orchestration Code

```python
async def analyze_react_hook(hook_name):
    # Step 1: Search for code location
    search_result = await call_tool("github_search_code", {
        "owner": "facebook",
        "repo": "react",
        "query": hook_name,
        "language": "typescript"
    })

    if not search_result["items"]:
        return f"Implementation of {hook_name} not found"

    # Step 2: Get file contents
    file_path = search_result["items"][0]["path"]
    file_content = await call_tool("github_get_file_content", {
        "owner": "facebook",
        "repo": "react",
        "path": file_path
    })

    # Step 3: Generate analysis report
    return {
        "hook_name": hook_name,
        "file": file_path,
        "content": file_content["content"],
        "analysis": analyze_code(file_content["content"])
    }
```

## Step 5: Error Handling

Add complete error handling to each tool:

```python
async def safe_tool_call(tool_name, params, fallback=None):
    try:
        result = await call_tool(tool_name, params)
        if result["status"] == "success":
            return result
        # Tool returned an error
        return handle_tool_error(tool_name, result["error"])
    except TimeoutError:
        if fallback:
            return await fallback()
        return {
            "status": "error",
            "error": {"code": "TIMEOUT", "message": f"{tool_name} call timed out"}
        }
    except Exception as e:
        return {
            "status": "error",
            "error": {"code": "UNKNOWN", "message": str(e)}
        }
```

## Exercises

Based on the above tool set, complete the following tasks:

1. Design a tool: `create_github_issue` for creating issues on GitHub.
2. Add a new filter dimension to the `query_users` tool: `created_after` (users registered after a given time).
3. Combine `search_files` and `read_file` to implement a tool chain that "searches for files containing a specific keyword and reads their contents."

## Common Questions

### Q: Is there a limit to the number of tools?

It is recommended that a single agent has no more than 15-20 tools. Too many tools reduce the model's selection accuracy. You can use tool categorization (similar to MCP's resource concept) or compose them into higher-level tools.

### Q: How should I decide on tool granularity?

| Granularity | Pros | Cons |
| --- | --- | --- |
| Fine-grained | Flexible composition | Many calls, complex chains |
| Coarse-grained | Simple to call | Less flexible, bloated parameters |

Rule of thumb: one tool does one thing, but don't over-split. `read_file` is a good granularity; `read_file_line_42` is too fine.

### Q: Do tool definitions need version control?

Yes. Tool definitions and implementations should be version-controlled together. When parameters change, consider backward compatibility.

## Next Steps

→ [Security Boundaries & Access Control](/guide/tool-use/safety)
