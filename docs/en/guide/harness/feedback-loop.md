# Feedback Loop

The feedback loop is the key mechanism that elevates a Harness from "passive checking" to "active improvement." It enables the Agent system to not only discover problems but also automatically learn and evolve from failures.

## What Is a Feedback Loop

A traditional Harness is a one-way flow: define scenarios → run tests → evaluate output → generate reports. Once the report is generated, the work is done — the rest relies on humans to analyze and fix.

The feedback loop turns this one-way flow into a closed loop:

```
Define scenarios → Run tests → Evaluate output → Analyze failures → Improve strategy → Re-run
    ▲                                                        │
    └────────────────────────────────────────────────────────┘
```

Key difference: **failure is not an endpoint but a starting point for improvement**. Every failure is analyzed, categorized, and converted into a concrete improvement action.

## Three-Layer Verification System

The core of the feedback loop is three-layer verification — expanding the verification scope from inside out:

### Layer 1: Self-Validation

After completing a task, the Agent checks its own output quality. This is the fastest, lowest-cost verification method.

```python
class SelfValidatingAgent:
    def execute(self, task):
        # Agent executes the task
        result = self.llm.generate(task)
        
        # Self-validation: check basic quality criteria
        validation = self.self_validate(result)
        
        if not validation.passed:
            # Auto-repair: attempt to improve output
            result = self.retry_with_feedback(
                task, 
                feedback=validation.feedback
            )
        
        return result
    
    def self_validate(self, output):
        """Basic self-validation checks"""
        checks = {
            "not_empty": len(output) > 0,
            "no_errors": "error" not in output.lower(),
            "language_correct": self.check_language(output),
            "format_valid": self.check_format(output)
        }
        
        return ValidationResult(
            passed=all(checks.values()),
            details=checks,
            feedback=self.generate_feedback(checks)
        )
```

**Pros and cons of self-validation**:
- Pros: Fast (millisecond-level), free (no external API calls), auto-repairable
- Cons: May have blind spots (checking yourself, standards may not be strict enough)

**Use cases**: Basic format checks, empty output detection, language checks

### Layer 2: Cross-Validation

Have another Agent or evaluator review the results. This provides an independent perspective that can catch self-validation blind spots.

```python
class CrossValidatingAgent:
    def __init__(self, executor_agent, reviewer_agent):
        self.executor = executor_agent
        self.reviewer = reviewer_agent
    
    def execute(self, task):
        # Executor completes the task
        result = self.executor.run(task)
        
        # Reviewer independently evaluates
        review = self.reviewer.evaluate(
            task=task,
            output=result,
            criteria=self.review_criteria
        )
        
        if review.score < self.threshold:
            # Review failed, executor revises based on feedback
            result = self.executor.revise(
                task=task,
                original_output=result,
                feedback=review.feedback
            )
        
        return result
```

**Pros and cons of cross-validation**:
- Pros: Independent perspective, catches self-validation blind spots, improves overall quality
- Cons: Higher cost (two LLM calls), greater latency

**Use cases**: Critical business logic, security-sensitive output, high-quality requirement scenarios

### Layer 3: Independent Verification

Verify with completely independent instances to reduce correlation risk. The executor and verifier use different models, different prompts, and different contexts.

```python
class IndependentVerification:
    def __init__(self):
        self.executor_model = "gpt-4"
        self.verifier_model = "claude-3-opus"
    
    def verify(self, task, result):
        # Independently verify with a different model
        verification_prompt = f"""
        Below is the execution result for a task. Please independently evaluate its quality:
        
        Task: {task}
        Result: {result}
        
        Evaluation criteria:
        1. Was the task completed correctly?
        2. Is the output quality acceptable?
        3. Are there obvious errors?
        
        Please provide a score (0-1) and detailed feedback.
        """
        
        verification = self.call_model(
            model=self.verifier_model,
            prompt=verification_prompt
        )
        
        return verification
```

**Pros and cons of independent verification**:
- Pros: Lowest correlation risk, highest consistency
- Cons: Highest cost (two different model calls), greatest latency

**Use cases**: Pre-release final verification, production critical decisions, high-risk scenarios

## Feedback Loop Design Patterns

### Pattern 1: Progressive Improvement

Start lenient and gradually tighten quality standards:

```
Round 1: Basic checks (no-error, contains)
    ↓ Discovered format issues
Round 2: + Format checks (json-valid, schema-valid)
    ↓ Discovered semantic issues
Round 3: + Semantic checks (semantic-match)
    ↓ Discovered language issues
Round 4: + Language checks (language-check)
    ↓ Discovered security issues
Round 5: + Security checks (no-prompt-leak, injection-detection)
```

Each iteration adds new check dimensions based on the previous round's failure analysis.

### Pattern 2: A/B Testing

Run two strategies simultaneously and let data decide which is better:

```python
class ABTest:
    def run(self, task, strategy_a, strategy_b):
        # Run strategy A
        result_a = strategy_a.execute(task)
        score_a = self.evaluate(result_a)
        
        # Run strategy B
        result_b = strategy_b.execute(task)
        score_b = self.evaluate(result_b)
        
        # Record comparison results
        self.metrics.record({
            "task": task,
            "strategy_a": {"result": result_a, "score": score_a},
            "strategy_b": {"result": result_b, "score": score_b}
        })
        
        # Return the better result
        return result_a if score_a >= score_b else result_b
```

### Pattern 3: Failure-Driven Scenario Generation

Every production failure is converted into a new test scenario:

```python
class FailureDrivenImprovement:
    def on_production_failure(self, failure):
        # Analyze failure cause
        analysis = self.analyze_failure(failure)
        
        # Generate corresponding test scenario
        scenario = self.generate_scenario(
            input=failure.input,
            expected_output=analysis.correct_output,
            failure_type=analysis.root_cause
        )
        
        # Add to test suite
        self.test_suite.add(scenario)
        
        # Run regression test to ensure fix
        results = self.test_suite.run()
        
        return {
            "new_scenario": scenario,
            "regression_results": results
        }
```

### Pattern 4: Quality Trend Tracking

Don't just look at the current pass rate — also track quality trends:

```python
class QualityTrendTracker:
    def track(self, test_results):
        # Record current data point
        self.history.append({
            "timestamp": datetime.now(),
            "pass_rate": test_results.pass_rate,
            "avg_score": test_results.avg_score,
            "by_capability": test_results.by_capability
        })
        
        # Analyze trend
        trend = self.analyze_trend()
        
        if trend.direction == "declining":
            self.alert(
                f"Quality trend declining: {trend.description}",
                severity="warning"
            )
        
        return trend
    
    def analyze_trend(self):
        """Analyze quality trend over the last N test runs"""
        recent = self.history[-10:]
        
        pass_rates = [r["pass_rate"] for r in recent]
        
        if len(pass_rates) < 3:
            return Trend(direction="stable", description="insufficient data")
        
        # Simple linear regression
        slope = self.calculate_slope(pass_rates)
        
        if slope < -0.02:
            return Trend(direction="declining", description=f"pass rate declining {abs(slope)*100:.1f}%/run")
        elif slope > 0.02:
            return Trend(direction="improving", description=f"pass rate improving {slope*100:.1f}%/run")
        else:
            return Trend(direction="stable", description="quality stable")
```

## Industry Practice References

| Team | Feedback Loop Approach | Core Characteristics |
|------|----------------------|---------------------|
| OpenAI | Agent Review Agent | Agents reviewing agents, cross-validation |
| Anthropic | Independent verification loop | Multiple independent instances verifying the same task |
| Google DeepMind | Test-driven evolution | Automated testing driving prompt optimization |
| Meta AI | Human-AI collaborative feedback | Combining human feedback with automated evaluation |

What these practices have in common: **feedback isn't one-time — it's a continuous loop**.

## Implementation Steps for the Feedback Loop

### Step 1: Establish a Baseline

```python
# Run initial tests and record baseline
baseline = harness.run_test_suite("explain-code")
metrics.record_baseline(baseline)
print(f"Baseline pass rate: {baseline.pass_rate}")
print(f"Baseline average score: {baseline.avg_score}")
```

### Step 2: Configure Feedback Collection

```python
# Configure feedback collector
feedback_collector = FeedbackCollector()
feedback_collector.on_failure(self.analyze_failure)
feedback_collector.on_success(self.record_success_pattern)
feedback_collector.on_trend_change(self.alert_trend)
```

### Step 3: Automate the Improvement Loop

```python
# Automatically trigger improvement analysis after each test run
class AutoImprovementLoop:
    def run_cycle(self):
        # 1. Run tests
        results = self.harness.run_all()
        
        # 2. Analyze failures
        failures = results.failures
        for failure in failures:
            analysis = self.analyzer.analyze(failure)
            
            # 3. Generate improvement suggestions
            suggestions = self.suggester.suggest(analysis)
            
            # 4. Auto-apply feasible improvements
            for suggestion in suggestions:
                if suggestion.auto_applicable:
                    self.apply_improvement(suggestion)
            
            # 5. Mark items needing human decision as todos
            if not suggestion.auto_applicable:
                self.create_todo(suggestion)
        
        # 6. Re-test to verify improvement effects
        new_results = self.harness.run_all()
        
        # 7. Compare before and after
        comparison = self.compare(results, new_results)
        
        return comparison
```

### Step 4: Regular Review and Adjustment

```python
# Review feedback loop effectiveness weekly
class WeeklyReview:
    def review(self):
        # Collect this week's data
        this_week = self.metrics.get_range("this_week")
        
        # Analyze improvement effects
        improvements = this_week.improvements
        regressions = this_week.regressions
        
        # Generate report
        report = {
            "improvements": len(improvements),
            "regressions": len(regressions),
            "net_change": len(improvements) - len(regressions),
            "top_issues": this_week.top_failure_reasons,
            "recommendations": self.generate_recommendations()
        }
        
        # Adjust feedback loop strategy
        self.adjust_strategy(report)
        
        return report
```

## Key Metrics for the Feedback Loop

Track these metrics to measure feedback loop effectiveness:

| Metric | Calculation | Target |
|--------|------------|--------|
| **Fix Time** | Time from failure discovery to fix | < 24 hours |
| **Regression Rate** | Proportion of failures recurring after fix | < 5% |
| **Scenario Coverage** | Proportion of capabilities with test coverage | > 80% |
| **Feedback Adoption Rate** | Proportion of improvement suggestions adopted | > 60% |
| **Quality Trend** | Slope of pass rate change | Positive or stable |

## Next Steps

The feedback loop solves the "continuous improvement" problem, but there's a more fundamental question: how to combat long-term system degradation? Next, learn about entropy management.

→ [Entropy Management](/en/guide/harness/entropy)
