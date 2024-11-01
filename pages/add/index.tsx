import React, { useEffect, useState } from 'react'
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Layout,
  message,
  Radio,
  RadioChangeEvent,
  Space,
  Switch,
} from 'antd'
import dayjs, { Dayjs } from 'dayjs'

import Loader from '@/components/Loader'
import { DAYJS_TO_STR_Z_FORMAT, FORM_TYPES, PEOPLE } from '@/constants/common'
import { postAPICall } from '@/lib/apiManager'

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 18 },
  },
}

interface Record {
  _id: string
  Date: string
  Description: number
  Amount: string
  Claim: boolean
  Settle: boolean
}

interface AddTransactionFormProps {
  onCancel?: () => void
  onSave?: (record: Partial<Record> & { Date: Dayjs }) => void
  record?: Record
}

export default function AddTransactionForm(props: AddTransactionFormProps) {
  const { onCancel, onSave, record } = props

  console.log(record?.Settle)

  const [formType, setFormType] = useState(FORM_TYPES.EXPENSE)
  const [loading, setLoading] = useState<boolean>(false)
  const [submittable, setSubmittable] = useState<boolean>(false)

  const [form] = Form.useForm()
  const values = Form.useWatch([], form)

  const handleChange = () => {
    console.log(form.getFieldsValue())
  }

  const handleRadioChange = (e: RadioChangeEvent) => {
    setFormType(e.target.value)
    form.resetFields()
    form.setFieldValue('Date', dayjs())
  }

  const handleSubmit = async () => {
    setLoading(true)

    const paidBy = form.getFieldValue('PaidBy')
    const submitParams = {
      type: formType,
      ...form.getFieldsValue(),
      Date: form.getFieldValue('Date').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    }

    if (formType === FORM_TYPES.SETTLE) {
      submitParams['Description'] = 'Settle'
      submitParams['Settle'] = true
    } else if (formType === FORM_TYPES.EXPENSE) {
    }
    if (paidBy === PEOPLE.JAC) {
      submitParams['Amount'] *= -1
    }

    const res = await postAPICall('add', submitParams)
    if (res.status === 200) {
      message.success({
        style: { top: 64 },
        content: 'Added Successfully!',
      })
    } else {
      message.error({
        content: 'Failed to add, please try again!',
      })
    }

    setLoading(false)
    resetForm()
  }

  const resetForm = () => {
    form.resetFields()
    form.setFieldValue('Date', dayjs())
    form.setFieldValue(
      'PaidBy',
      formType === FORM_TYPES.EXPENSE ? PEOPLE.KEV : PEOPLE.JAC
    )
    if (formType === FORM_TYPES.SETTLE) {
      form.setFieldValue('Description', 'Settle')
    }
    form.setFieldValue('Claim', false)
  }

  useEffect(() => {
    resetForm()
  }, [formType])

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false))
  }, [form, values])

  useEffect(() => {
    if (record) {
      let amount = parseFloat(record?.Amount) || 0

      if (record?.Settle) {
        setFormType(FORM_TYPES.SETTLE)
        amount *= -1
      } else {
        setFormType(FORM_TYPES.EXPENSE)
      }

      form.setFieldsValue({
        Amount: amount,
        Claim: record?.Claim,
        Date: dayjs(record?.Date, DAYJS_TO_STR_Z_FORMAT),
        Description: record?.Description,
        PaidBy: parseFloat(record?.Amount) < 0 ? 'Jac' : 'Kev',
      })
    }
  }, [record])

  return (
    <Loader loading={loading}>
      <Layout>
        <Radio.Group
          buttonStyle="solid"
          onChange={handleRadioChange}
          value={formType}
          style={{ marginBottom: 16 }}
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
            <InputNumber<number> prefix="$" precision={2} />
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
          {!record ? (
            <Form.Item wrapperCol={{ span: 12 }}>
              <Space>
                <Button
                  type="primary"
                  disabled={!submittable}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                <Button htmlType="reset">Reset</Button>
              </Space>
            </Form.Item>
          ) : (
            <Form.Item wrapperCol={{ span: 12 }}>
              <Space>
                <Button
                  onClick={() => {
                    if (onCancel) onCancel()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  disabled={!submittable}
                  onClick={() => {
                    if (onSave) onSave(form.getFieldsValue())
                  }}
                >
                  Save
                </Button>
              </Space>
            </Form.Item>
          )}
        </Form>
      </Layout>
    </Loader>
  )
}
