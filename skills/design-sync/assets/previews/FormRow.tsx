import * as React from 'react';
import { View } from 'react-native';
import { FormRow, Input, Switch } from '@unif/react-native-design';

const noop = () => {};

export const States = () => (
  <View style={{ gap: 8 }}>
    <FormRow label="姓名" required>
      <Input defaultValue="王经理" accessibilityLabel="姓名" />
    </FormRow>
    <FormRow label="手机号" error="格式不正确">
      <Input
        defaultValue="1380000"
        keyboardType="phone-pad"
        accessibilityLabel="手机号"
      />
    </FormRow>
    <FormRow label="接收提醒">
      <Switch value onChange={noop} accessibilityLabel="接收提醒" />
    </FormRow>
  </View>
);
