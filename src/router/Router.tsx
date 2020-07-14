import React from "react";

export type Routes = {
  [key: string]: () => React.ReactElement;
};

type Props = {
  routes: Routes;
  currentPath: string;
};

export const Router = ({ routes, currentPath }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
  return (routes[currentPath] || routes["*"])();
};
