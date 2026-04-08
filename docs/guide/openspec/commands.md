# OpenSpec 命令参考

完整的 OpenSpec 命令参考，涵盖核心命令、扩展工作流命令和 CLI 管理命令。所有命令均遵循官方标准格式。

## 命令概览

### 核心命令

核心命令是 OpenSpec 默认提供的命令，安装后即可直接使用。

| 命令 | 说明 | 使用频率 | 学习优先级 |
|------|------|----------|-----------|
| `/opsx:propose` | 创建新功能提案和完整规划文档 | ⭐⭐⭐⭐⭐ | 必须掌握 |
| `/opsx:explore` | 探索和分析问题，不创建变更 | ⭐⭐⭐⭐ | 推荐掌握 |
| `/opsx:apply` | 按照 tasks.md 实现功能 | ⭐⭐⭐⭐⭐ | 必须掌握 |
| `/opsx:archive` | 归档已完成变更 | ⭐⭐⭐⭐ | 重要 |

### 扩展工作流命令

启用扩展命令需要运行 `openspec config profile` 选择 workflows 后执行 `openspec update`。

| 命令 | 说明 | 使用频率 |
|------|------|----------|
| `/opsx:new` | 创建变更脚手架 | ⭐⭐⭐ |
| `/opsx:continue` | 按依赖顺序创建下一个文档 | ⭐⭐⭐ |
| `/opsx:ff` | 快速创建所有规划文档 | ⭐⭐ |
| `/opsx:verify` | 验证实现是否符合规范 | ⭐⭐⭐ |
| `/opsx:sync` | 同步规范与代码状态 | ⭐⭐ |
| `/opsx:onboard` | 引导新成员了解项目 | ⭐ |

### CLI 管理命令

通过终端直接运行的 openspec CLI 命令。

| 命令 | 说明 |
|------|------|
| `openspec init` | 初始化 OpenSpec 项目 |
| `openspec list` | 列出所有活跃变更 |
| `openspec show <name>` | 查看变更详情 |
| `openspec status --change <name>` | 检查文档进度 |
| `openspec validate --all` | 验证所有变更 |
| `openspec archive <name>` | 归档指定变更 |

---

## 核心命令详解

### /opsx:propose

创建新功能提案。执行后 AI 会生成完整的变更文档结构，包括 proposal.md、design.md、specs/ 和 tasks.md。

#### 基本用法

```bash
/opsx:propose "添加用户注册功能"
```

#### 典型示例

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

#### AI 生成的内容

执行命令后，AI 会：

1. **分析你的描述**，理解需求
2. **创建变更目录**：`openspec/changes/<change-name>/`
3. **生成四个文档**：
   - `proposal.md` — 提案说明（为什么做、做什么）
   - `design.md` — 技术设计（怎么做）
   - `specs/` — 详细需求规范
   - `tasks.md` — 实现任务清单
4. **请你确认**，有问题可以修改

#### 审查和修改

AI 生成文档后，你应该：

- 阅读 `proposal.md`，确认目标正确
- 阅读 `specs/`，确认需求完整
- 阅读 `design.md`，确认技术方案合理
- 阅读 `tasks.md`，确认任务清单完整

如有问题，直接告诉 AI：
> "tasks.md 里缺少单元测试的任务"
> "design.md 里的数据库方案改用 PostgreSQL"

---

### /opsx:explore

探索和分析问题，进入思考模式不创建正式变更。适合在确定要做什么之前进行头脑风暴。

#### 基本用法

```bash
/opsx:explore "如何在系统中实现速率限制"
/opsx:explore "评估迁移到微服务架构的可行性"
```

#### 使用场景

- 需求不确定，需要先分析
- 技术方案不明确，需要调研
- 两个方案之间犹豫，需要对比

#### AI 会做什么

1. 分析你的问题背景
2. 研究现有代码和文档
3. 提供多个方案选项
4. 列出每个方案的优缺点
5. 给出建议

---

### /opsx:apply

确认规范后，让 AI 开始按照 tasks.md 实现功能。

#### 基本用法

```bash
/opsx:apply
```

#### AI 执行流程

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

#### 任务范围控制

```bash
# 只实现特定任务
/opsx:apply task 1.1

# 从某个任务开始
/opsx:apply from 1.3

# 只实现某个阶段
/opsx:apply phase 2
```

#### 实现过程中

如果 AI 遇到问题，它会：
- 暂停并询问你
- 提供几个方案让你选择
- 记录问题到 tasks.md

---

### /opsx:archive

功能实现完成后，归档变更记录。

#### 基本用法

```bash
/opsx:archive
```

#### AI 执行流程

1. **检查所有任务**是否完成
2. **更新规范文档**，记录最终实现
3. **移动到归档目录**：
   ```
   openspec/changes/add-user-login/
   → openspec/archive/2025-03-16-add-user-login/
   ```
4. **生成变更摘要**

#### 归档后的目录结构

```
openspec/
├── changes/          # 空了，准备下一个功能
└── archive/
    └── 2025-03-16-add-user-login/
        ├── proposal.md
        ├── specs/
        ├── design.md
        ├── tasks.md
        └── summary.md    # 实现摘要
```

---

## 扩展命令详解

### /opsx:new

创建变更脚手架，生成空的变更目录结构。

```bash
/opsx:new "add-user-login"
```

### /opsx:continue

按依赖顺序创建下一个文档。当某个文档完成后，运行此命令自动创建下一个。

```bash
/opsx:continue
```

### /opsx:ff (Fast Forward)

一次性创建所有规划文档（proposal、design、specs、tasks），跳过逐步创建过程。

```bash
/opsx:ff
```

### /opsx:verify

验证实现是否符合规范。

```bash
/opsx:verify
```

AI 会：
1. 对比 `specs/` 中的需求
2. 检查代码实现
3. 报告差异：
   ```
   ✓ 手机号登录 - 已实现
   ✓ 验证码 5 分钟过期 - 已实现
   ✗ 微信登录 - 未实现（tasks.md 1.4 未完成）
   ⚠ 登录失败次数限制 - 规范要求 5 次，代码实现为 3 次
   ```

### /opsx:sync

同步规范文档与当前代码状态。当手动修改了代码后，使用此命令更新规范。

```bash
/opsx:sync
```

### /opsx:onboard

为新加入的团队成员生成项目概览。

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

> 规范文档是你和 AI 的"合同"
> apply 之前一定要确认规范是你想要的
> 修改规范比修改代码容易得多

### 4. 使用 explore 探索不确定的问题

```bash
# 不确定怎么做，先探索
/opsx:explore "如何实现用户权限系统"
# 确认方案后
/opsx:propose "实现 RBAC 用户权限系统"
```

### 5. 保持上下文干净

```bash
# 开始新功能前，清理 AI 的上下文
# 避免旧对话影响新功能的实现
```

---

## 完整工作流示例

```bash
# 1. 探索问题（可选）
/opsx:explore "评论功能需要哪些核心能力"

# 2. 创建提案
/opsx:propose "添加用户评论功能"

# 3. AI 生成文档后，人工审查确认
# （审查 proposal.md, design.md, specs/, tasks.md）

# 4. 确认后，开始实现
/opsx:apply

# 5. AI 实现过程中，如果需要调整
# "design.md 里的方案需要修改，改用..."

# 6. 实现完成后，验证
/opsx:verify

# 7. 验证通过，归档
/opsx:archive

# 8. 开始下一个功能
/opsx:propose "添加评论点赞功能"
```

---

## 下一步

学习完整的工作流实践：

→ [完整工作流](/guide/openspec/workflow)

→ [实战案例](/guide/openspec/practice)