import Layout from "@components/Layout";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import store from "@redux/store";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Provider } from "react-redux";
import * as gtag from "../lib/gtag";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colors: {
            red: [
              "#f6a1a2",
              "#f48e8f",
              "#f27b7d",
              "#f1686a",
              "#ef5558",
              "#ed4245",
              "#d53b3e",
              "#be3537",
              "#a62e30",
              "#8e2829",
            ],
            green: [
              "#99dbbd",
              "#84d3af",
              "#70cca2",
              "#5bc595",
              "#47bd87",
              "#32b67a",
              "#2da46e",
              "#289262",
              "#237f55",
              "#1e6d49",
            ],
          },
          colorScheme: "dark",
          primaryColor: "yellow",
          primaryShade: 6,
          // fontFamily: "Quicksand, sans-serif",
          // headings: {
          //   fontFamily: "Quicksand, sans-serif",
          //   fontWeight: 700
          // },
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
          <NotificationsProvider>
            <ModalsProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ModalsProvider>
          </NotificationsProvider>
        </Provider>
      </MantineProvider>
    </>
  );
}

export default MyApp;
