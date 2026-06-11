# golem Skill System Deep Dive

The golem Skill system demonstrates how to encapsulate reusable Agent capability units.

## Core Skill Structure

```go
// Simplified: ~150 lines

type Skill struct {
    Name        string      // Skill name
    Description string    // Skill description
    Prompt     string     // Agent prompt
    Fn         func(Context) Result  // Execution function
}

type Registry struct {
    skills map[string]Skill
}

// Register a skill
func (r *Registry) Register(s Skill) {
    r.skills[s.Name] = s
}
```

## Built-in Skills

golem ships with two core skills:

| Skill | Purpose | Use Case |
|-------|---------|----------|
| `summarize` | Conversation summarization | Long conversation compression |
| `code-review` | Code review | Code quality checks |

## Registration Example

```go
var Builtins = []Skill{
    {
        Name:        "summarize",
        Description: "Summarize conversation highlights",
        Prompt:      "You are a summarization expert...",
        Fn:         summaryFn,
    },
    {
        Name:        "code-review",
        Description: "Code quality review",
        Prompt:      "You are a code review expert...",
        Fn:         reviewFn,
    },
}
```

## Design Highlights

1. **Composable**: Multiple Skills can be chained together.
2. **Testable**: Given input → verify output.
3. **Extensible**: The Registry pattern makes it easy to add new skills.

## Comparison with OMO Skills

| | golem | OMO |
|------|------|-----|
| Format | Go struct | YAML/Skill file |
| Execution | Function | Agent + Prompt |
| Use case | Fixed functionality | Flexible workflows |
