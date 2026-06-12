// Tool-Use Agent Loop in Go
//
// Teaches the core agent pattern: the LLM doesn't execute actions directly.
// Instead, it *decides* which tool to call, and the agent loop executes it.
//
// The loop:
//   1. Receive user input
//   2. Ask LLM which tool to use (with arguments)
//   3. Execute the tool
//   4. Return result to LLM
//   5. LLM either calls another tool or produces a final answer
//
// In production, the LLM is a real API. Here we use a mock that returns
// hardcoded tool calls to demonstrate the loop mechanics.
//
// Run: go run tool_agent.go

package main

import (
	"fmt"
	"strings"
	"time"
)

// --- Tool Definition ---
// Tools are the bridge between the LLM's reasoning and real-world actions.
// Each tool has a name, description, and a function that executes it.

type Tool struct {
	Name        string
	Description string
	Parameters  map[string]string // parameter name → description
	Execute     func(args map[string]interface{}) string
}

// --- Mock LLM ---
// In production, this calls an API. The mock simulates LLM tool-calling
// by matching keywords in the user's input to decide which tool to use.

type llmDecision struct {
	toolName string
	toolArgs map[string]interface{}
	reasoning string // what the LLM "thought" before deciding
}

func mockLLM(userInput string, conversationHistory []string) llmDecision {
	lower := strings.ToLower(userInput)

	// Simulate LLM reasoning: analyze the input, decide which tool to call
	if strings.Contains(lower, "weather") || strings.Contains(lower, "temperature") {
		city := extractCity(userInput)
		return llmDecision{
			toolName: "get_weather",
			toolArgs: map[string]interface{}{"city": city},
			reasoning: fmt.Sprintf("The user asks about weather. I should use get_weather for %s.", city),
		}
	}

	if strings.Contains(lower, "calculate") || strings.Contains(lower, "compute") {
		return llmDecision{
			toolName: "calculator",
			toolArgs: map[string]interface{}{"expression": extractExpression(userInput)},
			reasoning: "The user wants a calculation. I should use the calculator tool.",
		}
	}

	if strings.Contains(lower, "time") || strings.Contains(lower, "what time") {
		return llmDecision{
			toolName: "get_time",
			toolArgs: map[string]interface{}{"timezone": "UTC"},
			reasoning: "The user asks about time. I should use get_time.",
		}
	}

	// No tool needed — direct answer
	return llmDecision{
		toolName: "",
		reasoning: "This is a general question I can answer directly.",
	}
}

func extractCity(input string) string {
	// Simple extraction: look for "in <City>"
	lower := strings.ToLower(input)
	idx := strings.Index(lower, "in ")
	if idx >= 0 {
		city := strings.TrimSpace(input[idx+3:])
		city = strings.TrimSuffix(city, "?")
		city = strings.TrimSuffix(city, ".")
		if len(city) > 0 {
			return strings.Title(city)
		}
	}
	return "Unknown"
}

func extractExpression(input string) string {
	lower := strings.ToLower(input)
	// Find the math part after "calculate" or "compute"
	for _, prefix := range []string{"calculate ", "compute "} {
		if idx := strings.Index(lower, prefix); idx >= 0 {
			return input[idx+len(prefix):]
		}
	}
	return "0"
}

// --- Tool Registry ---
// Maps tool names to their definitions. In production, this might be
// loaded from a config file or dynamically registered.

func buildToolRegistry() map[string]Tool {
	return map[string]Tool{
		"get_weather": {
			Name:        "get_weather",
			Description: "Get current weather for a city",
			Parameters:  map[string]string{"city": "City name, e.g. 'Tokyo'"},
			Execute: func(args map[string]interface{}) string {
				city, _ := args["city"].(string)
				// Simulate API call with realistic data
				return fmt.Sprintf(`{"city": "%s", "temp_c": 22, "condition": "partly_cloudy", "humidity": 65}`, city)
			},
		},
		"calculator": {
			Name:        "calculator",
			Description: "Evaluate a math expression",
			Parameters:  map[string]string{"expression": "Math expression, e.g. '2 + 2'"},
			Execute: func(args map[string]interface{}) string {
				expr, _ := args["expression"].(string)
				// Simple evaluation for demo
				result := simpleEval(expr)
				return fmt.Sprintf(`{"expression": "%s", "result": %v}`, expr, result)
			},
		},
		"get_time": {
			Name:        "get_time",
			Description: "Get current time in a timezone",
			Parameters:  map[string]string{"timezone": "IANA timezone, e.g. 'UTC'"},
			Execute: func(args map[string]interface{}) string {
				tz, _ := args["timezone"].(string)
				now := time.Now().UTC()
				return fmt.Sprintf(`{"timezone": "%s", "time": "%s"}`, tz, now.Format("15:04:05"))
			},
		},
	}
}

// simpleEval handles basic arithmetic for demo purposes
func simpleEval(expr string) float64 {
	// In production, use a proper expression parser
	parts := strings.Fields(expr)
	if len(parts) >= 3 {
		var a, b float64
		fmt.Sscanf(parts[0], "%f", &a)
		fmt.Sscanf(parts[2], "%f", &b)
		switch parts[1] {
		case "+":
			return a + b
		case "-":
			return a - b
		case "*":
			return a * b
		case "/":
			if b != 0 {
				return a / b
			}
		}
	}
	return 0
}

// --- Agent Loop ---
// This is the core of a tool-using agent:
//   1. User sends message
//   2. LLM decides whether to use a tool
//   3. If yes: execute tool, add result to history, loop back to step 2
//   4. If no: LLM produces final answer, return to user

type agentMessage struct {
	role    string // "user", "assistant", "tool"
	content string
}

func agentLoop(userInput string, tools map[string]Tool, maxIterations int) string {
	fmt.Printf("\n--- Agent Loop ---\n")
	fmt.Printf("User: %s\n\n", userInput)

	conversation := []agentMessage{
		{role: "user", content: userInput},
	}

	for iteration := 0; iteration < maxIterations; iteration++ {
		fmt.Printf("[Iteration %d]\n", iteration+1)

		// Step 1: LLM analyzes conversation and decides
		history := conversationToStrings(conversation)
		decision := mockLLM(userInput, history)
		fmt.Printf("  Reasoning: %s\n", decision.reasoning)

		// Step 2: If no tool needed, LLM produces final answer
		if decision.toolName == "" {
			answer := fmt.Sprintf("Based on the conversation, here's my answer about: %s", userInput)
			conversation = append(conversation, agentMessage{role: "assistant", content: answer})
			fmt.Printf("  → Final answer: %s\n", answer)
			return answer
		}

		// Step 3: Execute the tool
		tool, exists := tools[decision.toolName]
		if !exists {
			fmt.Printf("  → Error: Tool '%s' not found\n", decision.toolName)
			return fmt.Sprintf("Error: tool '%s' not available", decision.toolName)
		}

		fmt.Printf("  → Calling tool: %s(%v)\n", decision.toolName, decision.toolArgs)
		result := tool.Execute(decision.toolArgs)
		fmt.Printf("  → Tool result: %s\n", result)

		// Step 4: Add tool result to conversation and loop
		conversation = append(conversation, agentMessage{
			role:    "tool",
			content: fmt.Sprintf("Tool '%s' returned: %s", decision.toolName, result),
		})
	}

	return "Error: max iterations reached"
}

func conversationToStrings(msgs []agentMessage) []string {
	var out []string
	for _, m := range msgs {
		out = append(out, fmt.Sprintf("[%s] %s", m.role, m.content))
	}
	return out
}

// --- Tool Listing ---
// Agents need to know what tools are available. This shows how tool
// metadata is formatted for the LLM.

func printToolCatalog(tools map[string]Tool) {
	fmt.Println("=== Available Tools ===")
	for name, tool := range tools {
		fmt.Printf("\nTool: %s\n", name)
		fmt.Printf("  Description: %s\n", tool.Description)
		fmt.Printf("  Parameters:\n")
		for param, desc := range tool.Parameters {
			fmt.Printf("    - %s: %s\n", param, desc)
		}
	}
	fmt.Println()
}

func main() {
	fmt.Println("Tool-Use Agent — Agent Engineering Hub")
	fmt.Println("======================================")
	fmt.Println("The LLM doesn't execute actions. It decides WHICH tool to call.")
	fmt.Println("The agent loop handles execution and feeds results back.")
	fmt.Println()

	// Build the tool registry
	tools := buildToolRegistry()
	printToolCatalog(tools)

	// Demo 1: Weather query → tool call → answer
	fmt.Println("--- Demo 1: Weather Query ---")
	agentLoop("What's the weather in Paris?", tools, 5)

	// Demo 2: Calculation → tool call → answer
	fmt.Println("\n--- Demo 2: Calculator ---")
	agentLoop("Please calculate 15 * 3 + 7", tools, 5)

	// Demo 3: Time query → tool call → answer
	fmt.Println("\n--- Demo 3: Time Query ---")
	agentLoop("What time is it?", tools, 5)

	// Demo 4: General question → no tool needed
	fmt.Println("\n--- Demo 4: No Tool Needed ---")
	agentLoop("Tell me a joke", tools, 5)

	fmt.Println("\n=== Key Takeaways ===")
	fmt.Println("1. Tools are Go structs with Name, Description, and Execute function.")
	fmt.Println("2. The agent loop: receive → LLM decides → execute tool → feed back → repeat.")
	fmt.Println("3. The LLM never runs code — it outputs a structured decision.")
	fmt.Println("4. Max iteration limit prevents infinite loops.")
	fmt.Println("5. Tool results are added to conversation history for context.")
}
