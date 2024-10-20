import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ConfigProvider, Layout } from 'antd'

import NavBar from '@/components/NavBar'
import theme from '@/theme/themeConfig'

const contentStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  padding: 16,
  height: 'calc(100vh - 64px - 48px)',
  // width: "calc(50% - 8px)",
  // maxWidth: "calc(50% - 8px)",
}

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#001529',
}

const { Header, Footer, Content } = Layout

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Header style={{ padding: '0px 24px' }}>
          <NavBar />
        </Header>
        <Content style={contentStyle}>
          <Component {...pageProps} />
        </Content>
        <Footer style={footerStyle} />
      </Layout>
    </SessionProvider>
  </ConfigProvider>
)

export default App
