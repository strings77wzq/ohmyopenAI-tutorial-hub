# Example Projects

Practical example projects demonstrating the complete workflow from specification to code.

## E-commerce MVP Project

Based on the e-commerce scenario from [OpenSpec-practise](https://github.com/ForceInjection/OpenSpec-practise), we provide two implementations:

### Project Overview

A simple e-commerce system including:
- Product management (query, create)
- Shopping cart (add, remove, query)
- Order (create, query)

### Multi-language Implementations

| Language | Framework | Directory |
|---------|-----------|-----------|
| Node.js | Express | `examples/ecommerce-nodejs/` |
| Python | FastAPI | `examples/ecommerce-python/` |

### Spec-Driven

Both implementations share the same OpenSpec specification:

```
openspec/
└── changes/
    └── v1-mvp/
```

Each implementation includes:
- Complete proposal.md
- Technical design
- Detailed specs
- Implementation tasks

## Using These Examples

1. **Understand the workflow**: Read through the specification files to understand how requirements translate to code
2. **Compare implementations**: See how the same spec can be implemented in different languages
3. **Learn by doing**: Create your own implementation following the same pattern

## Project Structure

```
examples/
├── ecommerce-nodejs/
│   ├── openspec/
│   │   └── changes/v1-mvp/
│   ├── src/
│   └── package.json
│
└── ecommerce-python/
    ├── openspec/
    │   └── changes/v1-mvp/
    ├── src/
    └── pyproject.toml
```

## Next Steps

- Explore the Node.js implementation: [E-commerce MVP (Node.js)](./ecommerce-nodejs)
- Explore the Python implementation: [E-commerce MVP (Python)](./ecommerce-python)
- Learn OpenSpec: [OpenSpec Tutorial](/guide/openspec/concepts)