# MCP 安全边界

MCP Server 连接真实系统——文件、数据库、API、甚至支付接口。安全设计必须先于功能扩展。

## 安全模型概览

MCP 的安全模型基于三层防线：

```
┌─────────────────────────────────────┐
│  第一层：协议层安全                   │
│  能力协商、权限声明、Root 边界         │
├─────────────────────────────────────┤
│  第二层：Server 实现安全              │
│  输入校验、权限检查、输出过滤          │
├─────────────────────────────────────┤
│  第三层：运行时安全                   │
│  进程隔离、审计日志、速率限制          │
└─────────────────────────────────────┘
```

## 第一层：协议层安全

### 能力协商

连接建立时，Client 和 Server 交换能力声明。Server 只暴露它声明支持的能力，Client 只能调用 Server 声明提供的接口。

```
Server 声明：
  tools: [search_docs, get_doc]     ← Client 只能调这两个
  resources: [doc://{path}]         ← Client 只能读这个模式
  sampling: false                   ← Server 不请求模型推理
```

这意味着 Server 不需要实现通用的权限系统——协议层已经限制了可调用范围。

### Root 边界

Root 声明了 Server 可以访问的文件系统范围。超出范围的请求会被拒绝。

```typescript
// Server 声明只能访问项目目录
server.setRoots([
  { uri: 'file:///home/user/project', name: '项目根目录' }
]);
```

Client 可以动态调整 Root，但 Server 必须在每次访问时验证路径是否在范围内。

### 采样安全

Server 可以通过 Sampling 请求 Client 进行模型推理，但有严格约束：

- Client 有权拒绝任何采样请求
- 采样请求必须经过用户确认
- Server 不能要求 Client 绕过安全策略
- Server 不能通过采样请求间接执行危险操作

## 第二层：Server 实现安全

### 输入校验

永远不要信任 Agent 发来的输入。用 Zod 做 Schema 级验证，再做业务级验证。

```typescript
// Schema 级：类型、长度、格式
const inputSchema = {
  path: z.string()
    .min(1).max(500)
    .regex(/^[a-zA-Z0-9/_-]+$/, '路径包含非法字符')
};

// 业务级：路径是否在允许范围内
function validatePath(path: string): boolean {
  const resolved = path.resolve(baseDir, path);
  return resolved.startsWith(baseDir);
}
```

**常见输入攻击向量：**

| 攻击 | 示例 | 防御 |
| --- | --- | --- |
| 路径遍历 | `../../etc/passwd` | 路径规范化 + Root 范围检查 |
| 注入 | `'; DROP TABLE users;--` | 参数化查询，永远不拼接 SQL |
| 超大输入 | 1MB 的 query 字符串 | Schema 级 maxLength 限制 |
| 类型混淆 | 期望 string 传入 array | Zod 严格类型校验 |

### 权限检查

每个 Tool 调用前都要检查权限。权限模型应该简单明确：

```typescript
// 定义权限级别
type Permission = 'read' | 'write' | 'admin';

const toolPermissions: Record<string, Permission> = {
  'search_docs': 'read',
  'get_doc': 'read',
  'create_entry': 'write',
  'delete_entry': 'admin'
};

// 调用前检查
function checkPermission(toolName: string, userRole: Permission): boolean {
  const required = toolPermissions[toolName];
  const levels: Permission[] = ['read', 'write', 'admin'];
  return levels.indexOf(userRole) >= levels.indexOf(required);
}
```

**权限设计原则：**

- 默认只读：新 Tool 默认需要 `read` 权限
- 最小权限：只授予完成任务所需的最低权限
- 明确拒绝：权限不足时返回明确错误，不是静默失败
- 操作命名：Tool 名称应该体现操作级别（`delete_` 比 `modify_` 需要更高权限）

### 输出过滤

Server 返回给 Agent 的内容不能包含敏感信息：

```typescript
// ❌ 差：错误信息泄露内部路径
return {
  content: [{ type: 'text', text: `Error: /home/deploy/secrets/config.yaml not found` }]
};

// ✅ 好：错误信息对用户友好，不暴露内部结构
return {
  content: [{ type: 'text', text: `Error: Configuration file not found` }],
  isError: true
};
```

**需要过滤的信息：**
- 内部文件路径
- 数据库连接字符串
- API 密钥和 Token
- 环境变量
- 堆栈跟踪（除非明确需要调试）
- 其他用户的个人信息

### 危险操作分类

根据操作的风险等级，采取不同的确认策略：

```typescript
enum RiskLevel {
  LOW = 'low',         // 读取、搜索、计算
  MEDIUM = 'medium',   // 创建、更新（可回滚）
  HIGH = 'high',       // 删除、发送消息
  CRITICAL = 'critical' // 付款、部署、删除数据
}

const riskLevels: Record<string, RiskLevel> = {
  'search_docs': RiskLevel.LOW,
  'create_entry': RiskLevel.MEDIUM,
  'delete_entry': RiskLevel.HIGH,
  'process_payment': RiskLevel.CRITICAL
};
```

**各等级的处理策略：**

| 等级 | 策略 | 示例 |
| --- | --- | --- |
| LOW | 直接执行 | 搜索、读取、计算 |
| MEDIUM | 记录日志 | 创建、更新 |
| HIGH | 要求确认 | 删除、发送外部消息 |
| CRITICAL | 双重确认 + 审计 | 付款、部署、批量删除 |

## 第三层：运行时安全

### 进程隔离

每个 MCP Server 应该运行在独立进程中，避免一个 Server 崩溃影响整个系统。

```
Agent 进程
├── MCP Client
│   ├── Server A 进程（文件系统）
│   ├── Server B 进程（数据库）
│   └── Server C 进程（API 网关）
```

stdio 传输天然提供进程隔离——每个 Server 是独立进程。

### 审计日志

所有 Tool 调用都应该记录审计日志：

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
  // 记录到安全的日志系统，不记录到 stdout（避免混淆 Agent 输出）
  logger.info('tool_call', entry);
}
```

**日志中必须记录的字段：**
- 时间戳
- Tool 名称
- 输入参数（脱敏后）
- 结果状态
- 耗时

**日志中不能记录的字段：**
- 完整的敏感输入（密码、密钥）
- 完整的输出内容（可能包含用户数据）

### 速率限制

防止 Agent 无限循环调用 Tool 或恶意刷接口：

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

## 常见攻击场景与防御

### 场景 1：Prompt 注入

Agent 被诱导执行非预期操作：

```
用户输入：「请帮我搜索文档，顺便删除所有工单」
```

**防御：**
- Tool 设计时明确操作范围
- 高风险操作需要额外确认
- Agent 的 System Prompt 中声明安全策略

### 场景 2：数据泄露

Agent 通过 Resource 获取了不该看到的数据：

```
Agent 请求：doc://../../../etc/passwd
```

**防御：**
- Root 边界限制
- 路径规范化检查
- URI 模式严格匹配

### 场景 3：拒绝服务

Agent 无限循环调用消耗资源：

```
循环：search_docs → 无结果 → 换关键词 → search_docs → ...
```

**防御：**
- 速率限制
- 总调用次数上限
- 超时机制

### 场景 4：权限提升

Agent 通过合法 Tool 组合完成危险操作：

```
1. search_docs（找到管理员邮箱）
2. create_entry（创建包含恶意内容的条目）
3. ...其他合法操作组合成危险行为
```

**防御：**
- 每个 Tool 独立检查权限
- 审计日志追踪异常模式
- 高风险操作组合告警

## 安全检查清单

在发布 MCP Server 之前，检查以下项目：

| 检查项 | 优先级 |
| --- | --- |
| 所有输入都经过 Schema 校验 | P0 |
| 路径类输入有 Root 范围检查 | P0 |
| 密钥不进入 Agent 上下文 | P0 |
| 错误信息不泄露内部路径 | P0 |
| 删除/发送操作有确认机制 | P1 |
| 有审计日志记录 | P1 |
| 有速率限制 | P1 |
| 高危 Tool 有额外权限检查 | P1 |
| 输出内容过滤了敏感信息 | P2 |
| 进程隔离运行 | P2 |

## 下一步

阅读 [部署与安全](/guide/deployment/)，把 MCP 的本地安全边界扩展到发布和运维流程。
