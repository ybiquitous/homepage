import type React from "react";

export type Routes = Record<string, () => React.ReactElement>;

type Props = {
  routes: Routes;
  currentPath: string;
};

export const Router = ({ routes, currentPath }: Props) =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
  (routes[currentPath] || routes["*"])();
