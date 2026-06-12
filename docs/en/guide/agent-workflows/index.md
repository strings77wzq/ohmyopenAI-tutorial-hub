# Agent Workflow Orchestration

## Concept

A stable Agent workflow is not about "letting the model solve everything in one shot" — it's about breaking intent, context, tools, and verification into resumable steps. A workflow is the structured sequence of all decisions, operations, and checks an Agent performs between receiving a task and delivering the result.

## Why Do We Need Workflows?

An Agent can read files, write code, and run tests directly. But when tasks grow complex, "ad-hoc execution" hits three critical problems:

```
Typical collapse path of ad-hoc execution:

User: "Add a user authentication module to this project"

Agent's ad-hoc behavior:
  1. Starts writing code immediately (without reading the existing architecture)
  2. Uses a library that doesn't exist in the project (without checking package.json)
  3. Finishes and discovers conflicts with existing routes (without verifying integration)
  4. User asks "What about tests?" → Agent starts adding tests (but the code structure is already wrong)

Result: 3 hours later the code doesn't work, needs a complete rewrite
```

Workflows solve exactly this problem — through **predefined step sequences** and **verification checks at every step**, making Agent behavior predictable, repeatable, and recoverable.

## Workflow vs Ad-Hoc Execution

| Dimension | Ad-Hoc Execution | Workflow |
|-----------|-----------------|----------|
| Path | Uncertain — model decides at each step on the spot | Predefined — steps and order are determined in advance |
| Predictability | Low — the same task may produce different results | High — same inputs produce the same output sequence |
| Error discovery | Late — direction is wrong only after finishing | Early — verification check at every step |
| Recoverability | Poor — after failure, don't know where to restart | Good — each step has clear input/output state |
| Best for | Exploratory tasks, brainstorming | Production tasks, engineering work that must deliver |

Key insight: **Ad-hoc execution is not a "bad" workflow — it's an "unarticulated" workflow.** The model is still making decisions — it's just that those decisions aren't recorded, checked, or reused. The essence of workflow orchestration is making these implicit decisions explicit.

## Core Components of an Agent Workflow

A complete workflow consists of five components:

```
┌─────────────────────────────────────────────────┐
│                  Agent Workflow                   │
├─────────┬─────────┬─────────┬──────────┬────────┤
│  Intent │ Context │  Plan   │ Execute  │ Verify │
├─────────┼─────────┼─────────┼──────────┼────────┤
│ User    │ Project │ Task    │ Tool     │ Tests  │
│ goals   │ files   │ breakdown│ calls   │ Build  │
│ Accept. │ Docs    │ Depends │ Code     │ Links  │
│ criteria│ History │ Priorit.│ changes  │ Visual │
│ Scope   │ API docs│ Risks   │ File ops │        │
└─────────┴─────────┴─────────┴──────────┴────────┘
         │                                        │
         └──── Each step's output is the next step's input ────┘
```

- **Intent**: Clarify what the user wants, what the acceptance criteria are, and what is out of scope. Skipping this step is the most common mistake — the Agent starts working and then realizes it misunderstood the requirements.
- **Context**: Read project files, official documentation, and historical decisions. The Agent is not omniscient; it needs to gather sufficient information at each step to make the right decisions.
- **Plan**: Break large tasks into small, verifiable tasks. A good plan makes every step independently verifiable, so you can restart from the failure point.
- **Execute**: Keep diffs small and follow project conventions. Record status after every step of execution.
- **Verify**: Build, test, link checking, visual inspection. Execution without verification is equivalent to not finishing.

## Orchestration Checklist

When designing any Agent workflow, check each item:

```
[ ] Every step has clear input and output
[ ] Tool calls have permission boundaries (Agent can't access what it doesn't need)
[ ] Failures can be recovered or rolled back (know where to restart)
[ ] Key behaviors have build verification or test checks
[ ] Final report includes evidence, not just "done"
[ ] Dependencies between steps form a DAG (no cycles)
[ ] There are timeout and exit conditions (no infinite loops)
```

## The Core Loop

All Agent workflows boil down to a six-step loop:

1. **Define the goal**: Write down user intent, scope, and acceptance criteria.
2. **Read context**: Prioritize local project files and official documentation, rather than relying on model memory.
3. **Make a plan**: Break into small, verifiable tasks with dependency annotations.
4. **Execute changes**: Keep diffs small and follow project conventions.
5. **Verify results**: Build, test, link checking, visual inspection.
6. **Record status**: Update the task checklist and remaining risks.

This loop can be recursive — each step can expand into a sub-loop. The key is: **every recursion must have a clear verification exit, otherwise the sub-loop will expand indefinitely.**

## How the Tutorial Modules Connect

| Module | Position in the Workflow | Problem It Solves |
|--------|--------------------------|-------------------|
| [Skills](/guide/skills/) | Encapsulate repeatable operations | "We've done this operation before — how to reuse it?" |
| [MCP](/guide/mcp/) | Provide tools, resources, and external context | "Agent needs to read a database or call an external API" |
| [OpenSpec](/guide/openspec/) | Record requirements, designs, and tasks | "Requirements changed — how to track them?" |
| [Harness](/guide/harness/) | Validate behavior, failure modes, and regressions | "How to confirm the Agent did it right?" |
| [Evaluation](/guide/evaluation/) | Decide whether release criteria are met | "When is it ready to ship?" |

## Common Anti-Patterns

### Anti-Pattern 1: Skipping Intent and Going Straight to Execution

```
✗ User: "Add caching"
  Agent immediately starts writing Redis code

✓ User: "Add caching"
  Agent: "What data to cache? In-memory or Redis? What expiration policy?"
  User: "User config, in-memory, 5-minute expiration"
  Agent: Starts execution
```

### Anti-Pattern 2: Declaring Completion Without Verification

```
✗ Agent: "I've added the authentication module"
  → No tests run, no build check

✓ Agent: "I've added the authentication module. Verification results:
  - npm test: 12/12 passed
  - npm run build: success
  - Manual check: login/logout/token refresh all working"
```

### Anti-Pattern 3: Large-Scope Stateless Changes

```
✗ Agent modifies 20 files at once with no checkpoints

✓ Agent runs verification every 3-5 files changed,
  ensuring prior changes are still correct
```

## Practice

Design an Agent workflow for the following task:

Task: "Add a new tutorial module to this documentation site, containing 4 sub-pages"

1. What information needs to be collected in the intent phase?
2. Which files need to be read in the context phase?
3. How do you break down the task in the plan phase? Which parts can run in parallel?
4. What checks need to run in the verification phase?

## Next Step

After understanding the basic structure of workflows, read [Retrieval and Knowledge](/guide/agent-workflows/retrieval) to learn how Agents dynamically acquire and use knowledge within workflows.
