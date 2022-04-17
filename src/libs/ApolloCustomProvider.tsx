import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
export const ApolloCustomProvider = ({
  memoryCache,
  cache,
  children,
}: Props) => {
  const [token, setToken] = useState<string>();
  const cacheRef = useRef(cache);
  const client = useMemo(() => {
    const client = new ApolloClient({
      uri: URI_ENDPOINT,
      cache: memoryCache || new InMemoryCache().restore(cacheRef.current || {}),
      headers: token
        ? { apiKey: ApiKey!, Authorization: `Bearer ${token}` }
        : { apiKey: ApiKey! },
    });
    cacheRef.current = undefined;
    return client;
  }, [token]);
  return (
    <context.Provider value={setToken}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </context.Provider>
  );
};

export const useToken = (token?: string) => {
  const dispatch = useContext(context);
  const oldToken = useRef(token);
  useEffect(() => {
    dispatch(token);
  }, [token]);

  if (typeof window === "undefined") {
    if (oldToken.current !== token) {
      dispatch(token);
      oldToken.current = token;
    }
  }
};
