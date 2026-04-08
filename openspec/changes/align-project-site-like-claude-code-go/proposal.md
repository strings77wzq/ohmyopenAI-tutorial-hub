## Why

用户目标已明确：不做根域名迁移，直接采用与 `claude-code-Go` 相同的 Project Site 形态（`https://strings77wzq.github.io/<repo>/...`）。当前项目在路径策略、发布产物管理与语言入口组织上存在偏差，导致实现路径反复与体验不一致。

## What Changes

- 回归 Project Site 发布策略，固定使用仓库前缀路径
- 按 `claude-code-Go` 站点形态对齐语言入口（例如 `/zh/`）与导航结构
- 修正 VitePress `base` 与资源路径，确保与仓库名一致
- 清理不应提交的构建产物追踪（`docs/.vitepress/dist`）并稳定仓库状态
- 明确并固化 GitHub Pages 部署流程（Actions + Project Site URL 验收）

## Capabilities

### New Capabilities

- `project-site-parity`: 与参考项目一致的 Project Site 文档发布能力（路径、语言入口、部署行为）

### Modified Capabilities

- `doc-site-config`: 文档站点配置规范，调整 base、资源路径、语言入口与导航路由

## Impact

- `docs/.vitepress/config.ts`
- `docs/index.md` 与 `docs/en/index.md`（语言入口与链接策略）
- `.gitignore` 与 Git 索引状态（dist 追踪清理）
- `.github/workflows/deploy.yml`（部署验收步骤与输出核对）
