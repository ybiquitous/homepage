import React from "react";
import { Link } from "./router";
import { Breadcrumb, Time, useTitle, useExternalLinkAsNewTab } from "./utils";
import "./BlogPost.css";
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

      <main className="blog">
        <div className="blog-metadata">
          {published && <Time date={published} />}

          <span className="blog-author">{author}</span>
        </div>

        <article dangerouslySetInnerHTML={{ __html: content }} className="blog-content" />

        <p className="blog-footer">
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
