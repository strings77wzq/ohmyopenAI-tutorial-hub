---
title: Deployment & Safety
description: Pre-launch checklist for AI agent systems — stability, controllability, and rollback readiness
---

# Deployment & Safety

> Before an agent system goes live, it must answer two questions: can it work reliably, and can it stay under control when it fails?

## Why Agent Deployment Is Harder Than Traditional Apps

Traditional web apps are deterministic — same code, same input, same output. Agent systems break that assumption:

| Dimension | Traditional App | Agent System |
|-----------|----------------|--------------|
| Output determinism | Same input → same output | Same input → probabilistic output |
| External dependencies | Database, cache (controllable) | LLM API (uncontrollable, changes over time) |
| Failure modes | Crash, timeout, 500 | Quality degradation, hallucination, loops, token exhaustion |
| Rollback complexity | Code rollback only | Code + Prompt + model version + context strategy |
| Security boundary | Clear user input/output | Agent can autonomously read/write files, call APIs, execute commands |
| Cost model | Fixed (servers) | Variable (per-token billing, hard to predict) |

This means deploying agent systems requires specialized engineering practices, not just "get it running."

## Deployment Lifecycle

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   Dev    │───▶│Pre-flight│───▶│  Deploy  │───▶│ Monitor  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                      │                               │
                      │         ┌──────────┐          │
                      └────────▶│ Rollback │◀─────────┘
                                └──────────┘
```

Each phase has agent-specific challenges:

### 1. Development

- Prompt changes can silently break downstream functions
- Model provider updates may change output format
- In multi-agent systems, one agent's behavior change affects the entire chain

### 2. Pre-flight

Pre-flight checks are automated quality gates before deployment:

```
Pre-flight checklist:
  ✓ Build passes (npm run build)
  ✓ Link check passes
  ✓ Example code runs
  ✓ Permission boundaries defined and tested
  ✓ Secrets not in repo or agent context
  ✓ Failure paths have user-friendly error messages
  ✓ Rollback path verified
  ✓ Performance baseline established
  ✓ Security scan passed (secret leaks, dependency vulnerabilities)
```

### 3. Deployment

- Canary: deploy to small traffic percentage first, verify no anomalies before full rollout
- Branch preview: each PR auto-generates a preview environment for manual verification before merge
- Atomic deployment: all-or-nothing — no half-deployed state

### 4. Monitoring

Post-deployment observation has just begun — see [Observability & Rollback](./observability-rollback).

### 5. Rollback

When monitoring detects issues, quickly rollback to the last known good state.

## Pre-deploy Security Checklist

For agent systems, security checks are mandatory, not optional:

### Permission Checks

| Check | Status | Description |
|-------|--------|-------------|
| Agent directory access is restricted | ☐ | Whitelist mechanism, least privilege |
| Agent cannot execute dangerous commands | ☐ | rm -rf, sudo, chmod blocked |
| Network access scope is defined | ☐ | Only necessary domains allowed |
| Write operations require user confirmation | ☐ | Diff preview + manual approval |
| Delete operations disabled or require approval | ☐ | Almost no scenario should allow deletion |

### Secret Checks

| Check | Status | Description |
|-------|--------|-------------|
| .env in .gitignore | ☐ | Prevent accidental commits |
| Secrets injected via environment variables | ☐ | Never hardcoded in code |
| CI/CD uses Secrets Manager | ☐ | GitHub Secrets or Vault |
| Agent cannot read secret directories | ☐ | Permission isolation |
| Logs don't contain secrets | ☐ | Output sanitization |

### Observability Checks

| Check | Status | Description |
|-------|--------|-------------|
| Build logs are traceable | ☐ | Complete log for each build |
| Critical path smoke test | ☐ | Verify core functionality immediately after deploy |
| User feedback channel available | ☐ | Issue tracker or feedback form |
| Rollback path verified | ☐ | At least one manual rollback executed |

## Common Deployment Failure Patterns

### Pattern 1: Silent Quality Degradation

```
Symptom: Deploy succeeds, build passes, but users report quality drop
Cause: Model provider updated the model, prompt no longer produces expected output
Detection: Regression tests + output quality monitoring
Fix: Lock model version, or adjust prompt to adapt to new model
```

### Pattern 2: Cost Runaway

```
Symptom: Monthly token costs suddenly doubled
Cause: Agent stuck in loop, prompt bloat, or new feature introduced high-token path
Detection: Token usage monitoring + per-call limits
Fix: Set token budget, optimize prompt, add loop exit conditions
```

### Pattern 3: Permission Escape

```
Symptom: Agent unexpectedly reads sensitive files or executes unauthorized commands
Cause: Permission whitelist has gaps (e.g., path traversal), or blacklist missed cases
Detection: Operation audit logs + permission denial alerts
Fix: Switch to whitelist, add path normalization checks
```

### Pattern 4: Cross-Agent Leakage

```
Symptom: Agent B's context contains sensitive info processed by Agent A
Cause: Shared context summaries not sanitized, or inter-agent communication not isolated
Detection: Context audit + sensitive info scanning
Fix: Encrypt inter-agent communication, sanitize summaries, isolate contexts
```

## Deployment Decision Matrix

When facing deployment issues, use this matrix to decide action:

```
              Small impact              Large impact
            ┌─────────────────┬─────────────────┐
Low severity│  Hotfix forward │  Hotfix +       │
            │                 │ 加强监控         │
            ├─────────────────┼─────────────────┤
High        │  Hotfix forward │  Immediate      │
severity    │  (quick fix)    │  rollback +     │
            │                 │  post-mortem    │
            └─────────────────┴─────────────────┘
```

- **Hotfix forward**: Issue is small, not worth rolling back — fix and deploy new version
- **Immediate rollback**: Issue is severe or wide-impact — restore to last good version, then investigate

## Practice

Design a deployment plan for an "auto-fix broken links" agent system:

1. What automated checks are needed in the pre-flight phase?
2. What operations should the permission model allow? What should it prohibit?
3. How do you verify fix effectiveness after deployment?
4. If the agent accidentally deletes a valid link, what's the rollback process?
5. How do you prevent the agent from introducing new problems during fixes?

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Deploy succeeds but page is blank | Base path misconfigured, JS bundle failed to load | Check VitePress base config, revert immediately |
| Old version cached after deploy | CDN cache, GitHub Pages deployment delay | Wait 5 minutes, or manually clear CDN cache |
| Build passes but link check fails | Deploy and local environments have different URLs | Smoke test with actual deployed URL |
| Agent token consumption abnormally high after deploy | Prompt bloat or agent stuck in loop | Check token usage logs, set call limits |

## Next Steps

Each part of the deployment lifecycle has dedicated deep-dive content:

- [Permission Model](./permission-model) — Define what agents can and cannot do
- [Secret Governance](./secret-governance) — Ensure secrets don't leak into agent context
- [Observability & Rollback](./observability-rollback) — Post-deploy verification and rapid recovery
