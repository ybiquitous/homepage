import { useRef, useEffect, useState } from "react";
import { Breadcrumb } from "../components/Breadcrumb";
import { Link } from "../components/Link";
import { Tags } from "../components/Tags";
import { Title } from "../components/Title";
import { Navi } from "./BlogPost/Navi";
import { Times } from "./BlogPost/Times";
import { generateCopyToClipboard } from "./BlogPost/generateCopyToClipboard";
import { replaceTweet } from "./BlogPost/replaceTweet";

/**
 * @param {import("../blog/index.js").BlogPost} props
 */
// eslint-disable-next-line max-lines-per-function
export const BlogPost = ({
  slug,
  year,
  title,
  published,
  lastUpdated,
  author,
  tags,
  content: fetchContent,
  prev,
  next,
}) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setContent("");
    fetchContent(slug).then(setContent);
  }, [slug, fetchContent, setContent]);

  /** @type {React.RefObject<HTMLElement | null>} */
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
      replaceTweet(contentEl);

      // Scroll to heading when hash is present.
      const { hash } = window.location;
      if (hash) {
        const id = decodeURIComponent(hash.slice(1));
        const el = document.querySelector(`[id="${id}"]`);
        el?.scrollIntoView();
      }
    }
  }, [slug, content, contentElement.current]); // eslint-disable-line react-hooks/exhaustive-deps -- Needed for DOM manipulations.

  return (
    <>
      <Title content={[title, "Blog"]} />

      <header>
        <Breadcrumb
          items={[
            { el: <Link href="/blog">Blog</Link>, key: "Blog" },
            { el: <Link href={`/blog/${year}`}>{year}</Link>, key: `Blog ${year}` },
            `“${title}”`,
          ]}
        />
      </header>

      <main className="mt-10 lg:mt-16">
        <h1 className="mb-12 text-4xl leading-tight font-semibold">{title}</h1>

        <div className="my-text-secondary flex flex-wrap gap-x-8 text-sm">
          <Times published={published} lastUpdated={lastUpdated} />
          <address>{`by ${author}`}</address>
        </div>

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
