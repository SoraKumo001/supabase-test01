import { createClient } from "@supabase/supabase-js";
import { useCallback, useState } from "react";
import { useLoading } from "../../hooks/useLoading";
import { useLogin } from "../../hooks/useLogin";
import { useNotification } from "../../hooks/useNotification";
import { useSystemSelector } from "../../hooks/useSystemSelector";
import styled from "./index.module.scss";

export const AuthContainer = () => {
  const { login, logout, loading, error } = useLogin();
  const user = useSystemSelector((v) => v.auth?.user);
  useLoading([loading]);
  useNotification(error);
  return (
    <div className={styled.root}>
      <div className={styled.title}>
        supabase GraphQL Test{" "}
        <a href="https://github.com/SoraKumo001/supabase-test01">
          https://github.com/SoraKumo001/supabase-test01
        </a>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement & {
            email: HTMLInputElement;
            password: HTMLFormElement;
            logout: HTMLButtonElement;
          };
          if (!form.logout) {
            const email = form.email.value;
            const password = form.password.value;
            login(email, password);
          } else {
            logout();
          }
        }}
      >
        {!user?.sub ? (
          <>
            <button key="login" id="login">
              Login
            </button>
            <input
              id="email"
              placeholder="email"
              defaultValue="a@example.com"
            />
            <input
              id="password"
              type="password"
              placeholder="password"
              defaultValue="a"
            />
            <span> ← ID1:a@example.com PASSWORD:a</span>
            <span> ID2:b@example.com PASSWORD:b</span>
          </>
        ) : (
          <div>
            <button key="logout" id="logout">
              Logout
            </button>
            <span className={styled.userName}>{user.email}</span>
          </div>
        )}
      </form>
    </div>
  );
};
