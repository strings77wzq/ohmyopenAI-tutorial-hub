# MCP Safety Boundaries

MCP servers often connect to real systems, so safety design must come before feature growth.

## Default rules

- Default to read-only.
- Mark side effects for every tool.
- Keep secrets in the server runtime, not model context.
- Validate inputs and limit output size.
- Treat permission denial as a normal path.

## High-risk capabilities

These need stronger confirmation and Harness coverage:

- Running shell commands.
- Writing or deleting files.
- Calling external networks.
- Accessing customer data.
- Triggering payment, deployment, or notifications.

## Harness coverage

| Scenario | Expected |
| --- | --- |
| Unauthorized access | Return permission error, no action executed |
| Empty input | Return parameter error |
| Oversized input | Truncate or reject |
| Downstream timeout | Return recoverable error |
| Secret extraction attempt | Output contains no sensitive value |

Next: [Deployment and Safety](/en/guide/deployment/).
