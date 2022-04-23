import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import React, { useEffect, useMemo, useRef } from "react";
import { useUpdateToken } from "../hooks/useLogin";
const URI_ENDPOINT = process.env.NEXT_PUBLIC_SUPABASE_URL + "/graphql/v1";
const ApiKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
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
  const property = useRef({ memoryCache, token: auth?.token, cache }).current;
  property.token = auth?.token;
  useUpdateToken();
  useEffect(() => {
    return () => {
      property.memoryCache?.reset();
    };
  }, [auth?.user?.sub]);
  const client = useMemo(() => {
    if (!property.memoryCache) {
      property.memoryCache = new InMemoryCache().restore(property.cache || {});
    }
    const link = new HttpLink({
      uri: URI_ENDPOINT,
      headers: { apiKey: ApiKey! },
    });
    const activityMiddleware = setContext((v) => {
      return property.token
        ? {
            headers: {
              Authorization: `Bearer ${property.token}`,
            },
          }
        : {};
    });
    const client = new ApolloClient({
      uri: URI_ENDPOINT,
      link: from([activityMiddleware, link]),
      cache: property.memoryCache!,
    });
    return client;
  }, []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
