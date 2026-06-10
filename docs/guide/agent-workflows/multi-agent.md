# 多 Agent 协调

## 概念

当一个任务需要同时修改多个独立模块时，让多个 Agent 并行工作可以大幅缩短完成时间。但并行带来协调问题：冲突、死锁、信息不对称。

## 为什么多 Agent 不等于"快 3 倍"？

3 个 Agent 同时工作，理想情况下速度是单 Agent 的 3 倍。但现实是：

- **40% 的增益被协调开销吃掉**：分配任务、合并结果、解决冲突都需要时间
- **冲突导致返工**：Agent A 和 Agent B 修改了同一个文件的不同部分 → merge conflict
- **信息不对称**：Agent A 不知道 Agent B 做了什么假设 → 产出不一致

多 Agent 的收益取决于任务的**可分解性**——任务越容易拆成独立子任务，并行收益越高。

## 任务分解

### 好的分解 vs 坏的分解

```
✗ 坏的分解（有共享依赖）:
  Agent A: 修改 config.ts 的 sidebar 部分
  Agent B: 修改 config.ts 的 theme 部分
  → 两个 Agent 都在改同一个文件 → merge conflict

✓ 好的分解（按模块边界）:
  Agent A: 写 docs/guide/context/ 下的 4 个文件
  Agent B: 写 docs/guide/evaluation/ 下的 4 个文件
  Agent C: 更新 config.ts 的 sidebar（所有模块的注册）
  → 零文件冲突——只有 Agent C 改 config.ts
```

### 分解原则

1. **沿文件边界拆分**：每个 Agent 操作的文件集合互不相交
2. **依赖前移**：共享依赖由单独的 Agent 先完成（如 config.ts 的更新）
3. **聚合后移**：合并和验证由单独的 Agent 或人工完成

## 协调模式

### 模式 A：共享状态（Shared State）

所有 Agent 共享一个任务状态文件。

```
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Agent A  │   │ Agent B  │   │ Agent C  │
└────┬─────┘   └────┬─────┘   └────┬─────┘
     │              │              │
     └──────────────┼──────────────┘
                    │ 读写
                    ▼
          ┌─────────────────┐
          │  tasks.json      │
          │  {               │
          │    "context/":   │
          │      "status":   │
          │      "complete", │
          │    "eval/":      │
          │      "status":   │
          │      "in_progress│
          │  }               │
          └─────────────────┘
```

**优点**：Agent 之间可以看到彼此的进度
**缺点**：状态文件本身可能成为瓶颈（两个 Agent 同时写入）

### 模式 B：消息传递（Message Passing）

Agent 之间通过明确的消息通信，不共享文件。

```
Agent A ──"context 模块完成，4 个文件就绪"──▶ Agent C
Agent B ──"eval 模块完成，4 个文件就绪"────▶ Agent C
Agent C: 收到了 2 条完成消息 → 开始合并和验证
```

**优点**：无共享状态竞争
**缺点**：Agent 需要知道"发给谁"

### 模式 C：编排者（Orchestrator）

一个专门的编排 Agent 负责分配任务和汇总结果。

```
              ┌──────────────┐
              │ Orchestrator │
              └──────┬───────┘
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Agent A │ │ Agent B │ │ Agent C │
   │ context │ │ eval    │ │ sidebar │
   └────┬────┘ └────┬────┘ └────┬────┘
        │          │          │
        └──────────┼──────────┘
                   ▼
              ┌──────────────┐
              │ Orchestrator │
              │ 汇总 + 验证   │
              └──────────────┘
```

**优点**：中心化控制，容易追踪进度和诊断问题
**缺点**：Orchestrator 是单点——如果它逻辑错误，整个流程受影响

## 反模式：多 Agent 常见陷阱

### 反模式 1：Agent 循环

```
Agent A 修改了文件 → Agent B 检查到"错误" → Agent B 修改回去
→ Agent A 再次修改 → Agent B 再次"修复" → 无限循环
```

**预防**：每个 Agent 只能修改分配给它的文件。如果 Agent 认为"别人的文件"有问题，报告而不是直接修改。

### 反模式 2：死锁

```
Agent A 在等 Agent B 完成 Step 2
Agent B 在等 Agent A 完成 Step 1
→ 两个都在等，永远不会继续
```

**预防**：依赖关系设计成 DAG（有向无环），不允许循环依赖。

### 反模式 3：冲突编辑

```
Agent A 和 Agent B 同时修改 docs/index.md
→ git merge 时发现冲突 → 两个 Agent 都不知道怎么解决
```

**预防**：如分解原则 1——沿文件边界拆分，确保只有一个 Agent 修改 index.md。

## 示例：用 3 个 Agent 完成 Week 2 内容补完

```
Orchestrator 分配:

Agent A (Loop Engineering):
  文件: docs/guide/loop-engineering/{ooda-loop,retry-and-breaker,multi-source-feedback}.md
  无其他 Agent 文件冲突 ✓

Agent B (Context Engineering):
  文件: docs/guide/context/{layering,injection-strategy,compression,practice}.md
  无其他 Agent 文件冲突 ✓

Agent C (sidebar):
  文件: docs/.vitepress/config.ts
  操作: 在 zhGuideSidebar 中新增 Agent A 和 B 创建的页面条目
  等待: Agent A 和 B 都完成后才开始（需要知道文件路径）

执行顺序:
  Agent A 和 Agent B 并行开始
  → Agent A 完成 → 通知 Orchestrator → Orchestrator 记录完成
  → Agent B 完成 → 通知 Orchestrator → Orchestrator 记录完成
  → Orchestrator 启动 Agent C → Agent C 读取 A 和 B 的输出 → 更新 sidebar
  → Orchestrator 运行验证: npm test && npm run docs:build
```

## 练习

为一个"同时新增 3 个 EN 模块翻译 + 更新首页 features"的任务设计多 Agent 协调方案：

1. 怎么分解任务才能避免文件冲突？
2. 用哪种协调模式？为什么？
3. 如果翻译 Agent B 失败了（还没开始），Agent C（首页更新）应该等吗？
4. 画出 Agent 分配和执行顺序。

## 排错

| 症状 | 可能原因 | 修复 |
|------|----------|------|
| 两个 Agent 在互相 undo 对方的修改 | 没有明确的文件所有权边界 | 严格按文件分配，禁止跨边界修改 |
| Orchestrator 在等一个永远不会完成的信号 | Agent 异常退出没有通知 Orchestrator | Orchestrator 设置超时，超时后标记为 FAIL |
| 所有 Agent 完成了但合并结果不一致 | Agent 基于不同的假设工作（不同的命名约定、文件结构） | 在分配任务前统一规范（模板、命名、质量标准） |

## 下一步

回到 [Agent 工作流编排概述](./) 选择下一个模块，或阅读 [Loop Engineering](/guide/loop-engineering/) 了解单个 Agent 的迭代控制机制。
