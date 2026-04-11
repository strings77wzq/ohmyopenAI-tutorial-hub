# MCP Core Concepts

MCP is useful because it turns context entry points into discoverable, testable, governable interfaces.

## Tools

A tool is an executable action. It may compute, query, write, or trigger an external system.

Every tool should define:

- Input schema.
- Output schema.
- Side effects.
- Error representation.
- Permission or confirmation needs.

## Resources

A resource is readable context. It is useful for files, knowledge records, configuration fragments, log excerpts, or business entities.

Good resources are:

- Paginated or size-limited.
- Stable by identifier.
- Clear about source and freshness.
- Small enough for context windows.

## Prompts

Prompts are reusable task templates. Use them to package workflows instead of placing every behavior in a single system prompt.

## Safety boundaries

- Default to read-only.
- Name write operations explicitly.
- Keep secrets outside model context.
- Avoid leaking internal paths or credentials.
- Cover permission denial with Harness scenarios.

Next: [Build an MCP Server](/en/guide/mcp/server).
