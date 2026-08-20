import * as React from 'react';
import { View } from 'react-native';
import { Search } from '@unif/react-native-design';

const noop = () => {};

/* 只呈现空态:Search 在 react-native-web 下不渲染已有值的文字(defaultValue 与受控
   value 都试过 —— 清除按钮会出现,说明组件内部认为有值,但输入框里是空的)。
   展示一个「有清除按钮却看不见值」的卡片会误导设计 agent,所以这里只给真实可渲染的形态。
   详见 NOTES.md。 */
export const Basic = () => (
  <View style={{ gap: 12 }}>
    <Search
      placeholder="搜索客户名称或编号"
      onSubmit={noop}
      accessibilityLabel="搜索客户"
    />
    <Search
      placeholder="搜索订单号 / 商品条码"
      onSubmit={noop}
      accessibilityLabel="搜索订单"
    />
  </View>
);
