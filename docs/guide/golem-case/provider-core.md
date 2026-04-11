# golem 多 Provider 适配解剖

golem 的 Provider 系统展示如何抽象多 LLM 厂商接口。

## 支持的 Provider

golem 支持 7 大 LLM 厂商：

| Provider | 接口 | 特色 |
|----------|------|------|
| **OpenAI** | OpenAI 兼容 | GPT-4 系列 |
| **Anthropic** | Anthropic 官方 | Claude 系列 |
| **DeepSeek** | DeepSeek API | 高性价比 |
| **Moonshot/Kimi** | 月之暗面 | 中文优化 |
| **Zhipu/GLM** | 智谱 | 中国大模型 |
| **MiniMax** | MiniMax | 海螺音频 |
| **DashScope/Qwen** | 阿里云 | 通义千问 |

## 接口抽象（~150 行）

```go
// Provider 接口
type Provider interface {
    Chat(ctx context.Context, req *ChatRequest) (*ChatResponse, error)
    Stream(ctx context.Context, req *ChatRequest) (*ChatStreamReader, error)
}

// 工厂函数
func NewProvider(provider string, apiKey string) (Provider, error) {
    switch provider {
    case "openai":
        return NewOpenAI(apiKey), nil
    case "anthropic":
        return NewAnthropic(apiKey), nil
    case "deepseek":
        return NewDeepSeek(apiKey), nil
    // ... 其他 provider
    default:
        return nil, fmt.Errorf("unsupported provider: %s", provider)
    }
}
```

## 配置示例

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-6",
  "apiKey": "sk-ant-..."
}
```

## 设计要点

1. **统一接口**：所有 Provider 实现相同接口
2. **工厂模式**：通过配置创建实例
3. **Streaming**：统一流式输出接口

## 与 OMO 对比

| | golem | OMO |
|------|------|-----|
| 切换方式 | 配置文件 | Category 路由 |
| 模型选择 | 单模型 | 多模型并行 |
| 成本控制 | 手动 | 自动选择性价比 |