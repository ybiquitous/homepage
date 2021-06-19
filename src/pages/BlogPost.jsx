import { useRef, useEffect } from "react";
import { Link } from "../Link";
import { Breadcrumb, Time, useTitle, useExternalLinkAsNewTab } from "../utils";
import s from "./BlogPost.css";
import "highlight.js/styles/xcode.css";

/**
 * @param {Element} target
 */
const addAnchor = (target) => {
  const anchor = document.createElement("a");
  anchor.href = `#${target.id}`;
  anchor.textContent = "#";
  anchor.classList.add(s.headingAnchor);
  target.insertAdjacentElement("beforeend", anchor);
};

/**
 * @param {Element} target
 */
const scrollToAnchor = (target) => {
  const { hash } = window.location;
  if (hash) {
    const heading = target.querySelector(decodeURIComponent(hash));
    if (heading) {
      heading.scrollIntoView({ behavior: "smooth" });
    }
  }
};

/**
 * @param {HTMLElement} content
 * @param {HTMLElement} toc
 */
const generateTOC = (content, toc) => {
  content.querySelectorAll("h2[id]").forEach((h2) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${h2.id}`;
    a.textContent = h2.textContent;
    li.appendChild(a);
    toc.appendChild(li);
  });
};

/**
 * @typedef {Object} Props
 * @property {string} title
 * @property {string | null} published
 * @property {string | null} lastUpdated
 * @property {string} author
 * @property {string[]} tags
 * @property {string} content
 */

/**
 * @param {Props} props
 */
// eslint-disable-next-line max-lines-per-function
export const BlogPost = ({ title, published, lastUpdated, tags, content }) => {
  useTitle(title, "Blog");
  useExternalLinkAsNewTab();

  /** @type {React.MutableRefObject<HTMLElement | null>} */
  const contentElement = useRef(null);
  /** @type {React.MutableRefObject<HTMLUListElement | null>} */
  const tocElement = useRef(null);

  useEffect(() => {
    const contentEl = contentElement.current;
    const tocEl = tocElement.current;
    if (contentEl && tocEl) {
      generateTOC(contentEl, tocEl);

      contentEl.querySelectorAll("h2[id],h3[id],h4[id],h5[id],h6[id]").forEach(addAnchor);
      scrollToAnchor(contentEl);
    }
  }, [contentElement, tocElement]);

  return (
    <>
      <header>
        <Breadcrumb links={[<Link href="/blog">Blog</Link>, `“${title}”`]} />
      </header>

      <main className={s.blog}>
        <div className={s.blogDate}>
          {published != null ? (
            <span>
              Published on <Time date={new Date(published)} />
            </span>
          ) : (
            <em>Unpublished</em>
          )}
          {lastUpdated != null && (
            <span>
              Last updated on <Time date={new Date(lastUpdated)} />
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

        <details className={s.blogToc}>
          <summary>Table of Contents</summary>
          <ul ref={tocElement} />
        </details>

        <article
          ref={contentElement}
          dangerouslySetInnerHTML={{ __html: content }}
          className={s.blogContent}
        />
      </main>
    </>
  );
};
