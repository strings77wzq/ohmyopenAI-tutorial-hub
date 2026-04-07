# OpenSpec 命令参考

完整的 `/opsx:` 命令列表，包含使用说明和示例。

## 命令概览

| 命令 | 说明 | 使用频率 | 学习优先级 |
|------|------|----------|-----------|
| `/opsx:propose` | 创建新功能提案 | ⭐⭐⭐⭐⭐ | 必须 |
| `/opsx:apply` | 应用实现 | ⭐⭐⭐⭐⭐ | 必须 |
| `/opsx:archive` | 归档已完成变更 | ⭐⭐⭐⭐ | 重要 |
| `/opsx:continue` | 继续未完成的实现 | ⭐⭐⭐ | 常用 |
| `/opsx:verify` | 验证实现是否符合规范 | ⭐⭐⭐ | 常用 |
| `/opsx:sync` | 同步规范与代码状态 | ⭐⭐ | 可选 |
| `/opsx:onboard` | 引导新成员了解项目 | ⭐ | 可选 |

---

## /opsx:propose

**最重要的命令**，用于创建新功能提案。

### 基本用法

```bash
/opsx:propose "你想做什么"
```

### 示例

```bash
# 添加新功能
/opsx:propose "添加用户注册功能"

# 修复问题
/opsx:propose "修复登录页面在移动端显示错乱的问题"

# 重构代码
/opsx:propose "重构用户模块，拆分为独立的 service 层"

# 性能优化
/opsx:propose "优化首页加载速度，目标 LCP < 2.5s"
```

### AI 会做什么

执行命令后，AI 会：

1. **分析你的描述**，理解需求
2. **创建变更目录**：`openspec/changes/<change-name>/`
3. **生成四个文档**：
   - `proposal.md` - 提案说明
   - `design.md` - 技术设计
   - `specs/requirements.md` - 详细需求
   - `tasks.md` - 实现任务
4. **请你确认**，有问题可以修改

### 确认和修改

AI 生成文档后，你应该：

```
✓ 阅读 proposal.md，确认目标正确
✓ 阅读 specs/，确认需求完整
✓ 阅读 design.md，确认技术方案合理
✓ 阅读 tasks.md，确认任务清单完整

如有问题，直接告诉 AI：
"tasks.md 里缺少单元测试的任务"
"design.md 里的数据库方案改用 PostgreSQL"
```

---

## /opsx:apply

确认规范后，让 AI 开始实现。

### 基本用法

```bash
/opsx:apply
```

### AI 会做什么

1. **读取 tasks.md**，了解所有任务
2. **按顺序实现**每个任务
3. **实时更新进度**：
   ```
   ✓ 1.1 创建数据库表
   ✓ 1.2 实现 API 接口
   ✓ 1.3 编写单元测试
   ⟳ 1.4 更新文档...
   ```
4. **完成后汇报**结果

### 指定任务范围

```bash
# 只实现特定任务
/opsx:apply task 1.1

# 从某个任务开始
/opsx:apply from 1.3

# 只实现某个阶段
/opsx:apply phase 2
```

### 实现过程中

如果 AI 遇到问题，它会：
- 暂停并询问你
- 提供几个方案让你选择
- 记录问题到 tasks.md

---

## /opsx:archive

功能完成后，归档变更记录。

### 基本用法

```bash
/opsx:archive
```

### AI 会做什么

1. **检查所有任务**是否完成
2. **更新规范文档**，记录最终实现
3. **移动到归档目录**：
   ```
   openspec/changes/add-user-login/
   → openspec/archive/2025-03-16-add-user-login/
   ```
4. **生成变更摘要**

### 归档后的目录结构

```
openspec/
├── changes/          # 空了，准备下一个功能
└── archive/
    └── 2025-03-16-add-user-login/
        ├── proposal.md
        ├── specs/
        ├── design.md
        ├── tasks.md
        └── summary.md    # 新增：实现摘要
```

---

## /opsx:continue

当实现中断后，继续未完成的任务。

### 使用场景

- 上次 AI 实现到一半，需要继续
- 手动完成了部分任务，让 AI 继续剩余的

### 基本用法

```bash
/opsx:continue
```

AI 会：

1. 读取 tasks.md，找到未完成的任务
2. 从上次中断的地方继续

---

## /opsx:verify

验证实现是否符合规范。

### 基本用法

```bash
/opsx:verify
```

AI 会：

1. 对比 specs/ 中的需求
2. 检查代码实现
3. 报告差异：
   ```
   ✓ 手机号登录 - 已实现
   ✓ 验证码 5 分钟过期 - 已实现
   ✗ 微信登录 - 未实现（tasks.md 1.4 未完成）
   ⚠ 登录失败次数限制 - 规范要求 5 次，代码实现为 3 次
   ```

---

## /opsx:sync

同步规范文档与当前代码状态。

### 使用场景

- 手动修改了代码，需要更新规范
- 规范文档与代码出现了偏差

### 基本用法

```bash
/opsx:sync
```

---

## /opsx:onboard

为新加入的团队成员生成项目概览。

### 基本用法

```bash
/opsx:onboard
```

AI 会生成：

- 项目背景介绍
- 已完成的功能列表（来自 archive/）
- 正在进行的功能（来自 changes/）
- 技术栈和架构说明

---

## 命令使用技巧

### 1. 描述要具体

```bash
# ❌ 太模糊
/opsx:propose "改进用户体验"

# ✅ 具体明确
/opsx:propose "在用户注册流程中添加邮箱验证步骤，用户注册后需要点击邮件中的链接才能激活账号"
```

### 2. 一次只做一件事

```bash
# ❌ 太多了
/opsx:propose "添加登录、注册、找回密码、修改密码、绑定手机号功能"

# ✅ 拆分成多个变更
/opsx:propose "添加用户登录功能"
# 完成后
/opsx:propose "添加用户注册功能"
# 完成后
/opsx:propose "添加找回密码功能"
```

### 3. 在 apply 前仔细审查规范

```
规范文档是你和 AI 的"合同"
apply 之前一定要确认规范是你想要的
修改规范比修改代码容易得多
```

### 4. 保持上下文干净

```bash
# 开始新功能前，清理 AI 的上下文
# 避免旧对话影响新功能的实现
```

---

## 完整工作流示例

```bash
# 1. 创建提案
/opsx:propose "添加用户评论功能"

# 2. AI 生成文档后，人工审查确认
# （审查 proposal.md, design.md, specs/, tasks.md）

# 3. 确认后，开始实现
/opsx:apply

# 4. AI 实现过程中，如果需要调整
# "design.md 里的方案需要修改，改用..."

# 5. 实现完成后，验证
/opsx:verify

# 6. 验证通过，归档
/opsx:archive

# 7. 开始下一个功能
/opsx:propose "添加评论点赞功能"
```

---

## 下一步

学习完整的工作流实践：

→ [完整工作流](/guide/openspec/workflow)
