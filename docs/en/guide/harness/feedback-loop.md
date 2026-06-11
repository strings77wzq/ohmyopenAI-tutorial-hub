# Harness Feedback Loop

The feedback loop is one of Harness's four guardrails, ensuring the quality of agent output.

## What is a Feedback Loop?

After an agent completes its task, it verifies output quality and loops back to fix issues if the result is unsatisfactory.

## Three-Layer Verification

### 1. Self-Verification

The agent checks its own output:

```typescript
// After the agent finishes execution
const result = await agent.execute(task);

// Self-check
if (!validate(result)) {
  await agent.fix();
}
```

### 2. Cross-Verification

Another agent reviews the result:

```typescript
// Have another agent review the architecture for soundness
reviewAgent.analyze(design)
```

### 3. Independent Verification

Use an independent instance to verify, reducing correlated risk:

```
Hephaestus writes code → Another Hephaestus verifies
```

## Practical Application

A typical multi-layer verification loop:

```markdown
## Verification Loop Design

### 1. Self-verification
- Agent checks its own output after completion

### 2. Cross-verification  
- Independent agent reviews the architecture

### 3. Independent verification
- Third-party verifier confirms the results
```

## Industry Practices

| Team | Feedback Loop Approach |
|------|-------------|
| **OpenAI** | Agent Review Agent |
| **Anthropic** | Independent verification loop |
| **LangChain** | Test-driven |
