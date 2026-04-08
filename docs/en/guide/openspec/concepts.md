# OpenSpec Core Concepts

Understanding the core philosophy of Spec-Driven Development (SDD) and how OpenSpec works.

## What is Spec-Driven Development?

### Traditional Development Model

```
Requirements → Human → Code → Testing
```

**Problems:**
- Requirement understanding偏差 (human brain translation loss)
- Implementation doesn't match requirements
- Insufficient test coverage
- Knowledge can't be retained

### Spec-Driven Model

```
Intent → Spec → AI → Code & Verification
```

**Advantages:**
- Align requirements between human and AI first
- Specs become executable documents
- Auto-generate verification
- Knowledge is reusable

## OpenSpec Core Philosophy

### 1. Fluid

**Not:** Strict phase gates, must complete A before starting B

**But:** Flexible iteration, can adjust anytime

```
Proposal → Design → Implementation → Verification
   ↑              ↓
   └──────────────┘
   Adjust anytime when issues found
```

### 2. Iterative

**Not:** One-time perfect delivery

**But:** Small steps, continuous improvement

```
Iteration 1: Basic features
Iteration 2: Add error handling
Iteration 3: Performance optimization
Iteration 4: Complete documentation
```

### 3. Living

**Not:** Write once and discard

**But:** Evolve with code

```
Spec docs ←→ Code implementation
      ↑
      Continuous sync
```

## OpenSpec Workflow

### Complete Workflow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Propose  │ ──▶ │  Apply   │ ──▶ │ Archive  │
└──────────┘     └──────────┘     └──────────┘
     │                 │                 │
     ▼                 ▼                 ▼
 Create change    Implement      Save history
 proposal.md      according      for review
 design.md        to spec        and learning
 specs/            write code    accumulate
 tasks.md          update tasks  knowledge
                   auto-verify   continuous
                                  improvement
```

### Document Structure

Each change contains:

```
openspec/changes/<change-name>/
├── proposal.md      # Proposal: why and what
├── design.md        # Design: how
├── specs/           # Specs: detailed requirements
│   └── <capability>/
│       └── spec.md
├── tasks.md         # Tasks: implementation checklist
└── summary.md       # Summary: implementation summary (generated on archive)
```

## Core Concepts Details

### 1. Change

**Definition:** An independent feature or fix

**Characteristics:**
- Atomic: One change does one thing
- Independent: Changes尽量不相互依赖
- Complete: Includes full lifecycle from proposal to archive

**Examples:**
```
✅ Good changes:
- "Add user login feature"
- "Fix order calculation precision issue"

❌ Bad changes:
- "Add user system and order system" (too large)
- "Modify some code" (unclear)
```

### 2. Proposal

**Purpose:** Record "why" and "what"

**Content:**
- **Why**: Why this change is needed
- **What**: What specifically to do
- **Impact**: Scope of impact
- **Non-Goals**: What's explicitly not included

**Example:**
```markdown
## Why
Users can't recover passwords, causing 15% churn rate increase

## What
Add "forgot password" feature:
- User enters email, sends reset link
- Link valid for 24 hours
- Send confirmation email after reset

## Impact
- User module
- Email service
- Login page UI

## Non-Goals
- Add phone number recovery
- Modify existing login flow
```

### 3. Design

**Purpose:** Record "how"

**Content:**
- **Architecture**: System architecture diagram
- **Data Model**: Database design
- **API**: API definitions
- **Algorithm**: Key algorithm explanations

**Example:**

**Architecture**
```
User Request → API Gateway → Auth Service → Email Service
```

**Data Model**
```
PasswordResetToken
- userId: string
- token: string (UUID)
- expiresAt: DateTime
- usedAt: DateTime?
```

**API**
```
POST /api/v1/auth/forgot-password
Request: { email: string }
Response: { success: boolean, message: string }
```

### 4. Spec

**Purpose:** Detailed testable requirements

**Format:**
```markdown
## Requirements

### Requirement: User can reset password via email
The system SHALL allow users to receive password reset links via registered email.

#### Scenario: Successfully sent reset email
- **WHEN** User submits valid email
- **THEN** System sends email with reset link
- **AND** Returns "email sent" message

#### Scenario: Email doesn't exist
- **WHEN** User submits unregistered email
- **THEN** System returns same message (security consideration)
- **AND** Doesn't send email
```

### 5. Task

**Purpose:** Trackable implementation steps

**Format:**
```markdown
## 1. Backend Implementation
- [ ] 1.1 Create PasswordResetToken table
- [ ] 1.2 Implement forgot-password API
- [ ] 1.3 Implement reset-password API
- [ ] 1.4 Add email sending logic
- [ ] 1.5 Write unit tests

## 2. Frontend Implementation
- [ ] 2.1 Create "forgot password" page
- [ ] 2.2 Create "reset password" page
- [ ] 2.3 Add form validation
```

## Comparison with Traditional Development

| Aspect | Traditional | OpenSpec |
|--------|-------------|----------|
| Requirement transfer | Verbal/Document (easily lost) | Spec files (versioned) |
| Human-AI alignment | Multiple communications (time-consuming) | Align first then code (efficient) |
| Knowledge retention | Depends on human memory | Documented in specs |
| Change tracking | Hard to trace | Complete history |
| Test coverage | Easy to miss | Specs are test cases |

## Applicable Scenarios

### ✅ Suitable for OpenSpec

1. **Team projects**: Multi-person collaboration, need unified standards
2. **Complex features**: Need detailed design and review
3. **Long-term maintenance**: Need knowledge retention
4. **AI-assisted development**: Maximize AI capabilities

### ❌ Not Suitable for OpenSpec

1. **Personal projects**: Simple features, fast prototyping
2. **Exploratory development**: Uncertain requirements, frequent changes
3. **One-off scripts**: Use once and discard

## Real Case Study

### Case: Add User Comment Feature

**Traditional approach:**
```
1. Align requirements with PM verbally
2. Start writing code
3. Discover pagination is missing
4. Confirm with PM again
5. Continue writing code
6. Discover permission logic unclear
7. Confirm again
8. Write tests, discover edge cases not handled
9. Modify code
...
```

**OpenSpec approach:**
```
1. /opsx:propose "Add user comment feature"
   AI generates proposal, design, specs, tasks
   
2. Review and confirm specs
   - Need pagination? ✓
   - How to control permissions? ✓
   - Edge cases? ✓
   
3. /opsx:apply
   AI implements according to specs
   
4. Verify against specs
   - Checklist auto-verifies
   
5. /opsx:archive
   Save complete history
```

## Common Misconceptions

### Misconception 1: OpenSpec is Too Cumbersome

**Reality:** For simple features it's indeed overkill. But for complex features, upfront alignment is more efficient than rework later.

**Suggestion:**
- Simple features: Streamlined specs
- Complex features: Complete specs

### Misconception 2: Specs Never Change

**Reality:** Specs are living documents and should evolve with implementation.

**Suggestion:**
- Design issues found → Update design.md
- Requirements missing → Update specs/
- Keep in sync

### Misconception 3: AI Will Completely Follow Specs

**Reality:** AI may misunderstand specs, manual verification needed.

**Suggestion:**
- Use /opsx:verify to verify implementation
- Manual review for critical parts
- Feedback verification results to AI

## Next Steps

Learn specific OpenSpec commands and workflow:

→ [Command Reference](/en/guide/openspec/commands)

→ [Complete Workflow](/en/guide/openspec/workflow)