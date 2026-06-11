# Harness Entropy Management

Entropy management is one of Harness's four guardrails, addressing technical debt and documentation decay.

## What is Entropy?

Over time, software systems gradually become disordered (entropy increases):
- Code quality degrades
- Documentation drifts from the actual code
- Technical debt accumulates

## Entropy Management Strategies

### 1. Continuous Small-Scale Repayment

Instead of waiting until problems become severe to do a big cleanup, address issues **continuously**:

```
Schedule 1 hour per week for technical debt repayment
Include one small optimization with each PR
```

OpenAI calls this "garbage collection":
> Technical debt is like high-interest loans — the sooner you pay it off, the less it costs

### 2. Doc-Gardening Agent

A background agent periodically scans for documentation-code inconsistencies:

```typescript
// Documentation Gardener Agent
async function docGardener() {
  const docs = await scanDocs();
  const code = await scanCode();
  
  for (const doc of docs) {
    if (!matchesCode(doc)) {
      await createFixPR(doc);
    }
  }
}
```

### 3. Periodic Drift Scans

```bash
# Background task for periodic scanning
npx ast-grep --pattern 'console.log($MSG)' --fix
```

## Practical Application

In production-grade agent systems, entropy management typically includes:

| Mechanism | Function |
|------|------|
| Periodic cleanup | Background tasks that scan for code drift |
| Documentation sync | Automatic checks for doc-code consistency |
| Continuous improvement | Each iteration includes optimizations |

## Technical Debt Checklist

It is recommended to maintain a technical debt checklist:

```markdown
## Technical Debt Checklist

- [ ] Low priority: Outdated code cleanup
- [ ] Medium priority: Documentation updates
- [ ] High priority: Security vulnerability fixes
```

Pick one item from the checklist to address during each iteration.
