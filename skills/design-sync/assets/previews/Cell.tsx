import * as React from 'react';
import { Cell, List, Switch } from '@unif/react-native-design';

const noop = () => {};

export const SettingsList = () => (
  <List>
    <Cell
      title="主题"
      leading="settings"
      extra={{ kind: 'text', value: '跟随系统' }}
      arrow
      onPress={noop}
    />
    <Cell
      title="拜访提醒"
      desc="按计划自动推送"
      extra={{
        kind: 'control',
        node: <Switch value onChange={noop} accessibilityLabel="拜访提醒" />,
      }}
    />
    <Cell title="版本" extra={{ kind: 'text', value: '4.0.0' }} />
  </List>
);

export const FlushInCard = () => (
  <List flush>
    <Cell
      title="张记便利店"
      desc="朝阳区建国路 88 号"
      extra={{ kind: 'text', value: '¥1,200' }}
      arrow
      onPress={noop}
    />
    <Cell
      title="李记超市"
      desc="海淀区中关村大街 1 号"
      extra={{ kind: 'text', value: '¥860' }}
      arrow
      onPress={noop}
    />
  </List>
);

export const RowStates = () => (
  <List>
    <Cell title="今天的拜访" leading="calendar" selected arrow onPress={noop} />
    <Cell title="注销账号" leading="logout" danger onPress={noop} />
    <Cell title="历史归档" extra={{ kind: 'text', value: '不可用' }} disabled />
  </List>
);
