// Agent Harness Pattern in Go
//
// Teaches the separation between an LLM and the harness that wraps it.
// An agent = harness + LLM, where the harness handles:
//   - Input sanitization and validation
//   - Tool execution and orchestration
//   - Output validation and scoring
//   - Safety guardrails
//
// This example shows the same task with and without a harness,
// demonstrating how the harness improves reliability and quality.
//
// Run: go run harness.go

package main

import (
	"fmt"
	"math"
	"strings"
)

// --- LLM Interface ---
// The LLM is a "brain" — it reasons about text but can't do anything else.
// The harness gives it capabilities.

type LLM interface {
	Generate(prompt string) string
}

// --- Mock LLM ---
// Simulates an LLM that sometimes produces good output, sometimes bad.
// This is realistic: LLMs are non-deterministic.

type mockLLM struct {
	callCount int
}

func (m *mockLLM) Generate(prompt string) string {
	m.callCount++
	// Simulate non-deterministic output quality
	switch m.callCount % 3 {
	case 0:
		return "Paris is the capital of France. It is known for the Eiffel Tower and rich cultural heritage."
	case 1:
		return "paris is capital of france it has eiffel tower"
	default:
		return "The capital of France is Paris. With a population of ~2.1 million, it serves as the country's political, economic, and cultural center."
	}
}

// --- Tool Executor ---
// Tools are functions the harness can invoke. The LLM never calls them directly.

type ToolExecutor struct {
	tools map[string]func(string) string
}

func NewToolExecutor() *ToolExecutor {
	return &ToolExecutor{
		tools: map[string]func(string) string{
			"search": func(query string) string {
				return fmt.Sprintf("Search results for '%s': [relevant content found]", query)
			},
			"verify": func(fact string) string {
				return fmt.Sprintf("Fact check for '%s': verified", fact)
			},
		},
	}
}

func (te *ToolExecutor) Execute(toolName, input string) string {
	if fn, ok := te.tools[toolName]; ok {
		return fn(input)
	}
	return fmt.Sprintf("Unknown tool: %s", toolName)
}

// --- Output Validators ---
// The harness validates LLM output before returning it to the user.
// This catches hallucinations, formatting errors, and safety issues.

type OutputValidator struct {
	checks []func(string) (bool, string)
}

func NewOutputValidator() *OutputValidator {
	v := &OutputValidator{}

	// Check 1: Minimum length
	v.checks = append(v.checks, func(output string) (bool, string) {
		if len(output) < 10 {
			return false, "Output too short (likely unhelpful)"
		}
		return true, ""
	})

	// Check 2: No obvious hallucination markers
	v.checks = append(v.checks, func(output string) (bool, string) {
		lower := strings.ToLower(output)
		if strings.Contains(lower, "i don't know") || strings.Contains(lower, "not sure") {
			return false, "LLM expressed uncertainty — may need more context"
		}
		return true, ""
	})

	// Check 3: Proper capitalization (basic quality signal)
	v.checks = append(v.checks, func(output string) (bool, string) {
		if len(output) > 0 && output[0] >= 'a' && output[0] <= 'z' {
			return false, "Output not properly capitalized"
		}
		return true, ""
	})

	return v
}

func (v *OutputValidator) Validate(output string) (bool, []string) {
	var issues []string
	allPassed := true

	for _, check := range v.checks {
		passed, msg := check(output)
		if !passed {
			issues = append(issues, msg)
			allPassed = false
		}
	}

	return allPassed, issues
}

// --- Agent Harness ---
// The harness wraps the LLM and adds capabilities:
//   1. Validates input
//   2. Enriches context (e.g., adds tool results)
//   3. Calls the LLM
//   4. Validates and scores output
//   5. Applies guardrails

type AgentHarness struct {
	llm       LLM
	tools     *ToolExecutor
	validator *OutputValidator
}

func NewAgentHarness(llm LLM) *AgentHarness {
	return &AgentHarness{
		llm:       llm,
		tools:     NewToolExecutor(),
		validator: NewOutputValidator(),
	}
}

func (h *AgentHarness) Process(query string) (string, float64) {
	fmt.Printf("\n  [Harness] Processing: %q\n", query)

	// Step 1: Validate input
	if len(strings.TrimSpace(query)) == 0 {
		fmt.Println("  [Harness] Rejected: empty query")
		return "", 0
	}

	// Step 2: Enrich with tool context
	fmt.Println("  [Harness] Enriching context with tools...")
	searchResult := h.tools.Execute("search", query)
	enrichedPrompt := fmt.Sprintf("Context: %s\n\nQuestion: %s", searchResult, query)

	// Step 3: Call LLM
	fmt.Println("  [Harness] Calling LLM...")
	rawOutput := h.llm.Generate(enrichedPrompt)
	fmt.Printf("  [Harness] Raw output: %q\n", rawOutput)

	// Step 4: Validate output
	passed, issues := h.validator.Validate(rawOutput)
	qualityScore := calculateQuality(rawOutput)

	if !passed {
		fmt.Printf("  [Harness] Validation issues: %v\n", issues)
		qualityScore *= 0.5 // penalize issues
	}

	fmt.Printf("  [Harness] Quality score: %.2f\n", qualityScore)

	return rawOutput, qualityScore
}

// --- Quality Scoring ---
// Scores output quality based on length, structure, and content.

func calculateQuality(text string) float64 {
	score := 0.0

	// Length bonus (longer = more detailed, up to a point)
	lengthScore := math.Min(float64(len(text))/200.0, 1.0)
	score += lengthScore * 0.3

	// Structure bonus (sentences, periods)
	sentences := strings.Split(text, ".")
	structureScore := math.Min(float64(len(sentences))/3.0, 1.0)
	score += structureScore * 0.3

	// Content richness (has specific facts/details)
	lower := strings.ToLower(text)
	richness := 0.0
	if strings.Contains(lower, "is") {
		richness += 0.2
	}
	if strings.Contains(lower, "known") || strings.Contains(lower, "serves") {
		richness += 0.2
	}
	if strings.Contains(lower, "population") || strings.Contains(lower, "million") {
		richness += 0.2
	}
	score += math.Min(richness, 0.4)

	return math.Min(score, 1.0)
}

// --- Without Harness ---
// Direct LLM call — no validation, no enrichment, no scoring.

func withoutHarness(llm LLM, query string) (string, float64) {
	fmt.Printf("\n  [Direct] Processing: %q\n", query)
	fmt.Println("  [Direct] Calling LLM directly...")

	output := llm.Generate(query)
	quality := calculateQuality(output)

	fmt.Printf("  [Direct] Output: %q\n", output)
	fmt.Printf("  [Direct] Quality score: %.2f\n", quality)

	return output, quality
}

func main() {
	fmt.Println("Agent Harness Pattern — Agent Engineering Hub")
	fmt.Println("=============================================")
	fmt.Println("Agent = Harness + LLM")
	fmt.Println("The harness adds validation, tools, scoring, and guardrails.")
	fmt.Println()

	llm := &mockLLM{}
	harness := NewAgentHarness(llm)

	query := "What is the capital of France?"

	// --- Comparison ---
	fmt.Println("========================================")
	fmt.Println("WITHOUT HARNESS (direct LLM call)")
	fmt.Println("========================================")
	directOutput, directScore := withoutHarness(llm, query)

	fmt.Println("\n========================================")
	fmt.Println("WITH HARNESS")
	fmt.Println("========================================")
	harnessOutput, harnessScore := harness.Process(query)

	// --- Summary ---
	fmt.Println("\n========================================")
	fmt.Println("COMPARISON SUMMARY")
	fmt.Println("========================================")
	fmt.Printf("Without harness — Score: %.2f\n", directScore)
	fmt.Printf("  Output: %s\n", directOutput)
	fmt.Println()
	fmt.Printf("With harness — Score: %.2f\n", harnessScore)
	fmt.Printf("  Output: %s\n", harnessOutput)
	fmt.Println()

	if harnessScore > directScore {
		fmt.Println("→ The harness improved output quality!")
	} else {
		fmt.Println("→ Both approaches produced similar quality.")
	}

	fmt.Println("\n=== Key Takeaways ===")
	fmt.Println("1. The LLM is just a brain — it can reason but not act.")
	fmt.Println("2. The harness adds: input validation, context enrichment, output validation.")
	fmt.Println("3. Tool execution happens in the harness, not the LLM.")
	fmt.Println("4. Output scoring helps detect bad/unhelpful responses.")
	fmt.Println("5. Guardrails (length checks, hallucination detection) improve safety.")
	fmt.Println("6. In production, the harness also handles retries, fallbacks, and logging.")
}
