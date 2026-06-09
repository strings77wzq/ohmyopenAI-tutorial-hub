## Context

当前文档项目是一个基于 VitePress 的 AI 编程教程网站，通过 GitHub Pages 部署（`https://strings77wzq.github.io/ohmyopenAI-tutorial-hub/`）。项目使用中英文双语设计，但存在多个技术问题需要修复。

**当前状态：**
- 文档使用 VitePress 构建，base 配置为 `/ohmyopenAI-tutorial-hub/`
- 中文文档相对完整（约 1400+ 行），英文文档严重缺失（约 51 行）
- OpenSpec 相关文档使用非标准命令格式（`/opsx:propose（创建提案）`）
- 实战案例使用 Node.js/Python，与作者主攻的 Go 技术栈不符
- 资源路径配置错误导致图标无法显示

**约束条件：**
- 必须使用 GitHub Pages 部署，base 路径不可更改
- 必须保持与官方 OpenSpec 文档的命令格式一致
- 专有名词（Skills、Harness、OpenSpec 等）在中文文档中保持英文不翻译
- 中文文档表达需要符合专业母语写作者标准

## Goals / Non-Goals

**Goals:**
1. 修复所有资源路径问题，确保 logo、favicon、css 正常加载
2. 补全英文导航侧边栏配置，消除 404 错误
3. 创建所有缺失的英文内容文件
4. 重写 OpenSpec 命令文档，使用官方标准格式
5. 更新实战案例，使用 golem 项目作为主示例
6. 统一中英文文档风格和专业度

**Non-Goals:**
- 不修改文档网站的整体架构（保持 VitePress）
- 不添加新的功能模块
- 不更改现有的中文内容结构（仅修复和优化）
- 不添加额外的国际化语言（仅中英文）

## Decisions

### Decision 1: 资源路径修复方案

**选择：** 在所有配置和内容文件中使用带 base 前缀的绝对路径

**理由：**
- VitePress 的 `base` 配置只影响构建后的 HTML 资源路径引用
- 直接写在 markdown 文件中的绝对路径（如 logo 图片引用）不会被自动处理
- 必须手动添加 base 前缀确保路径正确

**备选方案考虑：**
- 使用相对路径 → 不适合 VitePress 的 base 配置场景
- 将资源放到 .vitepress/public/ → 需要移动现有文件，可能影响部署

### Decision 2: OpenSpec 命令文档格式

**选择：** 使用官方标准命令格式，移除中文括号说明

**格式示例：**
```bash
/opsx:propose "添加用户登录功能"
/opsx:apply
/opsx:verify
/opsx:archive
```

**理由：**
- 官方 OpenSpec 使用 `/opsx:` 前缀格式
- 中文括号（`（）`）是作者自行添加，非官方格式
- 保持与官方文档一致性，提高专业性

**备选方案考虑：**
- 保留中文括号说明 → 与官方格式不一致，不够专业
- 只使用 CLI 命令（`openspec propose`）→ 失去 AI 编程特色的命令格式

### Decision 3: 实战案例项目选择

**选择：** 使用 golem 项目作为主实战案例

**理由：**
- golem 是作者最成熟的项目，61 个 commits，功能最全面
- 纯 Go 实现，与作者技术栈一致
- 已集成 OpenSpec，有真实的 openspec/ 目录结构
- 云原生架构，展示价值高（Docker/K8s/Helm）

**备选方案考虑：**
- 使用 claude-code-Go → 功能较 golem 少
- 使用 go-flashdb → 较新，stars 为 0
- 使用其他开源项目 → 非作者项目，不能展示个人技术影响力

### Decision 4: 英文文档补全策略

**选择：** 完整翻译中文内容，而非创建简化版

**理由：**
- 当前英文文档只是占位符，无法使用
- 完整翻译可以服务国际读者，提升技术影响力
- 专业文档需要中英文版本质量对等

**备选方案考虑：**
- 保持英文版简化 → 无法服务国际读者
- 只翻译 OpenSpec 相关内容 → 其他内容缺失

### Decision 5: 专有名词处理策略

**选择：** 在中文文档中保持专有名词英文不翻译

**示例：**
- Skills（不翻译为"技能"）
- Harness（不翻译为"测试 Harness"）
- OpenSpec（不翻译为"开放规范"）
- ReAct Loop（保持英文）

**理由：**
- 这些是 AI 编程领域的专有名词
- 翻译后反而造成理解障碍
- 保持英文更符合技术社区习惯

## Risks / Trade-offs

- [Risk] 修复 base 路径可能导致其他隐藏的路径问题 → [Mitigation] 测试所有导航链接和资源加载
- [Risk] 英文文档翻译工作量大，可能影响进度 → [Mitigation] 使用专业翻译工具辅助，分批次完成
- [Risk] golem 项目示例可能过于复杂 → [Mitigation] 提取核心部分作为简化示例
- [Risk] 修改 OpenSpec 命令格式可能影响已有用户习惯 → [Mitigation] 在文档中提供格式说明

## Open Questions

- 是否需要为 golem 项目创建专门的文档示例页面，还是直接在现有 practice.md 中展示？
- 英文文档中的专有名词是否也需要保持英文，还是应该翻译为英文版的专业术语？