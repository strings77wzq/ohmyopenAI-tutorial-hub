# 常见问题

## OpenSpec 会不会太重？

小需求可以轻量使用；复杂需求越早规范越省返工。

## Skill 与 Tool 的关系？

Skill 负责"思考策略"，Tool 负责"执行动作"。

## Harness 一定要接真实 API 吗？

不需要。推荐先用 Mock 回归，再做少量真实 API 冒烟。

## 命令没有反应

确保在项目根目录执行，且已初始化 OpenSpec（`openspec init`）。

## 规范与代码不同步

每次变更后执行 `verify` + 同步规范文档。