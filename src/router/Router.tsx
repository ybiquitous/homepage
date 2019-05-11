import React from "react";

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
