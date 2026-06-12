# Harness Engineering

> **Agent = Harness + LLM**
>
> LLMs provide intelligence. Harnesses provide reliability. Together, they form a production-grade Agent.

## What This Module Teaches

Traditional software engineering has tests, CI/CD, and monitoring — these are quality infrastructure. Agent engineering needs its own quality infrastructure: the **Harness** (test harness).

Without a Harness, you only have a prompt. With a Harness, you have a deployable, regressable, and evolvable Agent system.

This module systematically covers the complete knowledge base of Harness engineering:

### Core Concepts

- [Harness Introduction](/en/guide/harness/intro) — What a Harness is, why you need one, and the design philosophy behind Agent systems
- [Writing Test Scenarios](/en/guide/harness/writing-tests) — How to design reproducible, evaluable test cases
- [Evaluators](/en/guide/harness/evaluators) — Tools that automatically judge the quality of AI output
- [Mock Server](/en/guide/harness/mock-server) — Isolating external dependencies for repeatable tests

### Practice and Advanced Topics

- [Hands-On Practice](/en/guide/harness/practice) — Building a complete Harness test suite from scratch
- [Best Practices](/en/guide/harness/best-practices) — Design principles validated in production environments
- [Feedback Loop](/en/guide/harness/feedback-loop) — Multi-layered validation and continuous improvement mechanisms
- [Entropy Management](/en/guide/harness/entropy) — Combating system degradation and maintaining long-term quality

## Understanding Harness at a Glance

```
┌──────────────────────────────────────────────────────┐
│                  Production Agent System               │
│                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐   │
│  │ Input     │───▶│   LLM    │───▶│   Output     │   │
│  │ Layer     │    │          │    │   Layer      │   │
│  └──────────┘    └──────────┘    └──────────────┘   │
│       │                              │               │
│       ▼                              ▼               │
│  ┌──────────────────────────────────────────┐       │
│  │              Harness Layer                 │       │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐ │       │
│  │  │  Test    │ │Evaluator │ │ Mock      │ │       │
│  │  │Scenarios │ │          │ │ Server    │ │       │
│  │  └─────────┘ └──────────┘ └───────────┘ │       │
│  └──────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────┘
```

A Harness is not an "optional test suite" — it is a core architectural component of an Agent system. Just as you wouldn't deploy code without tests to production, you shouldn't put an Agent into use without a Harness.

## Learning Path

| Phase | What You'll Learn | Estimated Time |
|------|-------------------|---------------|
| **Understanding** | What a Harness is and why Agents need one | 15 minutes |
| **Design** | How to write test scenarios and evaluators | 30 minutes |
| **Isolation** | How to use a Mock Server for repeatable tests | 20 minutes |
| **Practice** | Building a complete Harness test suite from scratch | 45 minutes |
| **Advanced** | Feedback loops, entropy management, production best practices | 30 minutes |

## Core Mindset Shift

Moving from traditional testing to Harness testing requires three fundamental changes in thinking:

| Traditional Testing | Harness Testing |
|--------------------|-----------------|
| Verifying deterministic logic | Verifying probabilistic output |
| Expecting exact matches | Expecting semantic correctness |
| Mocking function return values | Mocking entire AI APIs |
| Binary pass/fail judgment | Continuous quality scoring |

This shift isn't about technical details — it's a fundamental change in mindset: you're no longer asking "did the code do the right thing?" but rather "is the AI's output good enough?"
