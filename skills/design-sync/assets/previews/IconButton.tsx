import * as React from 'react';
import { View } from 'react-native';
import { IconButton } from '@unif/react-native-design';

const noop = () => {};
const row = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
  alignItems: 'center',
} as const;

export const Variants = () => (
  <View style={row}>
    <IconButton
      icon="scan"
      variant="neutral"
      accessibilityLabel="扫码"
      onPress={noop}
    />
    <IconButton
      icon="close"
      variant="ghost"
      accessibilityLabel="关闭"
      onPress={noop}
    />
    <IconButton
      icon="search"
      variant="primary"
      accessibilityLabel="搜索"
      onPress={noop}
    />
  </View>
);

export const Sizes = () => (
  <View style={row}>
    <IconButton
      icon="settings"
      size="sm"
      accessibilityLabel="设置"
      onPress={noop}
    />
    <IconButton
      icon="settings"
      size="md"
      accessibilityLabel="设置"
      onPress={noop}
    />
    <IconButton
      icon="settings"
      size="lg"
      accessibilityLabel="设置"
      onPress={noop}
    />
  </View>
);
