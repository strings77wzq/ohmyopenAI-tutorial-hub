# 设计方案：修复 GitHub Pages 404 问题

## 问题诊断

GitHub Pages 项目站点（非用户站点）的 URL 结构为：
```
https://<username>.github.io/<repository-name>/
```

对于本项目：
- 仓库名：`ohmyopenAI-tutorial-hub`
- 期望 URL：`https://strings77wzq.github.io/ohmyopenAI-tutorial-hub/`
- 用户访问的 URL：`https://strings77wzq.github.io/ohmyopenAI-tutorial` (缺少 `-hub`)

## VitePress base 配置

VitePress 需要 `base` 配置来正确处理项目站点的资源路径：

```typescript
export default defineConfig({
  base: '/ohmyopenAI-tutorial-hub/',
  // ...其他配置
})
```

## 修改内容

文件：`docs/.vitepress/config.ts`

修改：在 `defineConfig` 对象中添加 `base` 属性

## 验证步骤

1. 本地构建测试
2. 推送到 GitHub
3. 检查 GitHub Pages 部署状态
4. 验证站点可访问
