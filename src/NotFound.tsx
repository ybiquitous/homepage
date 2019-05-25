import React, { useEffect } from "react";
import { useTitle } from "./utils";

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
      <h1 style={{ fontSize: "calc(var(--font-size-h1) * 2)" }}>Page Not Found</h1>
    </main>
  );
};
