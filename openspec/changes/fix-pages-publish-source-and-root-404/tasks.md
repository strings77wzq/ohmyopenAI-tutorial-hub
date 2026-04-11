# Tasks: fix-pages-publish-source-and-root-404

- [x] 1. 修改 `docs/.vitepress/config.ts` 中的 repoBase 从 `/ohmyopenAI-tutorial-hub/` 改为 `/`
- [x] 2. 更新 config.ts 中 head 部分的 favicon 和 custom.css 路径
- [x] 3. 更新 config.ts 中 themeConfig.logo 路径
- [x] 4. 检查并更新 docs/index.md 中的图片路径（logo 和 icons）
- [x] 5. 检查并更新 docs/en/index.md 中的图片路径（如有）
- [x] 6. 运行 `npm run docs:build` 验证构建成功
- [x] 7. 运行 `npm run docs:preview` 本地预览确认
- [x] 8. 提交更改并推送到 GitHub
- [x] 9. 等待 GitHub Actions 部署完成
- [x] 10. 验证线上站点访问（根路径和各主要路径）
- [x] 11. (补充) 用户选择保留 URL，已将 repoBase 恢复为 '/ohmyopenAI-tutorial-hub/' 并修复前端页面显示
