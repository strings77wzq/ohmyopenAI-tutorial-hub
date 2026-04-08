# OpenSpec Best Practices and Common Mistakes

## Best Practices

### 1) Change Names Should Be Narrow and Clear

- ✅ `add-order-checkout`
- ❌ `optimize-system`

The more specific the name, the easier to review and track.

### 2) Proposal Should Be Readable in 2 Minutes

Must answer at least four things:

1. Why (Why do this)
2. What (What to do)
3. Non-Goals (What not to do)
4. Risks (What are the risks)

### 3) Write "Scenarios", Not "Feelings" in Specs

- ✅ Given/When/Then
- ❌ "Page is more friendly" "Experience is better"

Scenarios are testable, enabling stable implementation.

### 4) Tasks Should Be Small and Ordered

Each task should be completable in 30-90 minutes; later tasks should have clear dependencies on earlier tasks.

### 5) Review Specs Before Apply

`/opsx:ff` generates quickly, but always manually review proposal/specs/design/tasks before running `/opsx:apply`.

### 6) Separate Planning and Coding into Different Sessions

Long sessions pollute context. After planning is stable, start a new session for implementation; output quality will be higher.

### 7) Archive When Complete

`/opsx:archive` keeps the `changes/` directory "only containing in-progress changes".

## Common Mistakes

### Mistake 1: One Change Includes Too Many Features

**Symptoms:** Task explosion, difficult review, frequent rework.

**Fix:** Split into multiple changes, split by business flow.

### Mistake 2: Design Written as Implementation Details

**Symptoms:** design.md full of code snippets, but missing reasoning for choices.

**Fix:** Design should write "why we did this way", code details go in implementation phase.

### Mistake 3: Spec and Code Out of Sync

**Symptoms:** Code was changed but docs not updated, subsequent AI continues following old specs.

**Fix:** Run verify + sync specs after each change.

### Mistake 4: Tasks Have No Acceptance Criteria

**Symptoms:** Tasks "look complete" but can't be verified.

**Fix:** Add verifiable outputs to each task (file/API/test result).

## Practical Checklist

- [ ] proposal has Why / What / Non-Goals / Risks
- [ ] specs have at least one scenario per requirement
- [ ] tasks order and dependencies are clear
- [ ] manual review completed before apply
- [ ] verify passes before archive