import React from "react";
import { Link } from "../router";
import { Breadcrumb, Time, useTitle } from "../utils";
import metadata from "~slides/metadata.yml";

export const Slides = () => {
  useTitle("ybiquitous slides");

  return (
    <>
      <header>
        <Breadcrumb links={[<Link href="/">Home</Link>, "Slides"]} />
      </header>

      <main>
        <h1 style={{ margin: "var(--space-s) 0 var(--space-xl)" }}>ybiquitous slides</h1>

        <h2 style={{ margin: "var(--space-m) 0", fontSize: "var(--font-size-h4)" }}>
          Recent slides
        </h2>

        <ul style={{ listStyle: "none", padding: "0", margin: "var(--space-l) 0" }}>
          {metadata
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map(({ id, title, date }) => (
              <li key={id} style={{ margin: "var(--space-m) 0" }}>
                <a
                  href={`/slides/${id}`}
                  target="_blank"
                  rel="noopener"
                  style={{ marginRight: "var(--space-m)" }}
                >
                  {title}
                </a>
                <Time date={date} />
              </li>
            ))}
        </ul>
      </main>
    </>
  );
};
