# 回归套件

## 概念

回归套件是一组 evaluator 的集合，它的目标是回答一个问题：**这次变更是否破坏了任何已有功能？**

单个 evaluator 验证一个标准；回归套件验证一个系统。套件的价值不在于"有多少个测试"，而在于"每次运行都能给出一个清晰的 go/no-go 结论"。

## 为什么需要回归套件？

Agent 修改代码时，它的上下文窗口只能看到它正在改的文件。它不知道自己的修改是否破坏了另一个模块的链接、是否让侧边栏出现了死路由、是否让构建时间从 6s 变成 45s。

回归套件是 Agent 的"外部记忆"——它在每次变更后回答 Agent 自己和用户都想知道的问题："一切还正常吗？"

## 套件组织

```
回归套件
├── 快速门禁 (≤ 30s)      ← 每次 commit 前必须通过
│   ├── 链接检查
│   ├── 路由检查
│   └── frontmatter 检查
│
├── 标准门禁 (≤ 5min)      ← 每次 PR 前必须通过
│   ├── npm run docs:build
│   ├── npm test (链接+路由+frontmatter)
│   └── docs:check-stale
│
└── 全量门禁 (≤ 15min)     ← 发布前必须通过
    ├── Lighthouse (perf + a11y)
    ├── 中英文导航完整性
    ├── 移动端手动截图
    └── 暗色模式手动截图
```

### 为什么分层？

- **快速门禁**应该在 Agent 每次 `write_file` 后自动触发。它必须快到不打断 Agent 的工作流（< 30s）。
- **标准门禁**在提交 PR 前跑一次就够了。太频繁会浪费 CI 时间。
- **全量门禁**只需要在发布前跑。它包含人工步骤（手动截图），不可能完全自动化。

## Golden Dataset 管理

回归套件需要固定的测试数据（Golden Set）来保证一致性：

```
project/
├── tests/
│   ├── fixtures/
│   │   ├── valid-links.md        ← 已知所有链接正确的页面
│   │   ├── broken-links.md       ← 已知有 3 个断链的页面
│   │   └── missing-frontmatter.md ← 已知缺少 frontmatter
│   └── golden/
│       ├── expected-routes.json  ← 期望的侧边栏路由快照
│       └── expected-build-meta.json ← 期望的构建元数据（页数、构建时间范围）
```

Golden Dataset 的维护规则：

- **添加**：每次发现新的合法变体时添加（如"带 emoji 的链接"、"跨语言的引用"）
- **更新**：当项目结构变化时更新（如新增一个模块，快照也需更新）
- **删除**：当某个 fixture 不再覆盖任何实际场景时删除

## 检测漂移

回归套件的核心价值是检测"什么时候变差了"：

```
对比维度:
  ├── 链接健康度: 断链数（期望: 0, 告警: >0）
  ├── 构建时间:   秒数（期望: 6-8s, 告警: >15s）
  ├── 页面数量:   页数（期望: 持续增长, 告警: 突然减少）
  ├── 文件大小:   最大 CSS/JS bundle（期望: 稳定, 告警: 增长 > 20%）
  └── 构建警告:   警告数（期望: 0, 告警: >0）
```

漂移不一定意味着回归——可能是正常的项目增长。区分两者的关键是**变化率**：

```
正常: 页面数量从 100 → 103（新增 3 页，符合 PR 描述）
回归: 页面数量从 100 → 97（有 3 页丢失了！）
```

## CI 集成

回归套件必须集成到 CI，不能只靠"Agent 自觉运行"：

```yaml
# .github/workflows/quality.yml
name: Quality Gates
on: [pull_request]

jobs:
  fast-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test  # link + route + frontmatter

  standard-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run docs:build
      - run: npm run docs:check-stale
```

## 示例：本项目 agent-engineering-hub 的实际回归套件

```bash
# 快速门禁 (npm test)
npm run docs:check-links        # AST 解析所有 .md，验证链接
npm run docs:check-routes       # 对比 sidebar config 与实际文件
npm run docs:check-frontmatter  # 检查所有页面有结构化标题

# 标准门禁
npm run docs:build              # VitePress 全量构建
npm run docs:check-stale        # 检查是否有未归档的僵尸 openspec 变更

# 全量门禁（需安装 lighthouse deps）
npm run docs:audit-lighthouse   # 5 个关键页面的 Lighthouse 审计
# + 手动: 移动端截图 × 中英文 × 暗色/亮色
```

## 练习

为这个文档站设计一个新的回归检查："所有 sidebar 中引用的页面在英文版中也存在（至少有一个 index.md 或等效页面）"：

1. 这个检查应该放在哪个门禁层级？
2. 它的实现逻辑是什么？（遍历什么、对比什么）
3. 哪些页面应该被豁免？（仅中文的公告页、WIP 页面）
4. 失败时的输出应该包含什么信息？

## 排错

| 症状 | 可能原因 | 修复 |
|------|----------|------|
| 回归套件每次 PR 都报失败，但实际没问题 | Golden Dataset 过时了 | 更新 fixtures 和快照 |
| 回归套件在本地和 CI 结果不一致 | 环境差异（Node 版本、文件系统大小写） | 锁定 CI 的 Node 版本，检查路径大小写 |
| Agent 从不触发回归套件 | 没有把套件集成到 Agent 的工作流中 | 在 prompt/system message 中加入"每次修改后运行 npm test"的规则 |

## 下一步

回归套件验证"有没有破坏已有功能"——接下来看[发布门禁](./release-gate)，验证"是否准备好发布给真实用户"。
