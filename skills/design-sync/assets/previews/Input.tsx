import * as React from 'react';
import { View } from 'react-native';
import { Input } from '@unif/react-native-design';

const noop = () => {};
const col = { gap: 12 } as const;

export const Basic = () => (
  <View style={col}>
    <Input placeholder="请输入客户名称" />
    <Input defaultValue="张记便利店" />
  </View>
);

export const WithSlots = () => (
  <View style={col}>
    <Input
      defaultValue="建国路"
      leading={{ kind: 'icon', icon: 'search' }}
      trailing={{
        kind: 'action',
        icon: 'close',
        onPress: noop,
        accessibilityLabel: '清除搜索条件',
      }}
      accessibilityLabel="搜索条件"
    />
    <Input
      defaultValue="138 0000 0000"
      keyboardType="phone-pad"
      leading={{ kind: 'icon', icon: 'phone' }}
    />
  </View>
);

export const ErrorAndDisabled = () => (
  <View style={col}>
    <Input defaultValue="1380000" error="手机号需为 11 位" />
    <Input defaultValue="系统自动填充" disabled />
  </View>
);
