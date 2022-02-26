import { useEffect } from "react";

/**
 * @param {() => void} callback
 * @returns {void}
 */
export const useMount = (callback) => {
  useEffect(() => {
    callback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
