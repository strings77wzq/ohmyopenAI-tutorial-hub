## ADDED Requirements

### Requirement: golem Skill 系统解剖
golem 的 Skill 系统必须展示可复用 Agent 能力单元的设计模式。

#### Scenario: Skill 结构
- **WHEN** 学习者查看 Skill 定义
- **THEN** 看到 Name、Description、Prompt、Function 四个核心组成部分

### Requirement: golem RAG 流程解剖
golem 的 RAG Pipeline 必须展示检索增强的实现模式。

#### Scenario: 索引构建
- **WHEN** 需要建立本地知识库
- **THEN** 使用 TF-IDF 索引和 embedding 相似度搜索

### Requirement: golem MCP 客户端解剖
golem 的 MCP Client 必须展示外部工具协议的连接方式。

#### Scenario: MCP 连接
- **WHEN** 需要接入外部工具能力
- **THEN** 通过 MCP 协议标准接口进行通信

### Requirement: golem 多 Provider 适配
golem 的 Provider 系统必须展示多 LLM 商适配的接口抽象模式。

#### Scenario: Provider 切换
- **WHEN** 需要切换不同 LLM 提供商
- **THEN** 通过统一接口适配器进行切换