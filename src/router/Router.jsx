/**
 * @param {{ routes: Record<string, () => React.ReactElement>, currentPath: string }} props
 */
export const Router = ({ routes, currentPath }) =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
  (routes[currentPath] || routes["*"])();
