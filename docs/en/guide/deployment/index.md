# Deployment & Safety

Before an Agent engineering project goes live, answer two questions: **can it work reliably?** and **can it stay controllable when it fails?**

## Pre-Release Checklist

- Build passes
- Link checks pass
- Example project tests pass
- Permission boundaries are documented
- Secrets never enter the repo or model context
- Failure paths have user-understandable errors
- Rollback path is clear

## Permission Model

| Permission | Risk | Recommendation |
|------------|------|----------------|
| Read files | Expose sensitive content | Restrict directories, filter secrets |
| Write files | Destroy user work | Diff before write, keep rollback path |
| Execute commands | Arbitrary side effects | Sandbox, allowlist, least privilege |
| Network access | Data exfiltration | Only access required domains |
| Deploy/release | Impact real users | Branch preview, human confirmation, rollback |

## Module Content

| Chapter | Content |
|---------|---------|
| [Permission Model](/guide/deployment/permission-model) | Filesystem, network, command execution, and API permissions. Allowlist vs denylist. Least-privilege principle applied to agents |
| [Secret Governance](/guide/deployment/secret-governance) | Three-layer defense: source (never enter), process (auto-redact), post-hoc (detect + rotate) |
| [Observability & Rollback](/guide/deployment/observability-rollback) | Build-level, runtime-level, and experience-level observability. Revert strategies. Smoke tests |

> **Language note**: Detailed sub-pages are currently in [Chinese (简体中文)](/guide/deployment/). English translations are planned.

## Observability & Rollback

After release, maintain at minimum:

- Build logs
- Critical-path smoke checks
- A user-reportable issue channel
- Rollback path to the last known-good version

## Practice

Write a security description for an MCP tool that writes files:

1. Which directories can it write to?
2. How does it show a diff before writing?
3. How does it roll back on failure?
4. How does Harness verify that permission denials are enforced?

## Next Step

Start with the [Permission Model](/guide/deployment/permission-model) (Chinese) to understand the four dimensions of Agent permissions.
