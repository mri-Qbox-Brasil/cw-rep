import { useEffect } from "react";

/**
 * Hook to listen for NUI events from the client
 * @param {string} action - The action name checking for (e.g., 'openTree')
 * @param {function} handler - The handler function to call when the action is received
 */
export const useNuiEvent = (action, handler) => {
  useEffect(() => {
    const eventListener = (event) => {
      const { data } = event;
      if (data && data.action === action) {
        handler(data.data);
      }
    };

    window.addEventListener("message", eventListener);

    return () => {
      window.removeEventListener("message", eventListener);
    };
  }, [action, handler]);
};
