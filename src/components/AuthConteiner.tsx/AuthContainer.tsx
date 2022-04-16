import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { Todo } from "../../generated/graphql";
import { useToken } from "../../libs/ApolloCustomProvider";
import styled from "./index.module.scss";

export const AuthContainer = () => {
  const [token, setToken] = useState<string>();
  const [error, setError] = useState<string>();
  useToken(token);
  return (
    <div className={styled.root}>
      <div className={styled.title}>supabase GraphQL Test</div>
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement & {
            email: HTMLInputElement;
            password: HTMLFormElement;
            logout: HTMLButtonElement;
          };
          if (!form.logout) {
            const supabase = createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.NEXT_PUBLIC_SUPABASE_KEY!
            );
            const email = form.email.value;
            const password = form.password.value;
            supabase.auth.signIn({ email, password }).then((v) => {
              setError(v.error?.message);
              setToken(v.session?.access_token);
            });
          } else {
            setToken(undefined);
          }
        }}
      >
        {!token ? (
          <>
            <button>Login</button>
            <input id="email" placeholder="email" />
            <input id="password" type="password" placeholder="password" />
            <span> ← ID:a@a PASSWORD:a</span>
            {error && <div className={styled.error}>{error}</div>}
          </>
        ) : (
          <button id="logout">Logout</button>
        )}
      </form>
    </div>
  );
};
