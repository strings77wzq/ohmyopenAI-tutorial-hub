# 密钥治理

## 概念

密钥（API Key、Token、密码、证书）是 Agent 系统中最危险的资产。密钥治理的核心问题是：**如何确保密钥永远不会进入 Agent 的上下文窗口、工具输出、日志或代码仓库？**

## 为什么密钥治理对 Agent 特别重要？

传统开发中，密钥泄露的主要风险是"开发者不小心提交到 git"。Agent 引入了三个新的泄露路径：

1. **上下文泄露**：Agent 读取了 `.env` 文件，密钥现在在它的上下文窗口里——而上下文窗口的摘要可能被另一个 Agent 读取
2. **工具输出泄露**：Agent 运行 `env` 或 `cat .env` 来调试，输出中包含密钥
3. **跨 Agent 泄露**：Agent A 的上下文被摘要后传给了 Agent B，密钥随着摘要一起流动

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
  ]

  for (const pattern of patterns) {
    entry = entry.replace(pattern, '$1=[REDACTED]')
  }

  return entry
}
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

2. 立即撤销
   - 在服务提供方（GitHub、AWS、OpenAI）撤销/删除该密钥
   - 不要先修 code，先撤销密钥——每一秒都在增加风险

3. 生成新密钥
   - 用新的安全密钥替换
   - 更新所有使用该密钥的服务

4. 修复根因
   - 为什么密钥进入了 Agent 的上下文/日志/git？
   - 更新 L1/L2 防护，防止同类泄露

5. 记录事后分析
   - 泄露发生的时间线
   - 影响范围评估
   - 防护改进措施
```

## 示例：本项目的密钥治理实践

```
L1 源头防护:
  - .gitignore: .env, .env.local, *.log
  - GitHub Pages 部署使用 GitHub Actions Secrets
  - Agent 的工作目录限制在 docs/（不包含配置密钥的目录）

L2 过程防护:
  - Agent 不读取 .env 文件
  - npm scripts 中不包含密钥（所有认证通过环境变量）
  - 构建日志中不包含敏感信息

L3 事后防护:
  - GitHub Secret Scanning（仓库自带）
  - 如有泄露：立即在 GitHub Settings 中撤销 + 轮换
```

## 练习

为一个"调用 OpenAI API 生成文档摘要"的工具设计密钥治理方案：

1. API Key 应该存储在哪里？（代码？环境变量？Secrets Manager？）
2. Agent 调用这个工具时，Key 会出现在什么位置？（请求头？工具输出？日志？）
3. 如果 Key 意外出现在 Agent 的对话摘要中，L2 防护能捕获到吗？
4. Key 泄露后的轮换步骤是什么？

## 排错

| 症状 | 可能原因 | 修复 |
|------|----------|------|
| git push 被 GitHub 拒绝（secret scanning 触发） | 代码或 commit 历史中包含密钥模式 | 撤销密钥 → 清理 git 历史 → force push |
| Agent 反复尝试读取 .env | L2 防护导致读不到文件，Agent 以为文件不存在 | 返回脱敏后的内容而不是拒绝读取 |
| 脱敏太激进，正常代码也被替换 | 正则表达式太宽泛 | 收紧模式，增加上下文匹配 |

## 下一步

密钥不出事、权限不出格——接下来看[观测与回滚](./observability-rollback)，确保发布后能持续验证系统健康。
