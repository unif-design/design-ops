import * as React from 'react';
import { View } from 'react-native';
import { Icon, useColors } from '@unif/react-native-design';

const row = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 16,
  alignItems: 'center',
} as const;

export const CommonIcons = () => (
  <View style={row}>
    <Icon name="home" size={22} />
    <Icon name="search" size={22} />
    <Icon name="calendar" size={22} />
    <Icon name="location" size={22} />
    <Icon name="user" size={22} />
    <Icon name="settings" size={22} />
    <Icon name="bell" size={22} />
    <Icon name="scan" size={22} />
    <Icon name="camera" size={22} />
    <Icon name="spark" size={22} />
  </View>
);

export const SizesAndColors = () => {
  const c = useColors();
  return (
    <View style={row}>
      <Icon name="send" size={14} />
      <Icon name="send" size={20} />
      <Icon name="send" size={28} />
      <Icon name="check" size={20} color={c.success} />
      <Icon name="error" size={20} color={c.error} />
      <Icon name="close" size={20} color={c.foregroundSubtle} strokeWidth={2} />
    </View>
  );
};
