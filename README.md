# design-ops

将 `@unif/react-native-design` 同步到 [claude.ai/design](https://claude.ai/design) 的运维技能，供设计系统维护者使用。

## 安装与使用

```sh
claude plugin marketplace add unif-design/design-ops
claude plugin install design-ops@design-ops
```

调用 `/design-ops:design-sync` 开始同步。更新 marketplace 使用 `claude plugin marketplace update design-ops`。

## 资料入口

| 内容           | 位置                                         |
| -------------- | -------------------------------------------- |
| 同步流程       | [design-sync](skills/design-sync/SKILL.md)   |
| 运行适配脚本   | [scripts](skills/design-sync/scripts/)       |
| 组件预览与约定 | [assets](skills/design-sync/assets/)         |
| 环境准备与排错 | [references](skills/design-sync/references/) |

脚本和预览在同步时进入目标项目的 `.design-sync/`。本仓库负责设计工具接入；Portal 和组件库研发使用 [unif-portal-dev-skills](https://github.com/unif-skill/unif-portal-dev-skills)。
