# OpenSpec 实战案例：电商 MVP

本章用一个最小可运行电商项目演示 OpenSpec 的完整落地。

## 目标

- 用一套 Spec 同时驱动 Node.js 与 Python 两套实现
- 覆盖商品、购物车、订单三条主流程
- 通过 tasks 拆分并逐步实现

## Step 1：提出变更

```bash
/opsx:propose "实现电商 MVP：商品、购物车、订单"
```

AI 生成：

- `proposal.md`：目标与范围
- `design.md`：模块与 API 设计
- `specs/`：需求与场景
- `tasks.md`：实现清单

## Step 2：规范示例

```markdown
### Requirement: 用户可以浏览商品
系统 SHALL 提供商品列表接口。

#### Scenario: 获取商品列表
- **WHEN** 用户请求 GET /products
- **THEN** 返回商品数组
```

```markdown
### Requirement: 用户可以创建订单
系统 SHALL 支持从购物车创建订单。

#### Scenario: 下单成功
- **GIVEN** 购物车存在商品
- **WHEN** 用户请求 POST /orders
- **THEN** 创建订单并清空购物车
```

## Step 3：实现（Apply）

```bash
/opsx:apply
```

建议实现顺序：

1. 商品接口（读/写）
2. 购物车接口（增删查）
3. 订单接口（创建/查询）
4. 单元与集成测试

## Step 4：验证

```bash
/opsx:verify
```

验证要点：

- 需求是否全部覆盖
- 场景是否可复现
- 测试是否通过

## Step 5：归档

```bash
/opsx:archive
```

归档后可得到完整变更历史，便于复盘与复用。

## 你将学到什么

- 如何把“想法”收敛成可执行规范
- 如何让 AI 稳定执行而不是“凭感觉写代码”
- 如何用同一规范驱动多语言实现
