import { useRef, useEffect } from "react";
import { Link } from "../Link";
import { Breadcrumb, useTitle } from "../utils";
import { Navi } from "./BlogPost/Navi";
import { Tags } from "./BlogPost/Tags";
import { Times } from "./BlogPost/Times";

/**
 * @param {HTMLElement} content
 * @param {HTMLElement} toc
 */
const generateTOC = (content, toc) => {
  content.querySelectorAll("h2[id]").forEach((heading) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    a.className = "inline-block truncate max-w-full hover:my-link-color";
    a.title = heading.textContent ?? "";
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
        <Breadcrumb items={[<Link href="/blog">Blog</Link>, `“${title}”`]} />
      </header>

      <main className="mt-12">
        <Times published={published} lastUpdated={lastUpdated} />

        {tags.length !== 0 && <Tags tags={tags} />}

        <details className="my-text-gray text-sm w-60 mt-4 2xl:mt-0 2xl:fixed 2xl:right-4">
          <summary>Table of Contents</summary>
          <ul ref={tocElement} className="space-y-4 mt-4" />
        </details>

        <article
          ref={contentElement}
          dangerouslySetInnerHTML={{ __html: content }}
          className="markdown"
        />

        <Navi prev={prev} next={next} />
      </main>
    </>
  );
};
