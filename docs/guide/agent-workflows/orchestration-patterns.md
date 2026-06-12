# 编排模式

## 概念

编排（Orchestration）决定了多个 Agent 操作如何组合成一个完整的工作流。不同的编排模式对应不同的任务结构和容错需求。

## 为什么编排模式很重要？

单步 Agent 操作（读文件、写代码、跑测试）本身很简单。复杂的不是单步操作，而是**步骤之间的关系**：谁依赖谁？谁可以并行？某个步骤失败了，后续步骤怎么办？

## 四种核心编排模式

### 1. 顺序链（Sequential Chain）

最简单的模式：A 完成后 B 开始，B 完成后 C 开始。

```
┌───┐     ┌───┐     ┌───┐
│ A ├────▶│ B ├────▶│ C │
└───┘     └───┘     └───┘
```

适用场景：每一步的输出是下一步的输入。

```
示例: 生成文档 PR
  1. 读取 spec 文件          → 得到 spec 内容
  2. 基于 spec 生成文档      → 得到 .md 文件
  3. 验证文档链接            → 得到检查结果
  4. 创建 PR                 → PR URL
```

**优点**：简单，容易理解和调试
**缺点**：总时间 = 所有步骤之和；任何一个步骤失败，后续全部阻塞

#### Go 实现：Channel 驱动的顺序管道

```go
package main

import (
	"context"
	"fmt"
	"strings"
)

// PipelineStep 定义管道中每一步的函数签名
// 输入通过 channel 传递，输出返回给下一步
type PipelineStep func(ctx context.Context, input string) (string, error)

// SequentialPipeline 按顺序执行一组步骤，前一步的输出作为后一步的输入
func SequentialPipeline(ctx context.Context, input string, steps ...PipelineStep) (string, error) {
	current := input
	for i, step := range steps {
		// 支持取消：如果 ctx 已结束，提前退出
		select {
		case <-ctx.Done():
			return "", fmt.Errorf("pipeline cancelled at step %d: %w", i, ctx.Err())
		default:
		}

		result, err := step(ctx, current)
		if err != nil {
			return "", fmt.Errorf("step %d failed: %w", i, err)
		}
		current = result
	}
	return current, nil
}

func main() {
	ctx := context.Background()

	// 定义管道步骤：每一步都是独立的纯函数
	result, err := SequentialPipeline(ctx, "  hello agent world  ",
		// Step 1: 清理空白字符
		func(_ context.Context, input string) (string, error) {
			return strings.TrimSpace(input), nil
		},
		// Step 2: 转大写
		func(_ context.Context, input string) (string, error) {
			return strings.ToUpper(input), nil
		},
		// Step 3: 分词并计数
		func(_ context.Context, input string) (string, error) {
			words := strings.Fields(input)
			return fmt.Sprintf("word_count=%d", len(words)), nil
		},
	)
	if err != nil {
		fmt.Printf("pipeline error: %v\n", err)
		return
	}
	fmt.Println(result) // 输出: word_count=3
}
```

**要点**：
- 每个步骤只依赖上一步的输出，天然支持 context 取消
- 步骤是普通函数，方便单元测试
- 适合处理链式数据变换：读取 → 清洗 → 生成 → 验证

### 2. 扇出-合并（Fan-out / Fan-in）

多个独立任务并行执行，结果在汇聚点合并。

```
        ┌───┐
    ┌──▶│ B ├──┐
    │   └───┘  │
┌───┤          ├───▶ ┌───┐
│ A │          │     │ E │ (合并结果)
└───┤   ┌───┐  │     └───┘
    │   │ C ├──┤
    ├──▶└───┘  │
    │   ┌───┐  │
    └──▶│ D ├──┘
        └───┘
```

适用场景：多个独立子任务，结果需要汇总。

```
示例: 同时检查文档站的 3 个质量维度
  A: 触发质量检查
  ├── B: link-checker    → 0 errors
  ├── C: route-checker   → all routes ok
  └── D: frontmatter     → all pages have titles
  E: 汇总 → PASS (3/3) 或 FAIL (含具体失败项)
```

**优点**：总时间 = 最慢的子任务时间
**缺点**：合并逻辑需要处理部分失败（B 和 C 通过了但 D 失败了 → 整体 PASS 还是 FAIL？）

#### Go 实现：WaitGroup + Channel 扇出-合并

```go
package main

import (
	"context"
	"fmt"
	"math/rand"
	"sync"
	"time"
)

// Task 代表一个可并行执行的子任务
type Task struct {
	Name    string
	Execute func(ctx context.Context) (string, error)
}

// TaskResult 保存单个子任务的执行结果
type TaskResult struct {
	Name   string
	Output string
	Err    error
}

// FanOutFanIn 并行执行所有任务，收集全部结果（无论成功或失败）
func FanOutFanIn(ctx context.Context, tasks []Task) []TaskResult {
	results := make([]TaskResult, len(tasks))
	var wg sync.WaitGroup

	for i, task := range tasks {
		wg.Add(1)
		go func(idx int, t Task) {
			defer wg.Done()

			// 每个 goroutine 都监听 ctx，支持整体取消
			resultCh := make(chan TaskResult, 1)
			go func() {
				out, err := t.Execute(ctx)
				resultCh <- TaskResult{Name: t.Name, Output: out, Err: err}
			}()

			select {
			case res := <-resultCh:
				results[idx] = res
			case <-ctx.Done():
				results[idx] = TaskResult{Name: t.Name, Err: ctx.Err()}
			}
		}(i, task)
	}

	// 等待所有 goroutine 完成
	wg.Wait()
	return results
}

// summarize 收集所有结果，统计成功/失败数
func summarize(results []TaskResult) {
	passed, failed := 0, 0
	for _, r := range results {
		if r.Err != nil {
			fmt.Printf("  ✗ %s: %v\n", r.Name, r.Err)
			failed++
		} else {
			fmt.Printf("  ✓ %s: %s\n", r.Name, r.Output)
			passed++
		}
	}
	fmt.Printf("\nSummary: %d passed, %d failed\n", passed, failed)
}

func main() {
	ctx := context.Background()
	rand.Seed(time.Now().UnixNano())

	// 定义三个独立的质量检查任务
	tasks := []Task{
		{Name: "link-checker", Execute: func(_ context.Context) (string, error) {
			time.Sleep(time.Duration(50+rand.Intn(100)) * time.Millisecond)
			return "0 broken links", nil
		}},
		{Name: "route-checker", Execute: func(_ context.Context) (string, error) {
			time.Sleep(time.Duration(30+rand.Intn(80)) * time.Millisecond)
			return "all routes ok", nil
		}},
		{Name: "frontmatter", Execute: func(_ context.Context) (string, error) {
			time.Sleep(time.Duration(40+rand.Intn(90)) * time.Millisecond)
			return "12/12 pages have titles", nil
		}},
	}

	results := FanOutFanIn(ctx, tasks)
	summarize(results)
}
```

**要点**：
- `sync.WaitGroup` 确保所有 goroutine 完成后才进入合并阶段
- 每个 goroutine 用独立的 channel 传递结果，避免竞争
- `context` 支持超时取消：如果某个任务太慢，可以在 ctx 里设置 deadline

### 3. DAG（有向无环图）

任务之间有多对多的依赖关系，但不是循环。

```
        ┌───┐
    ┌──▶│ B ├──┐
    │   └───┘  │   ┌───┐
┌───┤          ├──▶│ D │
│ A │   ┌───┐  │   └───┘
└───┤   │ C ├──┘
    │   └───┘
    └──────────────▶ ┌───┐
                    │ E │
                    └───┘
```

适用场景：复杂依赖关系，多个前置任务完成后才能开始后续。

```
示例: 新增一个教程模块
  A: 创建文件结构
  ├── B: 编写内容       ─┐
  ├── C: 更新 sidebar    │
  │                      ├──▶ D: npm run docs:build
  └── E: 添加 EN 翻译   ─┘
                         (B, C, E 都完成后才能 build)
```

**优点**：表达真实的复杂依赖关系
**缺点**：编排逻辑复杂，调试困难

#### Go 实现：拓扑排序 + 并行调度

```go
package main

import (
	"context"
	"fmt"
	"sync"
)

// DAGNode 表示 DAG 中的一个节点
type DAGNode struct {
	Name     string
	Deps     []string // 依赖的其他节点名称
	Execute  func(ctx context.Context) error
	computed bool
	mu       sync.Mutex
}

// DAG 由多个节点组成，支持拓扑排序和并行执行
type DAG struct {
	Nodes map[string]*DAGNode
}

// NewDAG 创建空 DAG
func NewDAG() *DAG {
	return &DAG{Nodes: make(map[string]*DAGNode)}
}

// AddNode 向 DAG 中添加节点
func (d *DAG) AddNode(name string, deps []string, exec func(ctx context.Context) error) {
	d.Nodes[name] = &DAGNode{Name: name, Deps: deps, Execute: exec}
}

// resolve 确定某节点的所有依赖已满足
func (d *DAG) resolve(name string) bool {
	node, ok := d.Nodes[name]
	if !ok {
		return false
	}
	for _, dep := range node.Deps {
		if !d.Nodes[dep].computed {
			return false
		}
	}
	return true
}

// Run 从无依赖的节点开始，逐层并行执行，直到所有节点完成
func (d *DAG) Run(ctx context.Context) error {
	total := len(d.Nodes)
	completed := 0

	for completed < total {
		// 找出所有依赖已满足但尚未执行的节点
		var ready []*DAGNode
		for name, node := range d.Nodes {
			if !node.computed && d.resolve(name) {
				ready = append(ready, node)
			}
		}

		if len(ready) == 0 && completed < total {
			return fmt.Errorf("DAG has unresolved dependencies or cycle: %d/%d completed", completed, total)
		}

		// 并行执行当前层的所有节点
		var wg sync.WaitGroup
		var execErr error
		for _, node := range ready {
			wg.Add(1)
			go func(n *DAGNode) {
				defer wg.Done()

				if err := n.Execute(ctx); err != nil {
					execErr = err
					return
				}
				n.mu.Lock()
				n.computed = true
				n.mu.Unlock()
			}(node)
		}
		wg.Wait()

		if execErr != nil {
			return execErr
		}

		completed += len(ready)
	}
	return nil
}

func main() {
	ctx := context.Background()
	dag := NewDAG()

	// 定义一个"新增教程模块"的 DAG
	dag.AddNode("create-structure", nil, func(_ context.Context) error {
		fmt.Println("✓ 创建文件结构")
		return nil
	})
	dag.AddNode("write-content", []string{"create-structure"}, func(_ context.Context) error {
		fmt.Println("✓ 编写内容")
		return nil
	})
	dag.AddNode("update-sidebar", []string{"create-structure"}, func(_ context.Context) error {
		fmt.Println("✓ 更新 sidebar config")
		return nil
	})
	dag.AddNode("add-en-translation", []string{"create-structure"}, func(_ context.Context) error {
		fmt.Println("✓ 添加 EN 翻译")
		return nil
	})
	dag.AddNode("docs-build", []string{"write-content", "update-sidebar", "add-en-translation"}, func(_ context.Context) error {
		fmt.Println("✓ npm run docs:build")
		return nil
	})

	if err := dag.Run(ctx); err != nil {
		fmt.Printf("DAG execution failed: %v\n", err)
	}
}
```

**要点**：
- 依赖关系通过 `Deps` 字段声明，运行时自动计算执行顺序
- 同一层的节点（无互相依赖）可以并行执行
- 检测到循环依赖时返回错误，避免死锁

### 4. 状态机（State Machine）

Agent 在多个状态之间转换，每个状态有明确的前置条件和出口。

```
        ┌─────────┐
        │  DIAG   │ (诊断)
        └────┬────┘
             │ 问题已定位
             ▼
        ┌─────────┐
    ┌──▶│  FIX    │ (修复)
    │   └────┬────┘
    │        │ 修复完成
    │        ▼
    │   ┌─────────┐
    │   │ VERIFY  │ (验证)
    │   └────┬────┘
    │        │
    │   ┌────┴────┐
    │   ▼         ▼
    │ PASS      FAIL
    │   │         │
    │   ▼         └──▶ 回到 FIX
    │  DONE
    └──(重试超过 3 次 → ESCALATE)
```

适用场景：每一步的结果决定下一步的状态，而且状态之间可能有循环。

#### Go 实现：Channel + Select 驱动的状态机

```go
package main

import (
	"context"
	"fmt"
	"math/rand"
	"time"
)

// State 表示状态机的当前状态
type State int

const (
	StateDiagnose State = iota // 诊断
	StateFix                   // 修复
	StateVerify                // 验证
	StateDone                  // 完成
	StateEscalate              // 上报人工
)

func (s State) String() string {
	return [...]string{"DIAG", "FIX", "VERIFY", "DONE", "ESCALATE"}[s]
}

// Transition 根据当前状态和输入决定下一个状态
func Transition(current State, verifyPassed bool, retries int) State {
	switch current {
	case StateDiagnose:
		return StateFix // 假设诊断总能找到问题
	case StateFix:
		return StateVerify
	case StateVerify:
		if verifyPassed {
			return StateDone
		}
		if retries >= 3 {
			return StateEscalate // 重试超过阈值，上报
		}
		return StateFix // 验证失败，回去修复
	default:
		return current // 终态不转换
	}
}

// runStateMachine 用 channel 驱动状态流转，用 select 监听取消信号
func runStateMachine(ctx context.Context, maxRetries int) State {
	current := StateDiagnose
	retries := 0
	stateCh := make(chan State, 1)

	for {
		select {
		case <-ctx.Done():
			fmt.Printf("  ⏹ Context cancelled at state %s\n", current)
			return StateEscalate
		default:
		}

		fmt.Printf("  → State: %s (retry=%d)\n", current, retries)

		// 模拟每个状态的处理
		switch current {
		case StateDiagnose:
			// 模拟诊断
			time.Sleep(10 * time.Millisecond)
		case StateFix:
			// 模拟修复
			time.Sleep(10 * time.Millisecond)
		case StateVerify:
			// 模拟验证，随机通过/失败
			passed := rand.Float64() > 0.5
			go func(p bool) {
				stateCh <- Transition(StateVerify, p, retries)
			}(passed)
			// 等待验证结果
			next := <-stateCh
			if next == StateFix {
				retries++
			} else if next == StateEscalate {
				fmt.Println("  ⚠ 超过最大重试次数，上报人工")
				return StateEscalate
			} else if next == StateDone {
				fmt.Println("  ✓ 验证通过，任务完成")
				return StateDone
			}
			current = next
			continue
		case StateDone, StateEscalate:
			return current
		}

		// 非 VERIFY 状态直接转换
		current = Transition(current, false, retries)
	}
}

func main() {
	ctx := context.Background()
	fmt.Println("=== 状态机驱动的修复工作流 ===")
	finalState := runStateMachine(ctx, 3)
	fmt.Printf("Final state: %s\n", finalState)
}
```

**要点**：
- `select` 监听 `ctx.Done()`，实现优雅取消
- 状态转换函数 `Transition` 是纯函数，可独立测试
- 重试计数器在状态机外部管理，避免状态膨胀

## 如何选择编排模式

| 任务特征 | 推荐模式 |
|----------|----------|
| 步骤之间有严格顺序依赖 | 顺序链 |
| 多个独立子任务可并行 | 扇出-合并 |
| 复杂的多维依赖 | DAG |
| 结果不确定，需要根据中间结果决策 | 状态机 |
| 简单且路径固定 | 顺序链（不要过度设计） |

## 编排中的局部失败处理

```
原则 1: 不要因为非关键任务的失败而阻塞整个工作流

原则 2: 但如果关键任务失败，必须停止并报告

原则 3: 部分成功也是一种有效的结果
         （"5 个文件中 3 个修复成功，2 个需要人工处理"）
```

## 示例：编排"新增 Context Engineering 4 子页"

```
Phase 1: 创建 (顺序链)
  1. 创建 4 个 .md 文件
  2. 写入内容（按结构模板）
  3. 更新 sidebar config
  4. 验证: npm run docs:check-links

Phase 2: 并行验证 (扇出-合并)
  ├── npm run docs:check-links
  ├── npm run docs:check-routes
  └── npm run docs:check-frontmatter

Phase 3: 构建验证 (顺序)
  5. npm run docs:build
  6. 检查构建输出（页面数、大小、时间）

Phase 4: 提交 (顺序)
  7. 如果所有验证通过 → git commit
  8. 如果有验证失败 → 报告失败 + 修复 → 回到 Phase 1
```

## 练习

为一个"同时更新 5 个文档模块的 EN 翻译"的任务设计编排：

1. 哪些步骤可以并行？
2. 哪些步骤有依赖关系？
3. 如果 4 个模块翻译完成、1 个模块的翻译质量标记为 FAIL，整体算完成吗？
4. 画出编排拓扑图。

## 排错

| 症状 | 可能原因 | 修复 |
|------|----------|------|
| 扇出中一个分支失败导致所有分支被放弃 | 合并逻辑没有处理部分失败 | 改成"收集所有结果，标注每个分支的 PASS/FAIL" |
| DAG 中出现循环依赖 | 任务 A 等待 B，B 等待 A | 重新分析依赖，打破循环 |
| 状态机卡在 FIX→VERIFY→FIX 循环 | VERIFY 标准太严或 FIX 没有产生进展 | 增加退出条件（最大循环次数） |

## 下一步

编排决定了"步骤之间的关系"——接下来看[错误恢复](./error-recovery)，处理单个步骤内部的失败。
