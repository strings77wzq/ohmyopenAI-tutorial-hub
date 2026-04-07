# Mock Server 使用说明

Mock Server 让你在不消耗真实 API 额度的情况下跑测试。

## 为什么要用 Mock

- 降低成本
- 提高可重复性
- 隔离外部波动

## 基本流程

1. 启动 Mock Server
2. 将测试请求指向 mock 地址
3. 执行场景并评估

```bash
# 示例
python harness/mock_server/server.py
pytest
```

## 常见配置

- 固定响应（Happy Path）
- 错误响应（429/500）
- 延迟响应（模拟超时）

## 最佳实践

- 用固定 seed 保证结果稳定
- 将 mock 数据版本化
- 真实 API 只做少量冒烟验证

## 下一步

→ [Harness 实战案例](/guide/harness/practice)
