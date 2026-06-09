## ADDED Requirements

### Requirement: 示例项目必须基于电商场景
使用电商（E-commerce）作为贯穿教程的实战项目，包含商品、购物车、订单等核心业务逻辑。

#### Scenario: 场景一致性
- **WHEN** 用户查看示例项目
- **THEN** 所有示例项目都围绕同一电商场景，便于理解业务逻辑

### Requirement: 示例项目必须提供多语言实现
同一套 OpenSpec 规范驱动至少两套实现：Node.js 和 Python，展示规范驱动的优势。

#### Scenario: 多语言对比
- **WHEN** 用户对比 Node.js 和 Python 实现
- **THEN** 能理解同一规范如何驱动不同语言的实现

### Requirement: 示例项目必须包含完整测试覆盖
每个示例项目必须包含单元测试、集成测试，确保代码质量和可运行性。

#### Scenario: 测试运行
- **WHEN** 用户在示例项目目录运行测试命令
- **THEN** 所有测试通过，证明代码可运行

### Requirement: 示例项目必须包含 OpenSpec 规范文件
每个示例项目必须包含完整的 `openspec/` 目录，展示规范的编写方式。

#### Scenario: 规范查看
- **WHEN** 用户查看示例项目的 openspec/ 目录
- **THEN** 能找到 proposal.md、design.md、specs/、tasks.md 等完整规范文件
