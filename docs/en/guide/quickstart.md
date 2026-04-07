# Quick Start

This guide will help you get started with AI programming core concepts in 5 minutes.

## Prerequisites

- Basic programming knowledge (any language)
- Basic understanding of AI programming assistants (e.g., Claude Code, Cursor)
- Node.js 18+ installed (if learning OpenSpec)

## 1. Understand Core Concepts

Before starting, let's quickly understand the three core concepts:

### What is a Skill?

A Skill is a **reusable AI instruction template**. It tells the AI assistant how to complete a specific task, including:

- **name**: Skill name
- **description**: Function description
- **prompt**: Detailed execution instructions
- **examples**: Input/output examples

**One-sentence summary**: Skill = Standardized work manual for AI

### What is OpenSpec?

OpenSpec is a **Spec-Driven Development (SDD)** framework. Core idea:

> Define specifications before writing code. Ensure humans and AI agree on requirements.

**Workflow**:
1. `/opsx:propose` - Create proposal
2. `/opsx:apply` - Apply specifications, AI implements code
3. `/opsx:archive` - Archive completion

### What is Harness?

Harness is a **testing infrastructure** for evaluating AI output quality:

- **Test Scenarios**: Define inputs and expected outputs
- **Evaluators**: Automated evaluation of AI outputs
- **Mock Server**: Test environment without real API calls

## 2. Create Your First Skill

Create a simple code explanation Skill:

```json
{
  "name": "explain-code",
  "description": "Explain how code works with detailed analysis",
  "prompt": "Please explain how the following code works:\n\n1. Overall functionality\n2. Key variables and functions\n3. Execution flow\n4. Potential optimization suggestions\n\nCode:\n{{code}}",
  "examples": [
    {
      "input": "def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)",
      "output": "This is a recursive Fibonacci function implementation..."
    }
  ]
}
```

Save the file as `explain-code.json` in your project's `.skills/` directory.

## 3. Experience OpenSpec Workflow

Install OpenSpec CLI:

```bash
npm install -g @fission-ai/openspec@latest
```

Initialize project:

```bash
cd your-project
openspec init
```

Create your first change:

```bash
/opsx:propose "Add user login feature"
```

AI will generate:
- `proposal.md` - Proposal description
- `design.md` - Technical design
- `specs/` - Detailed requirements
- `tasks.md` - Implementation tasks

After review and confirmation, let AI implement:

```bash
/opsx:apply
```

## 4. Next Steps

Congratulations! You've learned the three core paradigms of AI programming. Next:

- 📖 Deep dive into [Skills Tutorial](/en/guide/skills/what-is-skill)
- 📋 Master [OpenSpec Spec-Driven Development](/en/guide/openspec/concepts)
- 🧪 Learn [Harness Testing Infrastructure](/en/guide/harness/intro)
- 🚀 Practice with [Example Projects](/examples/)

## FAQ

**Q: Which one should I learn first?**

A: Suggested order: Skill → OpenSpec → Harness. Skill is the foundation, OpenSpec is the workflow, Harness is quality assurance.

**Q: Do these tools depend on a specific AI?**

A: No. Skills are a universal format, OpenSpec and Harness are decoupled from specific AI tools. You can use them in any tool that supports these formats.

**Q: Is the learning curve steep?**

A: Getting started is easy! You can create your first Skill in 5 minutes. Going deep requires practice, but there's a clear learning path at every step.
