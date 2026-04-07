# 高级模式

掌握 Skill 的高级用法，创建更强大、更灵活的 AI 技能。

## 1. 条件判断

### 场景

根据输入的不同特征，采用不同的处理方式。

### 实现

在 Prompt 中使用条件语句：

```json
{
  "name": "smart-analyze",
  "description": "智能分析代码，根据复杂度选择不同的分析深度",
  "prompt": "请分析以下代码：\n\n```\n{{code}}\n```\n\n首先评估代码复杂度：\n- 简单（< 10 行）：基础分析\n- 中等（10-50 行）：标准分析\n- 复杂（> 50 行）：深度分析\n\n根据复杂度执行相应的分析：\n\n{{#if complexity === 'simple'}}\n## 基础分析\n1. 功能概述\n2. 输入输出\n{{/if}}\n\n{{#if complexity === 'medium'}}\n## 标准分析\n1. 功能概述\n2. 执行流程\n3. 关键变量\n4. 潜在问题\n{{/if}}\n\n{{#if complexity === 'complex'}}\n## 深度分析\n1. 架构设计\n2. 执行流程（详细）\n3. 数据流\n4. 依赖关系\n5. 性能分析\n6. 安全审查\n7. 重构建议\n{{/if}}",
  "examples": []
}
```

### 实际应用

```json
{
  "name": "adaptive-review",
  "description": "根据 PR 大小自适应审查深度",
  "prompt": "请审查以下 PR：\n\n{{diff}}\n\n统计变更：\n- 文件数：{{fileCount}}\n- 新增行数：{{additions}}\n- 删除行数：{{deletions}}\n\n根据变更规模选择审查深度：\n\n如果 fileCount <= 3 且 additions + deletions <= 50：\n- 执行快速审查\n- 关注：安全问题、明显错误\n\n如果 fileCount <= 10 且 additions + deletions <= 200：\n- 执行标准审查\n- 关注：代码质量、性能、安全、测试\n\n否则：\n- 执行深度审查\n- 关注：架构设计、代码质量、性能、安全、测试、文档\n- 建议分批次审查"
}
```

## 2. 变量使用

### 基础变量

使用 `{{variableName}}` 插入动态内容：

```json
{
  "name": "generate-docs",
  "description": "生成 API 文档",
  "prompt": "请为以下 {{language}} 函数生成文档：\n\n```{{language}}\n{{code}}\n```\n\n要求：\n- 使用 {{documentationStyle}} 风格\n- 语言：{{outputLanguage}}\n- 包含示例：{{includeExamples}}"
}
```

### 变量类型

| 类型 | 示例 | 用途 |
|------|------|------|
| 字符串 | `{{language}}` | 语言、框架名称 |
| 数字 | `{{lineCount}}` | 统计数字 |
| 布尔 | `{{includeExamples}}` | 开关选项 |
| 代码块 | `{{code}}` | 代码内容 |

### 默认值

为变量提供默认值：

```json
{
  "prompt": "请生成 {{language || 'JavaScript'}} 文档"
}
```

如果未提供 `language`，使用默认值 `'JavaScript'`。

### 变量验证

在 Prompt 中添加验证逻辑：

```json
{
  "name": "validate-and-analyze",
  "description": "验证输入后进行分析",
  "prompt": "请分析以下输入：\n\n{{input}}\n\n首先验证输入：\n{{#if !input}}\n错误：输入不能为空\n停止执行\n{{/if}}\n\n{{#if input.length > 10000}}\n警告：输入过长（{{input.length}} 字符），只分析前 5000 字符\n{{/if}}\n\n然后进行分析：\n..."
}
```

## 3. 工具调用链

### 场景

Skill 触发后，AI 需要执行一系列工具调用。

### 实现

```json
{
  "name": "refactor-code",
  "description": "重构代码并创建测试",
  "prompt": "请重构以下代码：\n\n```\n{{code}}\n```\n\n步骤：\n1. 使用 Glob 查找相关文件\n2. 使用 Read 读取文件内容\n3. 分析代码，提出重构方案\n4. 使用 Edit 执行重构\n5. 使用 Write 创建测试文件\n6. 使用 Bash 运行测试\n\n重构原则：\n- 保持功能不变\n- 提高可读性\n- 减少复杂度\n- 添加必要注释"
}
```

### 工具调用模式

#### 模式 1：顺序执行

```
Read → Analyze → Edit → Test
```

#### 模式 2：并行执行

```
       → Analyze → 
Read →               → Edit
       → Lint →
```

#### 模式 3：条件执行

```
Read → Analyze → 
  ├─ 如果需要 → Edit
  └─ 如果安全 → Write
```

## 4. Skill 组合

### 场景

多个 Skill 协同工作，完成复杂任务。

### 实现方式

#### 方式 1：链式调用

```
/generate-code → /review-code → /write-tests
```

#### 方式 2：母 Skill 调用子 Skill

创建母 Skill 协调多个子 Skill：

```json
{
  "name": "full-code-review",
  "description": "完整的代码审查流程",
  "prompt": "请执行完整的代码审查流程：\n\n步骤 1：静态分析\n调用 /analyze-static\n\n步骤 2：代码审查\n调用 /review-code\n\n步骤 3：安全检查\n调用 /check-security\n\n步骤 4：生成报告\n汇总以上结果，生成审查报告"
}
```

#### 方式 3：组合 Skill

将多个 Skill 组合成工作流：

```json
{
  "name": "feature-development",
  "description": "完整的功能开发工作流",
  "prompt": "请协助完成新功能开发：\n\n阶段 1：需求分析（/analyze-requirements）\n- 理解需求\n- 识别风险\n- 估算工作量\n\n阶段 2：技术设计（/design-solution）\n- 架构设计\n- 接口定义\n- 数据模型\n\n阶段 3：代码实现（/generate-code）\n- 实现核心逻辑\n- 添加错误处理\n- 编写注释\n\n阶段 4：代码审查（/review-code）\n- 自审查\n- 修复问题\n\n阶段 5：测试（/write-tests）\n- 单元测试\n- 集成测试\n\n阶段 6：文档（/generate-docs）\n- API 文档\n- 使用说明"
}
```

## 5. 上下文管理

### 场景

Skill 需要访问项目上下文信息。

### 实现

```json
{
  "name": "project-aware-review",
  "description": "基于项目上下文的代码审查",
  "prompt": "请审查以下代码，考虑项目上下文：\n\n代码：\n```\n{{code}}\n```\n\n项目信息：\n- 语言：{{project.language}}\n- 框架：{{project.framework}}\n- 风格指南：{{project.styleGuide}}\n- 架构模式：{{project.architecture}}\n\n审查标准：\n1. 符合项目编码规范\n2. 符合架构设计原则\n3. 与现有代码风格一致\n4. 使用项目推荐的库和模式"
}
```

### 动态加载上下文

```json
{
  "name": "smart-test-writer",
  "description": "根据项目测试框架生成测试",
  "prompt": "请为以下函数生成测试：\n\n```\n{{code}}\n```\n\n首先检测测试框架：\n- 如果存在 jest.config.js → 使用 Jest\n- 如果存在 vitest.config.ts → 使用 Vitest\n- 如果存在 pytest.ini → 使用 Pytest\n\n然后生成对应的测试代码"
}
```

## 6. 错误处理和恢复

### 场景

Skill 执行过程中可能遇到错误。

### 实现

```json
{
  "name": "robust-refactor",
  "description": "健壮的重构 Skill，包含错误处理",
  "prompt": "请重构以下代码：\n\n```\n{{code}}\n```\n\n执行步骤：\n\n1. **备份**\n   使用 Write 创建 .backup 文件\n\n2. **重构**\n   尝试执行重构\n   如果失败：\n   - 记录错误\n   - 从备份恢复\n   - 提供手动重构建议\n\n3. **验证**\n   运行测试验证重构\n   如果测试失败：\n   - 分析失败原因\n   - 修复或回滚\n   - 报告结果\n\n4. **清理**\n   成功后删除备份"
}
```

## 7. 高级示例

### 示例 1：智能代码生成器

```json
{
  "name": "smart-code-generator",
  "description": "根据需求生成代码，自动选择最佳实现",
  "prompt": "请根据以下需求生成代码：\n\n需求：{{requirements}}\n\n上下文：\n- 编程语言：{{language}}\n- 项目类型：{{projectType}}\n- 性能要求：{{performanceRequirements}}\n- 兼容性要求：{{compatibilityRequirements}}\n\n执行流程：\n\n1. **需求分析**\n   - 识别核心功能\n   - 识别边界情况\n   - 估算复杂度\n\n2. **技术选型**\n   - 选择合适的数据结构\n   - 选择合适的算法\n   - 选择合适的库/框架\n\n3. **代码生成**\n   - 实现核心逻辑\n   - 添加错误处理\n   - 添加日志记录\n   - 添加性能优化\n\n4. **代码优化**\n   - 简化复杂逻辑\n   - 提高可读性\n   - 遵循最佳实践\n\n5. **生成测试**\n   - 正常情况测试\n   - 边界情况测试\n   - 异常情况测试\n\n6. **生成文档**\n   - 函数文档\n   - 使用示例\n   - 注意事项\n\n输出格式：\n```{{language}}\n[生成的代码]\n```\n\n## 设计说明\n[解释为什么选择这种实现方式]\n\n## 复杂度分析\n- 时间复杂度：O(?)\n- 空间复杂度：O(?)\n\n## 测试用例\n```{{language}}\n[测试代码]\n```",
  "examples": []
}
```

### 示例 2：自适应学习助手

```json
{
  "name": "adaptive-tutor",
  "description": "根据用户水平自适应调整解释深度",
  "prompt": "请解释以下概念：{{concept}}\n\n用户水平：{{userLevel}}\n\n{{#if userLevel === 'beginner'}}\n使用简单语言，避免术语\n使用类比帮助理解\n提供基础示例\n{{/if}}\n\n{{#if userLevel === 'intermediate'}}\n使用标准术语\n提供技术细节\n提供实际应用场景\n{{/if}}\n\n{{#if userLevel === 'advanced'}}\n深入底层原理\n讨论设计权衡\n提供性能分析\n提及相关研究\n{{/if}}",
  "examples": []
}
```

## 总结

| 高级模式 | 应用场景 | 关键技巧 |
|---------|---------|---------|
| 条件判断 | 不同输入不同处理 | if/else 逻辑 |
| 变量使用 | 动态内容插入 | {{variable}} |
| 工具调用链 | 复杂工作流 | 步骤分解 |
| Skill 组合 | 协同完成大任务 | 母 Skill + 子 Skill |
| 上下文管理 | 项目感知 | 动态检测 |
| 错误处理 | 健壮执行 | try/catch 模式 |

## 下一步

学习如何将这些高级模式应用到实际项目中：

→ [实战案例：代码审查 Skill](/guide/skills/practice)
