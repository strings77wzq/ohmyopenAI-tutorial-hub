## Context

用户已放弃根域名直达方案，明确要求与 `claude-code-Go` 一致：使用 GitHub Pages Project Site 模式，访问地址形态为 `https://strings77wzq.github.io/ohmyopenAI-tutorial-hub/...`（或未来仓库名对应前缀）。

当前问题不在“技术不可行”，而在“目标模式反复切换”导致配置与产物管理偏离：

- `base` 与资源路径在不同方案之间来回变更
- `docs/.vitepress/dist` 被追踪，导致每次构建产生海量噪音
- 语言入口尚未明确对齐到参考站点风格（如 `/zh/`）

## Goals / Non-Goals

**Goals:**

- 锁定 Project Site 模式，停止根域名方案分支
- 完成与参考站点一致的路径与语言入口行为
- 清理构建产物追踪，恢复可维护的 git 状态
- 建立可重复、可验收的 Pages 发布流程

**Non-Goals:**

- 不迁移到 User Site（`strings77wzq.github.io` 仓库）
- 不引入新文档框架
- 不在本次中进行大规模内容重写

## Decisions

### Decision 1: 固定 Project Site 模式

**选择：** 以当前仓库 `ohmyopenAI-tutorial-hub` 为发布主体，URL 使用仓库前缀。

**原因：** 与用户指定参考站点模式一致，避免额外仓库迁移与权限阻塞。

### Decision 2: base 与资源路径统一

**选择：** `base` 固定为 `'/ohmyopenAI-tutorial-hub/'`，所有站点级资源路径跟随该前缀。

**原因：** Project Site 下这是最稳定的发布方式。

### Decision 3: 语言入口对齐

**选择：** 提供 `/zh/` 与 `/en/` 清晰入口（即使内部映射到既有目录结构）。

**原因：** 与参考项目体验一致，降低用户路径心智负担。

### Decision 4: dist 去追踪

**选择：** `docs/.vitepress/dist` 仅作为构建产物，不纳入版本控制。

**原因：** 消除哈希文件导致的巨量噪音，确保 PR 可读性。

## Risks / Trade-offs

- [Risk] 历史链接混用 root 与 project 前缀导致局部 404 → [Mitigation] 全仓扫描并统一链接策略
- [Risk] `/zh/` 路由映射设计不当导致中文入口异常 → [Mitigation] 明确路由映射并做关键路径 smoke test
- [Risk] Pages 缓存导致“已修复但旧页面仍显示” → [Mitigation] 强制刷新 + 等待部署完成后再验收

## Migration Plan

1. 回退并固定为 Project Site 配置（base + 资源路径）
2. 完成语言入口 `/zh/`、`/en/` 的导航与路由对齐
3. 清理 dist 追踪并提交一次性索引变更
4. 构建与预览验证关键路径
5. 推送并等待 Pages 部署完成后做线上验收

## Open Questions

- `/zh/` 是否作为主入口（首页跳转）还是并列入口（首页显示语言选择）？
- 参考项目中的 `/zh/` 信息架构是否需要 1:1 镜像，还是仅对齐访问行为与视觉结构？
