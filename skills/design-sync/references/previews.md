# 写预览

`assets/previews/` 里已有 22 个,拷进 `.design-sync/previews/` 直接用。
本文讲**怎么给还是基础卡片的组件补新的**。

## 取材顺序

按这个顺序找素材,越靠前越可信:

1. `website/docs/components/<name>.mdx` 的「## 用法」段 —— 作者手写的真实组合,直接移植
2. 组件的 `.d.ts` 契约(`ds-bundle/components/<分类>/<Name>/<Name>.d.ts`)
3. 组件源码的 JSDoc

文档示例可能滞后于 API,移植前拿 `.d.ts` 对一遍 props。

## 形态

每个具名导出 = 卡片里的一格 = 一个独立评分单元。每个组件 **2–6 个导出**,覆盖:

- 一个规范用法(文档的 hero 示例)
- 主变体轴扫描(最影响外观的那个 enum prop)
- 可静态渲染的状态(`disabled` / `loading` / `error` / 选中)
- 复合组件给真实组合(List 套 Cell、Form 套 FormRow + Input)

```tsx
import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@unif/react-native-design';

const noop = () => {};

export const Variants = () => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
    <Button label="主按钮" variant="primary" onPress={noop} />
    <Button label="次按钮" variant="secondary" onPress={noop} />
  </View>
);
```

**文案一律用真实业务内容**,不写 `foo` / `test` —— 这些卡片会被人浏览,也会被设计 agent 照着模仿。

预览里可以 `import { View } from 'react-native'`:`cfg.tsconfig` 的 paths 让它解析到
react-native-web,所以写法与 RN 工程一致,示例能直接复制回项目。

## 难渲染的组件

| 情况 | 做法 |
|---|---|
| 需要图片源(`Logo`) | 就地生成 base64 SVG 占位,颜色取 `BRAND_ORANGE` token。**不要用 `utf8` 形式的 data URI** —— 它在 CSS `background-image` 里还要再转义一层,实测不渲染 |
| 命令式 API(`ToastHost`) | `useEffect` 里主动触发,`duration` 顶到 600000 |
| 自动轮播(`Carousel`) | **不开 `autoplay`** —— 静态截图下每次抓到的帧会不一样 |
| 需要网络图 | 用 `useColors()` 取的色块代替,预览环境没有网络 |
| 交互才出现(hover / drag) | 跳过,在 pitfalls 里记一行 |

## 验收

```sh
./node_modules/.bin/eslint .design-sync/previews --fix        # 先格式化
node .ds-sync/lib/preview-rebuild.mjs --config … --components A,B
node .design-sync/localize-groups.mjs
node .ds-sync/package-capture.mjs --out ./ds-bundle --components A,B
```

然后**逐张看** `ds-bundle/_screenshots/review/<分类>__<Name>.png`,按三条打分:

- **有样式** —— 设计系统的 token 与字体确实生效,不是浏览器默认样式
- **完整** —— 组合渲染齐全,没有缺子元素、没有塌陷、没有 `⚠` 格
- **合理** —— 设计系统作者会认可这是个正常用法,变体轴确实在变

判定写进 `.design-sync/.cache/review/<Name>.grade.json`,键必须与 capture 打印的格名逐字一致:

```json
{ "cells": { "Variants": { "verdict": "good", "note": "7 个变体全部渲染且视觉可区分…" } } }
```

`needs-work` 是过程态,要改到 `good` 为止。
