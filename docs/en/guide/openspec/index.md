# OpenSpec Tutorial

> Spec-Driven Development (SDD): A specification-driven approach that solves the context loss problem in Vibe Coding.

## What is OpenSpec?

**Spec = Spec-Driven Development**. In the AI era, code generation is no longer the bottleneck. The real challenge is keeping AI aligned with goals throughout long-running tasks.

| Mode | Use Case | Characteristics |
| --- | --- | --- |
| **Vibe Coding** | Quick validation, simple changes | Immediate response, prone to context drift |
| **Plan** | Feature iterations with clear scope | Brief implementation plans, quick alignment |
| **Spec** | Complex system-level tasks | Three-phase documents: spec → tasks → checklist |

### Why Do We Need Spec?

The Vibe Coding dilemma:
- **Lack of global perspective**: AI only makes changes within local context
- **Unstable code quality**: Edge cases are easily overlooked
- **Iteration and technical debt**: No pre-established implementation plan
- **Poor traceability**: Core logic scattered across conversation logs
- **Context loss**: After long conversations, AI starts "hallucinating"

**The core value of Spec**: Provides a maintainable implementation plan that serves as the "anchor" for the entire development process.

## Three-Phase Documents

1. **spec.md** - Project scope: global overview, north star document
2. **tasks.md** - Task breakdown: sequenced implementation plan
3. **checklist.md** - Verification checklist: completeness checks

## Get Started

- [Core Concepts](/guide/openspec/concepts) - Deep dive into the Spec mode
- [Command Reference](/guide/openspec/commands) - /spec and /plan commands
- [Complete Workflow](/guide/openspec/workflow) - From proposal to archive
- [Writing Specs](/guide/openspec/writing-specs) - How to write good specs
- [Practice Examples](/guide/openspec/practice) - Real project examples

## Related Resources

- [OpenSpec GitHub](https://github.com/code-yeongyu/openspec)
- [TRAE Official Documentation](https://trae.ai)
