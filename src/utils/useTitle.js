import { useEffect } from "react";

const base = "@ybiquitous";
const separator = " - ";

/**
 * @param {readonly string[]} title
 * @returns {void}
 */
export const useTitle = (...title) => {
  useEffect(() => {
    document.title = title.length === 0 ? base : [...title, base].join(separator);
  }, [title]);
};
