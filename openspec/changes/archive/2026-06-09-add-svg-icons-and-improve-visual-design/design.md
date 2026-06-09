# 设计方案：SVG 图标系统

## 图标设计原则

1. **简洁性**：使用线性图标，2px 描边
2. **一致性**：所有图标风格、大小统一（24x24px）
3. **语义性**：图标含义清晰，与内容匹配
4. **无障碍**：提供 aria-label 和 title

## 图标分类

### 1. 模块图标（首页 Features）

| 模块 | Hero Icon | 自定义 SVG | 用途 |
|------|-----------|------------|------|
| 快速开始 | `bolt` (闪电) | - | 首页第一个 feature |
| Skills | `code` (代码) | - | 技能系统 |
| OpenSpec | `document-text` (文档) | - | 规范驱动 |
| Harness | `beaker` (烧杯) | - | 测试保障 |
| 实战项目 | `rocket` (火箭) | - | 示例项目 |

### 2. 状态图标

| 状态 | Hero Icon | 用途 |
|------|-----------|------|
| 成功 | `check-circle` | 完成标记 |
| 错误 | `x-circle` | 错误标记 |
| 警告 | `exclamation-triangle` | 提示警告 |
| 信息 | `information-circle` | 信息提示 |

### 3. 操作图标

| 操作 | Hero Icon | 用途 |
|------|-----------|------|
| 开始 | `play` | 启动操作 |
| 链接 | `arrow-right` | 链接跳转 |
| 代码 | `code-bracket` | 代码相关 |
| 文档 | `book-open` | 文档链接 |

## SVG 实现方案

### 方案 A：内联 SVG
直接在 Markdown/组件中嵌入 SVG 代码：
```html
<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
</svg>
```

**优点**：
- 无需外部请求
- 可自定义颜色
- 可动画

**缺点**：
- 代码冗长
- 难以统一管理

### 方案 B：SVG Sprite
使用 SVG symbol + use：
```html
<svg class="icon"><use href="#icon-bolt"/></svg>
```

**优点**：
- 代码简洁
- 可缓存
- 易维护

**缺点**：
- 需要构建支持

### 方案 C：CSS 背景
使用 SVG 作为 CSS background-image：
```css
.icon-bolt {
  background-image: url("data:image/svg+xml,...");
}
```

**优点**：
- 完全样式化控制

**缺点**：
- 无法改颜色（除非用 mask）

**选择**：方案 A（内联 SVG）- 简单直接，适合 VitePress

## 颜色方案

使用 VitePress CSS 变量：
```css
.icon {
  color: var(--vp-c-brand-1);
}
.icon-success {
  color: var(--vp-c-green-1);
}
.icon-warning {
  color: var(--vp-c-yellow-1);
}
.icon-danger {
  color: var(--vp-c-red-1);
}
```

## 布局优化

### 首页 Features
```
┌─────────────────────────────────────────┐
│  [⚡图标]                               │
│                                         │
│  快速开始                               │
│  5 分钟内创建你的第一个 AI Skill        │
│                                         │
│  [了解更多 →]                           │
└─────────────────────────────────────────┘
```

### 按钮设计
```
┌─────────────────┐
│ [图标] 快速开始 │
└─────────────────┘
```

### 文档提示框
```
┌─────────────────────────────────────────┐
│ [ℹ️图标] 提示                            │
│ 这里有一些有用的信息...                  │
└─────────────────────────────────────────┘
```

## 实施步骤

1. 创建 icons 目录
2. 收集/设计所有需要的 SVG
3. 创建图标组件/宏
4. 更新首页使用 SVG 图标
5. 更新文档内所有 emoji 为 SVG
6. 添加自定义 CSS 样式
7. 本地测试
8. 提交部署

## Hero Icons 来源

使用 Hero Icons v2（MIT License）：
- 官网：https://heroicons.com
- GitHub：https://github.com/tailwindlabs/heroicons
- 风格：24x24px，2px stroke，线性图标
