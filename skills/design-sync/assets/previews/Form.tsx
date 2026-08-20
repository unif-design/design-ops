import * as React from 'react';
import {
  Form,
  FormGroup,
  FormRow,
  Input,
  Switch,
} from '@unif/react-native-design';

const noop = () => {};

export const CustomerForm = () => (
  <Form>
    <FormGroup label="基本信息">
      <FormRow label="姓名" required>
        <Input defaultValue="王经理" placeholder="请输入" />
      </FormRow>
      <FormRow label="手机号" error="格式不正确">
        <Input defaultValue="1380000" keyboardType="phone-pad" />
      </FormRow>
    </FormGroup>
    <FormGroup label="拜访设置">
      <FormRow label="提醒">
        <Switch value onChange={noop} accessibilityLabel="提醒" />
      </FormRow>
    </FormGroup>
  </Form>
);
