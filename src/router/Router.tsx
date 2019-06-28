import React from "react";

// eslint-disable-next-line import/exports-last
export interface Routes {
  [key: string]: () => React.ReactElement;
}

interface Props {
  routes: Routes;
  currentPath: string;
}

export const Router = ({ routes, currentPath }: Props) => {
  return (routes[currentPath] || routes["*"])();
};
