import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Router } from "./router";
import { routes } from "./routes";

const Footer = () => (
  <footer>
    <p>
      <small>© Masafumi Koba</small>
    </p>
  </footer>
);

const Index = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const popStateListener = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", popStateListener);
    return () => window.removeEventListener("popstate", popStateListener);
  }, []);

  return (
    <>
      <Router routes={routes} currentPath={currentPath} />
      <Footer />
    </>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
