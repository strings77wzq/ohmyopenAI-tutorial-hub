# 故障排除

## 站点构建失败

1. 检查侧边栏链接是否对应文件存在
2. 运行 `npm run docs:build` 查看具体报错

## 页面 404

- 检查 `docs/.vitepress/config.ts` 中 link 是否正确
- 检查 markdown 文件路径与命名

## 语言切换异常

- 检查 `locales` 配置
- 检查 `/en/` 对应页面是否存在
