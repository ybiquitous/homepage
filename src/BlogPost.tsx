import React from "react";
import { Link } from "./router";
import { Breadcrumb, Time, useTitle } from "./utils";
import "./BlogPost.css";

interface Props {
  title: string;
  published: Date;
  modified: Date | null;
  content: string;
}

export const BlogPost = ({ title, published, modified, content }: Props) => {
  useTitle(`${title} - ybiquitous blog`);

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
          <div>
            Published on <Time date={published} style={dateStyle} />
          </div>
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
