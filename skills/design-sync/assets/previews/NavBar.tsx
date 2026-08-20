import * as React from 'react';
import { View } from 'react-native';
import { NavBar } from '@unif/react-native-design';

const noop = () => {};

export const Variants = () => (
  <View style={{ gap: 16 }}>
    <NavBar
      title="AI 助手"
      subtitle="在线 · 已同步"
      left={{ icon: 'menu', onPress: noop, accessibilityLabel: '打开抽屉' }}
      right={{
        icon: 'more-h',
        onPress: noop,
        accessibilityLabel: '打开更多菜单',
      }}
    />
    <NavBar title="登录" variant="brand" />
    <NavBar
      title="我的名片"
      variant="transparent"
      left={{ icon: 'arrow-left', onPress: noop, accessibilityLabel: '返回' }}
    />
  </View>
);
