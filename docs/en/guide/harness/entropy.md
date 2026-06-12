# Entropy Management

Entropy management is the core long-term maintenance challenge of a Harness. Over time, any software system gradually degrades — code quality declines, documentation drifts from code, technical debt accumulates. Agent systems are especially prone to this because AI models themselves are constantly changing.

## What Is Entropy

In thermodynamics, entropy is a measure of system disorder. In software engineering, entropy describes a system's tendency to degrade over time:

```
Initial State (Low Entropy)           Over Time (Entropy Increase)
┌─────────────┐                     ┌─────────────┐
│ Clean code   │                     │ Messy code  │
│ Accurate docs│   ───▶              │ Stale docs  │
│ Complete tests│                    │ Failed tests│
│ Latest deps  │                     │ Outdated deps│
└─────────────┘                     └─────────────┘
```

Sources of entropy increase in Agent systems:

| Source | Manifestation | Harm |
|--------|--------------|------|
| **Prompt drift** | Prompt modified multiple times, deviating from original intent | Unpredictable Agent behavior |
| **Model updates** | Model provider updates the model, behavior changes | Previously passing tests suddenly fail |
| **Stale Mocks** | Mock data no longer reflects real model behavior | Mock tests pass but real environment fails |
| **Scenario bloat** | Test scenarios keep growing, maintenance cost rises | Longer run times, more false positives |
| **Evaluator decay** | Evaluation criteria no longer fit new output formats | Quality checks become ineffective |
| **Documentation rot** | Documentation inconsistent with actual code behavior | Newcomers can't understand the system |

## Three Entropy Management Strategies

### Strategy 1: Continuous Small Payments

Don't wait for problems to become severe before addressing them. Instead, **continuously** and **incrementally** pay down technical debt.

```
❌ Wrong approach:
Accumulate 3 months of tech debt → Spend a week fixing it → Immediately start accumulating again

✅ Right approach:
Each PR includes a small optimization → Schedule 1 hour/week for tech debt → Continuously maintain system health
```

**Concrete practice**:

```python
# On every prompt change
class PromptChange:
    def apply(self, new_prompt):
        # 1. Apply new prompt
        self.prompt = new_prompt
        
        # 2. Run regression tests
        results = self.harness.run_regression()
        
        # 3. If there are failures, fix immediately
        for failure in results.failures:
            self.fix_or_revert(failure)
        
        # 4. If scenarios are stale, update them
        for scenario in self.harness.get_stale_scenarios():
            self.update_scenario(scenario)
        
        # 5. Record change log
        self.changelog.record({
            "change": "prompt_update",
            "results": results.summary,
            "fixes": len(results.failures)
        })
```

**Core principle**: Every change comes with cleanup work — don't let debt accumulate.

### Strategy 2: Automated Detection and Repair

Use background agents to automatically scan and fix common entropy issues.

#### Doc Gardening

```python
class DocGardener:
    """Background agent that periodically scans documentation-code consistency"""
    
    def scan(self):
        issues = []
        
        # Scan outdated code examples
        for doc in self.docs:
            for code_block in doc.code_blocks:
                if not self.code_exists(code_block):
                    issues.append({
                        "type": "broken_code_example",
                        "doc": doc.path,
                        "line": code_block.line,
                        "severity": "medium"
                    })
        
        # Scan outdated API references
        for doc in self.docs:
            for api_ref in doc.api_references:
                if not self.api_exists(api_ref):
                    issues.append({
                        "type": "deprecated_api_reference",
                        "doc": doc.path,
                        "line": api_ref.line,
                        "severity": "high"
                    })
        
        return issues
    
    def auto_fix(self, issue):
        """Auto-fix issues that can be automatically resolved"""
        if issue["type"] == "broken_code_example":
            # Try to find an updated code example
            new_example = self.find_current_example(issue["doc"])
            if new_example:
                self.update_doc(issue["doc"], issue["line"], new_example)
                return True
        
        return False  # Needs manual handling
```

#### Test Suite Pruning

```python
class TestSuitePruner:
    """Periodically clean up invalid and stale test scenarios"""
    
    def prune(self):
        stats = self.get_scenario_stats()
        
        for scenario in stats:
            # Flag scenarios with persistently high failure rates
            if scenario.fail_rate > 0.9 and age(scenario) > 30:
                self.flag_for_review(scenario, "high_failure_rate")
            
            # Flag scenarios irrelevant to current capabilities
            if not self.is_relevant(scenario):
                self.flag_for_review(scenario, "irrelevant")
            
            # Flag duplicate scenarios
            if self.has_duplicate(scenario):
                self.flag_for_review(scenario, "duplicate")
        
        return self.generate_pruning_report()
```

#### Mock Data Synchronization

```python
class MockSyncer:
    """Periodically update Mock data with real API responses"""
    
    def sync(self):
        for mock_file in self.mock_files:
            scenario = self.load_scenario(mock_file)
            
            # Get current response from real API
            real_response = self.call_real_api(scenario.input)
            
            # Compare Mock data with real response
            if not self.responses_match(mock_file, real_response):
                # Update Mock data
                self.update_mock(mock_file, real_response)
                
                # Record change
                self.changelog.record({
                    "type": "mock_update",
                    "file": mock_file,
                    "reason": "real_api_drift"
                })
```

### Strategy 3: Periodic Deviation Scans

Run comprehensive system health checks periodically to discover hidden degradation issues.

```python
class EntropyScanner:
    """Periodic deviation scanner"""
    
    def scan_all(self):
        report = {
            "timestamp": datetime.now(),
            "checks": {}
        }
        
        # 1. Test suite health check
        report["checks"]["test_health"] = self.check_test_health()
        
        # 2. Mock data freshness check
        report["checks"]["mock_freshness"] = self.check_mock_freshness()
        
        # 3. Evaluator validity check
        report["checks"]["evaluator_validity"] = self.check_evaluators()
        
        # 4. Documentation consistency check
        report["checks"]["doc_consistency"] = self.check_docs()
        
        # 5. Dependency version check
        report["checks"]["dependency_versions"] = self.check_dependencies()
        
        return report
    
    def check_test_health(self):
        """Check test suite health status"""
        stats = self.test_suite.get_stats()
        
        return {
            "total_scenarios": stats.total,
            "pass_rate": stats.pass_rate,
            "avg_runtime": stats.avg_runtime,
            "stale_scenarios": stats.stale_count,
            "flaky_scenarios": stats.flaky_count,
            "status": "healthy" if stats.pass_rate > 0.9 else "needs_attention"
        }
    
    def check_mock_freshness(self):
        """Check Mock data freshness"""
        stale_mocks = []
        
        for mock_file in self.mock_files:
            age = self.get_age(mock_file)
            last_verified = self.get_last_verified(mock_file)
            
            if age > 30 or last_verified > 14:
                stale_mocks.append({
                    "file": mock_file,
                    "age_days": age,
                    "last_verified_days": last_verified
                })
        
        return {
            "total_mocks": len(self.mock_files),
            "stale_count": len(stale_mocks),
            "stale_details": stale_mocks,
            "status": "healthy" if len(stale_mocks) == 0 else "needs_sync"
        }
```

## Technical Debt Checklist

Maintain a technical debt checklist and select items to address during each iteration:

```markdown
## Technical Debt Checklist

### High Priority (Impact on Production Quality)
- [ ] Mock data stale (>30 days since verification) — 5 files
- [ ] Evaluator thresholds need adjustment for new model — 3 evaluators
- [ ] Timeout scenarios need increased timeout — 2 scenarios

### Medium Priority (Impact on Development Efficiency)
- [ ] Test runtime exceeds 5 minutes — needs parallelization
- [ ] 3 scenarios frequently flaky — need stabilization
- [ ] Code examples in documentation outdated — 5 locations

### Low Priority (Impact on Code Quality)
- [ ] Clean up unused test scenarios — 8 scenarios
- [ ] Refactor evaluator configuration — unify format
- [ ] Update dependency versions — 3 packages
```

**Handling principle**: Address at least one high-priority item per iteration, one medium-priority item every two weeks.

## Entropy Management Metrics

Track these metrics to measure entropy management effectiveness:

| Metric | Calculation | Target |
|--------|------------|--------|
| **Tech Debt Trend** | Change in checklist item count | Continuously decreasing |
| **Mock Freshness** | Proportion of Mocks unverified for >14 days | < 10% |
| **Test Flakiness Rate** | Proportion of intermittently failing scenarios | < 5% |
| **Documentation Coverage** | Proportion of features with accurate documentation | > 90% |
| **Dependency Update Rate** | Gap between dependency versions and latest | < 2 major versions behind |

## Automating Entropy Management

Integrate entropy management into the CI/CD pipeline for automation:

```yaml
# entropy-check.yml
name: Entropy Management Check

on:
  schedule:
    - cron: '0 2 * * 1'  # Every Monday at 2 AM
  pull_request:
    paths:
      - 'tests/**'
      - 'mock-data/**'
      - 'docs/**'

jobs:
  entropy-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check Mock data freshness
        run: python scripts/check_mock_freshness.py
      
      - name: Check test suite health
        run: python scripts/check_test_health.py
      
      - name: Check documentation consistency
        run: python scripts/check_doc_consistency.py
      
      - name: Generate entropy report
        run: python scripts/generate_entropy_report.py
      
      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: entropy-report
          path: reports/entropy-report.json
```

## Long-Term Evolution Path

```
Phase 1: Reactive (0-3 months)
├── Manual tech debt handling
├── Manual Mock data checks
└── Basic failure diagnostics

Phase 2: Proactive Maintenance (3-6 months)
├── Weekly tech debt paydown
├── Automated Mock synchronization
└── Periodic entropy scans

Phase 3: Preventive Management (6-12 months)
├── Automated doc gardening
├── Predictive maintenance
└── Quality trend forecasting

Phase 4: Self-Evolving System (12+ months)
├── Agent auto-optimizing itself
├── Auto-discovering and fixing degradation
└── Continuous self-improvement
```

## Core Philosophy

The ultimate goal of entropy management isn't "eliminating degradation" — that's impossible in a probabilistic system. The goal is to **make the rate of improvement exceed the rate of degradation**, keeping the system in a state of continuous improvement.

```
Improvement rate > Degradation rate → System continuously improves
Improvement rate = Degradation rate → System stays stable
Improvement rate < Degradation rate → System continuously degrades
```

The value of a Harness lies not just in finding problems, but in establishing a mechanism for continuous improvement — keeping the system healthy in an ever-changing environment.

## Summary

The complete knowledge base of Harness engineering:

1. **Scenarios**: Define "what to test" — reproducible, evaluable test cases
2. **Evaluators**: Define "how to judge" — automatic assessment of AI output quality
3. **Mock Server**: Achieve "repeatability" — isolate external dependencies
4. **Practice**: Build a complete Harness test suite from scratch
5. **Best Practices**: Design principles validated in production environments
6. **Feedback Loop**: From passive checking to active improvement
7. **Entropy Management**: Combat system degradation, maintain long-term quality

Remember the core formula: **Agent = Harness + LLM**

LLMs provide intelligence; Harnesses provide reliability. Together, they form complete Agent engineering.
