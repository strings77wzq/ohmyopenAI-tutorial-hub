# Mock Server Guide

A Mock Server lets you run tests without consuming real API credits.

## Why Use Mocks

- Reduce costs
- Improve repeatability
- Isolate external fluctuations

## Basic Flow

1. Start the Mock Server
2. Point test requests to the mock address
3. Execute scenarios and evaluate

```bash
# Example
python harness/mock_server/server.py
pytest
```

## Common Configurations

- Fixed responses (Happy Path)
- Error responses (429/500)
- Delayed responses (simulating timeouts)

## Best Practices

- Use a fixed seed to ensure stable results
- Version-control your mock data
- Use real APIs only for a small number of smoke tests

## Next Steps

→ [Harness Practice](/guide/harness/practice)
