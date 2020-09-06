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

type Props = BlogMetadata & {
  content: string;
};

export const BlogPost = ({ title, published, lastUpdated, content }: Props) => {
  useTitle(title, "Blog");
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
        <Breadcrumb links={[<Link href="/blog">Blog</Link>, `“${title}”`]} />
      </header>

      <main className={s.blog}>
        <div className={s.blogMetadata}>
          {published ? (
            <span>
              Published on <Time date={published} />
            </span>
          ) : (
            <em>Unpublished</em>
          )}
          {lastUpdated && (
            <span>
              Last updated on <Time date={lastUpdated} />
            </span>
          )}
        </div>

        <article
          ref={contentElement}
          dangerouslySetInnerHTML={{ __html: content }}
          className={s.blogContent}
        />
      </main>
    </>
  );
};
