# 需求规格：GitHub Pages 配置修复

## 功能需求

- 在 VitePress 配置中添加 `base` 属性
- 值为 `/ohmyopenAI-tutorial-hub/`，与仓库名一致

## 技术要求

- 配置位置：`docs/.vitepress/config.ts`
- 添加在 `defineConfig` 对象的第一层级
- 不影响其他配置项

## 验收标准

- [ ] `docs/.vitepress/config.ts` 包含 `base` 配置
- [ ] 本地构建成功 (`npm run docs:build`)
- [ ] GitHub Actions 部署成功
- [ ] 站点可正常访问，无 404 错误
