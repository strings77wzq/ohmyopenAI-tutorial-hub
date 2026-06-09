# 修复 GitHub Pages 404 问题

## 问题描述

访问 GitHub Pages 站点 `https://strings77wzq.github.io/ohmyopenAI-tutorial` 返回 404 错误。

## 根因分析

1. **URL 不匹配**: 仓库名是 `ohmyopenAI-tutorial-hub`，但用户访问的 URL 缺少 `-hub` 后缀
2. **VitePress 配置缺失**: 缺少 `base` 配置属性，导致 GitHub Pages 项目站点无法正确加载资源

## 解决方案

在 `docs/.vitepress/config.ts` 中添加 `base` 配置，指定 GitHub Pages 项目的 base URL 路径。

## 预期结果

- 站点可以正常访问
- 所有资源（CSS、JS、图片）正确加载
