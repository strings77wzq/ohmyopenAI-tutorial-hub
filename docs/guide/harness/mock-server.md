# Mock Server 模拟服务

Mock Server 是 Harness 的隔离层。它模拟 AI API 的响应，让你在不消耗真实 API 额度、不受外部波动影响的情况下运行测试。

## 为什么需要 Mock

### 成本控制

真实 AI API 按 Token 计费。一个完整的回归测试套件可能包含数百个场景，每个场景调用一次 API。如果每次都用真实 API：

```
100 场景 × 2000 tokens × $0.03/1K tokens = $6/次
每天运行 10 次 = $60/天 = $1800/月
```

用 Mock Server：

```
100 场景 × $0 = $0/次
每天运行 1000 次 = $0/月
```

### 可重复性

AI API 的输出是非确定性的——同样的输入，每次可能产生不同的输出。这导致：

- 今天通过的测试，明天可能失败（模型波动）
- 无法精确定位失败原因（是 Prompt 的问题还是模型的问题）
- 无法对比改进效果（噪声太大，看不出趋势）

Mock Server 返回固定的、预定义的响应，消除这种不确定性。

### 隔离外部依赖

测试不应该依赖外部服务的可用性。如果 AI API 服务宕机了，你的测试应该继续运行——因为 Harness 的职责就是验证你的逻辑，而不是验证第三方服务。

## Mock Server 的三种模式

### 模式 1：固定响应（Happy Path）

最简单的模式——每个请求返回预定义的固定响应。

```json
{
  "mock_routes": [
    {
      "path": "/v1/chat/completions",
      "method": "POST",
      "response": {
        "choices": [
          {
            "message": {
              "content": "这是一个加法函数，接受两个参数 a 和 b，返回它们的和。参数说明：a - 第一个加数；b - 第二个加数。返回值：a + b 的结果。"
            }
          }
        ],
        "usage": { "prompt_tokens": 50, "completion_tokens": 80 }
      }
    }
  ]
}
```

**适用场景**：日常回归测试、CI/CD 流程

### 模式 2：错误响应（Error Path）

模拟各种 API 错误，验证 Agent 的错误处理能力。

```json
{
  "mock_routes": [
    {
      "path": "/v1/chat/completions",
      "method": "POST",
      "response": {
        "error": {
          "type": "rate_limit_exceeded",
          "message": "Rate limit exceeded. Please retry after 60 seconds."
        }
      },
      "status": 429,
      "delay_ms": 0
    },
    {
      "path": "/v1/chat/completions",
      "method": "POST",
      "response": {
        "error": {
          "type": "server_error",
          "message": "Internal server error"
        }
      },
      "status": 500,
      "delay_ms": 0
    }
  ]
}
```

**适用场景**：错误处理测试、重试逻辑验证、降级策略测试

### 模式 3：延迟响应（Timeout）

模拟高延迟，验证 Agent 的超时处理。

```json
{
  "mock_routes": [
    {
      "path": "/v1/chat/completions",
      "method": "POST",
      "response": {
        "choices": [{ "message": { "content": "响应内容" } }]
      },
      "delay_ms": 30000,
      "timeout_ms": 10000
    }
  ]
}
```

**适用场景**：超时处理、降级策略、用户体验优化

## Mock 数据管理

### 版本化

Mock 数据应该像代码一样版本化。每次修改 Mock 响应，都应该有清晰的变更记录：

```
mock-data/
  v1/
    explain-code/
      happy-path.json
      error-429.json
      timeout.json
  v2/
    explain-code/
      happy-path.json    # Prompt 优化后的预期输出
```

### 覆盖完整场景

每个测试场景都应该有对应的 Mock 数据。Mock 数据的组织应该与测试场景的目录结构一致：

```
mock-data/
  explain-code/
    simple-function/
      mock-response.json
      mock-error.json
    recursive-function/
      mock-response.json
      mock-empty.json
```

### 数据来源

Mock 数据可以从三个来源获取：

1. **录制真实响应**：运行一次真实 API，录制响应作为 Mock 数据
2. **手工编写**：根据期望行为手工构造响应
3. **从失败案例中提取**：生产环境中观察到的真实输出，作为回归测试的 Mock 数据

```bash
# 录制模式：捕获真实 API 响应
harness mock record --output mock-data/recorded/

# 回放模式：用录制的数据运行测试
harness mock replay --data mock-data/recorded/
```

## Mock Server 配置示例

### 完整配置文件

```json
{
  "server": {
    "port": 8080,
    "host": "localhost"
  },
  "defaults": {
    "delay_ms": 0,
    "status": 200,
    "content_type": "application/json"
  },
  "routes": [
    {
      "path": "/v1/chat/completions",
      "method": "POST",
      "name": "explain-code",
      "scenarios": [
        {
          "name": "happy-path",
          "match": { "contains": "function" },
          "response": {
            "choices": [{ "message": { "content": "这是对函数的详细解释..." } }],
            "usage": { "prompt_tokens": 50, "completion_tokens": 100 }
          }
        },
        {
          "name": "error",
          "match": { "contains": "invalid" },
          "status": 400,
          "response": {
            "error": { "message": "Invalid input" }
          }
        }
      ],
      "default_response": {
        "choices": [{ "message": { "content": "默认响应" } }]
      }
    }
  ]
}
```

### 条件匹配

Mock Server 可以根据请求内容返回不同的响应：

```json
{
  "routes": [
    {
      "path": "/v1/chat/completions",
      "match_rules": [
        {
          "condition": { "body_contains": "递归" },
          "response": { "content": "递归是一种函数调用自身的技术..." }
        },
        {
          "condition": { "body_contains": "排序" },
          "response": { "content": "排序是将元素按特定顺序排列..." }
        },
        {
          "condition": { "body_contains": "空代码" },
          "status": 400,
          "response": { "error": { "message": "输入为空" } }
        }
      ]
    }
  ]
}
```

## 集成到测试流程

### 在测试中使用 Mock

```python
import pytest

@pytest.fixture(scope="session")
def mock_server():
    """启动 Mock Server"""
    server = MockServer(port=8080)
    server.load_data("mock-data/explain-code/")
    server.start()
    yield server
    server.stop()

@pytest.fixture
def agent(mock_server):
    """创建指向 Mock Server 的 Agent"""
    return Agent(api_base="http://localhost:8080/v1")

def test_explain_simple_function(agent):
    result = agent.run("explain", code="function add(a,b){return a+b}")
    assert "加法" in result
    assert "参数" in result
```

### 混合使用 Mock 和真实 API

在 CI/CD 中，推荐分层策略：

```yaml
# CI 流程
stages:
  - name: unit-test
    description: "用 Mock 运行全部回归测试"
    command: "harness run --mock tests/scenarios/"
    
  - name: smoke-test
    description: "用真实 API 运行少量冒烟测试"
    command: "harness run --real-api tests/smoke/"
    
  - name: integration-test
    description: "用真实 API 运行关键场景"
    command: "harness run --real-api tests/integration/"
```

这种分层策略：
- **单元测试**：用 Mock，快速、免费、完全可控
- **冒烟测试**：用真实 API，少量但覆盖核心功能
- **集成测试**：用真实 API，验证端到端流程

## Mock 的局限性

Mock 不是万能的。它有几个重要的局限：

### 1. 无法模拟模型的非确定性

Mock 返回固定响应，但真实模型的输出有变化。这意味着 Mock 测试通过不代表真实环境一定通过。

**应对策略**：定期用真实 API 运行冒烟测试，验证 Mock 与真实行为的一致性。

### 2. 无法模拟模型的能力边界

Mock 无法真实反映模型对特定输入的理解能力。一个在 Mock 测试中表现良好的 Prompt，在真实模型上可能效果很差。

**应对策略**：在关键场景中用真实 API 验证，而不仅仅依赖 Mock。

### 3. Mock 数据可能过时

随着 Prompt 和模型的演进，Mock 数据可能不再反映真实模型的行为。

**应对策略**：定期用真实 API 更新 Mock 数据，保持 Mock 与真实行为的同步。

## 最佳实践

1. **Mock 优先，真实验证兜底**：日常回归用 Mock，发布前用真实 API 冒烟
2. **Mock 数据版本化**：每次修改 Mock 响应都有记录
3. **录制真实响应**：从真实 API 录制响应作为 Mock 数据的来源
4. **覆盖完整场景**：每个测试场景都有对应的 Mock 数据
5. **定期同步**：用真实 API 定期更新 Mock 数据
6. **错误场景不可忽略**：Mock 不仅要模拟成功，还要模拟各种失败

## 下一步

理解了场景、评估器和 Mock Server 之后，接下来通过一个完整的实战案例，把这些知识串起来。

→ [Harness 实战案例](/guide/harness/practice)
