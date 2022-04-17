import { ActionFn, ActionType, ReducerType } from "./ActionTypes";
import jwt_decode from "jwt-decode";
const setLoading: ActionFn<{ loading?: number }, boolean> = (
  state,
  payload
) => {
  return {
    ...state,
    loading: (state.loading || 0) + (payload ? 1 : -1),
  };
};
const sendNotification: ActionFn<{ notification?: string[] }, string> = (
  state,
  payload
) => {
  return {
    ...state,
    notification: [...(state.notification || []), payload],
  };
};
const removeNotification: ActionFn<{ notification?: string[] }, void> = (
  state
) => ({
  ...state,
  notification: state.notification ? state.notification.slice(1) : undefined,
});
const setToken: ActionFn<
  {
    auth?: {
      user?: {
        email: string;
        exp: number;
        sub: string;
        user_metadata: unknown;
      };
      token?: string;
      refresh?: string;
    };
  },
  { token?: string; refresh?: string }
> = (state, payload) => {
  const user = getJwtInfo(payload.token);

  return {
    ...state,
    auth: { ...payload, user },
  };
};

export const reducers = {
  setLoading,
  sendNotification,
  removeNotification,
  setToken,
};

export const reducer = <T>(
  state: ReducerType<typeof reducers>,
  { type, payload }: ActionType<typeof reducers>
): T => reducers[type](state, payload as never) as T;

export const getJwtInfo = (token?: string) =>
  !token
    ? undefined
    : jwt_decode<{
        email: string;
        exp: number;
        sub: string;
        user_metadata: unknown;
      }>(token || "");
