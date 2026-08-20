import * as React from 'react';
import { View } from 'react-native';
import { Chip, Icon } from '@unif/react-native-design';

const noop = () => {};
const row = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  alignItems: 'center',
} as const;

export const Selection = () => (
  <View style={row}>
    <Chip label="待跟进" selected onPress={noop} />
    <Chip label="已完成" onPress={noop} />
    <Chip label="已取消" onPress={noop} />
  </View>
);

export const WithIcons = () => (
  <View style={row}>
    <Chip
      label="今天的安排"
      leading={<Icon name="spark" size={12} />}
      onPress={noop}
    />
    <Chip
      label="王经理"
      selected
      trailing={<Icon name="close" size={12} />}
      onPress={noop}
    />
  </View>
);

export const StaticAndBusy = () => (
  <View style={row}>
    <Chip label="VIP" />
    <Chip
      label="今日拜访计划"
      leading={<Icon name="spark" size={12} />}
      busy
      onPress={noop}
    />
  </View>
);
