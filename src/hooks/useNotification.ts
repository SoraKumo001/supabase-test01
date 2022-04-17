import { useEffect } from "react";
import { useSystemDispatch } from "./useSystemDispatch";

export const useNotification = (message?: string) => {
  const dispatch = useSystemDispatch();
  useEffect(() => {
    if (message) dispatch({ type: "sendNotification", payload: message });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);
};
