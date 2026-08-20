// RN 库假设这两个全局存在;浏览器里没有,得自己注入。
// 必须是 CJS:ESM 的 import 会被提升到模块顶部,赋值语句反而落在依赖之后。
// CJS 的 body 在被 require 的那一刻按序执行,所以由 web-entry.mjs 第一行 import 它,
// 就能保证 react-native-web 与全部 design 组件模块求值时二者已就位。
// __DEV__:lib/module 里 7 处引用,顶层的都有 typeof 保护,组件函数体内 4 处是裸用。
// global:react-native-web 及几个 RN 库在模块顶层读写它(website 的 rn-globals.ts 同款注入)。
globalThis.__DEV__ ??= false;
globalThis.global ??= globalThis;
