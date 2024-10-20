import React, { useEffect, useState } from 'react'
// import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { HomeOutlined,PlusOutlined, ProfileOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Menu, Row } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  {
    label: '',
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: 'View',
    key: '/transactions',
    icon: <ProfileOutlined />,
  },
  {
    label: 'Add',
    key: '/add',
    icon: <PlusOutlined />,
  },
]

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  // paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
}

export default function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  // const { status } = useSession();
  const [current, setCurrent] = useState<string>(pathname || '')
  console.log(pathname)

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
    router.push(e.key)
    setCurrent(e.key)
  }

  useEffect(() => {
    setCurrent(pathname || '')
  }, [pathname])

  return (
    <Row style={headerStyle}>
      <Menu
        theme="dark"
        mode="horizontal"
        // defaultSelectedKeys={["2"]}
        items={items}
        onClick={onClick}
        style={{ flex: 1, minWidth: 0 }}
        selectedKeys={[current]}
      />
    </Row>
  )
}
