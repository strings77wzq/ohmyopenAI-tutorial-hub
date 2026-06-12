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

#### Go 实现：sync.Mutex 保护的共享状态

```go
package main

import (
	"fmt"
	"sync"
)

// TaskStatus 描述单个任务的当前状态
type TaskStatus struct {
	Module string
	State  string // "pending", "in_progress", "complete", "failed"
}

// SharedState 用互斥锁保护的任务状态表，支持多 Agent 并发读写
type SharedState struct {
	mu    sync.RWMutex
	tasks map[string]*TaskStatus
}

// NewSharedState 创建初始化好的共享状态
func NewSharedState() *SharedState {
	return &SharedState{
		tasks: map[string]*TaskStatus{
			"context": {Module: "context", State: "pending"},
			"eval":    {Module: "eval", State: "pending"},
			"loop":    {Module: "loop", State: "pending"},
		},
	}
}

// UpdateState 原子地更新某个模块的状态
func (s *SharedState) UpdateState(module, newState string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if task, ok := s.tasks[module]; ok {
		task.State = newState
		fmt.Printf("  [%s] → %s\n", module, newState)
	}
}

// GetState 读取某个模块的状态（读锁，不阻塞并发读）
func (s *SharedState) GetState(module string) string {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if task, ok := s.tasks[module]; ok {
		return task.State
	}
	return "unknown"
}

// Summary 返回所有模块的当前状态快照
func (s *SharedState) Summary() map[string]string {
	s.mu.RLock()
	defer s.mu.RUnlock()

	summary := make(map[string]string, len(s.tasks))
	for name, task := range s.tasks {
		summary[name] = task.State
	}
	return summary
}

// simulateAgent 模拟一个 Agent 的工作：更新状态 → 工作 → 更新完成
func simulateAgent(state *SharedState, module string, wg *sync.WaitGroup) {
	defer wg.Done()
	state.UpdateState(module, "in_progress")
	// 模拟工作耗时
	state.UpdateState(module, "complete")
}

func main() {
	state := NewSharedState()
	var wg sync.WaitGroup

	// 三个 Agent 并发更新各自的模块状态
	for _, mod := range []string{"context", "eval", "loop"} {
		wg.Add(1)
		go simulateAgent(state, mod, &wg)
	}
	wg.Wait()

	fmt.Println("\nFinal state:")
	for name, s := range state.Summary() {
		fmt.Printf("  %s: %s\n", name, s)
	}
}
```

**要点**：
- `sync.RWMutex` 区分读写锁：多个读操作可以并发，写操作独占
- `UpdateState` 是原子操作，不会出现"读到一半被写"的脏读
- 适合需要全局进度可见的场景，但锁竞争会成为瓶颈

### 模式 B：消息传递（Message Passing）

Agent 之间通过明确的消息通信，不共享文件。

```
Agent A ──"context 模块完成，4 个文件就绪"──▶ Agent C
Agent B ──"eval 模块完成，4 个文件就绪"────▶ Agent C
Agent C: 收到了 2 条完成消息 → 开始合并和验证
```

**优点**：无共享状态竞争
**缺点**：Agent 需要知道"发给谁"

#### Go 实现：Channel 驱动的 Agent 消息传递

```go
package main

import (
	"fmt"
	"sync"
)

// AgentMessage 是 Agent 之间传递的消息格式
type AgentMessage struct {
	From    string
	Content string
	Type    string // "task_complete", "task_failed", "merge_ready"
}

// MessageBus 是 Agent 之间的消息总线，支持多生产者和多消费者
type MessageBus struct {
	mu          sync.RWMutex
	subscribers map[string][]chan AgentMessage
}

// NewMessageBus 创建消息总线
func NewMessageBus() *MessageBus {
	return &MessageBus{
		subscribers: make(map[string][]chan AgentMessage),
	}
}

// Subscribe 注册一个 Agent 监听特定类型的消息
func (mb *MessageBus) Subscribe(agentID string, bufferSize int) <-chan AgentMessage {
	ch := make(chan AgentMessage, bufferSize)
	mb.mu.Lock()
	defer mb.mu.Unlock()
	mb.subscribers[agentID] = append(mb.subscribers[agentID], ch)
	return ch
}

// Publish 向所有订阅者广播消息
func (mb *MessageBus) Publish(msg AgentMessage) {
	mb.mu.RLock()
	defer mb.mu.RUnlock()

	for _, ch := range mb.subscribers[msg.From] {
		select {
		case ch <- msg:
		default:
			// 缓冲满，跳过避免阻塞发送者
		}
	}
	for id, ch := range mb.subscribers {
		if id != msg.From {
			select {
			case ch <- msg:
			default:
			}
		}
	}
}

// agentA 模拟一个写文档的 Agent，完成后发送消息
func agentA(bus *MessageBus, wg *sync.WaitGroup) {
	defer wg.Done()
	fmt.Println("Agent A: 开始写 context 模块...")
	// 模拟工作
	bus.Publish(AgentMessage{From: "agentA", Content: "context 模块完成，4 个文件就绪", Type: "task_complete"})
	fmt.Println("Agent A: 完成")
}

// agentB 模拟另一个写文档的 Agent
func agentB(bus *MessageBus, wg *sync.WaitGroup) {
	defer wg.Done()
	fmt.Println("Agent B: 开始写 eval 模块...")
	// 模拟工作
	bus.Publish(AgentMessage{From: "agentB", Content: "eval 模块完成，4 个文件就绪", Type: "task_complete"})
	fmt.Println("Agent B: 完成")
}

// agentC 是编排者，等待所有任务完成后汇总
func agentC(bus *MessageBus, wg *sync.WaitGroup) {
	defer wg.Done()
	ch := bus.Subscribe("agentC", 10)
	completed := 0
	total := 2 // 等待 agentA 和 agentB

	for completed < total {
		msg := <-ch
		if msg.Type == "task_complete" {
			fmt.Printf("Agent C 收到: %s\n", msg.Content)
			completed++
		}
	}
	fmt.Println("Agent C: 所有模块就绪，开始合并验证")
}

func main() {
	bus := NewMessageBus()
	var wg sync.WaitGroup

	// agentC 先启动监听，agentA/B 并行执行
	wg.Add(3)
	go agentC(bus, &wg)
	go agentA(bus, &wg)
	go agentB(bus, &wg)

	wg.Wait()
	fmt.Println("所有 Agent 完成")
}
```

**要点**：
- Channel 天然保证消息的有序性（对单个接收者）
- `Subscribe` + `Publish` 实现了发布-订阅模式，Agent 不需要知道彼此的存在
- 缓冲 channel 防止发送者被慢消费者阻塞

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

#### Go 实现：Orchestrator + Worker 模式

```go
package main

import (
	"context"
	"fmt"
	"sync"
)

// Worker 定义一个可被 Orchestrator 调度的 Agent
type Worker struct {
	ID      string
	WorkFn  func(ctx context.Context) (string, error)
	Result  string
	Err     error
}

// Orchestrator 管理多个 Worker 的生命周期：分派 → 等待 → 汇总
type Orchestrator struct {
	workers []*Worker
	mu      sync.Mutex
}

// NewOrchestrator 创建编排者
func NewOrchestrator() *Orchestrator {
	return &Orchestrator{}
}

// Assign 添加一个 Worker
func (o *Orchestrator) Assign(w *Worker) {
	o.mu.Lock()
	defer o.mu.Unlock()
	o.workers = append(o.workers, w)
}

// RunAll 并行启动所有 Worker，等待全部完成后收集结果
func (o *Orchestrator) RunAll(ctx context.Context) []WorkerResult {
	var wg sync.WaitGroup

	for _, w := range o.workers {
		wg.Add(1)
		go func(worker *Worker) {
			defer wg.Done()
			worker.Result, worker.Err = worker.WorkFn(ctx)
		}(w)
	}
	wg.Wait()

	return o.collect()
}

// WorkerResult 是 Orchestrator 汇总后的结构化结果
type WorkerResult struct {
	ID     string
	Result string
	Err    error
}

// collect 从所有 Worker 收集结果
func (o *Orchestrator) collect() []WorkerResult {
	results := make([]WorkerResult, len(o.workers))
	for i, w := range o.workers {
		results[i] = WorkerResult{ID: w.ID, Result: w.Result, Err: w.Err}
	}
	return results
}

// Summary 打印汇总报告
func (o *Orchestrator) Summary(results []WorkerResult) {
	passed, failed := 0, 0
	for _, r := range results {
		if r.Err != nil {
			fmt.Printf("  ✗ %s: %v\n", r.ID, r.Err)
			failed++
		} else {
			fmt.Printf("  ✓ %s: %s\n", r.ID, r.Result)
			passed++
		}
	}
	fmt.Printf("\n汇总: %d 成功, %d 失败\n", passed, failed)
}

func main() {
	ctx := context.Background()
	orch := NewOrchestrator()

	// 分配三个 Agent
	orch.Assign(&Worker{
		ID: "context-writer",
		WorkFn: func(_ context.Context) (string, error) {
			return "context 模块: 4 文件已写入", nil
		},
	})
	orch.Assign(&Worker{
		ID: "eval-writer",
		WorkFn: func(_ context.Context) (string, error) {
			return "eval 模块: 4 文件已写入", nil
		},
	})
	orch.Assign(&Worker{
		ID: "sidebar-updater",
		WorkFn: func(_ context.Context) (string, error) {
			return "sidebar: 8 个新条目已添加", nil
		},
	})

	// 并行执行，收集结果
	results := orch.RunAll(ctx)
	orch.Summary(results)
}
```

**要点**：
- Orchestrator 是唯一知道所有 Worker 存在的组件
- Worker 之间没有直接通信，降低了耦合
- 适合"分派 → 收集"的模式，Orchestrator 负责所有协调逻辑

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
