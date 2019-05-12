import React from "react";
import { Link } from "./router";
import { Breadcrumb, Time, useTitle } from "./utils";
import metadata from "./blog/metadata.yml";

export const Blog = () => {
  useTitle("ybiquitous blog");

  return (
    <>
      <header>
        <Breadcrumb links={[<Link href="/">Home</Link>, "Blog"]} />
      </header>

      <main>
        <h1 style={{ margin: "var(--space-s) 0 var(--space-xl)" }}>ybiquitous blog</h1>

        <h2 style={{ margin: "var(--space) 0", fontSize: "1.5rem" }}>Recent posts</h2>

        <ul style={{ listStyle: "none", padding: "0" }}>
          {metadata.map(({ id, title, published }: any) => (
            <li key={id}>
              <Link href={`/blog/${id}`} style={{ marginRight: "1em" }}>
                {title}
              </Link>
              <Time date={published} />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};
