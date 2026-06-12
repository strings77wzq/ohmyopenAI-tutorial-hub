# 密钥治理

## 概念

密钥（API Key、Token、密码、证书）是 Agent 系统中最危险的资产。密钥治理的核心问题是：**如何确保密钥永远不会进入 Agent 的上下文窗口、工具输出、日志或代码仓库？**

## 为什么密钥治理对 Agent 特别重要？

传统开发中，密钥泄露的主要风险是"开发者不小心提交到 git"。Agent 引入了三个新的泄露路径：

1. **上下文泄露**：Agent 读取了 `.env` 文件，密钥现在在它的上下文窗口里——而上下文窗口的摘要可能被另一个 Agent 读取
2. **工具输出泄露**：Agent 运行 `env` 或 `cat .env` 来调试，输出中包含密钥
3. **跨 Agent 泄露**：Agent A 的上下文被摘要后传给了 Agent B，密钥随着摘要一起流动

更危险的是，LLM 的上下文窗口是"黑盒"——你无法精确控制哪些信息会被记住、哪些会被摘要、哪些会泄露到下游。

## 密钥泄露的攻击面

```
┌──────────────────────────────────────────────────────┐
│                    攻击面全景                          │
│                                                      │
│  代码仓库          Agent 运行时         日志系统        │
│  ┌──────┐         ┌──────┐           ┌──────┐       │
│  │ .env │────┐    │ 上下文 │────┐     │ 构建  │       │
│  │ 硬编码 │    ├──▶│ 窗口  │    ├──▶ │ 日志  │       │
│  │ config│────┘    │ 工具  │    └──▶ │ 审计  │       │
│  └──────┘         │ 输出  │         │ 日志  │       │
│                   └──────┘         └──────┘       │
│                       │                             │
│                       ▼                             │
│              ┌──────────────┐                       │
│              │  共享上下文    │                       │
│              │  (摘要传递)   │                       │
│              └──────────────┘                       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## 三层防护

```
┌─────────────────────────────────────────────────────────┐
│ L1: 源头防护 — 密钥不进 Agent 环境                       │
│ 策略: 环境变量隔离 + 最小暴露                             │
│ 工具: .gitignore, .dockerignore, direnv                 │
├─────────────────────────────────────────────────────────┤
│ L2: 过程防护 — Agent 读取时自动脱敏                       │
│ 策略: 文件内容过滤 + 输出脱敏                             │
│ 工具: pre-read hooks, 正则脱敏, secret scanner           │
├─────────────────────────────────────────────────────────┤
│ L3: 事后防护 — 检测已经发生的泄露                         │
│ 策略: 上下文审计 + 密钥轮换                               │
│ 工具: git-secrets, truffleHog, GitHub secret scanning   │
└─────────────────────────────────────────────────────────┘
```

## L1 源头防护

第一道防线是最有效的：**密钥根本不进入 Agent 的运行环境**。

### 环境变量隔离

```
实践:
  ✓ .env 和 .env.local 加入 .gitignore
  ✓ 密钥通过环境变量注入（process.env.API_KEY），不写在代码里
  ✓ CI/CD 使用 Secrets Manager（GitHub Secrets, Vault）
  ✓ 本地开发使用 direnv 或 .env（但不提交到 git）

  ✗ 不要把密钥写在 config.ts 或 constants.ts 里
  ✗ 不要把密钥作为命令行参数传递（会出现在 ps aux 和历史记录中）
  ✗ 不要让 Agent 访问包含密钥的目录
```

### 环境隔离策略

不同环境使用不同的密钥，防止开发环境的密钥泄露到生产环境：

```yaml
# 环境隔离矩阵
environments:
  development:
    api_key: "dev-key-xxxxx"           # 开发用密钥，权限最小
    allowed_origins: ["localhost"]
    rate_limit: 100/hour

  staging:
    api_key: "staging-key-xxxxx"       # 预发布用密钥
    allowed_origins: ["staging.example.com"]
    rate_limit: 1000/hour

  production:
    api_key: "prod-key-xxxxx"          # 生产密钥，权限最严格
    allowed_origins: ["example.com"]
    rate_limit: 10000/hour
```

### 环境变量注入机制

```typescript
// 安全的环境变量加载
function loadSecrets(): Secrets {
  // 检查必需的密钥是否存在
  const required = ['API_KEY', 'DATABASE_URL']
  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required secrets: ${missing.join(', ')}\n` +
      'Set them via environment variables or a secrets manager.'
    )
  }

  // 检查是否有可疑的密钥值（如包含空格、换行等）
  for (const key of required) {
    const value = process.env[key]!
    if (value.includes(' ') || value.includes('\n')) {
      throw new Error(
        `Secret ${key} contains suspicious characters. ` +
        'Verify it was set correctly.'
      )
    }
  }

  return {
    apiKey: process.env.API_KEY!,
    databaseUrl: process.env.DATABASE_URL!,
  }
}
```

## L2 过程防护

即使 L1 做到了，Agent 仍然可能通过工具调用间接接触密钥：

### 文件内容过滤

在 Agent 读取文件之前，pre-read hook 扫描并脱敏：

```typescript
// pre-read hook: 在返回文件内容给 Agent 之前检查
function sanitizeFileContent(content: string): string {
  // 替换 API Key 模式
  content = content.replace(
    /(sk-[a-zA-Z0-9]{20,})/g,
    '[REDACTED: API Key]'
  )

  // 替换 JWT Token
  content = content.replace(
    /(eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,})/g,
    '[REDACTED: JWT Token]'
  )

  // 替换私钥
  content = content.replace(
    /-----BEGIN.*?PRIVATE KEY-----[\s\S]*?-----END.*?PRIVATE KEY-----/g,
    '[REDACTED: Private Key]'
  )

  // 替换数据库连接字符串
  content = content.replace(
    /(mysql|postgres|mongodb):\/\/[^:\s]+:[^@\s]+@/g,
    '$1://[REDACTED]:[REDACTED]@'
  )

  return content
}
```

### 输出脱敏

Agent 的工具输出在写入日志之前也应该脱敏：

```typescript
// 日志写入前脱敏
function sanitizeLogEntry(entry: string): string {
  const patterns = [
    /(api_key|apikey|secret|password|token)\s*[:=]\s*\S+/gi,
    /-----BEGIN.*?PRIVATE KEY-----[\s\S]*?-----END.*?PRIVATE KEY-----/g,
    /(mysql|postgres|mongodb):\/\/[^\s]+/g,
  ]

  for (const pattern of patterns) {
    entry = entry.replace(pattern, '$1=[REDACTED]')
  }

  return entry
}
```

### 上下文窗口保护

Agent 的上下文窗口是密钥泄露的高风险区域：

```
保护策略:
  1. 系统提示中不包含密钥
     密钥只通过工具调用注入，不写在 Prompt 里

  2. 工具输出自动脱敏
     工具返回结果经过脱敏后才进入上下文

  3. 上下文摘要脱敏
     当上下文被压缩或传递给其他 Agent 时，先扫描脱敏

  4. 对话历史清理
     定期清理包含敏感信息的对话历史
```

## L3 事后防护

如果 L1 和 L2 都失败了——密钥已经泄露——你需要知道并快速响应：

### 检测

```
工具:
  - git-secrets: 扫描 git 历史中是否有密钥模式
  - truffleHog: 深度扫描（包括 commit message、branch name）
  - GitHub Secret Scanning: 自动扫描 push 到 GitHub 的内容

CI 集成:
  - 每次 PR 自动运行 git-secrets
  - 每次 push 到 main 自动运行 truffleHog
```

### 响应：密钥轮换协议

```
1. 确认泄露
   - 密钥在哪里被发现了？（日志？git？上下文摘要？）
   - 密钥的范围是什么？（只读？读写？admin？）
   - 泄露持续了多长时间？

2. 立即撤销
   - 在服务提供方（GitHub、AWS、OpenAI）撤销/删除该密钥
   - 不要先修 code，先撤销密钥——每一秒都在增加风险

3. 影响评估
   - 泄露的密钥能访问什么数据？
   - 有没有异常访问记录？
   - 是否需要通知受影响的用户？

4. 生成新密钥
   - 用新的安全密钥替换
   - 更新所有使用该密钥的服务
   - 验证新密钥工作正常

5. 修复根因
   - 为什么密钥进入了 Agent 的上下文/日志/git？
   - 更新 L1/L2 防护，防止同类泄露

6. 记录事后分析
   - 泄露发生的时间线
   - 影响范围评估
   - 防护改进措施
   - 责任归属（如果需要）
```

## API Key 轮换最佳实践

### 轮换频率

| 密钥类型 | 推荐轮换频率 | 原因 |
|---------|------------|------|
| 生产 API Key | 90 天 | 行业标准，平衡安全和运维成本 |
| 服务账号密钥 | 30 天 | 高权限密钥需更频繁轮换 |
| JWT 签名密钥 | 180 天 | 长期密钥，但需要有轮换机制 |
| 数据库密码 | 60 天 | 中等频率，配合连接池刷新 |
| 访问令牌（Access Token） | 短期（小时级） | 使用 Refresh Token 机制 |

### 轮换流程

```
自动轮换（推荐）:
  1. 密钥管理服务生成新密钥
  2. 更新所有使用该密钥的服务（滚动更新）
  3. 验证新密钥工作正常
  4. 标记旧密钥为"待删除"
  5. 保留旧密钥 24-48 小时（兼容窗口）
  6. 删除旧密钥

手动轮换（紧急情况）:
  1. 在密钥管理服务中撤销旧密钥
  2. 立即生成新密钥
  3. 更新所有服务配置
  4. 验证服务恢复正常
```

## Vault 集成

对于生产环境，使用专业的密钥管理服务：

### Vault 架构

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  应用服务     │────▶│  Vault 服务   │────▶│  密钥存储     │
│  (Agent)     │◀────│  (密钥管理)   │◀────│  (加密存储)   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                     │
       │ 动态密钥             │ 审计日志
       ▼                     ▼
  ┌──────────┐         ┌──────────┐
  │ 临时凭证  │         │ 操作记录  │
  │ (TTL)    │         │ (审计)   │
  └──────────┘         └──────────┘
```

### 动态密钥

Vault 支持动态密钥——每次请求生成临时凭证，使用后自动销毁：

```bash
# 从 Vault 获取数据库密码（动态密钥）
vault read database/creds/my-role

# 输出:
# {
#   "lease_id": "database/creds/my-role/abc123",
#   "lease_duration": 3600,  # 1小时后自动失效
#   "data": {
#     "username": "vault-user-xyz",
#     "password": "A1b2C3d4..."  # 临时密码
#   }
# }
```

优势：
- 每个 Agent 使用不同的临时凭证
- 凭证自动过期，无需手动轮换
- 所有访问都有审计日志
- 密钥泄露的影响范围最小（单个临时凭证）

## 练习

为一个"调用 OpenAI API 生成文档摘要"的工具设计密钥治理方案：

1. API Key 应该存储在哪里？（代码？环境变量？Secrets Manager？）
2. Agent 调用这个工具时，Key 会出现在什么位置？（请求头？工具输出？日志？）
3. 如果 Key 意外出现在 Agent 的对话摘要中，L2 防护能捕获到吗？
4. Key 泄露后的轮换步骤是什么？
5. 如何确保开发环境和生产环境使用不同的 Key？

## 排错

| 症状 | 可能原因 | 修复 |
|------|----------|------|
| git push 被 GitHub 拒绝（secret scanning 触发） | 代码或 commit 历史中包含密钥模式 | 撤销密钥 → 清理 git 历史 → force push |
| Agent 反复尝试读取 .env | L2 防护导致读不到文件，Agent 以为文件不存在 | 返回脱敏后的内容而不是拒绝读取 |
| 脱敏太激进，正常代码也被替换 | 正则表达式太宽泛 | 收紧模式，增加上下文匹配 |
| Vault 动态密钥过期导致服务中断 | TTL 设置太短或连接池未刷新 | 调整 TTL + 实现密钥预刷新机制 |
| 多环境密钥混淆 | 开发密钥被用于生产环境 | 环境隔离 + 启动时校验密钥来源 |

## 下一步

密钥不出事、权限不出格——接下来看[观测与回滚](./observability-rollback)，确保发布后能持续验证系统健康。
