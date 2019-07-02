import React from "react";
import { Link } from "../router";
import { Breadcrumb, Time, useTitle } from "../utils";
import metadata from "~blog/metadata.yml";
import s from "./Blog.css";

export const Blog = () => {
  useTitle("ybiquitous blog");

  return (
    <>
      <header>
        <Breadcrumb links={[<Link href="/">Home</Link>, "Blog"]} />
      </header>

      <main>
        <h1 className={s.title}>ybiquitous blog</h1>

        <h2 className={s.heading}>Recent posts</h2>

        <ul className={s.list}>
          {metadata
            .filter(({ published }) => published != null)
            .sort((a, b) => {
              if (a.published == null || b.published == null) {
                return 0;
              }
              return b.published.getTime() - a.published.getTime();
            })
            .map(({ id, title, published }) => (
              <li key={id} className={s.listItem}>
                <Link href={`/blog/${id}`} className={s.link}>
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
