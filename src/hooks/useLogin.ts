import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { useSystemDispatch } from "./useSystemDispatch";
import { useSystemSelector } from "./useSystemSelector";

export const useLogin = () => {
  const dispatch = useSystemDispatch();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const login = useCallback((email: string, password: string) => {
    setLoading(true);
    setError(undefined);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!
    );
    supabase.auth.signIn({ email, password }).then((v) => {
      setLoading(false);
      setError(v.error?.message);
      const token = v.session?.access_token;
      const refresh = v.session?.refresh_token;
      dispatch({
        type: "setToken",
        payload: {
          token: token,
          refresh: refresh,
        },
      });
      document.cookie = token
        ? `supabase_token=${token}; max-age=3600`
        : "supabase_token=; max-age=0";
      document.cookie = refresh
        ? `supabase_refresh=${refresh}; max-age=3600`
        : "supabase_refresh=; max-age=0";
    });
  }, []);
  const logout = useCallback(() => {
    dispatch({
      type: "setToken",
      payload: {
        token: undefined,
        refresh: undefined,
      },
    });
    document.cookie = "supabase_token=; max-age=0";
    document.cookie = "supabase_refresh=; max-age=0";
  }, []);
  return { login, logout, loading, error };
};

export const useUpdateToken = () => {
  const refresh = useSystemSelector((v) => v.auth?.refresh);
  const dispatch = useSystemDispatch();
  useEffect(() => {
    if (refresh) {
      const handle = setInterval(() => {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_KEY!
        );
        supabase.auth.setSession(refresh);
        supabase.auth.refreshSession().then((v) => {
          const token = v.data?.access_token;
          const refresh = v.data?.refresh_token;
          dispatch({
            type: "setToken",
            payload: {
              token: token,
              refresh: refresh,
            },
          });
          document.cookie = token
            ? `supabase_token=${token}; max-age=3600`
            : "supabase_token=; max-age=0";
          document.cookie = refresh
            ? `supabase_refresh=${refresh}; max-age=3600`
            : "supabase_refresh=; max-age=0";
        });
      }, 10 * 60 * 1000);
      return () => clearInterval(handle);
    }
  }, [refresh]);
};

export const useTableTrigger = (tableName: string, onUpdate: () => void) => {
  const token = useSystemSelector((v) => v.auth?.token);
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!
    );
    token && supabase.auth.setAuth(token);
    const realtime = supabase.from(tableName).on("*", onUpdate).subscribe();
    return () => {
      realtime.unsubscribe();
    };
  }, [token]);
};
