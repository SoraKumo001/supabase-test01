import { createClient } from "@supabase/supabase-js";
import { useCallback, useState } from "react";
import { useSystemDispatch } from "./useSystemDispatch";

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
  }, []);
  return { login, logout, loading, error };
};
