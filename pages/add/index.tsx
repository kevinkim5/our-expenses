import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Switch,
  Radio,
  Layout,
  message,
  RadioChangeEvent,
} from 'antd';
import dayjs from 'dayjs';
import { postAPICall } from '@/lib/apiManager';
import { FORM_TYPES, PEOPLE } from '@/constants/common';
import LoadingOverlay from '@/components/LoadingOverlay';

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 18 },
  },
};

export default function AddTransactionForm() {
  const [formType, setFormType] = useState(FORM_TYPES.EXPENSE);
  const [submittable, setSubmittable] = useState<boolean>(false);

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const handleChange = () => {
    console.log(form.getFieldsValue());
  };

  const handleRadioChange = (e: RadioChangeEvent) => {
    setFormType(e.target.value);
    form.resetFields();
    form.setFieldValue('Date', dayjs());
  };

  const handleSubmit = async () => {
    console.log(form.getFieldsValue());
    // console.log(form.getFieldValue("Date").format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
    // const amount = form.getFieldValue("Amount");
    const paidBy = form.getFieldValue('PaidBy');

    const submitParams = {
      type: formType,
      ...form.getFieldsValue(),
      Date: form.getFieldValue('Date').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    };
    if (formType === FORM_TYPES.SETTLE) {
      submitParams['Description'] = 'Settle';
      submitParams['Settle'] = true;
    } else if (formType === FORM_TYPES.EXPENSE) {
    }
    if (paidBy === PEOPLE.JAC) {
      submitParams['Amount'] *= -1;
    }

    const res = await postAPICall('add', submitParams);
    console.log(res);
    console.log(res.status === 200);
    if (res.status === 200) {
      message.success({
        style: { top: 64 },
        content: 'Added Successfully!',
      });
    } else {
      message.error({
        content: 'Failed to add, please try again!',
      });
    }
  };

  useEffect(() => {
    form.setFieldValue('Date', dayjs());
    form.setFieldValue(
      'PaidBy',
      formType === FORM_TYPES.EXPENSE ? PEOPLE.KEV : PEOPLE.JAC
    );
    if (formType === FORM_TYPES.SETTLE) {
      form.setFieldValue('Description', 'Settle');
    }
  }, [formType]);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Layout>
      <Radio.Group
        buttonStyle="solid"
        onChange={handleRadioChange}
        value={formType}
      >
        <Radio.Button value={FORM_TYPES.EXPENSE}>Expense</Radio.Button>
        <Radio.Button value={FORM_TYPES.SETTLE}>Settle Up</Radio.Button>
      </Radio.Group>
      <Form
        form={form}
        onValuesChange={handleChange}
        variant={'outlined'}
        layout="horizontal"
        {...formItemLayout}
      >
        <LoadingOverlay />
        <Form.Item
          label="Date"
          name="Date"
          labelAlign="left"
          rules={[{ required: true, message: 'Please input!' }]}
        >
          <DatePicker format="DD MMM YYYY" />
        </Form.Item>
        {formType === FORM_TYPES.EXPENSE && (
          <Form.Item
            label="Description"
            name="Description"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item
          label="Amount"
          name="Amount"
          rules={[{ required: true, message: 'Please input!' }]}
        >
          <InputNumber<number> prefix="$" />
        </Form.Item>
        {formType === FORM_TYPES.EXPENSE && (
          <Form.Item label="Claim ?" name="Claim">
            <Switch />
          </Form.Item>
        )}
        <Form.Item label="Paid By" name="PaidBy">
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={PEOPLE.JAC}>{PEOPLE.JAC}</Radio.Button>
            <Radio.Button value={PEOPLE.KEV}>{PEOPLE.KEV}</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item style={{ gap: 4 }}>
          <Button type="primary" disabled={!submittable} onClick={handleSubmit}>
            Submit
          </Button>
          <Button htmlType="reset">Reset</Button>
        </Form.Item>
      </Form>
    </Layout>
  );
}
