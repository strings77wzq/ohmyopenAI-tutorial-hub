# MCP Practice

Practice goal: design a documentation search capability as an MCP tool, then validate that common failure modes do not mislead the agent.

## Task

Create a `search_docs` capability note with:

- Tool description.
- Input schema.
- Output schema.
- 3 success examples.
- 4 failure or boundary examples.
- Safety boundary notes.

## Acceptance criteria

- Empty query does not search.
- Result count is capped.
- No-result responses include a next step.
- Results include source URLs.
- Errors do not reveal local paths, environment variables, or secrets.

## Self-check

1. Does this tool have side effects?
2. Can the agent continue after an error?
3. Is the response small enough for context?
4. How does the Harness fail if the data source is unavailable?

Next: connect this tool through [Workflow Orchestration](/en/guide/agent-workflows/) and define regression checks in [Evaluation and Quality](/en/guide/evaluation/).
