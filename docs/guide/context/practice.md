# 实战案例：修复文档站断链

## 任务概述

任务是"修复 Agent Engineering Hub 文档站中所有返回 404 的内部链接"。我们将为这个任务设计一个完整的上下文包，展示五层模型、注入策略和压缩方案如何协同工作。

## 任务分析

在开始写上下文包之前，先分析任务特征：

| 维度 | 分析 |
|------|------|
| 任务类型 | 修复型（修 bug，非新增功能） |
| 涉及范围 | 可能触及 docs/ 下多个 .md 文件 |
| 验收标准 | 可量化（link-checker 输出 0 错误） |
| 可恢复性 | 高（git revert 可撤销任意修改） |
| 需要外部知识 | 低（修复链接不需要 API 文档） |
| 需要项目知识 | 中（了解 VitePress 链接约定和项目结构） |

## 完整上下文包设计

```
═══════════════════════════════════════════════════════════
[L1] GOAL — 不可变
═══════════════════════════════════════════════════════════

任务: 修复 docs/ 中所有返回 HTTP 404 的内部链接
验收标准:
  [ ] npm run docs:check-links 输出 "0 errors" 或等效通过标志
  [ ] 不改变任何页面的 URL 结构（已有路由定义在 docs/.vitepress/config.ts）
  [ ] 不删除任何页面
  [ ] 不修改非链接的内容文本
限制:
  - 操作范围: docs/ 目录
  - 不可操作: openspec/、scripts/、.github/
  - 如果某个链接指向的页面确实不存在且不应存在 → 询问用户，不自行判断删除

═══════════════════════════════════════════════════════════
[L2] PROJECT KNOWLEDGE — 缓存
═══════════════════════════════════════════════════════════

项目: Agent Engineering Hub (ai-tutorial-hub)
框架: VitePress 1.6.4, base="/agent-engineering-hub/"
链接约定:
  - 内部页面: /guide/skills/what-is-skill（不带 .md 后缀）
  - 首页: / 或 /index
  - 英文页面: /en/guide/...
  - 外部链接: 完整 https:// URL
常见断链原因:
  1. 路径拼写错误 (60%+)
  2. 页面被移动但引用未更新
  3. .md 后缀遗留 (早期页面用 xxx.md 格式引用)
文件结构摘要:
  docs/guide/{skills,mcp,openspec,harness,context,loop-engineering,...}/
  docs/en/guide/{skills,mcp,openspec,harness,...}/
  侧边栏路由: docs/.vitepress/config.ts → guideSidebar / enGuideSidebar

═══════════════════════════════════════════════════════════
[L3] WORKING STATE — 初始状态（每次迭代后更新）
═══════════════════════════════════════════════════════════

当前阶段: 诊断
已尝试方案: （无）
当前假设: （待 link-checker 输出后建立）
已完成步骤: （无）

═══════════════════════════════════════════════════════════
[L4] EXTERNAL KNOWLEDGE — 按需
═══════════════════════════════════════════════════════════

（无需预加载。VitePress 链接格式在 L2 中已覆盖。）

═══════════════════════════════════════════════════════════
[L5] OPERATIONAL EVIDENCE — 触发式
═══════════════════════════════════════════════════════════

待注入: npm run docs:check-links 的输出（Agent 第一步主动运行）
```

## Agent 实际执行过程

### Iteration 1 — 诊断

```
Agent 运行: npm run docs:check-links
→ [L5 注入] links (102 source files): 7 errors

错误摘要:
  1. /guide/skills/best-practice → 404 (应为 best-practices)
  2. /guide/mcp/concept → 404 (应为 concepts)
  3. /guide/openspec/spec → 404 (页面不存在)
  4. /en/guide/harness/introduction → 404 (应为 intro)
  5. /guide/omo/arch → 404 (应为 architecture)
  6. /guide/context/layer → 404 (页面不存在)
  7. /guide/loop → 404 (应为 /guide/loop-engineering/)

[L3 更新]
当前阶段: 修复
当前假设: #1, #2, #4, #5, #7 是拼写错误（5个）；#3, #6 是页面不存在（2个）
已尝试方案: 无
```

### Iteration 2 — 批量修复拼写错误

```
Agent: 使用 sed 批量替换 5 个拼写错误的链接
  s|/guide/skills/best-practice|/guide/skills/best-practices|g
  s|/guide/mcp/concept|/guide/mcp/concepts|g
  s|/en/guide/harness/introduction|/en/guide/harness/intro|g
  s|/guide/omo/arch|/guide/omo/architecture|g
  s|/guide/loop|/guide/loop-engineering/|g

→ npm run docs:check-links
→ [L5 注入] links (102 source files): 2 errors

错误摘要:
  3. /guide/openspec/spec → 404 (页面不存在)
  6. /guide/context/layer → 404 (页面不存在)

[L3 更新]
当前阶段: 需要决策
已完成步骤: 批量修复 5 个拼写错误
已尝试方案: sed 批量替换 → 有效（5/7 已修复）
剩余问题: 2 个链接指向不存在的页面
```

### Iteration 3 — 决策

```
Agent 分析:
  /guide/openspec/spec → openspec/ 目录下有 concepts.md, commands.md, workflow.md...
                         但没有 spec.md。最接近的语义是 writing-specs.md
  /guide/context/layer → context/ 是单页模块（只有 index.md）。
                          没有单独的 layer.md。最接近的语义是 index.md 中的
                          "上下文分层" 章节

Agent 暂停，询问用户:
  "2 个断链指向不存在的页面。我的建议：
   1. /guide/openspec/spec → 改为 /guide/openspec/writing-specs
   2. /guide/context/layer → 改为 /guide/context/ (指向上下文工程首页)
   是否同意？或者你希望为这些链接创建新页面？"
```

这个暂停正是多源反馈中"人工反馈"通道的触发：Agent 走到了决策边界，无法自行判断"不存在的页面应该映射到哪个现有页面"。

### Iteration 4 — 用户确认后完成

```
用户: "同意方案 1 和 2"

Agent 执行修改 → npm run docs:check-links
→ [L5 注入] links (102 source files): 0 errors → PASS

L1 验收标准检查:
  [✓] link-checker 输出 0 errors
  [✓] 未改变 URL 结构
  [✓] 未删除页面
  [✓] 未修改非链接内容

→ 任务完成
```

## 这个案例展示了什么

1. **L5 触发注入**：Agent 主动运行 link-checker，输出自动流入操作证据层
2. **L3 滚动更新**：每次迭代后工作状态层都更新了当前假设和进度
3. **L1 不可变**：Agent 始终没有改变验收标准
4. **人工反馈的边界**：Agent 在无法判断映射关系时暂停询问，而不是自作主张
5. **压缩未触发**：这个任务 Token 消耗很小，不需要压缩

## 练习

用同样的框架，为一个"新增 Context Engineering 模块的 3 个子页"的任务设计上下文包并模拟执行过程：

1. 写出完整的五层上下文包
2. 模拟至少 3 轮迭代，标注每一轮后 L3 和 L5 的变化
3. 在什么情况下 Agent 会暂停并询问用户？
4. 如果这个任务中途被中断（用户关闭了终端），恢复时 L3 应该包含什么？

## 下一步

回到[上下文工程概述](./) 选择下一个模块，或阅读[注入策略](./injection-strategy)了解更多技术细节。
