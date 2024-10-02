import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getAPICall } from '@/lib/apiManager';
import { Row, Statistic, Table, Typography } from 'antd';
import type { TableColumnsType } from 'antd';

interface DataType {
  key: React.Key;
  Date: number;
  Description: number;
  Amount: string;
  Claim: boolean;
  // Settle: Boolean;
}

export default function TransactionsPage() {
  const [outstanding, setOutstanding] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    const res = await getAPICall('transactions');
    const { data } = res;
    console.log(data);
    if (data && data.length) {
      setTransactions(data);
      const unsettledAmt = data.reduce(
        (acc: number, obj: { Amount: string }) => {
          return (acc += parseFloat(obj.Amount));
        },
        0
      );
      console.log(unsettledAmt);
      setOutstanding(unsettledAmt);
    }
    // setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAmountDisplay = (amount: number) => {
    const commonProps = {
      precision: 2,
      prefix: '$',
      value: amount,
      valueStyle: {
        fontSize: '16px',
        color: amount < 0 ? '#cf1322' : 'auto',
      },
    };
    return <Statistic {...commonProps} />;
  };

  const cols: TableColumnsType<DataType> = [
    {
      key: 'Date',
      title: 'Date',
      dataIndex: 'Date',
      render: (v: string) => {
        return dayjs(v, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('DD MMM YYYY');
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
        return v === true ? 'Yes' : '';
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
        return v === true ? 'Yes' : '';
      },
    },
  ];

  return (
    <>
      <Row style={{ gap: 8 }}>
        <Typography>Current Oustanding:</Typography>
        {getAmountDisplay(outstanding)}
      </Row>
      <Table
        columns={cols}
        dataSource={transactions}
        scroll={{ x: 500, y: '60vh' }}
        pagination={false}
      />
    </>
  );
}
