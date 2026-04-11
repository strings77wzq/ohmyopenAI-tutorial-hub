## Context

参考多个优秀站点的设计特点：
- oh-my-openagent: Hero 大数字 + 流程图 + 用户评价
- oh-my-claudecode: "A weapon not a tool" 标语 + What's New + Magic Keywords 表
- oh-my-codex: 多语言、平台说明、Known Issues、Quick Start
- hermesagent: 神化主题、戏剧性文案、CTA 按钮

## Goals / Non-Goals

**Goals:**
- 更新首页 Hero 区（标语 + 数据）
- 添加 Features 卡片展示（更直观）
- 添加 What's New / Changelog 板块
- 改进导航清晰度

**Non-Goals:**
- 不修改现有文档内容结构
- 不添加新文章（只做美学优化）

## Decisions

### 1. 首页 Hero 更新
保留现有结构，增强视觉：
- 更醒目的主标语
- 增加统计数据（模块数、文章数等）
- 更清晰的 CTA 按钮

### 2. 添加 What's New 板块
参考 oh-my-claudecode 的 What's New 风格：
- 展示最新更新内容
- 形式：版本号 + 更新说明

### 3. Features 卡片改进
参考 ohmyopenagent 的 Bento 网格：
- 更清晰的图标
- 更简洁的文字
- 更直观的链接

### 4. 导航增强
- 明确的学习路径标签
- 清晰模块分组

## Risks / Trade-offs

- [Risk] 样式冲突 → [Mitigation] 使用 VitePress 默认主题的扩展
- [Risk] 内容过多 → [Mitigation] 采用折叠/展开策略