# 反馈循环

反馈循环是 Harness 从"被动检查"升级为"主动改进"的关键机制。它让 Agent 系统不仅能发现问题，还能自动从失败中学习和进化。

## 什么是反馈循环

传统的 Harness 是一个单向流程：定义场景 → 运行测试 → 评估输出 → 生成报告。报告生成后，工作就结束了——剩下的靠人去分析和修复。

反馈循环把这个单向流程变成闭环：

```
定义场景 → 运行测试 → 评估输出 → 分析失败 → 改进策略 → 重新运行
    ▲                                                    │
    └────────────────────────────────────────────────────┘
```

关键区别：**失败不是终点，而是改进的起点**。每次失败都会被分析、归类、转化为具体的改进动作。

## 三层验证体系

反馈循环的核心是三层验证——从内到外逐层扩大验证范围：

### 第一层：自验证（Self-Validation）

Agent 完成任务后，自己检查输出质量。这是最快、最低成本的验证方式。

```python
class SelfValidatingAgent:
    def execute(self, task):
        # Agent 执行任务
        result = self.llm.generate(task)
        
        # 自验证：检查基本质量标准
        validation = self.self_validate(result)
        
        if not validation.passed:
            # 自动修复：尝试改进输出
            result = self.retry_with_feedback(
                task, 
                feedback=validation.feedback
            )
        
        return result
    
    def self_validate(self, output):
        """基本的自验证检查"""
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

**自验证的优缺点**：
- 优点：快速（毫秒级）、免费（不调用外部 API）、可自动修复
- 缺点：可能有盲区（自己检查自己，标准可能不够严格）

**适用场景**：基本的格式检查、空输出检测、语言检查

### 第二层：交叉验证（Cross-Validation）

用另一个 Agent 或评估器审核结果。这提供了独立的视角，能发现自验证的盲区。

```python
class CrossValidatingAgent:
    def __init__(self, executor_agent, reviewer_agent):
        self.executor = executor_agent
        self.reviewer = reviewer_agent
    
    def execute(self, task):
        # 执行者完成任务
        result = self.executor.run(task)
        
        # 审查者独立评估
        review = self.reviewer.evaluate(
            task=task,
            output=result,
            criteria=self.review_criteria
        )
        
        if review.score < self.threshold:
            # 审查不通过，执行者根据反馈修改
            result = self.executor.revise(
                task=task,
                original_output=result,
                feedback=review.feedback
            )
        
        return result
```

**交叉验证的优缺点**：
- 优点：独立视角、能发现自验证盲区、提高整体质量
- 缺点：成本更高（两次 LLM 调用）、延迟更大

**适用场景**：关键业务逻辑、安全敏感的输出、高质量要求的场景

### 第三层：独立验证（Independent Verification）

用完全独立的实例验证，降低关联风险。执行者和验证者使用不同的模型、不同的 Prompt、不同的上下文。

```python
class IndependentVerification:
    def __init__(self):
        self.executor_model = "gpt-4"
        self.verifier_model = "claude-3-opus"
    
    def verify(self, task, result):
        # 用不同的模型独立验证
        verification_prompt = f"""
        以下是对任务的执行结果。请独立评估其质量：
        
        任务: {task}
        结果: {result}
        
        评估标准:
        1. 是否正确完成了任务
        2. 输出质量是否可接受
        3. 是否存在明显错误
        
        请给出评分(0-1)和详细反馈。
        """
        
        verification = self.call_model(
            model=self.verifier_model,
            prompt=verification_prompt
        )
        
        return verification
```

**独立验证的优缺点**：
- 优点：最低的关联风险、最高的一致性
- 缺点：成本最高（两个不同模型的调用）、延迟最大

**适用场景**：发布前的最终验证、生产环境的关键决策、高风险场景

## 反馈循环的设计模式

### 模式 1：渐进式改进

从宽松到严格，逐步提升质量标准：

```
第 1 轮: 基本检查 (no-error, contains)
    ↓ 发现格式问题
第 2 轮: + 格式检查 (json-valid, schema-valid)
    ↓ 发现语义问题
第 3 轮: + 语义检查 (semantic-match)
    ↓ 发现语言问题
第 4 轮: + 语言检查 (language-check)
    ↓ 发现安全问题
第 5 轮: + 安全检查 (no-prompt-leak, injection-detection)
```

每次迭代都基于上一轮的失败分析，添加新的检查维度。

### 模式 2：A/B 测试

同时运行两种策略，用数据决定哪种更好：

```python
class ABTest:
    def run(self, task, strategy_a, strategy_b):
        # 运行策略 A
        result_a = strategy_a.execute(task)
        score_a = self.evaluate(result_a)
        
        # 运行策略 B
        result_b = strategy_b.execute(task)
        score_b = self.evaluate(result_b)
        
        # 记录对比结果
        self.metrics.record({
            "task": task,
            "strategy_a": {"result": result_a, "score": score_a},
            "strategy_b": {"result": result_b, "score": score_b}
        })
        
        # 返回更好的结果
        return result_a if score_a >= score_b else result_b
```

### 模式 3：失败驱动的场景补充

每次生产环境的失败都转化为新的测试场景：

```python
class FailureDrivenImprovement:
    def on_production_failure(self, failure):
        # 分析失败原因
        analysis = self.analyze_failure(failure)
        
        # 生成对应的测试场景
        scenario = self.generate_scenario(
            input=failure.input,
            expected_output=analysis.correct_output,
            failure_type=analysis.root_cause
        )
        
        # 添加到测试套件
        self.test_suite.add(scenario)
        
        # 运行回归测试确保修复
        results = self.test_suite.run()
        
        return {
            "new_scenario": scenario,
            "regression_results": results
        }
```

### 模式 4：质量趋势追踪

不仅看当前的通过率，还要追踪质量趋势：

```python
class QualityTrendTracker:
    def track(self, test_results):
        # 记录当前数据点
        self.history.append({
            "timestamp": datetime.now(),
            "pass_rate": test_results.pass_rate,
            "avg_score": test_results.avg_score,
            "by_capability": test_results.by_capability
        })
        
        # 分析趋势
        trend = self.analyze_trend()
        
        if trend.direction == "declining":
            self.alert(
                f"质量趋势下降: {trend.description}",
                severity="warning"
            )
        
        return trend
    
    def analyze_trend(self):
        """分析最近 N 次测试的质量趋势"""
        recent = self.history[-10:]
        
        pass_rates = [r["pass_rate"] for r in recent]
        
        if len(pass_rates) < 3:
            return Trend(direction="stable", description="数据不足")
        
        # 简单线性回归
        slope = self.calculate_slope(pass_rates)
        
        if slope < -0.02:
            return Trend(direction="declining", description=f"通过率下降 {abs(slope)*100:.1f}%/次")
        elif slope > 0.02:
            return Trend(direction="improving", description=f"通过率上升 {slope*100:.1f}%/次")
        else:
            return Trend(direction="stable", description="质量稳定")
```

## 行业实践参考

| 团队 | 反馈循环方式 | 核心特点 |
|------|-------------|---------|
| OpenAI | Agent Review Agent | 用 Agent 审查 Agent，交叉验证 |
| Anthropic | 独立验证回路 | 多个独立实例验证同一任务 |
| Google DeepMind | 测试驱动进化 | 自动化测试驱动 Prompt 优化 |
| Meta AI | 人机协作反馈 | 人类反馈与自动评估结合 |

这些实践的共同点：**反馈不是一次性的，而是持续的循环**。

## 反馈循环的实施步骤

### Step 1：建立基线

```python
# 运行初始测试，记录基线
baseline = harness.run_test_suite("explain-code")
metrics.record_baseline(baseline)
print(f"基线通过率: {baseline.pass_rate}")
print(f"基线平均分: {baseline.avg_score}")
```

### Step 2：配置反馈收集

```python
# 配置反馈收集器
feedback_collector = FeedbackCollector()
feedback_collector.on_failure(self.analyze_failure)
feedback_collector.on_success(self.record_success_pattern)
feedback_collector.on_trend_change(self.alert_trend)
```

### Step 3：自动化改进循环

```python
# 每次测试后自动触发改进分析
class AutoImprovementLoop:
    def run_cycle(self):
        # 1. 运行测试
        results = self.harness.run_all()
        
        # 2. 分析失败
        failures = results.failures
        for failure in failures:
            analysis = self.analyzer.analyze(failure)
            
            # 3. 生成改进建议
            suggestions = self.suggester.suggest(analysis)
            
            # 4. 自动应用可行的改进
            for suggestion in suggestions:
                if suggestion.auto_applicable:
                    self.apply_improvement(suggestion)
            
            # 5. 需要人工决策的标记为待办
            if not suggestion.auto_applicable:
                self.create_todo(suggestion)
        
        # 6. 重新测试验证改进效果
        new_results = self.harness.run_all()
        
        # 7. 对比前后效果
        comparison = self.compare(results, new_results)
        
        return comparison
```

### Step 4：定期回顾和调整

```python
# 每周回顾反馈循环的效果
class WeeklyReview:
    def review(self):
        # 收集本周数据
        this_week = self.metrics.get_range("this_week")
        
        # 分析改进效果
        improvements = this_week.improvements
        regressions = this_week.regressions
        
        # 生成报告
        report = {
            "improvements": len(improvements),
            "regressions": len(regressions),
            "net_change": len(improvements) - len(regressions),
            "top_issues": this_week.top_failure_reasons,
            "recommendations": self.generate_recommendations()
        }
        
        # 调整反馈循环策略
        self.adjust_strategy(report)
        
        return report
```

## 反馈循环的关键指标

追踪以下指标来衡量反馈循环的效果：

| 指标 | 计算方式 | 目标 |
|------|---------|------|
| **修复时间** | 失败发现到修复的时间 | < 24 小时 |
| **回归率** | 修复后再次失败的比例 | < 5% |
| **场景覆盖率** | 有测试场景覆盖的能力比例 | > 80% |
| **反馈采纳率** | 改进建议被采纳的比例 | > 60% |
| **质量趋势** | 通过率的变化斜率 | 正向或稳定 |

## 下一步

反馈循环解决了"持续改进"的问题，但还有一个更根本的问题：如何对抗系统的长期退化？接下来学习熵管理。

→ [熵管理](/guide/harness/entropy)
