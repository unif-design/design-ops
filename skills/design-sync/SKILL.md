---
name: design-sync
description: >
  Use when 把 @unif/react-native-design 同步到 claude.ai/design(首次导入、项目丢失后重建、
  设计系统发版后重跑、给组件补预览卡片、改分类或画框),或排查同步产物的渲染 / 分类 / 哈希异常。
  它给 Anthropic 自带的 design-sync skill 补上 React Native 跑浏览器运行时所需的适配层。
  Do NOT use for 设计系统本身的组件 API 与 token(用 unif 套件的 design skill),
  也不用于同步原生 Web 的设计系统(converter 直接支持,不需要本 skill)。
license: MIT
---

# design-sync:把 RN 设计系统同步到 claude.ai/design

Anthropic 自带的 `/design-sync` 负责通用流程,本 skill 只补它缺的那一层 ——
**React Native 组件跑在浏览器运行时**。两者叠加:先按本 skill 备料,再进 `/design-sync`。

目标项目是团队共用的 `Unif Design System`:
`https://claude.ai/design/p/b91fedf7-4bb4-4048-aae0-dd653a4a9081`

## 何时使用

| 场景 | 入口 |
|---|---|
| 首次同步 / 项目丢失后重建 | 「快速开始」跑完整流程 |
| 设计系统发版后重跑 | 同上,`cfg.buildCmd` 已含全部预处理 |
| 给基础卡片的组件补预览 | 写 `.design-sync/previews/<Name>.tsx`,见 [references/previews.md](references/previews.md) |
| 新增了组件 | **先改 `scripts/groups.mjs` 的分类表**,否则它会留在原分组 |
| 渲染 / 分类 / 哈希出问题 | [references/pitfalls.md](references/pitfalls.md) |

## 快速开始

在 `react-native-design` 仓库根执行。前四步是备料,之后交给 `/design-sync`。

```sh
# 1. 铺适配层(本 skill 的 scripts 与 assets → 仓库的 gitignore 目录)
mkdir -p .design-sync/previews
cp <skill>/scripts/* .design-sync/
cp <skill>/assets/conventions.md .design-sync/
cp <skill>/assets/previews/*.tsx .design-sync/previews/

# 2. 写 config
cat > .design-sync/config.json <<'JSON'
{
  "pkg": "@unif/react-native-design",
  "globalName": "UnifDesign",
  "shape": "package",
  "projectId": "b91fedf7-4bb4-4048-aae0-dd653a4a9081",
  "srcDir": "src",
  "tsconfig": ".design-sync/tsconfig.web.json",
  "readmeHeader": ".design-sync/conventions.md",
  "docsDir": ".design-sync/docs",
  "guidelinesGlob": ["website/docs/design/*.md", "website/docs/design/**/*.md"],
  "buildCmd": "yarn prepare && node .design-sync/build-docs.mjs && node .design-sync/build-viewports.mjs && node .design-sync/build-web-entry.mjs",
  "provider": {
    "component": "SafeAreaProvider",
    "props": { "initialMetrics": { "frame": {"x":0,"y":0,"width":390,"height":844}, "insets": {"top":0,"left":0,"right":0,"bottom":0} } },
    "inner": { "component": "ThemeProvider", "props": {} }
  }
}
JSON

# 3. gitignore —— 产物与适配层一律不入库,它们由本 skill 提供
printf '%s\n' '.ds-sync/' 'ds-bundle/' '.design-sync/' >> .gitignore

# 4. 备料
yarn prepare && node .design-sync/build-docs.mjs \
  && node .design-sync/build-viewports.mjs && node .design-sync/build-web-entry.mjs
```

然后进 `/design-sync`,它会把 converter stage 到 `.ds-sync/` 并跑 build。
**每次 `package-build.mjs` 或 `preview-rebuild.mjs` 之后都要补一步**:

```sh
node .design-sync/localize-groups.mjs   # 归位中文分类 + 同步哈希
node .ds-sync/package-validate.mjs ./ds-bundle
```

`--node-modules` 一律指向 `website/node_modules`,**不是仓库根** ——
根那份是 native 侧的,没有 `react-dom`、没有 `react-native-web`。

## 核心模式

### RN → 浏览器:预打包,不 fork converter

claude.ai/design 在浏览器里渲染,而组件 `import 'react-native'`。converter 的 esbuild
没有 platform-resolution 的配置口子,而 fork 它的 `lib/bundle.mjs` 被明令禁止 ——
那文件定义与 claude.ai/design 自检的输出契约。

所以 `build-web-entry.mjs` 先把 `lib/module` 打成自包含的纯 Web ESM,再作为 `--entry` 喂进去,
converter 拿到的已经没有任何 RN 依赖。三条规则逐条对应
`website/src/plugins/docusaurus-rnw/index.js` 里被验证过的 webpack 配置:

| webpack(文档站现役) | esbuild(预打包) |
|---|---|
| `resolve.extensions` 前置 `.web.*` | `resolveExtensions` |
| `'react-native$': 'react-native-web'` | `rn-web` 插件精确匹配 |
| `'react-native/Libraries': false` | `rn-empty` namespace 置空 |

**改任一边前先看另一边,两者必须同义。**

`__DEV__` / `global` 由 `rn-globals.cjs` 注入,被 `web-entry.mjs` 第一行 import ——
必须是 CJS,ESM 的 import 会提升到模块顶部、赋值反而落在依赖之后。

### 分类:ASCII 定分组,中文改标签

converter 有两个限制,所以分类分两阶段落地:

1. 它把 frontmatter 的 `category` 做 `[^a-z0-9]+` slug 化,**中文被整段清成空串、分类直接失效**。
2. 它只在组件原分组是 `general` / `misc` 时才应用 category ——
   `List`(源码在 `Cell/` 下)、`ConfirmHost`、`PulseDot` 这类会保留源码目录名。

于是 `build-docs.mjs` 写进文档镜像的是 ASCII slug,build 之后由 `localize-groups.mjs`
统一归位并换中文标签:移目录、改每个预览 HTML 首行的 `@dsCard group`(组件面板按它分组)、
同步 `.stories-map.json` 与 `_ds_sync.json` 的哈希、把 README 的英文章节改中文。脚本幂等。

六个分类在 `scripts/groups.mjs`,是唯一事实源:基础 / 表单 / 反馈 / 展示 / 导航 / 业务。

### 画框:iPhone 390

`build-viewports.mjs` 给全部组件配 `cardMode: 'column'` + `viewport: '390x<H>'`。
converter 默认的 900×700 是桌面画框,会把 NavBar / TabBar / Cell / Form 这类全宽组件横向拉满 ——
**设计 agent 照着那种卡片布局,产出的原型比例就是错的**。

高度按预览里的场景数分档(`280 + n*150`,封顶 820;没写预览的占位卡 360)。

## 易错点(Incorrect / Correct)

**跑完 build 忘了归位分类**,分组会回退成英文:

```sh
# Incorrect —— 分类回退,@dsCard 变回 general/cell/confirm…
node .ds-sync/package-build.mjs … && node .ds-sync/package-validate.mjs ./ds-bundle

# Correct
node .ds-sync/package-build.mjs … && node .design-sync/localize-groups.mjs \
  && node .ds-sync/package-validate.mjs ./ds-bundle
```

**先 build 再格式化预览**,评分会被清空、白跑一轮:

```sh
# Incorrect —— 格式化改了编译产物字节 → renderHash 变 → sourceKey 变 → 评分清空
node .ds-sync/package-build.mjs … && ./node_modules/.bin/eslint .design-sync/previews --fix

# Correct —— design 仓的 lefthook 会 lint 预览文件,先过格式再 build
./node_modules/.bin/eslint .design-sync/previews --fix && node .ds-sync/package-build.mjs …
```

**tsconfig 用 `"//"` 当注释**,paths 插件会静默失效、esbuild 去啃 RN 的 Flow 源码:

```jsonc
// Incorrect —— converter 剥离行注释的正则会把这行整行截断,JSON 解析失败
{ "//": "让 react-native 解析到 react-native-web", "compilerOptions": { … } }

// Correct —— 只能用块注释
/* 让 react-native 解析到 react-native-web */
{ "compilerOptions": { … } }
```

## 参考

- [references/setup.md](references/setup.md) —— 环境准备:playwright 版本对应、依赖安装、软链
- [references/pitfalls.md](references/pitfalls.md) —— 踩坑与已知限制:组件级问题、误报警告、re-sync 风险
- [references/previews.md](references/previews.md) —— 写预览:取材顺序、评分标准、难渲染组件的处理

## 调用示例

```text
把设计系统同步到 claude.ai/design
给 Segmented 和 Switch 补预览卡片
新加了 Banner 组件,同步一下
组件面板里分类乱了,查一下
```
