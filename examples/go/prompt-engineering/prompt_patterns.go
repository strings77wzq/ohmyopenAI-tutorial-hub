// Prompt Engineering Patterns in Go
//
// Teaches three foundational prompt design patterns used in AI agent engineering:
//   1. Zero-shot: No examples — the model must infer intent from instruction alone.
//   2. Few-shot: Provide input/output examples to guide the model's behavior.
//   3. Chain-of-Thought: Ask the model to reason step-by-step before answering.
//
// In production, a real LLM would process these prompts. Here we use a mock
// function that simulates LLM responses to demonstrate how prompt *structure*
// affects output quality. The mock rewards structured, detailed inputs with
// more useful outputs.
//
// Run: go run prompt_patterns.go

package main

import (
	"fmt"
	"strings"
)

// --- Mock LLM ---
// In a real system, this would call an API (OpenAI, Anthropic, etc.).
// The mock simulates how different prompt structures produce different outputs.

type llmResponse struct {
	text       string
	confidence float64 // simulated confidence 0-1
}

// mockLLM simulates an LLM that responds better to well-structured prompts.
// This is the core lesson: prompt quality directly affects output quality.
func mockLLM(prompt string) llmResponse {
	// Simulate: more structure in the prompt → better output
	lower := strings.ToLower(prompt)

	// Chain-of-Thought detection: if the prompt asks for step-by-step reasoning
	// the mock "thinks" more carefully and produces a better answer
	if strings.Contains(lower, "step by step") || strings.Contains(lower, "think") {
		return llmResponse{
			text:       "Step 1: Identify the key elements.\nStep 2: Analyze relationships.\nStep 3: Draw conclusion based on evidence.\nAnswer: The population of Tokyo is approximately 14 million (metro area ~37 million).",
			confidence: 0.95,
		}
	}

	// Few-shot detection: if examples are provided, the mock produces
	// a more aligned and structured response
	if strings.Contains(lower, "example:") || strings.Contains(lower, "q:") {
		return llmResponse{
			text:       "A: 4",
			confidence: 0.88,
		}
	}

	// Zero-shot: vague prompt → vague, less confident response
	return llmResponse{
		text:       "I think the answer might be 4, but I'm not entirely sure without more context.",
		confidence: 0.55,
	}
}

// --- Pattern 1: Zero-shot ---
// The simplest approach: give the model an instruction with no examples.
// Works well for straightforward tasks but can be unreliable for nuanced ones.

func zeroShot() {
	fmt.Println("=== Pattern 1: Zero-shot ===")
	fmt.Println("Instruction only, no examples.")

	prompt := "What is 2 + 2? Answer with just the number."

	response := mockLLM(prompt)

	fmt.Printf("Prompt: %q\n", prompt)
	fmt.Printf("Response: %s\n", response.text)
	fmt.Printf("Confidence: %.0f%%\n\n", response.confidence*100)
}

// --- Pattern 2: Few-shot ---
// Provide input/output examples before the actual question.
// The model learns the pattern from examples and applies it.
// Key insight: examples are more powerful than instructions alone.

func fewShot() {
	fmt.Println("=== Pattern 2: Few-shot ===")
	fmt.Println("Examples guide the model's behavior.")

	// Examples establish a clear input→output mapping
	prompt := `Answer these math questions with just the number.

Q: What is 1 + 1?
A: 2

Q: What is 3 + 3?
A: 6

Q: What is 2 + 2?
A:`

	response := mockLLM(prompt)

	fmt.Printf("Prompt:\n%s\n", prompt)
	fmt.Printf("Response: %s\n", response.text)
	fmt.Printf("Confidence: %.0f%%\n\n", response.confidence*100)
}

// --- Pattern 3: Chain-of-Thought ---
// Instruct the model to reason through the problem step-by-step.
// This dramatically improves accuracy for complex or multi-step reasoning.
// The key phrase: "Let's think step by step"

func chainOfThought() {
	fmt.Println("=== Pattern 3: Chain-of-Thought ===")
	fmt.Println("Step-by-step reasoning improves accuracy.")

	prompt := `What is the population of Tokyo?

Let's think step by step:
1. First, identify what we know about Tokyo.
2. Then, consider recent population data.
3. Finally, give a well-reasoned answer.`

	response := mockLLM(prompt)

	fmt.Printf("Prompt:\n%s\n", prompt)
	fmt.Printf("Response:\n%s\n", response.text)
	fmt.Printf("Confidence: %.0f%%\n\n", response.confidence*100)
}

// --- Comparison ---
// Shows how the same question produces different results with different prompts.

func compare() {
	fmt.Println("=== Comparison: Same Question, Different Prompts ===")
	fmt.Println()

	question := "What is the capital of France?"

	prompts := []struct {
		name   string
		prompt string
	}{
		{"Zero-shot", question},
		{"Few-shot", fmt.Sprintf(`Q: What is the capital of Germany?
A: Berlin

Q: What is the capital of Spain?
A: Madrid

Q: %s
A:`, question)},
		{"Chain-of-Thought", fmt.Sprintf(`%s
Think step by step.`, question)},
	}

	for _, p := range prompts {
		response := mockLLM(p.prompt)
		fmt.Printf("[%s] %s (confidence: %.0f%%)\n", p.name, response.text, response.confidence*100)
	}
	fmt.Println()
}

// --- Structured Output Pattern ---
// Combines all three patterns: few-shot examples + CoT reasoning + structured output.
// This is what production agent prompts look like.

func structuredOutput() {
	fmt.Println("=== Combined: Structured Output Prompt ===")
	fmt.Println("Production agents use structured prompts for reliable parsing.")

	prompt := `Classify the user's intent. Respond with JSON.

Examples:
Input: "book a flight to Paris"
Output: {"intent": "travel", "destination": "Paris", "confidence": 0.95}

Input: "what's the weather like"
Output: {"intent": "weather_query", "destination": null, "confidence": 0.90}

Now classify: "find me a hotel in Tokyo"
Step by step, then output JSON.`

	response := mockLLM(prompt)

	fmt.Printf("Prompt:\n%s\n", prompt)
	fmt.Printf("Response: %s\n", response.text)
	fmt.Printf("Confidence: %.0f%%\n\n", response.confidence*100)
}

func main() {
	fmt.Println("Prompt Engineering Patterns — Agent Engineering Hub")
	fmt.Println("=================================================")
	fmt.Println("These patterns form the foundation of agent prompt design.")
	fmt.Println()

	zeroShot()
	fewShot()
	chainOfThought()
	compare()
	structuredOutput()

	fmt.Println("=== Key Takeaways ===")
	fmt.Println("1. Zero-shot: Simple, fast, but unreliable for complex tasks.")
	fmt.Println("2. Few-shot: Examples teach the model what you want — more reliable.")
	fmt.Println("3. Chain-of-Thought: Step-by-step reasoning boosts accuracy.")
	fmt.Println("4. Production agents combine all three for maximum reliability.")
}
