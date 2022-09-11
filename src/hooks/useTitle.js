import { useEffect } from "react";

const base = "@ybiquitous";
const separator = " - ";

/**
 * @param {ReadonlyArray<string | null | undefined>} title
 * @returns {void}
 */
export const useTitle = (...title) => {
  useEffect(() => {
    document.title = title.length === 0 ? base : [...title, base].filter(Boolean).join(separator);
  }, [title]);
};
