# golem Multi-Provider Adaptation Deep Dive

golem's Provider system demonstrates how to abstract multiple LLM vendor interfaces.

## Supported Providers

golem supports 7 major LLM providers:

| Provider | Interface | Highlights |
|----------|-----------|------------|
| **OpenAI** | OpenAI-compatible | GPT-4 series |
| **Anthropic** | Anthropic official | Claude series |
| **DeepSeek** | DeepSeek API | Cost-effective |
| **Moonshot/Kimi** | Moonshot AI | Chinese-optimized |
| **Zhipu/GLM** | Zhipu AI | Chinese LLMs |
| **MiniMax** | MiniMax | Hailuo audio |
| **DashScope/Qwen** | Alibaba Cloud | Qwen series |

## Interface Abstraction (~150 lines)

```go
// Provider interface
type Provider interface {
    Chat(ctx context.Context, req *ChatRequest) (*ChatResponse, error)
    Stream(ctx context.Context, req *ChatRequest) (*ChatStreamReader, error)
}

// Factory function
func NewProvider(provider string, apiKey string) (Provider, error) {
    switch provider {
    case "openai":
        return NewOpenAI(apiKey), nil
    case "anthropic":
        return NewAnthropic(apiKey), nil
    case "deepseek":
        return NewDeepSeek(apiKey), nil
    // ... other providers
    default:
        return nil, fmt.Errorf("unsupported provider: %s", provider)
    }
}
```

## Configuration Example

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-6",
  "apiKey": "sk-ant-..."
}
```

## Design Highlights

1. **Unified interface**: All Providers implement the same interface.
2. **Factory pattern**: Instances created from configuration.
3. **Streaming**: Unified streaming output interface.

## Comparison with OMO

| | golem | OMO |
|------|------|-----|
| Switching method | Config file | Category routing |
| Model selection | Single model | Multi-model parallel |
| Cost control | Manual | Automatic cost-effectiveness selection |

## Source Code Reference

Where the concepts covered in this chapter are implemented in the golem project:

| Concept | Code Location |
|---------|---------------|
| Provider interface definition | `core/providers/types.go` |
| Provider factory | `core/providers/factory.go` |
| OpenAI Provider implementation | `core/providers/openai/openai.go` |
| Anthropic Provider implementation | `core/providers/anthropic/anthropic.go` |
| Mock Provider (testing) | `core/providers/mock.go` |

> 📂 Full source: [core/providers/](https://github.com/strings77wzq/golem/tree/main/core/providers)
