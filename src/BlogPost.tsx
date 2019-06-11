import React from "react";
import { Link } from "./router";
import { Breadcrumb, Time, useTitle, useExternalLinkAsNewTab } from "./utils";
import styles from "./BlogPost.css";
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

      <main className={styles.blog}>
        <div className={styles.blogMetadata}>
          {published ? <Time date={published} /> : <em>Unpublished</em>}

          <span className={styles.blogAuthor}>{author}</span>
        </div>

        <article dangerouslySetInnerHTML={{ __html: content }} className={styles.blogContent} />

        <p className={styles.blogFooter}>
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
