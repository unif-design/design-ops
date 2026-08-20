import * as React from 'react';
import { View } from 'react-native';
import { EntryCard } from '@unif/react-native-design';

const noop = () => {};

export const GridPair = () => (
  <View style={{ flexDirection: 'row', gap: 10 }}>
    <EntryCard
      icon="settings"
      title="设置"
      sub="账号 / 通知 / 权限"
      onPress={noop}
      style={{ flex: 1 }}
    />
    <EntryCard
      icon="info"
      title="关于 Unif"
      sub="V 4.0.0"
      onPress={noop}
      style={{ flex: 1 }}
    />
  </View>
);

export const Single = () => (
  <EntryCard
    icon="clipboard-user"
    title="我的客户"
    sub="共 128 家,今日待访 6 家"
    onPress={noop}
  />
);
