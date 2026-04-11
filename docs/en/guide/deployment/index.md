# Deployment and Safety

Before releasing an agent engineering project, answer two questions: can it work reliably, and can it fail under control?

## Pre-release checks

- Build passes.
- Link audit passes.
- Example project tests pass.
- Permission boundaries are documented.
- Secrets do not enter the repository or model context.
- Failure paths have understandable errors.
- Rollback path is clear.

## Permission model

| Permission | Risk | Recommendation |
| --- | --- | --- |
| Read files | Sensitive content exposure | Limit directories and filter secrets |
| Write files | User work can be damaged | Show diff first and preserve rollback |
| Run commands | Arbitrary side effects | Sandbox, allowlist, least privilege |
| Network access | Data exfiltration | Use only required domains |
| Deploy | Real users affected | Preview branches, confirmation, rollback |

## Observability and rollback

Keep:

- Build logs.
- Key route smoke checks.
- A path for users to report issues.
- A rollback path to the last known-good version.

## Practice

Write a safety note for an MCP tool that writes files:

1. Which directories can it write?
2. How does it show a diff first?
3. How does rollback work?
4. How does the Harness verify permission denial?

Next: return to the [Learning Map](/en/guide/) or open [Examples](/en/examples/).
