# Doc I18N Specification

## Purpose

定义中英文文档的国际化规范，确保文档维护的一致性和专业性。

## ADDED Requirements

### Requirement: 专有名词处理规则
文档 SHALL 在中文版本中保持专有名词英文不翻译，包括但不限于：Skills、Harness、OpenSpec、ReAct Loop、Agent、Provider、Token 等。

#### Scenario: 中文文档中的专有名词
- **WHEN** 编写中文文档时遇到技术专有名词
- **THEN** 应保持英文原文，不进行翻译

#### Scenario: 专有名词列表维护
- **WHEN** 需要确定某词是否属于专有名词
- **THEN** 参考官方文档和社区习惯，优先保持英文

### Requirement: 中英文内容同步
文档 SHALL 确保中英文版本内容同步更新，关键变更需同时发布中英文版本。

#### Scenario: 中文内容更新
- **WHEN** 中文文档发生内容更新
- **THEN** 应在合理时间内完成英文版本同步更新

#### Scenario: 新增文档内容
- **WHEN** 创建新的文档页面
- **THEN** 应同时创建中英文两个版本

### Requirement: 格式规范一致性
文档 SHALL 在中英文版本中保持相同的格式规范，包括标题层级、代码块样式、表格格式等。

#### Scenario: 标题层级一致性
- **WHEN** 中文文档使用特定标题层级结构
- **THEN** 英文文档应保持完全相同的层级结构

#### Scenario: 代码示例格式
- **WHEN** 文档包含代码示例
- **THEN** 中英文版本应使用相同的代码高亮和格式样式

---

# Doc OpenSpec Guide Specification

## Purpose

定义 OpenSpec 官方命令参考指南的内容规范，确保命令说明的准确性和完整性。

## ADDED Requirements

### Requirement: 核心命令说明
文档 SHALL 完整记录 OpenSpec 核心命令，包括：propose、explore、apply、archive。

#### Scenario: propose 命令
- **WHEN** 用户需要创建新功能提案
- **THEN** 使用 `/opsx:propose <描述>` 格式，AI 会生成完整的变更文档结构

#### Scenario: explore 命令
- **WHEN** 用户需要探索和分析问题
- **THEN** 使用 `/opsx:explore <主题>` 格式，进入思考模式不创建变更

#### Scenario: apply 命令
- **WHEN** 用户需要执行实现任务
- **THEN** 使用 `/opsx:apply` 格式，AI 开始按照 tasks.md 实现功能

#### Scenario: archive 命令
- **WHEN** 用户需要归档已完成的变更
- **THEN** 使用 `/opsx:archive` 格式，将变更移至 archive 目录

### Requirement: 扩展命令说明
文档 SHALL 记录扩展工作流命令，包括：new、continue、ff、verify、sync、onboard。

#### Scenario: new 命令
- **WHEN** 用户需要创建变更脚手架
- **THEN** 使用 `/opsx:new <变更名>` 格式，创建空白变更目录

#### Scenario: continue 命令
- **WHEN** 用户需要按依赖顺序创建下一个文档
- **THEN** 使用 `/opsx:continue` 格式，AI 根据依赖关系创建下一个文件

#### Scenario: ff 命令
- **WHEN** 用户需要快速创建所有规划文档
- **THEN** 使用 `/opsx:ff` 格式，一次性生成 proposal、design、specs、tasks

#### Scenario: verify 命令
- **WHEN** 用户需要验证实现是否符合规范
- **THEN** 使用 `/opsx:verify` 格式，AI 检查代码与规范的一致性

#### Scenario: sync 命令
- **WHEN** 用户需要同步规范与代码状态
- **THEN** 使用 `/opsx:sync` 格式，更新规范文档反映当前代码状态

#### Scenario: onboard 命令
- **WHEN** 新成员需要了解项目
- **THEN** 使用 `/opsx:onboard` 格式，AI 生成项目概览文档

### Requirement: CLI 命令说明
文档 SHALL 记录 openspec CLI 的管理命令，包括：init、list、show、status、validate、archive。

#### Scenario: init 命令
- **WHEN** 用户需要初始化 OpenSpec
- **THEN** 运行 `openspec init` 创建项目配置

#### Scenario: list 命令
- **WHEN** 用户需要查看活跃变更
- **THEN** 运行 `openspec list` 显示所有未归档的变更

#### Scenario: show 命令
- **WHEN** 用户需要查看变更详情
- **THEN** 运行 `openspec show <变更名>` 显示特定变更的信息

#### Scenario: status 命令
- **WHEN** 用户需要检查变更的文档进度
- **THEN** 运行 `openspec status --change <变更名>` 显示文档完成状态

### Requirement: 命令格式规范
文档 SHALL 使用标准的命令格式示例，包括正确的前缀和语法。

#### Scenario: AI 命令格式
- **WHEN** 记录 AI 聊天界面命令
- **THEN** 使用 `/opsx:<命令>` 格式，不添加额外的中文说明括号

#### Scenario: CLI 命令格式
- **WHEN** 记录终端命令行命令
- **THEN** 使用 `openspec <命令>` 格式

### Requirement: 真实案例说明
文档 SHALL 提供基于真实项目的实战案例，展示完整的 OpenSpec 工作流。

#### Scenario: 案例项目选择
- **WHEN** 需要选择示例项目
- **THEN** 使用作者的真实 Go 项目（如 golem），展示实际工作流

#### Scenario: 案例内容展示
- **WHEN** 展示案例内容
- **THEN** 包含真实的 proposal.md、design.md、specs/、tasks.md 示例