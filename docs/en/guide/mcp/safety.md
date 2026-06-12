# MCP Security Model

MCP servers connect to real systems — files, databases, APIs, even payment interfaces. Security design must come before feature expansion.

## Security Model Overview

MCP's security model is built on three layers of defense:

```
┌─────────────────────────────────────┐
│  Layer 1: Protocol Security         │
│  Capability negotiation, permission │
│  declarations, Root boundaries      │
├─────────────────────────────────────┤
│  Layer 2: Server Implementation     │
│  Input validation, permission       │
│  checks, output filtering           │
├─────────────────────────────────────┤
│  Layer 3: Runtime Security          │
│  Process isolation, audit logging,  │
│  rate limiting                      │
└─────────────────────────────────────┘
```

## Layer 1: Protocol Security

### Capability Negotiation

During connection setup, client and server exchange capability declarations. The server only exposes capabilities it declares; the client can only call interfaces the server declares.

```
Server declares:
  tools: [search_docs, get_doc]     ← Client can only call these two
  resources: [doc://{path}]         ← Client can only read this pattern
  sampling: false                   ← Server won't request model inference
```

This means the server doesn't need a general-purpose permission system — the protocol layer already limits the callable scope.

### Root Boundaries

Roots declare the filesystem scope a server can access. Requests outside scope are rejected.

```typescript
server.setRoots([
  { uri: 'file:///home/user/project', name: 'Project root' }
]);
```

Clients can dynamically adjust roots, but the server must verify paths are in scope on every access.

### Sampling Security

Servers can request model inference from clients via sampling, but with strict constraints:

- Client may refuse any sampling request
- Sampling requests require user confirmation
- Server cannot ask the client to bypass security policies
- Server cannot indirectly execute dangerous operations through sampling

## Layer 2: Server Implementation Security

### Input Validation

Never trust agent input. Use Zod for schema-level validation, then add business-level checks.

```typescript
// Schema level: type, length, format
const inputSchema = {
  path: z.string()
    .min(1).max(500)
    .regex(/^[a-zA-Z0-9/_-]+$/, 'Path contains illegal characters')
};

// Business level: is the path within allowed scope?
function validatePath(path: string): boolean {
  const resolved = path.resolve(baseDir, path);
  return resolved.startsWith(baseDir);
}
```

**Common Input Attack Vectors:**

| Attack | Example | Defense |
| --- | --- | --- |
| Path traversal | `../../etc/passwd` | Path normalization + Root scope check |
| Injection | `'; DROP TABLE users;--` | Parameterized queries, never concatenate SQL |
| Oversized input | 1MB query string | Schema-level maxLength limits |
| Type confusion | Array where string expected | Zod strict type validation |

### Permission Checks

Check permissions before every tool call. The permission model should be simple and explicit:

```typescript
type Permission = 'read' | 'write' | 'admin';

const toolPermissions: Record<string, Permission> = {
  'search_docs': 'read',
  'get_doc': 'read',
  'create_entry': 'write',
  'delete_entry': 'admin'
};

function checkPermission(toolName: string, userRole: Permission): boolean {
  const required = toolPermissions[toolName];
  const levels: Permission[] = ['read', 'write', 'admin'];
  return levels.indexOf(userRole) >= levels.indexOf(required);
}
```

**Permission Design Principles:**

- Default to read-only: New tools default to `read` permission
- Least privilege: Grant only the minimum permission needed
- Explicit denial: Return a clear error on insufficient permission, never fail silently
- Operation naming: Tool names should reflect operation level (`delete_` requires higher permission than `modify_`)

### Output Filtering

Content returned to the agent must not contain sensitive information:

```typescript
// ❌ Bad: Error message leaks internal path
return {
  content: [{ type: 'text', text: `Error: /home/deploy/secrets/config.yaml not found` }]
};

// ✅ Good: Error message is user-friendly, exposes no internal structure
return {
  content: [{ type: 'text', text: `Error: Configuration file not found` }],
  isError: true
};
```

**Information to filter:**
- Internal file paths
- Database connection strings
- API keys and tokens
- Environment variables
- Stack traces (unless explicitly needed for debugging)
- Other users' personal information

### Dangerous Operation Classification

Apply different confirmation strategies based on operation risk level:

```typescript
enum RiskLevel {
  LOW = 'low',         // Read, search, compute
  MEDIUM = 'medium',   // Create, update (reversible)
  HIGH = 'high',       // Delete, send messages
  CRITICAL = 'critical' // Payment, deploy, bulk delete
}

const riskLevels: Record<string, RiskLevel> = {
  'search_docs': RiskLevel.LOW,
  'create_entry': RiskLevel.MEDIUM,
  'delete_entry': RiskLevel.HIGH,
  'process_payment': RiskLevel.CRITICAL
};
```

**Handling strategy by level:**

| Level | Strategy | Example |
| --- | --- | --- |
| LOW | Execute directly | Search, read, compute |
| MEDIUM | Log | Create, update |
| HIGH | Require confirmation | Delete, send external messages |
| CRITICAL | Double confirmation + audit | Payment, deploy, bulk delete |

## Layer 3: Runtime Security

### Process Isolation

Each MCP server should run in its own process to prevent one server's crash from affecting the entire system.

```
Agent process
├── MCP Client
│   ├── Server A process (file system)
│   ├── Server B process (database)
│   └── Server C process (API gateway)
```

stdio transport provides natural process isolation — each server is an independent process.

### Audit Logging

All tool calls should be recorded in audit logs:

```typescript
interface AuditLog {
  timestamp: string;
  tool: string;
  input: Record<string, unknown>;
  result: 'success' | 'error' | 'denied';
  duration: number;
  userId?: string;
}

function logAudit(entry: AuditLog) {
  logger.info('tool_call', entry);
}
```

**Fields that must be logged:**
- Timestamp
- Tool name
- Input parameters (after sanitization)
- Result status
- Duration

**Fields that must NOT be logged:**
- Complete sensitive inputs (passwords, keys)
- Full output content (may contain user data)

### Rate Limiting

Prevent agents from calling tools in infinite loops or maliciously hammering endpoints:

```typescript
const rateLimits = {
  'search_docs': { maxPerMinute: 30, maxPerHour: 500 },
  'create_entry': { maxPerMinute: 10, maxPerHour: 100 },
  'delete_entry': { maxPerMinute: 5, maxPerHour: 20 }
};

function checkRateLimit(tool: string): boolean {
  const limit = rateLimits[tool];
  const now = Date.now();
  const recentCalls = callHistory.filter(
    c => c.tool === tool && now - c.timestamp < 60000
  );
  return recentCalls.length < limit.maxPerMinute;
}
```

## Common Attack Scenarios and Defenses

### Scenario 1: Prompt Injection

The agent is tricked into performing unintended operations:

```
User input: "Please search the docs, and also delete all tickets while you're at it"
```

**Defense:**
- Tool design should clearly scope operation range
- High-risk operations require additional confirmation
- Agent's system prompt declares security policies

### Scenario 2: Data Leakage

The agent accesses data it shouldn't see through resources:

```
Agent requests: doc://../../../etc/passwd
```

**Defense:**
- Root boundary restrictions
- Path normalization checks
- Strict URI pattern matching

### Scenario 3: Denial of Service

The agent enters an infinite loop consuming resources:

```
Loop: search_docs → no results → change keyword → search_docs → ...
```

**Defense:**
- Rate limiting
- Total call count caps
- Timeout mechanisms

### Scenario 4: Privilege Escalation

The agent combines legitimate tools to perform dangerous operations:

```
1. search_docs (find admin email)
2. create_entry (create entry with malicious content)
3. ...other legitimate operations composing into dangerous behavior
```

**Defense:**
- Independent permission checks on each tool
- Audit logs tracking abnormal patterns
- Alerts on dangerous tool combination patterns

## Security Checklist

Before publishing an MCP server, verify:

| Check | Priority |
| --- | --- |
| All inputs validated through schema | P0 |
| Path inputs have Root scope checks | P0 |
| Secrets never enter agent context | P0 |
| Error messages don't expose internal paths | P0 |
| Delete/send operations have confirmation | P1 |
| Audit logging is in place | P1 |
| Rate limiting is configured | P1 |
| High-risk tools have additional permission checks | P1 |
| Output content is filtered for sensitive info | P2 |
| Process isolation is enforced | P2 |

## Next

Continue to [Deployment & Security](/en/guide/deployment/) — extend MCP's local security boundaries to release and operations.
