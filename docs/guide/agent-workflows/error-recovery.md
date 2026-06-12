# 错误恢复

## 概念

任何多步骤工作流都可能在中途失败。错误恢复策略定义了：**当一个步骤失败时，工作流如何优雅地继续、回退或降级，而不是让整个任务崩溃。**

## 为什么错误恢复与重试不同？

重试（在 Loop Engineering 模块中讨论）处理的是**单个操作的失败**。错误恢复处理的是**工作流层面的失败**——当步骤 3 失败时，步骤 1 和 2 的产出怎么办？

## 错误分类（工作流层面）

```
┌─────────────────────────────────────────────────────────┐
│ 瞬时错误 (Transient)                                    │
│ 特征: 重试大概率成功                                    │
│ 示例: 网络超时、API 限流、文件锁冲突                     │
│ 策略: 等待 + 重试（指数退避）                            │
│ 影响: 步骤本身延迟，但不影响已完成步骤的产出              │
├─────────────────────────────────────────────────────────┤
│ 永久错误 (Permanent)                                    │
│ 特征: 重试永远无法成功                                  │
│ 示例: 权限拒绝、文件不存在、无效的 API 参数               │
│ 策略: 停止当前步骤，评估是否需要回滚已完成步骤            │
│ 影响: 可能需要撤销步骤 1-2 的产出                        │
├─────────────────────────────────────────────────────────┤
│ 歧义错误 (Ambiguous)                                    │
│ 特征: 不确定重试是否会成功                              │
│ 示例: 构建失败（可能是瞬时依赖下载失败，也可能是代码 bug） │
│ 策略: 重试一次，如果再次失败 → 升级为人工决策             │
│ 影响: 待定                                              │
└─────────────────────────────────────────────────────────┘
```

## 三种恢复策略

### 策略 1：检查点恢复（Checkpoint & Resume）

在关键步骤完成后保存状态。如果后续步骤失败，从最近的检查点恢复而不是从头开始。

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Step 1   │───▶│ Step 2   │───▶│ Step 3   │
│ 创建文件  │    │ 写内容    │    │ 验证链接  │
└──────────┘    └──────────┘    └──────────┘
     │               │               │
     ▼               ▼               ▼
  [CP 1]          [CP 2]          [CP 3]

如果 Step 3 失败:
  → 从 CP 2 恢复（文件已写入，内容已完成）
  → 重新执行验证 → 修复 → 验证 → 完成

  ✗ 不要从 CP 1 恢复（那样会丢失 Step 2 写入的内容）
  ✗ 更不要从头开始
```

检查点的实现：

```go
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"
)

// Checkpoint 保存工作流在某个步骤完成后的状态快照
type Checkpoint struct {
	Step           string            `json:"step"`
	CompletedFiles []string          `json:"completed_files"` // 已成功创建/修改的文件
	PendingTasks   []string          `json:"pending_tasks"`   // 尚未执行的任务
	State          map[string]string `json:"state"`           // 任意状态数据
	Timestamp      time.Time         `json:"timestamp"`
}

// SaveCheckpoint 将检查点持久化到文件
func SaveCheckpoint(cp Checkpoint, path string) error {
	data, err := json.MarshalIndent(cp, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal checkpoint: %w", err)
	}
	return os.WriteFile(path, data, 0644)
}

// LoadCheckpoint 从文件恢复最近的检查点
func LoadCheckpoint(path string) (Checkpoint, error) {
	var cp Checkpoint
	data, err := os.ReadFile(path)
	if err != nil {
		return cp, fmt.Errorf("read checkpoint: %w", err)
	}
	if err := json.Unmarshal(data, &cp); err != nil {
		return cp, fmt.Errorf("unmarshal checkpoint: %w", err)
	}
	return cp, nil
}

func main() {
	// 创建检查点
	cp := Checkpoint{
		Step:           "write-content",
		CompletedFiles: []string{"layering.md", "injection-strategy.md", "compression.md"},
		PendingTasks:   []string{"practice.md", "update-sidebar", "verify-links"},
		State:          map[string]string{"branch": "feat/add-context"},
		Timestamp:      time.Now(),
	}

	// 保存
	if err := SaveCheckpoint(cp, "/tmp/cp_step2.json"); err != nil {
		fmt.Printf("save error: %v\n", err)
		return
	}
	fmt.Println("✓ Checkpoint saved")

	// 恢复
	restored, err := LoadCheckpoint("/tmp/cp_step2.json")
	if err != nil {
		fmt.Printf("load error: %v\n", err)
		return
	}
	fmt.Printf("✓ Restored from step: %s\n", restored.Step)
	fmt.Printf("  Completed: %v\n", restored.CompletedFiles)
	fmt.Printf("  Pending: %v\n", restored.PendingTasks)
}
```

### 策略 2：补偿操作（Compensating Actions）

如果某一步失败，执行一个"反向操作"来撤销之前步骤的影响。

```
Step 1: git checkout -b feat/new-module        → 创建了分支
Step 2: 创建 4 个新的 .md 文件                 → 新文件在分支上
Step 3: npm run docs:build → FAIL (构建失败)

补偿操作:
  - git checkout main                          → 回到 main
  - git branch -D feat/new-module              → 删除失败分支
  → 系统恢复到 Step 1 之前的状态
```

不是所有步骤都需要或可以有补偿操作。只读操作（检查链接、读取文件）没有副作用，不需要补偿。写操作且影响范围可控的（新建分支、新建文件）可以做补偿。影响到外部的写操作（创建了 PR、推送了 commit）的补偿更复杂——可能需要关闭 PR、force push。

#### Go 实现：补偿栈（Compensating Stack）

```go
package main

import (
	"fmt"
	"regexp"
	"strings"
)

// Compensator 是一个补偿函数：执行反向操作来撤销副作用
type Compensator func() error

// CompensatingStack 维护一个 LIFO 补偿栈，按反序执行补偿
type CompensatingStack struct {
	compensators []Compensator
	actions      []string // 记录每个动作的描述，便于调试
}

// Push 记录一个补偿函数（在成功步骤后调用）
func (cs *CompensatingStack) Push(action string, compensator Compensator) {
	cs.actions = append(cs.actions, action)
	cs.compensators = append(cs.compensators, compensator)
}

// CompensateAll 按 LIFO 顺序执行所有补偿（最晚的操作最先撤销）
func (cs *CompensatingStack) CompensateAll() error {
	for i := len(cs.compensators) - 1; i >= 0; i-- {
		fmt.Printf("  补偿: %s\n", cs.actions[i])
		if err := cs.compensators[i](); err != nil {
			return fmt.Errorf("compensation failed for %s: %w", cs.actions[i], err)
		}
	}
	return nil
}

// simulatedFile 模拟文件系统操作
type simulatedFile struct {
	name    string
	content string
}

var fileSystem = make(map[string]*simulatedFile)

// 模拟步骤函数
func createFile(name, content string) error {
	fileSystem[name] = &simulatedFile{name: name, content: content}
	fmt.Printf("  创建文件: %s\n", name)
	return nil
}

func readFile(name string) (string, error) {
	if f, ok := fileSystem[name]; ok {
		return f.content, nil
	}
	return "", fmt.Errorf("file %s not found", name)
}

func deleteFile(name string) error {
	delete(fileSystem, name)
	return nil
}

func buildProject() error {
	// 模拟构建失败（检查文件内容）
	for name, f := range fileSystem {
		if strings.Contains(f.content, "ERROR") {
			return fmt.Errorf("build failed: %s contains invalid content", name)
		}
	}
	return nil
}

func main() {
	cs := &CompensatingStack{}
	success := false

	// Step 1: 创建文件
	if err := createFile("docs/module-a.md", "# Module A"); err != nil {
		fmt.Printf("Step 1 failed: %v\n", err)
		cs.CompensateAll()
		return
	}
	cs.Push("删除 docs/module-a.md", func() error { return deleteFile("docs/module-a.md") })

	// Step 2: 创建第二个文件
	if err := createFile("docs/module-b.md", "ERROR content"); err != nil {
		fmt.Printf("Step 2 failed: %v\n", err)
		cs.CompensateAll()
		return
	}
	cs.Push("删除 docs/module-b.md", func() error { return deleteFile("docs/module-b.md") })

	// Step 3: 构建（会因为 ERROR 内容失败）
	if err := buildProject(); err != nil {
		fmt.Printf("Step 3 failed: %v\n", err)
		cs.CompensateAll()
		return
	}

	success = true
	_ = success
	fmt.Println("✓ 所有步骤成功")
}
```

**要点**：
- 补偿栈是 LIFO：最后执行的步骤最先被补偿
- 每个步骤成功后立即注册补偿函数，保证失败时总能回滚
- 补偿函数应该是幂等的——多次执行结果相同

### 策略 3：部分完成降级（Graceful Partial Completion）

当部分步骤成功、部分失败时，交付已经完成的部分，标记未完成的部分。

```
任务: 修复 10 个断链

Step 1: 修复链接 #1-8 → 全部成功
Step 2: 修复链接 #9   → 失败（目标页面不存在，且不应创建）

策略 3 输出:
  {
    "status": "PARTIAL",
    "completed": 8,      // #1-8 已修复并验证
    "failed": 1,          // #9 无法自动修复
    "remaining": 1,       // #10 尚未尝试（被 Step 2 的失败中断）
    "recommendation": "#9 指向的页面不存在，需要人工决定：创建页面或更新引用"
  }
```

#### Go 实现：批量任务的部分完成追踪

```go
package main

import (
	"fmt"
	"strings"
)

// BatchResult 追踪批量任务中每个项目的执行结果
type BatchResult struct {
	Completed  int
	Failed     int
	Remaining  int
	Errors     []TaskError
}

// TaskError 记录单个失败任务的信息
type TaskError struct {
	Index  int
	Name   string
	Reason string
}

// BatchProcessor 逐个处理任务，支持部分完成降级
type BatchProcessor struct {
	maxRetries int
}

// ProcessItem 处理单个项目，返回是否成功
func (bp *BatchProcessor) ProcessItem(item string) error {
	// 模拟：包含 "unfixable" 的项目会失败
	if strings.Contains(item, "unfixable") {
		return fmt.Errorf("目标页面不存在，需要人工决定")
	}
	return nil
}

// RunBatch 批量处理任务，失败时跳过继续，最终返回汇总
func (bp *BatchProcessor) RunBatch(items []string) BatchResult {
	result := BatchResult{
		Errors: make([]TaskError, 0),
	}

	for i, item := range items {
		err := bp.ProcessItem(item)
		if err != nil {
			result.Failed++
			result.Errors = append(result.Errors, TaskError{
				Index:  i,
				Name:   item,
				Reason: err.Error(),
			})
			continue
		}
		result.Completed++
	}

	result.Remaining = 0 // 在这个简化模型中，所有项都被尝试了
	return result
}

// Summary 生成可读的汇总报告
func (br BatchResult) Summary() string {
	lines := []string{
		fmt.Sprintf("Status: %s", br.status()),
		fmt.Sprintf("Completed: %d", br.Completed),
		fmt.Sprintf("Failed: %d", br.Failed),
	}
	for _, e := range br.Errors {
		lines = append(lines, fmt.Sprintf("  [%d] %s: %s", e.Index, e.Name, e.Reason))
	}
	return strings.Join(lines, "\n")
}

func (br BatchResult) status() string {
	if br.Failed == 0 {
		return "PASS"
	}
	if br.Completed > 0 {
		return "PARTIAL"
	}
	return "FAIL"
}

func main() {
	processor := &BatchProcessor{maxRetries: 1}

	items := []string{
		"link-1", "link-2", "link-3",
		"unfixable-link", // 这个会失败
		"link-5",
	}

	result := processor.RunBatch(items)
	fmt.Println(result.Summary())
}
```

**要点**：
- 失败的项目被记录但不阻塞后续项目
- 最终报告区分 PASS / PARTIAL / FAIL 三种状态
- 适合"批量修复"场景：修了 8 个，2 个需要人工处理

## 示例：工作流失败恢复流程

场景：Agent 正在新增一个教程模块（4 个子页）。

```
[CP 1] 创建了分支 feat/add-context-pages ✓

Step 2: 写入 4 个 .md 文件
  - layering.md ✓
  - injection-strategy.md ✓
  - compression.md ✓
  - practice.md ✓

[CP 2] 4 个文件已写入，内容完整 ✓

Step 3: 更新 sidebar config → ✓

Step 4: npm run docs:build → FAIL
  错误: 3 个 dead links（子页中引用的链接路径有误）

[错误分类] 构建失败 → Ambiguous（可能是瞬时依赖下载失败，也可能是代码问题）
  重试 1 次 → npm run docs:build → 仍然 FAIL（相同错误）
  → 升级为人工决策

[恢复策略]
  从 CP 2 恢复: 文件内容 OK，sidebar config OK
  Agent 分析 build 错误 → 修复 3 个 dead links → 重试 build
  npm run docs:build → PASS

[CP 3] 构建通过 ✓
```

## Dead Letter Queue（死信队列）

对于反复失败的任务，不要让它阻塞主流程：

```
┌──────────────┐
│  主工作流     │
│  处理 10 个   │
│  翻译任务     │
└──────┬───────┘
       │ 9 个成功，1 个反复失败
       ▼
┌──────────────┐
│  Dead Letter │ ← 失败的任务被移到这儿
│  Queue       │
│              │
│ task-47:     │
│ 文件: docs/en/guide/harness/entropy.md
│ 错误: 翻译后丢失了 2 个 ASCII 图表
│ 重试次数: 3
│ 下次处理: 人工 review 后重新提交
└──────────────┘
```

死信队列的价值：**不阻塞主流程，但不丢弃失败的任务**。它把"暂时无法自动处理"的任务从"完成"和"放弃"之间分出来。

#### Go 实现：带重试和死信队列的任务处理器

```go
package main

import (
	"fmt"
	"strings"
)

// DeadLetter 保存一个反复失败的任务及其上下文
type DeadLetter struct {
	Task       string
	Error      string
	RetryCount int
	MaxRetries int
}

// RetryWithDeadLetter 为失败任务实现指数退避重试，超过阈值放入死信队列
func RetryWithDeadLetter(task string, fn func(string) error, maxRetries int) (string, error) {
	var lastErr error
	for attempt := 0; attempt <= maxRetries; attempt++ {
		if err := fn(task); err != nil {
			lastErr = err
			fmt.Printf("  [retry %d/%d] %s failed: %v\n", attempt+1, maxRetries, task, err)
			continue
		}
		return fmt.Sprintf("%s: 完成", task), nil
	}

	// 所有重试耗尽
	dl := DeadLetter{
		Task:       task,
		Error:      lastErr.Error(),
		RetryCount: maxRetries + 1,
		MaxRetries: maxRetries,
	}
	return "", fmt.Errorf("dead letter: %s", formatDeadLetter(dl))
}

// formatDeadLetter 格式化死信信息
func formatDeadLetter(dl DeadLetter) string {
	return fmt.Sprintf("[%s] %s after %d retries", dl.Task, dl.Error, dl.RetryCount)
}

// unstableTask 模拟一个总是失败的任务
func unstableTask(task string) error {
	if strings.Contains(task, "broken") {
		return fmt.Errorf("ASCII 图表丢失，翻译质量不合格")
	}
	return nil
}

func main() {
	tasks := []string{
		"translate-greeting",
		"translate-intro",
		"broken-translate-advanced", // 这个会失败
		"translate-conclusion",
	}

	deadLetters := []DeadLetter{}

	for _, task := range tasks {
		result, err := RetryWithDeadLetter(task, unstableTask, 2)
		if err != nil {
			// 提取死信信息
			dl := DeadLetter{
				Task:       task,
				Error:      err.Error(),
				RetryCount: 3,
				MaxRetries: 2,
			}
			deadLetters = append(deadLetters, dl)
		} else {
			fmt.Printf("  ✓ %s\n", result)
		}
	}

	if len(deadLetters) > 0 {
		fmt.Printf("\nDead Letter Queue (%d items):\n", len(deadLetters))
		for _, dl := range deadLetters {
			fmt.Printf("  - %s: %s\n", dl.Task, dl.Error)
		}
	}
}
```

**要点**：
- 重试次数有上限，超过后任务进入死信队列而不是无限循环
- 死信队列保存了失败原因和上下文，便于后续人工处理
- 主流程不受单个任务失败影响，继续处理其他任务

## 练习

为一个"批量更新 20 个页面的 frontmatter"的工作流设计错误恢复方案：

1. 哪些操作有副作用（需要补偿）？哪些没有？
2. 在哪些步骤之后应该设置检查点？
3. 如果第 15 个页面更新后验证失败，工作流应该如何恢复？
4. 什么情况下应该把任务放入死信队列而不是反复重试？

## 排错

| 症状 | 可能原因 | 修复 |
|------|----------|------|
| 恢复后重复执行了已经成功的步骤 | 检查点没有正确保存进度 | 确保检查点包含"已完成任务 ID 列表" |
| 补偿操作本身也失败了 | 补偿操作假设的状态已经不存在 | 补偿操作要幂等——多次执行结果相同 |
| 死信队列堆积了大量任务 | 重试阈值太高或没有人工处理流程 | 降低重试次数，加入定期清理机制 |

## 下一步

错误恢复处理的是"步骤失败"——接下来看[多 Agent 协调](./multi-agent)，处理的是"多个 Agent 同时工作时的冲突和协调"。
