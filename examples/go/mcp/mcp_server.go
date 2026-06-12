// Minimal MCP (Model Context Protocol) Server in Go
//
// Teaches the MCP standard: how AI tools communicate with external services.
//
// MCP defines a JSON-RPC based protocol where:
//   - A server exposes tools (functions the LLM can call)
//   - A client (the AI agent) discovers and invokes these tools
//   - Messages use JSON-RPC 2.0 format
//
// This example builds a minimal MCP server that handles:
//   - tools/list: discover available tools
//   - tools/call: execute a tool
//   - resources/list: list available resources
//   - resources/read: read a resource
//
// Run: go run mcp_server.go

package main

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

// --- JSON-RPC Message Format ---
// MCP uses JSON-RPC 2.0. Every message has: jsonrpc, method, params, id.

type jsonrpcRequest struct {
	JSONRPC string      `json:"jsonrpc"`
	Method  string      `json:"method"`
	Params  interface{} `json:"params"`
	ID      *int        `json:"id,omitempty"` // nil for notifications
}

type jsonrpcResponse struct {
	JSONRPC string      `json:"jsonrpc"`
	Result  interface{} `json:"result,omitempty"`
	Error   *rpcError   `json:"error,omitempty"`
	ID      *int        `json:"id"`
}

type rpcError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// --- MCP Tool Definition ---
// Tools are the primary way MCP servers expose functionality.

type mcpTool struct {
	Name        string            `json:"name"`
	Description string            `json:"description"`
	InputSchema map[string]string `json:"inputSchema"` // simplified schema
}

type toolCallRequest struct {
	Name      string                 `json:"name"`
	Arguments map[string]interface{} `json:"arguments"`
}

type toolCallResult struct {
	Content []contentBlock `json:"content"`
	IsError bool           `json:"isError,omitempty"`
}

type contentBlock struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

// --- MCP Resource Definition ---
// Resources expose data the LLM can read (files, configs, database schemas).

type mcpResource struct {
	URI         string `json:"uri"`
	Name        string `json:"name"`
	Description string `json:"description"`
	MimeType    string `json:"mimeType"`
}

// --- Server State ---

type mcpServer struct {
	tools     []mcpTool
	resources []mcpResource
	startTime time.Time
}

func newMCPServer() *mcpServer {
	s := &mcpServer{startTime: time.Now()}

	// Register tools — in production these come from plugins/config
	s.tools = []mcpTool{
		{
			Name:        "add",
			Description: "Add two numbers together",
			InputSchema: map[string]string{
				"a": "First number",
				"b": "Second number",
			},
		},
		{
			Name:        "get_weather",
			Description: "Get current weather for a city",
			InputSchema: map[string]string{
				"city": "City name",
			},
		},
		{
			Name:        "read_file",
			Description: "Read contents of a file",
			InputSchema: map[string]string{
				"path": "File path to read",
			},
		},
	}

	// Register resources
	s.resources = []mcpResource{
		{
			URI:         "config://app",
			Name:        "Application Config",
			Description: "Current application configuration",
			MimeType:    "application/json",
		},
		{
			URI:         "docs://readme",
			Name:        "README",
			Description: "Project README file",
			MimeType:    "text/markdown",
		},
	}

	return s
}

// --- Request Handlers ---

func (s *mcpServer) handleToolsList(params interface{}) interface{} {
	fmt.Println("  [Handler] tools/list — listing available tools")
	return map[string]interface{}{
		"tools": s.tools,
	}
}

func (s *mcpServer) handleToolsCall(params interface{}) interface{} {
	// Parse the tool call request
	paramsMap, ok := params.(map[string]interface{})
	if !ok {
		return toolCallResult{
			Content: []contentBlock{{Type: "text", Text: "Invalid params"}},
			IsError: true,
		}
	}

	reqBytes, _ := json.Marshal(paramsMap)
	var req toolCallRequest
	json.Unmarshal(reqBytes, &req)

	fmt.Printf("  [Handler] tools/call — %s(%v)\n", req.Name, req.Arguments)

	// Route to tool implementation
	switch req.Name {
	case "add":
		return s.executeAdd(req.Arguments)
	case "get_weather":
		return s.executeWeather(req.Arguments)
	case "read_file":
		return s.executeReadFile(req.Arguments)
	default:
		return toolCallResult{
			Content: []contentBlock{{Type: "text", Text: fmt.Sprintf("Unknown tool: %s", req.Name)}},
			IsError: true,
		}
	}
}

func (s *mcpServer) executeAdd(args map[string]interface{}) toolCallResult {
	a, _ := args["a"].(float64)
	b, _ := args["b"].(float64)
	result := a + b
	return toolCallResult{
		Content: []contentBlock{{Type: "text", Text: fmt.Sprintf("%v", result)}},
	}
}

func (s *mcpServer) executeWeather(args map[string]interface{}) toolCallResult {
	city, _ := args["city"].(string)
	if city == "" {
		city = "Unknown"
	}
	data := fmt.Sprintf(`{"city":"%s","temp":22,"condition":"sunny"}`, city)
	return toolCallResult{
		Content: []contentBlock{{Type: "text", Text: data}},
	}
}

func (s *mcpServer) executeReadFile(args map[string]interface{}) toolCallResult {
	path, _ := args["path"].(string)
	// Simulate reading a file
	return toolCallResult{
		Content: []contentBlock{{Type: "text", Text: fmt.Sprintf("# File: %s\n\nSimulated file contents for demo.", path)}},
	}
}

func (s *mcpServer) handleResourcesList(params interface{}) interface{} {
	fmt.Println("  [Handler] resources/list — listing resources")
	return map[string]interface{}{
		"resources": s.resources,
	}
}

func (s *mcpServer) handleResourcesRead(params interface{}) interface{} {
	paramsMap, _ := params.(map[string]interface{})
	uri, _ := paramsMap["uri"].(string)
	fmt.Printf("  [Handler] resources/read — %s\n", uri)

	// Simulate resource contents
	contents := map[string]string{
		"config://app":  `{"debug": false, "log_level": "info"}`,
		"docs://readme": "# AI Tutorial Hub\n\nA learning resource for AI agent engineering.",
	}

	text, ok := contents[uri]
	if !ok {
		text = fmt.Sprintf("Resource not found: %s", uri)
	}

	return map[string]interface{}{
		"contents": []map[string]string{
			{"uri": uri, "mimeType": "text/plain", "text": text},
		},
	}
}

// --- JSON-RPC Router ---
// The server receives JSON-RPC messages and routes them to the right handler.

func (s *mcpServer) handleRequest(req jsonrpcRequest) jsonrpcResponse {
	fmt.Printf("  → Method: %s\n", req.Method)

	var result interface{}

	switch req.Method {
	case "tools/list":
		result = s.handleToolsList(req.Params)
	case "tools/call":
		result = s.handleToolsCall(req.Params)
	case "resources/list":
		result = s.handleResourcesList(req.Params)
	case "resources/read":
		result = s.handleResourcesRead(req.Params)
	case "initialize":
		// MCP handshake: client sends capabilities, server responds
		result = map[string]interface{}{
			"protocolVersion": "2024-11-05",
			"capabilities": map[string]interface{}{
				"tools":     map[string]string{},
				"resources": map[string]string{},
			},
			"serverInfo": map[string]string{
				"name":    "demo-mcp-server",
				"version": "1.0.0",
			},
		}
	default:
		return jsonrpcResponse{
			JSONRPC: "2.0",
			Error:   &rpcError{Code: -32601, Message: "Method not found"},
			ID:      req.ID,
		}
	}

	return jsonrpcResponse{
		JSONRPC: "2.0",
		Result:  result,
		ID:      req.ID,
	}
}

func (s *mcpServer) processMessage(raw string) string {
	var req jsonrpcRequest
	if err := json.Unmarshal([]byte(raw), &req); err != nil {
		resp := jsonrpcResponse{
			JSONRPC: "2.0",
			Error:   &rpcError{Code: -32700, Message: "Parse error"},
		}
		out, _ := json.Marshal(resp)
		return string(out)
	}

	resp := s.handleRequest(req)
	out, _ := json.MarshalIndent(resp, "", "  ")
	return string(out)
}

func main() {
	fmt.Println("Minimal MCP Server — Agent Engineering Hub")
	fmt.Println("==========================================")
	fmt.Println("MCP = JSON-RPC protocol for AI tool communication.")
	fmt.Println("Server exposes tools/resources → Client (LLM agent) discovers and calls them.")
	fmt.Println()

	server := newMCPServer()

	// --- Demo: Simulate the MCP handshake and tool calls ---
	messages := []struct {
		name string
		json string
	}{
		{
			name: "1. Initialize (handshake)",
			json: `{"jsonrpc":"2.0","method":"initialize","id":1}`,
		},
		{
			name: "2. List tools",
			json: `{"jsonrpc":"2.0","method":"tools/list","id":2}`,
		},
		{
			name: "3. Call add tool",
			json: `{"jsonrpc":"2.0","method":"tools/call","id":3,"params":{"name":"add","arguments":{"a":10,"b":32}}}`,
		},
		{
			name: "4. Call weather tool",
			json: `{"jsonrpc":"2.0","method":"tools/call","id":4,"params":{"name":"get_weather","arguments":{"city":"Tokyo"}}}`,
		},
		{
			name: "5. List resources",
			json: `{"jsonrpc":"2.0","method":"resources/list","id":5}`,
		},
		{
			name: "6. Read a resource",
			json: `{"jsonrpc":"2.0","method":"resources/read","id":6,"params":{"uri":"config://app"}}`,
		},
	}

	for _, msg := range messages {
		fmt.Printf("--- %s ---\n", msg.name)
		fmt.Printf("  ← Request: %s\n", strings.TrimSpace(msg.json))
		response := server.processMessage(msg.json)
		fmt.Printf("  → Response:\n%s\n\n", response)
	}

	fmt.Println("=== Key Takeaways ===")
	fmt.Println("1. MCP uses JSON-RPC 2.0 — every message has method, params, id.")
	fmt.Println("2. tools/list: client discovers what tools are available.")
	fmt.Println("3. tools/call: client invokes a tool with arguments, gets structured result.")
	fmt.Println("4. resources: provide data (files, configs) the LLM can read.")
	fmt.Println("5. The initialize handshake negotiates capabilities between client and server.")
}
