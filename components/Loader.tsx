import { PropsWithChildren } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { createStyles } from 'antd-style'

const useStyles = createStyles(() => {
  return {
    loadingOverlay: {
      position: 'fixed',
      top: 64,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
  }
})

interface LoaderProps {
  loading: boolean
}

export default function Loader(props: PropsWithChildren<LoaderProps>) {
  const { loading } = props
  const { styles } = useStyles()
  return (
    <>
      {loading && (
        <div className={styles.loadingOverlay}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 72 }} spin />} />
        </div>
      )}
      {props.children}
    </>
  )
}
