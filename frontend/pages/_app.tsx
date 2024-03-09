import { QueryClient, QueryClientProvider } from "react-query";
import type { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { App as Providers } from "@/components/app-context";
import "@/styles/globals.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App({ Component, pageProps }: AppContext & AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=1280, initial-scale=1.0" />
        <title>Evergreen</title>
        <link rel="icon" href="/code-bracket.svg" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Providers>
          <main>
            <Component {...pageProps} />
          </main>
        </Providers>
      </QueryClientProvider>
    </>
  );
}
