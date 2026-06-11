---
title: Security Boundaries & Access Control
description: Master sandbox isolation, permission models, dangerous operation protection, rate limiting, and audit log design for tool calls
---

# Security Boundaries & Access Control

Tools give agents the ability to execute real operations, which means real security risks. Access control is not optional — it is a requirement for production environments.

## Secure-by-Default Principles

```
1. Least privilege: Grant tools only the minimum permissions needed to complete their task
2. Read-only by default: Write operations must be explicitly declared and authorized
3. Input validation: All parameters must be validated; never trust model output
4. Output limits: Tool return values must have size caps
5. Sandbox isolation: Dangerous operations execute in isolated environments
```

## Sandbox Isolation

### File System Sandbox

Tools can only access designated directories:

```python
class FileSandbox:
    def __init__(self, allowed_roots):
        # List of allowed root directories
        self.allowed_roots = [
            os.path.abspath(r) for r in allowed_roots
        ]

    def validate_path(self, path):
        abs_path = os.path.abspath(path)

        # Check if the path is within an allowed directory
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
                    "message": f"Path is outside the allowed scope: {path}"
                }
            }
        # Perform the actual read
        return actual_read(path)
```

### Network Sandbox

Restrict which external addresses tools can access:

```python
class NetworkSandbox:
    def __init__(self, allowed_domains):
        self.allowed_domains = allowed_domains

    def validate_url(self, url):
        parsed = urlparse(url)
        domain = parsed.hostname

        # Check if domain is in the allowlist
        if domain not in self.allowed_domains:
            return False

        # Block access to internal networks
        if is_private_ip(domain):
            return False

        return True
```

## Permission Model

### Three-Tier Permission System

```python
class ToolPermission:
    # Permission levels
    READ = "read"         # Read-only: query data, read files
    WRITE = "write"       # Write: create/modify files, send messages
    ADMIN = "admin"       # Admin: delete data, execute commands, modify configuration

    def __init__(self):
        self.tool_permissions = {
            # File operations
            "read_file": self.READ,
            "write_file": self.WRITE,
            "delete_file": self.ADMIN,

            # API calls
            "github_repo_info": self.READ,
            "github_create_issue": self.WRITE,

            # Data queries
            "query_users": self.READ,
            "update_user": self.WRITE,
            "delete_user": self.ADMIN,

            # System operations
            "run_command": self.ADMIN,
            "execute_script": self.ADMIN,
        }
```

### Role-Based Access Control

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
                "reason": f"Role {role} does not have permission to execute {tool_name}"
            }

        return {"allowed": True}
```

## Dangerous Operation Protection

### Operations Requiring Confirmation

```python
DANGEROUS_OPS = {
    "delete_file": {
        "confirm_message": "Confirm deletion of file {path}? This action cannot be undone.",
        "requires_approval": True
    },
    "run_command": {
        "confirm_message": "Confirm execution of command: {command}?",
        "requires_approval": True
    },
    "send_email": {
        "confirm_message": "Confirm sending email to {to}?",
        "requires_approval": True
    }
}

async def execute_with_confirmation(tool_name, params):
    danger = DANGEROUS_OPS.get(tool_name)

    if danger and danger["requires_approval"]:
        # Return a confirmation request without executing the operation
        return {
            "status": "confirmation_required",
            "message": danger["confirm_message"].format(**params),
            "tool": tool_name,
            "params": params
        }

    # Safe operation, execute directly
    return await call_tool(tool_name, params)
```

### Dangerous Command Filtering

```python
BLOCKED_COMMANDS = [
    "rm -rf",           # Recursive deletion
    "DROP TABLE",       # Delete database tables
    "sudo",             # Privilege escalation
    "chmod 777",        # Full permissions
    "curl | sh",        # Piped execution
]

def validate_command(command):
    for blocked in BLOCKED_COMMANDS:
        if blocked.lower() in command.lower():
            return {
                "valid": False,
                "reason": f"Command contains dangerous operation: {blocked}"
            }
    return {"valid": True}
```

## Rate Limiting

### Tool-Level Rate Limiting

```python
class RateLimiter:
    def __init__(self):
        self.limits = {
            "github_api": {"calls": 10, "window": 60},    # 10 calls per minute
            "weather_api": {"calls": 30, "window": 60},   # 30 calls per minute
            "send_email": {"calls": 5, "window": 3600},   # 5 calls per hour
        }
        self.call_history = {}

    def check_rate(self, tool_name):
        limit = self.limits.get(tool_name)
        if not limit:
            return {"allowed": True}

        now = time.time()
        history = self.call_history.get(tool_name, [])

        # Clean up expired records
        history = [t for t in history if now - t < limit["window"]]

        if len(history) >= limit["calls"]:
            return {
                "allowed": False,
                "reason": f"{tool_name} exceeded rate limit",
                "retry_after": limit["window"] - (now - history[0])
            }

        history.append(now)
        self.call_history[tool_name] = history
        return {"allowed": True}
```

### User-Level Rate Limiting

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
                "reason": "User call limit exceeded",
                "retry_after": window - (now - calls[0])
            }

        calls.append(now)
        self.user_calls[user_id] = calls
        return {"allowed": True}
```

## Audit Logging

### Log Format

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

### Log Implementation

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
            "params": self._sanitize(params),  # Redact sensitive fields
            "result_status": result_status,
            "duration_ms": duration_ms
        }

        with open(self.log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")

    def _sanitize(self, params):
        """Remove sensitive fields"""
        sensitive_keys = {"password", "token", "secret", "api_key"}
        return {
            k: "***" if k in sensitive_keys else v
            for k, v in params.items()
        }
```

## Security Checklist

| Check Item | Status |
| --- | --- |
| File operations have sandbox restrictions | ☐ |
| Write operations require confirmation | ☐ |
| Dangerous commands are filtered | ☐ |
| API calls have rate limiting | ☐ |
| Audit logging is enabled | ☐ |
| Sensitive data is redacted | ☐ |
| Error messages do not expose internal paths | ☐ |

## Exercises

Design a security plan for a file management agent:

1. Define which operations require `read`, `write`, and `admin` permissions.
2. Design a sandbox that only allows access to the `/workspace` directory.
3. Design a confirmation flow for the `delete_file` operation.

## Next Steps

→ Back to [Module Overview](/guide/tool-use/) to review all content.
