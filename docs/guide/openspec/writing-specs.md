# 编写高质量 Spec

Spec 是 OpenSpec 的核心，高质量的 Spec 能确保 AI 准确理解需求并正确实现。

## Spec 结构

```markdown
## ADDED Requirements

### Requirement: [需求名称]
[需求描述]

#### Scenario: [场景名称]
- **GIVEN** [前置条件]
- **WHEN** [触发条件]
- **THEN** [期望结果]
- **AND** [附加结果]

## MODIFIED Requirements
[修改现有需求]

## REMOVED Requirements
[移除的需求]
```

## 编写原则

### 1. 明确性（Specific）

**❌ 不好的例子：**
```markdown
### Requirement: 系统应该响应快
系统应该快速响应用户请求。
```

**✅ 好的例子：**
```markdown
### Requirement: API 响应时间符合 SLA
API SHALL 在 200ms 内响应 95% 的请求。

#### Scenario: 正常负载下的响应时间
- **GIVEN** 系统负载 < 80%
- **WHEN** 用户调用 API
- **THEN** 95% 的请求在 200ms 内返回
```

### 2. 可测试性（Testable）

每个需求都应该能写出测试用例。

**❌ 不好的例子：**
```markdown
### Requirement: 用户界面友好
界面应该对用户友好。
```

**✅ 好的例子：**
```markdown
### Requirement: 表单验证即时反馈
用户输入时，系统 SHALL 即时显示验证错误。

#### Scenario: 邮箱格式错误
- **GIVEN** 用户在邮箱输入框输入 "invalid-email"
- **WHEN** 输入框失去焦点
- **THEN** 显示错误提示"请输入有效的邮箱地址"
```

### 3. 原子性（Atomic）

一个需求只做一件事。

**❌ 不好的例子：**
```markdown
### Requirement: 用户管理
用户可以注册、登录、修改资料、删除账号。
```

**✅ 好的例子：**
```markdown
### Requirement: 用户注册
用户 SHALL 能够通过邮箱注册账号。

### Requirement: 用户登录
用户 SHALL 能够通过邮箱和密码登录。

### Requirement: 修改资料
用户 SHALL 能够修改个人资料。

### Requirement: 删除账号
用户 SHALL 能够删除自己的账号。
```

## 场景编写技巧

### 使用 Given-When-Then 格式

```markdown
#### Scenario: 成功登录
- **GIVEN** 用户已注册，邮箱 "user@example.com"，密码 "password123"
- **WHEN** 用户使用邮箱和密码登录
- **THEN** 登录成功
- **AND** 返回用户信息和 Token
- **AND** 记录登录日志
```

### 覆盖边界情况

```markdown
### Requirement: 用户登录

#### Scenario: 成功登录
...

#### Scenario: 密码错误
- **GIVEN** 用户已注册
- **WHEN** 用户使用错误密码登录
- **THEN** 返回 401 错误
- **AND** 提示"邮箱或密码错误"

#### Scenario: 用户不存在
- **GIVEN** 用户未注册
- **WHEN** 用户尝试登录
- **THEN** 返回 401 错误
- **AND** 提示"邮箱或密码错误"（安全考虑，不暴露用户不存在）

#### Scenario: 账号被锁定
- **GIVEN** 用户连续 5 次登录失败，账号被锁定
- **WHEN** 用户尝试登录
- **THEN** 返回 403 错误
- **AND** 提示"账号已锁定，请 30 分钟后重试"
```

## 需求分类

### 功能需求（Functional）

描述系统应该做什么。

```markdown
### Requirement: 搜索功能
用户 SHALL 能够通过关键词搜索文章。

#### Scenario: 关键词搜索
- **GIVEN** 存在标题为 "OpenSpec 教程" 的文章
- **WHEN** 用户搜索 "OpenSpec"
- **THEN** 返回包含该文章的搜索结果
```

### 非功能需求（Non-Functional）

描述系统质量属性。

```markdown
### Requirement: 性能要求
搜索接口 SHALL 在 1 秒内返回结果。

#### Scenario: 搜索结果返回时间
- **GIVEN** 数据库中有 10000 篇文章
- **WHEN** 用户搜索 "教程"
- **THEN** 结果在 1 秒内返回
```

### 安全需求（Security）

```markdown
### Requirement: 密码安全
用户密码 SHALL 使用 bcrypt 算法加密存储。

#### Scenario: 密码存储
- **GIVEN** 用户注册，密码 "password123"
- **WHEN** 系统保存用户数据
- **THEN** 数据库中存储的是 bcrypt 哈希值
- **AND** 不包含明文密码
```

### 可用性需求（Usability）

```markdown
### Requirement: 错误提示
系统错误信息 SHALL 用中文显示，并说明如何解决。

#### Scenario: 网络错误
- **GIVEN** 用户网络断开
- **WHEN** 用户提交表单
- **THEN** 显示"网络连接失败，请检查网络后重试"
```

## 完整示例

### 用户认证模块

```markdown
## ADDED Requirements

### Requirement: 用户注册
系统 SHALL 允许用户通过邮箱注册账号。

#### Scenario: 成功注册
- **GIVEN** 邮箱 "newuser@example.com" 未被注册
- **WHEN** 用户提交注册信息：邮箱 "newuser@example.com"，密码 "Secure123!"
- **THEN** 账号创建成功
- **AND** 发送验证邮件
- **AND** 返回成功提示

#### Scenario: 邮箱已被注册
- **GIVEN** 邮箱 "existing@example.com" 已被注册
- **WHEN** 用户提交相同邮箱注册
- **THEN** 返回 409 错误
- **AND** 提示"该邮箱已被注册"

#### Scenario: 密码强度不足
- **GIVEN** 用户提交注册信息
- **WHEN** 密码少于 8 位或不包含字母数字组合
- **THEN** 返回 400 错误
- **AND** 提示"密码必须至少 8 位，包含字母和数字"

### Requirement: 用户登录
系统 SHALL 允许用户通过邮箱和密码登录。

#### Scenario: 成功登录
- **GIVEN** 用户已注册且密码正确
- **WHEN** 用户提交邮箱和密码
- **THEN** 返回访问 Token
- **AND** Token 有效期为 24 小时

#### Scenario: 登录失败
- **GIVEN** 用户提交错误的邮箱或密码
- **WHEN** 用户尝试登录
- **THEN** 返回 401 错误
- **AND** 提示"邮箱或密码错误"
- **AND** 记录失败次数

### Requirement: 登录失败限制
系统 SHALL 限制连续登录失败次数。

#### Scenario: 超过失败次数
- **GIVEN** 用户连续 5 次登录失败
- **WHEN** 用户第 6 次尝试登录
- **THEN** 返回 403 错误
- **AND** 提示"账号已锁定，请 30 分钟后重试"
- **AND** 发送安全提醒邮件

#### Scenario: 锁定期后登录
- **GIVEN** 用户账号被锁定
- **AND** 30 分钟锁定期已过
- **WHEN** 用户使用正确密码登录
- **THEN** 登录成功
- **AND** 清除失败次数
```

## 常见错误

### 错误 1：需求太抽象

**❌ 不好：**
```markdown
系统应该性能好。
```

**✅ 好：**
```markdown
系统 SHALL 在 1 秒内响应 95% 的请求。
```

### 错误 2：场景缺失

**❌ 不好：**
```markdown
### Requirement: 用户注册
用户可以注册账号。

#### Scenario: 成功注册
...
```

**✅ 好：**
```markdown
### Requirement: 用户注册
用户可以注册账号。

#### Scenario: 成功注册
...

#### Scenario: 邮箱已存在
...

#### Scenario: 密码强度不足
...
```

### 错误 3：使用模糊词汇

避免使用：
- "可能"、"也许"
- "应该"、"尽量"
- "快速"、"友好"
- "大"、"小"

使用具体数值或可验证的描述。

## 检查清单

编写 Spec 后，检查以下事项：

- [ ] 每个需求都有明确的名称
- [ ] 需求使用 SHALL/MUST（不是 should/may）
- [ ] 每个需求至少有一个场景
- [ ] 场景使用 Given-When-Then 格式
- [ ] 覆盖正常、异常、边界情况
- [ ] 包含可验证的验收标准
- [ ] 避免模糊词汇

## 下一步

学习更多实战案例：

→ [OpenSpec 实战案例](/guide/openspec/practice)
