# Intent Classification

Intent classification is OMO's first gate, determining how to handle user requests.

## Classification Logic

```
User request
     ↓
[Complexity assessment]
     ├─ Information query → Librarian/Explore handles directly
     ├─ Simple modification → Hephaestus handles directly
     └─ Complex task → Sisyphus decomposes and handles
```

## Decision Criteria

| Characteristic | Simple Query | Complex Task |
|------|---------|---------|
| Files involved | Single file | Multiple files |
| Steps | One step | Multiple steps |
| Dependencies | None | Dependencies exist |
| Uncertainty | Low | High |

## Explicit Triggers

Users can also explicitly specify a mode:

```bash
# Use ultrawork (automatic decision-making)
ulw

# Use Prometheus (interview-style planning)
# Press Tab to switch to Plan mode, then /start-work
```
