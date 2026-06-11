---
title: 错误处理与重试
description: 掌握工具调用的常见故障、重试策略、超时处理和优雅降级方案，构建健壮的 Agent 系统
---

# 错误处理与重试

工具调用不可避免会失败。网络超时、参数错误、权限不足、服务不可用——如果 Agent 不能优雅地处理这些情况，用户体验会急剧下降。

## 常见故障类型

| 故障类型 | 原因 | 可重试 | 示例 |
| --- | --- | --- | --- |
| 参数错误 | 模型传了无效参数 | 否 | 日期格式错误、缺少必填字段 |
| 权限不足 | 无权访问目标资源 | 否 | 未授权的 API 调用 |
| 网络超时 | 请求响应太慢 | 是 | 外部 API 响应超过 30s |
| 服务不可用 | 目标服务宕机 | 是 | 数据库连接失败 |
| 限流 | 超过 API 调用频率限制 | 是（等待后） | 429 Too Many Requests |
| 资源不存在 | 目标资源已删除或路径错误 | 否 | 文件不存在、用户 ID 无效 |

**核心原则**：不可重试的错误直接报告，可重试的错误走重试逻辑。

## 重试策略

### 简单重试

```python
async def call_with_retry(tool_name, params, max_retries=3):
    for attempt in range(max_retries):
        try:
            result = await call_tool(tool_name, params)
            return result
        except RetryableError as e:
            if attempt == max_retries - 1:
                raise  # 最后一次重试失败，抛出异常
            await sleep(attempt * 1000)  # 等待后重试
```

### 指数退避（Exponential Backoff）

重试间隔逐渐增加，避免给下游服务施加更大压力。

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

### 带抖动的退避（Jitter）

多个 Agent 同时重试时，加随机抖动避免"重试风暴"。

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

## 超时处理

### 设置合理的超时时间

```json
{
  "name": "fetch_page",
  "parameters": {
    "url": { "type": "string" },
    "timeout": {
      "type": "integer",
      "description": "超时时间（毫秒），默认 10000",
      "default": 10000
    }
  }
}
```

### 超时后的处理

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
            "message": f"请求超时（{timeout}ms）",
            "suggestion": "请稍后重试或增加超时时间"
        }
```

## 优雅降级

当首选工具不可用时，切换到备选方案。

### 降级策略

```
主工具: search_web     → 降级: query_local_cache
主工具: call_external  → 降级: return_cached_result
主工具: complex_analysis → 降级: simple_summary
```

### 实现模式

```python
async def search_with_fallback(query):
    # 策略 1: 尝试实时搜索
    try:
        result = await call_tool("search_web", {"query": query})
        if result["results"]:
            return result
    except (TimeoutError, ServiceUnavailable):
        pass

    # 策略 2: 降级到本地缓存
    try:
        cached = await call_tool("search_cache", {"query": query})
        if cached["results"]:
            return {
                "results": cached["results"],
                "source": "cache",
                "notice": "结果来自缓存，可能不是最新"
            }
    except Exception:
        pass

    # 策略 3: 完全降级
    return {
        "results": [],
        "source": "fallback",
        "notice": "搜索服务暂时不可用，建议稍后重试"
    }
```

## 错误信息规范化

工具返回的错误应该统一格式，方便模型理解和处理。

```json
{
  "status": "error",
  "error": {
    "code": "FILE_NOT_FOUND",
    "message": "文件不存在: /path/to/file.ts",
    "retryable": false,
    "suggestion": "请检查文件路径是否正确"
  }
}
```

### 错误码设计

| 错误码 | 含义 | 可重试 |
| --- | --- | --- |
| `INVALID_PARAMS` | 参数校验失败 | 否 |
| `UNAUTHORIZED` | 认证失败 | 否 |
| `NOT_FOUND` | 资源不存在 | 否 |
| `RATE_LIMITED` | 超过调用限制 | 是（等待后） |
| `TIMEOUT` | 请求超时 | 是 |
| `SERVICE_UNAVAILABLE` | 服务不可用 | 是 |

## 练习

为以下场景设计错误处理方案：

1. 工具调用外部天气 API，可能超时。
2. 工具写入文件，但磁盘已满。
3. 工具查询数据库，返回结果超过 10MB。

<details>
<summary>参考答案（天气 API 超时）</summary>

```python
async def get_weather(city):
    try:
        result = await call_tool("weather_api", {
            "city": city,
            "timeout": 5000
        })
        return result
    except TimeoutError:
        # 降级: 使用缓存的天气数据
        cached = await call_tool("get_cached_weather", {"city": city})
        if cached:
            return {
                **cached,
                "source": "cache",
                "warning": "实时数据获取超时，显示缓存数据"
            }
        return {
            "error": "天气服务暂时不可用",
            "retry_after": 30
        }
```

</details>

## 常见陷阱

### 陷阱 1：无限重试

没有设置最大重试次数，导致 Agent 陷入死循环。

### 陷阱 2：重试不可重试的错误

参数格式错误重试多少次都不会成功，应该直接报告给用户。

### 陷阱 3：吞掉所有错误

```python
# ❌ 不要这样做
try:
    result = await call_tool(...)
except Exception:
    return "出错了"  # 丢失了所有上下文
```

应该保留错误详情，方便排查。

## 下一步

→ [实战：构建工具集](/guide/tool-use/practice)
