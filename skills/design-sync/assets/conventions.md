# Unif 设计系统 · 使用约定

## 介绍

这是 **React Native 手机端**设计系统,通过 `react-native-web` 在浏览器里渲染。所有组件都是
`@unif/react-native-design` 的真实上游代码,不是重新实现。

**按手机屏布局**:组件预览一律按 iPhone 逻辑宽度 390 设计。做原型时把内容放进 390–430 宽的
容器里,不要按桌面宽度铺开 —— NavBar / TabBar / Cell / Form 这类组件横向拉满后,比例与真机
完全不同。

## 快速上手

**必须包两层 provider,顺序不能反:**

```jsx
const { SafeAreaProvider, ThemeProvider, Button } = window.UnifDesign;

<SafeAreaProvider>
  <ThemeProvider>
    <Button label="提交" variant="primary" onPress={submit} />
  </ThemeProvider>
</SafeAreaProvider>
```

- 缺 `ThemeProvider`:`useColors()` / `useThemedStyles()` 取不到 context,组件退化成无主题样式。
- 缺 `SafeAreaProvider`:`ToastHost` 等组件调 `useSafeAreaInsets` 会直接抛
  `No safe area value available`,整棵树渲染不出来。
- `ThemeProvider` 可传 `forceScheme="light" | "dark"` 强制外观,`fontScale` 调整应用级字号倍数。

## 样式写法

**没有 CSS class,也不要写 `var(--*)`** —— 这是 React Native,样式是 JS 对象,通过 `style`
prop 传。取值必须走 token,**禁止硬编码 hex / rgba**。

```jsx
const { useColors, useThemedStyles, space, radius, type, fw } = window.UnifDesign;

// 行内取色。布局容器用 div —— window.UnifDesign 只导出设计系统组件,
// View / Text 属于 react-native,浏览器运行时里没有。
const c = useColors();
<div style={{ backgroundColor: c.surface, padding: space[4], borderRadius: radius.lg }} />

// 复用样式:maker 定义在模块顶层,不要写在组件体内
const makeStyles = (c) => ({
  card: { backgroundColor: c.surfaceContainer, borderColor: c.outline, borderWidth: 1 },
  title: { color: c.foreground, fontSize: type.h3, fontWeight: fw.semi },
});
const styles = useThemedStyles(makeStyles);
```

**token 词汇表**(全部来自 `window.UnifDesign`):

| 类别 | 取值 |
|---|---|
| `useColors()` 品牌 | `primary` `primaryPressed` `primaryContainer` `onPrimary` |
| `useColors()` 语义 | `success` `error` `info` + 各自的 `*Container` / `on*` |
| `useColors()` 表面 | `background` `surface` `surfaceContainer` `surfaceContainerHigh` `surfaceContainerHighest` |
| `useColors()` 文字 | `foreground` `foregroundMuted` `foregroundSubtle` `onSurface` `onSurfaceMuted` |
| `useColors()` 描边 | `outline` `outlineVariant` `outlineFaint` |
| `useColors()` 反色 | `inverseSurface` `inverseOnSurface` `scrim` |
| `space` | `space[1]`…`space[10]`、`space.px` |
| `radius` | `xs` `sm` `md` `lg` `xl` `2xl` `3xl` `pill` |
| `type`(字号) | `display` `h1` `h2` `h3` `body` `sm` `xs` `xxs` `micro` `nano` |
| `fw`(字重) | `regular` `medium` `semi` `bold` `heavy` |
| `control`(控件高) | `sm` `md` `lg` |
| 其他 | `icon` `avatar` `dim` `fixed` `motion` `pressedOpacity` `blur` `BRAND_ORANGE` |

图标用 `<Icon name="..." size={20} />`,共 118 个,名字是 kebab-case(`arrow-left` `chat-star`
`edit-pencil` `spark` …),完整清单见 `components/基础组件/Icon/Icon.prompt.md`。

## 进阶用法

- **组件分六类**:基础 / 表单 / 反馈 / 展示 / 导航 / 业务,目录即分类。
- **先读组件文档再写**:`components/<分类>/<组件名>/<组件名>.prompt.md` 有完整的中文 API 表、
  用法示例与无障碍要求;`<组件名>.d.ts` 是类型契约。
- **设计规范**在 `guidelines/`(设计原则、语气、禁忌、间距圆角阴影、字体、动效),做整屏布局前先读。
- **无障碍是硬要求**:交互组件必带 `accessibilityLabel`;icon-only 按钮(`IconButton`)的
  `accessibilityLabel` 必填。
- **界面文案一律简体中文**,不要写英文占位或 `foo` / `test`。

## 已知限制

`Search` 组件在浏览器里**不渲染文本**(包括 placeholder)—— 它内部的 `searchLayout` 布局计算
在 react-native-web 下塌陷。搜索框的外形正常,但里面的字看不见。需要可见文字的搜索场景,
改用 `Input` 配 `leading={{ kind: 'icon', icon: 'search' }}`。

## 一个完整例子

```jsx
const { SafeAreaProvider, ThemeProvider, NavBar, List, Cell, Tag,
        useColors, space } = window.UnifDesign;
// 布局用 div,控件用设计系统组件 —— 这是浏览器运行时里的正确分工。

function CustomerList() {
  const c = useColors();
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <div style={{ width: 390, minHeight: '100%', backgroundColor: c.background }}>
          <NavBar title="我的客户" subtitle="共 128 家"
                  left={{ icon: 'arrow-left', onPress: goBack, accessibilityLabel: '返回' }} />
          <div style={{ padding: space[4] }}>
            <List>
              <Cell title="张记便利店" desc="朝阳区建国路 88 号"
                    extra={{ kind: 'text', value: '¥1,200' }} arrow onPress={open} />
              <Cell title="李记超市" desc="海淀区中关村大街 1 号"
                    extra={{ kind: 'display', node: <Tag label="VIP 客户" variant="brand" /> }}
                    arrow onPress={open} />
            </List>
          </div>
        </div>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```
