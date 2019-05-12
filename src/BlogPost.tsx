import React from "react";
import { Link } from "./router";
import { Breadcrumb, Time, useTitle, useExternalLinkAsNewTab } from "./utils";
import "./BlogPost.css";

interface Props extends BlogMetadata {
  content: string;
}

export const BlogPost = ({ title, published, modified, content }: Props) => {
  useTitle(`${title} - ybiquitous blog`);
  useExternalLinkAsNewTab();

  const dateStyle = { fontSize: "inherit", color: "currentColor" };

  return (
    <>
      <header>
        <Breadcrumb
          links={[<Link href="/">Home</Link>, <Link href="/blog">Blog</Link>, `“${title}”`]}
        />
      </header>

      <main>
        <div className="blog-dates">
          {published && (
            <div>
              Published on <Time date={published} style={dateStyle} />
            </div>
          )}
          {modified && (
            <div>
              Modified on <Time date={modified} style={dateStyle} />
            </div>
          )}
        </div>

        <article dangerouslySetInnerHTML={{ __html: content }} className="blog-content" />
      </main>
    </>
  );
};
