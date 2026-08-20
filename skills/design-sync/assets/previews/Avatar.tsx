import * as React from 'react';
import { View } from 'react-native';
import { Avatar } from '@unif/react-native-design';

export const Variants = () => (
  <View
    style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      alignItems: 'center',
    }}
  >
    <Avatar label="AI" variant="brand" />
    <Avatar label="我" variant="info" />
    <Avatar label="王" variant="soft" />
    <Avatar label="P" variant="neutral" />
  </View>
);

export const Sizes = () => (
  <View
    style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      alignItems: 'center',
    }}
  >
    <Avatar label="小" variant="brand" size="sm" />
    <Avatar label="中" variant="brand" size="md" />
    <Avatar label="大" variant="brand" size="lg" />
  </View>
);
