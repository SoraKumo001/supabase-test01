import { useEffect } from "react";
import { useSystemDispatch } from "./useSystemDispatch";

export const useLoading = (states: (string | boolean)[]) => {
  const dispatch = useSystemDispatch();
  const loading = states.some((s) => s === "progress" || s === true);
  useEffect(() => {
    if (loading) {
      dispatch({ type: "setLoading", payload: true });
      return () => dispatch({ type: "setLoading", payload: false });
    }
  }, [dispatch, loading]);
};
