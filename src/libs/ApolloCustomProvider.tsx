import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import React, { createContext, useMemo, useRef } from "react";
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
export const ApolloCustomProvider = ({
  memoryCache,
  cache,
  children,
}: Props) => {
  const token = useSystemSelector((v) => v.auth?.token);
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
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

// export const useToken = (token?: string) => {
//   const dispatch = useContext(context);
//   const oldToken = useRef(token);
//   useEffect(() => {
//     let newToken = token;
//     if (token) {
//       const exp = (jwt_decode(token) as { exp: number })?.exp;
//       if (exp) {
//         const date = new Date();
//         const now = date.getTime();
//         date.setUTCMilliseconds(exp);
//         if (date.getTime() < now) {
//           newToken = undefined;
//         }
//       }
//     }
//     dispatch(newToken);
//     document.cookie = newToken
//       ? `supabase_token=${newToken}; max-age=3600`
//       : "supabase_token=; max-age=0";
//   }, [token]);

//   if (typeof window === "undefined") {
//     if (oldToken.current !== token) {
//       dispatch(token);
//       oldToken.current = token;
//     }
//   }
// };
