# Complete Workflow

Learn the complete OpenSpec workflow from proposal to archive through practical cases.

## Case: Add User Comment Feature

### Background

You are developing a blog system and need to add article comment functionality:
- Users can post comments
- Support replying to comments
- Need pagination display
- Need permission control

### Step 1: Create Proposal

```bash
/opsx:propose "Add user comment feature, support posting comments, replying to comments, pagination display"
```

AI generates the following documents:

**proposal.md**
```markdown
## Why
Users feedback they want to interact with articles through comments, enhancing community engagement.

## What
Add user comment feature:
1. Users can comment on articles
2. Support replying to other comments (secondary comments)
3. Comment list with pagination (20 per page)
4. Support deleting own comments

## Capabilities
- Comment management
- Comment display

## Impact
- Article module
- User module
- Database (new comment table)
- API endpoints

## Non-Goals
- Comment editing not supported (currently only delete and re-post)
- Comment moderation not supported (future iteration)
- Rich text not supported (plain text only)
```

### Step 2: Review and Confirm

After AI generates documents, you need to carefully review:

- Read `proposal.md`, confirm goals are correct
- Read `specs/`, confirm requirements are complete
- Read `design.md`, confirm technical approach is reasonable
- Read `tasks.md`, confirm task list is complete

If there are issues, modify directly:
> "Need to add comment edit functionality"
> "Change the database from MySQL to PostgreSQL"

### Step 3: Implementation

```bash
/opsx:apply
```

AI will implement each task in tasks.md in order, and update progress in real-time:

```
✓ 1.1 Create comment table
✓ 1.2 Create comment model
✓ 1.3 Implement comment CRUD API
✓ 1.4 Implement comment list API with pagination
✓ 1.5 Implement comment reply feature
...
```

#### During Implementation

If AI encounters problems, it will:
- Pause and ask you
- Provide options for you to choose
- Record issues in tasks.md

### Step 4: Verification

```bash
/opsx:verify
```

AI will:
1. Compare requirements in specs/
2. Check code implementation
3. Report differences:
   ```
   ✓ Post comments - Implemented
   ✓ Reply to comments - Implemented
   ✓ Pagination - Implemented
   ✓ Delete own comments - Implemented
   ✗ Edit comments - Not implemented (tasks.md 1.6 incomplete)
   ```

If there are discrepancies, tell AI to fix:
> "Edit comments should be implemented, add it to tasks"

### Step 5: Archive

```bash
/opsx:archive
```

After archiving:
- Change moved to `openspec/archive/2025-03-16-add-user-comment/`
- `summary.md` generated with implementation summary

---

## Advanced Usage

### 1. Implement Specific Tasks Only

```bash
# Implement only task 2.4
/opsx:apply task 2.4
```

Useful when you only want AI to implement a specific part.

### 2. Continue from Specific Point

```bash
# Continue from task 1.3
/opsx:apply from 1.3
```

Useful when AI interrupted during implementation and you want to continue.

### 3. Implement Specific Phase Only

```bash
# Only implement phase 1 (basic features)
/opsx:apply phase 1

# After phase 1 complete, implement phase 2
/opsx:apply phase 2
```

Useful for large features that need to be split into phases.

### 4. Continue Remaining Tasks

```bash
# After manual completion of some tasks
/opsx:continue
```

AI will continue with remaining tasks from where it left off.

---

## Workflow Timeline

```
T+0:00  /opsx:propose "Add user comment feature"
       AI generates proposal, design, specs, tasks

T+0:45  /opsx:apply
       AI starts implementing

T+1:45  AI completes phase 1 (basic features)
       You review, found missing requirements

T+2:30  /opsx:verify
       AI verifies implementation

T+2:45  You tell AI: "add edit comment task"
       AI adds task 2.4

T+3:00  /opsx:verify
       All requirements verified

T+3:15  /opsx:archive
       Change archived
```

---

## Key Points

### 1. Review Before Apply

> Before running `/opsx:apply`, always review all generated documents carefully. It's much easier to modify specs than to modify code.

### 2. Verify After Implementation

> Don't assume AI implemented everything correctly. Always run `/opsx:verify` to check.

### 3. Keep Changes Small

> One change should focus on one feature. Don't bundle too many things together.

### 4. Archive Promptly

> After completing a change, archive it promptly to keep the `changes/` directory clean.

---

## Common Workflows

### Feature Development

```bash
/opsx:propose "Add new feature"
# Review documents
/opsx:apply
# Implement
/opsx:verify
/opsx:archive
```

### Bug Fix

```bash
/opsx:propose "Fix specific bug"
/opsx:apply
/opsx:verify
/opsx:archive
```

### Refactoring

```bash
/opsx:propose "Refactor module X"
/opsx:apply from 2.3  # AI only implements from specific task
/opsx:continue        # AI continues remaining tasks
/opsx:archive
```

### Multi-phase Feature

```bash
/opsx:propose "Add complex feature"
/opsx:apply phase 1    # Implement basic features first
# Review and test
/opsx:apply phase 2    # Implement advanced features
/opsx:archive
```

---

## Next Steps

Practice with real projects:

→ [Command Reference](/en/guide/openspec/commands)

→ [Practice Case](/en/guide/openspec/practice)