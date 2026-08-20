# 踩坑与已知限制

## 组件级限制

**`Search` 不渲染任何文本**,包括 `placeholder`。输入框外形、放大镜、清除按钮都正常,就是字看不见。
根因是内部 `searchLayout` 的布局计算在 react-native-web 下塌陷,不是预览写错 ——
`defaultValue` 与受控 `value` 都试过。预览只呈现空态,不做伪装;
`conventions.md` 里已让设计 agent 改用 `Input` 配 `leading={{ kind: 'icon', icon: 'search' }}`。
真机是否同样待查。

**`ToastHost` 是命令式 API**,自身不渲染内容。预览里主动 `toast({...})`,
并把 `duration` 顶到 600000,免得默认 3000ms 在截图前就 fade 掉。

**缺 `SafeAreaProvider` 会整棵树渲染不出来**。`ToastHost` 一类组件调 `useSafeAreaInsets`
定位,没有 provider 直接抛 `No safe area value available`
(`react-native-design` 文档站的 webpack 插件注释里记着同一个坑)。
所以 `web-entry.mjs` 额外导出 `SafeAreaProvider`,`cfg.provider` 把它包在 `ThemeProvider` 外层。

**reanimated 在浏览器里是工作的**。尽管 esbuild 不跑 worklets babel 插件,
PulseDot / Pulse / Reveal / Toast 入场动画实测都正常 —— 不必为此改预览。

## 会误报的警告

这两条记在案,re-sync 时对照,**不是新问题**:

- `[RENDER_THIN] Icon` —— Icon 只渲染 SVG 不含文字,触发了检查器的文本启发式。
  截图确认 10 个图标 + 三档尺寸 + 语义色全部正常绘制。
- `[CSS_RUNTIME]` ×2 —— RN 是 CSS-in-JS,样式由 react-native-web 运行时注入,本包不 ship 静态样式表。
  `styles.css` 是自说明的占位。

## 配置陷阱

**`.design-sync/package.json` 刻意不写 `name`**。converter 靠「向上找第一个有 `name` 的
package.json」定位 `PKG_DIR`,写了 name 会让它误判成 `.design-sync/`,
所有 package-relative 路径跟着错、版本变 `0.0.0`。这个文件只需要 `{"sideEffects": true}` ——
`react-native-design` 根 package.json 的 `sideEffects: ["*.css"]`
会让 esbuild 摇掉 `rn-globals.cjs` 的副作用 import。

**tsconfig 只能用块注释**。converter 剥离行注释的正则是 `/(^|[^:])\/\/.*$/gm`,
会把 `"//": "..."` 这种 JSON 注释 key 整行截断 → 解析失败 → paths 插件静默返回 null →
alias 完全不生效 → esbuild 去啃 RN 的 Flow 源码报一堆语法错。

**文档镜像有 8KB 截断**。`Carousel` / `Cell` / `List` / `Stepper` 的原文档超上限被截尾,
要点若在文末会丢,必要时把关键段落前移。

## re-sync 风险

1. **`localize-groups.mjs` 漏跑 = 分类回退**。它不在 `cfg.buildCmd` 里(必须在 converter 之后),
   任何一次 `package-build.mjs` 或 `preview-rebuild.mjs` 都会把目录和 `@dsCard` 重置回英文分组。
2. **`groups.mjs` 的组件表是手工维护的**。设计系统新增组件后表里没有它,
   `build-docs.mjs` 不给它文档、`localize-groups.mjs` 打印「分类表里没有 X」并把它留在原分组。
3. **`renderHashFor` 跳过 HTML 首行**(只取其中的 `viewport` 属性参与哈希),
   所以单改 `@dsCard` 的 group 不影响校验哈希;但**移动目录**会让它按 `.stories-map.json`
   里的旧 group 找不到文件 —— 那份 map 必须同步更新。
4. **派生物每次都要重建**:`.design-sync/{docs,web-dist}/` 由 `cfg.buildCmd` 生成,新克隆后先跑它。
