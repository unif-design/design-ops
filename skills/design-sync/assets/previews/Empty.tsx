import * as React from 'react';
import { Empty } from '@unif/react-native-design';

export const Greeting = () => (
  <Empty title="你好,我是 AI 助手" desc="告诉我你今天的工作目标,我来帮你规划" />
);

export const NoData = () => (
  <Empty title="今天还没有拜访计划" desc="点右上角「新建」添加第一个客户拜访" />
);
