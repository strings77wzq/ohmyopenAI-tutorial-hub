## Why

当前文档站点是 GitHub Pages Project Site 形态，访问路径必须带仓库前缀 `/ohmyopenAI-tutorial-hub/`。这与目标“根域名直达”（`https://strings77wzq.github.io/guide/quickstart`）冲突，导致用户在根域名路径持续 404。需要迁移为 User Site 并将 VitePress 发布基路径切换为根路径。

## What Changes

- 将站点发布形态从 Project Site 迁移为 User Site（仓库名 `strings77wzq.github.io`）
- 将 VitePress `base` 从 `'/ohmyopenAI-tutorial-hub/'` 调整为 `'/'`
- 移除文档与配置中所有硬编码的 `/ohmyopenAI-tutorial-hub/` 资源前缀
- 统一首页与子页面内部链接为根路径可访问形式
- 更新 GitHub 链接与 editLink 指向新的仓库地址
- 验证根域名访问与关键路由（`/guide/quickstart`、`/guide/openspec/commands`）可用

## Capabilities

### New Capabilities

- `root-domain-deployment`: 根域名直达部署能力，定义 User Site 形态下的发布与访问规则

### Modified Capabilities

- `doc-site-config`: 文档站点配置规范，修改 base、资源路径与链接策略以支持根路径部署

## Impact

- 配置文件：`docs/.vitepress/config.ts`
- 首页内容：`docs/index.md`、`docs/en/index.md`
- 可能涉及的文档链接：`docs/**` 中含 `/ohmyopenAI-tutorial-hub/` 的路径
- 部署链路：`.github/workflows/deploy.yml`（校验仍适配 User Site）
- 仓库层面（外部操作）：创建/迁移到 `strings77wzq.github.io` 仓库并开启 Pages
