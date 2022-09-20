import { useRef, useEffect, useState } from "react";
import { Breadcrumb } from "../components/Breadcrumb";
import { Link } from "../components/Link";
import { Tags } from "../components/Tags";
import { useTitle } from "../hooks/useTitle";
import { Navi } from "./BlogPost/Navi";
import { Times } from "./BlogPost/Times";
import { generateCopyToClipboard } from "./BlogPost/generateCopyToClipboard";
import { replaceSpeakerdeck } from "./BlogPost/replaceSpeakerdeck";
import { replaceTweet } from "./BlogPost/replaceTweet";

/**
 * @param {import("../blog/index").Blog} props
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
      // Remove ToC if no list items.
      const toc = contentEl.querySelector(".toc-wrapper");
      if (toc?.querySelectorAll("li").length === 0) {
        toc.remove();
      }

      generateCopyToClipboard(contentEl);
      replaceSpeakerdeck(contentEl);
      replaceTweet(contentEl);
    }
  }, [slug, content, contentElement.current]); // eslint-disable-line react-hooks/exhaustive-deps -- Needed for DOM manipulations.

  return (
    <>
      <header>
        <Breadcrumb items={[{ el: <Link href="/blog">Blog</Link>, key: "Blog" }, `“${title}”`]} />
      </header>

      <main className="mt-10 lg:mt-16">
        <h1 className="mb-12 text-4xl font-semibold leading-tight">{title}</h1>

        <Times published={published} lastUpdated={lastUpdated} />

        {/* eslint-disable react/no-danger -- This is safe. */}
        {content ? (
          <article
            className="markdown mt-4"
            ref={contentElement}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="my-text-secondary mt-8 min-h-screen italic">Loading…</div>
        )}
        {/* eslint-enable react/no-danger */}

        <div className="mt-4 text-right">
          <a href="#top">Top ⤴</a>
        </div>

        {tags.length !== 0 && (
          <div className="mt-4">
            <Tags tags={tags} />
          </div>
        )}

        <hr className="my-4" />

        <Navi prev={prev} next={next} />
      </main>
    </>
  );
};
