# golem RAG Pipeline Deep Dive

golem's RAG Pipeline demonstrates a retrieval-augmented generation implementation pattern.

## RAG Architecture

```
User query
    ↓
[Embedding] Vectorize
    ↓
[TF-IDF Index] Similarity search
    ↓
[Top-K Results] Return context
    ↓
LLM generates answer
```

## Core Code (~200 lines)

```go
type RAG struct {
    index     *TFIDFIndex  // TF-IDF index
    embedder  Embedder     // Vector embedding
    topK      int          // Number of results to return
}

// Build the index
func (r *RAG) Index(docs []string) error {
    r.index = NewTFIDFIndex()
    for i, doc := range docs {
        r.index.Add(doc, i)
    }
    return nil
}

// Query
func (r *RAG) Query(query string, topK int) ([]string, error) {
    // 1. Compute query vector
    queryVec := r.embedder.Embed(query)
    
    // 2. TF-IDF similarity search
    scores := r.index.Score(queryVec)
    
    // 3. Take Top-K
    results := make([]string, 0, topK)
    for i := 0; i < min(topK, len(scores)); i++ {
        results = append(results, r.index.Doc(scores[i].DocID))
    }
    return results, nil
}
```

## Design Highlights

1. **Dual-channel retrieval**: TF-IDF + Embedding.
2. **Extensible**: Supports multiple embedding services.
3. **Local-first**: Uses local index first; falls back on failure.

## Usage

```bash
# Enable RAG
golem agent --rag ./docs

# After indexing the docs directory, you can ask questions about the documentation
```

## Comparison with Traditional RAG

| | Traditional RAG | golem RAG |
|----------|----------|
| Vector database | TF-IDF + Embedding |
| Complex pipelines | Simplified implementation |
| Cloud-first | Local-first |
