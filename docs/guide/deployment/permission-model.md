# 权限模型

## 概念

Agent 能做什么、不能做什么——这是安全的第一道防线。权限模型定义了 Agent 在文件系统、网络、命令执行和外部 API 四个维度上的操作边界。

## 为什么权限模型是基础？

没有权限边界的 Agent 是不可部署的——它可能在修复文档的同时意外修改了系统配置，或者在"搜索最佳实践"时把代码上传到了外部 API。权限不是限制 Agent 的能力，而是**确保 Agent 的行为可预测**。

权限设计的核心矛盾：Agent 需要足够的权限来完成任务，但权限越大，失败时的爆炸半径也越大。好的权限模型在这两者之间找到平衡点。

## 四个权限维度

```
┌─────────────────────────────────────────────────────────┐
│ 文件系统权限                                            │
│ 读: 哪些目录可读？                                       │
│ 写: 哪些目录可写？                                       │
│ 执行: 哪些命令可执行？                                    │
│ 删除: 能否删除文件？（几乎总是 NO）                        │
├─────────────────────────────────────────────────────────┤
│ 网络权限                                                │
│ 出站: 可以访问哪些域名/端口？                              │
│ 入站: Agent 是否需要对外开放端口？                         │
│ 协议: HTTP/HTTPS only？还是包括 TCP/UDP？                │
├─────────────────────────────────────────────────────────┤
│ 命令执行权限                                            │
│ 白名单: 允许执行的命令列表                                │
│ 参数限制: 即使命令在白名单内，哪些参数被禁止？              │
│ 超时: 单次命令的最长执行时间                              │
├─────────────────────────────────────────────────────────┤
│ 外部 API 权限                                           │
│ 认证: 使用什么凭证？范围是什么？                           │
│ 速率: 允许的调用频率是多少？                               │
│ 范围: 可以访问哪些 API 端点？                              │
└─────────────────────────────────────────────────────────┘
```

## RBAC：基于角色的访问控制

RBAC（Role-Based Access Control）是 Agent 权限管理的实用模型。不同角色拥有不同的权限集：

### 角色定义

| 角色 | 文件系统 | 网络 | 命令执行 | API | 典型场景 |
|------|---------|------|---------|-----|---------|
| **只读探索者** | 读特定目录 | 无 | 无 | 无 | 代码分析、文档搜索 |
| **文档编辑者** | 读写 docs/ | 无 | 构建命令 | 无 | 修复断链、更新内容 |
| **代码审查者** | 读代码目录 | 无 | lint/test | 无 | PR review、代码分析 |
| **部署执行者** | 读写构建产物 | 部署 API | 构建+部署 | CI/CD | 自动部署 |
| **系统管理员** | 全部 | 全部 | 全部 | 全部 | 紧急修复（需审批） |

### 角色分配原则

```
原则 1: 默认最低角色
  新 Agent 启动时只拥有"只读探索者"权限
  需要更多权限时，显式声明并审批

原则 2: 权限不可传递
  Agent A 不能把自己的权限传递给 Agent B
  每个 Agent 独立评估权限

原则 3: 权限有范围
  "文档编辑者"只能写 docs/ 目录
  不能因为"顺便"而写其他目录

原则 4: 权限有时间窗口
  临时权限（如部署执行）在任务完成后自动回收
  不允许"永久提升权限"
```

## 信任边界

信任边界（Trust Boundary）是系统中安全策略发生变化的分界线：

```
┌──────────────────────────────────────────────────────┐
│                    信任边界外部                         │
│  (用户输入、外部 API 响应、第三方数据)                    │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │              信任边界                          │    │
│  │                                              │    │
│  │  ┌──────────┐    ┌──────────┐               │    │
│  │  │ 用户请求  │───▶│  权限检查  │               │    │
│  │  └──────────┘    └────┬─────┘               │    │
│  │                       │ 通过                 │    │
│  │                       ▼                     │    │
│  │  ┌──────────┐    ┌──────────┐               │    │
│  │  │  Agent   │───▶│  工具执行  │               │    │
│  │  └──────────┘    └────┬─────┘               │    │
│  │                       │ 结果                 │    │
│  │                       ▼                     │    │
│  │  ┌──────────┐    ┌──────────┐               │    │
│  │  │  输出过滤  │◀──│  结果返回  │               │    │
│  │  └──────────┘    └──────────┘               │    │
│  │                                              │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

关键原则：**所有跨越信任边界的数据都必须验证和过滤**。

### 需要验证的边界点

| 边界点 | 验证内容 | 为什么重要 |
|--------|---------|-----------|
| 用户输入 → Agent | 输入长度、格式、注入检测 | 防止 prompt injection |
| Agent → 工具调用 | 参数合法性、权限范围 | 防止越权操作 |
| 工具输出 → Agent | 敏感信息过滤、长度限制 | 防止信息泄露 |
| Agent 输出 → 用户 | 密钥脱敏、内部路径隐藏 | 防止信息泄露 |

## 沙箱隔离

沙箱（Sandbox）是权限模型的物理实现——把 Agent 的执行环境完全隔离：

### 沙箱类型

| 类型 | 隔离级别 | 性能 | 适用场景 |
|------|---------|------|---------|
| 进程隔离 | 中 | 高 | 单用户工具、本地开发 |
| 容器隔离 | 高 | 中 | 多租户服务、CI/CD |
| VM 隔离 | 最高 | 低 | 高安全要求、不可信代码执行 |
| 无服务器隔离 | 高 | 弹性 | 按需执行、事件驱动 |

### 容器沙箱配置示例

```bash
# Docker 沙箱：限制 Agent 的执行环境
docker run \
  --read-only \                          # 只读文件系统
  --tmpfs /tmp:size=100m \               # 临时写入空间（有大小限制）
  --network none \                       # 无网络访问
  --cpus 0.5 \                           # CPU 限制
  --memory 256m \                        # 内存限制
  --user 1000:1000 \                     # 非 root 用户
  --cap-drop ALL \                       # 移除所有 Linux capabilities
  --security-opt no-new-privileges \     # 禁止提权
  my-agent-image
```

### 沙箱逃逸防护

```
已知攻击向量:
  1. 路径穿越: ../../etc/passwd
     防护: path.resolve() + 前缀检查

  2. 符号链接攻击: symlink → 敏感文件
     防护: 禁用符号链接或检查链接目标

  3. 环境变量注入: LD_PRELOAD 等
     防护: 清理环境变量，只保留白名单

  4. 命令注入: ; rm -rf / 或 $(恶意命令)
     防护: 参数化调用，禁止字符串拼接命令
```

## 审批工作流

对于高风险操作，权限模型需要引入人工审批环节：

### 审批级别

| 级别 | 操作类型 | 审批方式 | 超时处理 |
|------|---------|---------|---------|
| L0 自动放行 | 只读操作 | 无需审批 | — |
| L1 通知 | 低风险写入 | 通知用户，自动执行 | — |
| L2 确认 | 中风险操作 | 等待用户确认后执行 | 超时拒绝 |
| L3 审批 | 高风险操作 | 需要审批者批准 | 超时取消 |

### 审批工作流实现

```typescript
// 审批工作流：高风险操作需要人工确认
interface ApprovalRequest {
  id: string
  agent: string
  action: string
  target: string
  riskLevel: 'low' | 'medium' | 'high'
  diff?: string  // 操作前后的差异
  timestamp: number
}

function requireApproval(request: ApprovalRequest): Promise<boolean> {
  if (request.riskLevel === 'low') {
    return Promise.resolve(true)  // 自动放行
  }

  if (request.riskLevel === 'medium') {
    // 通知用户，30秒内无异议则自动执行
    notifyUser(request)
    return waitForConsent(request.id, 30_000)
  }

  // 高风险：必须等待明确批准
  notifyApprover(request)
  return waitForApproval(request.id, 300_000)  // 5分钟超时
}
```

### 审批上下文

审批者需要足够的信息来做决策：

```
审批请求:
  Agent: doc-fixer
  操作: 写入文件
  目标: /docs/guide/mcp/server.md
  风险: 中

  差异预览:
  @@ -45,3 +45,5 @@
   ## 构建 MCP Server

  +### 安全配置
  +
  +在生产环境中，必须配置...

  历史: 该 Agent 过去 24 小时内修改了 3 个文件
  建议: 批准（修改范围在 docs/ 目录内）
```

## 最小权限原则

Agent 应该只拥有完成任务所必需的最小权限集：

```
任务: 修复文档站断链

必需权限:
  ✓ 读: docs/**/*.md
  ✓ 写: docs/**/*.md
  ✓ 执行: npm run docs:check-links, npm run docs:build, git diff

不需要:
  ✗ 读: ~/.ssh/, /etc/passwd, .env
  ✗ 写: 非 docs/ 目录的任何文件
  ✗ 执行: rm, sudo, curl（除非 link-checker 内部使用）
  ✗ 网络: 访问外部 API（修复链接不需要网络）
```

### 权限矩阵模板

为每个任务类型定义权限矩阵：

```yaml
# permissions/document-fixer.yaml
task: 修复文档断链
roles:
  agent:
    filesystem:
      read: ["docs/**/*.md", "package.json"]
      write: ["docs/**/*.md"]
      delete: []
    network:
      allow: []
    commands:
      allow: ["npm run docs:check-links", "npm run docs:build", "git diff"]
      deny: ["rm", "sudo", "curl", "wget"]
    api:
      allow: []
```

## 两种权限控制模式

### 模式 A：白名单（Allowlist）

默认拒绝一切，只允许明确列出的操作。

```
优点: 安全性最高，不会出现"忘了禁止"的情况
缺点: 需要精确预判 Agent 需要的所有操作
适用: 操作范围明确的任务（修复断链、格式化代码）
```

### 模式 B：黑名单（Denylist）

默认允许，只禁止明确列出的危险操作。

```
优点: 灵活性高，不需要预判所有操作
缺点: 不能保证覆盖所有危险操作
适用: 探索性任务（搜索代码、分析架构）
```

对于生产部署，白名单是更好的默认选择。

## 示例：限制一个 MCP 工具的权限

一个"写入文件"的 MCP 工具的安全设计：

```typescript
// MCP tool: write_file
// 安全性设计

const ALLOWED_DIRECTORIES = [
  '/home/user/project/docs/',
  '/home/user/project/examples/',
]

const DENIED_PATTERNS = [
  /\.env$/,
  /\.ssh\//,
  /\/etc\//,
  /\.git\/config$/,
]

function validateWritePath(requestedPath: string): void {
  // 检查 1: 路径必须在允许的目录内
  const resolved = path.resolve(requestedPath)
  const isAllowed = ALLOWED_DIRECTORIES.some(
    dir => resolved.startsWith(dir)
  )
  if (!isAllowed) {
    throw new Error(
      `PERMISSION DENIED: ${requestedPath} 不在允许的目录中。\n` +
      `允许的目录: ${ALLOWED_DIRECTORIES.join(', ')}`
    )
  }

  // 检查 2: 禁止覆盖敏感文件
  const isSensitive = DENIED_PATTERNS.some(
    pattern => pattern.test(resolved)
  )
  if (isSensitive) {
    throw new Error(
      `PERMISSION DENIED: ${requestedPath} 匹配敏感文件模式。`
    )
  }

  // 检查 3: 写入前显示 diff（如果文件已存在）
  if (fs.existsSync(resolved)) {
    const oldContent = fs.readFileSync(resolved, 'utf-8')
    const newContent = requestedContent
    showDiffAndWaitForConfirmation(oldContent, newContent)
  }
}
```

关键设计：
1. **目录白名单**：只允许写入特定目录
2. **敏感文件黑名单**：即使目录在白名单内，也不允许覆盖敏感文件
3. **写入前展示 diff**：用户可以拒绝修改
4. **清晰的错误消息**：告诉用户"为什么被拒绝"和"允许什么"

## 练习

为一个"调用 GitHub API 创建 Issue"的 MCP 工具设计权限模型：

1. 文件系统权限：这个工具需要读写文件吗？
2. 网络权限：需要访问哪些域名？哪些端点是必需的，哪些是多余的？
3. API 权限：GitHub Token 的最小权限 scope 是什么？
4. 速率限制：如何防止 Agent 在循环中创建大量 Issue？
5. 审批工作流：创建 Issue 是否需要人工确认？为什么？

## 排错

| 症状 | 可能原因 | 修复 |
|------|----------|------|
| Agent 频繁触发权限拒绝 | 权限范围太小，正常操作也被拒绝 | 扩展白名单，但不牺牲安全边界 |
| 权限检查被绕过 | 白名单规则有漏洞（如路径穿越） | 使用 path.resolve 规范化后再检查 |
| 用户看不到权限拒绝的原因 | 错误消息不够清晰 | 在拒绝消息中包含"原因 + 允许的操作列表" |
| 审批超时导致任务失败 | 审批者未及时响应 | 设置合理的超时时间 + 降级策略 |
| Agent 通过间接方式绕过权限 | 使用符号链接或环境变量逃逸 | 沙箱隔离 + 符号链接检查 |

## 下一步

权限模型回答了"Agent 能做什么"——接下来看[密钥治理](./secret-governance)，回答"Agent 不应该看到什么"。
