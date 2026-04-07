# 贡献指南

感谢你对 AI 编程教程项目的关注！我们欢迎各种形式的贡献。

## 如何贡献

### 1. 报告问题

发现错误或有改进建议？请提交 Issue：

- 描述清晰的问题
- 提供复现步骤
- 标注相关页面

### 2. 改进文档

发现错别字或表述不清？可以直接编辑：

1. 点击页面底部的"在 GitHub 上编辑此页"
2. 修改内容
3. 提交 Pull Request

### 3. 添加内容

想要添加新教程或示例？

1. Fork 本仓库
2. 在合适的目录创建内容
3. 遵循现有的格式和风格
4. 提交 Pull Request

## 内容规范

### 文件结构

```
docs/
├── guide/           # 教程
│   ├── skills/     # Skills 教程
│   ├── openspec/   # OpenSpec 教程
│   └── harness/    # Harness 教程
├── reference/       # 参考文档
├── examples/        # 示例项目
└── en/             # 英文翻译
```

### 写作风格

1. **简洁明了**：避免冗长，直击要点
2. **循序渐进**：从简单到复杂
3. **实例丰富**：每个概念配示例
4. **中文为主**：主要使用简体中文

### Markdown 规范

- 使用 ATX 标题（`#` 而非下划线）
- 代码块标注语言
- 使用表格展示对比信息
- 适当使用 Emoji 增加可读性

## 翻译贡献

### 英文翻译

帮助将内容翻译成英文：

1. 在 `docs/en/` 对应目录创建文件
2. 保持结构一致
3. 注意技术术语的准确翻译

### 其他语言

欢迎翻译成其他语言：

1. 在 `docs/` 下创建语言目录（如 `docs/zh-tw/`）
2. 配置 `docs/.vitepress/config.ts` 中的 i18n
3. 翻译内容

## 开发流程

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/strings77wzq/ai-tutorial-hub.git
cd ai-tutorial-hub

# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev
```

### 构建测试

```bash
# 构建文档
npm run docs:build

# 预览构建结果
npm run docs:preview
```

## 代码审查

提交 PR 后，维护者会：

1. 审查内容准确性
2. 检查格式规范
3. 测试构建是否通过
4. 提供反馈或合并

## 行为准则

- 尊重他人
- 建设性反馈
- 关注内容质量
- 遵守开源协议

## 联系

如有疑问，可以通过以下方式联系：

- GitHub Issues
- Email: [your-email@example.com]

感谢你的贡献！
