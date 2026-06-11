# Deployment and Security

Before an Agent Engineering project goes live, it needs to answer two questions: can it work reliably, and can it stay under control when things fail?

## Pre-release Checklist

- Build passes.
- Link checks pass.
- Example project tests pass.
- Permission boundaries are documented.
- Secrets never enter the repository or model context.
- Failure paths have user-understandable error messages.
- Rollback procedure is clear.

## Permission Model

| Permission | Risk | Recommendation |
| --- | --- | --- |
| Read files | Exposes sensitive content | Restrict directories, filter secrets |
| Write files | Destroys user work | Show diff first, preserve rollback path |
| Execute commands | Arbitrary side effects | Sandbox, allowlist, least privilege |
| Network access | Data exfiltration | Access only necessary domains |
| Deploy releases | Affects real users | Branch previews, manual confirmation, rollback |

## Observability and Rollback

After deployment, retain at least:

- Build logs.
- Critical path smoke checks.
- A way for users to report issues.
- A rollback path to the last known-good version.

## Exercise

Write security notes for an MCP tool that writes files:

1. Which directories can it write to?
2. How does it show a diff before writing?
3. How does it rollback on failure?
4. How does the harness verify permission denials?

Next: return to the [Learning Map](/guide/) or check out [Example Projects](/examples/).
