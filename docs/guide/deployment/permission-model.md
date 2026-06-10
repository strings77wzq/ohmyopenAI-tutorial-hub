# 权限模型

## 概念

Agent 能做什么、不能做什么——这是安全的第一道防线。权限模型定义了 Agent 在文件系统、网络、命令执行和外部 API 四个维度上的操作边界。

## 为什么权限模型是基础？

没有权限边界的 Agent 是不可部署的——它可能在修复文档的同时意外修改了系统配置，或者在"搜索最佳实践"时把代码上传到了外部 API。权限不是限制 Agent 的能力，而是**确保 Agent 的行为可预测**。

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
    // 向用户展示 diff，等待确认
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

## 排错

| 症状 | 可能原因 | 修复 |
|------|----------|------|
| Agent 频繁触发权限拒绝 | 权限范围太小，正常操作也被拒绝 | 扩展白名单，但不牺牲安全边界 |
| 权限检查被绕过 | 白名单规则有漏洞（如路径穿越） | 使用 path.resolve 规范化后再检查 |
| 用户看不到权限拒绝的原因 | 错误消息不够清晰 | 在拒绝消息中包含"原因 + 允许的操作列表" |

## 下一步

权限模型回答了"Agent 能做什么"——接下来看[密钥治理](./secret-governance)，回答"Agent 不应该看到什么"。
