# Permission Model

## Concept

What an Agent can and cannot do — this is the first line of defense for security. The permission model defines the Agent's operational boundaries across four dimensions: file system, network, command execution, and external APIs.

## Why Is the Permission Model Fundamental?

An Agent without permission boundaries is undeployable — it could accidentally modify system configuration while fixing documentation, or upload code to an external API while "searching for best practices." Permissions don't limit the Agent's capabilities; they **ensure the Agent's behavior is predictable**.

## Four Permission Dimensions

```
┌─────────────────────────────────────────────────────────┐
│ File System Permissions                                   │
│ Read: Which directories are readable?                    │
│ Write: Which directories are writable?                   │
│ Execute: Which commands can be run?                      │
│ Delete: Can files be deleted? (almost always NO)         │
├─────────────────────────────────────────────────────────┤
│ Network Permissions                                      │
│ Outbound: Which domains/ports can be accessed?           │
│ Inbound: Does the Agent need to expose ports externally?  │
│ Protocol: HTTP/HTTPS only? Or TCP/UDP too?               │
├─────────────────────────────────────────────────────────┤
│ Command Execution Permissions                            │
│ Allowlist: List of permitted commands                    │
│ Parameter limits: Even for allowed commands, which        │
│   parameters are forbidden?                              │
│ Timeout: Maximum execution time per command              │
├─────────────────────────────────────────────────────────┤
│ External API Permissions                                 │
│ Auth: What credentials are used? What scope?             │
│ Rate: What's the allowed call frequency?                 │
│ Scope: Which API endpoints are accessible?               │
└─────────────────────────────────────────────────────────┘
```

## Principle of Least Privilege

The Agent should only have the minimum permissions needed to complete the task:

```
Task: Fix broken links in documentation site

Required permissions:
  ✓ Read: docs/**/*.md
  ✓ Write: docs/**/*.md
  ✓ Execute: npm run docs:check-links, npm run docs:build, git diff

Not needed:
  ✗ Read: ~/.ssh/, /etc/passwd, .env
  ✗ Write: Any files outside docs/
  ✗ Execute: rm, sudo, curl (unless used internally by link-checker)
  ✗ Network: Access external APIs (fixing links doesn't require network)
```

## Two Permission Control Modes

### Mode A: Allowlist (Whitelist)

Deny everything by default, only allow explicitly listed operations.

```
Pros: Highest security — no risk of "forgetting to forbid" something
Cons: Requires precise prediction of all operations the Agent needs
Use for: Tasks with well-defined scope (fixing broken links, formatting code)
```

### Mode B: Denylist (Blacklist)

Allow everything by default, only forbid explicitly listed dangerous operations.

```
Pros: High flexibility — no need to predict all operations
Cons: Cannot guarantee coverage of all dangerous operations
Use for: Exploratory tasks (searching code, analyzing architecture)
```

For production deployments, allowlist is the better default.

## Example: Restricting an MCP Tool's Permissions

Security design for a "write file" MCP tool:

```typescript
// MCP tool: write_file
// Security design

const ALLOWED_DIRECTORIES = [
  '/home/user/project/docs/',
  '/home/user/project/examples/',
]

const DENIED_PATTERNS = [
  /\.env$/,
  /\.ssh\//,
  /\/etc\//,
  /\.git\/config$/,
]

function validateWritePath(requestedPath: string): void {
  // Check 1: Path must be within an allowed directory
  const resolved = path.resolve(requestedPath)
  const isAllowed = ALLOWED_DIRECTORIES.some(
    dir => resolved.startsWith(dir)
  )
  if (!isAllowed) {
    throw new Error(
      `PERMISSION DENIED: ${requestedPath} is not in an allowed directory.\n` +
      `Allowed directories: ${ALLOWED_DIRECTORIES.join(', ')}`
    )
  }

  // Check 2: Prevent overwriting sensitive files
  const isSensitive = DENIED_PATTERNS.some(
    pattern => pattern.test(resolved)
  )
  if (isSensitive) {
    throw new Error(
      `PERMISSION DENIED: ${requestedPath} matches a sensitive file pattern.`
    )
  }

  // Check 3: Show diff before writing (if file already exists)
  if (fs.existsSync(resolved)) {
    const oldContent = fs.readFileSync(resolved, 'utf-8')
    const newContent = requestedContent
    // Show diff to user, wait for confirmation
    showDiffAndWaitForConfirmation(oldContent, newContent)
  }
}
```

Key design decisions:
1. **Directory allowlist**: Only allows writing to specific directories
2. **Sensitive file denylist**: Even within allowed directories, prevents overwriting sensitive files
3. **Show diff before writing**: Users can reject the change
4. **Clear error messages**: Tell the user "why it was denied" and "what is allowed"

## Exercise

Design a permission model for an MCP tool that "calls the GitHub API to create Issues":

1. File system permissions: Does this tool need to read or write files?
2. Network permissions: Which domains need to be accessed? Which endpoints are essential, which are redundant?
3. API permissions: What is the minimum permission scope for the GitHub Token?
4. Rate limiting: How do you prevent the Agent from creating many Issues in a loop?

## Troubleshooting

| Symptom | Possible Cause | Fix |
|---------|---------------|-----|
| Agent frequently triggers permission denials | Permission scope too narrow — normal operations are blocked | Expand the allowlist without compromising security boundaries |
| Permission checks are bypassed | Allowlist rules have gaps (e.g., path traversal) | Use path.resolve to normalize before checking |
| User can't see why a permission was denied | Error message is unclear | Include "reason + allowed operations list" in the denial message |

## Next Steps

The permission model answers "what can the Agent do" — now read about [Secret Governance](./secret-governance) to answer "what should the Agent never see."
