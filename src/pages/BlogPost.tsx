import React, { useRef, useEffect } from "react";
import { Link } from "../router";
import { Breadcrumb, Time, useTitle, useExternalLinkAsNewTab } from "../utils";
import s from "./BlogPost.css";
import "highlight.js/styles/xcode.css";

const addAnchor = (target: Element) => {
  const anchor = document.createElement("a");
  anchor.href = `#${target.id}`;
  anchor.textContent = "#";
  anchor.classList.add(s.headingAnchor);
  target.insertAdjacentElement("beforeend", anchor);
};

const scrollToAnchor = (target: Element) => {
  const { hash } = window.location;
  if (hash) {
    const heading = target.querySelector(decodeURIComponent(hash));
    if (heading) {
      heading.scrollIntoView({ behavior: "smooth" });
    }
  }
};

interface Props extends BlogMetadata {
  content: string;
}

export const BlogPost = ({ title, published, lastUpdated, author, content }: Props) => {
  useTitle(`${title} - ybiquitous blog`);
  useExternalLinkAsNewTab();

  const contentElement = useRef<HTMLElement>(null);
  useEffect(() => {
    const target = contentElement.current;
    if (target) {
      target.querySelectorAll("h2[id],h3[id],h4[id],h5[id],h6[id]").forEach(addAnchor);
      scrollToAnchor(target);
    }
  }, [contentElement]);

  return (
    <>
      <header>
        <Breadcrumb links={[<Link href="/">Home</Link>, <Link href="/blog">Blog</Link>]} />
      </header>

      <main className={s.blog}>
        <div className={s.blogMetadata}>
          {published ? <Time date={published} /> : <em>Unpublished</em>}

          <span className={s.blogAuthor}>{author}</span>
        </div>

        <article
          ref={contentElement}
          dangerouslySetInnerHTML={{ __html: content }}
          className={s.blogContent}
        />

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
