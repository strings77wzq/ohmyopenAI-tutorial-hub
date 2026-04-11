# Retrieval and Knowledge

Retrieval lets an agent find relevant docs, code, and records when needed instead of stuffing all project knowledge into a prompt.

## Good retrieval targets

- API docs and release notes.
- Architecture notes.
- Code symbols and call relationships.
- Historical decisions, OpenSpec changes, and incident notes.
- Log and test failure summaries.

## Retrieval quality

| Standard | Meaning |
| --- | --- |
| Relevance | Result directly supports the current problem |
| Freshness | Source is not stale |
| Traceability | Result links back to a file, URL, or commit |
| Compactness | Summary is short enough for context |
| Verifiability | Claim can be confirmed by reading or testing |

## Relationship to MCP

MCP can expose retrieval as a resource or tool:

- Use a resource for stable readable material.
- Use a tool for parameterized search, filtering, or aggregation.

## Practice

Design a retrieval strategy for this tutorial site:

1. Which directories should be indexed?
2. How many results should return?
3. What fields does each result need?
4. How do you avoid stale pages and 404 links?

Next: [Evaluation and Quality](/en/guide/evaluation/).
