import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import React, { createContext, useEffect, useMemo, useRef } from "react";
import { useUpdateToken } from "../hooks/useLogin";
const URI_ENDPOINT = process.env.NEXT_PUBLIC_SUPABASE_URL + "/graphql/v1";
const ApiKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const context = createContext<
  React.Dispatch<React.SetStateAction<string | undefined>>
>(undefined as never);
interface Props {
  children?: React.ReactNode;
  cache?: NormalizedCacheObject;
  memoryCache?: InMemoryCache;
}
import { useSystemSelector } from "../hooks/useSystemSelector";
import { setContext } from "@apollo/client/link/context";
export const ApolloCustomProvider = ({
  memoryCache,
  cache,
  children,
}: Props) => {
  const auth = useSystemSelector((v) => v.auth);
  const refMemoryCache = useRef(memoryCache);
  const cacheRef = useRef(cache);
  if (!refMemoryCache.current) {
    refMemoryCache.current = new InMemoryCache().restore(
      cacheRef.current || {}
    );
  }
  useUpdateToken(auth?.token);
  useEffect(() => {
    return () => {
      refMemoryCache.current?.reset();
    };
  }, [auth?.user?.sub]);
  const client = useMemo(() => {
    const link = new HttpLink({
      uri: URI_ENDPOINT,
      headers: { apiKey: ApiKey! },
    });
    const activityMiddleware = setContext((v) => {
      return auth?.token
        ? {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        : { headers: { apiKey: ApiKey! } };
    });
    const client = new ApolloClient({
      uri: URI_ENDPOINT,
      link: from([activityMiddleware, link]),
      cache: refMemoryCache.current!,
    });
    return client;
  }, [auth?.token]);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
