## ADDED Requirements

### Requirement: Skills 教程必须包含概念入门章节
教程必须解释什么是 Skill、Skill 的作用、Skill 与 Tools 的区别，使用通俗易懂的语言。

#### Scenario: 概念理解
- **WHEN** 初学者阅读概念入门章节
- **THEN** 能回答"Skill 是什么"、"为什么要用 Skill"、"Skill 和 Tool 有什么区别"

### Requirement: Skills 教程必须包含创建第一个 Skill 的手把手教学
提供从零开始创建 Skill 的完整步骤，包括 JSON 结构说明、prompt 编写技巧、examples 编写方法。

#### Scenario: 跟随教程创建 Skill
- **WHEN** 用户按照教程步骤操作
- **THEN** 能成功创建一个可运行的 Skill，并被 AI 正确识别和执行

### Requirement: Skills 教程必须包含高级模式章节
涵盖条件判断、变量使用、工具调用链、Skill 组合等高级主题。

#### Scenario: 高级 Skill 编写
- **WHEN** 开发者需要编写复杂 Skill
- **THEN** 教程提供足够的模式参考和示例代码

### Requirement: Skills 教程必须包含实战案例
至少提供一个完整的实战案例（如代码审查 Skill），展示从需求到实现的完整流程。

#### Scenario: 实战案例跟随
- **WHEN** 用户跟随实战案例
- **THEN** 能复现案例中的 Skill，并理解设计思路

### Requirement: Skills 教程必须包含最佳实践与常见陷阱
总结 Skill 编写过程中的最佳实践、常见错误及解决方案。

#### Scenario: 问题排查
- **WHEN** 用户遇到 Skill 不生效的问题
- **THEN** 能通过最佳实践章节快速定位和解决问题
