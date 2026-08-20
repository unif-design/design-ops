import * as React from 'react';
import { TabBar } from '@unif/react-native-design';

const noop = () => {};

export const FourTabs = () => (
  <TabBar
    active="home"
    onChange={noop}
    items={[
      { id: 'home', icon: 'home', label: '首页' },
      { id: 'visits', icon: 'location', label: '拜访', badge: 3 },
      { id: 'agent', icon: 'spark', label: 'AI' },
      { id: 'me', icon: 'user', label: '我的' },
    ]}
  />
);

export const ActiveOnAgent = () => (
  <TabBar
    active="agent"
    onChange={noop}
    items={[
      { id: 'home', icon: 'home', label: '首页' },
      { id: 'visits', icon: 'location', label: '拜访', badge: 12 },
      { id: 'agent', icon: 'spark', label: 'AI' },
      { id: 'me', icon: 'user', label: '我的' },
    ]}
  />
);
