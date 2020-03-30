import React from "react";

export type Routes = {
  [key: string]: () => React.ReactElement;
};

type Props = {
  routes: Routes;
  currentPath: string;
};

export const Router = ({ routes, currentPath }: Props) => {
  return (routes[currentPath] || routes["*"])();
};
