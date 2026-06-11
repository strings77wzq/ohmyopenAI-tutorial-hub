---
title: 实战：构建工具集
description: 从零构建一个完整的工具集，包含文件操作、API 调用和数据查询，掌握工具设计的全流程
---

# 实战：构建工具集

本节通过一个完整案例，从零构建一个实用的工具集，覆盖文件操作、API 调用和数据查询三大场景。

## 场景设定

你在构建一个**开发者助手 Agent**，需要帮助开发者完成日常任务：

- 读取和搜索项目文件
- 调用 GitHub API 获取仓库信息
- 查询数据库获取用户数据

## 第一步：设计工具清单

先列出需要的工具：

| 工具名 | 功能 | 类型 |
| --- | --- | --- |
| `read_file` | 读取文件内容 | 文件操作 |
| `search_files` | 按模式搜索文件 | 文件操作 |
| `list_directory` | 列出目录内容 | 文件操作 |
| `github_repo_info` | 获取仓库基本信息 | API 调用 |
| `github_search_code` | 在仓库中搜索代码 | API 调用 |
| `query_users` | 查询用户列表 | 数据查询 |
| `get_user_detail` | 获取用户详情 | 数据查询 |

## 第二步：定义每个工具

### 文件操作工具

```json
{
  "name": "read_file",
  "description": "读取指定路径的文件内容。返回文件的完整文本内容。路径必须是绝对路径或相对于项目根目录的路径。",
  "parameters": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "文件路径，如 'src/main.ts' 或 '/absolute/path/file.txt'"
      },
      "encoding": {
        "type": "string",
        "enum": ["utf-8", "base64"],
        "default": "utf-8",
        "description": "文件编码方式"
      },
      "max_lines": {
        "type": "integer",
        "description": "最大返回行数，默认 1000",
        "default": 1000
      }
    },
    "required": ["path"]
  }
}
```

```json
{
  "name": "search_files",
  "description": "按 glob 模式搜索项目中的文件。返回匹配的文件路径列表，按修改时间倒序排列。",
  "parameters": {
    "type": "object",
    "properties": {
      "pattern": {
        "type": "string",
        "description": "glob 模式，如 '**/*.ts' 或 'src/**/*.test.js'"
      },
      "root_dir": {
        "type": "string",
        "description": "搜索根目录，默认项目根目录",
        "default": "."
      },
      "max_results": {
        "type": "integer",
        "description": "最大返回数量，默认 50",
        "default": 50
      }
    },
    "required": ["pattern"]
  }
}
```

### API 调用工具

```json
{
  "name": "github_repo_info",
  "description": "获取 GitHub 仓库的基本信息，包括 star 数、fork 数、语言、最近提交等。",
  "parameters": {
    "type": "object",
    "properties": {
      "owner": {
        "type": "string",
        "description": "仓库所有者，如 'facebook'"
      },
      "repo": {
        "type": "string",
        "description": "仓库名，如 'react'"
      }
    },
    "required": ["owner", "repo"]
  }
}
```

```json
{
  "name": "github_search_code",
  "description": "在指定 GitHub 仓库中搜索代码。返回匹配的文件路径和代码片段。",
  "parameters": {
    "type": "object",
    "properties": {
      "owner": { "type": "string", "description": "仓库所有者" },
      "repo": { "type": "string", "description": "仓库名" },
      "query": { "type": "string", "description": "搜索关键词" },
      "language": {
        "type": "string",
        "description": "限定编程语言",
        "enum": ["typescript", "javascript", "python", "go", "rust", "java"]
      }
    },
    "required": ["owner", "repo", "query"]
  }
}
```

### 数据查询工具

```json
{
  "name": "query_users",
  "description": "查询用户列表，支持按状态和角色筛选。返回分页结果。",
  "parameters": {
    "type": "object",
    "properties": {
      "status": {
        "type": "string",
        "enum": ["active", "inactive", "all"],
        "default": "all",
        "description": "用户状态筛选"
      },
      "role": {
        "type": "string",
        "enum": ["admin", "editor", "viewer"],
        "description": "按角色筛选"
      },
      "page": {
        "type": "integer",
        "default": 1,
        "description": "页码"
      },
      "page_size": {
        "type": "integer",
        "default": 20,
        "description": "每页数量"
      }
    },
    "required": []
  }
}
```

## 第三步：实现工具逻辑

### read_file 实现

```python
import os

async def read_file(path: str, encoding: str = "utf-8", max_lines: int = 1000):
    # 安全校验：限制路径范围
    abs_path = os.path.abspath(path)
    if not abs_path.startswith(os.environ["PROJECT_ROOT"]):
        return {
            "status": "error",
            "error": {
                "code": "FORBIDDEN",
                "message": "不允许访问项目目录外的文件"
            }
        }

    # 检查文件是否存在
    if not os.path.exists(abs_path):
        return {
            "status": "error",
            "error": {
                "code": "NOT_FOUND",
                "message": f"文件不存在: {path}"
            }
        }

    # 检查文件大小
    file_size = os.path.getsize(abs_path)
    if file_size > 10 * 1024 * 1024:  # 10MB
        return {
            "status": "error",
            "error": {
                "code": "FILE_TOO_LARGE",
                "message": f"文件过大: {file_size / 1024 / 1024:.1f}MB，最大支持 10MB"
            }
        }

    # 读取文件
    with open(abs_path, "r", encoding=encoding) as f:
        lines = []
        for i, line in enumerate(f):
            if i >= max_lines:
                break
            lines.append(line)

    return {
        "status": "success",
        "content": "".join(lines),
        "total_lines": len(lines),
        "truncated": len(lines) >= max_lines
    }
```

### search_files 实现

```python
import glob
import os

async def search_files(pattern: str, root_dir: str = ".", max_results: int = 50):
    search_path = os.path.join(root_dir, pattern)
    matches = glob.glob(search_path, recursive=True)

    # 按修改时间倒序
    matches.sort(key=lambda f: os.path.getmtime(f), reverse=True)

    # 截断
    truncated = len(matches) > max_results
    matches = matches[:max_results]

    return {
        "status": "success",
        "files": matches,
        "count": len(matches),
        "truncated": truncated
    }
```

## 第四步：组合工具链

一个典型的多工具协作场景：

```
用户: "看看 React 仓库中 useState 的实现方式"

工具链:
  1. github_search_code(
       owner: "facebook",
       repo: "react",
       query: "useState",
       language: "typescript"
     )
  → 找到文件: packages/react/src/ReactHooks.ts

  2. github_get_file_content(
       owner: "facebook",
       repo: "react",
       path: "packages/react/src/ReactHooks.ts"
     )
  → 获取文件内容

  3. 综合分析，生成回复
```

### 编排代码

```python
async def analyze_react_hook(hook_name):
    # 步骤 1: 搜索代码位置
    search_result = await call_tool("github_search_code", {
        "owner": "facebook",
        "repo": "react",
        "query": hook_name,
        "language": "typescript"
    })

    if not search_result["items"]:
        return f"未找到 {hook_name} 的实现"

    # 步骤 2: 获取文件内容
    file_path = search_result["items"][0]["path"]
    file_content = await call_tool("github_get_file_content", {
        "owner": "facebook",
        "repo": "react",
        "path": file_path
    })

    # 步骤 3: 生成分析报告
    return {
        "hook_name": hook_name,
        "file": file_path,
        "content": file_content["content"],
        "analysis": analyze_code(file_content["content"])
    }
```

## 第五步：错误处理

为每个工具加上完整的错误处理：

```python
async def safe_tool_call(tool_name, params, fallback=None):
    try:
        result = await call_tool(tool_name, params)
        if result["status"] == "success":
            return result
        # 工具返回了错误
        return handle_tool_error(tool_name, result["error"])
    except TimeoutError:
        if fallback:
            return await fallback()
        return {
            "status": "error",
            "error": {"code": "TIMEOUT", "message": f"{tool_name} 调用超时"}
        }
    except Exception as e:
        return {
            "status": "error",
            "error": {"code": "UNKNOWN", "message": str(e)}
        }
```

## 练习

基于以上工具集，完成以下任务：

1. 设计一个工具：`create_github_issue`，用于在 GitHub 上创建 issue。
2. 为 `query_users` 工具添加一个新的筛选维度：`created_after`（注册时间之后的用户）。
3. 组合 `search_files` 和 `read_file`，实现"在项目中搜索包含特定关键词的文件并读取内容"的工具链。

## 常见问题

### Q: 工具数量有没有上限？

建议单个 Agent 不超过 15-20 个工具。工具太多会降低模型选择准确率。可以用工具分类（MCP 的 resource 思路）或组合成更高级的工具。

### Q: 工具的粒度怎么把握？

| 粒度 | 优点 | 缺点 |
| --- | --- | --- |
| 细粒度 | 灵活组合 | 调用次数多，链路复杂 |
| 粗粒度 | 调用简单 | 灵活性差，参数臃肿 |

经验法则：一个工具做一件事，但不要拆得太细。`read_file` 是好的粒度，`read_file_line_42` 就太细了。

### Q: 工具定义需要版本控制吗？

需要。工具定义和实现应该一起版本控制。参数变更时，要考虑向后兼容性。

## 下一步

→ [安全边界与权限控制](/guide/tool-use/safety)
