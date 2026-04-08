# Reference

Quick reference documentation, FAQ, and troubleshooting guides.

## Quick Reference

### Skills Quick Reference

```json
{
  "name": "skill-name",
  "description": "Skill functionality description",
  "prompt": "Detailed instructions...",
  "examples": [
    {"input": "...", "output": "..."}
  ]
}
```

### OpenSpec Quick Reference

| Command | Purpose |
|---------|---------|
| `/opsx:propose "description"` | Create proposal |
| `/opsx:apply` | Apply implementation |
| `/opsx:archive` | Archive change |
| `/opsx:verify` | Verify implementation |

### Harness Quick Reference

```javascript
// Define test
const test = {
  name: "Test name",
  input: "Input",
  expected: { contains: ["Expected content"] }
};

// Run test
const result = await runTest(test);
```

---

## FAQ

### Skills FAQ

**Q: What's the difference between Skill and Tool?**

A: Skill guides AI on how to think, Tool lets AI perform actions. Skill = tactical guidance, Tool = execution action.

**Q: Can one Skill do multiple things?**

A: It's recommended to keep single responsibility. Complex tasks should be split into multiple Skills and used in combination.

**Q: Should Skill examples be as many as possible?**

A: No. 2-3 high-quality examples are more effective than 10 low-quality ones.

### OpenSpec FAQ

**Q: Is OpenSpec suitable for personal projects?**

A: Might be overkill for simple features, but more valuable for complex features or team collaboration.

**Q: Can specifications be modified?**

A: Yes! Specs are living documents and should evolve with implementation.

**Q: Will AI definitely implement according to specs?**

A: Not necessarily. Use `/opsx:verify` to verify, and manually review critical parts.

### Harness FAQ

**Q: What's the difference between Harness and unit tests?**

A: Harness tests AI output quality (non-deterministic), unit tests test code logic (deterministic).

**Q: What's the purpose of Mock Server?**

A: Simulates AI API, no real calls needed, saves cost, more stable tests.

---

## Troubleshooting

### Skills Common Issues

**Issue 1: AI output format inconsistent**

**Cause**: Prompt format requirements not explicit enough

**Solution**: Explicitly specify output format (Markdown headings, code blocks, etc.)

**Issue 2: Skill not working**

**Cause**: File location or format error

**Solution**:
- Check if file is in `.skills/` directory
- Verify JSON format
- Check if `name` is unique

### OpenSpec Common Issues

**Issue 1: `/opsx:propose` has no response**

**Solution**:
- Ensure in project root directory
- Check if initialized (`openspec init`)

**Issue 2: Implementation doesn't match spec**

**Solution**:
- Use `/opsx:verify` to verify
- Update spec to be clearer
- Provide more examples

### Harness Common Issues

**Issue 1: Tests always fail**

**Solution**:
- Check Evaluator configuration
- Consider using semantic matching instead of exact matching
- Increase tolerance threshold

---

## Resource Links

- [claude-code-Go GitHub](https://github.com/strings77wzq/claude-code-Go)
- [OpenSpec Official Documentation](https://openspec.dev)
- [Diátaxis Documentation Framework](https://diataxis.fr/)