# golem RAG 流程解剖

golem 的 RAG Pipeline 展示检索增强的实现模式。

## RAG 架构

```
用户查询
    ↓
[Embedding] 向量化
    ↓
[TF-IDF Index] 相似度搜索
    ↓
[Top-K Results] 返回上下文
    ↓
LLM 生成回答
```

## 核心代码（~200 行）

```go
type RAG struct {
    index     *TFIDFIndex  // TF-IDF 索引
    embedder  Embedder     // 向量嵌入
    topK      int         // 返回结果数
}

// 构建索引
func (r *RAG) Index(docs []string) error {
    r.index = NewTFIDFIndex()
    for i, doc := range docs {
        r.index.Add(doc, i)
    }
    return nil
}

// 检索
func (r *RAG) Query(query string, topK int) ([]string, error) {
    // 1. 计算查询向量
    queryVec := r.embedder.Embed(query)
    
    // 2. TF-IDF 相似度搜索
    scores := r.index.Score(queryVec)
    
    // 3. 取 Top-K
    results := make([]string, 0, topK)
    for i := 0; i < min(topK, len(scores)); i++ {
        results = append(results, r.index.Doc(scores[i].DocID))
    }
    return results, nil
}
```

## 设计要点

1. **双通道检索**：TF-IDF + Embedding
2. **可扩展**：支持多种 Embedding 服务
3. **本地优先**：先用本地索引，失败则回退

## 使用场景

```bash
# 启用 RAG
golem agent --rag ./docs

# 索引 docs 目录后，可以提问关于文档的问题
```

## 与传统 RAG 对比

| | 传统 RAG | golem RAG |
|----------|----------|
| 矢量数据库 | TF-IDF + Embedding |
| 复杂管道 | 简化实现 |
| 云服务优先 | 本地优先 |