## Context

当前站点以 Project Site 部署，地址形态为 `https://strings77wzq.github.io/ohmyopenAI-tutorial-hub/...`。用户目标是根域名直达，要求 `https://strings77wzq.github.io/guide/quickstart` 直接可用。根据 GitHub Pages 官方规则，根域名直达需要 User Site（仓库名必须为 `<owner>.github.io`）。

项目当前还存在两类与旧 base 绑定的配置：

- `docs/.vitepress/config.ts` 中 `base` 与 head/logo 资源路径包含 `/ohmyopenAI-tutorial-hub/`
- `docs/index.md` 与 `docs/en/index.md` 的 hero 图片路径硬编码旧前缀

## Goals / Non-Goals

**Goals:**

- 迁移到 User Site 形态并实现根域名直达
- 将 VitePress 发布路径统一为根路径 `/`
- 消除文档与配置中的旧仓库前缀依赖
- 确保关键页面在根域名路径可访问（特别是 `/guide/quickstart`）

**Non-Goals:**

- 不在本次变更中重写全部文案风格
- 不引入新框架或替换 VitePress
- 不在本仓库内直接执行跨仓库 GitHub 设置变更（以操作清单方式提供）

## Decisions

### Decision 1: 发布形态切换为 User Site

**选择：** 使用 `strings77wzq.github.io` 作为发布仓库承载站点。

**原因：** 只有 User Site 才能天然在 `https://strings77wzq.github.io/*` 根路径提供内容；Project Site 必然带仓库前缀。

**备选方案：** 保持 Project Site 并依赖重定向层。该方案无法满足“根域名路径直接可用”的硬性目标，故拒绝。

### Decision 2: VitePress base 设为 `/`

**选择：** `base: '/'`。

**原因：** root deployment 的标准配置，避免生成带旧仓库前缀的资源 URL。

**备选方案：** 省略 `base`。功能等价但显式性稍差，本次保留显式配置便于审阅。

### Decision 3: 清理硬编码路径

**选择：** 将所有 `/ohmyopenAI-tutorial-hub/...` 资源路径替换为根路径版本（如 `/logo.svg`、`/custom.css`）。

**原因：** 避免在根域名部署下出现资源 404。

### Decision 4: 双阶段迁移

**选择：** 先完成代码与配置可 root 部署，再执行仓库迁移与 Pages 开关。

**原因：** 降低一次性故障面，便于回滚。

## Risks / Trade-offs

- [Risk] 迁移期间出现短时不可用 → [Mitigation] 先在新仓库灰度验证，再切换对外入口
- [Risk] 残留旧前缀链接导致局部 404 → [Mitigation] 全仓 grep 扫描并构建后抽样验收
- [Risk] 用户收藏旧路径失效 → [Mitigation] 在旧仓库 README 与首页给出迁移提示与新入口

## Migration Plan

1. 本仓库完成 root 部署改造（base 与资源路径）
2. 本地构建验收关键页面
3. 新建/迁移到 `strings77wzq.github.io` 仓库并同步代码
4. 在新仓库启用 GitHub Pages（GitHub Actions）
5. 验证根域名关键路由可用
6. 在旧仓库添加迁移说明，降低外部链接断裂影响

## Open Questions

- 旧仓库是否需要长期保留只读迁移说明页面？
- 是否需要保留一个最小化旧路径提示页以减少历史外链损失？
