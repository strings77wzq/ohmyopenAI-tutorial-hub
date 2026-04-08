## Why

当前文档网站存在多个影响用户体验和技术专业性的问题：网站图标和 logo 无法显示（base 路径配置错误）、英文版导航出现 404（缺少侧边栏配置和内容文件）、OpenSpec 命令文档格式与官方标准不符、实战案例使用 Node.js/Python 而非作者主攻的 Go 技术栈。这些问题严重影响了文档的专业性和技术影响力展示。现在修复可以确保文档网站正常运行，提升内容质量，更好地展示作者的技术能力。

## What Changes

- **修复 VitePress base 路径问题**：更新 config.ts 和 index.md 中的所有绝对路径，添加 `/ohmyopenAI-tutorial-hub/` 前缀
- **修复图标和资源加载**：修正 favicon、logo、custom.css 的引用路径
- **补全英文侧边栏配置**：添加 `/en/reference/` 和 `/en/examples/` 的 sidebar 配置
- **创建缺失的英文内容文件**：补充 en/reference/ 和 en/examples/ 目录下的所有 markdown 文件
- **重写 OpenSpec 命令文档**：使用官方标准命令格式（`/opsx:propose`、`/opsx:apply` 等），移除中文括号，补充 CLI 命令说明
- **更新实战案例**：使用 golem 项目替代 Node.js/Python 示例，展示真实的 OpenSpec 工作流
- **优化命令表格样式**：使用更专业的技术文档格式
- **统一中英文风格**：确保专有名词（Skills、Harness、OpenSpec 等）保持英文不翻译，中文表达符合专业母语写作者标准

## Capabilities

### New Capabilities

- `doc-i18n`: 国际化文档规范，定义中英文文档的同步维护标准和专有名词处理规则
- `doc-openspec-guide`: OpenSpec 官方命令参考指南，包含核心命令、扩展工作流命令和 CLI 命令的完整说明

### Modified Capabilities

- `doc-site-config`: 文档网站配置规范，修改 VitePress base 路径处理和资源引用规则
- `doc-navigation`: 文档导航规范，修改侧边栏配置以支持完整的中英文导航结构

## Impact

**配置文件修改：**
- `docs/.vitepress/config.ts`：修复 base 路径、添加英文侧边栏配置、修正 GitHub 链接

**中文文档重写：**
- `docs/guide/openspec/commands.md`：重写命令参考，使用官方格式
- `docs/guide/openspec/concepts.md`：更新架构说明，修正命令引用
- `docs/guide/openspec/practice.md`：重写实战案例，使用 golem 项目
- `docs/guide/openspec/workflow.md`：更新工作流示例
- `docs/guide/openspec/writing-specs.md`：更新示例代码
- `docs/guide/openspec/best-practices.md`：更新最佳实践建议
- `docs/index.md`：修复 logo 路径

**英文文档创建：**
- `docs/en/index.md`：修复 logo 路径
- `docs/en/guide/openspec/commands.md`：完整翻译命令参考
- `docs/en/guide/openspec/concepts.md`：完整翻译核心概念
- `docs/en/guide/openspec/practice.md`：完整翻译实战案例
- `docs/en/guide/openspec/workflow.md`：完整翻译工作流
- `docs/en/guide/openspec/writing-specs.md`：完整翻译 Spec 编写指南
- `docs/en/guide/openspec/best-practices.md`：完整翻译最佳实践
- `docs/en/reference/index.md`：创建英文快速参考
- `docs/en/reference/commands.md`：创建英文命令参考
- `docs/en/reference/faq.md`：创建英文 FAQ
- `docs/en/reference/troubleshooting.md`：创建英文故障排除
- `docs/en/examples/index.md`：创建英文示例概述
- `docs/en/examples/ecommerce-nodejs.md`：创建英文 Node.js 示例
- `docs/en/examples/ecommerce-python.md`：创建英文 Python 示例

**示例项目更新：**
- `docs/examples/ecommerce-nodejs.md`：更新为简明示例
- `docs/examples/ecommerce-python.md`：更新为简明示例
