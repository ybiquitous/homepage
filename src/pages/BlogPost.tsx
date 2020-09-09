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

const generateTOC = (content: HTMLElement, toc: HTMLElement) => {
  content.querySelectorAll("h2[id]").forEach((h2) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${h2.id}`;
    a.textContent = h2.textContent;
    li.appendChild(a);
    toc.appendChild(li);
  });
};

type Props = BlogMetadata & {
  content: string;
};

// eslint-disable-next-line max-lines-per-function
export const BlogPost = ({ title, published, lastUpdated, tags, content }: Props) => {
  useTitle(title, "Blog");
  useExternalLinkAsNewTab();

  const contentElement = useRef<HTMLElement>(null);
  const tocElement = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const contentEl = contentElement.current;
    const tocEl = tocElement.current;
    if (contentEl && tocEl) {
      generateTOC(contentEl, tocEl);

      content.querySelectorAll("h2[id],h3[id],h4[id],h5[id],h6[id]").forEach(addAnchor);
      scrollToAnchor(contentEl);
    }
  }, [contentElement, tocElement]);

  return (
    <>
      <header>
        <Breadcrumb links={[<Link href="/blog">Blog</Link>, `“${title}”`]} />
      </header>

      <main className={s.blog}>
        <details open className={s.blogToc}>
          <summary>Table of Contents</summary>
          <ul ref={tocElement} />
        </details>

        <div className={s.blogDate}>
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

        <div className={s.blogTags}>
          {tags.map((tag, index) => (
            <span className={s.blogTag} key={index}>
              {tag}
            </span>
          ))}
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
