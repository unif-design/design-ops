import * as React from 'react';
import { View } from 'react-native';
import { Tag } from '@unif/react-native-design';

export const Variants = () => (
  <View
    style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      alignItems: 'center',
    }}
  >
    <Tag label="VIP 客户" variant="brand" />
    <Tag label="已完成" variant="success" />
    <Tag label="已取消" variant="error" />
    <Tag label="新单" variant="info" />
    <Tag label="待跟进" variant="neutral" />
  </View>
);
