import { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "../Link";
import { Breadcrumb, CopyToClipboard, useTitle } from "../utils";
import { Navi } from "./BlogPost/Navi";
import { Tags } from "./BlogPost/Tags";
import { Times } from "./BlogPost/Times";

/**
 * @param {HTMLElement} content
 */
const generateCopyToClipboard = (content) => {
  content.querySelectorAll("pre").forEach((pre) => {
    // Insert a wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "relative";
    pre.replaceWith(wrapper);
    wrapper.appendChild(pre);

    // Insert a button
    const btnWrapper = document.createElement("div");
    btnWrapper.className = "absolute top-2 right-2";
    btnWrapper.hidden = true;
    wrapper.appendChild(btnWrapper);
    wrapper.onmouseenter = () => {
      btnWrapper.hidden = false;
    };
    wrapper.onmouseleave = () => {
      btnWrapper.hidden = true;
    };

    // Mount
    ReactDOM.render(<CopyToClipboard text={pre.textContent ?? ""} />, btnWrapper);
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
    setContent("");
    fetchContent(slug).then(setContent);
  }, [slug, fetchContent, setContent]);

  /** @type {React.MutableRefObject<HTMLElement | null>} */
  const contentElement = useRef(null);

  useEffect(() => {
    const contentEl = contentElement.current;

    if (contentEl != null) {
      generateCopyToClipboard(contentEl);
    }
  }, [slug, content, contentElement.current]); // eslint-disable-line react-hooks/exhaustive-deps -- Needed for DOM manipulations.

  return (
    <>
      <header>
        <Breadcrumb items={[{ el: <Link href="/blog">Blog</Link>, key: "Blog" }, `“${title}”`]} />
      </header>

      <main className="mt-10 lg:mt-16">
        <h1 className="font-sans font-semibold text-5xl leading-tight">{title}</h1>

        <div className="mt-4">
          <Times published={published} lastUpdated={lastUpdated} />
        </div>

        {/* eslint-disable react/no-danger -- This is safe. */}
        <article
          className="markdown mt-4"
          ref={contentElement}
          dangerouslySetInnerHTML={{
            __html: content || '<div class="my-text-secondary min-h-screen">Loading…</div>',
          }}
        />
        {/* eslint-enable react/no-danger */}

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
