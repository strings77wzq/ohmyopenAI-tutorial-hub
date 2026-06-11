---
title: Error Handling & Retry
description: Master common tool call failures, retry strategies, timeout handling, and graceful degradation to build robust agent systems
---

# Error Handling & Retry

Tool calls will inevitably fail. Network timeouts, invalid parameters, insufficient permissions, unavailable services — if the agent cannot handle these gracefully, user experience degrades rapidly.

## Common Failure Types

| Failure Type | Cause | Retryable? | Example |
| --- | --- | --- | --- |
| Invalid parameters | Model passed invalid arguments | No | Wrong date format, missing required field |
| Insufficient permissions | No access to target resource | No | Unauthorized API call |
| Network timeout | Request took too long to respond | Yes | External API response exceeded 30s |
| Service unavailable | Target service is down | Yes | Database connection failed |
| Rate limited | Exceeded API call frequency limit | Yes (after waiting) | 429 Too Many Requests |
| Resource not found | Target resource deleted or wrong path | No | File does not exist, invalid user ID |

**Core principle**: Non-retryable errors should be reported immediately; retryable errors go through retry logic.

## Retry Strategies

### Simple Retry

```python
async def call_with_retry(tool_name, params, max_retries=3):
    for attempt in range(max_retries):
        try:
            result = await call_tool(tool_name, params)
            return result
        except RetryableError as e:
            if attempt == max_retries - 1:
                raise  # Final retry failed, raise exception
            await sleep(attempt * 1000)  # Wait before retrying
```

### Exponential Backoff

Retry intervals gradually increase to avoid putting more pressure on downstream services.

```python
async def call_with_backoff(tool_name, params, max_retries=3):
    for attempt in range(max_retries):
        try:
            return await call_tool(tool_name, params)
        except RetryableError as e:
            wait_time = (2 ** attempt) * 1000  # 1s, 2s, 4s
            await sleep(wait_time)
    raise MaxRetriesExceeded(tool_name)
```

### Backoff with Jitter

When multiple agents retry simultaneously, adding random jitter prevents a "retry storm."

```python
import random

async def call_with_jitter(tool_name, params, max_retries=3):
    for attempt in range(max_retries):
        try:
            return await call_tool(tool_name, params)
        except RetryableError:
            base_wait = 2 ** attempt * 1000
            jitter = random.randint(0, 1000)
            await sleep(base_wait + jitter)
```

## Timeout Handling

### Setting Reasonable Timeouts

```json
{
  "name": "fetch_page",
  "parameters": {
    "url": { "type": "string" },
    "timeout": {
      "type": "integer",
      "description": "Timeout in milliseconds, default 10000",
      "default": 10000
    }
  }
}
```

### Handling Timeouts

```python
async def fetch_with_timeout(url, timeout=10000):
    try:
        result = await asyncio.wait_for(
            call_tool("fetch_page", {"url": url, "timeout": timeout}),
            timeout=timeout / 1000
        )
        return result
    except asyncio.TimeoutError:
        return {
            "status": "timeout",
            "message": f"Request timed out ({timeout}ms)",
            "suggestion": "Please try again later or increase the timeout"
        }
```

## Graceful Degradation

When the primary tool is unavailable, switch to a fallback option.

### Degradation Strategies

```
Primary tool: search_web       → Fallback: query_local_cache
Primary tool: call_external    → Fallback: return_cached_result
Primary tool: complex_analysis → Fallback: simple_summary
```

### Implementation Pattern

```python
async def search_with_fallback(query):
    # Strategy 1: Try live search
    try:
        result = await call_tool("search_web", {"query": query})
        if result["results"]:
            return result
    except (TimeoutError, ServiceUnavailable):
        pass

    # Strategy 2: Degrade to local cache
    try:
        cached = await call_tool("search_cache", {"query": query})
        if cached["results"]:
            return {
                "results": cached["results"],
                "source": "cache",
                "notice": "Results are from cache and may not be up to date"
            }
    except Exception:
        pass

    # Strategy 3: Full degradation
    return {
        "results": [],
        "source": "fallback",
        "notice": "Search service is temporarily unavailable, please try again later"
    }
```

## Standardized Error Information

Tool errors should follow a unified format so the model can understand and handle them easily.

```json
{
  "status": "error",
  "error": {
    "code": "FILE_NOT_FOUND",
    "message": "File does not exist: /path/to/file.ts",
    "retryable": false,
    "suggestion": "Please check if the file path is correct"
  }
}
```

### Error Code Design

| Error Code | Meaning | Retryable? |
| --- | --- | --- |
| `INVALID_PARAMS` | Parameter validation failed | No |
| `UNAUTHORIZED` | Authentication failed | No |
| `NOT_FOUND` | Resource not found | No |
| `RATE_LIMITED` | Exceeded call limit | Yes (after waiting) |
| `TIMEOUT` | Request timed out | Yes |
| `SERVICE_UNAVAILABLE` | Service unavailable | Yes |

## Exercises

Design error handling solutions for the following scenarios:

1. A tool calls an external weather API that may time out.
2. A tool writes to a file, but the disk is full.
3. A tool queries a database, and the result exceeds 10MB.

<details>
<summary>Reference Answer (Weather API Timeout)</summary>

```python
async def get_weather(city):
    try:
        result = await call_tool("weather_api", {
            "city": city,
            "timeout": 5000
        })
        return result
    except TimeoutError:
        # Degrade: use cached weather data
        cached = await call_tool("get_cached_weather", {"city": city})
        if cached:
            return {
                **cached,
                "source": "cache",
                "warning": "Real-time data fetch timed out, showing cached data"
            }
        return {
            "error": "Weather service is temporarily unavailable",
            "retry_after": 30
        }
```

</details>

## Common Pitfalls

### Pitfall 1: Infinite Retry

No maximum retry count set, causing the agent to enter an infinite loop.

### Pitfall 2: Retrying Non-retryable Errors

A parameter format error will never succeed no matter how many times you retry — it should be reported to the user directly.

### Pitfall 3: Swallowing All Errors

```python
# ❌ Don't do this
try:
    result = await call_tool(...)
except Exception:
    return "Something went wrong"  # All context is lost
```

You should preserve error details for easier debugging.

## Next Steps

→ [Practice: Building a Tool Set](/guide/tool-use/practice)
