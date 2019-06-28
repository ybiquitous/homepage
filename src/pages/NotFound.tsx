import React, { useEffect } from "react";
import { useTitle } from "../utils";

export const NotFound = () => {
  useEffect(() => {
    const saved = document.body.style.textAlign;
    document.body.style.textAlign = "center";

    return () => {
      document.body.style.textAlign = saved;
    };
  }, []);

  useTitle("Page Not Found");

  return (
    <main>
      <h1 style={{ fontSize: "calc(var(--font-size-h1) * 1.5)" }}>Ooops!</h1>

      <p style={{ fontSize: "var(--font-size-l)" }}>Sorry, the page not found.</p>

      <p>
        <a href="/">← Back to Home</a>
      </p>
    </main>
  );
};
