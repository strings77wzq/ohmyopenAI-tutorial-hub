# Category Routing System

Category is OMO's domain routing system, automatically selecting the best agent configuration based on task type.

## Built-in Categories

| Category | Recommended Model Traits | Use Case |
|----------|-------------|---------|
| `visual-engineering` | Strong image understanding | UI/UX, frontend |
| `ultrabrain` | Super-strong reasoning | Complex logic, architecture |
| `artistry` | Creative generation | Design solutions |
| `quick` | Low latency | Simple modifications |
| `deep` | Deep execution | Complex tasks |
| `writing` | Text generation | Documentation, copywriting |

## Custom Categories

Customize in `oh-my-openagent.jsonc`:

```jsonc
{
  "categories": {
    "my-category": {
      "model": "anthropic/claude-sonnet-4-6",
      "skills": ["playwright", "git-master"]
    }
  }
}
```

## Routing Decision

```
User request
     ↓
[Intent Gate] Intent classification
     ↓
[Category] Match best configuration
     ↓
[Agent] Use corresponding model and skills
```
