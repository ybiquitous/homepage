import rehypeToc from "@jsdevtools/rehype-toc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { remarkAlert } from "remark-github-blockquote-alert";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import remarkRelativeLink from "./remark-relative-link.js";
import remarkRemoveH1 from "./remark-remove-h1.js";
import remarkSpeakerdeck from "./remark-speakerdeck.js";
import remarkTwitter from "./remark-twitter.js";
import remarkYoutube from "./remark-youtube.js";

/** @type {import("webpack").LoaderDefinitionFunction} */
export default async function remarkLoader(source) {
  const transformed = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkRemoveH1)
    .use(remarkRelativeLink)
    .use(remarkGfm)
    .use(remarkAlert)
    .use(remarkSpeakerdeck)
    .use(remarkTwitter)
    .use(remarkYoutube)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeToc, {
      headings: ["h2"],
      customizeTOC(toc) {
        return {
          type: "element",
          tagName: "details",
          properties: {
            class: "toc-wrapper",
          },
          children: [
            {
              type: "element",
              tagName: "summary",
              properties: {
                class: "toc-summary",
              },
              children: [{ type: "text", value: "Table of Contents" }],
            },
            toc,
          ],
        };
      },
    })
    .use(rehypeAutolinkHeadings, { behavior: "append" })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(source);

  return `export default ${JSON.stringify(String(transformed))};`;
}
