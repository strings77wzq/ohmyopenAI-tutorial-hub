# golem MCP 客户端解剖

golem 的 MCP Client 展示如何连接外部工具协议。

## MCP 协议

MCP (Model Context Protocol) 是 Agent 与外部工具通信的标准协议。

```
golem ↔ MCP Client ↔ MCP Server ↔ 外部工具
```

## 核心代码（~100 行精简）

```go
type Client struct {
    transport Transport
    nextID    int
    pending   map[int]chan *JSONRPCResponse
}

func NewClient(transport Transport) *Client {
    return &Client{
        transport: transport,
        nextID:    1,
        pending:   make(map[int]chan *JSONRPCResponse),
    }
}

// 初始化
func (c *Client) Initialize(ctx context.Context) (*InitializeResult, error) {
    params := InitializeParams{
        ProtocolVersion: "2024-11-05",
        ClientInfo: ClientInfo{
            Name:    "golem",
            Version: "0.1.0",
        },
    }
    return c.call(ctx, "initialize", params, &result)
}

// 调用工具
func (c *Client) CallTool(ctx context.Context, name string, args map[string]interface{}) (*CallToolResult, error) {
    params := CallToolParams{Name: name, Arguments: args}
    return c.call(ctx, "tools/call", params, &result)
}
```

## 核心方法

| 方法 | 功能 |
|------|------|
| `Initialize` | 协议握手，确认能力 |
| `ListTools` | 列出可用工具 |
| `CallTool` | 调用外部工具 |

## 设计要点

1. **JSON-RPC 2.0**：标准远程过程调用
2. **Transport 抽象**：支持 stdio/WebSocket 等
3. **异步响应**：通过 channel 机制

## 使用场景

```bash
# 启用 MCP
golem agent --mcp '[{"command": "python", "args": ["path/to/mcp-server.py"]}]'
```

## 与传统工具调用对比

| | 传统调用 | MCP |
|----------|-----|
| 格式 | 函数调用 | JSON-RPC |
| 协议 | 私有 | 标准 |
| 扩展性 | 受限 | 标准化 |