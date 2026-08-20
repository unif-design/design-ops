import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@unif/react-native-design';

const noop = () => {};
const row = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
} as const;

export const Variants = () => (
  <View style={row}>
    <Button label="主按钮" variant="primary" onPress={noop} />
    <Button label="次按钮" variant="secondary" onPress={noop} />
    <Button label="ghost" variant="ghost" onPress={noop} />
    <Button label="中性" variant="neutral" onPress={noop} />
    <Button label="描边" variant="outline" onPress={noop} />
    <Button label="危险" variant="danger" onPress={noop} />
    <Button label="文字" variant="text" onPress={noop} />
  </View>
);

export const Sizes = () => (
  <View style={row}>
    <Button label="Small" size="sm" onPress={noop} />
    <Button label="Medium" size="md" onPress={noop} />
    <Button label="Large" size="lg" onPress={noop} />
  </View>
);

export const States = () => (
  <View style={row}>
    <Button label="禁用" disabled onPress={noop} />
    <Button label="加载中" loading onPress={noop} />
  </View>
);

export const WithIcons = () => (
  <View style={row}>
    <Button label="扫码" leftIcon="scan" onPress={noop} />
    <Button label="下一步" rightIcon="chevron-right" onPress={noop} />
    <Button
      label="编辑"
      variant="outline"
      leftIcon="edit-pencil"
      onPress={noop}
    />
  </View>
);
