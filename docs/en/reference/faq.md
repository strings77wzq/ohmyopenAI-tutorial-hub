# FAQ

## What is this tutorial about?

It teaches practical AI agent engineering: Skills, MCP, OpenSpec, Harness Engineering, context engineering, retrieval, evaluation, and safe release workflows.

## Where should I start?

Start with [Quick Start](/en/guide/quickstart). It gives you a small working loop before the longer conceptual chapters.

## Why include both OpenSpec and Harness Engineering?

OpenSpec helps define what should be built. Harness Engineering helps prove that the behavior still works after prompts, tools, models, or code change.

## What does MCP add?

MCP gives an agent a structured way to discover tools, resources, prompts, and context from external systems. It is useful when a workflow needs reliable boundaries instead of ad hoc prompt text.

## Do I need every chapter before building?

No. Use the learning map by role. Builders can start with Skills and MCP. Maintainers should add OpenSpec, Harnesses, and evaluation gates early.

## How do I contribute?

Read [Contributing](/en/contributing), run `npm run docs:build`, run `npm run docs:check-links`, and include the learning objective, setup steps, practice task, and troubleshooting notes for new tutorials.

## Why did an old link return 404?

The site previously exposed English reference links before the pages existed. The current workflow includes an internal-link audit so official navigation cannot ship with missing first-party routes.

Next: [Commands](/en/reference/commands) or [Troubleshooting](/en/reference/troubleshooting).
