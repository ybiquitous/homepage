import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

import remarkRemoveH1 from "./remark-remove-h1.js";
import remarkRelativeLink from "./remark-relative-link.js";

export default async function remarkLoader(source) {
  const transformed = await unified()
    .use(remarkParse)
    .use(remarkRemoveH1)
    .use(remarkRelativeLink)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "append" })
    .use(rehypeExternalLinks)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(source);

  return `export default ${JSON.stringify(String(transformed))};`;
}
