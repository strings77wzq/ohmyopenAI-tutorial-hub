# 示例项目

实战示例项目，展示从规范到代码的完整工作流。

## 电商 MVP 项目

参考 [OpenSpec-practise](https://github.com/ForceInjection/OpenSpec-practise) 的电商场景，我们提供两套实现：

### 项目概述

一个简单的电商系统，包含：
- 商品管理（查询、创建）
- 购物车（添加、删除、查询）
- 订单（创建、查询）

### 多语言实现

| 语言 | 框架 | 目录 |
|------|------|------|
| Node.js | Express | `examples/ecommerce-nodejs/` |
| Python | FastAPI | `examples/ecommerce-python/` |

### 规范驱动

两套实现共享同一套 OpenSpec 规范：

```
openspec/
└── changes/
    └── v1-mvp/
        ├── proposal.md
        ├── design.md
        ├── specs/
        │   ├── api/spec.md
        │   └── domain/spec.md
        └── tasks.md
```

### 学习目标

通过本项目，你将学习：
1. 如何编写 OpenSpec 规范
2. 如何用同一规范驱动多语言实现
3. 如何编写单元测试和集成测试
4. 如何使用 Harness 评估质量

---

## 快速开始

### Node.js 版本

```bash
cd examples/ecommerce-nodejs
npm install
npm run dev
```

### Python 版本

```bash
cd examples/ecommerce-python
pip install -r requirements.txt
python -m uvicorn src.main:app --reload
```

---

## 项目结构

### Node.js

```
ecommerce-nodejs/
├── src/
│   ├── domain/      # 领域模型
│   ├── services/    # 业务逻辑
│   ├── http/        # API 接口
│   └── repo/        # 数据存储
├── tests/           # 测试
└── openspec/        # 规范文件
```

### Python

```
ecommerce-python/
├── src/
│   ├── domain/      # Pydantic 模型
│   ├── services/    # 业务逻辑
│   ├── api/         # FastAPI 路由
│   └── repo/        # 数据存储
├── tests/           # Pytest 测试
└── openspec/        # 规范文件
```

---

## API 接口

### 商品

```
GET    /api/v1/products        # 获取商品列表
GET    /api/v1/products/:id    # 获取商品详情
POST   /api/v1/products        # 创建商品（管理员）
```

### 购物车

```
GET    /api/v1/cart            # 获取购物车
POST   /api/v1/cart/items      # 添加商品到购物车
DELETE /api/v1/cart/items/:id  # 从购物车移除商品
```

### 订单

```
POST   /api/v1/orders          # 创建订单
GET    /api/v1/orders          # 获取订单列表
GET    /api/v1/orders/:id      # 获取订单详情
```

---

## 开始学习

选择一套实现开始学习：

- [Node.js 版本详解](./ecommerce-nodejs)
- [Python 版本详解](./ecommerce-python)
