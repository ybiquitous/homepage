import { useRef, useEffect } from "react";
import { Link } from "../Link";
import { Breadcrumb, Time, useTitle, useExternalLinkAsNewTab } from "../utils";
import s from "./BlogPost.module.css";

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
 * @property {{ path: string, title: string } | null} prev
 * @property {{ path: string, title: string } | null} next
 */

/**
 * @param {Props} props
 */
// eslint-disable-next-line max-lines-per-function
export const BlogPost = ({ title, published, lastUpdated, tags, content, prev, next }) => {
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
      window.scrollTo(0, 0);
      generateTOC(contentEl, tocEl);
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

        <nav className={s.prevNext}>
          {prev != null ? (
            <a className={s.prevNextLink} href={prev.path}>
              <span className={s.prevNextContent} title={`Previous: “${prev.title}”`}>
                {prev.title}
              </span>
            </a>
          ) : (
            <span />
          )}
          {next != null ? (
            <a className={s.prevNextLink} href={next.path}>
              <span className={s.prevNextContent} title={`Next: “${next.title}”`}>
                {next.title}
              </span>
            </a>
          ) : (
            <span />
          )}
        </nav>
      </main>
    </>
  );
};
