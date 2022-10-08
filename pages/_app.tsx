import "../styles/globals.css";
import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import Layout from "@components/Layout";
import { Provider } from "react-redux";
import store from "@redux/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        primaryColor: "yellow",
        primaryShade: 6,
        components: {
          Input: {
            styles: (theme) => ({
              input: {
                backgroundColor: theme.colors.dark[7],
              },
            }),
          },
        },
      }}
    >
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </MantineProvider>
  );
}

export default MyApp;
