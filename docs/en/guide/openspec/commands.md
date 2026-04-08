# OpenSpec Command Reference

Complete OpenSpec command reference covering core commands, extended workflow commands, and CLI management commands. All commands follow the official standard format.

## Command Overview

### Core Commands

Core commands are available by default after installing OpenSpec.

| Command | Description | Frequency | Priority |
|---------|-------------|-----------|----------|
| `/opsx:propose` | Create new feature proposal with complete planning documents | ⭐⭐⭐⭐⭐ | Required |
| `/opsx:explore` | Explore and analyze problems without creating changes | ⭐⭐⭐⭐ | Recommended |
| `/opsx:apply` | Implement features according to tasks.md | ⭐⭐⭐⭐⭐ | Required |
| `/opsx:archive` | Archive completed changes | ⭐⭐⭐⭐ | Important |

### Extended Workflow Commands

Extended commands require running `openspec config profile` to select workflows, then `openspec update`.

| Command | Description | Frequency |
|---------|-------------|----------|
| `/opsx:new` | Create change scaffold | ⭐⭐⭐ |
| `/opsx:continue` | Create next document in dependency order | ⭐⭐⭐ |
| `/opsx:ff` | Fast-forward: create all planning documents at once | ⭐⭐ |
| `/opsx:verify` | Validate implementation against specs | ⭐⭐⭐ |
| `/opsx:sync` | Sync specs with code state | ⭐⭐ |
| `/opsx:onboard` | Onboard new team members | ⭐ |

### CLI Management Commands

OpenSpec CLI commands run directly in the terminal.

| Command | Description |
|---------|-------------|
| `openspec init` | Initialize OpenSpec project |
| `openspec list` | List all active changes |
| `openspec show <name>` | View change details |
| `openspec status --change <name>` | Check document progress |
| `openspec validate --all` | Validate all changes |
| `openspec archive <name>` | Archive specified change |

---

## Core Commands Details

### /opsx:propose

Create a new feature proposal. After execution, AI generates a complete change document structure including proposal.md, design.md, specs/, and tasks.md.

#### Basic Usage

```bash
/opsx:propose "Add user registration feature"
```

#### Typical Examples

```bash
# Add new feature
/opsx:propose "Add user registration feature"

# Fix bug
/opsx:propose "Fix login page display issues on mobile devices"

# Refactor code
/opsx:propose "Refactor user module, split into independent service layer"

# Performance optimization
/opsx:propose "Optimize homepage loading speed, target LCP < 2.5s"
```

#### What AI Does

After executing the command, AI will:

1. **Analyze your description**, understand requirements
2. **Create change directory**: `openspec/changes/<change-name>/`
3. **Generate four documents**:
   - `proposal.md` — Proposal explanation (why and what)
   - `design.md` — Technical design (how)
   - `specs/` — Detailed requirement specifications
   - `tasks.md` — Implementation task checklist
4. **Ask for confirmation**, you can make changes if needed

#### Review and Modification

After AI generates documents, you should:

- Read `proposal.md`, confirm goals are correct
- Read `specs/`, confirm requirements are complete
- Read `design.md`, confirm technical approach is reasonable
- Read `tasks.md`, confirm task list is complete

If there are issues, tell AI directly:
> "tasks.md is missing unit test tasks"
> "Change the database solution in design.md to PostgreSQL"

---

### /opsx:explore

Explore and analyze problems, enter thinking mode without creating formal changes. Suitable for brainstorming before determining what to do.

#### Basic Usage

```bash
/opsx:explore "How to implement rate limiting in the system"
/opsx:explore "Evaluate feasibility of migrating to microservices architecture"
```

#### Use Cases

- Requirements are uncertain, need analysis first
- Technical approach is unclear, need research
- Torn between two options, need comparison

#### What AI Does

1. Analyze your problem background
2. Research existing code and documentation
3. Provide multiple solution options
4. List pros and cons of each option
5. Give recommendations

---

### /opsx:apply

After confirming the specification, let AI start implementing features according to tasks.md.

#### Basic Usage

```bash
/opsx:apply
```

#### AI Execution Flow

1. **Read tasks.md**, understand all tasks
2. **Implement each task** in order
3. **Update progress in real-time**:
   ```
   ✓ 1.1 Create database table
   ✓ 1.2 Implement API endpoint
   ✓ 1.3 Write unit tests
   ⟳ 1.4 Update documentation...
   ```
4. **Report results** when complete

#### Task Scope Control

```bash
# Implement only specific task
/opsx:apply task 1.1

# Start from a specific task
/opsx:apply from 1.3

# Implement only a specific phase
/opsx:apply phase 2
```

#### During Implementation

If AI encounters problems, it will:
- Pause and ask you
- Provide several options for you to choose
- Record issues in tasks.md

---

### /opsx:archive

After feature implementation is complete, archive the change records.

#### Basic Usage

```bash
/opsx:archive
```

#### AI Execution Flow

1. **Check if all tasks** are complete
2. **Update specification documents**, record final implementation
3. **Move to archive directory**:
   ```
   openspec/changes/add-user-login/
   → openspec/archive/2025-03-16-add-user-login/
   ```
4. **Generate change summary**

#### Directory Structure After Archive

```
openspec/
├── changes/          # Empty, ready for next feature
└── archive/
    └── 2025-03-16-add-user-login/
        ├── proposal.md
        ├── specs/
        ├── design.md
        ├── tasks.md
        └── summary.md    # Implementation summary
```

---

## Extended Commands Details

### /opsx:new

Create change scaffold, generate empty change directory structure.

```bash
/opsx:new "add-user-login"
```

### /opsx:continue

Create next document in dependency order. After a document is complete, run this command to automatically create the next one.

```bash
/opsx:continue
```

### /opsx:ff (Fast Forward)

Create all planning documents at once (proposal, design, specs, tasks), skipping the step-by-step process.

```bash
/opsx:ff
```

### /opsx:verify

Verify implementation matches specifications.

```bash
/opsx:verify
```

AI will:
1. Compare requirements in `specs/`
2. Check code implementation
3. Report differences:
   ```
   ✓ Phone login - Implemented
   ✓ Verification code 5 min expiry - Implemented
   ✗ WeChat login - Not implemented (tasks.md 1.4 incomplete)
   ⚠ Login failure limit - Spec requires 5, code implements 3
   ```

### /opsx:sync

Sync specification documents with current code state. Use this command to update specs after manually modifying code.

```bash
/opsx:sync
```

### /opsx:onboard

Generate project overview for new team members.

```bash
/opsx:onboard
```

AI will generate:
- Project background introduction
- List of completed features (from archive/)
- Features in progress (from changes/)
- Tech stack and architecture explanation

---

## Command Usage Tips

### 1. Be Specific in Descriptions

```bash
# ❌ Too vague
/opsx:propose "Improve user experience"

# ✅ Specific and clear
/opsx:propose "Add email verification step to user registration flow, user needs to click link in email to activate account"
```

### 2. Do One Thing at a Time

```bash
# ❌ Too much
/opsx:propose "Add login, registration, password recovery, password change, phone binding features"

# ✅ Split into multiple changes
/opsx:propose "Add user login feature"
# After completion
/opsx:propose "Add user registration feature"
# After completion
/opsx:propose "Add password recovery feature"
```

### 3. Review Specifications Carefully Before Apply

> Specifications are your "contract" with AI
> Always confirm specifications are what you want before apply
> Modifying specs is much easier than modifying code

### 4. Use Explore for Uncertain Problems

```bash
# Uncertain how to do, explore first
/opsx:explore "What core capabilities are needed for a user permissions system"
# After confirming approach
/opsx:propose "Implement RBAC user permissions system"
```

### 5. Keep Context Clean

```bash
# Before starting new feature, clean AI's context
# Avoid old conversations affecting new feature implementation
```

---

## Complete Workflow Example

```bash
# 1. Explore problem (optional)
/opsx:explore "What core capabilities are needed for comment feature"

# 2. Create proposal
/opsx:propose "Add user comment feature"

# 3. After AI generates documents, review and confirm
# (Review proposal.md, design.md, specs/, tasks.md)

# 4. After confirmation, start implementation
/opsx:apply

# 5. If adjustments needed during implementation
# "The approach in design.md needs to be changed to..."

# 6. After implementation complete, verify
/opsx:verify

# 7. After verification passes, archive
/opsx:archive

# 8. Start next feature
/opsx:propose "Add comment like feature"
```

---

## Next Steps

Learn the complete workflow practice:

→ [Complete Workflow](/en/guide/openspec/workflow)

→ [Practice Case](/en/guide/openspec/practice)