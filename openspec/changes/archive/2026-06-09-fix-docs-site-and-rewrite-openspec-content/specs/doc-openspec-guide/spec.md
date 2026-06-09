# Doc Site Config Specification

## Purpose

定义文档网站配置规范，确保 VitePress 资源配置的正确性。

## MODIFIED Requirements

### Requirement: VitePress 基础配置
系统 SHALL 配置正确的基础路径和资源引用，确保网站正常加载。

#### Scenario: Base 路径配置
- **WHEN** VitePress 配置 base 为 `/ohmyopenAI-tutorial-hub/`
- **THEN** 所有在配置文件中定义的资源路径必须添加 base 前缀

**原内容：**
```ts
head: [
  ['link', { rel: 'icon', href: '/favicon.svg' }],
  ['link', { rel: 'stylesheet', href: '/custom.css' }],
],
logo: '/logo.svg',
```

**修改为：**
```ts
head: [
  ['link', { rel: 'icon', href: '/ohmyopenAI-tutorial-hub/favicon.svg' }],
  ['link', { rel: 'stylesheet', href: '/ohmyopenAI-tutorial-hub/custom.css' }],
],
logo: '/ohmyopenAI-tutorial-hub/logo.svg',
```

#### Scenario: 内容文件中的图片路径
- **WHEN** 在 markdown 内容文件中引用图片
- **THEN** 必须使用带 base 前缀的绝对路径

### Requirement: 图标和资源文件
系统 SHALL 确保所有图标和样式文件正确放置并可访问。

#### Scenario: 必要资源文件
- **WHEN** 部署文档网站
- **THEN** 确保以下文件存在并可访问：
  - favicon.svg
  - logo.svg
  - custom.css

---

# Doc Navigation Specification

## Purpose

定义文档导航规范，确保中英文导航结构完整。

## MODIFIED Requirements

### Requirement: 侧边栏配置完整性
系统 SHALL 为所有主要导航路径配置侧边栏，包括中文和英文版本。

#### Scenario: 英文侧边栏配置
- **WHEN** 配置英文版侧边栏
- **THEN** 必须包含以下部分：
  - `/en/guide/` - 指南侧边栏
  - `/en/reference/` - 参考侧边栏
  - `/en/examples/` - 示例侧边栏

**原内容（缺失）：**
```ts
'/en/guide/': [/* 有配置 */],
// 缺少 /en/reference/ 和 /en/examples/
```

**修改为：**
```ts
'/en/guide/': [/* 现有配置 */],
'/en/reference/': [
  {
    text: 'Reference',
    items: [
      { text: 'Quick Reference', link: '/en/reference/' },
      { text: 'Commands', link: '/en/reference/commands' },
      { text: 'FAQ', link: '/en/reference/faq' },
      { text: 'Troubleshooting', link: '/en/reference/troubleshooting' },
    ]
  }
],
'/en/examples/': [
  {
    text: 'Example Projects',
    items: [
      { text: 'Overview', link: '/en/examples/' },
      { text: 'E-commerce MVP (Node.js)', link: '/en/examples/ecommerce-nodejs' },
      { text: 'E-commerce MVP (Python)', link: '/en/examples/ecommerce-python' },
    ]
  }
],
```

### Requirement: 英文内容文件存在性
系统 SHALL 确保侧边栏链接的所有英文页面文件都存在。

#### Scenario: 英文页面文件检查
- **WHEN** 侧边栏配置链接到某个页面
- **THEN** 对应的 markdown 文件必须存在，否则会返回 404