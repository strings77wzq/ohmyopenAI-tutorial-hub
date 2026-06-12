# 观测与回滚

## 概念

发布不是一个终点——它是观测的起点。部署到生产环境后，你需要知道两件事：**系统还在正常工作吗？** 以及 **如果不正常，怎么回到上一个可用状态？**

## 为什么观测对 Agent 项目特别重要？

传统应用的观测关注的是"服务器还活着吗？响应时间正常吗？"。Agent 项目有额外的观测维度：

- **输出质量**：构建是否通过（可观测）？链接是否断开（可观测）？内容是否准确（需人工）？
- **Agent 行为**：Agent 是否在循环中消耗异常多的 Token？工具调用成功率是否下降？
- **知识衰减**：文档中引用的外部 API 是否仍然有效？示例代码在新版本中是否仍然运行？
- **成本趋势**：Token 消耗是否在合理范围内？有没有异常的费用增长？

传统监控是"系统是否活着"，Agent 监控是"系统是否在做正确的事"。

## 观测三层

```
┌─────────────────────────────────────────────────────────┐
│ L1: 构建级观测                                           │
│ 信号: 构建成功/失败、构建时间、警告数                     │
│ 工具: CI 日志、构建产物 hash                             │
│ 告警: 构建失败、构建时间 > 基线 2x                        │
├─────────────────────────────────────────────────────────┤
│ L2: 运行级观测                                           │
│ 信号: 页面可达性、链接状态、性能指标                      │
│ 工具: Lighthouse, link-checker, uptime monitor           │
│ 告警: 断链数 > 0, LCP > 3s, a11y < 90                   │
├─────────────────────────────────────────────────────────┤
│ L3: 体验级观测                                           │
│ 信号: 用户反馈、移动端截图、内容准确性                     │
│ 工具: Issue tracker, 定期手动 review                     │
│ 告警: 用户报告关键页面失效、内容事实错误                   │
└─────────────────────────────────────────────────────────┘
```

### L1 构建级观测

构建级观测是最基础的——如果构建都失败了，后续一切无意义。

```
关键指标:
  - 构建成功率: 目标 100%，低于 95% 需要告警
  - 构建时间: 建立基线，超过基线 2x 需要调查
  - 警告数量: 趋势上升说明代码质量在退化
  - 构建产物大小: 突然增大可能引入了不必要的依赖

自动化检查:
  - 每次 push: 构建 + lint
  - 每次 PR: 构建 + lint + link-check + 测试
  - 每天: 完整回归测试 + 性能基准
```

### L2 运行级观测

运行级观测关注部署后的实际表现：

```
关键指标:
  - 页面可达性: 核心页面是否返回 200
  - 链接健康度: 断链数量（目标: 0）
  - 性能指标: LCP, FID, CLS
  - 安全指标: 是否有混合内容、是否使用 HTTPS

监控频率:
  - 实时: uptime monitor（每 5 分钟检查一次）
  - 每次部署: Lighthouse audit
  - 每周: 完整性能基准对比
```

### L3 体验级观测

体验级观测是最难自动化的，但也是最有价值的：

```
信号来源:
  - 用户反馈: Issue tracker、反馈表单、社交媒体
  - 定期 review: 每周人工浏览关键页面
  - 移动端测试: 在真实设备上检查响应式布局
  - 内容准确性: 验证示例代码、API 引用、外部链接

主观指标:
  - 内容是否清晰易懂？
  - 布局是否美观一致？
  - 交互是否流畅自然？
  - 暗色模式是否正常？
```

## 关键指标

| 指标 | 当前基线 | 告警阈值 | 检查频率 |
|------|---------|---------|---------|
| 构建通过率 | 100% | < 100% | 每次 push |
| 链接健康度 | 0 断链 | > 0 | 每次 PR |
| 构建时间 | ~6.3s | > 15s | 每次 build |
| LCP | 待测量 | > 2.5s | 每次发布 |
| CLS | 待测量 | > 0.1 | 每次发布 |
| a11y 分数 | 待测量 | < 90 | 每次发布 |
| 页面总数 | 当前数 | 减少 > 3 | 每次 build |

这些基线需要先在 `.lighthouse/baseline.json` 中建立（参考 `npm run docs:audit-lighthouse`），然后每次发布前对比。

## 日志设计

### 日志级别

| 级别 | 用途 | 示例 |
|------|------|------|
| DEBUG | 开发调试信息 | Agent 收到的原始输入 |
| INFO | 正常运行记录 | 构建开始/结束、部署成功 |
| WARN | 异常但可恢复 | 构建时间超过基线、链接检查有警告 |
| ERROR | 错误需要关注 | 构建失败、部署失败、密钥泄露检测 |
| CRITICAL | 严重需要立即处理 | 生产环境不可用、安全事件 |

### 结构化日志

```typescript
// 结构化日志：便于搜索和分析
interface LogEntry {
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical'
  component: string  // 'build' | 'deploy' | 'agent' | 'security'
  message: string
  metadata?: Record<string, unknown>
}

// 示例
const log: LogEntry = {
  timestamp: '2026-01-15T14:30:00Z',
  level: 'info',
  component: 'deploy',
  message: 'Deployment completed successfully',
  metadata: {
    version: 'v1.2.3',
    duration: '45s',
    pages: 42,
    buildHash: 'abc123',
  }
}
```

### 日志保留策略

```
保留周期:
  - DEBUG: 7 天（开发调试用，不需要长期保留）
  - INFO: 30 天（正常运行记录）
  - WARN: 90 天（异常记录，需要趋势分析）
  - ERROR: 180 天（错误记录，需要事后分析）
  - CRITICAL: 永久（安全事件，需要永久保留）

存储位置:
  - 本地: 开发环境日志
  - 集中日志服务: 生产环境日志（如 ELK、Loki）
  - 归档: 超过保留期的日志压缩归档
```

## 分布式追踪

对于多 Agent 系统，追踪一个请求在多个服务间的流转：

### 追踪上下文

```typescript
// 追踪上下文：贯穿整个请求生命周期
interface TraceContext {
  traceId: string      // 唯一标识一次请求
  spanId: string       // 当前操作的标识
  parentSpanId?: string  // 父操作的标识
  operation: string    // 操作名称
  startTime: number
  endTime?: number
  status: 'ok' | 'error'
  metadata?: Record<string, unknown>
}

// 示例：Agent 调用工具的追踪
// Span 1: Agent 收到用户请求
//   Span 2: Agent 调用 search_docs 工具
//     Span 3: 工具执行数据库查询
//   Span 4: Agent 调用 write_file 工具
//     Span 5: 工具写入文件系统
```

### 追踪关键路径

```
关键路径追踪:
  1. 用户请求 → Agent 响应
     - LLM 调用延迟
     - 工具调用延迟
     - 总响应时间

  2. 构建 → 部署 → 验证
     - 构建时间
     - 部署时间
     - Smoke test 时间

  3. 密钥获取 → API 调用 → 结果处理
     - 密钥获取延迟
     - 外部 API 延迟
     - 结果处理时间
```

## 回滚设计

### 什么情况需要回滚？

```
必须回滚:
  - 首页不可访问（404 或白屏）
  - 构建严重失败（dist/ 为空）
  - 安全敏感内容意外暴露
  - 关键页面（/guide/ /guide/quickstart）断链
  - 密钥泄露到公开仓库

可以前滚修复:
  - 单个子页的内容错误
  - 非关键页面的样式问题（暗色模式下某个表格边框缺失）
  - Lighthouse 分数轻微下降（仍在阈值内）
  - 拼写错误、格式问题
```

### 回滚策略

对基于 Git 的文档站，回滚策略很简单：

```
策略 A: Git Revert (最常用，推荐)

  1. git revert <bad-commit>      # 创建一个反向 commit
  2. git push                      # 推送 revert commit
  3. GitHub Pages 自动重新部署     # 等待部署完成
  4. 验证首页可访问 + link-checker 通过

策略 B: 重新部署上一个 Release

  1. git checkout v1.2.3           # 上一个标记的 release
  2. npm run docs:build && 部署    # 用旧版本覆盖
  3. 验证                          # 确认恢复正常

策略 C: 关闭 Feature（如果用了 Feature Flag）

  （文档站通常不需要 Feature Flag——直接 revert 更简单）
```

对于这个项目，策略 A（git revert）是最合适的——文档站没有数据库迁移或 API 兼容性问题，revert 就是字面意义上的"回到上一个版本"。

### 回滚验证

回滚后必须验证：

```
验证清单:
  ✓ 首页可访问（HTTP 200）
  ✓ 核心页面可达（/guide/, /examples/）
  ✓ 链接检查通过（0 errors）
  ✓ 构建时间恢复正常
  ✓ 性能指标恢复正常
  ✓ 用户可见的内容与回滚前一致
```

## Smoke Test：发布的第一个检查

每次部署完成后，立即跑 3 个 smoke test：

```bash
# Smoke Test 1: 首页可达
curl -s https://example.com/ | head -5
# 期望: 包含 <title> 标签

# Smoke Test 2: 学习地图可达
curl -s https://example.com/guide/ | head -5
# 期望: 包含导航内容

# Smoke Test 3: link-checker 通过
npm run docs:check-links
# 期望: 0 errors
```

### 自动化 Smoke Test

```bash
#!/bin/bash
# smoke-test.sh: 部署后自动验证

set -e

URL="https://example.com"

echo "Running smoke tests..."

# Test 1: 首页可达
echo "Test 1: Homepage accessible..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
if [ "$HTTP_STATUS" != "200" ]; then
  echo "FAIL: Homepage returned $HTTP_STATUS"
  exit 1
fi
echo "PASS"

# Test 2: 关键页面可达
echo "Test 2: Guide page accessible..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL/guide/")
if [ "$HTTP_STATUS" != "200" ]; then
  echo "FAIL: Guide page returned $HTTP_STATUS"
  exit 1
fi
echo "PASS"

# Test 3: 链接检查
echo "Test 3: Link checker..."
npm run docs:check-links
echo "PASS"

echo "All smoke tests passed!"
```

## 监控告警

### 告警规则

```yaml
# 告警规则配置
alerts:
  - name: 构建失败
    condition: build.status == "failed"
    severity: critical
    notify: [slack, email]

  - name: 链接断开
    condition: link_checker.errors > 0
    severity: high
    notify: [slack]

  - name: 性能下降
    condition: lighthouse.performance < 80
    severity: medium
    notify: [slack]

  - name: 构建时间异常
    condition: build.duration > baseline * 2
    severity: medium
    notify: [slack]
```

### 告警响应流程

```
收到告警 → 确认严重程度 → 决定行动

严重程度判断:
  CRITICAL: 生产环境不可用 → 立即回滚
  HIGH: 核心功能受损 → 30分钟内修复或回滚
  MEDIUM: 非核心功能异常 → 计划修复
  LOW: 轻微异常 → 下次迭代修复
```

## 示例：部署后发现问题——完整响应流程

```
14:00 部署新版本（新增 4 子页 + 首页重设计）
14:05 Smoke Test 1 通过（首页可达）
14:05 Smoke Test 2 通过（学习地图可达）
14:05 Smoke Test 3 正在运行...
14:06 Smoke Test 3 完成: 0 errors
14:10 用户报告: "移动端首页的 CTA 按钮被截断了"

14:11 分析:
  - 严重程度: 中等（影响移动端用户体验但不阻塞核心功能）
  - 根因: 新的 section padding clamp 在 375px 上计算值偏大
  - 修复方式: 调整 spacing token 的 clamp 下限

14:15 决策: 前滚修复（不 revert）
  - 问题范围小（仅移动端一个像素级问题）
  - 其他功能正常（桌面端、链接、构建都 OK）
  - revert 会丢掉落地的 4 个子页和设计改进

14:20 修复: 调整 spacing → PR → review → merge
14:25 部署修复
14:30 验证: 移动端 375px 截屏，CTA 完全可见
```

## 成本监控

Agent 系统的运营成本需要特别关注：

```
监控指标:
  - Token 消耗: 每次调用的 token 数量
  - API 调用次数: 每日/每周/每月的调用趋势
  - 单次调用成本: 平均每次调用的费用
  - 总运营成本: 月度/年度费用趋势

异常检测:
  - Token 消耗突然翻倍 → 可能有循环或 Prompt 膨胀
  - API 调用次数异常 → 可能有自动化脚本失控
  - 单次调用成本上升 → 可能切换了更贵的模型

预算控制:
  - 设置每日/每月 token 预算
  - 超过预算 80% 时告警
  - 超过预算 100% 时自动降级或暂停
```

## 练习

文档站刚刚部署了一个包含 20 个新页面 + 首页重设计的大版本。部署后你发现：

1. Lighthouse Performance 从 93 降到了 82
2. 3 个用户报告移动端侧边栏无法展开
3. link-checker 输出 0 errors
4. 但首页在暗色模式下有一个表格的边框颜色太暗，几乎看不见

针对每个问题，判断：应该回滚，还是前滚修复？

## 排错

| 症状 | 可能原因 | 修复 |
|------|----------|------|
| 部署后首页白屏 | JS bundle 加载失败（路径错误或文件损坏） | 立即 revert，检查 base 路径配置 |
| link-checker 在 CI 通过但部署后报错 | 部署的 base URL 和本地不同 | smoke test 使用部署后的实际 URL |
| 部署成功但用户看到的是旧版本 | CDN 缓存/GitHub Pages 部署延迟 | 等待 5 分钟或强制刷新 CDN |
| 日志中出现密钥模式 | L2 防护未覆盖所有密钥格式 | 更新脱敏正则，覆盖更多密钥模式 |
| 告警风暴（大量重复告警） | 告警规则太敏感或级联故障 | 调整告警阈值，增加告警抑制 |

## 下一步

回到[部署与安全概述](./) 复习整体框架，或阅读[评测与质量](/guide/evaluation/) 了解如何把观测数据转化为发布门禁。
