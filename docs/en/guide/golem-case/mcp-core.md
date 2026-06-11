# golem MCP Client Deep Dive

golem's MCP Client demonstrates how to connect to external tool protocols.

## MCP Protocol

MCP (Model Context Protocol) is the standard protocol for Agent-to-external-tool communication.

```
golem ↔ MCP Client ↔ MCP Server ↔ external tools
```

## Core Code (~100 lines simplified)

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

// Initialize
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

// Call a tool
func (c *Client) CallTool(ctx context.Context, name string, args map[string]interface{}) (*CallToolResult, error) {
    params := CallToolParams{Name: name, Arguments: args}
    return c.call(ctx, "tools/call", params, &result)
}
```

## Core Methods

| Method | Purpose |
|------|---------|
| `Initialize` | Protocol handshake; confirm capabilities |
| `ListTools` | List available tools |
| `CallTool` | Invoke an external tool |

## Design Highlights

1. **JSON-RPC 2.0**: Standard remote procedure call format.
2. **Transport abstraction**: Supports stdio, WebSocket, and more.
3. **Asynchronous responses**: Via the channel mechanism.

## Usage

```bash
# Enable MCP
golem agent --mcp '[{"command": "python", "args": ["path/to/mcp-server.py"]}]'
```

## Comparison with Traditional Tool Calling

| | Traditional Calling | MCP |
|----------|-----|
| Format | Function call | JSON-RPC |
| Protocol | Proprietary | Standard |
| Extensibility | Limited | Standardized |

## Source Code Reference

Where the concepts covered in this chapter are implemented in the golem project:

| Concept | Code Location |
|---------|---------------|
| MCP Client | `feature/mcp/client.go` |
| MCP Manager (connection lifecycle) | `feature/mcp/manager.go` |
| Transport abstraction | `feature/mcp/transport.go` |
| MCP type definitions | `feature/mcp/types.go` |

> 📂 Full source: [feature/mcp/](https://github.com/strings77wzq/golem/tree/main/feature/mcp)
