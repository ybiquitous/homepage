import React from "react";
import styles from "./Breadcrumb.css";

export const Breadcrumb = ({ links }: { links: React.ReactNode[] }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={styles.breadcrumb}>
        {links.map((link, index) => (
          <li
            key={index}
            aria-current={index === links.length - 1 ? "page" : undefined}
            className={styles.breadcrumbItem}
          >
            {link}
          </li>
        ))}
      </ol>
    </nav>
  );
};
