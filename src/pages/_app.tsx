import { InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { getMarkupFromTree } from "@apollo/client/react/ssr";
import { AppContext, AppProps } from "next/app";
import React from "react";
import { renderToString } from "react-dom/server.browser";
import { AuthContainer } from "../components/AuthConteiner.tsx";
import { LoadingContainer } from "../components/LoadingContainer";
import { NotificationContainer } from "../components/Notification/NotificationContainer";
import { ApolloCustomProvider } from "../libs/ApolloCustomProvider";
import { SystemContext } from "../libs/SystemContext";

const App = (
  props: AppProps & {
    cache?: NormalizedCacheObject;
    memoryCache?: InMemoryCache;
  }
) => {
  const { Component, cache, memoryCache } = props;

  return (
    <SystemContext.Provider>
      <ApolloCustomProvider cache={cache} memoryCache={memoryCache}>
        <AuthContainer />
        <Component />
        <NotificationContainer />
        <LoadingContainer />
      </ApolloCustomProvider>
    </SystemContext.Provider>
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
    renderFunction: renderToString,
  }).catch(() => {});
  return { cache: memoryCache.extract() };
};
export default App;
