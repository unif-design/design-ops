# design-ops

设计系统运维 skills —— 把 `@unif` 设计系统同步到 [claude.ai/design](https://claude.ai/design)。

## 为什么独立于 unif 套件

[`unif-design/skills`](https://github.com/unif-design/skills) 是**技术栈开发规范**,
装它的人在写业务代码;而这里是**设计系统运维流程**,只有维护设计系统、
往 claude.ai/design 发布的人需要。

更关键的是:那个仓的立仓之本是「面向所有 harness 发布,内容不点名任何一家」,
校验会拦下 `claude` / `Anthropic` 字眼。而本仓的 skill 天生绑定一家 ——
它的全部意义就是同步到 claude.ai/design,连目标 URL 都是。两者放不到一起。

## 安装

```sh
claude plugin marketplace add unif-design/design-ops
claude plugin install design-ops@design-ops
```

调用即 `/design-ops:design-sync`。

marketplace 更新后刷新:

```sh
claude plugin marketplace update design-ops
```

## 含哪些 skill

| skill | 做什么 |
|---|---|
| [`design-sync`](skills/design-sync/SKILL.md) | `@unif/react-native-design` → claude.ai/design:React Native 跑浏览器运行时的适配层、组件分类、iPhone 画框与预览卡片 |

## 结构

```text
skills/design-sync/
├── SKILL.md              流程与核心模式
├── scripts/              适配层脚本,拷进目标仓的 .design-sync/ 后运行
├── assets/previews/      22 个手写的组件预览
├── assets/conventions.md 给设计 agent 的中文使用约定
└── references/           环境准备 / 踩坑 / 写预览
```

skill 的 `scripts/` 与 `assets/` 不是文档,是**会被拷进目标仓库运行的代码** ——
设计系统仓库本身不留这些文件,同步时由本 skill 提供。
