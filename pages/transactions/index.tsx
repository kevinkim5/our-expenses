import { useEffect, useState } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import type { TableColumnsType } from 'antd'
import {
  Button,
  DatePicker,
  message,
  Modal,
  Popconfirm,
  Row,
  Statistic,
  Table,
  Typography,
} from 'antd'
import { Dayjs } from 'dayjs'
import { isEqual, omit } from 'lodash'

import Loader from '@/components/Loader'
import { DAYJS_TO_STR_Z_FORMAT } from '@/constants/common'
import { deleteAPICall, getAPICall, postAPICall } from '@/lib/apiManager'
import AddTransactionForm from '@/pages/add'
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

interface ObjectToSend {
  [key: string]: string | number | bigint | boolean | undefined
}

export default function TransactionsPage() {
  const [dateLastSettled, setDateLastSettled] = useState<string>('')
  const [editingRecord, setEditingRecord] = useState<DataType | undefined>(
    undefined
  )
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
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
        return (acc += parseFloat(obj.Amount) || 0)
      }, 0)
      console.log(unsettledAmt)
      setOutstanding(unsettledAmt)
    }
    setLoading(false)
  }

  const onDelete = async (record: Partial<DataType>) => {
    try {
      setLoading(true)
      await deleteAPICall(`delete?id=${record._id}`)
      message.success({ content: 'Deleted successfully!' })
      fetchData()
    } catch (err) {
      console.log('error: ', err)
    }
  }

  const onEdit = (record: DataType) => {
    setEditingRecord(record)
    setIsEditModalOpen(true)
  }

  const onEditCancel = () => {
    setIsEditModalOpen(false)
    setEditingRecord(undefined)
  }

  const onEditSave = async (
    editedRecord: Partial<DataType> & { Date: Dayjs }
  ) => {
    const editedDate = editedRecord?.Date?.format(DAYJS_TO_STR_Z_FORMAT) || ''
    const recToUpdate: ObjectToSend = omit(
      { ...editingRecord, ...editedRecord, Date: editedDate },
      'PaidBy'
    )
    setIsEditModalOpen(false)

    if (isEqual(recToUpdate, editingRecord)) {
      message.warning({ content: 'Nothing was changed, nothing to save!' })
    } else if (editingRecord) {
      setLoading(true)
      const differences = Object.keys(recToUpdate).filter(
        (key: string) =>
          recToUpdate[key] !== editingRecord?.[key as keyof DataType]
      )

      if (recToUpdate._id) {
        const objToSend: ObjectToSend = {}
        differences.forEach(
          (key: string) => (objToSend[key] = recToUpdate[key])
        )
        console.log(objToSend)

        const res = await postAPICall(
          `/update?id=${recToUpdate._id}`,
          objToSend
        )
        message.success({ content: res.message })
      } else {
        message.error({ content: 'Failed to update, please try again!' })
      }
      fetchData()
    }
  }

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
        return convertDateStrToDayjs(v).format('DD MMM YY')
      },
      sorter: (a, b) =>
        convertDateStrToDayjs(a.Date).unix() -
        convertDateStrToDayjs(b.Date).unix(),
      fixed: true,
    },
    {
      key: 'Description',
      title: 'Desc',
      dataIndex: 'Description',
      fixed: true,
    },
    {
      key: 'Amount',
      title: 'Amount',
      dataIndex: 'Amount',
      render: (v: number) => getAmountDisplay(v),
      fixed: true,
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
      filters: [
        {
          text: 'Yes',
          value: true,
        },
      ],
      onFilter: (value, record) => record.Claim === value,
      render: (v: boolean) => {
        return v === true ? 'Yes' : ''
      },
    },
    {
      title: 'Edit',
      dataIndex: 'Edit-2',
      render: (_: string, record: DataType) => {
        return (
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            type="link"
          />
        )
      },
    },
    {
      title: '',
      dataIndex: 'Delete',
      render: (_: string, record: DataType) => {
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

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Loader loading={loading}>
      <Modal
        closable={false}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        open={isEditModalOpen}
      >
        <AddTransactionForm
          record={editingRecord}
          onSave={onEditSave}
          onCancel={onEditCancel}
        />
      </Modal>
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
        pagination={false}
        scroll={{ x: 500, y: '60vh' }}
        tableLayout="auto"
      />
    </Loader>
  )
}
