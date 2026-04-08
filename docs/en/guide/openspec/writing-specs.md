# Writing High-Quality Specs

Specs are the core of OpenSpec. High-quality specs ensure AI accurately understands requirements and implements correctly.

## Spec Structure

```markdown
## ADDED Requirements

### Requirement: [Requirement Name]
[Requirement Description]

#### Scenario: [Scenario Name]
- **GIVEN** [Precondition]
- **WHEN** [Trigger Condition]
- **THEN** [Expected Result]
- **AND** [Additional Result]

## MODIFIED Requirements
[Modified existing requirements]

## REMOVED Requirements
[Removed requirements]
```

## Writing Principles

### 1. Specificity

**❌ Bad example:**
```markdown
### Requirement: System should respond quickly
System should quickly respond to user requests.
```

**✅ Good example:**
```markdown
### Requirement: API response time meets SLA
API SHALL respond within 200ms for 95% of requests.

#### Scenario: Response time under normal load
- **GIVEN** System load < 80%
- **WHEN** User calls API
- **THEN** 95% of requests return within 200ms
```

### 2. Testability

Every requirement should be able to write test cases for.

**❌ Bad example:**
```markdown
### Requirement: User interface is friendly
Interface should be friendly to users.
```

**✅ Good example:**
```markdown
### Requirement: Form validation provides immediate feedback
System SHALL immediately display validation errors as user types.

#### Scenario: Invalid email format
- **GIVEN** User enters "invalid-email" in email input
- **WHEN** Input loses focus
- **THEN** Display error message "Please enter a valid email address"
```

### 3. Atomic

One requirement does one thing.

**❌ Bad example:**
```markdown
### Requirement: User management
Users can register, login, update profile, delete account.
```

**✅ Good example:**
```markdown
### Requirement: User registration
User SHALL be able to register an account via email.

### Requirement: User login
User SHALL be able to login with email and password.

### Requirement: Update profile
User SHALL be able to update personal profile.

### Requirement: Delete account
User SHALL be able to delete their own account.
```

## Scenario Writing Tips

### Use Given-When-Then Format

```markdown
#### Scenario: Successful login
- **GIVEN** User registered with email "user@example.com" and password "password123"
- **WHEN** User logs in with email and password
- **THEN** Login successful
- **AND** Returns user information and Token
- **AND** Records login log
```

### Cover Edge Cases

```markdown
### Requirement: User login

#### Scenario: Successful login
...

#### Scenario: Wrong password
- **GIVEN** User is registered
- **WHEN** User logs in with wrong password
- **THEN** Returns 401 error
- **AND** Displays "Email or password incorrect"

#### Scenario: User doesn't exist
- **GIVEN** User is not registered
- **WHEN** User tries to login
- **THEN** Returns 401 error
- **AND** Displays "Email or password incorrect" (for security, don't reveal user doesn't exist)

#### Scenario: Account locked
- **GIVEN** User's account locked after 5 consecutive login failures
- **WHEN** User tries to login
- **THEN** Returns 403 error
- **AND** Displays "Account locked, please try again in 30 minutes"
```

## Requirement Categories

### Functional Requirements

Describe what the system should do.

```markdown
### Requirement: Search feature
User SHALL be able to search articles by keywords.

#### Scenario: Keyword search
- **GIVEN** Article with title "OpenSpec Tutorial" exists
- **WHEN** User searches for "OpenSpec"
- **THEN** Returns search results containing that article
```

### Non-Functional Requirements

Describe system quality attributes.

```markdown
### Requirement: Performance requirements
Search endpoint SHALL return results within 1 second.

#### Scenario: Search result return time
- **GIVEN** Database has 10000 articles
- **WHEN** User searches for "Tutorial"
- **THEN** Results return within 1 second
```

### Security Requirements

```markdown
### Requirement: Password security
User password SHALL be encrypted using bcrypt algorithm for storage.

#### Scenario: Password storage
- **GIVEN** User registers with password "password123"
- **WHEN** System saves user data
- **THEN** Database stores bcrypt hash
- **AND** Does not contain plaintext password
```

### Usability Requirements

```markdown
### Requirement: Error messages
System error messages SHALL be displayed in Chinese and explain how to resolve.

#### Scenario: Network error
- **GIVEN** User's network is disconnected
- **WHEN** User submits form
- **THEN** Displays "Network connection failed, please check your network and try again"
```

## Complete Example

### User Authentication Module

```markdown
## ADDED Requirements

### Requirement: User registration
System SHALL allow users to register an account via email.

#### Scenario: Successful registration
- **GIVEN** Email "newuser@example.com" is not registered
- **WHEN** User submits registration: email "newuser@example.com", password "Secure123!"
- **THEN** Account created successfully
- **AND** Sends verification email
- **AND** Returns success message

#### Scenario: Email already registered
- **GIVEN** Email "existing@example.com" is already registered
- **WHEN** User submits registration with same email
- **THEN** Returns 409 error
- **AND** Displays "This email is already registered"

#### Scenario: Password strength insufficient
- **GIVEN** User submits registration info
- **WHEN** Password is less than 8 characters or doesn't contain letter-number combination
- **THEN** Returns 400 error
- **AND** Displays "Password must be at least 8 characters and contain letters and numbers"

### Requirement: User login
System SHALL allow users to login with email and password.

#### Scenario: Successful login
- **GIVEN** User is registered with correct password
- **WHEN** User submits email and password
- **THEN** Returns access token
- **AND** Token valid for 24 hours

#### Scenario: Login failure
- **GIVEN** User submits wrong email or password
- **WHEN** User tries to login
- **THEN** Returns 401 error
- **AND** Displays "Email or password incorrect"
- **AND** Records failure count

### Requirement: Login failure limit
System SHALL limit consecutive login failures.

#### Scenario: Exceeds failure limit
- **GIVEN** User has 5 consecutive login failures
- **WHEN** User attempts 6th login
- **THEN** Returns 403 error
- **AND** Displays "Account locked, please try again in 30 minutes"
- **AND** Sends security alert email

#### Scenario: Login after lock period
- **GIVEN** User's account is locked
- **AND** 30 minute lock period has passed
- **WHEN** User logs in with correct password
- **THEN** Login successful
- **AND** Clears failure count
```

## Common Mistakes

### Mistake 1: Requirements Too Abstract

**❌ Bad:**
```markdown
System should perform well.
```

**✅ Good:**
```markdown
System SHALL respond within 1 second for 95% of requests.
```

### Mistake 2: Missing Scenarios

**❌ Bad:**
```markdown
### Requirement: User registration
User can register an account.

#### Scenario: Successful registration
...
```

**✅ Good:**
```markdown
### Requirement: User registration
User can register an account.

#### Scenario: Successful registration
...

#### Scenario: Email already exists
...

#### Scenario: Password strength insufficient
...
```

### Mistake 3: Using Vague Words

Avoid using:
- "maybe", "perhaps"
- "should", "try to"
- "fast", "friendly"
- "big", "small"

Use specific numbers or verifiable descriptions.

## Checklist

After writing specs, check the following:

- [ ] Each requirement has a clear name
- [ ] Requirements use SHALL/MUST (not should/may)
- [ ] Each requirement has at least one scenario
- [ ] Scenarios use Given-When-Then format
- [ ] Covers normal, error, and edge cases
- [ ] Contains verifiable acceptance criteria
- [ ] Avoids vague words

## Next Steps

Learn more practical cases:

→ [OpenSpec Practice Case](/en/guide/openspec/practice)