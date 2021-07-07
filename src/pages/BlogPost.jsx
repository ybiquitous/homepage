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
 * @param {{
 *   slug: string,
 *   title: string,
 *   published: string | null,
 *   lastUpdated: string | null,
 *   author: string,
 *   tags: string[],
 *   content: string,
 *   prev: { path: string, title: string } | null,
 *   next: { path: string, title: string } | null,
 * }} props
 */
// eslint-disable-next-line max-lines-per-function
export const BlogPost = ({ slug, title, published, lastUpdated, tags, content, prev, next }) => {
  useTitle(title, "Blog");

  /** @type {React.MutableRefObject<HTMLElement | null>} */
  const contentElement = useRef(null);
  /** @type {React.MutableRefObject<HTMLUListElement | null>} */
  const tocElement = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (contentElement.current && tocElement.current) {
      generateTOC(contentElement.current, tocElement.current);
    }
    return () => {
      if (tocElement.current) {
        tocElement.current.innerHTML = ""; // clear
      }
    };
  }, [slug, contentElement.current, tocElement.current]);

  return (
    <>
      <header>
        <Breadcrumb items={[<Link href="/blog">Blog</Link>, `“${title}”`]} />
      </header>

      <main className="mt-12">
        <Times published={published} lastUpdated={lastUpdated} />

        {tags.length !== 0 && <Tags tags={tags} />}

        <details className="text-sm w-60 mt-4 2xl:mt-0 2xl:fixed 2xl:right-4">
          <summary>Table of Contents</summary>
          <ul ref={tocElement} className="my-text-gray space-y-4 mt-4" />
        </details>

        <article
          ref={contentElement}
          dangerouslySetInnerHTML={{ __html: content }}
          className="markdown mt-12"
        />

        <hr className="mt-24 mb-4" />

        <Navi prev={prev} next={next} />
      </main>
    </>
  );
};
