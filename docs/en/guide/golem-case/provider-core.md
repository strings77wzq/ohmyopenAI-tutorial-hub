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
