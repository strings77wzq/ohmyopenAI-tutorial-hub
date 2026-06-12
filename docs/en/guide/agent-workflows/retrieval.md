# Retrieval and Knowledge

## Concept

Retrieval lets an Agent find the most relevant docs, code, and records when needed instead of stuffing all project knowledge into a prompt. This is the "on-demand loading" mechanism in workflows — like a virtual memory system in an OS, only loading the pages currently needed into memory.

## Why Do We Need Retrieval?

A medium-sized project's source code, API docs, tests, and historical decisions can easily reach several megabytes, far exceeding the context window. Without retrieval, an Agent can only use the fragments it "remembers"; with retrieval, it can look up any information it needs at any time.

The essence of retrieval is **injecting the right information, at the right granularity, at the right time, into the Agent's context.**

## RAG Fundamentals

RAG (Retrieval-Augmented Generation) stands for Retrieval-Augmented Generation. The core pipeline:

```
User query → Query rewriting → Index search → Re-ranking → Top-K results → Inject into prompt → Generate answer
```

- **Query rewriting**: The user's original query may not be suitable for direct search. For example, "how is authentication implemented" can be rewritten to "authentication module implementation file paths".
- **Index search**: Match the query against the pre-built document index.
- **Re-ranking**: The search may return 20–50 candidate results; these need to be ranked by relevance to select the Top-K.
- **Inject into prompt**: Insert the ranked results as context into the Agent's prompt.

## Three Retrieval Strategies

### 1. Naive Retrieval

Chunk documents (512 tokens per chunk), build a vector index, and match using cosine similarity.

**Pros**: Simple to implement, broad coverage.
**Cons**: Doesn't understand query intent; may return results that are "semantically similar but practically useless."
**Best for**: Small projects (<50 documents), uniform query patterns.

### 2. Hybrid Retrieval

Combine keyword search (BM25) with vector search (Embedding):

```
Query ─┬─▶ Keyword search (BM25) ───┬─▶ Merge & dedup ──▶ Re-rank ──▶ Top-K
       └─▶ Vector search (Embedding)─┘
```

**Pros**: Keywords match precisely (file names, function names); vectors capture semantics.
**Cons**: Requires maintaining two separate indexes.
**Best for**: Medium projects (50–500 documents), queries with both precise and fuzzy needs.

### 3. Agentic Retrieval

The Agent actively decides when to search, what to search for, and how to validate results:

```
Agent: "I need to understand the routing structure"
  → Search routing-related files
  → Search route configuration in config.ts
  → Evaluate results, filter outdated config
  → Supplement search for middleware route guards
  → Synthesize: routing structure = file routes + middleware guards + config mapping
```

**Pros**: Most flexible — the Agent can adapt its strategy based on intermediate results.
**Cons**: Requires multiple calls; highest cost.
**Best for**: Large projects (>500 documents), complex queries, multi-round reasoning needed.

## Knowledge Injection Patterns

How does retrieved knowledge get injected into the Agent's context? There are three patterns:

### Pattern A: Direct Injection

Concatenate the search results directly into the prompt. Simple and straightforward, but too many results consume prompt space.

### Pattern B: Summarized Injection

Compress the search results into a summary before injection. Saves context space, but the summary may lose details.

### Pattern C: Tool-Based Injection

Don't inject knowledge directly; instead, provide retrieval tools (`search_files`, `read_file`, `search_code`) so the Agent can query on demand. The Agent precisely controls retrieval scope and fetches information as needed, but with higher latency.

**Selection guide**: Few precise results → Direct injection; many results needing compression → Summarized injection; multi-round exploration needed → Tool-based injection.

## When to Retrieve vs When to Cache

```
                    ┌─────────────────┐
                    │  Change frequency│
                    │  High ──── Low   │
                    ├─────────────────┤
         High ──────┤  On-demand       │
   Access  │        │  Fetch each time │
   freq.   │        ├─────────────────┤
           │        │  Cache but       │
           │        │  refresh定期      │
           ├─────────┤─────────────────┤
         Low ───────┤  Fixed injection │
                    │  Load once at    │
                    │  initialization  │
                    └─────────────────┘
```

**Cache in prompt**: Project architecture overview, coding standards, acceptance criteria, fixed API endpoints.
**On-demand retrieval**: Specific file contents, historical decision records, third-party library docs, test results and error logs.

## Retrieval Quality Standards

| Standard | Meaning | Bad Example |
|----------|---------|-------------|
| Relevance | Result directly supports the current problem | Searching "routing" returns "style" files |
| Freshness | Source is not stale | Returns deprecated API documentation |
| Traceability | Can link back to a file, URL, or commit | Gives only a code snippet without file path |
| Compact | Summary is short enough for context | Returns a 5000-token complete file |
| Verifiable | Claims can be confirmed by reading or testing | Search results don't match actual code |

## Relationship to MCP

MCP (Model Context Protocol) can wrap retrieval capabilities as a resource or tool:

- **Resource**: Best for reading stable materials (e.g., project README, architecture docs). The Agent loads these once at workflow start.
- **Tool**: Best for parameterized search, filtering, or aggregation (e.g., searching code, querying logs). The Agent calls these on demand mid-workflow.

Selection guide: **Information is static and needed every time → use a resource; information is dynamic or only needed under specific conditions → use a tool.**

## Practice

Design a retrieval strategy for the tutorial site:

1. Which directories should be indexed? (Which content might an Agent need to query?)
2. How many results should be returned at most? (Too many crowd out context; too few may miss key information)
3. What fields does each result need? (Title, path, summary, last updated?)
4. How do you avoid returning stale pages or 404 links?
5. What information should be cached in the prompt vs retrieved on demand?

## Next Step

After understanding the retrieval mechanisms, read [Orchestration Patterns](/guide/agent-workflows/orchestration-patterns) to learn how to combine retrieval and execution steps into complete workflows.
