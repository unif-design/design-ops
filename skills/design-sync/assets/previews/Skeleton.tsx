import * as React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@unif/react-native-design';

export const ListItem = () => (
  <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
    <Skeleton shape="circle" size={40} />
    <View style={{ flex: 1, gap: 8 }}>
      <Skeleton shape="line" width="60%" height={14} />
      <Skeleton shape="line" width="80%" height={11} />
    </View>
  </View>
);

export const CardBlock = () => (
  <View style={{ gap: 10 }}>
    <Skeleton shape="rect" width="100%" height={120} radius={12} />
    <Skeleton shape="line" width="45%" height={14} />
  </View>
);
