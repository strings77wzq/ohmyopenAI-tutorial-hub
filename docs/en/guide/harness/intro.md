# Harness Introduction

> Harness Engineering: The engineering philosophy from "code creator" to "guardian of the creation process"

## What Is a Harness

**Harness = test harness**, borrowed from hardware engineering terminology. In electronics engineering, a harness is a set of connectors and cables used to connect and control the device under test in a test environment. Its mission is: **to establish a controllable, repeatable, and measurable test environment for a powerful but unpredictable device under test**.

In Agent engineering, the LLM is that "powerful but unpredictable device under test." The Harness is the entire quality infrastructure surrounding it:

```
AI Agent (powerful but unpredictable) + Harness (quality infrastructure) = Production-grade system (reliable and controllable)
```

More precisely:

```
Agent = Harness + LLM
```

This equation is not a metaphor — it is an architectural fact. LLMs provide intelligence: understanding, reasoning, generation. Harnesses provide reliability: testing, validation, constraints, monitoring. Without either side, you don't have a complete Agent system.

## Why You Need a Harness

### The Vibe Coding Dilemma

When you use AI to write code, you encounter a paradox: AI can produce high-quality code, but you can't guarantee it will do so every time. The same prompt might generate a perfect implementation today and a subtly buggy version tomorrow.

This isn't a flaw in AI — it's an inherent characteristic of probabilistic systems. And the traditional "write-and-run" workflow is completely unprepared for this non-determinism.

Soft constraints like prompts alone are far from sufficient. You need:

- **Hard validation**: Not "I think the AI said it right" but "the evaluator confirms the AI's output meets quality standards"
- **Reproducibility**: Not "it worked well this time" but "every run produces an acceptable result"
- **Traceability**: Not "I don't know why it failed" but "I can pinpoint exactly where the problem occurred"

### What Happens Without a Harness

Let's look at a real failure scenario:

```python
# Week 1: The prompt works well, AI output is stable
result = agent.run("Explain what this code does")
# Output: Accurate explanation ✅

# Week 3: The prompt has been modified several times, new features added
result = agent.run("Explain what this code does")
# Output: Starts including English comments ❌

# Week 5: The model provider updates the model
result = agent.run("Explain what this code does")
# Output: Format completely changes, downstream parsing fails ❌❌
```

Without a Harness, you don't even know when something went wrong. There are no tests, no evaluations, no baseline — you're just "hoping" the AI performs well consistently.

With a Harness, every prompt change, model update, and feature iteration triggers regression testing. Failures are automatically captured, categorized, and reported. You switch from "prayer mode" to "engineering mode."

## The R.E.S.T Model: Four Dimensions of Reliable Agent Systems

Building reliable Agent systems requires meeting standards across four dimensions simultaneously:

| Dimension | Definition | Key Requirements | How the Harness Supports It |
|-----------|-----------|-----------------|---------------------------|
| **R**eliability | Consistent stable service despite changes | Recoverable failures, idempotent operations, consistent behavior | Regression testing + consistency checks |
| **E**fficiency | Effective use of resources | Token budget control, low latency, high throughput | Performance benchmarks + cost monitoring |
| **S**ecurity | Protecting the system and data | Least privilege, sandbox execution, input/output filtering | Security testing + malicious input detection |
| **T**raceability | Auditable and trackable | Full-chain tracing, explainable decisions, auditable state | Execution traces + decision logs |

Each dimension is not an optional "nice to have" but a hard requirement for production. The Harness is the systematic means of satisfying all four dimensions simultaneously.

## Core Loop: Observe → Think → Act → Feedback

An Agent's operating mechanism can be abstracted into a four-stage loop:

```
Observe ──▶ Think ──▶ Act ──▶ Feedback
   ▲                          │
   └──────────────────────────┘
```

This is essentially a **REPL container** (Read-Eval-Print-Loop):

1. **Observe**: The Agent receives input — user requests, system state, context information
2. **Think**: The LLM reasons — analyzing requirements, planning steps, selecting strategies
3. **Act**: The Agent executes operations — calling tools, generating code, returning results
4. **Feedback**: The Harness validates output — evaluating quality, detecting anomalies, triggering retries

Key insight: **The Feedback stage is where the Harness plays its central role**. Without Feedback, the loop is an open-loop system — you don't know the quality of the output and can't automatically improve. With Feedback, the loop becomes a closed-loop system — every iteration is monitored, evaluated, and optimized.

## Six Design Principles

When building a Harness system, follow these six principles:

### 1. Design for Failure

Exceptions aren't occasional outliers — they're the norm in probabilistic systems. Your Harness must gracefully handle: model timeouts, output format errors, evaluator misjudgments, and dependency service unavailability.

```python
# Bad practice: Assuming AI will always succeed
result = ai_call(prompt)
process(result)

# Good practice: Prepare a response strategy for each failure type
try:
    result = ai_call(prompt, timeout=30)
    if not evaluator.validate(result):
        result = fallback_strategy(prompt)
except AITimeoutError:
    result = cached_response(prompt)
except AIParseError:
    result = repair_output(raw_response)
```

### 2. Contract First

Explicit, machine-readable contracts are more reliable than natural language requirements. Test scenarios are themselves contracts — they precisely define "what input should produce what quality of output."

```json
{
  "contract": {
    "input": "any valid JavaScript code",
    "output_must_contain": ["function description", "parameter description"],
    "output_must_not_contain": ["error", "undefined"],
    "max_latency_ms": 5000,
    "evaluator": "semantic-match",
    "threshold": 0.8
  }
}
```

### 3. Secure by Default

Least privilege principle: each component can only access the minimum set of resources needed to do its job. Mock Servers isolate external dependencies, sandbox execution isolates dangerous operations, and input filtering prevents injection attacks.

### 4. Separate Decision from Execution

Separate "deciding what to do" from "actually doing it." The Agent decides which steps to execute; the Harness verifies whether those steps are reasonable. This separation lets you adjust validation strategies without changing Agent logic.

### 5. Everything Is Measurable

What can't be measured can't be improved. For every Agent execution, the Harness should record: output quality scores, response times, token consumption, and evaluator judgment results. This data is the foundation of continuous improvement.

### 6. Data-Driven Evolution

The Harness isn't just a passive checking tool — it should actively drive the Agent's evolution. Patterns of evaluation failures should feed back into prompt design, test scenario creation, and model selection decisions.

## The Six Components of a Harness

### 1. Test Scenarios

Define inputs and quality standards for expected output. A scenario is an executable contract:

```json
{
  "name": "code explanation test",
  "input": "function add(a, b) { return a + b; }",
  "expectedOutput": "contains function description and parameter explanation",
  "evaluators": ["contains", "no-error"],
  "threshold": 0.8
}
```

### 2. Evaluators

Tools that automatically evaluate AI output quality. Different types of output require different evaluation strategies:

| Evaluator | Purpose | Use Cases |
|-----------|---------|-----------|
| `exact-match` | Exact match | Fixed-format output, ID generation |
| `contains` | Contains specific content | Tutorials, explanation outputs |
| `semantic-match` | Semantic similarity | Natural language answers, summaries |
| `json-valid` | JSON format validation | API responses, tool call results |
| `no-error` | No error output | Baseline check for all scenarios |
| `schema-valid` | Schema validation | Structured data output |
| `custom` | Custom logic | Special business rules |

### 3. Mock Server

Simulates AI API responses, enabling repeatable, zero-cost testing:

```
Real API: $$$ every call has a cost, output is uncertain
Mock Server: $0, fast, repeatable, fully controllable
```

### 4. Fixtures

Stable input sets that ensure every regression check covers the same key cases. Includes: code snippets, user questions, tool return values, error samples, and boundary conditions.

### 5. Traces

Record everything that happens in an Agent workflow: which context was read, which tools were called, and the input/output of each step. Traces are the fundamental evidence for locating failures — not something you add after problems occur, but something designed in from the start.

### 6. Failure Triage

Failure triage answers three key questions:

| Question | How to Determine | Why It Matters |
|----------|-----------------|----------------|
| Is it a prompt failure or a tool failure? | Compare traces and tool return values | Determines the fix direction: change the prompt or change the tool |
| Is it a new requirement or a regression? | Compare acceptance criteria with historical baselines | Determines handling priority |
| Is it model fluctuation or a deterministic defect? | Replay fixtures and mock responses | Determines whether the Harness itself needs modification |

## Harness vs. Traditional Testing

Understanding the differences is key to designing an effective Harness:

| Dimension | Unit Testing | Harness |
|-----------|-------------|---------|
| **What's tested** | Deterministic code logic | Probabilistic AI output |
| **Determinism** | Same input always produces same output | Output varies; some fluctuation must be tolerated |
| **Validation method** | Exact match (===) | Semantic evaluation (≥ threshold) |
| **Mock target** | Function/dependency return values | Entire AI API responses |
| **Failure handling** | Test failure = code bug | Test failure = needs triage (fluctuation or defect?) |
| **Baseline management** | Binary pass/fail | Continuous quality score tracking |

The core difference: **unit tests verify "did the code do the right thing," while a Harness verifies "is the AI's output good enough."** The former is a binary judgment; the latter is a continuous measurement.

## Harness Architecture Checklist

When designing a Harness system, confirm the following:

- [ ] Every test scenario has clear input, expected output, and failure explanation
- [ ] Mock Server can reproduce downstream success, failure, timeout, and empty data
- [ ] Each evaluator assesses one clear criterion (single responsibility)
- [ ] Fixtures cover normal paths, boundary inputs, and malicious inputs
- [ ] Traces can precisely attribute responsibility across context, tool calls, and model output
- [ ] The regression test suite runs automatically after every change
- [ ] Failure reports contain sufficient diagnostic information (input, output, evaluation details, environment)
- [ ] Key metrics (pass rate, latency, cost) have historical trend tracking

## Typical Usage Scenarios

### Scenario 1: Regression Verification for Prompt Changes

```python
# Modified the prompt template
prompt_template = "Please explain the following code in Chinese..."

# Run regression tests
results = harness.run_regression()

# Ensure existing functionality isn't broken
assert results.pass_rate >= 0.95
assert results.no_regression("explain-code")
```

### Scenario 2: Impact Assessment of Model Upgrades

```python
# Switch from GPT-4 to GPT-4o
harness.set_model("gpt-4o")

# Compare performance of old and new models on the same test suite
comparison = harness.compare(
    baseline="gpt-4",
    challenger="gpt-4o",
    test_suite="explain-code-full"
)

print(f"Quality change: {comparison.quality_delta}")
print(f"Cost change: {comparison.cost_delta}")
print(f"Latency change: {comparison.latency_delta}")
```

### Scenario 3: Continuous Production Monitoring

```python
# Sample from production logs every hour
samples = production_logger.sample(rate=0.01)

# Evaluate sampled results with evaluators
for sample in samples:
    score = evaluator.evaluate(sample.output, sample.expected)
    metrics.record("production_quality", score)

# Alert when below threshold
if metrics.avg("production_quality", window="1h") < 0.8:
    alert("Production quality dropping")
```

## Workflow Overview

```
┌─────────────────┐
│  Define Test     │  ← Clear inputs and quality standards
│  Scenarios       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Run Tests       │  ← Execute with Mock or real API
│                  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Evaluate with   │  ← Automatically judge output quality
│  Evaluators      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Triage          │  ← Distinguish fluctuation from defects
│  Failures        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Feedback &      │  ← Improve prompts, scenarios, evaluators
│  Iteration       │
└─────────────────┘
```

This process isn't a one-time thing — it's a continuously running loop. Every code change, prompt adjustment, and model update goes through this process again. This is the core value of a Harness: **transforming AI system iteration from "fumbling in the dark" to "data-driven."**

## Next Steps

Now that you understand the full picture of a Harness, the next step is to learn how to design specific test scenarios.

→ [Writing Test Scenarios](/en/guide/harness/writing-tests)
