# 完整工作流

通过实际案例，学习 OpenSpec 从提案到归档的完整工作流。

## 案例：添加用户评论功能

### 背景

你正在开发一个博客系统，需要添加文章评论功能：
- 用户可以发表评论
- 支持回复评论
- 需要分页显示
- 需要权限控制

### Step 1：创建提案

```bash
/opsx:propose "添加用户评论功能，支持发表评论、回复评论、分页显示"
```

AI 生成以下文档：

**proposal.md**
```markdown
## Why
用户反馈希望能对文章进行评论互动，增强社区活跃度。

## What
添加用户评论功能：
1. 用户可以对文章发表评论
2. 支持回复其他评论（二级评论）
3. 评论列表分页显示（每页 20 条）
4. 支持删除自己的评论

## Capabilities
- 评论管理
- 评论显示

## Impact
- 文章模块
- 用户模块
- 数据库（新增 comment 表）
- API 接口

## Non-Goals
- 不支持评论编辑（暂只支持删除重发）
- 不支持评论审核（后续迭代）
- 不支持富文本（纯文本）
```

**design.md**

**数据模型**
```
Comment
├── id: UUID
├── articleId: UUID (外键)
├── authorId: UUID (外键)
├── content: string (max 1000)
├── parentId: UUID? (外键，null 表示顶级评论)
├── createdAt: DateTime
└── deletedAt: DateTime?
```

**API 设计**
```
POST /api/v1/articles/{articleId}/comments
GET /api/v1/articles/{articleId}/comments?page={page}
DELETE /api/v1/comments/{commentId}
```

**权限**
- 任何人可以查看评论
- 登录用户可以发表评论
- 只能删除自己的评论
```

**specs/comment/spec.md**
```markdown
## ADDED Requirements

### Requirement: 用户可以发表评论
用户 SHALL 能够对文章发表评论。

#### Scenario: 成功发表评论
- **GIVEN** 用户已登录
- **WHEN** 用户提交评论内容
- **THEN** 评论被保存
- **AND** 返回评论详情

#### Scenario: 未登录用户发表评论
- **GIVEN** 用户未登录
- **WHEN** 用户提交评论内容
- **THEN** 返回 401 未授权错误
```

**tasks.md**
```markdown
## 1. 数据库
- [ ] 1.1 创建 Comment 表
- [ ] 1.2 添加索引（articleId, createdAt）

## 2. 后端 API
- [ ] 2.1 POST /api/v1/articles/{articleId}/comments
- [ ] 2.2 GET /api/v1/articles/{articleId}/comments
- [ ] 2.3 DELETE /api/v1/comments/{commentId}
- [ ] 2.4 编写单元测试

## 3. 前端
- [ ] 3.1 创建评论组件
- [ ] 3.2 集成到文章页面
- [ ] 3.3 实现分页
```

### Step 2：审查确认

你审查文档后，发现问题：

```
"design.md 里缺少分页的具体实现方案，需要说明：
1. 分页参数（page, limit）
2. 返回格式（列表 + 总数）
3. 排序规则（按时间倒序）"
```

AI 更新 design.md：

```markdown
## 分页设计

### 请求参数
- page: number (default: 1)
- limit: number (default: 20, max: 100)

### 响应格式
```json
{
  "data": [/* 评论列表 */],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### 排序规则
- 顶级评论：按 createdAt 倒序
- 回复评论：按 createdAt 正序（显示在父评论下方）
```

### Step 3：开始实现

确认无误后：

```bash
/opsx:apply
```

AI 开始执行任务：

```
开始实现任务...

✓ 1.1 创建 Comment 表
  生成迁移文件: migrations/20250315_create_comment_table.sql

✓ 1.2 添加索引
  创建复合索引: (articleId, createdAt)

⟳ 2.1 POST /api/v1/articles/{articleId}/comments
  实现中...
  - 验证用户登录
  - 验证文章内容
  - 保存评论
  - 返回结果
```

### Step 4：调整规范

实现到一半，你发现漏了一个需求：

```
"等等，我忘了考虑评论内容的长度限制和敏感词过滤。
需要在 specs/ 中添加这些需求。"
```

更新 spec.md：

```markdown
### Requirement: 评论内容验证
系统 SHALL 验证评论内容的合法性。

#### Scenario: 内容过长
- **WHEN** 用户提交超过 1000 字的评论
- **THEN** 返回 400 错误，提示"评论内容不能超过 1000 字"

#### Scenario: 包含敏感词
- **WHEN** 用户提交包含敏感词的评论
- **THEN** 返回 400 错误，提示"评论内容包含敏感词"
```

让 AI 继续：

```bash
/opsx:apply
```

AI 读取更新后的规范，添加验证逻辑。

### Step 5：验证实现

实现完成后：

```bash
/opsx:verify
```

AI 验证结果：

```
验证结果：

✓ 用户可以发表评论
✓ 支持回复评论
✓ 分页显示
✓ 内容长度验证
✓ 敏感词过滤
✓ 权限控制

✗ 单元测试覆盖率不足（当前 60%，目标 80%）
  tasks.md 2.4 未完成

建议：补充单元测试后再归档
```

### Step 6：补充测试

```bash
/opsx:apply task 2.4
```

AI 补充单元测试：

```
✓ 添加 CommentController 单元测试
✓ 添加 CommentService 单元测试
✓ 添加权限验证测试
✓ 当前测试覆盖率：85%
```

再次验证：

```bash
/opsx:verify
```

```
验证结果：

✓ 所有需求已实现
✓ 测试覆盖率 85%

可以归档！
```

### Step 7：归档

```bash
/opsx:archive
```

AI 执行归档：

```
归档变更：
- 移动 openspec/changes/add-comment-feature/
- 到 openspec/archive/2025-03-16-add-comment-feature/
- 生成 summary.md

归档完成！
```

生成的 `summary.md`：

```markdown
# 变更摘要：添加用户评论功能

## 实现内容
- 用户评论功能（CRUD）
- 支持二级评论（回复）
- 分页显示（每页 20 条）
- 内容验证（长度、敏感词）
- 权限控制

## 技术方案
- 新增 Comment 表
- 3 个 API 接口
- React 评论组件
- 单元测试覆盖率 85%

## 变更文件
- migrations/20250315_create_comment_table.sql
- src/controllers/CommentController.ts
- src/services/CommentService.ts
- src/components/CommentSection.tsx
- tests/comment.test.ts

## 耗时
- 提案阶段：30 分钟
- 实现阶段：2 小时
- 总计：2.5 小时
```

## 时间线回顾

```
T+0:00  /opsx:propose "添加用户评论功能"
       AI 生成文档
       
T+0:30  人工审查，发现问题
       更新 design.md（分页方案）
       
T+0:45  /opsx:apply
       AI 开始实现
       
T+1:30  发现遗漏需求（内容验证）
       更新 spec.md
       
T+1:45  /opsx:apply
       AI 继续实现
       
T+2:30  /opsx:verify
       发现测试不足
       
T+2:45  /opsx:apply task 2.4
       补充测试
       
T+3:00  /opsx:verify
       全部通过
       
T+3:15  /opsx:archive
       归档完成
```

## 关键要点

### 1. 迭代调整是正常的

不是一次就完美，发现遗漏及时更新规范。

### 2. 规范是活的

实现过程中可以修改 proposal、design、specs。

### 3. 验证很重要

/opsx:verify 确保实现符合规范。

### 4. 归档沉淀知识

归档后的记录可供未来参考。

## 常见流程变体

### 变体 1：简单功能

```bash
/opsx:propose "修复登录按钮样式"
/opsx:apply
/opsx:archive
```

简单功能可以跳过复杂审查。

### 变体 2：手动实现部分

```bash
/opsx:propose "添加复杂算法"
/opsx:apply from 2.3  # AI 只实现部分
# 手动实现核心算法
/opsx:continue         # AI 继续剩余任务
/opsx:archive
```

### 变体 3：分阶段实现

```bash
/opsx:propose "添加支付功能"
/opsx:apply phase 1    # 只实现第一阶段（基础功能）
# 测试上线
/opsx:apply phase 2    # 实现第二阶段（高级功能）
/opsx:archive
```

## 下一步

学习如何编写高质量的规范：

→ [编写高质量 Spec](/guide/openspec/writing-specs)
