# Harness Practice: From Scenarios to Reports

This case study demonstrates how to build a regression test suite for an `explain-code` Skill.

## Step 1: Define Scenarios

```json
{
  "name": "Explain sorting algorithm",
  "input": {
    "skill": "explain-code",
    "code": "function bubbleSort(arr){...}"
  },
  "expected": {
    "contains": ["bubble sort", "time complexity"],
    "notContains": ["unknown error"]
  },
  "evaluators": ["contains", "no-error"]
}
```

## Step 2: Run the Tests

```bash
pytest tests/scenarios/test_explain_code.py
```

## Step 3: View the Report

The report should include:

- Overall pass rate
- Failure reasons for each scenario
- Suggested fixes

## Step 4: Iterate and Optimize

- Adjust the prompt
- Add more examples
- Re-run the same scenarios and compare before/after metrics
