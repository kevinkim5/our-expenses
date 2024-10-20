import { useEffect, useState } from 'react'
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import type { TableColumnsType } from 'antd'
import {
  Button,
  DatePicker,
  message,
  Popconfirm,
  Row,
  Statistic,
  Table,
  Typography,
} from 'antd'

import Loader from '@/components/Loader'
import { deleteAPICall, getAPICall } from '@/lib/apiManager'
import { convertDateStrToDayjs } from '@/utils/helpers'

const { RangePicker } = DatePicker

interface DataType {
  key: React.Key
  _id: string
  Date: string
  Description: number
  Amount: string
  Claim: boolean
  Settle: boolean
}

export default function TransactionsPage() {
  const [dateLastSettled, setDateLastSettled] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [outstanding, setOutstanding] = useState(0)
  const [transactions, setTransactions] = useState([])

  const fetchData = async () => {
    const res = await getAPICall('transactions')
    const { data } = res
    console.log(data)
    if (data && data.length) {
      setTransactions(data)
      const unsettledAmt = data.reduce((acc: number, obj: DataType) => {
        if (obj.Settle && dateLastSettled === null) setDateLastSettled(obj.Date)
        return (acc += parseFloat(obj.Amount))
      }, 0)
      console.log(unsettledAmt)
      setOutstanding(unsettledAmt)
    }
    setLoading(false)
  }

  const onDelete = async (record: Partial<DataType>) => {
    try {
      setLoading(true)
      const res = await deleteAPICall(`delete?id=${record._id}`)
      message.success({ content: 'Deleted successfully!' })
      fetchData()
    } catch (err) {
      console.error(err)
      setLoading(false)
      message.error({ content: 'Failed to delete, please try again!' })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getAmountDisplay = (amount: number) => {
    const commonProps = {
      precision: 2,
      prefix: '$',
      value: amount,
      valueStyle: {
        fontSize: '16px',
        color: amount < 0 ? '#cf1322' : 'auto',
      },
    }
    return <Statistic {...commonProps} />
  }

  const cols: TableColumnsType<DataType> = [
    {
      key: 'Date',
      title: 'Date',
      dataIndex: 'Date',
      render: (v: string) => {
        return convertDateStrToDayjs(v).format('DD MMM YYYY')
      },
      sorter: (a, b) =>
        convertDateStrToDayjs(a.Date).unix() -
        convertDateStrToDayjs(b.Date).unix(),
    },
    {
      key: 'Description',
      title: 'Description',
      dataIndex: 'Description',
    },
    {
      key: 'Amount',
      title: 'Amount',
      dataIndex: 'Amount',
      width: 120,
      render: (v: number) => getAmountDisplay(v),
    },
    {
      key: 'Claim',
      title: 'Claim',
      dataIndex: 'Claim',
      render: (v: boolean) => {
        return v === true ? 'Yes' : ''
      },
      filters: [
        {
          text: 'Yes',
          value: true,
        },
      ],
      onFilter: (value, record) => record.Claim === value,
    },
    {
      key: 'Settle',
      title: 'Settle',
      dataIndex: 'Settle',
      render: (v: boolean) => {
        return v === true ? 'Yes' : ''
      },
    },
    {
      title: '',
      dataIndex: 'Delete',
      render: (_: any, record: DataType) => {
        return (
          <Popconfirm
            title="Confirm Delete?"
            okText="Yes"
            okButtonProps={{ danger: true }}
            cancelText="No"
            onConfirm={() => onDelete(record)}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button icon={<DeleteOutlined />} danger type="link" />
          </Popconfirm>
        )
      },
    },
  ]

  return (
    <Loader loading={loading}>
      <Row style={{ gap: 8 }}>
        <Typography>Current Oustanding:</Typography>
        {getAmountDisplay(outstanding)}
      </Row>
      <Row style={{ gap: 8 }}>
        <Typography>Date Last Settled:</Typography>
        {dateLastSettled}
      </Row>
      <RangePicker format="YYYY-MM-DD" />
      <Table
        columns={cols}
        dataSource={transactions}
        scroll={{ x: 500, y: '60vh' }}
        pagination={false}
      />
    </Loader>
  )
}
