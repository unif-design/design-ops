import * as React from 'react';
import { Text, View } from 'react-native';
import { Card, useColors } from '@unif/react-native-design';

export const Variants = () => (
  <View style={{ gap: 12 }}>
    <Card>
      <Text>默认卡片 —— 白底 + 卡片阴影</Text>
    </Card>
    <Card variant="plain">
      <Text>plain —— 仅圆角,无阴影无描边,用于嵌套</Text>
    </Card>
  </View>
);

export const StatusBorder = () => {
  const c = useColors();
  return (
    <View style={{ gap: 12 }}>
      <Card variant="plain" borderColor={c.primary}>
        <Text>确认要提交这笔订单吗?</Text>
      </Card>
      <Card variant="plain" borderColor={c.error}>
        <Text>该拜访任务已超时未完成</Text>
      </Card>
    </View>
  );
};
