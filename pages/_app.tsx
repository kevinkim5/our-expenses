import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";

// function App({ Component, pageProps }) {
//   return (
//     <ConfigProvider>
//       <SessionProvider session={pageProps.session}>
//         <Component {...pageProps} />
//       </SessionProvider>
//     </ConfigProvider>
//   );
// }

// export default App;

// import { ConfigProvider } from 'antd';
import type { AppProps } from "next/app";

import theme from "./theme/themeConfig";

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  </ConfigProvider>
);

export default App;
