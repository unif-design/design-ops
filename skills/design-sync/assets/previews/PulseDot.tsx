import * as React from 'react';
import { View } from 'react-native';
import { PulseDot, useColors } from '@unif/react-native-design';

export const StatusDots = () => {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
      <PulseDot size={8} color={c.primary} />
      <PulseDot size={10} color={c.success} />
      <PulseDot size={12} color={c.error} />
      <PulseDot size={10} color={c.info} duration={1200} />
    </View>
  );
};
