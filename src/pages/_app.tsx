import { InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { getMarkupFromTree } from "@apollo/client/react/ssr";
import { AppContext, AppProps } from "next/app";
import React, { useRef } from "react";
import { renderToString } from "react-dom/server.browser";
import { AuthContainer } from "../components/AuthConteiner.tsx";
import { LoadingContainer } from "../components/LoadingContainer";
import { NotificationContainer } from "../components/Notification/NotificationContainer";
import { ApolloCustomProvider } from "../libs/ApolloCustomProvider";
import { SystemContext } from "../libs/SystemContext";
import { getJwtInfo } from "../libs/SystemContext/reducer";

const App = (
  props: AppProps & {
    token?: string;
    refresh?: string;
    cache?: NormalizedCacheObject;
    memoryCache?: InMemoryCache;
  }
) => {
  const { Component, cache, memoryCache, token, refresh } = props;
  const user = getJwtInfo(token);
  return (
    <SystemContext.Provider value={{ auth: { token, refresh, user } }}>
      <ApolloCustomProvider cache={cache} memoryCache={memoryCache}>
        <AuthContainer />
        <Component />
        <NotificationContainer />
        <LoadingContainer />
      </ApolloCustomProvider>
    </SystemContext.Provider>
  );
};

App.getInitialProps = async ({ Component, router, ctx }: AppContext) => {
  if (typeof window !== "undefined") return {};

  const token = ctx.req?.headers.cookie?.match(
    "supabase_token" + "=([^\\s;]+)"
  )?.[1];
  const refresh = ctx.req?.headers.cookie?.match(
    "supabase_refresh" + "=([^\\s;]+)"
  )?.[1];

  const memoryCache = new InMemoryCache();
  await getMarkupFromTree({
    tree: (
      <App
        Component={Component}
        pageProps={undefined}
        router={router}
        cache={{}}
        token={token}
        refresh={refresh}
        memoryCache={memoryCache}
      />
    ),
    renderFunction: renderToString,
  }).catch(() => {});
  return { cache: memoryCache.extract(), token, refresh };
};

export default App;
