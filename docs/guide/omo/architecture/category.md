# Category 路由系统

Category 是 OMO 的域路由系统，根据任务类型自动选择最佳 Agent 配置。

## 内置 Category

| Category | 推荐模型特性 | 适用场景 |
|----------|-------------|---------|
| `visual-engineering` | 图像理解强 | UI/UX、前端 |
| `ultrabrain` | 超强推理 | 复杂逻辑、架构 |
| `artistry` | 创意生成 | 设计方案 |
| `quick` | 低延迟 | 简单修改 |
| `deep` | 深度执行 | 复杂任务 |
| `writing` | 文本生成 | 文档、copy |

## 自定义 Category

在 `oh-my-openagent.jsonc` 中自定义：

```jsonc
{
  "categories": {
    "my-category": {
      "model": "anthropic/claude-sonnet-4-6",
      "skills": ["playwright", "git-master"]
    }
  }
}
```

## 路由决策

```
用户请求
     ↓
[Intent Gate] 意图分类
     ↓
[Category] 匹配最佳配置
     ↓
[Agent] 使用对应模型和 Skills
```