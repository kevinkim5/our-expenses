import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

import theme from "./theme/themeConfig";

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <SessionProvider session={pageProps.session}>
      <div style={{ padding: "16px" }}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  </ConfigProvider>
);

export default App;
