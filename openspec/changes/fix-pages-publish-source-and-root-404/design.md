# Design: fix-pages-publish-source-and-root-404

## Solution Overview

将 VitePress 的 base 路径从 `/ohmyopenAI-tutorial-hub/` 改为 `/`（根路径），使站点可直接通过 `https://strings77wzq.github.io` 访问。

## Configuration Changes

### 1. VitePress Config (`docs/.vitepress/config.ts`)

```typescript
// Before
const repoBase = '/ohmyopenAI-tutorial-hub/'

// After
const repoBase = '/'
```

需要更新：
- `base` 配置
- `head` 中的 favicon 和 custom.css 路径
- `themeConfig.logo` 路径
- `themeConfig.socialLinks` 中的 GitHub 链接

### 2. GitHub Actions Workflow (`.github/workflows/deploy.yml`)

当前配置已正确，build 后输出到 `docs/.vitepress/dist`，无需修改。

### 3. Homepages (待验证)

检查 `docs/index.md` 和 `docs/en/index.md` 中的图片路径是否需要调整。

## Implementation Steps

1. 修改 `docs/.vitepress/config.ts` 中的 base 配置
2. 更新所有硬编码的 `/ohmyopenAI-tutorial-hub/` 路径引用
3. 运行 `npm run docs:build` 验证构建
4. 运行 `npm run docs:preview` 本地预览
5. 提交并推送，触发 GitHub Actions 部署

## Backward Compatibility

如需保持旧路径兼容，可考虑：
- 在 `docs/404.md` 中添加重定向逻辑
- 或接受一段时间内旧链接会 404（用户会自然切换到新链接）