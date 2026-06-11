---
title: 安全边界与权限控制
description: 掌握工具调用的沙箱隔离、权限模型、危险操作防护、限流和审计日志设计
---

# 安全边界与权限控制

工具赋予了 Agent 执行真实操作的能力，这意味着安全风险也真实存在。权限控制不是可选项，而是生产环境的必需品。

## 默认安全原则

```
1. 最小权限: 只给工具完成任务所需的最低权限
2. 默认只读: 写操作必须显式声明和授权
3. 输入校验: 所有参数必须验证，不能信任模型输出
4. 输出限制: 工具返回值必须有大小上限
5. 沙箱隔离: 危险操作在隔离环境中执行
```

## 沙箱隔离

### 文件系统沙箱

工具只能访问指定目录：

```python
class FileSandbox:
    def __init__(self, allowed_roots):
        # 允许访问的根目录列表
        self.allowed_roots = [
            os.path.abspath(r) for r in allowed_roots
        ]

    def validate_path(self, path):
        abs_path = os.path.abspath(path)

        # 检查是否在允许的目录内
        for root in self.allowed_roots:
            if abs_path.startswith(root):
                return True

        return False

    def read_file(self, path):
        if not self.validate_path(path):
            return {
                "status": "error",
                "error": {
                    "code": "SANDBOX_VIOLATION",
                    "message": f"路径不在允许的范围内: {path}"
                }
            }
        # 执行实际读取
        return actual_read(path)
```

### 网络沙箱

限制工具可以访问的外部地址：

```python
class NetworkSandbox:
    def __init__(self, allowed_domains):
        self.allowed_domains = allowed_domains

    def validate_url(self, url):
        parsed = urlparse(url)
        domain = parsed.hostname

        # 检查域名是否在白名单中
        if domain not in self.allowed_domains:
            return False

        # 禁止访问内部网络
        if is_private_ip(domain):
            return False

        return True
```

## 权限模型

### 三级权限体系

```python
class ToolPermission:
    # 权限级别
    READ = "read"         # 只读：查询数据、读取文件
    WRITE = "write"       # 写入：创建/修改文件、发送消息
    ADMIN = "admin"       # 管理：删除数据、执行命令、修改配置

    def __init__(self):
        self.tool_permissions = {
            # 文件操作
            "read_file": self.READ,
            "write_file": self.WRITE,
            "delete_file": self.ADMIN,

            # API 调用
            "github_repo_info": self.READ,
            "github_create_issue": self.WRITE,

            # 数据查询
            "query_users": self.READ,
            "update_user": self.WRITE,
            "delete_user": self.ADMIN,

            # 系统操作
            "run_command": self.ADMIN,
            "execute_script": self.ADMIN,
        }
```

### 基于角色的访问控制

```python
class RoleBasedAccess:
    def __init__(self):
        self.roles = {
            "viewer": [ToolPermission.READ],
            "editor": [ToolPermission.READ, ToolPermission.WRITE],
            "admin": [ToolPermission.READ, ToolPermission.WRITE, ToolPermission.ADMIN]
        }

    def check_permission(self, role, tool_name):
        required = self.tool_permissions.get(tool_name)
        allowed = self.roles.get(role, [])

        if required not in allowed:
            return {
                "allowed": False,
                "reason": f"角色 {role} 无权执行 {tool_name}"
            }

        return {"allowed": True}
```

## 危险操作防护

### 需要二次确认的操作

```python
DANGEROUS_OPS = {
    "delete_file": {
        "confirm_message": "确认删除文件 {path}？此操作不可逆。",
        "requires_approval": True
    },
    "run_command": {
        "confirm_message": "确认执行命令: {command}？",
        "requires_approval": True
    },
    "send_email": {
        "confirm_message": "确认发送邮件到 {to}？",
        "requires_approval": True
    }
}

async def execute_with_confirmation(tool_name, params):
    danger = DANGEROUS_OPS.get(tool_name)

    if danger and danger["requires_approval"]:
        # 返回确认请求，不执行操作
        return {
            "status": "confirmation_required",
            "message": danger["confirm_message"].format(**params),
            "tool": tool_name,
            "params": params
        }

    # 安全操作，直接执行
    return await call_tool(tool_name, params)
```

### 危险命令过滤

```python
BLOCKED_COMMANDS = [
    "rm -rf",           # 递归删除
    "DROP TABLE",       # 删除数据库表
    "sudo",             # 提权执行
    "chmod 777",        # 全局权限
    "curl | sh",        # 管道执行
]

def validate_command(command):
    for blocked in BLOCKED_COMMANDS:
        if blocked.lower() in command.lower():
            return {
                "valid": False,
                "reason": f"命令包含危险操作: {blocked}"
            }
    return {"valid": True}
```

## 限流控制

### 工具级限流

```python
class RateLimiter:
    def __init__(self):
        self.limits = {
            "github_api": {"calls": 10, "window": 60},    # 每分钟 10 次
            "weather_api": {"calls": 30, "window": 60},   # 每分钟 30 次
            "send_email": {"calls": 5, "window": 3600},   # 每小时 5 次
        }
        self.call_history = {}

    def check_rate(self, tool_name):
        limit = self.limits.get(tool_name)
        if not limit:
            return {"allowed": True}

        now = time.time()
        history = self.call_history.get(tool_name, [])

        # 清理过期记录
        history = [t for t in history if now - t < limit["window"]]

        if len(history) >= limit["calls"]:
            return {
                "allowed": False,
                "reason": f"{tool_name} 超过频率限制",
                "retry_after": limit["window"] - (now - history[0])
            }

        history.append(now)
        self.call_history[tool_name] = history
        return {"allowed": True}
```

### 用户级限流

```python
class UserRateLimiter:
    def __init__(self):
        self.user_calls = {}  # user_id → [timestamp, ...]

    def check_user_rate(self, user_id, max_calls=100, window=3600):
        now = time.time()
        calls = self.user_calls.get(user_id, [])
        calls = [t for t in calls if now - t < window]

        if len(calls) >= max_calls:
            return {
                "allowed": False,
                "reason": "用户调用次数超限",
                "retry_after": window - (now - calls[0])
            }

        calls.append(now)
        self.user_calls[user_id] = calls
        return {"allowed": True}
```

## 审计日志

### 日志格式

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "user_id": "user_123",
  "session_id": "sess_abc",
  "tool": "write_file",
  "params": {"path": "src/main.ts"},
  "result_status": "success",
  "permission_level": "write",
  "duration_ms": 45,
  "sandbox": "project-root"
}
```

### 日志实现

```python
import json
from datetime import datetime

class AuditLogger:
    def __init__(self, log_file):
        self.log_file = log_file

    def log_tool_call(self, user_id, session_id, tool, params,
                      result_status, duration_ms):
        entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "user_id": user_id,
            "session_id": session_id,
            "tool": tool,
            "params": self._sanitize(params),  # 脱敏
            "result_status": result_status,
            "duration_ms": duration_ms
        }

        with open(self.log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")

    def _sanitize(self, params):
        """移除敏感字段"""
        sensitive_keys = {"password", "token", "secret", "api_key"}
        return {
            k: "***" if k in sensitive_keys else v
            for k, v in params.items()
        }
```

## 安全检查清单

| 检查项 | 状态 |
| --- | --- |
| 文件操作有沙箱限制 | □ |
| 写操作需要二次确认 | □ |
| 危险命令已过滤 | □ |
| API 调用有限流 | □ |
| 审计日志已启用 | □ |
| 敏感数据已脱敏 | □ |
| 错误信息不泄露内部路径 | □ |

## 练习

为一个文件管理 Agent 设计安全方案：

1. 定义哪些操作需要 `read`、`write`、`admin` 权限。
2. 设计一个沙箱，只允许访问 `/workspace` 目录。
3. 为 `delete_file` 操作设计二次确认流程。

## 下一步

→ 回到 [模块总览](/guide/tool-use/)，回顾全部内容。
