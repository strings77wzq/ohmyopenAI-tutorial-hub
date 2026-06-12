# 熵管理

熵管理是 Harness 长期运维的核心挑战。随着时间推移，任何软件系统都会逐渐退化——代码质量下降、文档与代码不一致、技术债务积累。Agent 系统尤其如此，因为 AI 模型本身就在不断变化。

## 什么是熵

在热力学中，熵是系统混乱度的度量。在软件工程中，熵描述了系统随时间退化的趋势：

```
初始状态 (低熵)              随时间推移 (熵增)
┌─────────────┐            ┌─────────────┐
│ 代码整洁     │            │ 代码混乱     │
│ 文档准确     │   ───▶     │ 文档过时     │
│ 测试完整     │            │ 测试失效     │
│ 依赖最新     │            │ 依赖陈旧     │
└─────────────┘            └─────────────┘
```

Agent 系统的熵增来源：

| 来源 | 表现 | 危害 |
|------|------|------|
| **Prompt 漂移** | Prompt 被多次修改，偏离原始意图 | Agent 行为不可预测 |
| **模型更新** | 模型提供商更新模型，行为变化 | 已通过的测试突然失败 |
| **Mock 过时** | Mock 数据不再反映真实模型行为 | Mock 测试通过但真实环境失败 |
| **场景膨胀** | 测试场景越来越多，维护成本上升 | 运行时间变长，假阳性增加 |
| **评估器失效** | 评估标准不再适用于新的输出格式 | 质量检查形同虚设 |
| **文档腐烂** | 文档与实际代码行为不一致 | 新人无法理解系统 |

## 熵管理三大策略

### 策略 1：持续小额偿还

不要等问题严重时集中处理，而是**持续**、**小额**地偿还技术债务。

```
❌ 错误做法：
积累了三个月的技术债务 → 集中一周处理 → 紧接着又开始积累

✅ 正确做法：
每次 PR 附带一个小优化 → 每周安排 1 小时技术债务 → 持续保持系统健康
```

**具体实践**：

```python
# 每次 Prompt 变更时
class PromptChange:
    def apply(self, new_prompt):
        # 1. 应用新 Prompt
        self.prompt = new_prompt
        
        # 2. 运行回归测试
        results = self.harness.run_regression()
        
        # 3. 如果有失败，立即修复
        for failure in results.failures:
            self.fix_or_revert(failure)
        
        # 4. 如果有场景过时，更新它
        for scenario in self.harness.get_stale_scenarios():
            self.update_scenario(scenario)
        
        # 5. 记录变更日志
        self.changelog.record({
            "change": "prompt_update",
            "results": results.summary,
            "fixes": len(results.failures)
        })
```

**核心原则**：每次变更都附带清理工作，不让债务累积。

### 策略 2：自动化检测和修复

用后台 Agent 自动扫描和修复常见的熵增问题。

#### 文档园丁（Doc Gardening）

```python
class DocGardener:
    """后台 Agent，定期扫描文档与代码的一致性"""
    
    def scan(self):
        issues = []
        
        # 扫描过时的代码示例
        for doc in self.docs:
            for code_block in doc.code_blocks:
                if not self.code_exists(code_block):
                    issues.append({
                        "type": "broken_code_example",
                        "doc": doc.path,
                        "line": code_block.line,
                        "severity": "medium"
                    })
        
        # 扫描过时的 API 引用
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
        """自动修复可自动修复的问题"""
        if issue["type"] == "broken_code_example":
            # 尝试找到新的代码示例
            new_example = self.find_current_example(issue["doc"])
            if new_example:
                self.update_doc(issue["doc"], issue["line"], new_example)
                return True
        
        return False  # 需要人工处理
```

#### 测试套件瘦身

```python
class TestSuitePruner:
    """定期清理无效和过时的测试场景"""
    
    def prune(self):
        stats = self.get_scenario_stats()
        
        for scenario in stats:
            # 标记长期不通过的场景
            if scenario.fail_rate > 0.9 and age(scenario) > 30:
                self.flag_for_review(scenario, "high_failure_rate")
            
            # 标记与当前能力无关的场景
            if not self.is_relevant(scenario):
                self.flag_for_review(scenario, "irrelevant")
            
            # 标记重复的场景
            if self.has_duplicate(scenario):
                self.flag_for_review(scenario, "duplicate")
        
        return self.generate_pruning_report()
```

#### Mock 数据同步

```python
class MockSyncer:
    """定期用真实 API 更新 Mock 数据"""
    
    def sync(self):
        for mock_file in self.mock_files:
            scenario = self.load_scenario(mock_file)
            
            # 用真实 API 获取当前响应
            real_response = self.call_real_api(scenario.input)
            
            # 对比 Mock 数据和真实响应
            if not self.responses_match(mock_file, real_response):
                # 更新 Mock 数据
                self.update_mock(mock_file, real_response)
                
                # 记录变更
                self.changelog.record({
                    "type": "mock_update",
                    "file": mock_file,
                    "reason": "real_api_drift"
                })
```

### 策略 3：定期偏差扫描

定期运行全面的系统健康检查，发现隐藏的退化问题。

```python
class EntropyScanner:
    """定期偏差扫描器"""
    
    def scan_all(self):
        report = {
            "timestamp": datetime.now(),
            "checks": {}
        }
        
        # 1. 测试套件健康检查
        report["checks"]["test_health"] = self.check_test_health()
        
        # 2. Mock 数据新鲜度检查
        report["checks"]["mock_freshness"] = self.check_mock_freshness()
        
        # 3. 评估器有效性检查
        report["checks"]["evaluator_validity"] = self.check_evaluators()
        
        # 4. 文档一致性检查
        report["checks"]["doc_consistency"] = self.check_docs()
        
        # 5. 依赖版本检查
        report["checks"]["dependency_versions"] = self.check_dependencies()
        
        return report
    
    def check_test_health(self):
        """检查测试套件的健康状态"""
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
        """检查 Mock 数据的新鲜度"""
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

## 技术债务清单

维护一份技术债务清单，每次迭代时从中选取处理：

```markdown
## 技术债务清单

### 高优先级（影响生产质量）
- [ ] Mock 数据已过时（>30天未验证）— 5 个文件
- [ ] 评估器阈值需要根据新模型调整 — 3 个评估器
- [ ] 超时场景需要增加超时时间 — 2 个场景

### 中优先级（影响开发效率）
- [ ] 测试运行时间超过 5 分钟 — 需要并行化
- [ ] 3 个场景经常 flaky — 需要稳定化
- [ ] 文档中的代码示例已过时 — 5 处

### 低优先级（影响代码质量）
- [ ] 清理未使用的测试场景 — 8 个场景
- [ ] 重构评估器配置 — 统一格式
- [ ] 更新依赖版本 — 3 个包
```

**处理原则**：每次迭代至少处理一个高优先级项，每两周处理一个中优先级项。

## 熵管理的度量

追踪以下指标来衡量熵管理的效果：

| 指标 | 计算方式 | 目标 |
|------|---------|------|
| **技术债务趋势** | 债务清单条目的增减 | 持续减少 |
| **Mock 新鲜度** | 超过 14 天未验证的 Mock 比例 | < 10% |
| **测试 Flaky 率** | 间歇性失败的场景比例 | < 5% |
| **文档覆盖率** | 有准确文档覆盖的功能比例 | > 90% |
| **依赖更新率** | 依赖版本与最新版的差距 | 落后 < 2 个主版本 |

## 熵管理的自动化

将熵管理集成到 CI/CD 流水线中，实现自动化：

```yaml
# entropy-check.yml
name: 熵管理检查

on:
  schedule:
    - cron: '0 2 * * 1'  # 每周一凌晨 2 点
  pull_request:
    paths:
      - 'tests/**'
      - 'mock-data/**'
      - 'docs/**'

jobs:
  entropy-check:
    runs-on: ubuntu-latest
    steps:
      - name: 检查 Mock 数据新鲜度
        run: python scripts/check_mock_freshness.py
      
      - name: 检查测试套件健康
        run: python scripts/check_test_health.py
      
      - name: 检查文档一致性
        run: python scripts/check_doc_consistency.py
      
      - name: 生成熵报告
        run: python scripts/generate_entropy_report.py
      
      - name: 上传报告
        uses: actions/upload-artifact@v3
        with:
          name: entropy-report
          path: reports/entropy-report.json
```

## 长期演进路径

```
阶段 1: 被动响应 (0-3 个月)
├── 手动处理技术债务
├── 人工检查 Mock 数据
└── 基础的失败诊断

阶段 2: 主动维护 (3-6 个月)
├── 每周技术债务偿还
├── 自动化 Mock 同步
└── 定期熵扫描

阶段 3: 预防性管理 (6-12 个月)
├── 自动化文档园丁
├── 预测性维护
└── 质量趋势预测

阶段 4: 自进化系统 (12+ 个月)
├── Agent 自动优化自身
├── 自动发现和修复退化
└── 持续自我改进
```

## 核心理念

熵管理的终极目标不是"消灭退化"——这在概率系统中是不可能的。目标是**让退化速度低于改进速度**，使系统整体处于持续改善的状态。

```
改进速度 > 退化速度 → 系统持续改善
改进速度 = 退化速度 → 系统保持稳定
改进速度 < 退化速度 → 系统持续退化
```

Harness 的价值不仅在于发现问题，更在于建立一个持续改进的机制——让系统在不断变化的环境中保持健康。

## 总结

Harness 工程的完整知识体系：

1. **场景**：定义"测什么"——可复现、可评估的测试用例
2. **评估器**：定义"怎么判"——自动评判 AI 输出质量
3. **Mock Server**：实现"可重复"——隔离外部依赖
4. **实战**：从零搭建完整的 Harness 测试套件
5. **最佳实践**：生产环境中验证过的设计准则
6. **反馈循环**：从被动检查到主动改进
7. **熵管理**：对抗系统退化，维护长期质量

记住核心公式：**Agent = Harness + LLM**

LLM 提供智能，Harness 提供可靠性。两者结合，才是完整的 Agent 工程。
