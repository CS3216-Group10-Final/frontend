import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import type { AppProps } from "next/app";
import Layout from "@components/Layout";
import { Provider } from "react-redux";
import store from "@redux/store";
import { ModalsProvider } from "@mantine/modals";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

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
