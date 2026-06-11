# Secret Governance

## Concept

Secrets (API keys, tokens, passwords, certificates) are the most dangerous assets in an Agent system. The core question of secret governance is: **how do you ensure secrets never enter the Agent's context window, tool outputs, logs, or code repository?**

## Why Is Secret Governance Especially Important for Agents?

In traditional development, the main risk of secret leakage is "a developer accidentally commits to git." Agents introduce three new leakage paths:

1. **Context leakage**: The Agent reads a `.env` file — the secret is now in its context window, and context window summaries may be read by another Agent.
2. **Tool output leakage**: The Agent runs `env` or `cat .env` to debug — the output contains secrets.
3. **Cross-Agent leakage**: Agent A's context is summarized and passed to Agent B — the secret flows along with the summary.

## Three-Layer Defense

```
┌─────────────────────────────────────────────────────────┐
│ L1: Source Prevention — secrets never enter Agent env    │
│ Strategy: Environment variable isolation + minimal       │
│           exposure                                      │
│ Tools: .gitignore, .dockerignore, direnv                │
├─────────────────────────────────────────────────────────┤
│ L2: In-Process Prevention — auto-redact when Agent reads │
│ Strategy: File content filtering + output redaction      │
│ Tools: pre-read hooks, regex redaction, secret scanner  │
├─────────────────────────────────────────────────────────┤
│ L3: Post-Incident Prevention — detect leaks that already │
│     happened                                            │
│ Strategy: Context auditing + secret rotation             │
│ Tools: git-secrets, truffleHog, GitHub secret scanning  │
└─────────────────────────────────────────────────────────┘
```

## L1 Source Prevention

The first line of defense is the most effective: **secrets never enter the Agent's runtime environment at all**.

```
Practices:
  ✓ .env and .env.local in .gitignore
  ✓ Secrets injected via environment variables (process.env.API_KEY), not hardcoded
  ✓ CI/CD uses a Secrets Manager (GitHub Secrets, Vault)
  ✓ Local development uses direnv or .env (but never committed to git)

  ✗ Don't write secrets in config.ts or constants.ts
  ✗ Don't pass secrets as command-line arguments (they appear in ps aux and shell history)
  ✗ Don't let the Agent access directories containing secrets
```

## L2 In-Process Prevention

Even with L1 in place, the Agent may still encounter secrets indirectly through tool calls:

### File Content Filtering

Before the Agent reads a file, a pre-read hook scans and redacts:

```typescript
// pre-read hook: check before returning file content to Agent
function sanitizeFileContent(content: string): string {
  // Replace API Key patterns
  content = content.replace(
    /(sk-[a-zA-Z0-9]{20,})/g,
    '[REDACTED: API Key]'
  )

  // Replace JWT Tokens
  content = content.replace(
    /(eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,})/g,
    '[REDACTED: JWT Token]'
  )

  return content
}
```

### Output Redaction

Agent tool outputs should also be redacted before writing to logs:

```typescript
// Redact before writing to log
function sanitizeLogEntry(entry: string): string {
  const patterns = [
    /(api_key|apikey|secret|password|token)\s*[:=]\s*\S+/gi,
    /-----BEGIN.*?PRIVATE KEY-----[\s\S]*?-----END.*?PRIVATE KEY-----/g,
  ]

  for (const pattern of patterns) {
    entry = entry.replace(pattern, '$1=[REDACTED]')
  }

  return entry
}
```

## L3 Post-Incident Prevention

If L1 and L2 both fail — the secret has already leaked — you need to know and respond quickly:

### Detection

```
Tools:
  - git-secrets: Scans git history for secret patterns
  - truffleHog: Deep scan (including commit messages, branch names)
  - GitHub Secret Scanning: Automatically scans content pushed to GitHub

CI integration:
  - Run git-secrets automatically on every PR
  - Run truffleHog automatically on every push to main
```

### Response: Secret Rotation Protocol

```
1. Confirm the leak
   - Where was the secret found? (logs? git? context summary?)
   - What is the secret's scope? (read-only? read-write? admin?)

2. Revoke immediately
   - Revoke/delete the secret at the provider (GitHub, AWS, OpenAI)
   - Don't fix the code first, revoke the secret first — every second increases risk

3. Generate a new secret
   - Replace with a new secure secret
   - Update all services using that secret

4. Fix the root cause
   - Why did the secret enter the Agent's context/logs/git?
   - Update L1/L2 defenses to prevent similar leaks

5. Document the postmortem
   - Timeline of the leak
   - Impact scope assessment
   - Defense improvement measures
```

## Example: Secret Governance Practices for This Project

```
L1 Source Prevention:
  - .gitignore: .env, .env.local, *.log
  - GitHub Pages deployment uses GitHub Actions Secrets
  - Agent's working directory is restricted to docs/ (doesn't contain config secrets)

L2 In-Process Prevention:
  - Agent doesn't read .env files
  - npm scripts don't contain secrets (all auth via environment variables)
  - Build logs don't contain sensitive information

L3 Post-Incident Prevention:
  - GitHub Secret Scanning (built into the repository)
  - If a leak occurs: immediately revoke in GitHub Settings + rotate
```

## Exercise

Design a secret governance plan for a tool that "calls the OpenAI API to generate documentation summaries":

1. Where should the API Key be stored? (Code? Environment variable? Secrets Manager?)
2. When the Agent calls this tool, where does the Key appear? (Request headers? Tool output? Logs?)
3. If the Key accidentally appears in the Agent's conversation summary, can L2 defenses catch it?
4. What are the rotation steps after a Key leak?

## Troubleshooting

| Symptom | Possible Cause | Fix |
|---------|---------------|-----|
| git push rejected by GitHub (secret scanning triggered) | Code or commit history contains secret patterns | Revoke the secret → clean git history → force push |
| Agent repeatedly tries to read .env | L2 defense prevents reading, Agent thinks file doesn't exist | Return redacted content instead of refusing to read |
| Redaction is too aggressive — normal code gets replaced | Regex patterns are too broad | Tighten patterns, add context matching |

## Next Steps

With secrets secured and permissions in check, read about [Observability and Rollback](./observability-rollback) to ensure you can continuously verify system health after release.
