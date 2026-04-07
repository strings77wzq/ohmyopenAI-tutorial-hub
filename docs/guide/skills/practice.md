# 实战案例：代码审查 Skill

通过一个完整的案例，学习如何从需求到实现构建一个实用的代码审查 Skill。

## 需求分析

### 场景

作为团队的技术负责人，你需要：
1. 审查团队成员提交的代码
2. 确保代码质量和安全性
3. 提供可操作的改进建议
4. 统一团队的代码审查标准

### 痛点

**人工审查的问题**：
- 耗时长（每个 PR 需要 30-60 分钟）
- 标准不统一（不同审查者关注点不同）
- 容易遗漏（人脑会疲劳）
- 知识难沉淀（审查经验无法复用）

**现有工具的问题**：
- 静态分析工具只关注语法
- 无法根据项目上下文调整
- 输出难以理解（太多误报）

### 目标

创建一个 `review-code` Skill，能够：
- 自动分析代码，发现潜在问题
- 根据项目规范调整审查标准
- 提供具体、可操作的改进建议
- 支持多种语言和框架

## 设计 Skill

### Step 1：确定名称和描述

```json
{
  "name": "review-code",
  "description": "审查代码，检查安全漏洞、性能问题和最佳实践，提供具体修复建议"
}
```

### Step 2：设计 Prompt

根据需求，Prompt 需要覆盖：
1. 安全审查
2. 性能审查
3. 代码质量
4. 最佳实践

```
请审查以下代码：

```
{{code}}
```

上下文信息：
- 编程语言：{{language}}
- 框架：{{framework}}
- 项目类型：{{projectType}}

请从以下维度进行审查：

## 1. 安全审查 🔒
检查以下安全问题：
- SQL 注入
- XSS（跨站脚本攻击）
- CSRF（跨站请求伪造）
- 敏感信息泄露
- 不安全的依赖
- 权限控制问题

对于每个安全问题：
- 问题描述
- 风险等级（🔴 高危 / 🟡 中危 / 🟢 低危）
- 修复建议（包含代码示例）

## 2. 性能审查 ⚡
检查以下性能问题：
- 时间复杂度过高
- 不必要的计算
- 内存泄漏
- 资源未释放
- N+1 查询问题
- 阻塞操作

对于每个性能问题：
- 问题描述
- 影响程度
- 优化建议（包含代码示例）

## 3. 代码质量 📐
检查以下代码质量问题：
- 命名规范
- 函数长度（超过 50 行警告）
- 圈复杂度（超过 10 警告）
- 重复代码
- 死代码
- 魔法数字

## 4. 最佳实践 ✅
检查是否符合以下最佳实践：
- 错误处理
- 日志记录
- 输入验证
- 注释规范
- 测试覆盖
- 文档完整

## 5. 总结
- 主要问题列表
- 优先级排序
- 修复建议总结

审查标准：
- 对于明显问题：必须修复
- 对于潜在问题：建议修复
- 对于改进建议：可选
```

### Step 3：设计示例

示例 1：简单的安全问题

```json
{
  "input": "function getUser(id) {\n    const query = \"SELECT * FROM users WHERE id = \" + id;\n    return db.query(query);\n}",
  "output": "## 1. 安全审查 🔒\n\n### 🔴 高危：SQL 注入\n- **位置**：第 2 行\n- **问题**：直接拼接 SQL 语句，存在 SQL 注入风险\n- **风险**：攻击者可以执行任意 SQL 命令，可能导致数据泄露或损坏\n- **修复建议**：\n```javascript\nfunction getUser(id) {\n    const query = \"SELECT * FROM users WHERE id = ?\";\n    return db.query(query, [id]);\n}\n```\n\n## 2. 性能审查 ⚡\n- 无明显性能问题\n\n## 3. 代码质量 📐\n- 函数名清晰\n- 函数长度合适（2 行）\n\n## 4. 最佳实践 ✅\n- ⚠️ 缺少错误处理\n- 建议添加 try-catch 块处理数据库错误\n\n## 5. 总结\n- 🔴 必须修复：SQL 注入\n- 🟡 建议修复：添加错误处理"
}
```

示例 2：性能问题

```json
{
  "input": "function findDuplicates(arr) {\n    const duplicates = [];\n    for (let i = 0; i < arr.length; i++) {\n        for (let j = i + 1; j < arr.length; j++) {\n        if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {\n                duplicates.push(arr[i]);\n            }\n        }\n    }\n    return duplicates;\n}",
  "output": "## 1. 安全审查 🔒\n- 无明显安全问题\n\n## 2. 性能审查 ⚡\n\n### 🔴 严重性能问题\n- **时间复杂度**：O(n³)\n  - 双重循环：O(n²)\n  - includes 检查：O(n)\n  - 总计：O(n³)\n- **问题**：对于大数据集会非常慢\n- **优化建议**：使用 Set 优化\n```javascript\nfunction findDuplicates(arr) {\n    const seen = new Set();\n    const duplicates = new Set();\n    \n    for (const item of arr) {\n        if (seen.has(item)) {\n            duplicates.add(item);\n        } else {\n            seen.add(item);\n        }\n    }\n    \n    return Array.from(duplicates);\n}\n```\n优化后时间复杂度：O(n)\n\n## 3. 代码质量 📐\n- 函数名清晰\n- 变量命名合理\n\n## 4. 最佳实践 ✅\n- ✅ 有返回值\n- ⚠️ 缺少输入验证（检查 arr 是否为数组）\n\n## 5. 总结\n- 🔴 必须修复：性能问题（O(n³) → O(n)）"
}
```

## 完整实现

```json
{
  "name": "review-code",
  "description": "审查代码，检查安全漏洞、性能问题和最佳实践，提供具体修复建议",
  "prompt": "请审查以下代码：\n\n```\n{{code}}\n```\n\n上下文信息：\n- 编程语言：{{language || '未知'}}\n- 框架：{{framework || '未知'}}\n- 项目类型：{{projectType || '通用'}}\n\n请从以下维度进行审查：\n\n## 1. 安全审查 🔒\n检查以下安全问题：\n- SQL 注入（直接拼接 SQL）\n- XSS（未转义的输出）\n- CSRF（缺少防护）\n- 敏感信息泄露（硬编码密钥、密码）\n- 不安全的依赖（已知漏洞的库）\n- 权限控制问题（越权访问）\n\n对于每个发现的问题：\n- 问题描述\n- 风险等级（🔴 高危 / 🟡 中危 / 🟢 低危）\n- 具体位置\n- 修复建议（包含代码示例）\n\n## 2. 性能审查 ⚡\n检查以下性能问题：\n- 时间复杂度过高（如嵌套循环）\n- 空间复杂度过高（如大量内存占用）\n- 不必要的计算\n- 资源未释放（文件、连接等）\n- N+1 查询问题\n- 阻塞操作\n\n对于每个发现的问题：\n- 问题描述\n- 复杂度分析（大 O 表示法）\n- 优化建议（包含代码示例）\n\n## 3. 代码质量 📐\n检查以下代码质量问题：\n- 命名规范（是否清晰、一致）\n- 函数长度（超过 50 行建议拆分）\n- 圈复杂度（超过 10 建议重构）\n- 重复代码（DRY 原则）\n- 死代码（未使用的变量/函数）\n- 魔法数字（应使用常量）\n\n## 4. 最佳实践 ✅\n检查是否符合以下最佳实践：\n- 错误处理（try-catch、错误返回）\n- 日志记录（适当的日志级别）\n- 输入验证（参数检查）\n- 类型安全（类型注解或检查）\n- 注释规范（必要的注释）\n- 测试覆盖（可测试性）\n\n## 5. 总结与建议\n- 主要问题列表（按优先级排序）\n- 必须修复的问题（🔴）\n- 建议修复的问题（🟡）\n- 可选改进（🟢）\n- 整体评价\n\n审查原则：\n- 🔴 必须修复：安全漏洞、严重性能问题、明显错误\n- 🟡 建议修复：代码质量问题、缺少最佳实践\n- 🟢 可选改进：风格问题、轻微优化",
  "examples": [
    {
      "input": "function getUser(id) {\n    const query = \"SELECT * FROM users WHERE id = \" + id;\n    return db.query(query);\n}",
      "output": "## 1. 安全审查 🔒\n\n### 🔴 高危：SQL 注入\n- **位置**：第 2 行\n- **问题**：直接拼接 SQL 语句，存在 SQL 注入风险\n- **风险**：攻击者可以执行任意 SQL 命令\n- **修复**：\n```javascript\nfunction getUser(id) {\n    const query = \"SELECT * FROM users WHERE id = ?\";\n    return db.query(query, [id]);\n}\n```\n\n## 2. 性能审查 ⚡\n- 无明显性能问题\n\n## 3. 代码质量 📐\n- ✅ 函数名清晰\n- ✅ 函数长度合适\n\n## 4. 最佳实践 ✅\n- ⚠️ 缺少错误处理\n- 建议添加 try-catch\n\n## 5. 总结与建议\n- 🔴 必须修复：SQL 注入（安全漏洞）\n- 🟡 建议修复：添加错误处理"
    },
    {
      "input": "function findDuplicates(arr) {\n    const duplicates = [];\n    for (let i = 0; i < arr.length; i++) {\n        for (let j = i + 1; j < arr.length; j++) {\n            if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {\n                duplicates.push(arr[i]);\n            }\n        }\n    }\n    return duplicates;\n}",
      "output": "## 1. 安全审查 🔒\n- ✅ 无明显安全问题\n\n## 2. 性能审查 ⚡\n\n### 🔴 严重性能问题\n- **时间复杂度**：O(n³)\n  - 双重循环：O(n²)\n  - includes 检查：O(n)\n- **优化**：使用 Set\n```javascript\nfunction findDuplicates(arr) {\n    const seen = new Set();\n    const duplicates = new Set();\n    for (const item of arr) {\n        if (seen.has(item)) duplicates.add(item);\n        else seen.add(item);\n    }\n    return Array.from(duplicates);\n}\n```\n优化后：O(n)\n\n## 3. 代码质量 📐\n- ✅ 命名清晰\n\n## 4. 最佳实践 ✅\n- ⚠️ 缺少输入验证\n\n## 5. 总结与建议\n- 🔴 必须修复：性能问题（O(n³) → O(n)）"
    }
  ]
}
```

## 使用示例

### 使用方式

```
用户: /review-code

function processPayment(userId, amount) {
    const user = db.query("SELECT * FROM users WHERE id = " + userId);
    if (user.balance >= amount) {
        db.query("UPDATE users SET balance = balance - " + amount + " WHERE id = " + userId);
        return { success: true };
    }
    return { success: false };
}

语言：JavaScript
框架：Express

AI: ## 1. 安全审查 🔒

### 🔴 高危：SQL 注入（多处）
- **位置**：第 2 行、第 4 行
- **问题**：多处直接拼接 SQL
- **修复**：使用参数化查询

### 🔴 高危：并发问题
- **问题**：没有事务处理，可能出现竞态条件
- **修复**：使用数据库事务

## 2. 性能审查 ⚡
- 无明显性能问题

## 3. 代码质量 📐
- 函数较长（8 行）

## 4. 最佳实践 ✅
- 缺少错误处理
- 缺少日志记录

## 5. 总结
- 🔴 必须修复：SQL 注入、并发问题
- 🟡 建议修复：添加错误处理、日志记录
```

## 效果评估

### 使用前

- 每个 PR 审查时间：30-60 分钟
- 遗漏率：约 20%
- 标准不统一

### 使用后

- 初步审查时间：5-10 分钟（AI 辅助）
- 遗漏率：降低到 5%
- 审查标准统一

### 改进建议

根据实际使用反馈，可以进一步优化：

1. **添加项目特定规则**：根据团队规范定制检查项
2. **学习历史数据**：根据过去的审查记录优化
3. **集成 CI/CD**：在提交前自动审查

## 总结

通过这个实战案例，我们学习了：

1. **需求分析**：明确 Skill 要解决的问题
2. **设计思路**：根据需求设计 Prompt 结构
3. **示例编写**：提供高质量的输入输出示例
4. **迭代优化**：根据实际使用不断改进

## 下一步

学习如何维护和改进 Skill：

→ [最佳实践与常见陷阱](/guide/skills/best-practices)
