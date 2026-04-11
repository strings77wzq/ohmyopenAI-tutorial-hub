# Proposal: fix-pages-publish-source-and-root-404

## Problem Statement

当前站点部署到 GitHub Pages 后存在两个关键问题：

1. **根路径 404 问题**：访问 `https://strings77wzq.github.io/` 返回 404，需要明确访问 `https://strings77wzq.github.io/ohmyopenAI-tutorial-hub/` 才能显示内容
2. **发布源配置问题**：需要确认 GitHub Actions workflow 是否正确配置以支持根域名部署

根据 README.md 中的站点迁移说明，目标地址是 `https://strings77wzq.github.io`（根域名），但当前配置仍使用 `/ohmyopenAI-tutorial-hub/` 作为 base 路径。

## Goals

1. 修复根路径 `/` 返回 404 的问题，确保访问 `https://strings77wzq.github.io` 能直接显示站点
2. 确保 GitHub Actions workflow 正确配置，能够成功部署到根域名
3. 保持现有 `/ohmyopenAI-tutorial-hub/` 路径的向后兼容性（可选）

## Scope

- 修改 `docs/.vitepress/config.ts` 中的 base 配置
- 检查并更新 `.github/workflows/deploy.yml`（如需要）
- 验证本地构建和预览
- 测试部署后的 URL 访问

## Out of Scope

- 不修改文档内容
- 不添加新功能
- 不改变站点设计

## Risks

- 部署到根域名可能与 GitHub 用户名不匹配（需要确认 repo 名称）
- 现有 `/ohmyopenAI-tutorial-hub/` 链接可能需要重定向或更新