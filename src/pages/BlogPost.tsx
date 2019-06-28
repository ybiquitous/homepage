import React from "react";
import { Link } from "../router";
import { Breadcrumb, Time, useTitle, useExternalLinkAsNewTab } from "../utils";
import s from "./BlogPost.css";
import "highlight.js/styles/xcode.css";

interface Props extends BlogMetadata {
  content: string;
}

export const BlogPost = ({ title, published, lastUpdated, author, content }: Props) => {
  useTitle(`${title} - ybiquitous blog`);
  useExternalLinkAsNewTab();

  return (
    <>
      <header>
        <Breadcrumb
          links={[<Link href="/">Home</Link>, <Link href="/blog">Blog</Link>, `“${title}”`]}
        />
      </header>

      <main className={s.blog}>
        <div className={s.blogMetadata}>
          {published ? <Time date={published} /> : <em>Unpublished</em>}

          <span className={s.blogAuthor}>{author}</span>
        </div>

        <article dangerouslySetInnerHTML={{ __html: content }} className={s.blogContent} />

        <p className={s.blogFooter}>
          {lastUpdated && (
            <>
              Last updated on <Time date={lastUpdated} />
            </>
          )}
        </p>
      </main>
    </>
  );
};
