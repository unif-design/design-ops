import * as React from 'react';
import { View } from 'react-native';
import { ToastHost, toast } from '@unif/react-native-design';

/* toast 是命令式 API,ToastHost 自身不渲染内容 —— 预览里主动发一条,并把
   duration 顶到很大,免得默认 3000ms 在截图前就 fade 掉。
   SafeAreaProvider 由 cfg.provider 在外层统一提供(ToastHost 内部调
   useSafeAreaInsets 定位,缺 provider 会直接抛)。 */
const stage = { height: 140 } as const;

export const SuccessToast = () => {
  React.useEffect(() => {
    toast({ message: '订单提交成功', kind: 'success', duration: 600000 });
  }, []);
  return (
    <View style={stage}>
      <ToastHost />
    </View>
  );
};

export const ErrorToast = () => {
  React.useEffect(() => {
    toast({ message: '网络异常,请重试', kind: 'error', duration: 600000 });
  }, []);
  return (
    <View style={stage}>
      <ToastHost />
    </View>
  );
};
