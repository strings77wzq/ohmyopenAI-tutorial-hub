# golem Skill 系统解剖

golem 的 Skill 系统展示如何封装可复用 Agent 能力单元。

## Skill 核心结构

```go
// 精简版：~150 行

type Skill struct {
    Name        string      // 技能名称
    Description string    // 技能描述
    Prompt     string     // Agent Prompt
    Fn         func(Context) Result  // 执行函数
}

type Registry struct {
    skills map[string]Skill
}

// 注册技能
func (r *Registry) Register(s Skill) {
    r.skills[s.Name] = s
}
```

## 内置 Skills

golem 内置两个核心 Skill：

| Skill | 功能 | 场景 |
|-------|------|------|
| `summarize` | 对话总结 | 长对话压缩 |
| `code-review` | 代码审查 | 代码质量检查 |

## 注册示例

```go
var Builtins = []Skill{
    {
        Name:        "summarize",
        Description: "总结对话要点",
        Prompt:      "你是总结专家...",
        Fn:         summaryFn,
    },
    {
        Name:        "code-review", 
        Description: "代码质量审查",
        Prompt:      "你是代码审查专家...",
        Fn:         reviewFn,
    },
}
```

## 设计要点

1. **可组合**：多个 Skill 可以串联
2. **可测试**：给定输入 → 验证输出
3. **可扩展**：Registry 模式便于新增

## 与 OMO Skills 对比

| | golem | OMO |
|------|------|-----|
| 格式 | Go struct | YAML/Skill 文件 |
| 执行 | Function | Agent + Prompt |
| 场景 | 固定功能 | 灵活工作流 |