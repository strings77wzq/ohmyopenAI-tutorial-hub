# Create Your First Skill

This tutorial walks you through building a practical code explanation Skill step by step.

## Goal

Create an `explain-code` Skill that can:
- Analyze any code snippet
- Explain the code's function and how it works
- Point out potential issues and improvement suggestions

## Step 1: Create the Skill File

Create a `.skills/` folder in your project root:

```bash
mkdir -p .skills
```

Then create the `explain-code.json` file:

```bash
touch .skills/explain-code.json
```

## Step 2: Write the Basic Structure

Open `explain-code.json` and add the basic structure:

```json
{
  "name": "explain-code",
  "description": "Explain how code works",
  "prompt": "",
  "examples": []
}
```

## Step 3: Design the Prompt

The Prompt is the core of the Skill. A good Prompt should:
- Clearly state the task
- Specify the output format
- Provide evaluation dimensions

Write a detailed Prompt:

```json
{
  "name": "explain-code",
  "description": "Explain how code works, including logic flow, key variables, and potential issues",
  "prompt": "Please explain the following code in detail:\n\n```\n{{code}}\n```\n\nAnalyze from the following perspectives:\n\n## 1. Overall Function\nBriefly describe the main purpose of this code.\n\n## 2. Execution Flow\nExplain the code's execution process step by step.\n\n## 3. Key Variables and Functions\nList important variables and functions, explaining their roles.\n\n## 4. Potential Issues\nPoint out possible bugs, performance issues, or edge cases.\n\n## 5. Improvement Suggestions\nProvide specific optimization suggestions (if any).",
  "examples": []
}
```

**Key points:**
- Use `{{code}}` as a variable placeholder
- Clearly specify the output format (Markdown headings)
- Request analysis by dimension

## Step 4: Add Examples

Examples help the AI understand the expected output quality. Add 2–3 representative examples:

```json
{
  "name": "explain-code",
  "description": "Explain how code works, including logic flow, key variables, and potential issues",
  "prompt": "Please explain the following code in detail:\n\n```\n{{code}}\n```\n\nAnalyze from the following perspectives:\n\n## 1. Overall Function\nBriefly describe the main purpose of this code.\n\n## 2. Execution Flow\nExplain the code's execution process step by step.\n\n## 3. Key Variables and Functions\nList important variables and functions, explaining their roles.\n\n## 4. Potential Issues\nPoint out possible bugs, performance issues, or edge cases.\n\n## 5. Improvement Suggestions\nProvide specific optimization suggestions (if any).",
  "examples": [
    {
      "input": "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)",
      "output": "## 1. Overall Function\nThis is a recursive function that calculates factorials. A factorial is the product of all positive integers from 1 to n (n!).\n\n## 2. Execution Flow\n1. Check if n is 0; if so, return 1 (0! = 1)\n2. Otherwise, return n multiplied by factorial(n-1)\n3. Recurse until n reaches 0\n\n## 3. Key Variables and Functions\n- `n`: Input parameter, the number to calculate the factorial of\n- `factorial()`: Recursive function that computes the factorial\n\n## 4. Potential Issues\n- **No negative input handling**: Passing a negative number causes infinite recursion\n- **No type checking**: Should ensure n is an integer\n- **Recursion depth limit**: Very large n may cause a stack overflow\n\n## 5. Improvement Suggestions\n```python\ndef factorial(n):\n    if not isinstance(n, int):\n        raise TypeError(\"n must be an integer\")\n    if n < 0:\n        raise ValueError(\"n must be non-negative\")\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)\n```"
    },
    {
      "input": "const sum = arr => arr.reduce((a, b) => a + b, 0);",
      "output": "## 1. Overall Function\nThis is an arrow function that calculates the sum of array elements.\n\n## 2. Execution Flow\n1. Accepts an array `arr` as a parameter\n2. Uses the `reduce` method to iterate over the array\n3. Accumulates each element into accumulator `a`\n4. Initial value is 0\n5. Returns the final sum\n\n## 3. Key Variables and Functions\n- `arr`: Input array\n- `reduce`: Array method used for reduction operations\n- `a`: Accumulator storing intermediate results\n- `b`: Current element\n\n## 4. Potential Issues\n- **No empty array check**: Empty array returns 0, which is expected, but verify it matches business needs\n- **No type checking**: Passing a non-array will throw an error\n- **NaN handling**: If the array contains NaN, the result will be NaN\n\n## 5. Improvement Suggestions\n```javascript\nconst sum = arr => {\n    if (!Array.isArray(arr)) {\n        throw new TypeError('Expected an array');\n    }\n    return arr.reduce((a, b) => {\n        if (typeof b !== 'number' || isNaN(b)) {\n            throw new Error('Array must contain only numbers');\n        }\n        return a + b;\n    }, 0);\n};\n```"
    }
  ]
}
```

## Step 5: Test the Skill

After saving the file, test it in a Skills-compatible AI tool:

```
User: /explain-code

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

AI: ## 1. Overall Function
This is a recursively implemented Fibonacci sequence function...

## 2. Execution Flow
...

## 3. Key Variables and Functions
...

## 4. Potential Issues
...

## 5. Improvement Suggestions
...
```

## Complete Code

The final `explain-code.json`:

```json
{
  "name": "explain-code",
  "description": "Explain how code works, including logic flow, key variables, and potential issues",
  "prompt": "Please explain the following code in detail:\n\n```\n{{code}}\n```\n\nAnalyze from the following perspectives:\n\n## 1. Overall Function\nBriefly describe the main purpose of this code.\n\n## 2. Execution Flow\nExplain the code's execution process step by step.\n\n## 3. Key Variables and Functions\nList important variables and functions, explaining their roles.\n\n## 4. Potential Issues\nPoint out possible bugs, performance issues, or edge cases.\n\n## 5. Improvement Suggestions\nProvide specific optimization suggestions (if any).",
  "examples": [
    {
      "input": "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)",
      "output": "## 1. Overall Function\nThis is a recursive function that calculates factorials..."
    },
    {
      "input": "const sum = arr => arr.reduce((a, b) => a + b, 0);",
      "output": "## 1. Overall Function\nThis is an arrow function that calculates the sum of array elements..."
    }
  ]
}
```

## Common Issues and Solutions

### Issue 1: Inconsistent AI Output Format

**Cause:** Format requirements in the Prompt are not specific enough.

**Solution:** Clearly specify the output format, such as using Markdown headings.

### Issue 2: AI Skips Some Analysis Dimensions

**Cause:** The Prompt doesn't explicitly require every dimension to be included.

**Solution:** Emphasize "You must include all the following dimensions" in the Prompt.

### Issue 3: Examples Aren't Good Enough

**Cause:** Examples are too simple or not representative enough.

**Solution:** Add real code examples of varying complexity and across different languages.

## Practice

Now try modifying the Skill to add new analysis dimensions:

1. **Time Complexity Analysis** — Analyze the algorithm's time complexity
2. **Space Complexity Analysis** — Analyze memory usage
3. **Use Cases** — Describe scenarios where this code is appropriate

Save the modified Skill and test it!

## Next Steps

You've successfully created your first Skill! Now learn more about Skills:

→ [Skill Core Components](/guide/skills/components)
