# Build an MCP Server

This chapter uses a documentation search server as a design example. You can implement it with any MCP SDK; the tutorial focuses on interface shape and quality criteria.

## Capability definition

Goal: let an agent search tutorial pages and receive a few high-quality candidate links.

```json
{
  "name": "search_docs",
  "description": "Search tutorial pages by keyword.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" },
      "limit": { "type": "number", "default": 5 }
    },
    "required": ["query"]
  }
}
```

## Response

```json
{
  "results": [
    {
      "title": "MCP Introduction",
      "url": "/en/guide/mcp/",
      "summary": "Explains MCP responsibilities and a minimal design flow.",
      "score": 0.92
    }
  ]
}
```

## Harness scenarios

| Scenario | Input | Expected |
| --- | --- | --- |
| Normal search | `{"query":"MCP"}` | Related pages, no more than limit |
| Empty query | `{"query":""}` | Structured error |
| No results | `{"query":"unknown-term"}` | Empty array and next-step hint |
| Excessive limit | `{"query":"Skill","limit":1000}` | Limit is capped |

## Implementation checklist

- Stable tool name.
- Input and output schemas.
- Agent-readable errors.
- No secrets in logs.
- Harness covers success and failure.
- Docs include sample request and response.

Next: [MCP Practice](/en/guide/mcp/practice).
