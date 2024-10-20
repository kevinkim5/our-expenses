import { useEffect, useState } from 'react'
import type { TableColumnsType } from 'antd'
import { DatePicker, Row, Statistic, Table, Typography } from 'antd'
import dayjs from 'dayjs'

import Loader from '@/components/Loader'
import { getAPICall } from '@/lib/apiManager'

const { RangePicker } = DatePicker

interface DataType {
  key: React.Key
  Date: number | string
  Description: number
  Amount: string
  Claim: boolean
  Settle: boolean
}

export default function TransactionsPage() {
  const [dateLastSettled, setDateLastSettled] = useState(null)
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
        return dayjs(v, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('DD MMM YYYY')
      },
      sorter: (a, b) => a.Date - b.Date,
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
