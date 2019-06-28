import React from "react";
import { Link } from "../router";
import { Breadcrumb, Time, useTitle } from "../utils";
import metadata from "~blog/metadata.yml";

export const Blog = () => {
  useTitle("ybiquitous blog");

  return (
    <>
      <header>
        <Breadcrumb links={[<Link href="/">Home</Link>, "Blog"]} />
      </header>

      <main>
        <h1 style={{ margin: "var(--space-s) 0 var(--space-xl)" }}>ybiquitous blog</h1>

        <h2 style={{ margin: "var(--space-m) 0", fontSize: "var(--font-size-h4)" }}>
          Recent posts
        </h2>

        <ul style={{ listStyle: "none", padding: "0", margin: "var(--space-l) 0" }}>
          {metadata
            .filter(({ published }) => published != null)
            .sort((a, b) => {
              if (a.published == null || b.published == null) {
                return 0;
              }
              return b.published.getTime() - a.published.getTime();
            })
            .map(({ id, title, published }) => (
              <li key={id} style={{ margin: "var(--space-m) 0" }}>
                <Link href={`/blog/${id}`} style={{ marginRight: "var(--space-m)" }}>
                  {title}
                </Link>
                {published && <Time date={published} />}
              </li>
            ))}
        </ul>
      </main>
    </>
  );
};
