import React from "react";
import "./Breadcrumb.css";

export const Breadcrumb = ({ links }: { links: React.ReactNode[] }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb">
        {links.map((link, index) => (
          <li key={index} aria-current={index === links.length - 1 ? "page" : undefined}>
            {link}
          </li>
        ))}
      </ol>
    </nav>
  );
};
