# 观测与回滚

## 概念

发布不是一个终点——它是观测的起点。部署到生产环境后，你需要知道两件事：**系统还在正常工作吗？** 以及 **如果不正常，怎么回到上一个可用状态？**

## 为什么观测对 Agent 项目特别重要？

传统应用的观测关注的是"服务器还活着吗？响应时间正常吗？"。Agent 项目有额外的观测维度：

- **输出质量**：构建是否通过（可观测）？链接是否断开（可观测）？内容是否准确（需人工）？
- **Agent 行为**：Agent 是否在循环中消耗异常多的 Token？工具调用成功率是否下降？
- **知识衰减**：文档中引用的外部 API 是否仍然有效？示例代码在新版本中是否仍然运行？

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

## 回滚设计

### 什么情况需要回滚？

```
必须回滚:
  - 首页不可访问（404 或白屏）
  - 构建严重失败（dist/ 为空）
  - 安全敏感内容意外暴露
  - 关键页面（/guide/ /guide/quickstart）断链

可以前滚修复:
  - 单个子页的内容错误
  - 非关键页面的样式问题（暗色模式下某个表格边框缺失）
  - Lighthouse 分数轻微下降（仍在阈值内）
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

## Smoke Test：发布的第一个检查

每次部署完成后，立即跑 3 个 smoke test：

```bash
# Smoke Test 1: 首页可达
curl -s https://strings77wzq.github.io/agent-engineering-hub/ | head -5
# 期望: 包含 <title>Agent Engineering Hub</title>

# Smoke Test 2: 学习地图可达
curl -s https://strings77wzq.github.io/agent-engineering-hub/guide/ | head -5
# 期望: 包含 学习地图 字样

# Smoke Test 3: link-checker 通过
npm run docs:check-links
# 期望: 0 errors
```

## 示例：部署后发现问题——完整响应流程

```
14:00 部署新版本（新增 Loop Engineering 4 子页 + 首页重设计）
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

14:20 修复: 调整 --space-section-padding-mobile → PR → review → merge
14:25 部署修复
14:30 验证: 移动端 375px 截屏，CTA 完全可见
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

## 下一步

回到[部署与安全概述](./) 复习整体框架，或阅读[评测与质量](/guide/evaluation/) 了解如何把观测数据转化为发布门禁。
