import * as React from 'react';
import { View } from 'react-native';
import { Textarea } from '@unif/react-native-design';

export const Basic = () => (
  <View style={{ gap: 12 }}>
    <Textarea placeholder="填写本次拜访小结" minHeight={100} maxHeight={240} />
    <Textarea
      defaultValue="客户反馈货架陈列需要调整,已拍照记录,下周复访确认。"
      minHeight={100}
    />
  </View>
);

export const WithError = () => (
  <Textarea
    placeholder="填写本次拜访小结"
    minHeight={100}
    error="拜访小结不能为空"
  />
);
