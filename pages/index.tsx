import { useEffect } from 'react'
// import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { Typography } from 'antd'

import LoginPage from '@/components/LoginPage'
import { AUTH_STATUS } from '@/constants/common'

const { Title } = Typography

export default function IndexPage() {
  // const router = useRouter()
  const { data, status } = useSession()

  useEffect(() => {
    // if (status === AUTH_STATUS.AUTH) router.push('transactions')
  }, [status])

  return (
    <>
      <Title>Expenses Tracker</Title>
      {status === AUTH_STATUS.LOADING ? (
        <Title level={2}>Loading... Please wait</Title>
      ) : status === AUTH_STATUS.AUTH ? (
        <div>
          <h1> Hi {data?.user?.name}</h1>
          <img
            src={data?.user?.image || ''}
            alt={data?.user?.name + ' photo'}
          />
          <button onClick={() => signOut()}>sign out</button>
        </div>
      ) : (
        <LoginPage />
      )}
    </>
  )
}
