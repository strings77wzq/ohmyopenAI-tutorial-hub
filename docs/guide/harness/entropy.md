# Harness 熵管理

熵管理是 Harness 四大护栏之一，解决技术债务和文档腐烂问题。

## 什么是熵？

随时间推移，软件系统会逐渐混乱（熵增）：
- 代码质量下降
- 文档与代码不一致
- 技术债务积累

## 熵管理策略

### 1. 持续小额偿还

不等问题严重时集中处理，而是**持续**处理：

```
每周安排 1 小时技术债务偿还
每次 PR 附带一个小优化
```

OpenAI 称之为"垃圾回收"：
> 技术债务就像高息贷款，越早还越少

### 2. Doc-gardening Agent

后台 Agent 定期扫描文档与代码不一致：

```typescript
// 文档园丁 Agent
async function docGardener() {
  const docs = await scanDocs();
  const code = await scanCode();
  
  for (const doc of docs) {
    if (!matchesCode(doc)) {
      await createFixPR(doc);
    }
  }
}
```

### 3. 定期偏差扫描

```bash
# 后台任务定期扫描
npx ast-grep --pattern 'console.log($MSG)' --fix
```

## 在 OMO 中的应用

OMO 内置熵管理：

| 机制 | 功能 |
|------|------|
| 定期清理 | 后台任务扫描代码偏差 |
| 文档同步 | Doc-gardening Agent |
| 持续改进 | 每次迭代附带优化 |

## 技术债务清单

建议维护一份技术债务清单：

```markdown
## 技术债务清单

- [ ] 低优先级：过时代码清理
- [ ] 中优先级：文档更新
- [ ] 高优先级：安全漏洞修复
```

每次迭代时从清单中选取一项处理。