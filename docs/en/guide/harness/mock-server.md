# Mock Server

The Mock Server is the isolation layer of a Harness. It simulates AI API responses, letting you run tests without consuming real API quota or being affected by external fluctuations.

## Why You Need Mocks

### Cost Control

Real AI APIs charge per token. A complete regression test suite might contain hundreds of scenarios, each making one API call. If you use the real API every time:

```
100 scenarios × 2,000 tokens × $0.03/1K tokens = $6/run
10 runs per day = $60/day = $1,800/month
```

With a Mock Server:

```
100 scenarios × $0 = $0/run
1,000 runs per day = $0/month
```

### Reproducibility

AI API output is non-deterministic — the same input may produce different output each time. This causes:

- Tests that pass today may fail tomorrow (model fluctuation)
- Inability to pinpoint failure causes (is it a prompt issue or a model issue?)
- Inability to compare improvement effects (too much noise to see trends)

A Mock Server returns fixed, predefined responses, eliminating this uncertainty.

### Isolating External Dependencies

Tests shouldn't depend on the availability of external services. If the AI API service goes down, your tests should continue running — because the Harness's job is to verify your logic, not to verify third-party services.

## Three Modes of the Mock Server

### Mode 1: Fixed Response (Happy Path)

The simplest mode — every request returns a predefined fixed response.

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
              "content": "This is an addition function that accepts two parameters a and b and returns their sum. Parameter description: a - the first addend; b - the second addend. Return value: the result of a + b."
            }
          }
        ],
        "usage": { "prompt_tokens": 50, "completion_tokens": 80 }
      }
    }
  ]
}
```

**Use cases**: Daily regression testing, CI/CD pipelines

### Mode 2: Error Response (Error Path)

Simulates various API errors to verify the Agent's error handling capability.

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

**Use cases**: Error handling testing, retry logic verification, degradation strategy testing

### Mode 3: Delayed Response (Timeout)

Simulates high latency to verify the Agent's timeout handling.

```json
{
  "mock_routes": [
    {
      "path": "/v1/chat/completions",
      "method": "POST",
      "response": {
        "choices": [{ "message": { "content": "response content" } }]
      },
      "delay_ms": 30000,
      "timeout_ms": 10000
    }
  ]
}
```

**Use cases**: Timeout handling, degradation strategies, user experience optimization

## Mock Data Management

### Versioning

Mock data should be versioned just like code. Every modification to a Mock response should have a clear change record:

```
mock-data/
  v1/
    explain-code/
      happy-path.json
      error-429.json
      timeout.json
  v2/
    explain-code/
      happy-path.json    # Expected output after prompt optimization
```

### Cover All Scenarios

Every test scenario should have corresponding Mock data. The Mock data organization should mirror the test scenario directory structure:

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

### Data Sources

Mock data can come from three sources:

1. **Recording real responses**: Run a real API call once and record the response as Mock data
2. **Manual authoring**: Construct responses manually based on expected behavior
3. **Extracting from failure cases**: Real outputs observed in production, used as Mock data for regression testing

```bash
# Record mode: capture real API responses
harness mock record --output mock-data/recorded/

# Replay mode: run tests with recorded data
harness mock replay --data mock-data/recorded/
```

## Mock Server Configuration Example

### Full Configuration File

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
            "choices": [{ "message": { "content": "This is a detailed explanation of the function..." } }],
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
        "choices": [{ "message": { "content": "default response" } }]
      }
    }
  ]
}
```

### Conditional Matching

The Mock Server can return different responses based on request content:

```json
{
  "routes": [
    {
      "path": "/v1/chat/completions",
      "match_rules": [
        {
          "condition": { "body_contains": "recursion" },
          "response": { "content": "Recursion is a technique where a function calls itself..." }
        },
        {
          "condition": { "body_contains": "sorting" },
          "response": { "content": "Sorting arranges elements in a specific order..." }
        },
        {
          "condition": { "body_contains": "empty code" },
          "status": 400,
          "response": { "error": { "message": "Input is empty" } }
        }
      ]
    }
  ]
}
```

## Integration into the Test Workflow

### Using Mocks in Tests

```python
import pytest

@pytest.fixture(scope="session")
def mock_server():
    """Start the Mock Server"""
    server = MockServer(port=8080)
    server.load_data("mock-data/explain-code/")
    server.start()
    yield server
    server.stop()

@pytest.fixture
def agent(mock_server):
    """Create an Agent pointing to the Mock Server"""
    return Agent(api_base="http://localhost:8080/v1")

def test_explain_simple_function(agent):
    result = agent.run("explain", code="function add(a,b){return a+b}")
    assert "addition" in result
    assert "parameter" in result
```

### Mixing Mocks and Real APIs

In CI/CD, a layered strategy is recommended:

```yaml
# CI pipeline
stages:
  - name: unit-test
    description: "Run all regression tests with Mock"
    command: "harness run --mock tests/scenarios/"
    
  - name: smoke-test
    description: "Run a small set of smoke tests with real API"
    command: "harness run --real-api tests/smoke/"
    
  - name: integration-test
    description: "Run critical scenarios with real API"
    command: "harness run --real-api tests/integration/"
```

This layered strategy:
- **Unit tests**: Use Mock — fast, free, fully controllable
- **Smoke tests**: Use real API — small in number but covering core functionality
- **Integration tests**: Use real API — verifying end-to-end workflows

## Limitations of Mocks

Mocks aren't a silver bullet. They have several important limitations:

### 1. Can't Simulate Model Non-Determinism

Mocks return fixed responses, but real model output varies. This means passing Mock tests doesn't guarantee passing in a real environment.

**Mitigation**: Periodically run smoke tests with the real API to verify consistency between Mock and real behavior.

### 2. Can't Simulate Model Capability Boundaries

Mocks can't truly reflect a model's understanding of specific inputs. A prompt that performs well in Mock testing may perform poorly with the real model.

**Mitigation**: Verify with the real API in critical scenarios, not just relying on Mocks.

### 3. Mock Data Can Become Stale

As prompts and models evolve, Mock data may no longer reflect real model behavior.

**Mitigation**: Periodically update Mock data with the real API to keep Mocks in sync with real behavior.

## Best Practices

1. **Mock-first, real verification as backup**: Use Mocks for daily regression, real API for pre-release smoke testing
2. **Version Mock data**: Every Mock response change has a record
3. **Record real responses**: Record responses from the real API as the source for Mock data
4. **Cover all scenarios**: Every test scenario has corresponding Mock data
5. **Periodic sync**: Regularly update Mock data with the real API
6. **Don't skip error scenarios**: Mocks should simulate not just success but also various failures

## Next Steps

Now that you understand scenarios, evaluators, and the Mock Server, let's tie it all together with a complete hands-on example.

→ [Harness Hands-On Practice](/en/guide/harness/practice)
