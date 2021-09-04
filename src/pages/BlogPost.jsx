import { useRef, useEffect, useState } from "react";
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
 *   content: (slug: string) => Promise<string>,
 *   prev: { path: string, title: string } | null,
 *   next: { path: string, title: string } | null,
 * }} props
 */
// eslint-disable-next-line max-lines-per-function
export const BlogPost = ({
  slug,
  title,
  published,
  lastUpdated,
  tags,
  content: fetchContent,
  prev,
  next,
}) => {
  useTitle(title, "Blog");

  const [content, setContent] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchContent(slug).then(setContent);
  }, [slug, content]);

  /** @type {React.MutableRefObject<HTMLElement | null>} */
  const contentElement = useRef(null);
  /** @type {React.MutableRefObject<HTMLUListElement | null>} */
  const tocElement = useRef(null);

  useEffect(() => {
    const contentEl = contentElement.current;
    const tocEl = tocElement.current;
    if (contentEl != null) {
      contentEl.querySelectorAll("h1").forEach((el) => el.remove());
    }

    if (contentEl != null && tocEl != null) {
      generateTOC(contentEl, tocEl);
    }
    return () => {
      if (tocEl != null) {
        tocEl.innerHTML = ""; // clear
      }
    };
  }, [slug, content, contentElement.current, tocElement.current]);

  return (
    <>
      <header>
        <Breadcrumb items={[<Link href="/blog">Blog</Link>, `“${title}”`]} />
      </header>

      <main className="mt-16">
        <h1 className="font-sans font-semibold text-5xl leading-tight">{title}</h1>

        <div className="mt-4">
          <Times published={published} lastUpdated={lastUpdated} />
        </div>

        <details className="my-text-gray text-sm w-60 mt-4 2xl:mt-0 2xl:fixed 2xl:right-4">
          <summary>Table of Contents</summary>
          <ul ref={tocElement} className="space-y-2 mt-4" />
        </details>

        <article
          ref={contentElement}
          dangerouslySetInnerHTML={{ __html: content }}
          className="markdown mt-16"
        />

        {tags.length !== 0 && (
          <div className="mt-16">
            <Tags tags={tags} />
          </div>
        )}

        <hr className="mt-8 mb-4" />

        <Navi prev={prev} next={next} />
      </main>
    </>
  );
};
