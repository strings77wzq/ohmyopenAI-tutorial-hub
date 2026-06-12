// OODA Agent Loop in Go
//
// Teaches the Observe-Orient-Decide-Act (OODA) loop applied to AI agents.
// OODA was developed by military strategist John Boyd and is widely used
// in agent engineering for its clear state transitions and exit conditions.
//
// The loop:
//   1. Observe: Gather information from the environment
//   2. Orient: Analyze and contextually understand the observations
//   3. Decide: Choose an action based on analysis
//   4. Act: Execute the action and check if the goal is met
//
// Critical for agents: infinite loop prevention via:
//   - Maximum iteration limit
//   - Confidence threshold (stop when confident enough)
//   - Goal completion check (stop when done)
//   - Stagnation detection (stop when not making progress)
//
// Run: go run agent_loop.go

package main

import (
	"fmt"
	"strings"
	"time"
)

// --- Agent State ---
// Every iteration of the OODA loop produces state that feeds into the next iteration.

type AgentState struct {
	Observation string  // what we see/know
	Orientation string  // analysis and context
	Decision    string  // chosen action
	Action      string  // executed result
	Confidence  float64 // 0-1, how confident we are
	Iteration   int     // current iteration number
	GoalMet     bool    // should we stop?
	GoalReason  string  // why we stopped
}

// --- Goal Definition ---
// Agents need clear goals. Without them, they loop forever.

type Goal struct {
	Description    string
	TargetMetric   string  // what to measure
	TargetValue    float64 // threshold to meet
	MaxIterations  int     // hard stop
	MinConfidence  float64 // stop if confidence exceeds this
}

// --- Environment ---
// Simulates the world the agent operates in.

type Environment struct {
	State map[string]interface{}
}

func NewEnvironment() *Environment {
	return &Environment{
		State: map[string]interface{}{
			"available_data":  "partial", // partial, complete
			"task_status":     "pending",  // pending, in_progress, done
			"confidence_seed": 0.3,        // simulated confidence level
		},
	}
}

func (e *Environment) Observe() string {
	// Simulate gathering information
	dataStatus := e.State["available_data"]
	status := e.State["task_status"]

	return fmt.Sprintf("Data: %v, Task: %v, Time: %s",
		dataStatus, status, time.Now().Format("15:04:05"))
}

func (e *Environment) UpdateState(key string, value interface{}) {
	e.State[key] = value
}

// --- Mock LLM ---
// Simulates an LLM that improves its understanding over iterations.

type MockLLM struct {
	iteration int
}

func (m *MockLLM) Orient(observation string) string {
	m.iteration++
	// Simulate improving analysis with each iteration
	lower := strings.ToLower(observation)

	if strings.Contains(lower, "done") {
		return "Task appears complete. All data collected and processed."
	}

	if m.iteration <= 2 {
		return fmt.Sprintf("Initial analysis: data is partial, need more investigation. (iteration %d)", m.iteration)
	}
	return fmt.Sprintf("Deeper analysis: patterns emerging, approaching conclusion. (iteration %d)", m.iteration)
}

func (m *MockLLM) Decide(observation, orientation string) string {
	lower := strings.ToLower(orientation)

	if strings.Contains(lower, "complete") {
		return "No further action needed — task is done."
	}
	if strings.Contains(lower, "deeper") {
		return "Synthesize findings and prepare final output."
	}
	return "Gather more data to fill gaps."
}

func (m *MockLLM) Act(decision string) (string, float64) {
	lower := strings.ToLower(decision)

	if strings.Contains(lower, "no further") {
		return "Task completed successfully.", 0.98
	}
	if strings.Contains(lower, "synthesize") {
		return "Analysis synthesized. Results ready.", 0.85
	}
	return "Data collection in progress...", 0.4
}

// --- Exit Condition Checkers ---
// These prevent infinite loops. Every agent MUST have multiple exit conditions.

type ExitChecker struct {
	MaxIterations int
	MinConfidence float64
	StagnationLimit int // iterations without progress
}

func (ec ExitChecker) Check(state AgentState) (bool, string) {
	// Check 1: Goal completion
	if state.GoalMet {
		return true, "Goal completed"
	}

	// Check 2: Maximum iterations (hard limit — prevents infinite loops)
	if state.Iteration >= ec.MaxIterations {
		return true, fmt.Sprintf("Max iterations (%d) reached", ec.MaxIterations)
	}

	// Check 3: Confidence threshold (stop when confident enough)
	if state.Confidence >= ec.MinConfidence {
		return true, fmt.Sprintf("Confidence %.2f >= threshold %.2f", state.Confidence, ec.MinConfidence)
	}

	// Check 4: Stagnation detection (not making progress)
	// In a real system, you'd track state changes across iterations
	if state.Iteration > 0 && state.Confidence < 0.1 {
		return true, "Stagnation detected — no progress"
	}

	return false, ""
}

// --- OODA Agent Loop ---
// The core loop that drives the agent through observe-orient-decide-act cycles.

type OODAAgent struct {
	llm          *MockLLM
	env          *Environment
	exitChecker  ExitChecker
	history      []AgentState
}

func NewOODAAgent(env *Environment, maxIter int, minConf float64) *OODAAgent {
	return &OODAAgent{
		llm:         &MockLLM{},
		env:         env,
		exitChecker: ExitChecker{
			MaxIterations:   maxIter,
			MinConfidence:   minConf,
			StagnationLimit: 3,
		},
	}
}

func (a *OODAAgent) Run() AgentState {
	fmt.Println("Starting OODA Agent Loop...")
	fmt.Println(strings.Repeat("=", 50))

	var state AgentState

	for {
		state.Iteration++

		fmt.Printf("\n--- Iteration %d ---\n", state.Iteration)

		// OBERVE: Gather information from the environment
		state.Observation = a.env.Observe()
		fmt.Printf("  [OBSERVE] %s\n", state.Observation)

		// ORIENT: Analyze and understand context
		state.Orientation = a.llm.Orient(state.Observation)
		fmt.Printf("  [ORIENT]  %s\n", state.Orientation)

		// DECIDE: Choose an action
		state.Decision = a.llm.Decide(state.Observation, state.Orientation)
		fmt.Printf("  [DECIDE]  %s\n", state.Decision)

		// ACT: Execute and get result + confidence
		state.Action, state.Confidence = a.llm.Act(state.Decision)
		fmt.Printf("  [ACT]     %s (confidence: %.2f)\n", state.Action, state.Confidence)

		// Update environment based on action
		a.updateEnvironment(state)

		// Record history
		a.history = append(a.history, state)
		fmt.Printf("  [STATUS]  Confidence: %.2f/%.2f | Iteration: %d/%d\n",
			state.Confidence, a.exitChecker.MinConfidence,
			state.Iteration, a.exitChecker.MaxIterations)

		// CHECK EXIT CONDITIONS
		shouldStop, reason := a.exitChecker.Check(state)
		if shouldStop {
			state.GoalMet = true
			state.GoalReason = reason
			fmt.Printf("\n  [EXIT] %s\n", reason)
			break
		}
	}

	return state
}

func (a *OODAAgent) updateEnvironment(state AgentState) {
	lower := strings.ToLower(state.Action)
	if strings.Contains(lower, "completed") {
		a.env.UpdateState("task_status", "done")
	} else if strings.Contains(lower, "in progress") {
		a.env.UpdateState("task_status", "in_progress")
	}

	// Simulate improving data availability
	if state.Confidence > 0.7 {
		a.env.UpdateState("available_data", "complete")
	}
}

// --- Stagnation Demo ---
// Shows what happens when the agent gets stuck.

func demoStagnation() {
	fmt.Println("\n============================================")
	fmt.Println("DEMO 2: Stagnation Detection")
	fmt.Println("============================================")
	fmt.Println("Simulating an agent that can't make progress...")

	env := NewEnvironment()
	env.UpdateState("available_data", "none")

	agent := &OODAAgent{
		llm: &MockLLM{},
		env: env,
		exitChecker: ExitChecker{
			MaxIterations:   10,
			MinConfidence:   0.95,
			StagnationLimit: 2,
		},
	}

	// Override LLM to simulate stagnation
	agent.llm = &MockLLM{}
	// The mock will naturally show low confidence in early iterations

	state := agent.Run()

	fmt.Printf("\nFinal: Iteration %d, Confidence: %.2f, Reason: %s\n",
		state.Iteration, state.Confidence, state.GoalReason)
}

// --- Progress Tracking ---
// Shows how agents track their history for debugging and improvement.

func printHistory(history []AgentState) {
	fmt.Println("\n=== Execution History ===")
	fmt.Printf("%-5s %-12s %-30s\n", "Iter", "Confidence", "Action")
	fmt.Println(strings.Repeat("-", 50))
	for _, s := range history {
		action := s.Action
		if len(action) > 28 {
			action = action[:25] + "..."
		}
		fmt.Printf("%-5d %-12.2f %-30s\n", s.Iteration, s.Confidence, action)
	}
}

func main() {
	fmt.Println("OODA Agent Loop — Agent Engineering Hub")
	fmt.Println("=======================================")
	fmt.Println("Observe → Orient → Decide → Act → Repeat")
	fmt.Println("Exit conditions prevent infinite loops.")
	fmt.Println()

	// --- Demo 1: Successful Task Completion ---
	fmt.Println("============================================")
	fmt.Println("DEMO 1: Successful Task Completion")
	fmt.Println("============================================")

	env := NewEnvironment()
	agent := NewOODAAgent(env, 10, 0.90) // max 10 iterations, 90% confidence

	state := agent.Run()

	fmt.Printf("\nFinal Result:\n")
	fmt.Printf("  Iterations: %d\n", state.Iteration)
	fmt.Printf("  Final Confidence: %.2f\n", state.Confidence)
	fmt.Printf("  Exit Reason: %s\n", state.GoalReason)

	printHistory(agent.history)

	// --- Demo 2: Stagnation ---
	demoStagnation()

	// --- Summary ---
	fmt.Println("\n=== Key Takeaways ===")
	fmt.Println("1. OODA provides a clear cycle: Observe-Orient-Decide-Act.")
	fmt.Println("2. Every agent MUST have exit conditions to prevent infinite loops:")
	fmt.Println("   - Max iterations (hard safety limit)")
	fmt.Println("   - Confidence threshold (stop when good enough)")
	fmt.Println("   - Goal completion (stop when task is done)")
	fmt.Println("   - Stagnation detection (stop when stuck)")
	fmt.Println("3. Track iteration history for debugging and improvement.")
	fmt.Println("4. The environment updates after each action, enabling adaptive behavior.")
	fmt.Println("5. Real agents add: retry logic, fallback strategies, and human-in-the-loop.")
}
