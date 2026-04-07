# 参考

快速参考文档、FAQ 和故障排除指南。

## 快速参考

### Skills 快速参考

```json
{
  "name": "skill-name",
  "description": "Skill 功能描述",
  "prompt": "详细指令...",
  "examples": [
    {"input": "...", "output": "..."}
  ]
}
```

### OpenSpec 快速参考

| 命令 | 用途 |
|------|------|
| `/opsx:propose "描述"` | 创建提案 |
| `/opsx:apply` | 应用实现 |
| `/opsx:archive` | 归档变更 |
| `/opsx:verify` | 验证实现 |

### Harness 快速参考

```javascript
// 定义测试
const test = {
  name: "测试名称",
  input: "输入",
  expected: { contains: ["期望内容"] }
};

// 运行测试
const result = await runTest(test);
```

---

## FAQ

### Skills FAQ

**Q: Skill 和 Tool 有什么区别？**

A: Skill 指导 AI 如何思考，Tool 让 AI 执行操作。Skill = 战术指导，Tool = 执行动作。

**Q: 一个 Skill 可以做多件事吗？**

A: 建议保持单一职责。复杂任务拆分成多个 Skill，通过组合使用。

**Q: Skill 示例越多越好吗？**

A: 不是。2-3 个高质量示例比 10 个低质量示例更有效。

### OpenSpec FAQ

**Q: OpenSpec 适合个人项目吗？**

A: 简单功能可能过度，复杂功能或团队协作时更有价值。

**Q: 规范可以修改吗？**

A: 可以！规范是活的文档，应该随实现演进。

**Q: AI 一定会按规范实现吗？**

A: 不一定。使用 `/opsx:verify` 验证，关键部分人工 Review。

### Harness FAQ

**Q: Harness 和单元测试有什么区别？**

A: Harness 测试 AI 输出质量（非确定性），单元测试测试代码逻辑（确定性）。

**Q: Mock Server 有什么作用？**

A: 模拟 AI API，无需真实调用，节省成本，测试更稳定。

---

## 故障排除

### Skills 常见问题

**问题 1：AI 输出格式不一致**

**原因**：Prompt 格式要求不够明确

**解决**：明确指定输出格式（Markdown 标题、代码块等）

**问题 2：Skill 不生效**

**原因**：文件位置或格式错误

**解决**：
- 检查文件是否在 `.skills/` 目录
- 验证 JSON 格式
- 检查 `name` 是否唯一

### OpenSpec 常见问题

**问题 1：`/opsx:propose` 没有反应**

**解决**：
- 确保在项目根目录
- 检查是否已初始化（`openspec init`）

**问题 2：实现不符合规范**

**解决**：
- 使用 `/opsx:verify` 验证
- 更新规范使其更清晰
- 提供更多示例

### Harness 常见问题

**问题 1：测试总是失败**

**解决**：
- 检查 Evaluator 配置
- 考虑使用语义匹配代替精确匹配
- 增加容错阈值

---

## 资源链接

- [claude-code-Go GitHub](https://github.com/strings77wzq/claude-code-Go)
- [OpenSpec 官方文档](https://openspec.pro)
- [Diátaxis 文档框架](https://diataxis.fr/)
