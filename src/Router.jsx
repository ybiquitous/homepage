import { useEffect, useState } from "react";
import { routes, defaultRoute } from "./routes.jsx";

export const Router = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setCurrentPath]);

  return (routes.get(currentPath) ?? defaultRoute)();
};
