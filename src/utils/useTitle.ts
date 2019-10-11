import { useEffect } from "react";

const base = "@ybiquitous";
const separator = " - ";

export const useTitle = (...title: string[]): void => {
  useEffect(() => {
    document.title = title.length === 0 ? base : [...title, base].join(separator);
  }, [title]);
};
