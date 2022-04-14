import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { getMarkupFromTree } from "@apollo/client/react/ssr";
import { AppContext, AppProps } from "next/app";
import React, { useMemo } from "react";
const { renderToReadableStream } = require("react-dom/server.browser");
const URI_ENDPOINT = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ApiKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const App = (
  props: AppProps & {
    cache?: NormalizedCacheObject;
    memoryCache?: InMemoryCache;
  }
) => {
  const { Component, cache, memoryCache } = props;
  const client = useMemo(
    () =>
      new ApolloClient({
        uri: URI_ENDPOINT,
        cache: memoryCache || new InMemoryCache().restore(cache || {}),
        headers: { apiKey: ApiKey! },
      }),
    []
  );
  return (
    <ApolloProvider client={client}>
      <Component />
    </ApolloProvider>
  );
};

App.getInitialProps = async ({ Component, router }: AppContext) => {
  if (typeof window !== "undefined") return {};
  const memoryCache = new InMemoryCache();
  await getMarkupFromTree({
    tree: (
      <App
        Component={Component}
        pageProps={undefined}
        router={router}
        cache={{}}
        memoryCache={memoryCache}
      />
    ),
    renderFunction: renderToReadableStream,
  }).catch(() => {});
  return { cache: memoryCache.extract() };
};
export default App;
